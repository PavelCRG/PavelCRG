import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const readmePath = join(root, "README.md");
const configPath = join(root, "config", "languages.json");
const reportPath = join(root, "stats-output", "repo-report.json");

const LOGO = {
  TypeScript: "typescript",
  JavaScript: "javascript",
  Python: "python",
  Rust: "rust",
  "C#": "csharp",
  "C++": "cplusplus",
  Go: "go",
  Java: "java",
  HTML: "html5",
  CSS: "css3",
  Shell: "gnubash",
  PowerShell: "powershell",
  PHP: "php",
  Ruby: "ruby",
  Swift: "swift",
  Kotlin: "kotlin",
  Vue: "vuedotjs",
  React: "react",
  Docker: "docker",
  PostgreSQL: "postgresql",
  MySQL: "mysql",
};

function shield(name, percent, color) {
  const hex = color.replace("#", "");
  const logo = LOGO[name];
  const text = encodeURIComponent(name);
  const pct = encodeURIComponent(`${percent}%`);
  const logoPart = logo ? `&logo=${logo}&logoColor=${name === "JavaScript" ? "000000" : "FFFFFF"}` : "";
  return `  <img src="https://img.shields.io/badge/${text}-${pct}-${hex}?style=flat-square&labelColor=21262D&color=30363D${logoPart}" height="24" alt="${name}" />`;
}

function replaceBlock(content, tag, body) {
  const re = new RegExp(`<!-- ${tag}:START -->[\\s\\S]*?<!-- ${tag}:END -->`, "m");
  if (!re.test(content)) throw new Error(`Missing <!-- ${tag}:START/END --> in README.md`);
  return content.replace(re, `<!-- ${tag}:START -->\n${body}\n<!-- ${tag}:END -->`);
}

const config = JSON.parse(readFileSync(configPath, "utf8"));
const { languages, scannedAt, source } = config;

const langBadges = languages.map((l) => shield(l.name, l.percent, l.color)).join("\n");

let scanInfo = "<sub>Curated from <code>config/languages.json</code> · add <code>GH_PAT</code> for private repo scan</sub>";
if (source === "private-scan" && scannedAt) {
  let report;
  try {
    report = JSON.parse(readFileSync(reportPath, "utf8"));
  } catch {
    report = null;
  }
  const date = scannedAt.slice(0, 10);
  if (report) {
    scanInfo = `<sub>Auto-scan ${date} · ${report.scannedRepos} repos (${report.privateRepos} private, ${report.publicRepos} public)</sub>`;
  } else {
    scanInfo = `<sub>Auto-scan ${date} · includes private repos via <code>GH_PAT</code></sub>`;
  }
}

let readme = readFileSync(readmePath, "utf8");
readme = replaceBlock(readme, "LANGUAGES", `<p align="center">\n${langBadges}\n</p>`);
readme = replaceBlock(readme, "SCAN-INFO", `<p align="center">\n  ${scanInfo}\n</p>`);

writeFileSync(readmePath, readme);
console.log(`Updated README (${languages.length} language badges)`);
