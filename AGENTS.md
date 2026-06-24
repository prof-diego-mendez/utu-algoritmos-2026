# AGENTS.md — Programación I (ITI 2026)

Static educational portal. No build system, no package.json, no dependencies.

## Project facts

- 6 modules × 20 exercises = **120 total**: `algoritmos`, `variables`, `java`, `if`, `for`, `while`
- Pure HTML/CSS/JS served directly from disk — no server needed
- No TypeScript, no bundler, no preprocessor

## CSS architecture

- **Single entrypoint**: every HTML loads only `css/main.css` via `<link>`
- `css/main.css` uses native `@import` cascade in this order: `base/` → `components/` → `layout/` → `components/responsive.css` → `pages/`
- No inline `<style>` blocks anywhere — all styles in `css/`
- New page-specific styles go in `css/pages/<name>.css`; shared component styles in `css/components/`
- `css_backup_original/` is a safety copy of the original theme; `css/steampunk/` is an alternate theme (inactive by default)

## JavaScript loading order

Scripts at bottom of `<body>`, strict order:
1. `core/state-manager.js` (singleton, must load first)
2. `utils/` and `components/` (sandbox, modals, copy-code, ui-utils)
3. `pages/<name>.js` (page controller matched to its HTML sibling)

## StateManager (`js/core/state-manager.js`)

- **All progress tracking must go through this singleton** — never bypass with direct `localStorage` calls
- `localStorage` key: `programacion_i_state`
- Module IDs: `algoritmos`, `variables`, `java`, `if`, `for`, `while`
- API: `StateManager.setExercise(module, idx, bool)`, `.getExercise(module, idx)`, `.getProgressReport()`, `.subscribe(callback)`
- Auto-initializes on `DOMContentLoaded` — pages that read state synchronously before that event will see empty defaults (wrap in `DOMContentLoaded` or `setTimeout`)

## Sandbox interpreter (`js/components/sandbox-interpreter.js`)

- Shared across algoritmos and variables pages — do **not** clone or fork it
- Parses PSeInt-like syntax (`LEER`, `ESCRIBIR`, `MIENTRAS`, `SI-ENTONCES`)

## Page routing

- Intra-page navigation uses hash-based routing: `showSection(sectionId)` toggles `.active` on `<section>` elements
- No hardcoded section lists — router looks up `document.getElementById(sectionId)` from the DOM
- Adding a new section `<section id="newname" class="section">` + `<a class="nav-tab" href="#newname">` is sufficient; no JS changes needed
- Default hash for tipos-de-datos is `#primitivos`; for if/for/while it's `#intro`

## Exercise data

- Exercises live as JSON arrays in `data/exercises*.json` (20 items each)
- **Exception**: `variables.js` hardcodes its 20 exercises inline as `const EXERCISES = [...]`
- JSON exercise format: `{ titulo, nivel ("Básico"|"Intermedio"|"Avanzado"), tema, enunciado, hint }`
- Exercise index = position in array (0-19), stored in StateManager

## Adding a new module checklist

1. Create `pages/<name>.html` — include `<link href="../css/main.css">` in head, scripts before `</body>`
2. Create `js/pages/<name>.js` — set `MODULE_NAME` constant matching a StateManager module ID
3. Create `data/exercises-<name>.json` with 20 exercises
4. Add `@import "pages/<name>.css";` in `css/main.css` if page-specific styles exist
5. Add nav links to the new page in all other HTML files (desktop `.nav-tabs` + mobile `.mobile-nav`)
6. Register module in `js/core/state-manager.js`: add to `MODULES` constant, `state.modules` structure, and `getProgressReport()`
7. Add module card in `pages/progreso.html` and `updateModule()` call in `js/pages/progreso.js`
8. Update total exercise count in `js/pages/landing.js` and `js/pages/progreso.js`

## Docs worth reading

- `ARCHITECTURE.md` — full technical design decisions and rules for AI/developers
- `docs/STATE-MANAGER-DOCS.md` — StateManager API details
- `docs/EXERCISES-GUIDE.md` — how to edit exercise JSON files
- `docs/TYPOGRAPHY-GUIDE.md` — typographic hierarchy conventions