import type { InputHTMLAttributes } from "react";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  wrapperClassName?: string;
};

export default function Field({
  label,
  id,
  name,
  wrapperClassName = "",
  className = "",
  ...props
}: FieldProps) {
  const inputId = id ?? name;
  return (
    <label
      htmlFor={inputId}
      className={`flex flex-col gap-2 ${wrapperClassName}`}
    >
      <span className="tracked-label text-[10px] text-fg-muted">{label}</span>
      <input
        id={inputId}
        name={name}
        className={`w-full border-b border-border-strong bg-transparent py-2 text-sm text-fg placeholder:text-fg-muted/60 focus:border-fg focus:outline-none ${className}`}
        {...props}
      />
    </label>
  );
}
