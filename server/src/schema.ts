import { z } from 'zod';

// GitHub contribution types
export const githubContributionTypeSchema = z.enum([
  'commit',
  'comment',
  'pull_request'
]);

export type GitHubContributionType = z.infer<typeof githubContributionTypeSchema>;

// GitHub contribution schema
export const githubContributionSchema = z.object({
  id: z.number(),
  github_id: z.string(), // GitHub's unique identifier for the event
  username: z.string(),
  type: githubContributionTypeSchema,
  title: z.string(),
  description: z.string().nullable(),
  repository_name: z.string(),
  repository_url: z.string(),
  contribution_url: z.string(),
  created_at: z.coerce.date(),
  fetched_at: z.coerce.date()
});

export type GitHubContribution = z.infer<typeof githubContributionSchema>;

// Input schema for fetching contributions
export const fetchContributionsInputSchema = z.object({
  username: z.string(),
  limit: z.number().int().positive().optional().default(50)
});

export type FetchContributionsInput = z.infer<typeof fetchContributionsInputSchema>;

// Input schema for getting stored contributions
export const getContributionsInputSchema = z.object({
  username: z.string(),
  limit: z.number().int().positive().optional().default(50),
  type: githubContributionTypeSchema.optional()
});

export type GetContributionsInput = z.infer<typeof getContributionsInputSchema>;

// Response schema for contribution list
export const contributionsResponseSchema = z.object({
  contributions: z.array(githubContributionSchema),
  total_count: z.number(),
  username: z.string()
});

export type ContributionsResponse = z.infer<typeof contributionsResponseSchema>;