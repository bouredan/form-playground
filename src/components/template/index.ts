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

export type DynamicDataElement = DynamicAddressElement | DynamicUserElement;

export type TemplateElementType = TemplateElement["type"];
export type DynamicDataElementEntity = DynamicDataElement["entity"];
export type DynamicDataSource = DynamicDataElement["source"];

export interface InputElement {
  type: "input";
  name: string;
}

export interface TextElement {
  type: "text";
  text: string;
}

export interface ImageElement {
  type: "image";
  src: string;
}

export interface Layout2Cols {
  type: "layout-2-cols";
  childrenElements: Array<TemplateElement>;
}

interface DynamicDataElementBase {
  type: "dynamic";
  id: string;
}

type AddressSource = "billing-address";

export interface DynamicAddressElement extends DynamicDataElementBase {
  entity: "address";
  source: AddressSource;
}

export interface DynamicUserElement extends DynamicDataElementBase {
  entity: "user";
  source: UserSource;
}

type UserSource = "project-consultant";

export interface SignatureElement {
  type: "signature";
}
