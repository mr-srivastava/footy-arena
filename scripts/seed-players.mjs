/**
 * @deprecated Use `npm run seed` instead.
 * For fresh imports from local JSON: `npm run seed -- --from-json`
 */
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fromJson = process.argv.includes("--from-json");
const args = ["scripts/seed-convex.mjs", ...(fromJson ? ["--from-json"] : [])];

const result = spawnSync("node", args, {
  cwd: join(__dirname, ".."),
  stdio: "inherit",
  env: process.env,
});

process.exit(result.status ?? 1);
