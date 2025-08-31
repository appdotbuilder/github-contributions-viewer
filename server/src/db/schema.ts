import { serial, text, pgTable, timestamp, pgEnum, index } from 'drizzle-orm/pg-core';

// GitHub contribution type enum
export const contributionTypeEnum = pgEnum('contribution_type', [
  'commit',
  'comment', 
  'pull_request'
]);

// GitHub contributions table
export const githubContributionsTable = pgTable('github_contributions', {
  id: serial('id').primaryKey(),
  github_id: text('github_id').notNull().unique(), // GitHub's unique identifier for the event
  username: text('username').notNull(),
  type: contributionTypeEnum('type').notNull(),
  title: text('title').notNull(),
  description: text('description'), // Nullable by default
  repository_name: text('repository_name').notNull(),
  repository_url: text('repository_url').notNull(),
  contribution_url: text('contribution_url').notNull(),
  created_at: timestamp('created_at').notNull(), // When the contribution was made on GitHub
  fetched_at: timestamp('fetched_at').defaultNow().notNull(), // When we fetched this data
}, (table) => ({
  // Indexes for efficient querying
  usernameIdx: index('username_idx').on(table.username),
  typeIdx: index('type_idx').on(table.type),
  createdAtIdx: index('created_at_idx').on(table.created_at),
  usernameTypeIdx: index('username_type_idx').on(table.username, table.type)
}));

// TypeScript types for the table schema
export type GitHubContribution = typeof githubContributionsTable.$inferSelect; // For SELECT operations
export type NewGitHubContribution = typeof githubContributionsTable.$inferInsert; // For INSERT operations

// Important: Export all tables for proper query building
export const tables = { 
  githubContributions: githubContributionsTable 
};