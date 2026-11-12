import { languageColor } from "@/lib/languages";
import type { Repo } from "@/lib/github";
import { RepoImage } from "./RepoImage";

const repoIcon =
  "M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z";

const MAX_TOPICS = 4;

// repos come in github's pin order, which reads two per row. on wider screens
// the strip has two rows, so each card is placed by hand to read 1 2 / 3 4 and
// then carry on. on phones it is one row and the order stays as is
export function ProjectCard({ repo, index }: { repo: Repo; index: number }) {
  const {
    owner,
    name,
    url,
    description,
    language,
    stars,
    forks,
    topics,
    image,
  } = repo;

  return (
    <li
      style={
        {
          "--col": Math.floor(index / 4) * 2 + (index % 2) + 1,
          "--row": Math.floor((index % 4) / 2) + 1,
        } as React.CSSProperties
      }
      className="snap-start sm:[grid-column:var(--col)] sm:[grid-row:var(--row)] flex flex-col overflow-hidden rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
    >
      <a href={url} target="_blank" rel="noopener">
        <RepoImage src={image} name={`${owner}/${name}`} />
      </a>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2">
          <svg
            viewBox="0 0 16 16"
            width="16"
            height="16"
            className="shrink-0 fill-neutral-500"
          >
            <path d={repoIcon} />
          </svg>
          <a
            href={url}
            target="_blank"
            rel="noopener"
            className="break-words text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            {name}
          </a>
        </div>

        {description && (
          <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
            {description}
          </p>
        )}

        {topics.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {topics.slice(0, MAX_TOPICS).map((topic) => (
              <li
                key={topic}
                className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
              >
                {topic}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-4 pt-4 text-xs text-neutral-500 dark:text-neutral-400">
          {language && (
            <span className="flex items-center gap-1">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: languageColor(language) }}
              />
              {language}
            </span>
          )}
          {stars > 0 && <span>★ {stars}</span>}
          {forks > 0 && <span>⑂ {forks}</span>}
        </div>
      </div>
    </li>
  );
}
