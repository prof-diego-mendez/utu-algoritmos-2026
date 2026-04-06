# Programación I · ITI 2026

Portal educativo interactivo para la materia **Programación I** de UTU, diseñado para el aprendizaje de algoritmos y fundamentos de programación.

**Prof. Diego Méndez** · **ITI 2026**

---

## 📁 Estructura del Proyecto

```
01 algoritmos/
├── pages/                       # 📄 Páginas HTML
│   ├── index.html               # 🏠 Landing page principal (course hub)
│   ├── algoritmos-index.html    # 📚 Módulo: Algoritmos y Fundamentos
│   ├── variables.html           # 📦 Módulo: Variables y Operaciones
│   └── progreso.html            # 📊 Dashboard de progreso
├── js/                          # ⚙️ JavaScript files
│   ├── algoritmos.js            # Lógica del módulo de Algoritmos
│   ├── state-manager.js         # Sistema unificado de gestión de estado
│   └── ui-utils.js              # Utilidades UI (toasts, loading states)
├── css/                         # 🎨 Estilos
│   └── algoritmos.css           # Estilos compartidos (todos los módulos)
├── data/                        # 💾 Datos (JSON)
│   └── exercises.json           # Ejercicios del módulo de Algoritmos
├── docs/                        # 📖 Documentación
│   ├── ACCESSIBILITY.md         # Guía de accesibilidad
│   ├── EXERCISES-GUIDE.md       # Guía para editar ejercicios
│   ├── LOADING-STATES-GUIDE.md  # Guía de loading states
│   ├── MOBILE-MENU-GUIDE.md     # Guía del menú móvil
│   ├── PRINT-STYLES-GUIDE.md    # Guía de estilos de impresión
│   ├── STATE-MANAGER-DOCS.md    # Documentación del StateManager
│   └── TYPOGRAPHY-GUIDE.md      # Guía de tipografía
├── tipos-de-datos/              # ☕ Módulo: Tipos de Datos en Java
│   ├── tipos-de-datos.html      # Página principal del módulo
│   ├── tipos-de-datos.js        # Lógica del módulo Java
│   ├── tipos-de-datos.css       # Estilos específicos Java
│   └── exercises-java.json      # Ejercicios del módulo Java
└── README.md                    # Este archivo
```

---

## 🎯 Módulos Disponibles

### 1. Algoritmos y Fundamentos
**Archivo:** [`pages/algoritmos-index.html`](pages/algoritmos-index.html)

El corazón de la programación. Aprendé qué es un algoritmo, sus propiedades fundamentales y las estructuras de control.

**Contenido:**
- ¿Qué es un algoritmo?
- Las 5 propiedades fundamentales
- Formas de representar (lenguaje natural, pseudocódigo, diagramas)
- Estructuras de control (secuencia, selección, repetición)
- Prueba de escritorio y verificación
- **20 ejercicios prácticos**

---

### 2. Variables y Operaciones
**Archivo:** [`pages/variables.html`](pages/variables.html)

El concepto fundamental de cualquier lenguaje de programación.

**Contenido:**
- Concepto de variable
- Tipos de datos (entero, real, texto, lógico)
- Operaciones aritméticas
- Intercambio de variables
- **Sandbox interactivo** de pseudocódigo
- **20 ejercicios prácticos**

---

### 3. Tipos de Datos en Java
**Archivo:** [`tipos-de-datos/tipos-de-datos.html`](tipos-de-datos/tipos-de-datos.html)

Java es un lenguaje fuertemente tipado. Dominá los tipos primitivos y de referencia.

**Contenido:**
- Los 8 tipos primitivos
- Tipos de referencia (String, Wrappers)
- Conversión entre tipos (casting)
- Reglas y convenciones de nombres
- **20 ejercicios prácticos**

---

## 🚀 Cómo Usar

### Para Estudiantes

1. **Comenzá desde el inicio:** Abrí [`index.html`](index.html) para ver todos los módulos
2. **Elegí un módulo:** Cada módulo es autocontenido
3. **Progresá a tu ritmo:** Los ejercicios guardan tu progreso automáticamente
4. **Usá el sandbox:** En el módulo de Variables, podés ejecutar pseudocódigo

### Para Docentes

#### Agregar/Editar Ejercicios

Los ejercicios están en archivos JSON separados del código:

- **Algoritmos:** [`data/exercises.json`](data/exercises.json)
- **Java:** [`tipos-de-datos/exercises-java.json`](tipos-de-datos/exercises-java.json)

**Ejemplo de ejercicio:**
```json
{
  "titulo": "Mi ejercicio nuevo",
  "nivel": "Básico",
  "tema": "Secuencia",
  "enunciado": "Descripción del ejercicio.",
  "hint": "Pista para ayudar"
}
```

📖 Ver [`docs/EXERCISES-GUIDE.md`](docs/EXERCISES-GUIDE.md) para instrucciones detalladas.

---

## 🛠️ Características Técnicas

### Navegación
- ✅ **Hash-based routing:** URLs compartibles (ej: `algoritmos-index.html#ejercicios`)
- ✅ **Historial del navegador:** Los botones atrás/adelante funcionan correctamente
- ✅ **Navegación por teclado:** Soporte completo de accesibilidad
- ✅ **Mobile-first:** Diseño responsivo

