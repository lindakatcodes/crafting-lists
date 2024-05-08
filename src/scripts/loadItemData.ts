/* 
  3. create vectors for objects
  4. store in astra

  swiftieGPT example:
  https://github.com/datastax/SwiftieGPT/blob/main/scripts/loadDb.ts

 tom scraper example:
 https://github.com/tvanantwerp/scraper-example?tab=readme-ov-file

 // TODO: Add these in phase 2 - builds is a list and upgrades is tables but totally different headings (and also needs text from above the table)
// "https://www.reddit.com/r/LEGOfortnite/wiki/index/recipes/builds/",
// "https://www.reddit.com/r/LEGOfortnite/wiki/index/upgrades/",
*/

import { existsSync, mkdirSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import axios, { AxiosError } from "axios";
import { JSDOM } from "jsdom";
import { DataAPIClient, Db } from "@datastax/astra-db-ts";
import "dotenv/config";

const __dirname = "./";

const itemUrls = [
  "https://www.reddit.com/r/LEGOfortnite/wiki/index/recipes/crafting/equipment/",
  "https://www.reddit.com/r/LEGOfortnite/wiki/index/recipes/crafting/tools/",
  "https://www.reddit.com/r/LEGOfortnite/wiki/index/recipes/crafting/charms/",
  "https://www.reddit.com/r/LEGOfortnite/wiki/index/recipes/crafting/weapons/",
  "https://www.reddit.com/r/LEGOfortnite/wiki/index/recipes/machinery/",
];

const { ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_API_ENDPOINT } = process.env;

let db: Db;

if (ASTRA_DB_API_ENDPOINT && ASTRA_DB_APPLICATION_TOKEN) {
  const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
  db = client.db(ASTRA_DB_API_ENDPOINT);
} else {
  console.error("Missing environment variables, cannot connect to AstraDB");
}

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
  if (!existsSync("./.cache")) {
    mkdirSync(".cache");
  }
  console.log(`Getting data for ${url}...`);
  if (
    !ignoreCache &&
    existsSync(
      resolve(__dirname, `.cache/${Buffer.from(url).toString("base64")}.html`)
    )
  ) {
    console.log(`I read ${url} from cache`);
    const HTMLData = await readFile(
      resolve(__dirname, `.cache/${Buffer.from(url).toString("base64")}.html`),
      { encoding: "utf8" }
    );
    const dom = new JSDOM(HTMLData);
    return dom.window.document;
  } else {
    console.log(`I fetched ${url} fresh`);
    const HTMLData = await fetchPage(url);
    if (!ignoreCache && HTMLData) {
      writeFile(
        resolve(
          __dirname,
          `.cache/${Buffer.from(url).toString("base64")}.html`
        ),
        HTMLData,
        { encoding: "utf8" }
      );
    }
    const dom = new JSDOM(HTMLData);
    return dom.window.document;
  }
}

function extractData(document: Document) {
  const tableData = [];
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
      const item = row.children[itemIndex].textContent;
      const rarity = row.children[rareIndex].textContent;
      const ingredients = row.children[ingredientIndex].innerHTML
        .split(", ")
        .map((pair) => {
          if (pair === "") return;
          const splitPair = pair.split(/(\d+)/);
          return {
            qty: Number(splitPair[1]),
            name: splitPair[2].trim(),
          };
        });
      tableData.push({
        item,
        rarity,
        ingredients,
      });
    }
  }
  return tableData;
}

async function getData() {
  console.log("starting data fetching...");
  const allItemData = [];

  const collection = await db.collection("lego-fortnite");

  for await (const url of itemUrls) {
    const document = await fetchFromWebOrCache(url);
    const data = extractData(document);
    allItemData.push(...data);
  }

  console.log("data fetching complete!");
}

getData();



