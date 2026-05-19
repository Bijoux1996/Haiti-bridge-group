import { schema, OutputType } from "./properties_GET.schema";
import superjson from "superjson";
import { db } from "../../helpers/db";
import { getServerUserSession } from "../../helpers/getServerUserSession";
import { sql } from "kysely";

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

    let query = db.selectFrom("properties")
      .leftJoin("users", "users.id", "properties.agentId")
      .leftJoin("propertyImages", (join) => 
        join.onRef("propertyImages.propertyId", "=", "properties.id")
          .on("propertyImages.isPrimary", "=", sql`true`)
      );

    let countQuery = db.selectFrom("properties");

    if (input.category) {
      query = query.where("properties.category", "=", input.category);
      countQuery = countQuery.where("properties.category", "=", input.category);
    }

    if (input.isFeatured !== undefined) {
      query = query.where("properties.isFeatured", "=", input.isFeatured);
      countQuery = countQuery.where("properties.isFeatured", "=", input.isFeatured);
    }

    if (input.search) {
      const searchTerms = `%${input.search}%`;
      query = query.where("properties.title", "ilike", searchTerms);
      countQuery = countQuery.where("properties.title", "ilike", searchTerms);
    }

    const countResult = await countQuery
      .select((eb) => eb.fn.count<string | number>("id").as("count"))
      .executeTakeFirst();
      
    const totalCount = Number(countResult?.count || 0);

    const properties = await query
      .select([
        "properties.id",
        "properties.title",
        "properties.price",
        "properties.category",
        "properties.city",
        "properties.bedrooms",
        "properties.bathrooms",
        "properties.isFeatured",
        "properties.phone",
        "properties.whatsapp",
        "properties.createdAt",
        "properties.agentId",
        "propertyImages.imageUrl as primaryImageUrl",
        "users.displayName as agentName",
        "users.email as agentEmail"
      ])
      .orderBy("properties.createdAt", "desc")
      .limit(input.limit)
      .offset((input.page - 1) * input.limit)
      .execute();

    const output: OutputType = {
      properties,
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