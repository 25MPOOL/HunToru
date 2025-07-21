import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default tseslint.config([
  // グローバル無視設定
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.wrangler/**",
      "**/build/**",
    ],
  },

  // 共通TypeScript設定
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^react", "^react-dom"], // React関連
            ["^@?\\w"], // 外部ライブラリ
            ["^@huntoru/"], // 内部パッケージ
            ["^[.]"], // 相対パス
          ],
        },
      ],
      "simple-import-sort/exports": "error",
    },
  },

  // Web App (React) 専用設定
  {
    files: ["apps/web/**/*.{ts,tsx,js,jsx}"],
    extends: [
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },

  // API (Node.js) 専用設定
  {
    files: ["apps/api/**/*.{ts,js}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
    },
  },
]);
