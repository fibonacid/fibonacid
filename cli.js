#!/usr/bin/env node

import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import inquirer from "inquirer";

const source = fileURLToPath(new URL("./dist/Curriculum.pdf", import.meta.url));

const { username } = os.userInfo();
const isMac = process.platform === "darwin";
const isWin = process.platform === "win32";
const isLinux = process.platform === "linux";

async function main() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "folder",
      message: "Where do you want to save the file?",
      default: isMac
        ? `/Users/${username}/Downloads`
        : isWin
        ? `C:\\Users\\${username}\\Downloads`
        : isLinux
        ? `/home/${username}/Downloads`
        : undefined,
    },
    {
      type: "input",
      name: "filename",
      message: "How do you want to call the file?",
      default: "Curriculum.pdf",
    },
    {
      type: "boolean",
      name: "open",
      message: "Do you want to open the file?",
      default: true,
    },
  ]);

  const { folder, filename, open } = answers;
  const filepath = path.join(folder, filename);
  console.log(`Saving file to ${filepath}`);

  await fs.copyFile(source, path.join(folder, filename));

  if (open) execSync(`open ${filepath}`);
}

main();
