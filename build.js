import rehypeDocument from "rehype-document";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkGfm from "remark-gfm";
import Handlebars from "handlebars";
import { unified } from "unified";
import { reporter } from "vfile-reporter";
import { readFile, writeFile } from "node:fs/promises";
import { mkdirp, copy, emptyDir } from "fs-extra";
import puppeteer from "puppeteer";

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
	.use(remarkGfm)
	.use(remarkRehype)
	.use(rehypeDocument, {
		css: "./assets/style.css",
		style,
	})
	.use(rehypeFormat)
	.use(rehypeStringify);

async function main() {
	// clean dist
	await mkdirp("dist");
	await emptyDir("dist");

	// copy assets
	await copy("assets", "dist/assets");

	// generate README.md
	const templateSource = await readFile("README.hbs", "utf-8");
	const pinned = await readFile("pinned.json", "utf-8");
	const template = Handlebars.compile(templateSource);
	await writeFile("README.md", template({ pinned: JSON.parse(pinned) }));

	// generate index.html
	const input = await readFile("README.md");
	const file = await processor.process(input);
	console.error(reporter(file));
	const text = String(file);
	await writeFile("dist/index.html", text);

	// print pdf
	const browser = await puppeteer.launch({
		headless: "new",
	});
	const page = await browser.newPage();
	await page.goto(`file://${process.cwd()}/dist/index.html`);
	await page.pdf({
		path: "./dist/Curriculum.pdf",
		format: "A4",
		printBackground: true,
		margin: {
			top: "1cm",
			bottom: "1cm",
			left: "1cm",
			right: "1cm",
		},
	});
	await browser.close();
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
