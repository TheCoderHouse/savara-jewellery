"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { search } from "@/lib/products";
import { Listing } from "@/components/Listing";
import { useStore } from "@/context/store";

export function SearchResults() {
  const q = useSearchParams().get("q") ?? "";
  const { setSearchOpen } = useStore();
  const results = useMemo(() => search(q), [q]);

  return (
    <>
      <div className="container-x pb-10 text-center">
        <p className="eyebrow">Search results</p>
        <h1 className="font-display mt-3 text-5xl sm:text-6xl">{q ? <>“{q}”</> : "Search the collection"}</h1>
        <p className="mt-3 text-muted">{q ? `${results.length} ${results.length === 1 ? "piece" : "pieces"} found` : "Type a style, metal or gemstone."}</p>
        <button onClick={() => setSearchOpen(true)} className="btn btn-outline-dark mt-6">
          New search
        </button>
      </div>
      {results.length > 0 && <Listing key={q} products={results} />}
      {q && results.length === 0 && (
        <p className="container-x pb-32 text-center text-muted">Nothing matched. Try “diamond”, “pearl”, “gold bangles” or “bridal”.</p>
      )}
    </>
  );
}
