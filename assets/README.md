# Зачем эти SVG?

На профиле GitHub показывается **только** `README.md` в корне. Папка `assets/` — локальные файлы и резервные копии.

| Файл | Где используется | Нужен для профиля? |
|------|------------------|-------------------|
| `typing.svg` | В README: `./assets/typing.svg` | **Да** |
| `stats.svg` | Резерв | Нет |
| `languages.svg` | Резерв | Нет |
| `streak.svg` | Резерв; fallback для workflow → `stats-output/streak.svg` | Нет |

**Stats / Streak / Languages** на профиле: `./stats-output/stats.svg`, `./stats-output/streak.svg`, `./languages-output/languages.svg` (обновляются Actions).

**Snake:** `./snake-output/snake.svg` (workflow **Generate Snake**).
