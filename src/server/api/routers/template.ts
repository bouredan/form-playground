import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const templateSchema = z.object({
  id: z.string(),
  schema: z.string(),
  uiSchema: z.string(),
});

export const templateRouter = createTRPCRouter({
  add: publicProcedure.input(templateSchema).mutation(({ ctx, input }) => {
    return ctx.prisma.template.create({
      data: {
        id: input.id,
        schema: input.schema,
        uiSchema: input.uiSchema,
      },
    });
  }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return ctx.prisma.template.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
});
