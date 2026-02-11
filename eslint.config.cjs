/** @type {import('eslint').ESLintConfig} */
const nextConfig = require("@eslint/config-next");

module.exports = {
  ...nextConfig.default,
  rules: {
    ...nextConfig.default.rules,
    "@typescript-eslint/no-unused-vars": "warn",
    "react/no-unescaped-entities": "off",
  },
};
