import { ToolIcon } from "./ToolIcon";

interface ToolStackProps {
  tools: string[];
  className?: string;
}

export function ToolStack({ tools, className }: ToolStackProps) {
  return (
    <div className={`flex items-center justify-center gap-6 ${className}`}>
      {tools.map((tool) => (
        <ToolIcon key={tool} tool={tool} />
      ))}
    </div>
  );
}
