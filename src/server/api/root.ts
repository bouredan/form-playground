import { createTRPCRouter } from "~/server/api/trpc";
import { templateRouter } from "./routers/template";
import { formRouter } from "./routers/form";
import { dynamicDataRouter } from "./routers/dynamicData";
import { addressRouter } from "./routers/address";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  form: formRouter,
  template: templateRouter,
  dynamicData: dynamicDataRouter,
  address: addressRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
