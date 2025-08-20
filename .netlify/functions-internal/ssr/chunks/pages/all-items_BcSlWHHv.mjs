import { DataAPIClient } from '@datastax/astra-db-ts';

const rarityOrder = ["Common", "Uncommon", "Rare", "Epic"];

const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(process.env.ASTRA_DB_API_ENDPOINT, {
  namespace: "lego_fortnite",
});
const collection = db.collection("lego_fortnite_items");
const items = await collection.find({}).toArray();
const sortedItems = items.sort((first, second) => {
  if (first.item < second.item) {
    return -1;
  } else if (first.item > second.item) {
    return 1;
  } else {
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
const GET = () => {
  return new Response(JSON.stringify(sortedItems));
};

export { GET };
