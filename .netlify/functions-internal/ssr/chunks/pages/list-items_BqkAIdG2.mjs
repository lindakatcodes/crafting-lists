import { DataAPIClient } from '@datastax/astra-db-ts';

const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(process.env.ASTRA_DB_API_ENDPOINT, {
  namespace: "lego_fortnite",
});
const collection = db.collection("lego_fortnite_items");
const POST = async ({ request }) => {
  const data = await request.formData();
  const itemsToBuild = data.getAll("buildItem");
  if (!itemsToBuild) {
    return new Response(
      JSON.stringify({
        message: "No items selected to build"
      }),
      { status: 200 }
    );
  }
  const materials = {};
  for (const item of itemsToBuild) {
    const itemData = await collection.findOne({
      _id: item
    });
    if (!itemData || !itemData?.ingredients) {
      return new Response(
        JSON.stringify({
          message: "Couldn't find this item in the db."
        }),
        { status: 200 }
      );
    }
    for (const ingObj of itemData?.ingredients) {
      if (!ingObj)
        break;
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
      materials
    }),
    { status: 200 }
  );
};

export { POST };
