# Структура профиля GitHub (PavelCRG)

Репозиторий `PavelCRG/PavelCRG` — это **profile README**. На GitHub отображается только корневой `README.md`.

## Папки

| Папка | Назначение |
|-------|------------|
| `assets/` | Локальные SVG: typing, резервные копии карточек |
| `stats-output/` | `stats.svg`, `streak.svg` — обновляются workflow |
| `languages-output/` | `languages.svg` — обновляется workflow |
| `snake-output/` | `snake.svg` — змейка из contribution graph |
| `.github/workflows/` | Автоматизация (stats + snake) |
| `docs/` | Документация (на профиль не влияет) |

## Workflows

1. **Update README Stats** (`readme-stats.yml`) — скачивает stats, languages и streak (с fallback, если streak API недоступен) и коммитит в `stats-output/` и `languages-output/`.
2. **Generate Snake** (`snake.yml`) — рисует змейку и коммитит в `snake-output/snake.svg`.

В `README.md` карточки и змейка подключены **локально** (`./stats-output/...`, `./snake-output/snake.svg`), чтобы профиль не ломался при сбоях внешних API.

После `git push` при необходимости: **Actions** → **Run workflow** для обоих workflow.

## API (для ручного обновления)

- Stats: `https://github-readme-stats-sigma-five.vercel.app/api?username=PavelCRG&hide_title=true&...`
- Languages: `https://github-readme-stats-sigma-five.vercel.app/api/top-langs/?username=PavelCRG&...`
- Streak: `https://streak-stats.demolab.com?user=PavelCRG&...` (иногда 503 — тогда остаётся последний `stats-output/streak.svg`)
