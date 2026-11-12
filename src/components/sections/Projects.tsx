import { Heading } from "@/components/ui/Heading";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectsStrip } from "@/components/projects/ProjectsStrip";
import type { Repo } from "@/lib/github";

// the strip fills two rows per column, but repos come in github's pin order,
// which reads two per row. take them four at a time and swap the middle two
// so each block of four lays out as: 1 2 / 3 4
function asRows(repos: Repo[]): Repo[] {
  const out: Repo[] = [];
  for (let i = 0; i < repos.length; i += 4) {
    const block = repos.slice(i, i + 4);
    for (const j of [0, 2, 1, 3]) if (block[j]) out.push(block[j]);
  }
  return out;
}

export function Projects({ repos }: { repos: Repo[] }) {
  return (
    <section className="pb-16">
      <div className="mx-auto max-w-4xl px-6">
        <Heading>Checkout some of my work</Heading>
      </div>
      <ProjectsStrip>
        {asRows(repos).map((repo) => (
          <ProjectCard key={repo.url} repo={repo} />
        ))}
      </ProjectsStrip>
    </section>
  );
}
