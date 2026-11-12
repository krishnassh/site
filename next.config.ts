import type { NextConfig } from "next";

const githubImages = [
  "avatars.githubusercontent.com",
  "repository-images.githubusercontent.com",
  "opengraph.githubassets.com",
];

const config: NextConfig = {
  images: {
    remotePatterns: githubImages.map((hostname) => ({ protocol: "https", hostname })),
  },
};

export default config;
