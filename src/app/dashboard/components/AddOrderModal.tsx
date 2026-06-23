"use client";

import { useState, useEffect } from "react";
import { createOrder, updateOrder } from "../../actions/order";
import { X } from "lucide-react";

export default function AddOrderModal({ 
  isOpen, 
  onClose, 
  breads, 
  agentName,
  orderToEdit 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  breads: any[], 
  agentName: string,
  orderToEdit?: any
}) {
  const [titular, setTitular] = useState("");
  const [phone, setPhone] = useState("");
  const [items, setItems] = useState<{ breadId: string; quantity: number | string }[]>([{ breadId: "", quantity: 1 }]);
  const [isDelivery, setIsDelivery] = useState(false);
  const [deliveryCost, setDeliveryCost] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (orderToEdit) {
      setTitular(orderToEdit.titular);
      setPhone(orderToEdit.phone || "");
      setItems(orderToEdit.items && orderToEdit.items.length > 0 
        ? orderToEdit.items.map((i: any) => ({ breadId: i.breadId, quantity: i.quantity })) 
        : [{ breadId: breads[0]?.id || "", quantity: 1 }]);
      setIsDelivery(orderToEdit.isDelivery);
      setDeliveryCost(orderToEdit.deliveryCost !== null ? orderToEdit.deliveryCost.toString() : "");
      setIsPaid(orderToEdit.isPaid);
    } else {
      setTitular("");
      setPhone("");
      setItems([{ breadId: breads[0]?.id || "", quantity: 1 }]);
      setIsDelivery(false);
      setDeliveryCost("");
      setIsPaid(false);
    }
  }, [orderToEdit, isOpen, breads]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = {
        titular,
        phone,
        items: items.map(item => ({
          breadId: item.breadId,
          quantity: typeof item.quantity === 'number' ? item.quantity : (parseInt(item.quantity as string) || 1)
        })),
        isDelivery,
        deliveryCost: isDelivery && deliveryCost ? parseFloat(deliveryCost) : undefined,
        isPaid,
        agentName
      };

      if (orderToEdit) {
        await updateOrder(orderToEdit.id, data);
      } else {
        await createOrder(data);
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const addItem = () => {
    setItems([...items, { breadId: breads[0]?.id || "", quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: "breadId" | "quantity", value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-auto">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
            {orderToEdit ? "Editar Pedido" : "Añadir Pedido"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Titular (Cliente)</label>
              <input 
                required
                type="text" 
                value={titular} 
                onChange={e => setTitular(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all text-black font-medium"
                placeholder="Nombre del cliente"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono (Opcional)</label>
              <input 
                type="text" 
                value={phone} 
                onChange={e => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all text-black font-medium"
                placeholder="Ej. 1123456789"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">Panes</label>
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-[1fr,auto,auto] gap-2 items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <select 
                  required
                  value={item.breadId}
                  onChange={e => updateItem(index, "breadId", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all bg-white text-black font-medium text-sm"
                >
                  <option value="" disabled>Seleccione un pan</option>
                  {breads.map(b => (
                    <option key={b.id} value={b.id}>{b.name} (${b.price})</option>
                  ))}
                </select>
                <input 
                  required
                  type="number" 
                  min="1"
                  value={item.quantity} 
                  onChange={e => updateItem(index, "quantity", e.target.value === "" ? "" : parseInt(e.target.value))}
                  className="w-20 px-3 py-2 rounded-lg border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all text-black font-medium text-sm text-center"
                />
                <button 
                  type="button" 
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                  className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-30"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button 
              type="button" 
              onClick={addItem}
              className="text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-1"
            >
              + Añadir otro pan
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <input 
                type="checkbox" 
                checked={isDelivery}
                onChange={e => setIsDelivery(e.target.checked)}
                className="w-5 h-5 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
              />
              <span className="font-medium text-slate-700 text-sm">Requiere Envío</span>
            </label>
            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <input 
                type="checkbox" 
                checked={isPaid}
                onChange={e => setIsPaid(e.target.checked)}
                className="w-5 h-5 text-emerald-500 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span className="font-medium text-slate-700 text-sm">Ya Pagado</span>
            </label>
          </div>

          {isDelivery && (
            <div className="animate-in slide-in-from-top-2 duration-200">
              <label className="block text-sm font-medium text-slate-700 mb-1">Costo de Envío (Opcional)</label>
              <input 
                type="number" 
                value={deliveryCost} 
                onChange={e => setDeliveryCost(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all text-black font-medium"
                placeholder="Ej. 500"
              />
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3 justify-end mt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-3 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors w-full sm:w-auto order-last sm:order-first"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl shadow-lg shadow-orange-200 transition-all w-full sm:w-auto"
            >
              {isSubmitting ? 'Guardando...' : orderToEdit ? 'Guardar Cambios' : 'Guardar Pedido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
