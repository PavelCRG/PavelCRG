# Настройка сканирования приватных репозиториев

Карточка **Languages** в `README.md` — это HTML-бейджи (shields.io). Скрипт `scripts/update-readme.mjs` подставляет их из `config/languages.json`.

## Авто-скан (публичные + приватные)

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens**
2. Создай token с правом **`repo`** (доступ к приватным репозиториям)
3. В репозитории `PavelCRG/PavelCRG`: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
4. Имя: `GH_PAT`, значение: твой token

После push или **Actions → Update README Stats**:
- `scripts/scan-private-repos.mjs` соберёт языки со всех репо (кроме `config/scan.json` → `excludeRepos`)
- обновит `config/languages.json` и `stats-output/repo-report.json`
- `scripts/update-readme.mjs` перезапишет бейджи в README

## Без токена

Редактируй `config/languages.json` вручную и запускай:

```bash
node scripts/update-readme.mjs
```

## Отчёт

После скана смотри `stats-output/repo-report.json` — список репо, private/public, языки по каждому.
