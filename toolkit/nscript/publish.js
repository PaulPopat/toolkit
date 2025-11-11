const fs = require("node:fs");
const { execSync } = require("node:child_process");

const published_version = execSync(
  'npm view @toolkit/nscript version || echo "0.0.0"'
)
  .toString()
  .trim();
const package = JSON.parse(fs.readFileSync("package.json", "utf8"));

console.log(
  `Current version: ${published_version}\nBuilding version: ${package.version}`
);
if (package.version === published_version) process.exit(0);

execSync("npm publish");
