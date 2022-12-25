import { publicProcedure, router } from "../trpc";

export const appRouter = router({
  getAll: publicProcedure.query(({ ctx }) =>
    ctx.prisma.player.findMany({
      orderBy: {
        score: "desc",
      },
    })
  ),
  getTopThree: publicProcedure.query(({ ctx }) =>
    ctx.prisma.player.findMany({
      orderBy: {
        score: "desc",
      },
      take: 3,
    })
  ),
});

// export type definition of API
export type AppRouter = typeof appRouter;
