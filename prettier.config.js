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
  plugins: [require("prettier-plugin-tailwindcss"), require("@trivago/prettier-plugin-sort-imports")],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  "arrowParens": "always",
  "tabWidth": 2,
  "trailingComma": "none"
};
