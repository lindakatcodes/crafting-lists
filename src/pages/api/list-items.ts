import type { APIRoute } from "astro";
import { DataAPIClient } from "@datastax/astra-db-ts";
import { type ItemObject } from "@/utils/constants";

const client = new DataAPIClient(import.meta.env.ASTRA_DB_APPLICATION_TOKEN!);
const db = client.db(import.meta.env.ASTRA_DB_API_ENDPOINT!, {
  namespace: "lego_fortnite",
});

const collection = db.collection<ItemObject>("lego_fortnite_items");
// const items = await collection.find({}).toArray();

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  console.log(data);
  const itemsToBuild = data.get("buildItem");
  console.log({ itemsToBuild });
  // logic here to actually get the real counts of each resource from astra

  return new Response(
    JSON.stringify({
      message: "Success",
    }),
    { status: 200 }
  );
};

await client.close();
