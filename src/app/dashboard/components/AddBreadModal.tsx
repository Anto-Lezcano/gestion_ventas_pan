"use client";

import { useState } from "react";
import { createBread } from "../../actions/order";
import { X } from "lucide-react";

export default function AddBreadModal({ 
  isOpen, 
  onClose, 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [promotionPrice, setPromotionPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createBread({
        name,
        description: description || undefined,
        price: parseFloat(price),
        promotionPrice: promotionPrice ? parseFloat(promotionPrice) : undefined
      });
      // Reset
      setName("");
      setDescription("");
      setPrice("");
      setPromotionPrice("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-auto">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            Nuevo Tipo de Pan
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
            <input 
              required
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all text-black font-medium"
              placeholder="Ej. Pan de Salame"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción (Opcional)</label>
            <input 
              type="text" 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all text-black font-medium"
              placeholder="Ej. Relleno de salame picado grueso"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Precio Unitario</label>
              <input 
                required
                type="number" 
                min="0"
                value={price} 
                onChange={e => setPrice(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all text-black font-medium"
                placeholder="Ej. 2500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Precio Promo x2</label>
              <input 
                type="number" 
                min="0"
                value={promotionPrice} 
                onChange={e => setPromotionPrice(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all text-black font-medium"
                placeholder="Ej. 4000"
              />
            </div>
          </div>

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
              {isSubmitting ? 'Guardando...' : 'Crear Pan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
