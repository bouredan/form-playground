import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import { type RJSFSchema } from "@rjsf/utils";
import { api } from "~/utils/api";

const schema: RJSFSchema = {
  $id: "example-1",
  title: "Example1",
  type: "object",
  required: ["agree"],
  properties: {
    agree: { type: "boolean", title: "Do you agree?" },
  },
  dependencies: {
    agree: {
      oneOf: [
        {
          properties: {
            agree: {
              const: true,
            },
            subject: {
              type: "string",
            },
            recipients: {
              type: "array",
              title: "email recipients",
              items: {
                type: "string",
              },
              uniqueItems: true,
            },
          },
        },
        {
          properties: {
            agree: {
              const: false,
            },
          },
        },
      ],
    },
  },
};

const uiSchema = {
  agree: {
    "ui:classNames":
      "rounded border-gray-300 text-indigo-600 focus:ring-indigo-600",
  },
};

export default function Example1Page() {
  const { data: template } = api.template.byId.useQuery({ id: "example-1" });
  if (!template) {
    return <div>loading</div>;
  }
  // console.log(JSON.stringify(schema))
  const schema = JSON.parse(template.schema) as RJSFSchema;
  const uiSchema = JSON.parse(template.uiSchema) as RJSFSchema;
  return (
    <div className="p-20">
      <Form schema={schema} uiSchema={uiSchema} validator={validator} />
    </div>
  );
}
