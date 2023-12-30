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
      message: "Where should I save the file?",
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
      message: "How should I name the file?",
      default: "Curriculum.pdf",
    },
    {
      type: "confirm",
      name: "open",
      message: "Do you want to read it now?",
      default: true,
    },
  ]);

  const { folder, filename, open } = answers;
  const filepath = path.join(folder, filename);

  await fs.copyFile(source, path.join(folder, filename));
  console.log(`\nFile saved at ${filepath}`);

  if (open) {
    const command = isMac
      ? `open ${filepath}`
      : isWin
      ? `start ${filepath}`
      : isLinux && `xdg-open ${filepath}`;

    if (!command) {
      console.log("Could not open file");
      return;
    }
    execSync(command);
  }
}

main();
