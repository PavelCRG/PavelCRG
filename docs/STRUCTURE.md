# Структура профиля GitHub (PavelCRG)

Репозиторий `PavelCRG/PavelCRG` — это **profile README**. На GitHub отображается только корневой `README.md`.

## Папки

| Папка | Назначение |
|-------|------------|
| `assets/` | Локальные SVG: баннер, typing, резервные копии карточек |
| `stats-output/` | `stats.svg` — обновляется workflow раз в сутки |
| `languages-output/` | `languages.svg` — обновляется workflow |
| `snake-output/` | `snake.svg` — появится после первого запуска **Generate Snake** |
| `.github/workflows/` | Автоматизация (stats + snake) |
| `docs/` | Документация для себя (на профиль не влияет) |

## Workflows

1. **Update README Stats** (`readme-stats.yml`) — скачивает карточки stats/languages и коммитит в `stats-output/` и `languages-output/`.
2. **Generate Snake** (`snake.yml`) — рисует змейку из contribution graph и коммитит в `snake-output/snake.svg`.

После `git push` зайди в **Actions** → **Run workflow** для обоих, если snake ещё не виден.

## Обновить баннер или typing

1. Отредактируй URL в `assets/` (или скачай новый SVG с [capsule-render](https://github.com/kyechan99/capsule-render) / [readme-typing-svg](https://github.com/DenverCoder1/readme-typing-svg)).
2. Замени файлы в `assets/`.
3. `git add` → `commit` → `push`.

## Ссылки на API (если нужно перекачать вручную)

- Stats: `https://github-readme-stats-sigma-five.vercel.app/api?username=PavelCRG&...`
- Languages: `https://github-readme-stats-sigma-five.vercel.app/api/top-langs/?username=PavelCRG&...`
- Streak: `https://streak-stats.demolab.com?user=PavelCRG&theme=tokyo-night&...`

Основной `github-readme-stats.vercel.app` иногда недоступен — workflow использует зеркало **sigma-five**.
