import { z } from "zod";
import {
  type DynamicDataElement,
  type DynamicDataSource,
} from "~/components/template";

export const dynamicDataArgSchema = z.object({
  elementId: z.string(),
  source: z.enum(["billing-address", "project-consultant"]), // TODO connect with existing type
  arg: z.string(),
});
export type DynamicDataArg = z.infer<typeof dynamicDataArgSchema>;

const billingAddressSchema = z.object({ id: z.number() });
const projectConsultantSchema = z.object({ id: z.number() });

const sources: Record<DynamicDataSource, z.AnyZodObject> = {
  "billing-address": billingAddressSchema,
  "project-consultant": projectConsultantSchema,
};

export function getDynamicDataArgInputs(
  dynamicDataElements: DynamicDataElement[]
) {
  const dynamicDataArgInputsSchema = z.object({});
  dynamicDataElements.forEach((dynamicDataElement) => {
    dynamicDataArgInputsSchema.merge(
      z.object({ [dynamicDataElement.id]: sources[dynamicDataElement.source] })
    );
  });
  return dynamicDataArgInputsSchema;
}
