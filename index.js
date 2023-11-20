import { reporter } from "vfile-reporter";
import { remark } from "remark";
import remarkPresetLintMarkdownStyleGuide from "remark-preset-lint-markdown-style-guide";
import remarkHtml from "remark-html";
import { readFileSync, writeFileSync } from "node:fs";

remark()
  .use(remarkPresetLintMarkdownStyleGuide)
  .use(remarkHtml)
  .process(readFileSync("README.md"))
  .then((file) => {
    const text = String(file);
    writeFileSync("README.html", text);
    console.error(reporter(file));
  });
