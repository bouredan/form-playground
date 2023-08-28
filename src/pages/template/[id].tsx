import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { type Template } from "~/components/template";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";

export default function CreateFormPage() {
  const { query } = useRouter();
  const id = query.id as string;

  const { data: template } = api.template.byId.useQuery(
    {
      id,
    },
    { enabled: !!id }
  );

  if (!template) {
    return <div>loading template</div>;
  }

  return (
    <div className="p-20">
      <CreateFormForm template={template} />
    </div>
  );
}

interface CreateFormFormValues {
  projectId: number;
}

function CreateFormForm({ template }: { template: Template }) {
  const router = useRouter();
  const { mutateAsync: createForm } = api.form.createFromProject.useMutation();

  const { register, handleSubmit } = useForm<CreateFormFormValues>();

  const onSubmit = async ({ projectId }: CreateFormFormValues) => {
    const form = await createForm({
      templateId: template.id,
      dynamicDataEntityArgs: [
        {
          project: projectId,
        },
      ],
    });
    void router.push(`/form/${form.id}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        type="number"
        {...register("projectId", { valueAsNumber: true })}
        placeholder="Zadejte id projektu"
      />
      <Button type="submit">Create form</Button>
    </form>
  );
}
