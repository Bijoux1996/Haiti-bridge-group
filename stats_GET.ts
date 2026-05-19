import { schema, OutputType } from "./stats_GET.schema";
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

    // No input validation needed for stats, just verify the empty schema
    const json = superjson.parse(await request.text().catch(() => "{}"));
    schema.parse(json || {});

    // Run parallel queries to get dashboard counts
    const [
      totalUsers,
      totalAgents,
      totalProperties,
      pendingVerifications,
      pendingSubscriptions,
      activeSubscriptions,
      pendingReports,
    ] = await Promise.all([
      db.selectFrom("users").select((eb) => eb.fn.count<string | number>("id").as("c")).executeTakeFirst().then((r) => Number(r?.c || 0)),
      db.selectFrom("users").where("role", "=", "agent").select((eb) => eb.fn.count<string | number>("id").as("c")).executeTakeFirst().then((r) => Number(r?.c || 0)),
      db.selectFrom("properties").select((eb) => eb.fn.count<string | number>("id").as("c")).executeTakeFirst().then((r) => Number(r?.c || 0)),
      db.selectFrom("users").where("role", "=", "agent").where("verificationStatus", "=", "pending").select((eb) => eb.fn.count<string | number>("id").as("c")).executeTakeFirst().then((r) => Number(r?.c || 0)),
      db.selectFrom("userSubscriptions").where("status", "=", "pending").select((eb) => eb.fn.count<string | number>("id").as("c")).executeTakeFirst().then((r) => Number(r?.c || 0)),
      db.selectFrom("userSubscriptions").where("status", "=", "active").select((eb) => eb.fn.count<string | number>("id").as("c")).executeTakeFirst().then((r) => Number(r?.c || 0)),
      db.selectFrom("propertyReports").where("status", "=", "pending").select((eb) => eb.fn.count<string | number>("id").as("c")).executeTakeFirst().then((r) => Number(r?.c || 0)),
    ]);

    const output: OutputType = {
      totalUsers,
      totalAgents,
      totalProperties,
      pendingVerifications,
      pendingSubscriptions,
      activeSubscriptions,
      pendingReports,
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