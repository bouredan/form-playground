import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import { type RJSFSchema } from "@rjsf/utils";
import { api } from "~/utils/api";

interface Template extends RJSFSchema {
  template: string,
}

const schema: RJSFSchema = {
  $id: "example-3",
  title: "Example3",
  type: "object",
  properties: {
    name: { type: "string" },
    street_address: { type: "string" },
    city: { type: "string" },
    state: { type: "string" },
  },
  template: "grid",
};

// const uiSchema: UiSchema = {
//   "ui:ObjectFieldTemplate": GridObjectFieldTemplate,
// };



export default function Example3Page() {
  const { data: template } = api.template.byId.useQuery({ id: "example-3" });
  if (!template) {
    return <div>loading</div>;
  }
  //console.log(JSON.stringify(schema));
  const schema = JSON.parse(template.schema) as RJSFSchema;
  const uiSchema = JSON.parse(template.uiSchema) as RJSFSchema;
  return (
    <div className="p-20">
      <Form
        schema={schema}
        uiSchema={uiSchema}
        validator={validator}
      />
    </div>
  );
}
