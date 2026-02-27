const path = require("path");
const { spawnSync } = require("child_process");

const rootDir = path.resolve(__dirname, "..");
const apps = ["container", "portfolio", "auth", "expense-tracker", "pxel"];

for (const app of apps) {
  console.log(`Installing dependencies in ${app}...`);
  const result = spawnSync("npm", ["install"], {
    cwd: path.join(rootDir, app),
    stdio: "inherit",
    shell: true,
  });
  if (result.status !== 0) {
    process.exit(result.status);
  }
}

console.log("All dependencies installed.");
