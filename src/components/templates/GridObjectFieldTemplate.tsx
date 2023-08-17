import { type ObjectFieldTemplateProps } from "@rjsf/utils";

export function GridObjectFieldTemplate(props: ObjectFieldTemplateProps) {
  return (
    <div>
      {props.title}
      {props.description}
      <div className="grid grid-cols-2 gap-2">
        {props.properties.map((element) => (
          <div key={element.name}>{element.content}</div>
        ))}
      </div>
    </div>
  );
}
