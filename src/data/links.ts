import type { IconName } from "@/components/ui/Icons";

type Link = { label: string; href: string; icon: IconName };

export const links: Link[] = [
  { label: "Website", href: "https://krishnassh.github.io/", icon: "website" },
  { label: "GitHub", href: "https://github.com/krishnassh", icon: "github" },
  { label: "Twitter", href: "https://x.com/krishnassh", icon: "twitter" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/krishnassh/",
    icon: "linkedin",
  },
  {
    label: "Discord",
    href: "https://discord.com/users/877351272251023440",
    icon: "discord",
  },
  { label: "Email", href: "mailto:krishna.pytech@gmail.com", icon: "email" },
];
