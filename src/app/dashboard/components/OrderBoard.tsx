"use client";

import { updateOrderStatus, updateDeliveryCost, deleteOrder, updateOrderPaymentStatus } from "../../actions/order";
import { calculateBreadPrice } from "../../utils/price";
import { Truck, MapPin, Edit2, Trash2, DollarSign } from "lucide-react";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";

export default function OrderBoard({ orders, breads, onEdit }: { orders: any[], breads: any[], onEdit: (order: any) => void }) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
        <p className="text-slate-500 text-lg">No se encontraron pedidos con los filtros actuales.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} onEdit={onEdit} />
      ))}
    </div>
  );
}

export function OrderCard({ order, onEdit }: { order: any, onEdit: (order: any) => void }) {
  const [costInput, setCostInput] = useState(order.deliveryCost?.toString() || "");
  const [isEditingCost, setIsEditingCost] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const breadTotal = calculateBreadPrice(order.bread, order.quantity);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsUpdatingStatus(true);
    await updateOrderStatus(order.id, e.target.value);
    setIsUpdatingStatus(false);
  };

  const handleTogglePayment = async () => {
    await updateOrderPaymentStatus(order.id, !order.isPaid);
  };

  const handleSaveCost = async () => {
    const cost = parseFloat(costInput);
    if (!isNaN(cost)) {
      await updateDeliveryCost(order.id, cost);
      setIsEditingCost(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteOrder(order.id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PEDIDO": return "border-blue-200 bg-blue-50/50";
      case "EN_PROCESO": return "border-orange-200 bg-orange-50/50";
      case "TERMINADO": return "border-purple-200 bg-purple-50/50";
      case "ENTREGADO": return "border-emerald-200 bg-emerald-50/50";
      default: return "border-slate-200 bg-white";
    }
  };

  return (
    <div className={`p-5 rounded-2xl shadow-sm border transition-all relative overflow-hidden ${getStatusColor(order.status)} ${isDeleting || isUpdatingStatus ? 'opacity-50' : ''}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-bold text-lg text-slate-800 capitalize">{order.titular}</h3>
            {order.phone && (
              <a 
                href={`https://wa.me/${order.phone}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-lg whitespace-nowrap shadow-sm border border-green-200 hover:bg-green-200 transition-colors"
                title="Abrir WhatsApp"
              >
                📞 {order.phone}
              </a>
            )}
            <span className="bg-white text-slate-600 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm border border-slate-100">
              Por {order.agentName}
            </span>
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm ${order.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
              {order.isPaid ? 'Pagado' : 'Falta Pago'}
            </span>
          </div>
          <p className="text-sm text-slate-600">
            {order.quantity}x {order.bread.name} <span className="font-bold text-slate-800">(${breadTotal.toLocaleString('es-AR')})</span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-medium bg-white text-slate-600 px-2 py-1 rounded-lg shadow-sm border border-slate-100">
            {order.isDelivery ? <Truck className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
            {order.isDelivery ? 'Envío' : 'Retiro'}
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => onEdit(order)} className="p-1.5 bg-white text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors shadow-sm border border-slate-100" title="Editar">
              <Edit2 className="w-4 h-4" />
            </button>
            <button onClick={() => setShowConfirm(true)} className="p-1.5 bg-white text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors shadow-sm border border-slate-100" title="Eliminar">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {order.isDelivery && (
        <div className="mt-3 pt-3 border-t border-slate-200/50 flex items-center justify-between">
          <div className="text-sm">
            <span className="text-slate-500">Costo Envío: </span>
            {isEditingCost ? (
              <div className="inline-flex items-center gap-2">
                <input 
                  type="number" 
                  value={costInput} 
                  onChange={e => setCostInput(e.target.value)}
                  className="w-20 px-2 py-1 border rounded-lg text-sm outline-none text-black font-medium"
                />
                <button onClick={handleSaveCost} className="text-orange-600 font-medium text-xs hover:underline">Guardar</button>
              </div>
            ) : (
              <span className="font-medium text-slate-700">
                {order.deliveryCost !== null && order.deliveryCost !== undefined ? `$${order.deliveryCost.toLocaleString('es-AR')}` : <span className="text-amber-600 font-bold">Pendiente</span>}
                {order.status !== "ENTREGADO" && <button onClick={() => setIsEditingCost(true)} className="ml-2 text-xs text-orange-600 hover:underline">Editar</button>}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-slate-200/50 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <select 
          value={order.status}
          onChange={handleStatusChange}
          disabled={isUpdatingStatus}
          className="w-full sm:w-auto bg-white border border-slate-300 text-slate-700 text-sm font-bold rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-orange-500 shadow-sm disabled:opacity-50"
        >
          <option value="PEDIDO">📌 Pedido (Nuevo)</option>
          <option value="EN_PROCESO">🔥 En Proceso</option>
          <option value="TERMINADO">✅ Terminado</option>
          <option value="ENTREGADO">🎉 Entregado</option>
        </select>

        <button 
          onClick={handleTogglePayment}
          className={`w-full sm:w-auto px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-sm border ${order.isPaid ? 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50' : 'bg-rose-500 text-white border-rose-600 hover:bg-rose-600'}`}
        >
          <DollarSign className="w-4 h-4" /> 
          {order.isPaid ? 'Marcar No Pagado' : 'Marcar Pagado'}
        </button>
      </div>

      <ConfirmModal 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Eliminar Pedido"
        message={`¿Estás seguro de que deseas eliminar el pedido de ${order.titular}? Esta acción no se puede deshacer.`}
      />
    </div>
  );
}
