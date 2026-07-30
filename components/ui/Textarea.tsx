import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  wrapperClassName?: string;
};

export default function Textarea({
  label,
  id,
  name,
  wrapperClassName = "",
  className = "",
  ...props
}: TextareaProps) {
  const inputId = id ?? name;
  return (
    <label
      htmlFor={inputId}
      className={`flex flex-col gap-2 ${wrapperClassName}`}
    >
      <span className="tracked-label text-[10px] text-fg-muted">{label}</span>
      <textarea
        id={inputId}
        name={name}
        rows={4}
        className={`w-full resize-none border-b border-border-strong bg-transparent py-2 text-sm text-fg placeholder:text-fg-muted/60 focus:border-fg focus:outline-none ${className}`}
        {...props}
      />
    </label>
  );
}
