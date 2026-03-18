import { getAnalyticalReport } from "@/lib/actions"
import { AnalyticalReportTable } from "@/components/dashboard/AnalyticalReportTable"

export const dynamic = "force-dynamic"

export default async function AnalyticalReportPage() {
  const data = await getAnalyticalReport();

  return (
    <div className="min-h-screen bg-neutral-950 p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="space-y-4">
          <h1 className="text-4xl font-bold text-neutral-100 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Analytical Consumption Report
          </h1>
          <p className="text-neutral-400 max-w-2xl text-lg">
            Monitor real-time fuel consumption, cost analysis, and site variance tracking.
          </p>
        </header>

        <main>
          <AnalyticalReportTable data={data} />
        </main>
      </div>
    </div>
  )
}
