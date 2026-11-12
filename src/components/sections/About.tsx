import { Heading } from "@/components/ui/Heading";
import { profile } from "@/data/profile";

export function About() {
  return (
    <section>
      <Heading>A little about myself</Heading>
      <div className="space-y-2 text-sm leading-relaxed text-neutral-700">
        {profile.about.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </div>
    </section>
  );
}
