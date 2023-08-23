import { type PrismaClient } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export function getUserById(id: number, prisma: PrismaClient) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

export const userRouter = createTRPCRouter({
  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => getUserById(input.id, ctx.prisma)),
});
