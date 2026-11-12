import { NameCard } from "@/components/name-card/NameCard";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Tools } from "@/components/sections/Tools";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { profile } from "@/data/profile";
import { getBio, getOrgs, getRepos } from "@/lib/github";

// has to be a plain number, keep it matching refreshSeconds in data/repos.ts
export const revalidate = 150;

export default async function Home() {
  const [repos, orgs, bio] = await Promise.all([getRepos(), getOrgs(), getBio()]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:grid md:grid-cols-[200px_1fr] md:gap-16">
      <Sidebar bio={bio} orgs={orgs} />
      <main className="min-w-0">
        <NameCard name={profile.name} background={profile.nameCardColor} />
        <About />
        <Tools />
        <Projects repos={repos} />
      </main>
    </div>
  );
}
