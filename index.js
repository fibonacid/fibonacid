import rehypeDocument from "rehype-document";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { reporter } from "vfile-reporter";
import githubMarkdownCss from "generate-github-markdown-css";
import { readFile, writeFile } from "node:fs/promises";

const style = `
body {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 980px;
  margin: 0 auto;
  padding: 45px;
}

@media (max-width: 767px) {
  body {
    padding: 15px;
  }
}`;

const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeDocument, {
    css: "./style.css",
    style,
  })
  .use(rehypeFormat)
  .use(rehypeStringify);

async function main() {
  // generate index.html
  const input = await readFile("README.md");
  const file = await processor.process(input);
  console.error(reporter(file));
  const text = String(file);
  await writeFile("index.html", text);

  // generate style.css
  if (readFile("style.css")) return;
  const css = await githubMarkdownCss({
    dark: "dark",
    rootSelector: "body",
  });
  await writeFile("style.css", css);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
