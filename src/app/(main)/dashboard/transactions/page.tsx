import { PrismaClient } from "@prisma/client"
import { TransactionsTable } from "@/features/transactions/components/TransactionsTable"

// Create a local prisma client to ensure we have the latest schema/connection
const localPrisma = new PrismaClient()

export const dynamic = "force-dynamic"

export default async function TransactionsPage(props: { 
  searchParams: Promise<{ 
    search?: string; 
    page?: string;
    from?: string;
    to?: string;
  }> 
}) {
  const searchParams = await props.searchParams;
  const search = searchParams.search;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const from = searchParams.from;
  const to = searchParams.to;
  
  const limit = 10;
  const skip = (page - 1) * limit;

  let transactions: any[] = [];
  let totalCount: number = 0;

  try {
    // 1. Diagnostics: Find WHERE this table actually is
    // We search all schemas, not just public, and check current DB info
    const dbContext: any[] = await localPrisma.$queryRawUnsafe(`SELECT current_database() as db, current_schema() as schema`);
    console.log("Transactions Page - DB Context:", dbContext[0]);

    const allTables: any[] = await localPrisma.$queryRawUnsafe(
      `SELECT tablename, schemaname FROM pg_catalog.pg_tables WHERE tablename ILIKE '%transaction%'`
    );
    
    console.log("Transactions Page - Detected Tables:", allTables);

    // 2. Select the best match
    const tableMatch = allTables.find(t => t.tablename === 'Transaction') 
      || allTables.find(t => t.tablename === 'transaction')
      || allTables[0];

    // Build the query target
    let targetTable = '"Transaction"'; // Default
    if (tableMatch) {
      targetTable = `"${tableMatch.schemaname}"."${tableMatch.tablename}"`;
    }
    
    console.log("Transactions Page - Using Target:", targetTable);

    // 3. Build filters
    let whereClause = "WHERE 1=1";
    const params: any[] = [];
    let paramIndex = 1;

    if (search) {
      whereClause += ` AND ("receiptNo" ILIKE $${paramIndex} OR "senderAccount" ILIKE $${paramIndex} OR "receiverAccount" ILIKE $${paramIndex} OR "payerName" ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (from) {
      whereClause += ` AND "createdAt" >= $${paramIndex}`;
      params.push(new Date(from));
      paramIndex++;
    }

    if (to) {
      whereClause += ` AND "createdAt" <= $${paramIndex}`;
      params.push(new Date(to));
      paramIndex++;
    }

    // 4. Execute with fallback for quoted/unquoted if necessary
    try {
      const countRes: any[] = await localPrisma.$queryRawUnsafe(
        `SELECT COUNT(*)::int as count FROM ${targetTable} ${whereClause}`,
        ...params
      );
      totalCount = countRes[0]?.count || 0;

      transactions = await localPrisma.$queryRawUnsafe(
        `SELECT * FROM ${targetTable} ${whereClause} ORDER BY "createdAt" DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
        ...[...params, limit, skip]
      );
    } catch (innerError: any) {
      console.error("Transactions Page - Query failed with detected target:", innerError.message);
      // Last-ditch: try lowercase unquoted if it's not what we already tried
      if (!targetTable.includes('"transaction"')) {
         const countRes: any[] = await localPrisma.$queryRawUnsafe(`SELECT COUNT(*)::int as count FROM transaction ${whereClause}`, ...params);
         totalCount = countRes[0]?.count || 0;
         transactions = await localPrisma.$queryRawUnsafe(`SELECT * FROM transaction ${whereClause} ORDER BY "createdAt" DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`, ...[...params, limit, skip]);
      }
    }

  } catch (error: any) {
    console.error("Transactions Page - Global Error:", error.message);
  }

  const totalPages = Math.ceil(totalCount / limit) || 1;

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 pb-6 bg-gray-50/30 overflow-x-auto overflow-y-hidden">
        <div className="flex items-center justify-between mt-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-800">BARREL Transactions</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage and track all fuel-related transactions.</p>
          </div>
        </div>

        <TransactionsTable 
          transactions={transactions}
          total={totalCount}
          page={page}
          totalPages={totalPages}
          search={search}
          dateFrom={from}
          dateTo={to}
        />
    </div>
  )
}
