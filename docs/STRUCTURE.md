# Структура профиля GitHub (PavelCRG)

Репозиторий `PavelCRG/PavelCRG` — **profile README**. На GitHub виден только корневой `README.md`.

## Как устроено

- **Дизайн** — HTML в `README.md`: заголовки, shields.io бейджи, таблица для stats/streak
- **Языки** — бейджи в README; скрипт `update-readme.mjs` читает `config/languages.json`
- **Приватные репо** — `scan-private-repos.mjs` + секрет `GH_PAT` (см. `docs/PRIVATE_REPOS.md`)
- **Stats / streak** — `stats-output/*.svg` (GitHub Actions, внешние API)
- **Snake** — `snake-output/snake.svg` (workflow Generate Snake)

## Скрипты

| Скрипт | Назначение |
|--------|------------|
| `scan-private-repos.mjs` | Языки из всех репо → `config/languages.json` + `stats-output/repo-report.json` |
| `update-readme.mjs` | Обновляет блоки `LANGUAGES` и `SCAN-INFO` в README |

## Workflows

1. **Update README Stats** — scan → README badges → stats/streak
2. **Generate Snake** — contribution snake
