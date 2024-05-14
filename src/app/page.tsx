"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Filter } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { QueryResult } from "@upstash/vector";
import { ProductType } from "@/db";
import Product from "@/components/Products/Product";
import { metadata } from "./layout";

// a const value that never changes - we put in caps!
// the 'as const' lets typescript know that the following is always an array that can not be modified

const SORT_OPTIONS = [
  { name: "None", value: "none" },
  { name: "Price: Low to High", value: "price-asc" },
  { name: "Price: High to Low", value: "price-desc" },
] as const;

export default function Home() {
  const [filter, setFilter] = useState({
    sort: "none",
  });

  // the result of data fetching will be catched as 'products' in our queryKey

  // axios.post is data we will be sending
  // always include the http endpoint, and the data you will be sending

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axios.post<QueryResult<ProductType>[]>(
        "http://localhost:3000/api/products",
        {
          filter: {
            sort: filter.sort,
          },
        }
      );

      return data;
    },
  });

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          High-quality cotton selection
        </h1>
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="group inline-flex justify-center text-sm font-mediium text-gray-700 hover:text-gray-900">
              SORT
              <ChevronDown className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.name}
                  className={cn("text-left w-full block px-4 py-2 text-sm", {
                    "text-gray-900 bg-gray-100": option.value === filter.sort,
                    "text-gray-500": option.value !== filter.sort,
                  })}
                  onClick={() => {
                    setFilter((prev) => ({
                      ...prev,
                      sort: option.value,
                    }));
                  }}
                >
                  {option.name}
                </button>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <button className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      <section className="pb-24 pt-6">
        <div className="grid grid-cols-1 gap-x-8 gap-y-7 lg:grid-cols-4">
          <div></div>
          <ul className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products?.map((product) => (
              <Product product={product.metadata!} />
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

// Because we defined 'group' in our DropdownMenuTrigger, the same will apply to ChevronDown

// 'Align' in DropdownMenuContent determines the position of where the dropdown menu will open

// The cn function, short for "classnames," is a utility function used to conditionally concatenate CSS class names based on certain conditions.
