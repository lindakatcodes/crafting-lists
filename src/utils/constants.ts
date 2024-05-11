import { type VectorDoc } from "@datastax/astra-db-ts";

export interface ItemObject extends VectorDoc {
  _id: {
    $uuid: string;
  };
  item: string;
  rarity: string;
  ingredients: Array<
    | {
        qty: number;
        name: string;
      }
    | undefined
  >;
}

export interface ResourceObject extends VectorDoc {
  _id: {
    $uuid: string;
  };
  resource: string;
  biome: string;
}
