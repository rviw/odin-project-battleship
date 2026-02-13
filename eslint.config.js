import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["dist/**", "coverage/**"],
  },
  {
    files: ["**/*.js"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["src/**/*.js"],
    ignores: ["src/**/*.test.js"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["**/*.test.js"],
    languageOptions: { globals: globals.jest },
  },
  {
    files: ["webpack*.js", "*.config.js"],
    languageOptions: { globals: globals.node },
  },
]);
