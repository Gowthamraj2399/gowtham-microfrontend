const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const rootDir = path.resolve(__dirname, "..");
const firebasePublic = path.join(rootDir, "firebase-public");

// Clean shared folder before build (recommended)
if (fs.existsSync(firebasePublic)) {
  fs.rmSync(firebasePublic, { recursive: true });
}

const apps = [
  "portfolio",
  "auth",
  "expense-tracker",
  "pxel",
  "container",
];

process.env.BUILD_TO_FIREBASE = "1";

for (const app of apps) {
  console.log(`Building ${app}...`);
  const result = spawnSync("npm run build", {
    cwd: path.join(rootDir, app),
    stdio: "inherit",
    env: { ...process.env, BUILD_TO_FIREBASE: "1" },
    shell: true,
  });
  if (result.status !== 0) {
    process.exit(result.status);
  }
}

console.log("Firebase build complete. Upload the firebase-public folder in Firebase Console.");
