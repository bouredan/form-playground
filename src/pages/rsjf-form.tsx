import Form from "@rjsf/core";
import {
  type UiSchema,
  type RJSFSchema,
} from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";

const schema: RJSFSchema = {
  title: "Example1",
  type: "object",
  required: ["title"],
  properties: {
    imageBlock: { type: "null" },
    done: { type: "boolean", title: "Done?", default: false },
    telephone: {
      type: "string",
      title: "Telephone",
      minLength: 10,
    },
  },
};

const uiSchema: UiSchema = {
  imageBlock: {
    "ui:title": "random",
    "ui:field": "image",
  },
};

const log = (type: string) => console.log.bind(console, type);

export default function RsjfFormPage() {
  return (
    <div>
      <Form
        schema={schema}
        uiSchema={uiSchema}
        validator={validator}
        onChange={log("changed")}
      />
    </div>
  );
}
