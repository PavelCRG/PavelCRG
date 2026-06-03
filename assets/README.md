# Зачем эти SVG?

На профиле GitHub показывается **только** `README.md` в корне. Папка `assets/` — твои **сохранённые картинки** на диске.

| Файл | Где используется | Нужен для профиля? |
|------|------------------|-------------------|
| `banner.svg` | В README: `./assets/banner.svg` | **Да** |
| `typing.svg` | В README: `./assets/typing.svg` | **Да** |
| `stats.svg` | Копия на диске; на профиле — **живая ссылка** в README | Нет (резерв) |
| `languages.svg` | То же | Нет (резерв) |
| `streak.svg` | То же | Нет (резерв) |

**Stats / Languages / Streak** в README идут с интернета (API) — они обновляются сами.

**stats-output/** и **languages-output/** — то же самое, но Actions кладёт сюда файлы для бэкапа (на профиль не влияет, пока в README стоят API-ссылки).

**snake-output/snake.svg** — появится после Actions **Generate Snake**; в README: `./snake-output/snake.svg`.
