import { Heading } from "@/components/ui/Heading";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
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
      <div
        className={`grid gap-4 ${ids.length > 1 ? "sm:grid-cols-2" : ""}`}
      >
        {ids.map((id) => (
          <VideoEmbed key={id} id={id} title="Project showcase" />
        ))}
      </div>
    </section>
  );
}
