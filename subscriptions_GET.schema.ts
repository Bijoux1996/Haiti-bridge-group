import { z } from "zod";
import superjson from "superjson";
import { SubscriptionStatusArrayValues } from "../../helpers/schema";

export const schema = z.object({
  page: z.number().optional().default(1),
  limit: z.number().optional().default(20),
  status: z.enum(SubscriptionStatusArrayValues).optional(),
});

export type InputType = z.infer<typeof schema>;

export type AdminSubscriptionOutputItem = {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  planId: number;
  planName: string;
  planSlug: string;
  status: string;
  paymentMethod: string | null;
  paymentReference: string | null;
  startedAt: Date | string | null;
  expiresAt: Date | string | null;
  createdAt: Date | string | null;
};

export type OutputType = {
  subscriptions: AdminSubscriptionOutputItem[];
  totalCount: number;
  page: number;
  totalPages: number;
};

export const getAdminSubscriptions = async (
  input: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const url = new URL(`/_api/admin/subscriptions`, typeof window !== "undefined" ? window.location.origin : "http://localhost");
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
    throw new Error(errorObject.error || "Failed to fetch subscriptions");
  }
  return superjson.parse<OutputType>(await result.text());
};