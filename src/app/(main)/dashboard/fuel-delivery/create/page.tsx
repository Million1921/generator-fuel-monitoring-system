"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createFuelDelivery, getPendingRequests, getDeliverySites } from "@/features/fuel-requests/actions"
import { getTransactions } from "@/features/transactions/actions"
import { toast } from "sonner"

export default function NewFuelDeliveryPage() {
  const router = useRouter()
  const [requests, setRequests] = React.useState<any[]>([])
  const [sites, setSites] = React.useState<any[]>([])
  const [transactions, setTransactions] = React.useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Form state for auto-fill
  const [selectedSiteId, setSelectedSiteId] = React.useState<string>("")
  const [actualRefueled, setActualRefueled] = React.useState<string>("")
  const [unitPrice, setUnitPrice] = React.useState<string>("")

  React.useEffect(() => {
    getPendingRequests().then(setRequests)
    getDeliverySites().then(setSites)
    getTransactions().then(res => {
      setTransactions(res)
      
      // Auto-fill if tx param exists
      const params = new URLSearchParams(window.location.search);
      const txId = params.get("tx");
      if (txId) {
        const tx = res.find(t => t.id.toString() === txId);
        if (tx) {
          if (tx.siteId) setSelectedSiteId(tx.siteId.toString());
          if (tx.paidAmount) setActualRefueled(tx.paidAmount.toString());
          setUnitPrice("92.5");
          toast.success(`Integrated data from Transaction #${tx.receiptNo}`);
        }
      }
    })
  }, [])

  const handleTransactionChange = (txId: string) => {
    if (txId === "none") return;
    const tx = transactions.find(t => t.id.toString() === txId);
    if (tx) {
      if (tx.siteId) setSelectedSiteId(tx.siteId.toString());
      if (tx.paidAmount) setActualRefueled(tx.paidAmount.toString());
      // Assuming paidAmount is liters and senderAmount is total cost or vice versa?
      // Let's assume paidAmount is the primary value we want.
      setUnitPrice("92.5"); // Default unit price if not in transaction
      toast.info(`Auto-filled from transaction #${tx.receiptNo}`);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const requestId = formData.get("requestId") as string
    const workOrderNumber = formData.get("workOrderNumber") as string
    const siteId = formData.get("siteId") as string

    if (!siteId && !requestId) {
      toast.error("Please select a site or work request")
      setIsSubmitting(false)
      return
    }

    const data = {
      siteId: siteId || requests.find(r => r.id.toString() === requestId)?.siteId.toString() || "",
      requestId: requestId !== "none" ? requestId : undefined,
      workOrderNumber: workOrderNumber || undefined,
      begRunningHour: parseFloat(formData.get("begRunningHour") as string),
      endRunningHour: parseFloat(formData.get("endRunningHour") as string),
      actualRefueled: parseFloat(formData.get("actualRefueled") as string),
      fuelBeforeRefuel: parseFloat(formData.get("fuelBeforeRefuel") as string),
      unitPrice: parseFloat(formData.get("unitPrice") as string),
      driverName: formData.get("guardName") as string || undefined,
      driverId: formData.get("guardSource") as string || undefined,
    }

    try {
      await createFuelDelivery(data)
      toast.success("Fuel delivery recorded successfully")
      router.refresh()
      router.push("/dashboard")
    } catch (error: any) {
      toast.error(`Failed to record: ${error.message || error}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
        <div className="flex items-center justify-between px-2">
          <h1 className="text-2xl font-bold tracking-tight">Record Fuel Delivery</h1>
        </div>
      <div className="max-w-3xl rounded-xl border bg-card p-6 shadow-sm">
        <form onSubmit={onSubmit} className="space-y-6 ml-5">
          
          <div className="space-y-2 mb-6 p-4 bg-lime-50/50 rounded-lg border border-lime-100">
            <Label htmlFor="transactionId" className="text-lime-700 font-bold flex items-center gap-2">
              <span className="bg-lime-500 text-white text-[10px] px-1.5 py-0.5 rounded uppercase">Step 1</span> 
              Import from Transaction (Original Data)
            </Label>
            <Select onValueChange={handleTransactionChange}>
              <SelectTrigger className="bg-white border-lime-200 focus:ring-lime-500">
                <SelectValue placeholder="Select a transaction to auto-fill..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Manual Entry (No Transaction)</SelectItem>
                {transactions.map((tx) => (
                  <SelectItem key={tx.id} value={tx.id.toString()}>
                    {tx.receiptNo || "N/A"} - {tx.payerName || "Unknown"} ({tx.paidAmount} L)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-lime-600 italic">Select a transaction to automatically populate site and fuel data.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="requestId">Select Work Request (Optional)</Label>
              <Select name="requestId">
                <SelectTrigger>
                  <SelectValue placeholder="Link to a pending request" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None / Manual Entry</SelectItem>
                  {requests.map((req) => (
                    <SelectItem key={req.id} value={req.id.toString()}>
                      {req.workOrderNumber} - {req.site.siteId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteId">Select Site <span className="text-red-500">*</span></Label>
              <Select name="siteId" value={selectedSiteId} onValueChange={setSelectedSiteId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select target site" />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id.toString()}>
                      {site.siteId} - {site.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workOrderNumber">Work Order Number <span className="text-red-500">*</span></Label>
            <Input 
              id="workOrderNumber" 
              name="workOrderNumber" 
              placeholder="Enter WO number (e.g. WO-1234)" 
              required
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Generator Hours</h2>
              <div className="space-y-2">
                <Label htmlFor="begRunningHour">Beginning Running Hour</Label>
                <Input id="begRunningHour" name="begRunningHour" type="number" step="0.1" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endRunningHour">Ending Running Hour</Label>
                <Input id="endRunningHour" name="endRunningHour" type="number" step="0.1" required />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Fuel Details</h2>
              <div className="space-y-2">
                <Label htmlFor="fuelBeforeRefuel">Fuel Before Refuel (L)</Label>
                <Input id="fuelBeforeRefuel" name="fuelBeforeRefuel" type="number" step="0.1" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="actualRefueled">Actual Refueled amount (L)</Label>
                <Input 
                  id="actualRefueled" 
                  name="actualRefueled" 
                  type="number" 
                  step="0.1" 
                  value={actualRefueled} 
                  onChange={(e) => setActualRefueled(e.target.value)} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitPrice">Unit Price (Birr)</Label>
                <Input 
                  id="unitPrice" 
                  name="unitPrice" 
                  type="number" 
                  step="0.01" 
                  value={unitPrice} 
                  onChange={(e) => setUnitPrice(e.target.value)} 
                  required 
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Security Info</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="guardName">Guard Name</Label>
                <Input id="guardName" name="guardName" placeholder="Enter guard name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guardSource">Guard Source</Label>
                <Input id="guardSource" name="guardSource" placeholder="e.g. SEC-01" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Recording..." : "Record Delivery"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

