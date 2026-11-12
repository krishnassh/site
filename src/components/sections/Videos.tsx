import { Heading } from "@/components/ui/Heading";
import { videos } from "@/data/videos";

function videoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1) || null;
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    return u.pathname.match(/^\/(?:shorts|embed)\/([\w-]+)/)?.[1] ?? null;
  } catch {
    return null;
  }
}

export function Videos() {
  const ids = videos.map(videoId).filter((id): id is string => !!id);
  if (ids.length === 0) return null;

  return (
    <section className="mx-auto max-w-4xl px-6">
      <Heading>Showcasing my projects</Heading>
      <div className={`grid gap-4 ${ids.length > 1 ? "sm:grid-cols-2" : ""}`}>
        {ids.map((id) => (
          <div
            key={id}
            className="aspect-video overflow-hidden rounded-md border border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${id}`}
              title="YouTube video"
              loading="lazy"
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
