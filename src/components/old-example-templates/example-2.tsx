import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import { UiSchema, type RJSFSchema } from "@rjsf/utils";
import { api } from "~/utils/api";

const schema: RJSFSchema = {
  $id: "example-2",
  title: "Example2",
  type: "object",
  properties: {
    imageBlock: {
      type: "null",
    },
    addresses: {
      type: "array",
      items: {
        $ref: "#/definitions/address",
      },
    },
  },
  definitions: {
    address: {
      type: "object",
      properties: {
        street_address: { type: "string" },
        city: { type: "string" },
        state: { type: "string" },
      },
      required: ["street_address", "city", "state"],
    },
  },
};

// const uiSchema: UiSchema = {
//   imageBlock: {
//     "ui:field": "ImageField"
//   }
// };

export default function Example2Page() {
  const { data: template } = api.template.byId.useQuery({ id: "example-2" });
  if (!template) {
    return <div>loading</div>;
  }
  //console.log(JSON.stringify(schema));
  const schema = JSON.parse(template.schema) as RJSFSchema;
  const uiSchema = JSON.parse(template.uiSchema) as RJSFSchema;
  return (
    <div className="p-20">
      <Form schema={schema} uiSchema={uiSchema} validator={validator} />
    </div>
  );
}
