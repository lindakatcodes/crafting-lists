import { type VectorDoc } from "@datastax/astra-db-ts";

export interface ItemObject extends VectorDoc {
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
  resource: string;
  biome: string;
}

export const rarityOrder = ["Common", "Uncommon", "Rare", "Epic"];
