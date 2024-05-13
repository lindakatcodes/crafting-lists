import type { APIRoute } from "astro";
import { DataAPIClient } from "@datastax/astra-db-ts";
import { type ItemObject, rarityOrder } from "@/utils/constants";

const client = new DataAPIClient(import.meta.env.ASTRA_DB_APPLICATION_TOKEN!);
const db = client.db(import.meta.env.ASTRA_DB_API_ENDPOINT!, {
  namespace: "lego_fortnite",
});

const collection = db.collection<ItemObject>("lego_fortnite_items");
const items = await collection.find({}).toArray();

const sortedItems = items.sort((first, second) => {
  if (first.item < second.item) {
    return -1;
  } else if (first.item > second.item) {
    return 1;
  } else {
    // also trying to sort items by rarity
    const firstRank = rarityOrder.indexOf(first.rarity);
    const secondRank = rarityOrder.indexOf(second.rarity);
    if (firstRank < secondRank) {
      return -1;
    } else if (secondRank > firstRank) {
      return 1;
    }
  }
  return 0;
});

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(sortedItems));
};
