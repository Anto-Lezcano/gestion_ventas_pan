"use client";

import { AlertTriangle, X } from "lucide-react";

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Eliminar", 
  cancelText = "Cancelar",
  isDanger = true
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onConfirm: () => void, 
  title: string, 
  message: string,
  confirmText?: string,
  cancelText?: string,
  isDanger?: boolean
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDanger ? 'bg-rose-100 text-rose-500' : 'bg-orange-100 text-orange-500'}`}>
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">{title}</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            {message}
          </p>
        </div>
        
        <div className="p-4 border-t border-slate-100 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 px-4 font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
          >
            {cancelText}
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-3 px-4 font-medium text-white rounded-xl shadow-lg transition-all active:scale-95 ${isDanger ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-200' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-200'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
