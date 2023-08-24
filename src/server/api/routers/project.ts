import { Prisma, type PrismaClient } from "@prisma/client";

const projectIncludingAll = Prisma.validator<Prisma.ProjectDefaultArgs>()({
  include: { consultant: true, onsiteAddress: true, billingAddress: true },
});

export type ProjectIncludingAll = Prisma.ProjectGetPayload<typeof projectIncludingAll>;

export async function getProjectIncludingAllById(id: number, prisma: PrismaClient) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      consultant: true,
      onsiteAddress: true,
      billingAddress: true,
    },
  });
  if (!project) {
    throw "project not found";
  }
  return project;
}
