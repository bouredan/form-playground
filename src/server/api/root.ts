import { createTRPCRouter } from "~/server/api/trpc";
import { templateRouter } from "./routers/template";
import { formRouter } from "./routers/form";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  form: formRouter,
  template: templateRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
