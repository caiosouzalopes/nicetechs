#!/usr/bin/env node
const fs = require("fs");
const msg = fs.readFileSync(0, "utf8");
const lines = msg.split(/\r?\n/).filter((line) => !line.match(/^Co-authored-by:\s*Cursor\s*/));
process.stdout.write(lines.join("\n").trimEnd() + "\n");
