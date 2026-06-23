"use client";

import { useState } from "react";
import { login } from "./actions/auth";
import { Wheat, UserCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (name: string) => {
    setError("");
    setIsLoading(name);
    try {
      const result = await login(name);
      if (result.success) {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
      setIsLoading(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden p-6 sm:p-8 space-y-6 sm:space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center">
          <div className="bg-orange-100 p-4 rounded-full mb-4">
            <Wheat className="w-12 h-12 text-orange-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 text-center">
            Pedidos de Pan
          </h1>
          <p className="text-slate-500 mt-2 text-center text-sm sm:text-base">
            Selecciona tu usuario para ingresar
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleLogin("anto")}
            disabled={isLoading !== null}
            className={`w-full group flex items-center justify-between bg-slate-50 hover:bg-orange-50 border-2 ${isLoading === "anto" ? "border-orange-500 bg-orange-50" : "border-slate-100 hover:border-orange-200"} p-4 rounded-2xl transition-all disabled:opacity-70`}
          >
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded-xl shadow-sm group-hover:text-orange-500 text-slate-400 transition-colors">
                <UserCircle2 className="w-6 h-6" />
              </div>
              <span className="text-lg font-bold text-slate-700 group-hover:text-orange-600 transition-colors">
                Soy Anto
              </span>
            </div>
            {isLoading === "anto" && <span className="text-sm font-medium text-orange-500 animate-pulse">Entrando...</span>}
          </button>

          <button
            onClick={() => handleLogin("cami")}
            disabled={isLoading !== null}
            className={`w-full group flex items-center justify-between bg-slate-50 hover:bg-orange-50 border-2 ${isLoading === "cami" ? "border-orange-500 bg-orange-50" : "border-slate-100 hover:border-orange-200"} p-4 rounded-2xl transition-all disabled:opacity-70`}
          >
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded-xl shadow-sm group-hover:text-orange-500 text-slate-400 transition-colors">
                <UserCircle2 className="w-6 h-6" />
              </div>
              <span className="text-lg font-bold text-slate-700 group-hover:text-orange-600 transition-colors">
                Soy Cami
              </span>
            </div>
            {isLoading === "cami" && <span className="text-sm font-medium text-orange-500 animate-pulse">Entrando...</span>}
          </button>

          {error && <p className="text-red-500 text-sm text-center pt-2 font-medium">{error}</p>}
        </div>
      </div>
    </div>
  );
}
