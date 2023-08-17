import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import { type UiSchema, type RJSFSchema } from "@rjsf/utils";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { GridObjectFieldTemplate } from "~/components/templates/GridObjectFieldTemplate";
import { customFields } from "~/components/fields";

export default function TemplatePage() {
  const id = useRouter().query.id as string;
  const { data: template } = api.template.byId.useQuery(
    { id },
    { enabled: !!id }
  );

  const { mutate: addForm } = api.form.add.useMutation();

  if (!template) {
    return <div>loading</div>;
  }
  const schema = JSON.parse(template.schema) as RJSFSchema;
  const uiSchema = JSON.parse(template.uiSchema) as RJSFSchema;

  const templateEnhancedUiSchema: UiSchema = {
    ...uiSchema,
    "ui:ObjectFieldTemplate":
      schema?.template === "grid" ? GridObjectFieldTemplate : undefined,
  };

  return (
    <div className="p-20">
      <Form
        schema={schema}
        uiSchema={templateEnhancedUiSchema}
        validator={validator}
        fields={customFields}
        onSubmit={(e) => {
          console.log(e);
          addForm({
            templateId: template.id,
            formData: JSON.stringify(e.formData),
          });
        }}
      />
    </div>
  );
}
