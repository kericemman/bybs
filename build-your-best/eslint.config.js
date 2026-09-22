import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

const jsxSafetyPlugin = {
  rules: {
    "no-undefined-components": {
      meta: {
        type: "problem",
        schema: [],
        messages: {
          undefinedComponent: "'{{name}}' is not defined or imported.",
        },
      },
      create(context) {
        return {
          JSXOpeningElement(node) {
            if (node.name.type !== "JSXIdentifier" || !/^[A-Z]/.test(node.name.name)) return;

            let scope = context.sourceCode.getScope(node);
            while (scope) {
              if (scope.set.has(node.name.name)) return;
              scope = scope.upper;
            }

            context.report({
              node: node.name,
              messageId: "undefinedComponent",
              data: { name: node.name.name },
            });
          },
        };
      },
    },
  },
};

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    plugins: {
      "jsx-safety": jsxSafetyPlugin,
    },
    rules: {
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
      "jsx-safety/no-undefined-components": "error",
    },
  },
]);
