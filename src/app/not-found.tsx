import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 text-sm text-neutral-700 dark:text-neutral-300">
      <p>Page not found.</p>
      <Link
        href="/"
        className="mt-2 inline-block text-neutral-500 dark:text-neutral-400 underline hover:text-neutral-900 dark:hover:text-neutral-100"
      >
        Back home
      </Link>
    </div>
  );
}
