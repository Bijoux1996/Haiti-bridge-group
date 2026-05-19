import { z } from "zod";
import superjson from "superjson";
import { UserRoleArrayValues, VerificationStatusArrayValues } from "../../helpers/schema";

export const schema = z.object({
  page: z.number().optional().default(1),
  limit: z.number().optional().default(20),
  role: z.enum(UserRoleArrayValues).optional(),
  verificationStatus: z.enum(VerificationStatusArrayValues).optional(),
  search: z.string().optional(),
});

export type InputType = z.infer<typeof schema>;

export type AdminUserOutputItem = {
  id: number;
  email: string;
  displayName: string;
  role: string;
  avatarUrl: string | null;
  phone: string | null;
  whatsapp: string | null;
  bio: string | null;
  verificationStatus: string | null;
  createdAt: Date | string | null;
};

export type OutputType = {
  users: AdminUserOutputItem[];
  totalCount: number;
  page: number;
  totalPages: number;
};

export const getAdminUsers = async (
  input: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const url = new URL(`/_api/admin/users`, typeof window !== "undefined" ? window.location.origin : "http://localhost");
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
    throw new Error(errorObject.error || "Failed to fetch users");
  }
  return superjson.parse<OutputType>(await result.text());
};