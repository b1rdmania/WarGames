import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Theme coherence enforcement rules
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/labs/_archive/**"],
              message: "Do not import from archived labs. Use active themes: terminal, geocities, norad",
            },
            {
              group: ["**/docs/_archive/**"],
              message: "Do not import from archived documentation.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
