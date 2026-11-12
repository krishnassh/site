const colors: Record<string, string> = {
  Go: "#00ADD8",
  Kotlin: "#A97BFF",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  Java: "#b07219",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#663399",
  Lua: "#000080",
  Dart: "#00B4AB",
  Svelte: "#ff3e00",
};

export const languageColor = (lang: string | null) =>
  (lang && colors[lang]) || "#8b949e";
