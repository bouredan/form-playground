import { z } from "zod";

export interface Template {
  id: string;
  elements: Array<TemplateElement>;
}

export type TemplateElement =
  | InputElement
  | TextElement
  | ImageElement
  | Layout2Cols
  | DynamicDataElement
  | SignatureElement;

export type TemplateElementType = TemplateElement["type"];
export interface InputElement {
  type: "input";
  name: string;
  label: string;
}

export interface TextElement {
  type: "text";
  text: string;
}

export interface ImageElement {
  type: "image";
  src: string;
  alt?: string;
}

export interface Layout2Cols {
  type: "layout-2-cols";
  childrenElements: Array<TemplateElement>;
}

export interface SignatureElement {
  type: "signature";
}

// Dynamic data section

interface DynamicDataElementBase {
  type: "dynamic";
  id: string;
}

const projectAddressOptions = ["billing-address", "onsite-address"] as const;
const projectAddressOptionSchema = z.enum(projectAddressOptions);
type ProjectAddressOption = z.infer<typeof projectAddressOptionSchema>;
export interface ProjectAddressElement extends DynamicDataElementBase {
  entity: "project";
  entityOption: ProjectAddressOption;
  component: "address";
}

const projectUserOptions = ["consultant"] as const;
const projectUserOptionSchema = z.enum(projectUserOptions);
type ProjectUserOption = z.infer<typeof projectUserOptionSchema>;
export interface DynamicUserElement extends DynamicDataElementBase {
  entity: "project";
  entityOption: ProjectUserOption;
  component: "user";
}

const projectOptionSchema = z.enum([
  ...projectAddressOptions,
  ...projectUserOptions,
]);
export type ProjectOption = z.infer<typeof projectOptionSchema>;

export type DynamicDataElement = ProjectAddressElement | DynamicUserElement;
export type DynamicDataEntity = DynamicDataElement["entity"];
export type DynamicDataComponent = DynamicDataElement["component"];
