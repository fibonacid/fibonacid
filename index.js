import rehypeDocument from "rehype-document";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { reporter } from "vfile-reporter";

import { readFileSync, writeFileSync } from "node:fs";

unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeDocument)
  .use(rehypeFormat)
  .use(rehypeStringify)
  .process(readFileSync("README.md"))
  .then((file) => {
    const text = String(file);
    writeFileSync("README.html", text);
    console.error(reporter(file));
  });
