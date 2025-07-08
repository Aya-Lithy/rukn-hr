import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import globals from "globals";

const fileName = fileURLToPath(import.meta.url);
const dirName = dirname(fileName);

const compat = new FlatCompat({
  baseDirectory: dirName,
  recommendedConfig: js.configs.recommended,
});

export default [
  // 0️⃣  Base ESLint rules
  js.configs.recommended,

  // 1️⃣  Main preset stack (order matters)
  ...compat.extends(
    "plugin:@next/next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript"
  ),
  // 2️⃣  Prettier – disable conflicting stylistic rules
  prettier,

  // 3️⃣  Project-wide tweaks
  {
    plugins: {
      import: (await import("eslint-plugin-import")).default,
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": { typescript: {} },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
          ],
        },
      ],
    },
  },

  // 4️⃣  Overrides ------------------------------------------------------

  // ⬅ Build / config files – Node globals, script mode
  {
    files: ["**/*.config.{js,cjs,mjs,ts,tsx}", "**/next.config.{js,mjs,ts}"],
    languageOptions: {
      sourceType: "script",
      globals: globals.node, // use Node global set
    },
  },

  // 5️⃣  Ignores --------------------------------------------------------
  {
    ignores: [".next/**", "dist/**", "coverage/**", "node_modules/**"],
  },
];
