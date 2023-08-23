import { type ImageElement } from "..";

export function ImageElement(props: ImageElement) {
  return <img width={200} height={200} src={props.src} />;
}
