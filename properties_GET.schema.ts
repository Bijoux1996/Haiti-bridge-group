import { z } from "zod";
import superjson from "superjson";
import { PropertyCategoryArrayValues } from "../../helpers/schema";

export const schema = z.object({
  page: z.number().optional().default(1),
  limit: z.number().optional().default(20),
  search: z.string().optional(),
  category: z.enum(PropertyCategoryArrayValues).optional(),
  isFeatured: z.boolean().optional(),
});

export type InputType = z.infer<typeof schema>;

export type AdminPropertyOutputItem = {
  id: number;
  title: string;
  price: string | number;
  category: string;
  city: string;
  bedrooms: number | null;
  bathrooms: number | null;
  isFeatured: boolean | null;
  phone: string | null;
  whatsapp: string | null;
  createdAt: Date | string | null;
  primaryImageUrl: string | null;
  agentName: string | null;
  agentEmail: string | null;
  agentId: number | null;
};

export type OutputType = {
  properties: AdminPropertyOutputItem[];
  totalCount: number;
  page: number;
  totalPages: number;
};

export const getAdminProperties = async (
  input: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const url = new URL(`/_api/admin/properties`, typeof window !== "undefined" ? window.location.origin : "http://localhost");
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
    throw new Error(errorObject.error || "Failed to fetch properties");
  }
  return superjson.parse<OutputType>(await result.text());
};