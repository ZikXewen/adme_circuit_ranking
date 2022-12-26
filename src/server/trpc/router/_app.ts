import { z } from "zod";
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
  update: publicProcedure
    .input(z.object({ id: z.string(), name: z.string(), score: z.number() }))
    .mutation(({ ctx, input }) =>
      ctx.prisma.player.update({
        data: { name: input.name, score: input.score },
        where: {
          id: input.id,
        },
      })
    ),
  remove: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) =>
      ctx.prisma.player.delete({
        where: {
          id: input.id,
        },
      })
    ),
  create: publicProcedure
    .input(z.object({ name: z.string(), score: z.number() }))
    .mutation(({ ctx, input }) =>
      ctx.prisma.player.create({
        data: { name: input.name, score: input.score },
      })
    ),
});

// export type definition of API
export type AppRouter = typeof appRouter;
