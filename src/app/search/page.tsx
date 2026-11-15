import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchResults } from "./SearchResults";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <div className="pt-44">
      <Suspense fallback={<div className="container-x py-24 text-center text-muted">Searching…</div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
