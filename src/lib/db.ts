import { PrismaClient } from "@prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import Database from "better-sqlite3"
import path from "path"

const prismaClientSingleton = () => {
  // Use absolute path for dev.db to avoid issues during build/SSR
  const dbPath = path.join(process.cwd(), "dev.db")
  const db = new Database(dbPath)
  const adapter = new PrismaBetterSqlite3(db as any)
  return new PrismaClient({ adapter })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma
