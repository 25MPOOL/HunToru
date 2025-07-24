export const DIFFICULTY = ['EASY', 'NORMAL', 'HARD'] as const;

export type Difficulty = (typeof DIFFICULTY)[number];
