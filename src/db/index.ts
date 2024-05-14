import { Index } from "@upstash/vector";
import * as dotenv from "dotenv";

dotenv.config();

export type ProductType = {
  id: string;
  imageId: string;
  name: string;
  size: "S" | "M" | "L";
  color: "white" | "beige" | "blue" | "green" | "purple";
  price: number;
};

export const db = new Index<ProductType>();

// this is the way we connect to our database in Upstash Vector. We just have to invoke it. It autoamatically pulls the required information from our .env file
