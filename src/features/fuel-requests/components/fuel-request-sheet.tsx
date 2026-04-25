"use client"

import * as React from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { createFuelRequest } from "@/features/fuel-requests/actions"
import { getSites } from "@/features/sites/actions"
import { getTechnicians } from "@/features/technicians/actions"
import { toast } from "sonner"

interface Site {
  id: number;
  siteId: string;
  name: string;
}

interface Technician {
  id: number;
  name: string | null;
}

export function FuelRequestSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [sites, setSites] = React.useState<Site[]>([])
  const [technicians, setTechnicians] = React.useState<Technician[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      getSites().then(setSites)
      getTechnicians().then(res => {
        if (res && res.technicians) {
          setTechnicians(res.technicians.map(t => ({
            id: Number(t.id),
            name: t.user?.name || "Unnamed Technician"
          })))
        }
      })
    }
  }, [open])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    
    // Checkbox/Switch handling
    const notifyUser = formData.get("notifyUser") === "on";

    const data = {
      siteId: formData.get("siteId") as string,
      department: formData.get("department") as string,
      requestedForId: formData.get("requestedForId") as string,
      priority: formData.get("priority")?.toString(),
      requestDescription: formData.get("requestDescription") as string,
      additionalDescription: formData.get("additionalDescription") as string,
      
      requestedBy: "Million tesfahun tibebu", 
      notifyUser,
      requesterEmail: formData.get("requesterEmail") as string,
      requesterPhone: formData.get("requesterPhone") as string,
      contactPreference: formData.get("contactPreference") as string,
      
      contextValue: "generator fuelrequest",
      driverType: formData.get("driverType") as string,
      driverName: formData.get("driverName") as string,
      driverEmployeeId: formData.get("driverEmployeeId") as string,
      technicianId: formData.get("technicianId") as string,
      employeeId: formData.get("employeeId") as string,
      literRequired: formData.get("literRequired") as string,
      remark: formData.get("remark") as string,
    }

    try {
      await createFuelRequest(data)
      toast.success("Work request submitted successfully")
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to submit request")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get current date time for display
  const now = new Date()
  const currentDateTime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-3xl p-0 border-none overflow-y-auto" side="right">
        <SheetHeader className="bg-lime-600 p-6 text-white relative">
          <SheetTitle className="text-xl font-semibold text-white uppercase tracking-tight">Fuel Request and Delivery System</SheetTitle>
          <SheetDescription className="text-lime-100/90 text-sm mt-1 font-medium italic">
            Submit a new fuel or work request with driver and delivery details.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={onSubmit} className="p-8 space-y-8">
          
          {/* Section 1: CREATE WORK REQUEST */}
          <div className="space-y-6">
            <h3 className="font-semibold text-sm text-lime-700 uppercase tracking-widest border-b border-lime-100 pb-2">1. Work Request Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <Label htmlFor="siteId" className="text-sm font-semibold text-gray-700">Site Number</Label>
                <Select name="siteId" required>
                  <SelectTrigger className="h-10 border-gray-200 focus:ring-lime-500">
                    <SelectValue placeholder="Select site..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id.toString()}>
                        {site.siteId} - {site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-semibold text-gray-700">Assign Department</Label>
                <Input id="department" name="department" placeholder="e.g. Facilities" className="h-10 border-gray-200 focus:ring-lime-500" />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Requested Date & Time</Label>
                <Input value={currentDateTime} disabled className="h-10 bg-gray-50 border-gray-100 text-gray-500 italic" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="requestedForId" className="text-sm font-semibold text-gray-700">Requested For ID</Label>
                <Input id="requestedForId" name="requestedForId" placeholder="e.g. ETHIO19492" required className="h-10 border-gray-200 focus:ring-lime-500" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-sm font-semibold text-gray-700">Priority Level</Label>
                <Select name="priority" defaultValue="ROUTINE">
                  <SelectTrigger className="h-10 border-gray-200 focus:ring-lime-500">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="EMERGENCY" className="text-red-600 font-bold">Emergency</SelectItem>
                    <SelectItem value="HIGH" className="text-orange-600 font-semibold">High</SelectItem>
                    <SelectItem value="MEDIUM" className="text-lime-600">Medium</SelectItem>
                    <SelectItem value="LOW" className="text-gray-600">Low</SelectItem>
                    <SelectItem value="ROUTINE">Routine</SelectItem>
                    <SelectItem value="URGENT" className="text-red-500">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 flex flex-col justify-end pb-1">
                <div className="flex items-center gap-3 bg-lime-50/50 p-2 rounded-lg border border-lime-100/50">
                  <Switch id="notifyUser" name="notifyUser" defaultChecked />
                  <Label htmlFor="notifyUser" className="text-xs font-semibold text-lime-700 uppercase cursor-pointer">Notify User via SMS/Email</Label>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <Label htmlFor="requestDescription" className="text-sm font-semibold text-gray-700">Request Description</Label>
                <Textarea id="requestDescription" name="requestDescription" placeholder="Main purpose of this request..." rows={3} className="border-gray-200 focus:ring-lime-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalDescription" className="text-sm font-semibold text-gray-700">Additional Details</Label>
                <Textarea id="additionalDescription" name="additionalDescription" placeholder="Extra information..." rows={3} className="border-gray-200 focus:ring-lime-500" />
              </div>
            </div>
          </div>

          {/* Section 2: Requester & Driver Info */}
          <div className="space-y-6 pt-4">
            <h3 className="font-semibold text-sm text-lime-700 uppercase tracking-widest border-b border-lime-100 pb-2">2. Requester & Personnel</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="requesterEmail" className="text-sm font-semibold text-gray-700">Email Address</Label>
                <Input id="requesterEmail" name="requesterEmail" type="email" defaultValue="million.tesfahun@ethiotelecom.et" className="h-10 border-gray-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="requesterPhone" className="text-sm font-semibold text-gray-700">Phone Number</Label>
                <Input id="requesterPhone" name="requesterPhone" type="tel" placeholder="+251..." required className="h-10 border-gray-200" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Contact Preference</Label>
                <RadioGroup name="contactPreference" defaultValue="email" className="flex items-center gap-6 h-10">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="c-email" />
                    <Label htmlFor="c-email" className="text-xs font-semibold text-gray-600 uppercase">Email</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="phone" id="c-phone" />
                    <Label htmlFor="c-phone" className="text-xs font-semibold text-gray-600 uppercase">Phone</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 bg-gray-50/50 p-6 rounded-xl border border-gray-100">
              <div className="space-y-2">
                <Label htmlFor="driverName" className="text-sm font-semibold text-gray-700">Driver Full Name</Label>
                <Input id="driverName" name="driverName" className="h-10 bg-white border-gray-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="driverType" className="text-sm font-semibold text-gray-700">Driver Category</Label>
                <Select name="driverType" defaultValue="employ">
                  <SelectTrigger className="h-10 bg-white border-gray-200">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="employ">Employee</SelectItem>
                    <SelectItem value="contractor">Contractor</SelectItem>
                    <SelectItem value="third_party">Third Party</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="technicianId" className="text-sm font-semibold text-gray-700">Assigned Technician</Label>
                <Select name="technicianId">
                  <SelectTrigger id="technicianId" className="h-10 bg-white border-gray-200">
                    <SelectValue placeholder="Select technician..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {technicians.map((tech) => (
                      <SelectItem key={tech.id} value={tech.id.toString()}>
                        {tech.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="literRequired" className="text-sm font-semibold text-gray-700">Liter Required</Label>
                <Input id="literRequired" name="literRequired" type="number" step="0.01" className="h-10 bg-white border-gray-200 font-bold text-lime-700" />
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="remark" className="text-sm font-semibold text-gray-700">Additional Remarks</Label>
              <Textarea id="remark" name="remark" placeholder="Any final comments or observations..." rows={3} className="border-gray-200 focus:ring-lime-500" />
            </div>
          </div>

          <div className="mt-12 flex items-center justify-end gap-3 border-t pt-8 pb-8">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="px-6 h-10 font-semibold text-gray-500 hover:bg-gray-50 uppercase tracking-tight">
              Cancel
            </Button>
            <Button type="reset" variant="secondary" className="px-6 h-10 font-semibold uppercase tracking-tight">
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting} className="px-8 h-10 bg-lime-600 hover:bg-lime-700 text-white font-semibold uppercase tracking-tight shadow-sm">
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
