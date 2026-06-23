import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
// Obtener y limpiar la DATABASE_URL
let databaseUrl = process.env.DATABASE_URL || "";
// Remover comillas si existen
if (databaseUrl.startsWith('"') && databaseUrl.endsWith('"')) {
  databaseUrl = databaseUrl.slice(1, -1);
}
if (databaseUrl.startsWith("'") && databaseUrl.endsWith("'")) {
  databaseUrl = databaseUrl.slice(1, -1);
}
// Validar que la URL no esté vacía
if (!databaseUrl) {
  console.warn("DATABASE_URL no está definida en las variables de entorno");
}
const pool = new Pool({
  connectionString: databaseUrl,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
pool.on("error", (err) => {
  console.error("Error inesperado en el pool de conexiones:", err);
});
const adapter = new PrismaPg(pool);
const prismaClientSingleton = () => {
  return new PrismaClient({ 
    adapter,
    log: ["query", "info", "warn", "error"],
  });
}
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
export default prisma;
if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
