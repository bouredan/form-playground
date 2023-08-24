import {
  type PrismaClient,
  Prisma,
} from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getTemplate } from "./template";
import { type Template, type ProjectOption } from "~/components/template";
import {
  type ProjectIncludingAll,
  getProjectIncludingAllById,
} from "./project";
import { getDynamicDataElementsFromTemplate } from "~/utils/template";

const formWithDynamicData = Prisma.validator<Prisma.FormDefaultArgs>()({
  include: { dynamicData: true },
});

export type FormWithDynamicData = Prisma.FormGetPayload<typeof formWithDynamicData>;

export const formRouter = createTRPCRouter({
  createFromProject: publicProcedure
    .input(
      z.object({
        templateId: z.string(),
        projectId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const template = await getTemplate(input.templateId, ctx.prisma);
      const dynamicData = await getTemplateDynamicData(
        template,
        input.projectId,
        ctx.prisma
      );
      return ctx.prisma.form.create({
        data: {
          templateId: template.id,
          formData: "{}",
          disabled: false,
          dynamicData: {
            create: dynamicData,
          },
        },
      });
    }),
  submit: publicProcedure
    .input(
      z.object({
        id: z.string(),
        formData: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.form.update({
        where: {
          id: input.id,
        },
        data: {
          disabled: true,
          formData: input.formData,
        },
      });
    }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.form.findUnique({
        where: {
          id: input.id,
        },
        include: {
          dynamicData: true,
        },
      });
    }),
});

// TODO maybe change to `return project[dynamicDataArg.entityOption]`
const projectOptionDataSources: Record<
  ProjectOption,
  (project: ProjectIncludingAll) => unknown
> = {
  "onsite-address": (project) => {
    return project.onsiteAddress;
  },
  "billing-address": (project) => {
    return project.billingAddress;
  },
  consultant: (project) => {
    return project.consultant;
  },
};

async function getTemplateDynamicData(
  template: Template,
  projectId: number,
  prisma: PrismaClient
) {
  const project = await getProjectIncludingAllById(projectId, prisma);
  const dynamicDataElements = getDynamicDataElementsFromTemplate(template);
  return dynamicDataElements.map((element) => {
    const dynamicDataFn = projectOptionDataSources[element.entityOption];
    const dynamicData = dynamicDataFn(project);
    return {
      elementId: element.id,
      data: JSON.stringify(dynamicData),
    };
  });
}
