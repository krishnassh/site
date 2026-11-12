import { profile } from "@/data/profile";
import {
  extraRepos,
  hiddenOrgs,
  hiddenRepos,
  refreshSeconds,
} from "@/data/repos";

export type Repo = {
  owner: string;
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  image: string;
};

export type Org = {
  login: string;
  url: string;
  avatar: string;
  description: string | null;
};

const cache = { next: { revalidate: refreshSeconds } };

const lower = (list: string[]) => new Set(list.map((s) => s.toLowerCase()));

async function getText(url: string): Promise<string> {
  try {
    const res = await fetch(url, cache);
    return res.ok ? await res.text() : "";
  } catch {
    return "";
  }
}

async function api<T>(path: string): Promise<T | null> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  // optional, only needed if you hit the 60 req/hour limit
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  try {
    const res = await fetch(`https://api.github.com${path}`, {
      headers,
      ...cache,
    });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

// there's no api for pinned repos, so read them off the profile page
async function pinned(): Promise<string[]> {
  const html = await getText(`https://github.com/${profile.github}`);
  const found = html.matchAll(
    /href="\/([\w.-]+\/[\w.-]+)"[^>]*class="Link[^"]*text-bold/g,
  );
  return [...new Set([...found].map((m) => m[1]))];
}

// custom social preview if the repo has one, github's generated card if not
async function socialImage(slug: string): Promise<string> {
  const html = await getText(`https://github.com/${slug}`);
  const url = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
  return (
    url?.replace(/&amp;/g, "&") ??
    `https://opengraph.githubassets.com/1/${slug}`
  );
}

async function loadRepo(slug: string): Promise<Repo> {
  const [owner, name] = slug.split("/");
  const [info, image] = await Promise.all([
    api<{
      name: string;
      description: string | null;
      language: string | null;
      stargazers_count: number;
      forks_count: number;
      topics?: string[];
    }>(`/repos/${slug}`),
    socialImage(slug),
  ]);

  return {
    owner,
    name: info?.name ?? name,
    url: `https://github.com/${slug}`,
    description: info?.description ?? null,
    language: info?.language ?? null,
    stars: info?.stargazers_count ?? 0,
    forks: info?.forks_count ?? 0,
    topics: info?.topics ?? [],
    image,
  };
}

export async function getRepos(): Promise<Repo[]> {
  const slugs = [...(await pinned()), ...extraRepos];
  const hidden = lower(hiddenRepos);
  const seen = new Set<string>();

  const wanted = slugs.filter((slug) => {
    const key = slug.toLowerCase();
    if (seen.has(key) || hidden.has(key)) return false;
    seen.add(key);
    return true;
  });

  return Promise.all(wanted.map(loadRepo));
}

export async function getOrgs(): Promise<Org[]> {
  const orgs = await api<
    { login: string; avatar_url: string; description: string | null }[]
  >(`/users/${profile.github}/orgs`);
  const hidden = lower(hiddenOrgs);

  return (orgs ?? [])
    .filter((o) => !hidden.has(o.login.toLowerCase()))
    .map((o) => ({
      login: o.login,
      url: `https://github.com/${o.login}`,
      avatar: o.avatar_url,
      description: o.description,
    }));
}

export async function getBio(): Promise<string | null> {
  const user = await api<{ bio: string | null }>(`/users/${profile.github}`);
  return user?.bio?.trim() || null;
}
