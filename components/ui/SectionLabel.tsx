export default function SectionLabel({
  index,
  text,
  align = "left",
}: {
  index?: string;
  text: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={`tracked-label flex items-center gap-3 text-[11px] text-fg-muted ${
        align === "center" ? "justify-center" : ""
      }`}
    >
      {index ? <span>{index}</span> : null}
      {index ? <span className="h-px w-6 bg-border-strong" /> : null}
      <span>{text}</span>
    </div>
  );
}
