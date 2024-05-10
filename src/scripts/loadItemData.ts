import { existsSync, mkdirSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import axios, { AxiosError } from "axios";
import { JSDOM } from "jsdom";
import { DataAPIClient } from "@datastax/astra-db-ts";
import OpenAI from "openai";
import { type ItemObject, type ResourceObject } from "@/utils/constants";


const itemUrls = [
  "https://www.reddit.com/r/LEGOfortnite/wiki/index/recipes/crafting/equipment/",
  "https://www.reddit.com/r/LEGOfortnite/wiki/index/recipes/crafting/tools/",
  "https://www.reddit.com/r/LEGOfortnite/wiki/index/recipes/crafting/charms/",
  "https://www.reddit.com/r/LEGOfortnite/wiki/index/recipes/crafting/weapons/",
  "https://www.reddit.com/r/LEGOfortnite/wiki/index/recipes/machinery/",
];

const resourceUrl =
  "https://www.reddit.com/r/LEGOfortnite/wiki/index/resources/";

const root = "./";

const { ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_API_ENDPOINT, OPENAI_API_KEY } =
  process.env;

const openai = new OpenAI();

function fetchPage(url: string): Promise<string | undefined> {
  const HTMLData = axios
    .get(url)
    .then((res) => res.data)
    .catch((error: AxiosError) => {
      console.error(`There was an error with ${error.config?.url}.`);
      console.error(error.toJSON());
    });
  return HTMLData;
}

async function fetchFromWebOrCache(url: string, ignoreCache = false) {
  // If the cache folder doesn't exist, create it
  if (!existsSync(".cache")) {
    mkdirSync(".cache");
  }
  console.log(`Getting data for ${url}...`);
  if (
    !ignoreCache &&
    existsSync(
      resolve(root, `.cache/${Buffer.from(url).toString("base64")}.html`)
    )
  ) {
    console.log(`I read ${url} from cache`);
    const HTMLData = await readFile(
      resolve(root, `.cache/${Buffer.from(url).toString("base64")}.html`),
      { encoding: "utf8" }
    );
    const dom = new JSDOM(HTMLData);
    return dom.window.document;
  } else {
    console.log(`I fetched ${url} fresh`);
    const HTMLData = await fetchPage(url);
    if (!ignoreCache && HTMLData) {
      writeFile(
        resolve(root, `.cache/${Buffer.from(url).toString("base64")}.html`),
        HTMLData,
        { encoding: "utf8" }
      );
    }
    const dom = new JSDOM(HTMLData);
    return dom.window.document;
  }
}

function extractItemData(document: Document) {
  const tableData: ItemObject[] = [];
  const allTables: HTMLTableElement[] = Array.from(
    document.querySelectorAll("table")
  );

  for (const table of allTables) {
    const headers = Array.from(table.tHead!.children[0].children);
    const itemIndex = headers.findIndex((el) => el.innerHTML.includes("Item"));
    const rareIndex = headers.findIndex((el) =>
      el.innerHTML.includes("Rarity")
    );
    const ingredientIndex = headers.findIndex((el) =>
      el.innerHTML.includes("Ingredients")
    );

    const rows = Array.from(table.tBodies[0].rows);

    for (const row of rows) {
      const item = row.children[itemIndex].textContent || "";
      const rarity = row.children[rareIndex].textContent || "N/A";
      const ingredients =
        row.children[ingredientIndex].innerHTML.split(", ").map((pair) => {
          if (pair === "") return;
          const splitPair = pair.split(/(\d+)/);
          return {
            qty: Number(splitPair[1]),
            name: splitPair[2],
          };
        }) || [];
      tableData.push({
        item,
        rarity,
        ingredients,
      });
    }
  }
  return tableData;
}

function extractResourceData(document: Document) {
  const resources: ResourceObject[] = [];
  const allTables: HTMLTableElement[] = Array.from(
    document.querySelectorAll("table")
  );

  for (const table of allTables) {
    const headers = Array.from(table.tHead!.children[0].children);
    const resourceIndex = headers.findIndex((el) =>
      el.innerHTML.includes("Resource")
    );
    const biomeIndex = headers.findIndex((el) =>
      el.innerHTML.includes("Biome")
    );

    const rows = Array.from(table.tBodies[0].rows);

    for (const row of rows) {
      const resource = row.children[resourceIndex].textContent || "";
      const biome = row.children[biomeIndex].textContent || "";
      resources.push({
        resource,
        biome,
      });
    }
  }
  return resources;
}

async function seedData() {
  console.log("starting data fetching...");

  // setup our db
  const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN!);
  const db = client.db(ASTRA_DB_API_ENDPOINT!, { namespace: "lego_fortnite" });
  console.log(`Connected to DB ${db.id}`);

  // items first - these are what users want to create
  const itemCollection = await db.createCollection<ItemObject>(
    "lego_fortnite_items",
    {
      defaultId: { type: "uuidv7" },
      vector: {
        dimension: 1536,
        metric: "dot_product",
      },
      checkExists: false,
    }
  );
  console.log(itemCollection);

  for await (const url of itemUrls) {
    const document = await fetchFromWebOrCache(url);
    const data = extractItemData(document);

    // loop over to generate embedding and add to astra
    for (const itemObj of data) {
      const ingredientsToEmbed = itemObj.ingredients
        .map((ing) => ing!.name)
        .join(",");
      const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: ingredientsToEmbed,
        encoding_format: "float",
      });

      const vector = embedding.data[0].embedding;

      try {
        const res = await itemCollection.insertOne({
          $vector: vector,
          ...itemObj,
        });
        console.log(res);
      } catch (e) {
        console.log("error", e);
      }
    }
  }

  // then a collection of resources, which are the ingredients used to make the items
  const resourceCollection = await db.createCollection<ResourceObject>(
    "lego_fortnite_resources",
    {
      defaultId: { type: "uuidv7" },
      vector: {
        dimension: 1536,
        metric: "dot_product",
      },
      checkExists: false,
    }
  );
  console.log(resourceCollection);

  const resourceDoc = await fetchFromWebOrCache(resourceUrl);
  const resourceData = extractResourceData(resourceDoc);

  for (const resObj of resourceData) {
    const resStr = JSON.stringify(resObj);
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: resStr,
      encoding_format: "float",
    });

    const vector = embedding.data[0].embedding;

    try {
      const res = await resourceCollection.insertOne({
        $vector: vector,
        ...resObj,
      });
      console.log(res);
    } catch (e) {
      console.log("error", e);
    }
  }

  // close out the client since we're done!
  await client.close();
  console.log("data fetching complete!");
}

seedData();
