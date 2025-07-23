import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { DIFFICULTY } from '../types';

export const themesTable = sqliteTable('themes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  difficulty: text('difficulty', { enum: DIFFICULTY }).notNull(),
  displayText: text('display_text').notNull(),
  aiCondition: text('ai_condition', { mode: 'json' }).notNull(),
});

export type Theme = typeof themesTable.$inferSelect;
export type NewTheme = typeof themesTable.$inferInsert;
