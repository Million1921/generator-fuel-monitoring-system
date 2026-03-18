import { z } from "zod";

export const FuelDeliverySchema = z.object({
  begRunningHour: z.coerce.number().min(0),
  endRunningHour: z.coerce.number().min(0),
  actualRefueled: z.coerce.number().positive("Refueled amount must be greater than 0"),
  guardName: z.string().min(2, "Guard name is required"),
}).refine((data) => data.endRunningHour >= data.begRunningHour, {
  message: "End hours cannot be less than start hours",
  path: ["endRunningHour"],
});
