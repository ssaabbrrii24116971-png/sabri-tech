import type { Metadata } from "next";
import { OrderForm } from "@/components/cart/OrderForm";
import { t } from "@/i18n";

export const metadata: Metadata = { title: t.order.title, robots: { index: false } };

export default function CartPage() {
  return <OrderForm />;
}
