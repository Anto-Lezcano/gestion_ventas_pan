"use client";

import { X, Edit2, Trash2, TrendingDown } from "lucide-react";
import { useMemo, useState } from "react";
import { deleteExpense } from "../../actions/expense";
import ConfirmModal from "./ConfirmModal";

export default function ExpensesModal({ 
  isOpen, 
  onClose, 
  expenses,
  onEdit 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  expenses: any[],
  onEdit: (expense: any) => void
}) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<any>(null);

  const totalsByAgent = useMemo(() => {
    const totals: Record<string, number> = {};
    let grandTotal = 0;
    expenses.forEach(e => {
      totals[e.agentName] = (totals[e.agentName] || 0) + e.amount;
      grandTotal += e.amount;
    });
    return { totals, grandTotal };
  }, [expenses]);

  if (!isOpen) return null;

  const confirmDelete = async () => {
    if (expenseToDelete) {
      setIsDeleting(expenseToDelete.id);
      await deleteExpense(expenseToDelete.id);
      setIsDeleting(null);
      setExpenseToDelete(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl h-[80vh] shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <TrendingDown className="w-6 h-6 text-rose-500" /> Historial de Gastos
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex flex-col lg:flex-row gap-6">
          {/* Columna Izquierda: Resumen */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-700 mb-3">Total Gastado</h3>
              <p className="text-3xl font-bold text-rose-600">${totalsByAgent.grandTotal.toLocaleString('es-AR')}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex-1">
              <h3 className="font-bold text-slate-700 mb-4">Gasto por Persona</h3>
              <ul className="space-y-3">
                {Object.entries(totalsByAgent.totals).map(([agent, total]) => (
                  <li key={agent} className="flex justify-between items-center border-b border-slate-100 pb-2 last:border-0">
                    <span className="capitalize text-slate-600 font-medium">{agent}</span>
                    <span className="font-bold text-rose-500">${total.toLocaleString('es-AR')}</span>
                  </li>
                ))}
                {Object.keys(totalsByAgent.totals).length === 0 && (
                  <p className="text-slate-400 text-sm">Aún no hay gastos registrados.</p>
                )}
              </ul>
            </div>
          </div>

          {/* Columna Derecha: Lista */}
          <div className="w-full lg:w-2/3 flex flex-col gap-3">
            {expenses.map((expense: any) => (
              <div 
                key={expense.id} 
                className={`bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-start transition-opacity ${isDeleting === expense.id ? 'opacity-50' : ''}`}
              >
                <div>
                  <h4 className="font-bold text-slate-800">{expense.description}</h4>
                  <p className="text-sm text-slate-500 mt-1">
                    {new Date(expense.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })} • <span className="capitalize font-medium text-slate-700">Cargó: {expense.agentName}</span>
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="font-bold text-rose-600 text-lg">${expense.amount.toLocaleString('es-AR')}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => onEdit(expense)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setExpenseToDelete(expense)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="Eliminar">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {expenses.length === 0 && (
              <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 shadow-sm h-full flex items-center justify-center flex-col">
                <TrendingDown className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium">No se han registrado gastos aún</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={!!expenseToDelete}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={confirmDelete}
        title="Eliminar Gasto"
        message={`¿Estás seguro de que deseas eliminar el gasto de "${expenseToDelete?.description}"?`}
      />
    </div>
  );
}
