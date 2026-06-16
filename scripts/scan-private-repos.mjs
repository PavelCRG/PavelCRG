import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const LANG_COLORS = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  "C#": "#178600",
  "C++": "#f34b7d",
  Go: "#00ADD8",
  Java: "#b07219",
  HTML: "#e34c26",
  CSS: "#663399",
  Shell: "#89e051",
  PowerShell: "#012456",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  SQL: "#e38c00",
  Dockerfile: "#384d54",
  HCL: "#844FBA",
  Lua: "#000080",
  R: "#198CE7",
};

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const scanConfig = JSON.parse(readFileSync(join(root, "config", "scan.json"), "utf8"));
const token = process.env.GH_PAT;

async function gh(path, opts = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...opts,
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opts.headers,
    },
  });
  if (!res.ok) throw new Error(`${path} → ${res.status} ${await res.text()}`);
  return res.json();
}

async function listRepos() {
  const repos = [];
  for (let page = 1; page <= 10; page++) {
    const batch = await gh(
      `/user/repos?affiliation=owner&per_page=100&page=${page}&sort=updated`
    );
    if (!batch.length) break;
    repos.push(...batch);
    if (batch.length < 100) break;
  }
  return repos;
}

async function repoLanguages(fullName) {
  try {
    return await gh(`/repos/${fullName}/languages`);
  } catch {
    return null;
  }
}

function colorFor(name) {
  return LANG_COLORS[name] ?? "#8b949e";
}

function roundPercents(items) {
  const total = items.reduce((s, i) => s + i.bytes, 0);
  if (!total) return [];

  const raw = items.map((i) => ({ ...i, exact: (i.bytes / total) * 100 }));
  const rounded = raw.map((i) => ({ ...i, percent: Math.floor(i.exact) }));
  let sum = rounded.reduce((s, i) => s + i.percent, 0);
  const order = [...rounded].sort((a, b) => b.exact - a.exact);
  let idx = 0;
  while (sum < 100 && order.length) {
    order[idx % order.length].percent += 1;
    sum += 1;
    idx += 1;
  }
  return rounded
    .map(({ name, percent }) => ({ name, percent, color: colorFor(name) }))
    .sort((a, b) => b.percent - a.percent);
}

async function main() {
  if (!token) {
    console.log("GH_PAT not set — keeping config/languages.json as-is");
    return;
  }

  const exclude = new Set(scanConfig.excludeRepos ?? []);
  const repos = await listRepos();
  const included = repos.filter((r) => !exclude.has(r.name) && !r.fork);

  const totals = new Map();
  const reposByLang = new Map();
  const repoDetails = [];

  for (const repo of included) {
    const langs = await repoLanguages(repo.full_name);
    if (!langs) continue;

    const entries = Object.entries(langs);
    if (!entries.length) continue;

    repoDetails.push({
      name: repo.name,
      private: repo.private,
      languages: Object.keys(langs),
      primary: repo.language,
    });

    for (const [lang, bytes] of entries) {
      totals.set(lang, (totals.get(lang) ?? 0) + bytes);
      if (!reposByLang.has(lang)) reposByLang.set(lang, []);
      reposByLang.get(lang).push(repo.name);
    }
  }

  const sorted = [...totals.entries()]
    .map(([name, bytes]) => ({ name, bytes }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, scanConfig.maxLanguages ?? 9);

  const languages = roundPercents(sorted);
  if (!languages.length) {
    console.log("No language data found — keeping existing config");
    return;
  }

  const config = {
    title: scanConfig.title ?? "Languages across all repos",
    source: "private-scan",
    scannedAt: new Date().toISOString(),
    languages,
  };

  writeFileSync(join(root, "config", "languages.json"), JSON.stringify(config, null, 2));

  const report = {
    scannedAt: config.scannedAt,
    totalRepos: repos.length,
    scannedRepos: included.length,
    privateRepos: included.filter((r) => r.private).length,
    publicRepos: included.filter((r) => !r.private).length,
    excludedRepos: [...exclude],
    topLanguages: languages,
    repos: repoDetails,
    reposByLanguage: Object.fromEntries(reposByLang),
  };

  mkdirSync(join(root, "stats-output"), { recursive: true });
  writeFileSync(join(root, "stats-output", "repo-report.json"), JSON.stringify(report, null, 2));
  console.log(
    `Scanned ${included.length} repos (${report.privateRepos} private) → ${languages.length} languages`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
