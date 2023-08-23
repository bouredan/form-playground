import { type PrismaClient } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export function getAddressById(id: number, prisma: PrismaClient) {
  return prisma.address.findUnique({
    where: {
      id,
    },
  });
}

export const addressRouter = createTRPCRouter({
  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      return getAddressById(input.id, ctx.prisma);
    }),
});
