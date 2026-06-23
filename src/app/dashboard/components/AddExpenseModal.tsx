"use client";

import { useState, useEffect } from "react";
import { createExpense, updateExpense } from "../../actions/expense";
import { X } from "lucide-react";

export default function AddExpenseModal({ 
  isOpen, 
  onClose, 
  agentName,
  expenseToEdit 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  agentName: string,
  expenseToEdit?: any
}) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (expenseToEdit) {
      setDescription(expenseToEdit.description);
      setAmount(expenseToEdit.amount.toString());
    } else {
      setDescription("");
      setAmount("");
    }
  }, [expenseToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = {
        description,
        amount: parseFloat(amount),
      };

      if (expenseToEdit) {
        await updateExpense(expenseToEdit.id, data);
      } else {
        await createExpense({ ...data, agentName });
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-auto">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
            {expenseToEdit ? "Editar Gasto" : "Cargar Gasto"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción / Productos Comprados</label>
            <textarea 
              required
              rows={3}
              value={description} 
              onChange={e => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all text-black font-medium resize-none"
              placeholder="Ej: Harina, levadura, huevos..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Total Gastado ($)</label>
            <input 
              required
              type="number" 
              min="1"
              step="any"
              value={amount} 
              onChange={e => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all text-black font-medium"
              placeholder="Ej: 15000"
            />
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
              className="px-8 py-3 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl shadow-lg shadow-rose-200 transition-all w-full sm:w-auto"
            >
              {isSubmitting ? 'Guardando...' : expenseToEdit ? 'Guardar Cambios' : 'Cargar Gasto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
