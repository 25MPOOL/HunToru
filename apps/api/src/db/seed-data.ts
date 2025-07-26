import type { NewTheme } from './schema';

export const themesToSeed: NewTheme[] = [
  // === EASY (抽象的・一般的なもの) ===
  { difficulty: 'EASY', theme: '何か四角いもの' },
  { difficulty: 'EASY', theme: '何か丸いもの' },
  { difficulty: 'EASY', theme: '何か食べ物' },
  { difficulty: 'EASY', theme: '何か飲み物' },
  { difficulty: 'EASY', theme: '何か植物' },
  { difficulty: 'EASY', theme: '何か布製のもの' },
  { difficulty: 'EASY', theme: '何か光るもの' },

  // === NORMAL (具体的なモノ) ===
  { difficulty: 'NORMAL', theme: '本' },
  { difficulty: 'NORMAL', theme: 'コップ' },
  { difficulty: 'NORMAL', theme: '時計' },
  { difficulty: 'NORMAL', theme: '鍵' },
  { difficulty: 'NORMAL', theme: '椅子' },
  { difficulty: 'NORMAL', theme: 'ペン' },
  { difficulty: 'NORMAL', theme: 'リモコン' },

  // === HARD (色 + 具体的なモノ) ===
  { difficulty: 'HARD', theme: '白い皿' },
  { difficulty: 'HARD', theme: '黒いリモコン' },
  { difficulty: 'HARD', theme: '茶色い椅子' },
  { difficulty: 'HARD', theme: '青い本' },
  { difficulty: 'HARD', theme: '緑の植物' },
  { difficulty: 'HARD', theme: '銀色のスプーン' },
  { difficulty: 'HARD', theme: '透明なコップ' },
];
