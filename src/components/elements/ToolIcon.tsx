// Using emoji/text placeholders for now - will be replaced with SVGs later
const TOOL_ICONS: Record<string, string> = {
  python: "\uD83D\uDC0D",
  sql: "\uD83D\uDDC4\uFE0F",
  excel: "\uD83D\uDCCA",
  powerbi: "\uD83D\uDCC8",
  tableau: "\uD83D\uDCC9",
  aws: "\u2601\uFE0F",
  snowflake: "\u2744\uFE0F",
  airflow: "\uD83C\uDF00",
  spark: "\u26A1",
  kafka: "\uD83D\uDCE8",
  github: "\uD83D\uDC19",
  linkedin: "\uD83D\uDCBC",
};

interface ToolIconProps {
  tool: keyof typeof TOOL_ICONS;
  label?: boolean;
  className?: string;
}

export function ToolIcon({ tool, label = true, className }: ToolIconProps) {
  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <span className="text-3xl">{TOOL_ICONS[tool]}</span>
      {label && <span className="text-xs font-medium capitalize">{tool}</span>}
    </div>
  );
}
