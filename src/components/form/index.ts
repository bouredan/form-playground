import { type DynamicData } from "@prisma/client";

export interface Form {
  id: string;
  templateId: string;
  formData: Record<string, unknown>;
  readonly: boolean,
  dynamicData?: DynamicData[];
}

// TODO 1. vyresit dynamicke data

// image, text, dynamicky data, inputy (string, checkbox), layout
