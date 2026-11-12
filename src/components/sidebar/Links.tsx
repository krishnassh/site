import { Icon } from "@/components/ui/Icons";
import { links } from "@/data/links";

export function Links() {
  return (
    <nav className="mt-6 flex flex-col gap-1.5 text-sm">
      {links.map(({ label, href, icon }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("mailto:") ? undefined : "_blank"}
          rel="noopener"
          className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900"
        >
          <Icon name={icon} className="h-4 w-4 shrink-0 [&>svg]:h-full [&>svg]:w-full" />
          {label}
        </a>
      ))}
    </nav>
  );
}
