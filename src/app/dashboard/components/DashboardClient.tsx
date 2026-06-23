"use client";

import { useState, useMemo } from "react";
import { Plus, AlertTriangle, LogOut, ListOrdered, TrendingDown, Receipt, Search } from "lucide-react";
import AddOrderModal from "./AddOrderModal";
import OrderBoard from "./OrderBoard";
import AddExpenseModal from "./AddExpenseModal";
import ExpensesModal from "./ExpensesModal";
import AddBreadModal from "./AddBreadModal";
import { calculateOrderTotal } from "../../utils/price";
import { useRouter } from "next/navigation";

export default function DashboardClient({ initialOrders, initialExpenses, breads, agentName }: any) {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isExpensesModalOpen, setIsExpensesModalOpen] = useState(false);
  const [isAddBreadOpen, setIsAddBreadOpen] = useState(false);
  
  const [orderToEdit, setOrderToEdit] = useState<any>(null);
  const [expenseToEdit, setExpenseToEdit] = useState<any>(null);
  
  const [filterBread, setFilterBread] = useState("ALL");
  const [filterDelivery, setFilterDelivery] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleEditOrder = (order: any) => {
    setOrderToEdit(order);
    setIsOrderModalOpen(true);
  };

  const handleCloseOrderModal = () => {
    setIsOrderModalOpen(false);
    setOrderToEdit(null);
  };

  const handleEditExpense = (expense: any) => {
    setExpenseToEdit(expense);
    setIsAddExpenseOpen(true);
  };

  const handleCloseExpenseModal = () => {
    setIsAddExpenseOpen(false);
    setExpenseToEdit(null);
  };

  const orders = useMemo(() => {
    return initialOrders.filter((o: any) => {
      if (filterBread !== "ALL" && !o.items.some((i: any) => i.breadId === filterBread)) return false;
      if (filterDelivery === "DELIVERY" && !o.isDelivery) return false;
      if (filterDelivery === "PICKUP" && o.isDelivery) return false;
      if (filterStatus !== "ALL" && o.status !== filterStatus) return false;
      if (searchQuery.trim() !== "" && !o.titular.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [initialOrders, filterBread, filterDelivery, filterStatus, searchQuery]);

  const pendingDeliveryPrice = useMemo(() => {
    return orders.some((o: any) => o.isDelivery && o.deliveryCost === null && o.status !== "ENTREGADO");
  }, [orders]);

  const stats = useMemo(() => {
    let collectedBread = 0, pendingBread = 0;
    let collectedDelivery = 0, pendingDelivery = 0;

    orders.forEach((o: any) => {
      const breadTotal = o.items ? calculateOrderTotal(o.items) : 0;
      const deliveryTotal = o.deliveryCost || 0;

      if (o.isPaid) {
        collectedBread += breadTotal;
        collectedDelivery += deliveryTotal;
      } else {
        pendingBread += breadTotal;
        pendingDelivery += deliveryTotal;
      }
    });

    return { collectedBread, pendingBread, collectedDelivery, pendingDelivery };
  }, [orders]);

  const productionCount = useMemo(() => {
    const counts: Record<string, { name: string, qty: number }> = {};
    initialOrders.forEach((o: any) => {
      if (o.status === "PEDIDO" || o.status === "EN_PROCESO") {
        if (o.items) {
          o.items.forEach((item: any) => {
            const key = `${item.breadId}-${item.flavor || 'none'}`;
            if (!counts[key]) {
              const flavorText = item.flavor ? ` (${item.flavor})` : '';
              counts[key] = { name: item.bread.name + flavorText, qty: 0 };
            }
            counts[key].qty += item.quantity;
          });
        }
      }
    });
    return Object.values(counts);
  }, [initialOrders]);

  const handleLogout = () => {
    document.cookie = "agentName=; Max-Age=0; path=/;";
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-100 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Dashboard de Pedidos</h1>
            <p className="text-slate-500 mt-1">Hola, <span className="capitalize font-semibold text-orange-500">{agentName}</span></p>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button onClick={handleLogout} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors font-medium text-sm">
              <LogOut className="w-4 h-4" /> Salir
            </button>
            <button 
              onClick={() => setIsExpensesModalOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors font-medium text-sm border border-rose-100"
            >
              <Receipt className="w-4 h-4" /> Ver Gastos
            </button>
            <button 
              onClick={() => { setExpenseToEdit(null); setIsAddExpenseOpen(true); }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-colors font-medium text-sm shadow-md shadow-rose-200"
            >
              <TrendingDown className="w-4 h-4" /> Cargar Gasto
            </button>
            <button 
              onClick={() => setIsAddBreadOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-xl transition-colors font-medium text-sm border border-amber-200"
            >
              <Plus className="w-4 h-4" /> Nuevo Pan
            </button>
          </div>
        </div>

        {/* Resumen de Producción */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <ListOrdered className="w-5 h-5 text-indigo-500" />
            Resumen de Producción (Pedidos y En Proceso)
          </h2>
          {productionCount.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {productionCount.map(item => (
                <div key={item.name} className="bg-indigo-50 border border-indigo-100 px-5 py-3 rounded-2xl flex items-center gap-3">
                  <span className="text-2xl font-bold text-indigo-600">{item.qty}</span>
                  <span className="text-indigo-900 font-medium">{item.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">No hay panes pendientes de producción.</p>
          )}
        </div>

        {/* Alertas */}
        {pendingDeliveryPrice && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 sm:px-6 sm:py-4 rounded-2xl flex items-start sm:items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
            <p className="font-medium text-sm sm:text-base">Atención: Tienes pedidos con envío pendiente que aún no tienen costo asignado.</p>
          </div>
        )}

        {/* Filtros y Tablero */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-100">
          
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* Buscador */}
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Buscar cliente por nombre..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                />
              </div>

              {/* Botón Añadir Pedido */}
              <button 
                onClick={() => { setOrderToEdit(null); setIsOrderModalOpen(true); }}
                className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-95 text-sm"
              >
                <Plus className="w-5 h-5" /> Añadir Pedido
              </button>
            </div>

            {/* Filtros */}
            <div className="flex flex-col lg:flex-row flex-wrap items-start lg:items-center gap-4">
              <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl w-full lg:w-auto gap-1">
                <button 
                  onClick={() => setFilterStatus("ALL")}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap text-center ${filterStatus === 'ALL' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Todos
                </button>
                <button 
                  onClick={() => setFilterStatus("PEDIDO")}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap text-center ${filterStatus === 'PEDIDO' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
                >
                  Pedido
                </button>
                <button 
                  onClick={() => setFilterStatus("EN_PROCESO")}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap text-center ${filterStatus === 'EN_PROCESO' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500 hover:text-orange-600'}`}
                >
                  En Proceso
                </button>
                <button 
                  onClick={() => setFilterStatus("TERMINADO")}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap text-center ${filterStatus === 'TERMINADO' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-500 hover:text-purple-600'}`}
                >
                  Terminado
                </button>
                <button 
                  onClick={() => setFilterStatus("ENTREGADO")}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap text-center ${filterStatus === 'ENTREGADO' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-emerald-600'}`}
                >
                  Entregado
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <select 
                  className="bg-slate-50 border border-slate-200 text-black font-medium text-sm rounded-xl focus:ring-orange-500 focus:border-orange-500 block p-3 outline-none w-full sm:w-auto"
                  value={filterBread} onChange={e => setFilterBread(e.target.value)}
                >
                  <option value="ALL">Todos los panes</option>
                  {breads.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>

                <select 
                  className="bg-slate-50 border border-slate-200 text-black font-medium text-sm rounded-xl focus:ring-orange-500 focus:border-orange-500 block p-3 outline-none w-full sm:w-auto"
                  value={filterDelivery} onChange={e => setFilterDelivery(e.target.value)}
                >
                  <option value="ALL">Todos los tipos (Retiro/Envío)</option>
                  <option value="PICKUP">Solo Retiro</option>
                  <option value="DELIVERY">Solo Envío</option>
                </select>
              </div>
            </div>
          </div>

          <OrderBoard orders={orders} breads={breads} onEdit={handleEditOrder} />
        </div>
      </div>

      <AddOrderModal 
        isOpen={isOrderModalOpen} 
        onClose={handleCloseOrderModal} 
        breads={breads} 
        agentName={agentName}
        orderToEdit={orderToEdit}
      />

      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={handleCloseExpenseModal}
        agentName={agentName}
        expenseToEdit={expenseToEdit}
      />

      <ExpensesModal
        isOpen={isExpensesModalOpen}
        onClose={() => setIsExpensesModalOpen(false)}
        expenses={initialExpenses}
        onEdit={(e: any) => {
          setIsExpensesModalOpen(false);
          handleEditExpense(e);
        }}
      />

      <AddBreadModal
        isOpen={isAddBreadOpen}
        onClose={() => setIsAddBreadOpen(false)}
      />
    </div>
  );
}

function StatCard({ title, value, type }: { title: string, value: number, type: 'success' | 'warning' }) {
  const isSuccess = type === 'success';
  return (
    <div className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border ${isSuccess ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
      <h3 className={`text-xs sm:text-sm font-medium mb-1 sm:mb-2 ${isSuccess ? 'text-emerald-700' : 'text-rose-700'}`}>{title}</h3>
      <p className={`text-2xl sm:text-3xl font-bold ${isSuccess ? 'text-emerald-600' : 'text-rose-600'}`}>
        ${value.toLocaleString('es-AR')}
      </p>
    </div>
  );
}
