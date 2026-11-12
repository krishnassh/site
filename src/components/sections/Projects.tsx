import { Heading } from "@/components/ui/Heading";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectsStrip } from "@/components/projects/ProjectsStrip";
import type { Repo } from "@/lib/github";

export function Projects({ repos }: { repos: Repo[] }) {
  return (
    <section className="pb-16">
      <div className="mx-auto max-w-4xl px-6">
        <Heading>Checkout some of my work</Heading>
      </div>
      <ProjectsStrip>
        {repos.map((repo, i) => (
          <ProjectCard key={repo.url} repo={repo} index={i} />
        ))}
      </ProjectsStrip>
    </section>
  );
}
