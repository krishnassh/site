# site

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/3bea2081-1832-4421-be52-2c629c0c7158" />



My personal site. Next.js, Tailwind, deployed on Vercel.

```sh
bun install
bun dev
```

## Editing

Content lives in `src/data`:

- `profile.ts` name, tagline, about text, avatar, name card colour
- `links.ts` sidebar links
- `tools.ts` the tools scroller (icons go in `public/tools`)
- `repos.ts` extra repos, hidden repos and orgs

Pinned repos, orgs and the bio come from GitHub and refresh every couple of
minutes. Set `GITHUB_TOKEN` if you run into the API rate limit.

The animated name card is in `src/components/name-card`.
