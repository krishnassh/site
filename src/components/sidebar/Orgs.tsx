import Image from "next/image";
import type { Org } from "@/lib/github";

export function Orgs({ orgs }: { orgs: Org[] }) {
  if (orgs.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="mb-3 text-sm font-medium text-neutral-900">Organizations</h2>
      <ul className="flex flex-wrap gap-2">
        {orgs.map((org) => (
          <li key={org.login}>
            <a
              href={org.url}
              target="_blank"
              rel="noopener"
              title={org.description ? `${org.login}: ${org.description}` : org.login}
            >
              <Image
                src={org.avatar}
                alt={org.login}
                width={64}
                height={64}
                className="h-8 w-8 rounded-md border border-neutral-200 transition-opacity hover:opacity-70"
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
