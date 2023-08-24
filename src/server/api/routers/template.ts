import {
  type PrismaClient,
  type Template as PrismaTemplate,
} from "@prisma/client";
import { z } from "zod";
import { type TemplateElement, type Template } from "~/components/template";
import { templateSchema } from "~/pages";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

function transformTemplate(template: PrismaTemplate): Template {
  return {
    ...template,
    elements: JSON.parse(template.elements) as Array<TemplateElement>,
  };
}

export async function getTemplate(id: string, prisma: PrismaClient) {
  const template = await prisma.template.findUnique({
    where: {
      id: id,
    },
  });
  if (!template) {
    throw "template not found";
  }
  return transformTemplate(template);
}

export const templateRouter = createTRPCRouter({
  upsert: publicProcedure.input(templateSchema).mutation(({ ctx, input }) => {
    return ctx.prisma.template.upsert({
      where: {
        id: input.id,
      },
      create: {
        id: input.id,
        elements: input.elements,
      },
      update: {
        elements: input.elements,
      },
    });
  }),
  addMany: publicProcedure.input(templateSchema).mutation(({ ctx, input }) => {
    return ctx.prisma.template.create({
      data: {
        id: input.id,
        elements: input.elements,
      },
    });
  }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return await getTemplate(input.id, ctx.prisma);
    }),
});
