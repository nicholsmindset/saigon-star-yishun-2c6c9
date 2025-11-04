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
  // Custom rules for deployment readiness
  {
    rules: {
      // Reduce apostrophe escaping to warning (not deployment-blocking)
      'react/no-unescaped-entities': 'warn',
      // Allow 'any' type in admin code and third-party integrations
      '@typescript-eslint/no-explicit-any': 'warn',
      // Warn on unused variables instead of error
      '@typescript-eslint/no-unused-vars': 'warn',
      // Allow <img> elements temporarily (will migrate to Next.js Image)
      '@next/next/no-img-element': 'warn',
      // Google Font preconnect is already handled manually
      '@next/next/google-font-preconnect': 'warn',
    },
  },
]);

export default eslintConfig;
