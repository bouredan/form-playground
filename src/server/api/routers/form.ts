import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const formSchema = z.object({
  templateId: z.string(),
  formData: z.string(),
});

export const formRouter = createTRPCRouter({
  add: publicProcedure.input(formSchema).mutation(({ ctx, input }) => {
    return ctx.prisma.form.create({
      data: {
        templateId: input.templateId,
        formData: input.formData,
      },
    });
  }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return ctx.prisma.form.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
});
