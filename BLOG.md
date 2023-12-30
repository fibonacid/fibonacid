# I Published my CV on NPM

A few months ago I decided to refresh my old CV made with Pages to something more personal. I decided that, since I'm a developer, it would be fun if my CV was generated from code. As many of my side projects go, I started with a simple idea, end I ended up with a riduculous overengineered solution that lead me to publishing the curriculum as an [NPM package](https://www.npmjs.com/package/@fibonacid/curriculum).

If you want to skip the story and see the result, run the following command:

```bash
npx @fibonacid/curriculum
```

If you just want to read the CV, you can see the web version [here](https://fibonacid.github.io/curriculum/).

## Writing

The CV is written inside the [README.md](https://github.com/fibonacid/curriculum/blob/18e569d9e58bf6ecccd2b1748591ef47ae828193/README.md) file of the project.
It's a simple markdown file that contains the usual sections of a CV: personal info, education, work experience, skills, etc.

```markdown
# Lorenzo Rivosecchi

I'm a Web Developer with 5 years of experience in the field. I'm currently working at [Assist Digital](https://assistdigital.com) as a Frontend Developer.
I have a background in Computer Music and my passions are music, technology and design.

[![Github](https://img.shields.io/badge/Github-black?logo=github)](https://github.com/fibonacid)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?logo=linkedin)](https://www.linkedin.com/in/lorenzo-rivosecchi/)
[![Blog](https://img.shields.io/badge/Blog-black?logo=devdotto)](https://dev.to/fibonacid)
[![X (formerly Twitter)](https://img.shields.io/twitter/follow/fibonacid)](https://twitter.com/fibonacid)
```

## Rendering

To render the file I used [unified](https://unifiedjs.com/), with the following plugins:

```javascript
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkGfm from "remark-gfm";

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeDocument)
  .use(rehypeFormat)
  .use(rehypeStringify);
```

The README.md is read and processed, then written to a file inside the `dist` folder.

```javascript
import { readFile, writeFile } from "node:fs/promises";

// Read the file and process it
const input = await readFile("README.md");
const file = await processor.process(input);

// Write the file to disk
const output = String(file);
await writeFile("dist/index.html", output);
```

## PDF

Since most job applications require a PDF version of the CV, I decided to use [Puppeteer](https://pptr.dev/) to generate it.

```javascript
import puppeteer from "puppeteer";

// Launch the headless browser and open a new page
const browser = await puppeteer.launch({
    headless: "new",
});
const page = await browser.newPage();

// Navigate to the generated HTML file and generate the PDF
await page.goto(`file://${process.cwd()}/dist/index.html`);
await page.pdf({
    path: "./dist/Curriculum.pdf",
    format: "A4",
});
```

Now i can execute the `build` script to get the PDF version:

```json
{
  "scripts": {
    "build": "node build.js"
  }
}
```

To make sure that the PDF is always up to date, I added a pre-commit hook that runs the build script before every commit.

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

yarn build 
```

## Styling

Since the `README` looked pretty good on Github, I decided to make my CV look exactly like that. Thankfully I found a package called [generate-github-markdown-css](https://www.npmjs.com/package/generate-github-markdown-css) that made it easy to grab the original CSS from Github and use it in my project.

```javascript
import githubMarkdownCss from 'generate-github-markdown-css';
import fs from "node:fs/promises";

async function main() {
  const css = await githubMarkdownCss({
    rootSelector = 'body',
  });
  await fs.writeFile("./assets/style.css", css);
}
```

To use the CSS in my HTML i just need to add it to the head of the document using `rehype-document`:

```javascript
const processor = unified()
  // other plugins
  .use(rehypeDocument, {
    css: "./assets/style.css",
    style,
  })
```

## Publishing

Since this CV will be distributed as a PDF, I need an automatic way to build and publish it somewhere for easy access. My first idea was to use Github Actions to build the pdf and upload it to a Google Drive folder, but the GDrive API is a bit of a pain to use, so I decided to publish it on NPM instead.
---

At this point I thought the work was almost done. My original idea was to let people download my CV using this commad:

```bash
npm install @fibonacid/curriculum
```

And include a postinstall script that would open the PDF in the browser:

```json
{
  "scripts": {
    "postinstall": "open node_modules/@fibonacid/curriculum/dist/Curriculum.pdf"
  }
}
```

This doesn't work for some reason, therefore I decided to create a simple CLI script that would ask the user where they want to store the file and if they want to open it immediately.

```javascript
const answers = await inquirer.prompt([
    {
      type: "input",
      name: "folder",
      message: "Where should I save the file?",
    },
    {
      type: "input",
      name: "filename",
      message: "How should I name the file?",
    },
    {
      type: "confirm",
      name: "open",
      message: "Do you want to read it now?",
    },
  ]);
```

To expose the CLI I just needed to add a `bin` field to the `package.json` file:

```json
{
  "bin": "./cli.js"
}
```

And that's it! Now I can publish my CV on NPM and let people download it with a simple command.

```bash
npx @fibonacid/curriculum

Need to install the following packages:
  @fibonacid/curriculum
Ok to proceed? (y) y

? Where should I save the file? /Users/lorenzo/Downloads
? How should I name the file? Curriculum.pdf
? Do you want to open the file? (Y/n) y
```

## Conclusion

This project was a lot of fun to build and I learned a lot of new things. I'm excited to build more stuff with Markdown and `unified` in the future. If you want to check out the full code, you can find it [here](https://github.com/fibonacid/curriculum)

