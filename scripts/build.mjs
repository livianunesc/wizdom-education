import { build } from "vite";
import { copyFile, readFile, readdir } from "node:fs/promises";

await build();
const output = new URL("../dist/index.html", import.meta.url);
const html = await readFile(output, "utf8");
const outputs = await readdir(new URL("../dist/", import.meta.url));
if (outputs.length !== 1 || outputs[0] !== "index.html") {
  throw new Error(
    "The offline build must contain only index.html, with all assets embedded.",
  );
}
if (
  /<script\b[^>]*\bsrc\s*=|<link\b[^>]*\brel=["']stylesheet["']/i.test(html)
) {
  throw new Error(
    "The offline build still references external JavaScript or CSS.",
  );
}
await copyFile(output, new URL("../index.html", import.meta.url));
console.log(
  "\nWIZDOM pronta: abra index.html com dois cliques. Não precisa de servidor.",
);
