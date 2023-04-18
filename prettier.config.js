module.exports = {
  printWidth: 120,
  quoteProps: "preserve",
  semi: false,
  "arrowParens": "always",
  "tabWidth": 2,
  "trailingComma": "none",
  plugins: [require("@trivago/prettier-plugin-sort-imports"), require("prettier-plugin-tailwindcss")],
  importOrder: [
    "^react",
    "^next",
    "^@",
    "^(?<!(components|utils|data))/.*$",
    "^[A-Za-z0-9_-]*$",
    "^~",
    "^(components|utils|data)/.*$",
    "^[./]"
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  tailwindConfig: "./tailwind.config.js"
};
