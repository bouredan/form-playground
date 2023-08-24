import { createElement, useRef } from "react";
import { ImageElement } from "../template/elements/ImageElement";
import { AddressElement } from "../template/elements/AddressElement";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

import { Button } from "../ui/button";
import {
  InputElement,
  type InputElementProps,
} from "../template/elements/InputElement";
import { TextElement } from "../template/elements/TextElement";
import {
  type TemplateElementType,
  type Template,
  type Layout2Cols,
  type TemplateElement,
  type DynamicDataComponent,
} from "../template";
import { api } from "~/utils/api";
import UserElement from "../template/elements/UserElement";
import { DynamicDataElement } from "../template/elements/DynamicDataElement";
import { type FormWithDynamicData } from "~/server/api/routers/form";
import { SignatureElement } from "../template/elements/SignatureElement";

interface FormComponentProps {
  form: FormWithDynamicData;
  template: Template;
}

export function FormComponent({ form, template }: FormComponentProps) {
  const formInputsRef = useRef(null);

  const utils = api.useContext();
  const { mutateAsync: submitForm } = api.form.submit.useMutation({
    onSuccess: (data, variables) => {
      void utils.form.byId.invalidate({ id: variables.id });
    },
  });

  const { register, handleSubmit, control } = useForm({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    defaultValues: JSON.parse(form.formData),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dynamicDataComponents: Record<DynamicDataComponent, React.FC<any>> = {
    address: AddressElement,
    user: UserElement,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const components: Record<TemplateElementType, React.FC<any>> = {
    input: InputElement,
    text: TextElement,
    image: ImageElement,
    "layout-2-cols": (element: Layout2Cols) => {
      return (
        <div className="md:grid md:grid-cols-2">
          {renderElements(element.childrenElements, form)}
        </div>
      );
    },
    signature: SignatureElement,
    dynamic: DynamicDataElement,
  };

  const renderElements = (
    elements: TemplateElement[],
    form: FormWithDynamicData
  ) => {
    return elements.map((element, i) => (
      <div key={i}>{renderElement(element, form)}</div>
    ));
  };

  const renderElement = (
    element: TemplateElement,
    form: FormWithDynamicData
  ) => {
    let component = components[element.type];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let props: Record<string, any> = element;
    switch (element.type) {
      case "dynamic":
        component = dynamicDataComponents[element.component];
        const elementDynamicData = form.dynamicData?.find(
          (v) => v.elementId === element.id
        );
        if (!elementDynamicData) {
          throw "dynamic data not found";
        }
        props = {
          ...element,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data: JSON.parse(elementDynamicData.data),
        };
        break;
      case "input":
        props = {
          label: element.label,
          isRequired: true,
          fieldProps: { ...register(element.name), disabled: form.disabled },
        } satisfies InputElementProps;
        break;
      case "signature":
        // TODO pass onSubmit
        props = {
          disabled: form.disabled,
        };
        break;
    }
    return createElement(component, props);
  };

  const onSubmit = (data: unknown) => {
    if (form.disabled) {
      throw "form is disabled";
    }
    console.log(data);
    void submitForm({
      id: form.id,
      formData: JSON.stringify(data),
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div id="pdf" ref={formInputsRef}>
          <div>{form.id}</div>
          <div>{template.id}</div>
          <div className="[&>*]:border [&>*]:p-4">
            {renderElements(template.elements, form)}
          </div>
        </div>
        {!form.disabled && <Button type="submit">Submit</Button>}
        <Button onClick={() => window.print()}>Generate PDF</Button>
        <DevTool control={control} />
      </form>
    </div>
  );
}
