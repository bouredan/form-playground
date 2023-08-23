import { createElement, useRef } from "react";
import { ImageElement } from "../template/elements/ImageElement";
import { AddressElement } from "../template/elements/AddressElement";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

import { type Form } from ".";
import { Button } from "../ui/button";
import { InputElement } from "../template/elements/InputElement";
import { TextElement } from "../template/elements/TextElement";
import {
  type TemplateElementType,
  type Template,
  type Layout2Cols,
  type TemplateElement,
  type DynamicDataElementEntity,
} from "../template";
import { SignatureElement } from "../template/elements/SignatureElement";
import { api } from "~/utils/api";
import UserElement from "../template/elements/UserElement";
import { DynamicDataElement } from "../template/elements/DynamicDataElement";

interface FormComponentProps {
  form: Form;
  template: Template;
}

// TODO udelat conditional types dle type, aby props byly natypovane
export function FormComponent({ form, template }: FormComponentProps) {
  const formInputsRef = useRef(null);

  const { mutateAsync: submitForm } = api.form.submit.useMutation();

  const { register, handleSubmit, control } = useForm({ mode: "onChange" });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dynamicComponents: Record<DynamicDataElementEntity, React.FC<any>> = {
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
          {element.childrenElements?.map(renderElement)}
        </div>
      );
    },
    signature: SignatureElement,
    dynamic: DynamicDataElement,
  };

  const renderElement = (element: TemplateElement) => {
    let component = components[element.type];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let props: Record<string, any> = element;
    switch (element.type) {
      case "dynamic":
        component = dynamicComponents[element.entity];
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
          ...element,
          ...register(element.name),
          disabled: form.readonly,
        }; // TODO remove "type" property from props
        break;
    }
    return createElement(component, props);
  };

  const onSubmit = (data: unknown) => {
    if (form.readonly) {
      throw "form is readonly";
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
          <div>{template.elements.map(renderElement)}</div>
        </div>
        {!form.readonly && <Button type="submit">Submit</Button>}
        <Button onClick={() => window.print()}>Generate PDF</Button>
        <DevTool control={control} />
      </form>
    </div>
  );
}
