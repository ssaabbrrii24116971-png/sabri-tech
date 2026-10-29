/**
 * 📡 Relais Meta Conversions API pour l'application mobile SABRI TECH.
 *
 * L'app envoie des événements simples (nom, identifiant, produits + quantités).
 * Le serveur :
 *  - n'accepte que les événements e-commerce prévus,
 *  - recalcule les montants à partir du catalogue (on ne fait pas confiance aux prix envoyés),
 *  - ajoute l'IP et le navigateur du client, puis transmet à Meta avec la clé secrète.
 *
 * Variables d'environnement (Vercel → Settings → Environment Variables) :
 *  - META_CAPI_ACCESS_TOKEN   (secret, jamais en NEXT_PUBLIC_)
 *  - NEXT_PUBLIC_META_PIXEL_ID ou META_DATASET_ID
 *  - META_TEST_EVENT_CODE     (facultatif : onglet « Tester les événements »)
 *  - META_CAPI_DRY_RUN=1      (facultatif : renvoie le payload sans rien envoyer à Meta)
 */
import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";
import { getProductById } from "@/lib/catalog";
import { shippingFor } from "@/lib/format";

const GRAPH_VERSION = process.env.META_GRAPH_VERSION?.trim() || "v26.0";
const MAX_BODY_BYTES = 8_000;
const EVENT_NAMES = ["PageView", "ViewContent", "AddToCart", "InitiateCheckout", "Purchase"] as const;
type EventName = (typeof EVENT_NAMES)[number];

const ID_RE = /^[A-Za-z0-9_-]{8,64}$/;
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

type Device = {
  os: "ios" | "android";
  osVersion: string;
  appVersion: string;
  bundleId: string;
  model: string;
  locale: string;
  timezone: string;
  screenWidth: number;
  screenHeight: number;
  density: number;
};

type IncomingEvent = { name: EventName; eventId: string; contents: { id: string; quantity: number }[]; screen?: string };

const str = (v: unknown, max = 64) => (typeof v === "string" ? v.slice(0, max) : "");
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);
const toAdCurrency = (tnd: number) => Math.round(tnd * siteConfig.metaPixel.rateFromTND * 100) / 100;

function parseDevice(raw: unknown): Device | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  if (d.os !== "ios" && d.os !== "android") return null;
  return {
    os: d.os,
    osVersion: str(d.osVersion, 32),
    appVersion: str(d.appVersion, 32),
    bundleId: str(d.bundleId, 128),
    model: str(d.model, 64),
    locale: str(d.locale, 16),
    timezone: str(d.timezone, 64),
    screenWidth: Math.round(num(d.screenWidth)),
    screenHeight: Math.round(num(d.screenHeight)),
    density: num(d.density),
  };
}

function parseEvent(raw: unknown): IncomingEvent | null {
  if (!raw || typeof raw !== "object") return null;
  const e = raw as Record<string, unknown>;
  if (!EVENT_NAMES.includes(e.name as EventName) || typeof e.eventId !== "string" || !ID_RE.test(e.eventId)) return null;
  const contents = (Array.isArray(e.contents) ? e.contents : [])
    .slice(0, 20)
    .map((c) => ({ id: str((c as Record<string, unknown>)?.id, 32), quantity: Math.floor(num((c as Record<string, unknown>)?.quantity)) }))
    .filter((c) => getProductById(c.id) && c.quantity >= 1 && c.quantity <= 99);
  return { name: e.name as EventName, eventId: e.eventId, contents, screen: str(e.screen, 40) || undefined };
}

