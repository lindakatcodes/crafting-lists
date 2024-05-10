import type { APIRoute } from "astro";
import { DataAPIClient } from "@datastax/astra-db-ts";
import { type ItemObject } from "@/utils/constants";

const client = new DataAPIClient(import.meta.env.ASTRA_DB_APPLICATION_TOKEN!);
const db = client.db(import.meta.env.ASTRA_DB_API_ENDPOINT!, {
  namespace: "lego_fortnite",
});

const collection = db.collection<ItemObject>("lego_fortnite_items");
const items = await collection.find({}).toArray();

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(items));
};

await client.close();
