import { z } from "zod";
import superjson from "superjson";

export const schema = z.object({});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  totalUsers: number;
  totalAgents: number;
  totalProperties: number;
  pendingVerifications: number;
  pendingSubscriptions: number;
  activeSubscriptions: number;
  pendingReports: number;
};

export const getAdminStats = async (
  input?: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const url = new URL(`/_api/admin/stats`, typeof window !== "undefined" ? window.location.origin : "http://localhost");
  
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
    throw new Error(errorObject.error || "Failed to fetch admin stats");
  }
  return superjson.parse<OutputType>(await result.text());
};