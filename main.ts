/* Leonida Legend — hand-in program for the gta6-trophy-guide-01 entry.
 *
 * What this program does, and all it does:
 *   1. stages this repository's app/ folder (the guide itself: plain static
 *      files, no build step) into the output directory,
 *   2. stages screenshots/ beside it (the maker's own renders of the app),
 *   3. writes dossier.json — the summary the judge reads — using the kit's
 *      vendored buildDossier, byte for byte the way the scorer rebuilds it.
 *
 * The vendored library under vendor/ is the kit's own and stays untouched:
 * the gate rebuilds the dossier with its copy and compares the two.
 *
 * Run it the way the grader does (Node, standard library only):
 *   node main.ts
 * Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
 *   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
 * Serve the guide locally instead with: node serve.ts
 */

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoDir = fileURLToPath(new URL(".", import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Stage the app first: it is the entry. Everything under app/ is a plain
// file the browser loads from app/ itself — nothing is built or bundled.
mkdirSync(outDir, { recursive: true });
cpSync(join(repoDir, "app"), join(outDir, "app"), { recursive: true });

// Stage the screenshots next to it. The first file by name is the cover
// the judge sees large; the gate allows at most four, each at most 256 KiB.
mkdirSync(join(outDir, "screenshots"), { recursive: true });
const shotsDir = join(repoDir, "screenshots");
if (existsSync(shotsDir)) {
  cpSync(shotsDir, join(outDir, "screenshots"), { recursive: true });
}

// Write the dossier with the gate's own caps, so a hand-in this program
// accepts is one the scorer accepts too:
//   - the dossier text is capped at 160 KiB (163,840 bytes),
//   - at most 4 screenshots and none over 256 KiB (262,144 bytes),
//   - app/ holds at most 993 files and directories and 48 MiB in all.
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(outDir, "dossier.json"), dossier);

console.log(`Leonida Legend handed in: app/ + screenshots/ staged to ${outDir}, dossier.json written (${dossier.length} bytes).`);
