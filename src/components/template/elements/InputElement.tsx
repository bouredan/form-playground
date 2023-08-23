import { Input } from "~/components/ui/input";
import { type InputElement } from "..";

export function InputElement(props: InputElement) {
  return (
    <div key={props.name}>
      <label>{props.name}</label>
      <Input {...props} />
    </div>
  );
}
