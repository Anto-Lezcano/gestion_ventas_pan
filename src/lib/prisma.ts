import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

let databaseUrl = process.env.DATABASE_URL || "";

if (databaseUrl.startsWith('"') && databaseUrl.endsWith('"')) {
  databaseUrl = databaseUrl.slice(1, -1);
}
if (databaseUrl.startsWith("'") && databaseUrl.endsWith("'")) {
  databaseUrl = databaseUrl.slice(1, -1);
}

if (!databaseUrl) {
  console.warn("DATABASE_URL no esta definida en las variables de entorno");
}

const pool = new Pool({
  connectionString: databaseUrl,
  max: 2,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 10000,
  allowExitOnIdle: true,
});

pool.on("error", (err) => {
  console.error("Error inesperado en el pool de conexiones:", err);
});

const adapter = new PrismaPg(pool);

const prismaClientSingleton = () => {
  return new PrismaClient({
    adapter,
    log: ["warn", "error"],
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
