import { Heading } from "@/components/ui/Heading";
import { ToolsScroller } from "@/components/tools/ToolsScroller";
import { tools, toolsSpeed } from "@/data/tools";

export function Tools() {
  return (
    <section>
      <Heading>Utilities I use daily</Heading>
      <ToolsScroller tools={tools} seconds={toolsSpeed} />
    </section>
  );
}
