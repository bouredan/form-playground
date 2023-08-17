import { type FieldProps } from "@rjsf/utils";

export function ImageBlock(props: FieldProps) {
  return (
    <img
      width={200}
      height={200}
      src="https://raw.githubusercontent.com/rjsf-team/react-jsonschema-form/59a8206e148474bea854bbb004f624143fbcbac8/packages/core/logo.png"
    />
  );
}
