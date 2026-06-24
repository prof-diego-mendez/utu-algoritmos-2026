# State Manager · Documentación Técnica

## Visión General

El **StateManager** es un sistema centralizado de gestión de estado que unifica el progreso del estudiante a través de todos los módulos del curso Programación I.

---

## Problema Resuelto

### Antes (❌)
```javascript
// Cada módulo tenía su propio sistema
localStorage.setItem('algo_completados', ...)
localStorage.setItem('td_completados', ...)
localStorage.setItem('algo_respuestas', ...)
localStorage.setItem('td_respuestas', ...)
```

**Problemas:**
- Datos fragmentados en múltiples keys
- Sin visión global del progreso
- Difícil de mantener y escalar
- Migración compleja

### Después (✅)
```javascript
// Sistema unificado
StateManager.setExercise('algoritmos', 5, true)
StateManager.setAnswer('java', 3, 'Mi respuesta')
const report = StateManager.getProgressReport()
```

**Beneficios:**
- ✅ Una sola fuente de verdad
- ✅ Progreso sincronizado entre páginas
- ✅ Dashboard centralizado
- ✅ Migración automática desde el sistema antiguo

---

## Arquitectura

### Estructura de Datos

```javascript
{
  version: "1.0.0",
  lastUpdated: "2026-03-28T...",
  modules: {
    algoritmos: {
      completed: { "0": true, "1": true, "5": false },
      answers: { "0": "Respuesta...", "3": "Otra respuesta" },
      lastAccessed: "2026-03-28T..."
    },
    variables: { ... },
    java: { ... }
  }
}
```

### Almacenamiento

- **Key:** `programacion_i_state`
- **Formato:** JSON string
- **Ubicación:** localStorage del navegador

---

## API Pública

### Inicialización

```javascript
// Se auto-inicializa al cargar la página
// Pero podés llamar manualmente si necesitas el estado inmediatamente
StateManager.init()
```

### Gestión de Ejercicios

```javascript
// Marcar ejercicio como completado
StateManager.setExercise(module, exerciseId, completed)
// Ejemplo:
StateManager.setExercise('algoritmos', 5, true)

// Guardar respuesta
StateManager.setAnswer(module, exerciseId, answer)
// Ejemplo:
StateManager.setAnswer('java', 3, 'int edad = 25;')

// Obtener estado de ejercicio
const data = StateManager.getExercise(module, exerciseId)
// Retorna: { completed: true, answer: "..." }
```

### Progreso

```javascript
// Progreso de un módulo específico
const progress = StateManager.getModuleProgress(module, totalExercises)
// Ejemplo:
StateManager.getModuleProgress('algoritmos', 20)
// Retorna: { completed: 15, total: 20, percentage: 75 }

// Progreso general
const report = StateManager.getProgressReport()
// Retorna:
{
  algoritmos: { completed: 15, answers: 18, lastAccessed: "..." },
  variables: { completed: 10, answers: 12, lastAccessed: "..." },
  java: { completed: 8, answers: 10, lastAccessed: "..." },
  overall: { totalCompleted: 33, lastUpdated: "..." }
}
```

### Suscripciones

```javascript
// Escuchar cambios en el estado
const unsubscribe = StateManager.subscribe((state) => {
  console.log('Estado actualizado:', state)
  updateUI()
})

// Dejar de escuchar
unsubscribe()
```

### Utilidades

```javascript
// Exportar estado (backup)
const json = StateManager.exportState()

// Importar estado (restore)
StateManager.importState(jsonString)

// Limpiar todo el progreso
StateManager.clear()

// Obtener estado crudo
const state = StateManager.getState()
```

---

## Módulos Disponibles

```javascript
StateManager.MODULES = {
  ALGORITMOS: 'algoritmos',  // Módulo de algoritmos
  VARIABLES: 'variables',     // Módulo de variables
  JAVA: 'java'                // Módulo de Java
}
```

---

## Migración Automática

El StateManager **migra automáticamente** los datos del sistema antiguo:

```javascript
// Al inicializar, busca y migra:
localStorage.getItem('algo_completados') → modules.algoritmos.completed
localStorage.getItem('algo_respuestas')  → modules.algoritmos.answers
localStorage.getItem('td_completados')   → modules.java.completed
localStorage.getItem('td_respuestas')    → modules.java.answers

// Luego elimina las keys antiguas
```

