import { useRouter } from "next/router";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import {
  DynamicDataSource,
  type DynamicDataElement,
  type Template,
} from "~/components/template";
import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { RouterInputs, api } from "~/utils/api";
import { DynamicDataArg, getDynamicDataArgInputs } from "~/utils/form";
import { getDynamicDataElementsFromTemplate } from "~/utils/template";

const template1: Template = {
  id: "template-1",
  elements: [
    { type: "text", text: "Nazev template" },
    {
      type: "text",
      text: "tohle je nejakej description text",
      // className: "text-blue", this doesn't work now cause tailwind doesn't recognize dynamic classes like this but there should be a way how to do it
    },
    {
      type: "layout-2-cols",
      childrenElements: [
        {
          type: "image",
          src: "https://raw.githubusercontent.com/rjsf-team/react-jsonschema-form/59a8206e148474bea854bbb004f624143fbcbac8/packages/core/logo.png",
        },
        {
          type: "image",
          src: "https://raw.githubusercontent.com/rjsf-team/react-jsonschema-form/59a8206e148474bea854bbb004f624143fbcbac8/packages/core/logo.png",
        },
      ],
    },
    {
      type: "layout-2-cols",
      childrenElements: [
        {
          type: "dynamic",
          id: "address-1",
          entity: "address",
          source: "billing-address",
        },
        {
          type: "dynamic",
          id: "user-1",
          entity: "user",
          source: "project-consultant",
        },
      ],
    },
    {
      type: "input",
      name: "name",
    },
    {
      type: "input",
      name: "surname",
    },
    {
      type: "signature",
    },
  ],
};

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

  const dynamicDataElements = getDynamicDataElementsFromTemplate(template);

  return (
    <div className="p-20">
      <CreateFormForm
        template={template}
        dynamicDataElements={dynamicDataElements}
      />
    </div>
  );
}

interface CreateFormValues {
  dynamicDataArgs: DynamicDataArg[];
}

function CreateFormForm({
  template,
  dynamicDataElements,
}: {
  template: Template;
  dynamicDataElements: DynamicDataElement[];
}) {
  const router = useRouter();
  const { mutateAsync: createForm } = api.form.create.useMutation();

  const { register, control, handleSubmit } = useForm<CreateFormValues>({
    defaultValues: {
      dynamicDataArgs: dynamicDataElements.map((dynamicDataElement) => ({
        elementId: dynamicDataElement.id,
        source: dynamicDataElement.source,
        arg: "",
      })),
    },
  });

  const { fields } = useFieldArray({
    name: "dynamicDataArgs",
    control,
  });

  const onSubmit = async (data: CreateFormValues) => {
    const form = await createForm({
      templateId: template.id,
      dynamicDataArgs: data.dynamicDataArgs,
    });
    void router.push(`/form/${form.id}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-3">
          <Input
            {...register(`dynamicDataArgs.${index}.elementId`)}
            placeholder="id"
            disabled={true}
          />
          <Input
            {...register(`dynamicDataArgs.${index}.source`)}
            placeholder="source"
            disabled={true}
          />
          <Input
            {...register(`dynamicDataArgs.${index}.arg`)}
            placeholder="arg"
          />
        </div>
      ))}
      <Button type="submit">Create form</Button>
    </form>
  );
}

function CreateFormAutoForm({
  template,
  dynamicDataElements,
}: {
  template: Template;
  dynamicDataElements: DynamicDataElement[];
}) {
  const router = useRouter();
  const { mutateAsync: createForm } = api.form.create.useMutation();

  const dynamicDataArgInputsSchema =
    getDynamicDataArgInputs(dynamicDataElements);

  return (
    <AutoForm
      formSchema={dynamicDataArgInputsSchema}
      onSubmit={(data) => {
        console.log(data);
      }}
    >
      <AutoFormSubmit>Create form</AutoFormSubmit>
    </AutoForm>
  );
}
