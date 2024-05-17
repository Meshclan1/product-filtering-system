import { db } from "@/db";
import { ProductFilterValidator } from "@/lib/validators/product-validator";
import { NextRequest } from "next/server";

class Filter {
  private filters: Map<string, string[]> = new Map();

  hasFilter() {
    return this.filters.size > 0;
  }

  add(key: string, operator: string, value: string | number) {
    const filter = this.filters.get(key) || [];
    // ' colour = "white"  / price = 120  '
    filter.push(
      `${key} ${operator} ${typeof value === "number" ? value : `"${value}"`}`
    );
    this.filters.set(key, filter);
  }

  // color -> ['white', 'beige']
  // size -> ['L', 'S']

  addRaw(key: string, rawFilter: string) {
    this.filters.set(key, [rawFilter]);
  }

  // (color = 'white' or color = 'beige') AND (size = 'l')

  get() {
    const parts: string[] = [];
    this.filters.forEach((filter) => {
      const groupedValues = filter.join(` OR `);
      parts.push(`(${groupedValues})`);
    });
    return parts.join(" AND ");
  }
}

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { color, price, sort, size } = ProductFilterValidator.parse(
    body.filter
  );

  const products = await db.query({
    topK: 12,
    vector: [0, 0, 0],
    includeMetadata: true,
  });

  return new Response(JSON.stringify(products));
};
