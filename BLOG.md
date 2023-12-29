# I Published my CV on NPM

A few months ago I decided to refresh my old CV made with Apple Pages to something more personal. I decided that, since I'm a developer, it would be fun if my CV was generated from code. As many of my side projects go, I started with a simple idea, end I ended up with a riduculous overengineered solution that lead me to publishing my CV on NPM.

## Writing

The CV is written inside the README.md file of the project.
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

The README of the repository is rendered to HTML using `unified` with the following plugins:

```javascript
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeDocument)
  .use(rehypeFormat)
  .use(rehypeStringify);
```

The HTML is written to a file and then converted to PDF using `puppeteer`.

```javascript
const browser = await puppeteer.launch({
    headless: "new",
});

const page = await browser.newPage();

await page.goto(`file://${process.cwd()}/dist/index.html`);

await page.pdf({
    path: "./dist/Curriculum.pdf",
    format: "A4",
});
```

## Styling

Since the CV looked pretty good on Github, I decided to maintain the same style. For this purpose I used `generate-github-markdown-css` to generate the CSS.

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

## Publishing

Since this CV will be distributed as a PDF, I need an automatic way to build and publish it somewhere for easy access. My first idea was to use Github Actions to build the pdf and upload it to a Google Drive folder, but the GDrive API is a bit of a pain to use, so I decided to publish it on NPM instead.

I added a pre-commit hook that builds the PDF on store it in the `dist` folder. When I push a new tag, the CI publishes the code on NPM.

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
    message: "Where do you want to save the file?",
},
{
    type: "input",
    name: "filename",
    message: "How do you want to call the file?",
},
{
    type: "boolean",
    name: "open",
    message: "Do you want to open the file?",
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

? Where do you want to save the file? /Users/lorenzo/Downloads
? How do you want to call the file? Curriculum.pdf
? Do you want to open the file? true
```

## Conclusion

This project was a lot of fun to build and I learned a lot of new things. I'm excited to build more stuff with Markdown and `unified` in the future. If you want to check out the full code, you can find it [here](https://github.com/fibonacid/curriculum)