**Ventajas:**
- Los estudiantes no pierden su progreso anterior
- Transición transparente
- Sin necesidad de scripts de migración manuales

---

## Ejemplos de Uso

### En un Módulo Nuevo

```javascript
// 1. Incluir StateManager en HTML
<script src="state-manager.js"></script>

// 2. Configurar módulo
const MODULE_NAME = 'mi_modulo';
const TOTAL_EXERCISES = 20;

// 3. Marcar ejercicio completado
function onExerciseComplete(exerciseId) {
  StateManager.setExercise(MODULE_NAME, exerciseId, true);
  updateStats();
}

// 4. Guardar respuesta
function onSaveAnswer(exerciseId, text) {
  StateManager.setAnswer(MODULE_NAME, exerciseId, text);
}

// 5. Obtener progreso
function updateStats() {
  const report = StateManager.getModuleProgress(MODULE_NAME, TOTAL_EXERCISES);
  document.getElementById('completed').textContent = report.completed;
  document.getElementById('percentage').textContent = report.percentage + '%';
}
```

### Dashboard de Progreso

```javascript
// Obtener reporte completo
const report = StateManager.getProgressReport();

// Mostrar progreso total
const totalCompleted = report.overall.totalCompleted;
const percentage = Math.round((totalCompleted / 60) * 100);

// Mostrar por módulo
const algoritmosPct = Math.round((report.algoritmos.completed / 20) * 100);
const variablesPct = Math.round((report.variables.completed / 20) * 100);
const javaPct = Math.round((report.java.completed / 20) * 100);
```

### Actualización en Tiempo Real

```javascript
// Suscribirse a cambios
StateManager.subscribe((state) => {
  // Actualizar UI reactivamente
  updateProgressBar();
  updateCounter();
  showNotification('Progreso actualizado');
});
```

---

## Buenas Prácticas

### ✅ Hacer

```javascript
// Esperar inicialización
document.addEventListener('DOMContentLoaded', () => {
  StateManager.init();
  loadExercises();
});

// Usar IDs consistentes
StateManager.setExercise(MODULE_NAME, exerciseIndex, true);

// Suscribirse y limpiar
const unsubscribe = StateManager.subscribe(updateUI);
// En cleanup:
unsubscribe();
```

### ❌ No Hacer

```javascript
// No mezclar con localStorage directo
localStorage.setItem('mi_progreso', ...) // ❌

// No modificar el estado directamente
StateManager.getState().modules.algoritmos.completed = {} // ❌

// No asumir que el estado está listo inmediatamente
StateManager.setExercise(...) // en el head, antes de DOMContentLoaded
```

---

## Debugging

### Ver Estado Actual

```javascript
// En consola del navegador
console.log(StateManager.getProgressReport())
console.log(StateManager.exportState())
```

### Forzar Guardado

```javascript
// El guardado es automático, pero podés verificar
StateManager.getState() // Ver estado en memoria
localStorage.getItem('programacion_i_state') // Ver en storage
```

### Resetear Progreso

```javascript
// Para testing o reset completo
StateManager.clear()
```

---

## Consideraciones de Performance

- **Guardado diferido:** El estado se guarda inmediatamente pero de forma asíncrona
- **Suscriptores múltiples:** Múltiples páginas pueden escuchar cambios
- **Tamaño típico:** ~5-10KB para 60 ejercicios con respuestas
- **Impacto:** Mínimo, operaciones son O(1) en la mayoría de casos

---

## Futuras Mejoras

- [ ] Sync entre dispositivos (backend)
- [ ] Historial de progreso (timeline)
- [ ] Logros y badges
- [ ] Tiempo dedicado por módulo
- [ ] Exportar a PDF/CSV

---

## Soporte

Para reportar bugs o sugerencias:
1. Revisar consola del navegador para errores
2. Verificar que localStorage está habilitado
3. Exportar estado con `StateManager.exportState()`
4. Reportar con el JSON exportado

---

**Versión:** 1.0.0  
**Última actualización:** Marzo 2026  
**Mantenido por:** Prof. Diego Méndez · ITI 2026