### Almacenamiento y Progreso
- ✅ **StateManager unificado:** Una sola fuente de verdad para todo el progreso
- ✅ **Migración automática:** Los datos antiguos se migran automáticamente
- ✅ **Progreso sincronizado:** Todas las páginas muestran el mismo progreso
- ✅ **Dashboard de progreso:** Página centralizada para ver avance total
- ✅ **Exportable:** Posibilidad de backup y restore del progreso

### Accesibilidad (WCAG 2.1 AA)
- ✅ **Skip links:** Para saltar navegación
- ✅ **ARIA labels & roles:** Navegación semántica
- ✅ **Focus visible:** Indicadores de 3px para teclado
- ✅ **Live regions:** Anuncios de cambios dinámicos
- ✅ **Reduced motion:** Soporte para preferencia de movimiento
- ✅ **Keyboard navigation:** Navegación completa sin mouse
- ✅ **Color contrast:** Ratio 16.5:1 para texto
- 📄 Ver [`docs/ACCESSIBILITY.md`](docs/ACCESSIBILITY.md) para documentación completa

### Experiencia Móvil
- ✅ **Hamburger menu:** Menú desplegable moderno (no barra duplicada)
- ✅ **Animaciones suaves:** Slide + fade transitions (300ms)
- ✅ **Overlay backdrop:** Fondo oscuro con blur
- ✅ **Icon animation:** Hamburguesa se transforma en X
- ✅ **Touch-friendly:** Botones de 44px (WCAG compliant)
- ✅ **Keyboard support:** Cierre con tecla Escape
- ✅ **Body scroll lock:** Previene scroll del fondo
- 📄 Ver [`docs/MOBILE-MENU-GUIDE.md`](docs/MOBILE-MENU-GUIDE.md) para detalles

### Feedback Visual & Loading States
- ✅ **Toast notifications:** Success, error, warning, info
- ✅ **Loading spinners:** Inline y overlay de pantalla completa
- ✅ **Skeleton loaders:** Animación shimmer para contenido
- ✅ **Button loading:** Estado de carga en botones
- ✅ **Sandbox loading:** Feedback durante ejecución de código
- ✅ **Auto-dismiss:** Notificaciones desaparecen automáticamente
- ✅ **Accessible:** ARIA live regions para screen readers
- 📄 Ver [`docs/LOADING-STATES-GUIDE.md`](docs/LOADING-STATES-GUIDE.md) para documentación

### Estilos de Impresión
- ✅ **Print-optimized:** Diseño eficiente en tinta
- ✅ **Typography adaptada:** Serif para mejor lectura en papel
- ✅ **Page breaks:** Control de saltos de página
- ✅ **Element hiding:** Oculta UI no esencial
- ✅ **Print button:** Botón flotante para imprimir
- ✅ **Print footer:** Información de atribución
- ✅ **Ink-saving:** Fondos claros, sin colores oscuros
- 📄 Ver [`docs/PRINT-STYLES-GUIDE.md`](docs/PRINT-STYLES-GUIDE.md) para guía completa

---

## 🎨 Diseño

El proyecto usa una paleta de colores oscuros moderna con acentos vibrantes:

- **Fondo:** `#0e0f13` (casi negro)
- **Superficie:** `#16181f` (gris oscuro)
- **Acento principal:** `#a78bfa` (violeta)
- **Colores secundarios:** teal, amber, coral, blue

**Tipografía:**
- **Títulos:** Syne (display) - pesos 700-800 con letter-spacing negativo
- **Cuerpo:** Roboto (legibilidad) - peso 300, line-height 1.85
- **Código:** DM Mono (monospace) - con background y border sutil

**Jerarquía Tipográfica:**
- ✅ 4 niveles de headings con colores distintos (#fff → #e5e5e7)
- ✅ Letter-spacing negativo para títulos (-0.03em a 0)
- ✅ Text shadows sutiles para profundidad
- ✅ Spacing consistente (4rem → 2.5rem → 2rem → 1.25rem)
- ✅ Contraste AAA (16.5:1 para headings, 7.2:1 para cuerpo)
- 📄 Ver [`docs/TYPOGRAPHY-GUIDE.md`](docs/TYPOGRAPHY-GUIDE.md) para documentación completa

---

## 📊 Estadísticas del Proyecto

| Métrica | Cantidad |
|---------|----------|
| Módulos | 3 |
| Ejercicios totales | 60 |
| Líneas de código | ~4000+ |
| Archivos JSON | 2 |
| Páginas HTML | 4 |

---

## 🔧 Desarrollo

### Agregar un Nuevo Módulo

1. Crear el archivo HTML en `pages/` o subcarpeta dedicada
2. Incluir `../css/algoritmos.css` para estilos compartidos
3. Agregar enlace en `pages/index.html` y en las navegaciones de otros módulos
4. (Opcional) Crear archivo JSON para ejercicios en `data/`

### Estructura de Navegación

Todas las páginas deben incluir:
- Enlace a `index.html` (← Inicio) - usar `../pages/index.html` si está en subcarpeta
- Enlaces a los otros módulos principales
- Navegación interna con hash routing (si aplica)

---

## 📝 Licencia

Material educativo desarrollado para UTU · ITI 2026.

---

## 🙏 Agradecimientos

- **Google Fonts:** Roboto, Syne, DM Mono
- **Comunidad educativa:** Por el feedback continuo

---

**Hecho con ❤️ para el aprendizaje de algoritmos y programación**
