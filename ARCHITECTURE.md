# Arquitectura del Proyecto: Portal Educativo Programación I (ITI 2026)

Este documento es una guía técnica detallada diseñada específicamente para otorgar contexto inmediato a futuras Inteligencias Artificiales o desarrolladores que asuman el trabajo en el proyecto. 

## 1. Topología del Directorio Raíz

El repositorio está concebido de manera estática y altamente modular, priorizando el desacoplamiento entre estructura (HTML), presentación (CSS) y lógica (JS). 

```text
/
├── index.html           # Landing page base
├── pages/               # Todas las sub-vistas HTML del proyecto
├── css/                 # Sistema de CSS Modular encapsulado
├── js/                  # Ecosistema de módulos lógicos de Javascript
├── data/                # Bases de datos simples (ej: exercises.json)
├── docs/                # Documentación interna
└── ARCHITECTURE.md      # Este Archivo
```

## 2. Capa Estructural: Vistas e Interfaces (`HTML`)

Los archivos HTML existen libres de bloques `<style>` y `<script>` interlineados para garantizar máxima pureza técnica. 
- **Regla Estricta**: Cada archivo invoca su marco visual consumiendo únicamente `<link href="../css/main.css">` en el `<head>`.
- Las dependencias de lógica interactiva (`.js`) se asientan exclusivamente antes del cierre de la etiqueta `</body>` en cascada (primero dependencias `core`, luego `utils`/`components`, y finalmente, controladores `pages`).
- **Principales vistas**: `algoritmos-index.html` (Fundamentos), `variables.html` (Módulo Variables), `tipos-de-datos.html` (Alojamiento y Memoria), `progreso.html` (Panel de usuario).

## 3. Capa de Presentación: Arquitectura Modular CSS (`/css`)

Toda la cosmética está dirigida por un hub centralizado. Ningún CSS se superpone globalmente más allá de los reseteos base. 

- **El Concentrador `main.css`**: Este archivo actúa como orquestador usando reglas nativas `@import` para ensamblar un puzzle lógico en estricto orden.
- **`css/base/`**: Parámetros globales y raíces. (`variables.css`, `reset.css`, `typography.css`).
- **`css/layout/`**: Todo bloque agnóstico y permanente en pantalla (`header-nav.css`, `main.css`, `footer.css`, `page-nav.css`).
- **`css/components/`**: Los bloques funcionales de la UI. Ej: `sandbox.css` (intérprete), `cards.css`, `ui-elements.css`, `exercises.css` (acordeones), etc.
- **`css/pages/`**: Reglas súper-específicas de una única página que no deben derramarse ni ensuciar todo el scope de la web (ej: `landing.css`, `tipos-de-datos.css`).

## 4. Capa Lógica: Ecosistema JavaScript (`/js`)

Al igual que en su diseño CSS, toda función ha sido abstraída a su mínima especialidad siguiendo los principios de Responsabilidad Única.

- **`/core/state-manager.js` (Componente Crítico)**
  La piedra angular que conecta a todo el sitio. Un Singleton que gestiona una clase base interconectada a `localStorage`. Realiza el seguimiento del progreso del alumno resolviendo ejercicios, marcadores interactivos (estado true/false de cada tarea terminada) y genera estadísticas multi-ventana persistentes. Toda mutación al progreso debe pasar por los métodos de este State Manager.

- **`/components/sandbox-interpreter.js` (Simulador Vital)**
  Alrededor de 200 líneas de código vital conforman este motor. Es capaz de atrapar entradas (input), leer sintaxis básica estilo PSeInt (`LEER`, `ESCRIBIR`, bucles `MIENTRAS`, condicionales `SI-ENTONCES`) y devolver resultados interactuando con su DOM inyectado. Este módulo se comparte entre `algoritmos` y `variables`. Modificarlo afectará al simulador general del sitio; no clonarlo bajo ninguna circunstancia.

- **`/utils/`**: Modulares agnósticos: interactividad y notificaciones web, utilerías como la funcionalidad portapapeles (`copy-code.js`) y notificaciones "Toast" (`ui-utils.js`).
- **`/components/modals-quiz.js`**: Funciones orientadas a popups de validación y pantallas opacas sobre-apiladas.
- **`/pages/`**: Controladores únicos. Un archivo `script-page.js` por vista existente, que actúa orquestando listeners, invocando a modales u operaciones dependientes exclusivamente de los IDs nativos de su archivo HTML hermano (ej: `algoritmos.js`, `variables.js`, `tipos-de-datos.js`, `landing.js`, `progreso.js`).

## 5. Decisiones de Diseño para la IA

A la hora de desarrollar un feature o inmiscuirse en la resolución de problemas (debugging), la Inteligencia Artificial debe respetar estrictamente:

1. **Evitar la tentación monolítica**: Al añadir una tabla de datos visual nueva (ej: "Tabla de Bases Booleanas"), no inyectar sentencias css locales, sino redactar sus estilos en `css/components/tables.css` o componer un componente nuevo si es demasiado original.
2. **Componentes repetitivos**: Cualquier regla Javascript o CSS que se comparta al menos en 2 partes o páginas, DEBE ser extraída de sus sub-capas (pages) e introducida como un recurso de la capa "utils" (JS) o "components".
3. **No romper la jerarquía del Sandbox**: Cualquier bloque "PSEUDO-CÓDIGO" debe ser compatible con la evaluación iterativa pura y con RegEx del `evalExpr`. Manejar el órden de reemplazos con extremo cuidado.
4. **No re-inventar LocalStorage**: Usa siempre la instanciación principal de `StateManager` cuando interacciones del usuario ameriten guardar datos de manera duradera.
