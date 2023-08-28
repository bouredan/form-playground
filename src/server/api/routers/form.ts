import { type PrismaClient, Prisma } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getTemplate } from "./template";
import {
  type Template,
  type ProjectOption,
  type DynamicDataEntity,
} from "~/components/template";
import {
  type ProjectIncludingAll,
  getProjectIncludingAllById,
} from "./project";
import { getDynamicDataElementsFromTemplate } from "~/utils/template";

const formWithDynamicData = Prisma.validator<Prisma.FormDefaultArgs>()({
  include: { dynamicData: true },
});

export type FormWithDynamicData = Prisma.FormGetPayload<
  typeof formWithDynamicData
>;

const dynamicDataEntityArgsSchema = z.array(
  z.object({ project: z.number().optional(), user: z.number().optional() })
);
export type DynamicDataEntityArgs = z.infer<typeof dynamicDataEntityArgsSchema>;

// TODO change to discriminated union if needed
// const dynamicDataEntityArgSchema = z.discriminatedUnion("entity", [
//   z.object({ entity: z.literal("project"), projectId: z.number() }), // should use zod.pick for the literals
//   z.object({ entity: z.literal("user"), userId: z.number() }),
// ]);
// export type DynamicDataEntityArg = z.infer<typeof dynamicDataEntityArgSchema>;

// const dynamicDataEntityArgsSchema = z.array(dynamicDataEntityArgSchema);
// export type DynamicDataEntityArgs = z.infer<typeof dynamicDataEntityArgsSchema>;

// TODO check params from entities from template
export const formRouter = createTRPCRouter({
  createFromProject: publicProcedure
    .input(
      // params: any
      z.object({
        templateId: z.string(),
        dynamicDataEntityArgs: dynamicDataEntityArgsSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const template = await getTemplate(input.templateId, ctx.prisma);
      const dynamicData = await getTemplateDynamicData(
        template,
        input.dynamicDataEntityArgs,
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

// async function fetchDynamicDataEntity(entityArg: DynamicDataEntityArg, prisma: PrismaClient) {
//     switch(entityArg.entity) {
//       case "project":
//         return await getProjectIncludingAllById(entityArg.projectId, prisma);
//       case "user":
//         return await getProjectIncludingAllById(entityArg.userId, prisma);
//     }
// }

async function fetchDynamicDataEntities(
  entityArgs: DynamicDataEntityArgs,
  prisma: PrismaClient
) {
  return entityArgs.reduce(async (accPromise, entityArg) => {
    const acc = await accPromise;
    if (entityArg.project) {
      acc.project = await getProjectIncludingAllById(entityArg.project, prisma);
    }
    return acc;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, Promise.resolve({} as Record<DynamicDataEntity, any>));
}

async function getTemplateDynamicData(
  template: Template,
  entityArgs: DynamicDataEntityArgs,
  prisma: PrismaClient
) {
  const dynamicDataEntities = await fetchDynamicDataEntities(
    entityArgs,
    prisma
  );
  const dynamicDataElements = getDynamicDataElementsFromTemplate(template);
  return dynamicDataElements.map((element) => {
    const dynamicDataFn = projectOptionDataSources[element.entityOption];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const dynamicData = dynamicDataFn(dynamicDataEntities[element.entity]);
    return {
      elementId: element.id,
      data: JSON.stringify(dynamicData),
    };
  });
}
