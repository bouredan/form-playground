import { FormComponent } from "~/components/form/FormComponent";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

export default function FormPage() {
  const { query } = useRouter();
  const id = query.id as string;

  const { data: form } = api.form.byId.useQuery(
    {
      id,
    },
    { enabled: !!id }
  );

  const { data: template } = api.template.byId.useQuery(
    {
      id: form?.templateId ?? "",
    },
    { enabled: Boolean(form?.templateId) }
  );

  if (!form || !template) {
    return <div>loading data</div>;
  }

  return (
    <div className="p-20">
      <FormComponent form={form} template={template} />
    </div>
  );
}

// TODO signature ukladat jako obrazek, readonly mode,

// DONE natahnout data pri vytvareni a ulozit do db, window.print()
