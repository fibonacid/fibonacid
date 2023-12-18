#!/usr/bin/env node

import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const source = fileURLToPath(new URL("./dist/Curriculum.pdf", import.meta.url));
const dest = "/tmp/Curriculum.pdf";

fs.copyFileSync(source, dest);
execSync(`open ${dest}`);
