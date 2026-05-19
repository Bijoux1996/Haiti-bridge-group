import { z } from "zod";
import superjson from "superjson";
import { ReportStatusArrayValues } from "../../helpers/schema";

export const schema = z.object({
  page: z.number().optional().default(1),
  limit: z.number().optional().default(20),
  status: z.enum(ReportStatusArrayValues).optional(),
});

export type InputType = z.infer<typeof schema>;

export type AdminReportItem = {
  id: number;
  propertyId: number;
  propertyTitle: string;
  propertyCity: string;
  reporterId: number | null;
  reporterName: string | null;
  reporterEmail: string | null;
  reason: string;
  description: string;
  status: string;
  adminNotes: string | null;
  createdAt: Date | string | null;
};

export type OutputType = {
  reports: AdminReportItem[];
  totalCount: number;
  page: number;
  totalPages: number;
};

export const getAdminReports = async (
  input: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const url = new URL(`/_api/admin/reports`, typeof window !== "undefined" ? window.location.origin : "http://localhost");
  url.searchParams.set("json", superjson.stringify(input));
  
  const result = await fetch(url.toString(), {
    method: "GET",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  
  if (!result.ok) {
    const errorObject = superjson.parse<{ error: string }>(await result.text());
    throw new Error(errorObject.error || "Erreur lors du chargement des signalements");
  }
  return superjson.parse<OutputType>(await result.text());
};