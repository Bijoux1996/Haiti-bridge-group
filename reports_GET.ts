import { schema, OutputType } from "./reports_GET.schema";
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

    let query = db.selectFrom("propertyReports")
      .innerJoin("properties", "properties.id", "propertyReports.propertyId")
      .leftJoin("users", "users.id", "propertyReports.reporterId");

    let countQuery = db.selectFrom("propertyReports");

    if (input.status) {
      query = query.where("propertyReports.status", "=", input.status);
      countQuery = countQuery.where("status", "=", input.status);
    }

    const countResult = await countQuery
      .select((eb) => eb.fn.count<string | number>("propertyReports.id").as("count"))
      .executeTakeFirst();
      
    const totalCount = Number(countResult?.count || 0);

    const reports = await query
      .select([
        "propertyReports.id",
        "propertyReports.propertyId",
        "properties.title as propertyTitle",
        "properties.city as propertyCity",
        "propertyReports.reporterId",
        "users.displayName as reporterName",
        "propertyReports.reporterEmail",
        "propertyReports.reason",
        "propertyReports.description",
        "propertyReports.status",
        "propertyReports.adminNotes",
        "propertyReports.createdAt",
      ])
      .orderBy("propertyReports.createdAt", "desc")
      .limit(input.limit)
      .offset((input.page - 1) * input.limit)
      .execute();

    const output: OutputType = {
      reports,
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