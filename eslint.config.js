module.exports = [
  {
    ignores: ["node_modules/**", "coverage/**"],
  },
  {
    files: ["src/features/feature28.js", "test/**/*.js", "scripts/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        AbortController: "readonly",
        Array: "readonly",
        Date: "readonly",
        Error: "readonly",
        Math: "readonly",
        Number: "readonly",
        Object: "readonly",
        Promise: "readonly",
        URL: "readonly",
        clearTimeout: "readonly",
        console: "readonly",
        createServer: "readonly",
        fetch: "readonly",
        module: "readonly",
        process: "readonly",
        require: "readonly",
        setTimeout: "readonly",
      },
    },
    rules: {
      curly: "error",
      eqeqeq: "error",
      "no-constant-condition": "error",
      "no-undef": "error",
      "no-unreachable": "error",
      "no-unused-vars": ["error", { args: "none" }],
    },
  },
];
