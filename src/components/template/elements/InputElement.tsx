import { Input } from "~/components/ui/input";

/**
 * A FormInput component can handle a specific Zod type (e.g. "ZodBoolean")
 */
export type InputElementProps = {
  label: string;
  isRequired: boolean;
  fieldProps: object;
};

export function InputElement({
  label,
  isRequired,
  fieldProps,
}: InputElementProps) {
  return (
    <div>
      <label>
        {label}
        {isRequired && <span className="text-destructive"> *</span>}
      </label>
      <div>
        <Input type="text" {...fieldProps} />
      </div>
    </div>
  );
}
