import { z } from "zod";
import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import { templateExamples } from "~/utils/template-examples";

export const templateSchema = z.object({
  id: z.string(),
  elements: z.string(),
});

function App() {
  const { mutate: addTemplate } = api.template.upsert.useMutation();

  return (
    <div className="p-20">
      <AutoForm
        formSchema={templateSchema}
        onSubmit={(data) => addTemplate(data)}
        fieldConfig={{
          elements: {
            fieldType: "textarea",
          },
        }}
      >
        <AutoFormSubmit />
      </AutoForm>

      <Button
        onClick={() =>
          templateExamples.forEach((ex) =>
            addTemplate({ id: ex.id, elements: JSON.stringify(ex.elements) })
          )
        }
      >
        Save example templates
      </Button>
    </div>
  );
}

export default App;
