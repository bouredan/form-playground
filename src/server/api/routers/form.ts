import { type Form as PrismaForm, type DynamicData } from "@prisma/client";
import { z } from "zod";
import { type Form } from "~/components/form";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getTemplate } from "./template";
import { prisma } from "~/server/db";
import { type DynamicDataSource } from "~/components/template";
import { getAddressById } from "./address";
import { getUserById } from "./user";
import { type DynamicDataArg, dynamicDataArgSchema } from "~/utils/form";

function transformForm(
  form: PrismaForm & { dynamicData: DynamicData[] }
): Form {
  return {
    ...form,
    formData: JSON.parse(form.formData) as Form["formData"],
    dynamicData: form.dynamicData,
  };
}

export const formRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        templateId: z.string(),
        dynamicDataArgs: z.array(dynamicDataArgSchema),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const template = await getTemplate(input.templateId, ctx.prisma);
      const dynamicData = await getDynamicData(input.dynamicDataArgs);
      return ctx.prisma.form.create({
        data: {
          templateId: template.id,
          formData: "{}",
          readonly: false,
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
          readonly: true,
          formData: input.formData,
        },
      });
    }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const formFromDb = await ctx.prisma.form.findUnique({
        where: {
          id: input.id,
        },
        include: {
          dynamicData: true,
        },
      });
      return formFromDb ? transformForm(formFromDb) : formFromDb;
    }),
});

const sources: Record<DynamicDataSource, (arg: any) => any> = {
  "billing-address": (arg: number) => {
    return getAddressById(arg, prisma);
  },
  "project-consultant": (arg: number) => {
    return getUserById(arg, prisma); // TODO project consultant
  },
};

async function getDynamicData(dynamicDataArgs: DynamicDataArg[]) {
  return await Promise.all(
    dynamicDataArgs.map(async (dynamicDataArg) => {
      const getDataFn = sources[dynamicDataArg.source];
      const data = await getDataFn(JSON.parse(dynamicDataArg.arg).id); // TODO fix
      return {
        elementId: dynamicDataArg.elementId,
        data: JSON.stringify(data),
      };
    })
  );
}
