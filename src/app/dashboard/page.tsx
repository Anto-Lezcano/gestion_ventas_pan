import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "./components/DashboardClient";
import { getOrders, getBreads, seedBreads } from "../actions/order";
import { getExpenses } from "../actions/expense";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const agentName = cookieStore.get("agentName")?.value;

  if (!agentName) {
    redirect("/");
  }

  // Asegurarnos de que haya panes
  await seedBreads();

  const breads = await getBreads();
  const orders = await getOrders();
  const expenses = await getExpenses();

  return (
    <DashboardClient initialOrders={orders} initialExpenses={expenses} breads={breads} agentName={agentName} />
  );
}
