import { schema, OutputType } from "./users_GET.schema";
import superjson from "superjson";
import { db } from "../../helpers/db";
import { getServerUserSession } from "../../helpers/getServerUserSession";

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);

    if (user.role !== "admin") {
      return new Response(
        superjson.stringify({ error: "Accès refusé. Réservé aux administrateurs." }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const url = new URL(request.url);
    const jsonString = url.searchParams.get("json");
    const json = jsonString ? superjson.parse(jsonString) : {};
    const input = schema.parse(json);

    let query = db.selectFrom("users");
    let countQuery = db.selectFrom("users");

    if (input.role) {
      query = query.where("role", "=", input.role);
      countQuery = countQuery.where("role", "=", input.role);
    }

    if (input.verificationStatus) {
      query = query.where("verificationStatus", "=", input.verificationStatus);
      countQuery = countQuery.where("verificationStatus", "=", input.verificationStatus);
    }

    if (input.search) {
      const searchTerms = `%${input.search}%`;
      query = query.where((eb) =>
        eb.or([
          eb("displayName", "ilike", searchTerms),
          eb("email", "ilike", searchTerms)
        ])
      );
      countQuery = countQuery.where((eb) =>
        eb.or([
          eb("displayName", "ilike", searchTerms),
          eb("email", "ilike", searchTerms)
        ])
      );
    }

    const countResult = await countQuery
      .select((eb) => eb.fn.count<string | number>("id").as("count"))
      .executeTakeFirst();
      
    const totalCount = Number(countResult?.count || 0);

    const users = await query
      .select([
        "id",
        "email",
        "displayName",
        "role",
        "avatarUrl",
        "phone",
        "whatsapp",
        "bio",
        "verificationStatus",
        "createdAt",
      ])
      .orderBy("createdAt", "desc")
      .limit(input.limit)
      .offset((input.page - 1) * input.limit)
      .execute();

    const output: OutputType = {
      users,
      totalCount,
      page: input.page,
      totalPages: Math.ceil(totalCount / input.limit) || 1,
    };

    return new Response(superjson.stringify(output satisfies OutputType), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      superjson.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}