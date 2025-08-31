import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import schemas and handlers
import { 
  fetchContributionsInputSchema, 
  getContributionsInputSchema 
} from './schema';
import { fetchGitHubContributions } from './handlers/fetch_github_contributions';
import { getContributions } from './handlers/get_contributions';
import { getAhirreddyContributions } from './handlers/get_ahirreddy_contributions';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check endpoint
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Fetch fresh GitHub contributions for any user
  fetchGitHubContributions: publicProcedure
    .input(fetchContributionsInputSchema)
    .mutation(({ input }) => fetchGitHubContributions(input)),

  // Get stored contributions for any user
  getContributions: publicProcedure
    .input(getContributionsInputSchema)
    .query(({ input }) => getContributions(input)),

  // Get contributions specifically for 'ahirreddy' user
  getAhirreddyContributions: publicProcedure
    .query(() => getAhirreddyContributions()),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();