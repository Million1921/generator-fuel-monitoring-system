"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table"
import { cn } from "@/lib/utils"

interface AnalyticalReportData {
  siteNumber: string
  location: string
  totalRefueled: number
  totalRunningHours: number
  amountInBirr: number
  variance: number
}

const columns: ColumnDef<AnalyticalReportData>[] = [
  {
    accessorKey: "siteNumber",
    header: "Site #",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "totalRefueled",
    header: "Total Refueled (L)",
    cell: ({ row }) => `${row.original.totalRefueled.toLocaleString()} L`,
  },
  {
    accessorKey: "totalRunningHours",
    header: "Running Hours",
    cell: ({ row }) => `${row.original.totalRunningHours.toLocaleString()} h`,
  },
  {
    accessorKey: "amountInBirr",
    header: "Amount in Birr",
    cell: ({ row }) => `${row.original.amountInBirr.toLocaleString()} ETB`,
  },
  {
    accessorKey: "variance",
    header: "Variance",
    cell: ({ row }) => {
      const val = row.original.variance
      return (
        <span className={cn(
          "font-medium",
          val > 0 ? "text-red-400" : "text-emerald-400"
        )}>
          {val > 0 ? "+" : ""}{val.toLocaleString()} L
        </span>
      )
    },
  },
]

export function AnalyticalReportTable({ data }: { data: AnalyticalReportData[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <div className="w-full space-y-4">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-neutral-900 text-neutral-400 text-sm uppercase tracking-wider font-semibold border-b border-neutral-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-neutral-800/50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 text-neutral-300">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-neutral-500">
          Showing {table.getRowModel().rows.length} of {data.length} sites
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2 text-sm rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-400 disabled:opacity-50 hover:bg-neutral-800 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-2 text-sm rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-400 disabled:opacity-50 hover:bg-neutral-800 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
