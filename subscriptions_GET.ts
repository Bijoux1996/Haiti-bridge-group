import { schema, OutputType } from "./subscriptions_GET.schema";
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

    let query = db.selectFrom("userSubscriptions")
      .innerJoin("users", "users.id", "userSubscriptions.userId")
      .innerJoin("subscriptionPlans", "subscriptionPlans.id", "userSubscriptions.planId");

    let countQuery = db.selectFrom("userSubscriptions");

    if (input.status) {
      query = query.where("userSubscriptions.status", "=", input.status);
      countQuery = countQuery.where("status", "=", input.status);
    }

    const countResult = await countQuery
      .select((eb) => eb.fn.count<string | number>("id").as("count"))
      .executeTakeFirst();
      
    const totalCount = Number(countResult?.count || 0);

    const subscriptions = await query
      .select([
        "userSubscriptions.id",
        "userSubscriptions.userId",
        "users.displayName as userName",
        "users.email as userEmail",
        "userSubscriptions.planId",
        "subscriptionPlans.name as planName",
        "subscriptionPlans.slug as planSlug",
        "userSubscriptions.status",
        "userSubscriptions.paymentMethod",
        "userSubscriptions.paymentReference",
        "userSubscriptions.startedAt",
        "userSubscriptions.expiresAt",
        "userSubscriptions.createdAt",
      ])
      .orderBy("userSubscriptions.createdAt", "desc")
      .limit(input.limit)
      .offset((input.page - 1) * input.limit)
      .execute();

    const output: OutputType = {
      subscriptions,
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