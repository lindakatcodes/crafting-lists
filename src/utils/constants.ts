import { type VectorizeDoc } from "@datastax/astra-db-ts";

export interface ItemObject extends VectorizeDoc {
  _id: string;
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

export interface ResourceObject extends VectorizeDoc {
  resource: string;
  biome: string;
}

export const rarityOrder = ["Common", "Uncommon", "Rare", "Epic"];
