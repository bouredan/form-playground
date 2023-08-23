import { type Template as PrismaTemplate } from "@prisma/client";
import { z } from "zod";
import { type Template } from "~/components/template";
import { type TemplateElement } from "~/components/template/elements/InputElement";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const dynamicDataSchema = z.object({
  elementId: z.string(),
  formId: z.string(),
  data: z.string(),
});

function transformDynamicData(template: PrismaTemplate): Template {
  return {
    ...template,
    elements: JSON.parse(template.elements) as Array<TemplateElement>,
  };
}

export const dynamicDataRouter = createTRPCRouter({
  add: publicProcedure.input(dynamicDataSchema).mutation(({ ctx, input }) => {
    return ctx.prisma.dynamicData.create({
      data: { ...input },
    });
  }),
  byId: publicProcedure
    .input(z.object({ elementId: z.string(), formId: z.string() }))
    .query(async ({ input, ctx }) => {
      const dynamicData = await ctx.prisma.dynamicData.findUnique({
        where: {
          elementId_formId: {
            ...input,
          },
        },
      });
      return dynamicData ? transformDynamicData(dynamicData) : dynamicData;
    }),
});
