import type { APIRoute } from "astro";
import { DataAPIClient } from "@datastax/astra-db-ts";
import { type ItemObject } from "@/utils/constants";

const client = new DataAPIClient(import.meta.env.ASTRA_DB_APPLICATION_TOKEN!);
const db = client.db(import.meta.env.ASTRA_DB_API_ENDPOINT!, {
  namespace: "lego_fortnite",
});

const collection = db.collection<ItemObject>("lego_fortnite_items");

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const itemsToBuild = data.getAll("buildItem");

  if (!itemsToBuild) {
    return new Response(
      JSON.stringify({
        message: "No items selected to build",
      }),
      { status: 200 }
    );
  }

  const materials: Record<string, number> = {};

  for (const item of itemsToBuild) {
    const itemData = await collection.findOne({
      _id: item as string,
    });

    if (!itemData || !itemData?.ingredients) {
      return new Response(
        JSON.stringify({
          message: "Couldn't find this item in the db.",
        }),
        { status: 200 }
      );
    }

    for (const ingObj of itemData?.ingredients) {
      if (!ingObj) break;
      const { qty, name } = ingObj;
      const nameTrimmed = name.trim();

      if (nameTrimmed in materials) {
        materials[nameTrimmed] = materials[nameTrimmed] + qty;
      } else {
        materials[nameTrimmed] = qty;
      }
    }
  }

  return new Response(
    JSON.stringify({
      materials,
    }),
    { status: 200 }
  );
};