/** custom_data calculé côté serveur à partir du catalogue. */
function customData(event: IncomingEvent): Record<string, unknown> | undefined {
  if (event.name === "PageView") return event.screen ? { content_name: event.screen } : undefined;
  if (event.contents.length === 0) return undefined;

  const lines = event.contents.map((c) => ({ product: getProductById(c.id)!, quantity: c.quantity }));
  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
  const valueTnd =
    event.name === "InitiateCheckout" || event.name === "Purchase" ? subtotal + shippingFor(subtotal) : subtotal;

  return {
    currency: siteConfig.metaPixel.currency,
    value: toAdCurrency(valueTnd),
    content_type: "product",
    content_ids: lines.map((l) => l.product.id),
    contents: lines.map((l) => ({ id: l.product.id, quantity: l.quantity, item_price: toAdCurrency(l.product.price) })),
    num_items: lines.reduce((n, l) => n + l.quantity, 0),
    ...(lines.length === 1 ? { content_name: lines[0].product.name } : {}),
  };
}

/** Tableau extinfo exigé par Meta pour les événements d'application (16 valeurs, ordre imposé). */
function extinfo(d: Device): string[] {
  return [
    d.os === "ios" ? "i2" : "a2",
    d.bundleId,
    d.appVersion,
    d.appVersion,
    d.osVersion,
    d.model,
    d.locale,
    "",
    "",
    d.screenWidth ? String(d.screenWidth) : "",
    d.screenHeight ? String(d.screenHeight) : "",
    d.density ? d.density.toFixed(2) : "",
    "",
    "",
    "",
    d.timezone,
  ];
}

function clientIp(req: Request): string | undefined {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || req.headers.get("x-real-ip") || undefined;
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: Request) {
  const token = process.env.META_CAPI_ACCESS_TOKEN?.trim();
  const datasetId = (process.env.META_DATASET_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID || "").trim();
  const dryRun = process.env.META_CAPI_DRY_RUN === "1";

  const text = await req.text();
  if (text.length > MAX_BODY_BYTES) return NextResponse.json({ error: "payload_too_large" }, { status: 413, headers: corsHeaders });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400, headers: corsHeaders });
  }

  const device = parseDevice(body.device);
  const anonId = typeof body.anonId === "string" && ID_RE.test(body.anonId) ? body.anonId : null;
  const events = (Array.isArray(body.events) ? body.events : []).slice(0, 10).map(parseEvent).filter((e): e is IncomingEvent => e !== null);
  if (!device || !anonId || events.length === 0) {
    return NextResponse.json({ error: "invalid_event" }, { status: 400, headers: corsHeaders });
  }

  const now = Math.floor(Date.now() / 1000);
  const ip = clientIp(req);
  const userAgent = req.headers.get("user-agent")?.slice(0, 512);
  const payload = {
    data: events.map((e) => {
      const custom = customData(e);
      return {
        event_name: e.name,
        event_time: now,
        event_id: e.eventId,
        action_source: "app",
        user_data: { anon_id: anonId, ...(ip ? { client_ip_address: ip } : {}), ...(userAgent ? { client_user_agent: userAgent } : {}) },
        app_data: {
          // Aucune demande de consentement au suivi publicitaire (ATT) dans l'app : suivi publicitaire désactivé.
          advertiser_tracking_enabled: 0,
          application_tracking_enabled: 1,
          extinfo: extinfo(device),
        },
        ...(custom ? { custom_data: custom } : {}),
      };
    }),
    ...(process.env.META_TEST_EVENT_CODE ? { test_event_code: process.env.META_TEST_EVENT_CODE } : {}),
  };

  if (dryRun) return NextResponse.json({ sent: false, dryRun: true, payload }, { headers: corsHeaders });
  // Pas configuré : on accepte sans rien envoyer, pour que l'app ne voie jamais d'erreur.
  if (!token || !/^\d{6,20}$/.test(datasetId)) return new NextResponse(null, { status: 204, headers: corsHeaders });

  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${datasetId}/events?access_token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      console.error("[Meta CAPI]", res.status, (await res.text()).slice(0, 500));
      return NextResponse.json({ sent: false }, { status: 502, headers: corsHeaders });
    }
    return NextResponse.json({ sent: true, events: events.length }, { headers: corsHeaders });
  } catch (err) {
    console.error("[Meta CAPI] échec de l'envoi", err instanceof Error ? err.message : err);
    return NextResponse.json({ sent: false }, { status: 502, headers: corsHeaders });
  }
}
