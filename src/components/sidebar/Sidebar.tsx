import { profile } from "@/data/profile";
import type { Org } from "@/lib/github";
import { Avatar } from "./Avatar";
import { Links } from "./Links";
import { Orgs } from "./Orgs";

export function Sidebar({ bio, orgs }: { bio: string | null; orgs: Org[] }) {
  return (
    <aside className="mb-12 md:mb-0">
      <Avatar src={profile.avatar} alt={profile.name} />
      <h1 className="text-base font-medium text-neutral-900">{profile.name}</h1>
      <p className="mt-1 text-sm text-neutral-500">{bio ?? profile.tagline}</p>
      <Links />
      <Orgs orgs={orgs} />
    </aside>
  );
}
