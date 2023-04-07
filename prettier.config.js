module.exports = {
  printWidth: 120,
  quoteProps: "preserve",
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
  plugins: [require("@trivago/prettier-plugin-sort-imports"), require("prettier-plugin-tailwindcss")],
  tailwindConfig: "./tailwind.config.js",
  "arrowParens": "always",
  "tabWidth": 2,
  "trailingComma": "none"
};
