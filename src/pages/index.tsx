/* eslint-disable @typescript-eslint/no-misused-promises */
import { z } from "zod";
import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import { api } from "~/utils/api";

export const templateSchema = z.object({
  id: z.string(),
  elements: z.string(),
});

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
