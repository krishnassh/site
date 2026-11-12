import { Heading } from "@/components/ui/Heading";
import { ProjectCard } from "@/components/projects/ProjectCard";
import type { Repo } from "@/lib/github";

export function Projects({ repos }: { repos: Repo[] }) {
  return (
    <section>
      <Heading>Checkout some of my work</Heading>
      <ul className="grid gap-4 sm:grid-cols-2">
        {repos.map((repo) => (
          <ProjectCard key={repo.url} repo={repo} />
        ))}
      </ul>
    </section>
  );
}
