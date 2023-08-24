import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const dynamicDataSchema = z.object({
  elementId: z.string(),
  formId: z.string(),
  data: z.string(),
});

export const dynamicDataRouter = createTRPCRouter({
  add: publicProcedure.input(dynamicDataSchema).mutation(({ ctx, input }) => {
    return ctx.prisma.dynamicData.create({
      data: { ...input },
    });
  }),
  byId: publicProcedure
    .input(z.object({ elementId: z.string(), formId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.dynamicData.findUnique({
        where: {
          elementId_formId: {
            ...input,
          },
        },
      });
    }),
});
