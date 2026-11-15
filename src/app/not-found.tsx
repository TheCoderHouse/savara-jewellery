import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x py-40 text-center lg:pt-60">
      <p className="eyebrow">Error 404</p>
      <h1 className="font-display mt-4 text-6xl">This piece has slipped away</h1>
      <p className="mt-4 text-muted">The page you’re looking for isn’t here. Let’s find something beautiful instead.</p>
      <Link href="/collections/all" className="btn btn-dark mt-8">Browse the collection</Link>
    </div>
  );
}
