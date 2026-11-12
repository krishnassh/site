import { Icon } from "@/components/ui/Icons";
import { links } from "@/data/links";

export function Links() {
  return (
    <nav className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm md:mt-6 md:flex-col md:gap-1.5">
      {links.map(({ label, href, icon }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("mailto:") ? undefined : "_blank"}
          rel="noopener"
          className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          <Icon
            name={icon}
            className="h-4 w-4 shrink-0 [&>svg]:h-full [&>svg]:w-full"
          />
          {label}
        </a>
      ))}
    </nav>
  );
}
