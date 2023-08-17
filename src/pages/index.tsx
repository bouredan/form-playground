/* eslint-disable @typescript-eslint/no-misused-promises */
import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import { templateSchema } from "~/server/api/routers/template";
import { api } from "~/utils/api";
function App() {
  const { mutate: addTemplate } = api.template.add.useMutation();

  return (
    <div className="p-20">
      <AutoForm
        formSchema={templateSchema}
        onSubmit={(data) => addTemplate(data)}
        fieldConfig={{
          schema: {
            fieldType: "textarea",
          },
          uiSchema: {
            fieldType: "textarea",
          },
        }}
      >
        <AutoFormSubmit />
      </AutoForm>
    </div>
  );
}

export default App;
