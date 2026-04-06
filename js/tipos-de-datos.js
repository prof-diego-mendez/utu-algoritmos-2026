/* ============================================================
   tipos-de-datos.js
   Lógica interactiva para la página de Tipos de Datos en Java.
   ============================================================ */

// ── EJERCICIOS (loaded from JSON) ─────────────────────────

/**
 * Exercise Manager - Loads exercises from JSON file
 * Separates content from logic for easier maintenance
 */
let EXERCISES = [];

async function loadExercises() {
  const container = document.getElementById('ex-list');

  // Show loading state
  if (container) {
    container.innerHTML = `
      <div class="ex-loading">
        <div class="ex-loading-spinner"></div>
        <div class="ex-loading-text">Cargando ejercicios...</div>
      </div>
    `;
  }

  try {
    const response = await fetch('../data/exercises-java.json');
    if (!response.ok) throw new Error('Failed to load exercises');
    EXERCISES = await response.json();
    renderEjercicios('todos');
  } catch (error) {
    console.error('Error loading exercises:', error);
    const container = document.getElementById('ex-list');
    if (container) {
      container.innerHTML = `
        <div class="card card-accent coral">
          <h3>Error al cargar ejercicios</h3>
          <p>No se pudo cargar el archivo exercises-java.json. Verificá que el archivo exista y tenga formato JSON válido.</p>
          <p style="font-family:'DM Mono',monospace;font-size:0.8rem;margin-top:0.5rem">Detalle: ${error.message}</p>
        </div>
      `;
    }
  }
}

// ── MODULE CONFIG ─────────────────────────────────────────

const MODULE_NAME = 'java'; // For StateManager
const TOTAL_EXERCISES = 20;

// ── ESTADÍSTICAS ──────────────────────────────────────────

function updateStats() {
  const report = StateManager.getModuleProgress(MODULE_NAME, TOTAL_EXERCISES);
  document.getElementById('cnt-total').textContent = TOTAL_EXERCISES;
  document.getElementById('cnt-done').textContent = report.completed;
  document.getElementById('cnt-pct').textContent = report.percentage + '%';
  document.getElementById('prog-fill').style.width = report.percentage + '%';
}

// ── RENDER EJERCICIOS ─────────────────────────────────────

function renderEjercicios(filtro) {
  const container = document.getElementById('ex-list');
  container.innerHTML = '';
  const lista = filtro === 'todos' ? EXERCISES : EXERCISES.filter(e => e.nivel === filtro);

  lista.forEach(ex => {
    const idx = EXERCISES.indexOf(ex);
    const exerciseData = StateManager.getExercise(MODULE_NAME, idx);
    const isDone = exerciseData?.completed || false;
    const savedText = exerciseData?.answer || '';
    const nClass = ex.nivel === 'Básico' ? 'basico' : ex.nivel === 'Intermedio' ? 'intermedio' : 'avanzado';
    const bNivel = ex.nivel === 'Básico' ? 'badge-basico' : ex.nivel === 'Intermedio' ? 'badge-intermedio' : 'badge-avanzado';

    const div = document.createElement('div');
    div.className = 'ex-item' + (isDone ? ' done' : '');
    div.id = 'ex-item-' + idx;
    div.innerHTML = `
      <div class="ex-num ${nClass}">${idx + 1}</div>
      <div class="ex-top">
        <div style="flex:1">
          <div class="ex-title">${ex.titulo}</div>
          <div class="badge-row">
            <span class="badge badge-tema">${ex.tema}</span>
            <span class="badge ${bNivel}">${ex.nivel}</span>
          </div>
          <div class="ex-enunciado">${ex.enunciado}</div>
          <div class="work-area-toggle" onclick="toggleBody(${idx})">
            <span class="toggle-icon">▶</span>
            <span>Trabajar en este ejercicio</span>
          </div>
          <div class="ex-body" id="body-${idx}">
            <div class="hint-box">
              <div class="hint-label">Pista</div>
              ${ex.hint}
            </div>
            <textarea class="work-textarea" id="ta-${idx}" placeholder="Escribí tu respuesta acá… código Java, análisis, justificaciones…" rows="6">${savedText}</textarea>
            <div class="work-actions">
              <button class="btn-save" onclick="saveAnswer(${idx})">Guardar respuesta</button>
              <button class="btn-clear" onclick="clearAnswer(${idx})">Limpiar</button>
              <span class="saved-msg" id="saved-${idx}">✓ Guardado</span>
            </div>
          </div>
        </div>
        <button class="check-btn${isDone ? ' done' : ''}" id="check-${idx}" onclick="toggleDone(${idx})" title="Marcar como completado">${isDone ? '✓' : ''}</button>
      </div>`;
    container.appendChild(div);
  });
  updateStats();
}

function toggleBody(idx) {
  document.getElementById('ex-item-' + idx).classList.toggle('open');
}

function saveAnswer(idx) {
  const ta = document.getElementById('ta-' + idx);
  StateManager.setAnswer(MODULE_NAME, idx, ta.value);
  const msg = document.getElementById('saved-' + idx);
  msg.style.display = 'inline';
  setTimeout(() => msg.style.display = 'none', 2000);
}

function clearAnswer(idx) {
  document.getElementById('ta-' + idx).value = '';
  StateManager.setAnswer(MODULE_NAME, idx, '');
}

function toggleDone(idx) {
  const exerciseData = StateManager.getExercise(MODULE_NAME, idx);
  StateManager.setExercise(MODULE_NAME, idx, !exerciseData.completed);
  const item = document.getElementById('ex-item-' + idx);
  const btn = document.getElementById('check-' + idx);
  const isNowDone = !exerciseData.completed;
  item.classList.toggle('done', isNowDone);
  btn.classList.toggle('done', isNowDone);
  btn.textContent = isNowDone ? '✓' : '';
  updateStats();
}

function filterEx(filtro, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderEjercicios(filtro);
}

// ── NAVEGACIÓN DE SECCIONES (Hash-based routing) ─────────

/**
 * Hash-based routing for section navigation
 * Updates active section and nav state based on URL hash
 */
function showSection(sectionId) {
  // Validate section exists
  const section = document.getElementById(sectionId);
  if (!section) {
    sectionId = 'primitivos'; // default fallback
  }

  // Update sections visibility
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');

  // Update nav tabs active state
  document.querySelectorAll('.nav-tab').forEach(tab => {
    const href = tab.getAttribute('href');
    const isActive = href === `#${sectionId}`;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Handle hash changes - triggered by browser back/forward and direct hash clicks
 */
function handleHashChange() {
  const hash = window.location.hash.slice(1) || 'primitivos';
  showSection(hash);
}

/**
 * Initialize hash-based routing
 */
(function initRouter() {
  // Listen for hash changes (back/forward buttons)
  window.addEventListener('hashchange', handleHashChange);

  // Handle initial page load
  if (!window.location.hash) {
    window.history.replaceState(null, '', '#primitivos');
  }
  handleHashChange();
})();

// ── BLOQUES DE CÓDIGO ─────────────────────────────────────
// Se renderizan desde JS para preservar la indentación exacta.

const CODE_BLOCKS = {

  'cb-declaracion': `<span class="cm">// Variables: tipo nombreVariable = valor;</span>
<span class="kw">int</span>     edad     <span class="op">=</span> <span class="nm">18</span>;
<span class="kw">double</span>  precio   <span class="op">=</span> <span class="nm">1299.99</span>;
<span class="kw">char</span>    inicial  <span class="op">=</span> <span class="fn">'D'</span>;
<span class="kw">boolean</span> aprobado <span class="op">=</span> <span class="nm">true</span>;
<span class="kw">String</span>  nombre   <span class="op">=</span> <span class="fn">"María"</span>;

<span class="cm">// Constantes: final tipo NOMBRE = valor;  (por convención: MAYÚSCULAS)</span>
<span class="kw">final double</span> PI        <span class="op">=</span> <span class="nm">3.14159265</span>;
<span class="kw">final int</span>    MAX_NOTAS <span class="op">=</span> <span class="nm">10</span>;

<span class="cm">// Long necesita sufijo L; float necesita sufijo f</span>
<span class="kw">long</span>  poblacion <span class="op">=</span> <span class="nm">8000000000L</span>;
<span class="kw">float</span> temp      <span class="op">=</span> <span class="nm">36.5f</span>;`,

  'cb-incremento': `<span class="kw">int</span> x <span class="op">=</span> <span class="nm">5</span>;

x<span class="op">++</span>;   <span class="cm">// post-incremento: usa x, luego suma 1  → x = 6</span>
<span class="op">++</span>x;   <span class="cm">// pre-incremento:  suma 1, luego usa x  → x = 7</span>
x<span class="op">--</span>;   <span class="cm">// post-decremento: usa x, luego resta 1 → x = 6</span>
<span class="op">--</span>x;   <span class="cm">// pre-decremento:  resta 1, luego usa x → x = 5</span>

<span class="cm">// Operadores de asignación compuesta</span>
x <span class="op">+=</span> <span class="nm">3</span>;   <span class="cm">// equivale a: x = x + 3  → x = 8</span>
x <span class="op">-=</span> <span class="nm">2</span>;   <span class="cm">// equivale a: x = x - 2  → x = 6</span>
x <span class="op">*=</span> <span class="nm">4</span>;   <span class="cm">// equivale a: x = x * 4  → x = 24</span>
x <span class="op">/=</span> <span class="nm">3</span>;   <span class="cm">// equivale a: x = x / 3  → x = 8 (división entera)</span>
x <span class="op">%=</span> <span class="nm">5</span>;   <span class="cm">// equivale a: x = x % 5  → x = 3</span>`,

  'cb-string': `<span class="cm">// Formas de crear un String</span>
<span class="kw">String</span> s1 <span class="op">=</span> <span class="fn">"Hola"</span>;                   <span class="cm">// literal (recomendado)</span>
<span class="kw">String</span> s2 <span class="op">=</span> <span class="kw">new</span> <span class="fn">String</span>(<span class="fn">"Hola"</span>);       <span class="cm">// objeto nuevo (poco usual)</span>

<span class="cm">// Concatenación con +</span>
<span class="kw">String</span> nombre   <span class="op">=</span> <span class="fn">"Diego"</span>;
<span class="kw">String</span> saludo   <span class="op">=</span> <span class="fn">"Hola, "</span> <span class="op">+</span> nombre <span class="op">+</span> <span class="fn">"!"</span>;  <span class="cm">// "Hola, Diego!"</span>

<span class="cm">// ¡NUNCA comparar Strings con ==!</span>
<span class="kw">String</span> a <span class="op">=</span> <span class="fn">"Java"</span>;
<span class="kw">String</span> b <span class="op">=</span> <span class="fn">"Java"</span>;
<span class="cm">// a == b   → compara referencias (puede ser false)</span>
<span class="cm">// a.equals(b) → compara contenido (siempre correcto) → true</span>

<span class="cm">// String puede ser null (sin objeto asignado)</span>
<span class="kw">String</span> sinValor <span class="op">=</span> <span class="kw">null</span>;`,

  'cb-wrapper': `<span class="cm">// Autoboxing: primitivo → objeto automáticamente</span>
<span class="kw">int</span>     numero  <span class="op">=</span> <span class="nm">42</span>;
Integer objeto  <span class="op">=</span> numero;   <span class="cm">// Java convierte solo</span>

<span class="cm">// Unboxing: objeto → primitivo automáticamente</span>
<span class="kw">Integer</span> wrapped <span class="op">=</span> <span class="nm">100</span>;
<span class="kw">int</span>     valor   <span class="op">=</span> wrapped;   <span class="cm">// Java convierte solo</span>

<span class="cm">// Métodos útiles de Integer</span>
<span class="kw">int</span> max  <span class="op">=</span> Integer.<span class="fn">MAX_VALUE</span>;   <span class="cm">// 2147483647</span>
<span class="kw">int</span> min  <span class="op">=</span> Integer.<span class="fn">MIN_VALUE</span>;   <span class="cm">// -2147483648</span>
<span class="kw">int</span> n    <span class="op">=</span> Integer.<span class="fn">parseInt</span>(<span class="fn">"55"</span>); <span class="cm">// String → int</span>

<span class="cm">// Métodos útiles de Double</span>
<span class="kw">double</span> d <span class="op">=</span> Double.<span class="fn">parseDouble</span>(<span class="fn">"3.14"</span>); <span class="cm">// String → double</span>
<span class="kw">String</span> s <span class="op">=</span> Double.<span class="fn">toString</span>(<span class="nm">9.75</span>);      <span class="cm">// double → String</span>`,

  'cb-widening': `<span class="cm">// Conversión implícita (automática): byte → short → int → long → float → double</span>
<span class="kw">byte</span>   b <span class="op">=</span> <span class="nm">10</span>;
<span class="kw">short</span>  s <span class="op">=</span> b;    <span class="cm">// byte → short ✓ automático</span>
<span class="kw">int</span>    i <span class="op">=</span> s;    <span class="cm">// short → int ✓ automático</span>
<span class="kw">long</span>   l <span class="op">=</span> i;    <span class="cm">// int → long ✓ automático</span>
<span class="kw">float</span>  f <span class="op">=</span> l;    <span class="cm">// long → float ✓ automático (puede perder precisión)</span>
<span class="kw">double</span> d <span class="op">=</span> f;    <span class="cm">// float → double ✓ automático</span>

<span class="cm">// También char se puede convertir a int automáticamente</span>
<span class="kw">char</span>   c <span class="op">=</span> <span class="fn">'A'</span>;
<span class="kw">int</span>    n <span class="op">=</span> c;    <span class="cm">// char → int: n vale 65 (código Unicode de 'A')</span>`,

  'cb-casting': `<span class="cm">// Conversión explícita (casting): formato → (tipoDestino) valor</span>
<span class="kw">double</span> d <span class="op">=</span> <span class="nm">9.75</span>;
<span class="kw">int</span>    i <span class="op">=</span> (<span class="kw">int</span>) d;     <span class="cm">// i = 9  (trunca, no redondea)</span>

<span class="kw">int</span>    x <span class="op">=</span> <span class="nm">130</span>;
<span class="kw">byte</span>   b <span class="op">=</span> (<span class="kw">byte</span>) x;   <span class="cm">// b = -126  (overflow: 130 > 127)</span>

<span class="cm">// Casting para forzar división real</span>
<span class="kw">int</span> a <span class="op">=</span> <span class="nm">7</span>, bb <span class="op">=</span> <span class="nm">2</span>;
<span class="kw">double</span> resultado <span class="op">=</span> (<span class="kw">double</span>) a <span class="op">/</span> bb;  <span class="cm">// 3.5</span>

<span class="cm">// Sin casting: resultado incorrecto</span>
<span class="kw">double</span> malo <span class="op">=</span> a <span class="op">/</span> bb;  <span class="cm">// 3.0 (la división entera ya fue 3)</span>

<span class="cm">// int → char</span>
<span class="kw">int</span>  codigo <span class="op">=</span> <span class="nm">65</span>;
<span class="kw">char</span> letra  <span class="op">=</span> (<span class="kw">char</span>) codigo;  <span class="cm">// letra = 'A'</span>`,

  'cb-parse': `<span class="cm">// String → número</span>
<span class="kw">String</span> entrada <span class="op">=</span> <span class="fn">"42"</span>;
<span class="kw">int</span>    numero  <span class="op">=</span> Integer.<span class="fn">parseInt</span>(entrada);    <span class="cm">// 42</span>
<span class="kw">double</span> decimal <span class="op">=</span> Double.<span class="fn">parseDouble</span>(<span class="fn">"3.14"</span>); <span class="cm">// 3.14</span>
<span class="kw">long</span>   largo   <span class="op">=</span> Long.<span class="fn">parseLong</span>(<span class="fn">"9000000000"</span>); <span class="cm">// ok</span>

<span class="cm">// número → String</span>
<span class="kw">String</span> s1 <span class="op">=</span> String.<span class="fn">valueOf</span>(<span class="nm">42</span>);        <span class="cm">// "42"</span>
<span class="kw">String</span> s2 <span class="op">=</span> Integer.<span class="fn">toString</span>(<span class="nm">42</span>);      <span class="cm">// "42"</span>
<span class="kw">String</span> s3 <span class="op">=</span> <span class="fn">""</span> <span class="op">+</span> <span class="nm">42</span>;                   <span class="cm">// "42" (concatenación)</span>

<span class="cm">// Manejo de entrada inválida</span>
<span class="kw">try</span> {
  <span class="kw">int</span> n <span class="op">=</span> Integer.<span class="fn">parseInt</span>(<span class="fn">"abc"</span>);  <span class="cm">// lanza NumberFormatException</span>
} <span class="kw">catch</span> (NumberFormatException e) {
  System.out.<span class="fn">println</span>(<span class="fn">"Número inválido"</span>);
}`,

  'cb-concat': `<span class="cm">// El operador + se evalúa de izquierda a derecha</span>
System.out.<span class="fn">println</span>(<span class="fn">"Total: "</span> <span class="op">+</span> <span class="nm">3</span> <span class="op">+</span> <span class="nm">4</span>);   <span class="cm">// "Total: 34" (no 7)</span>
System.out.<span class="fn">println</span>(<span class="fn">"Total: "</span> <span class="op">+</span> (<span class="nm">3</span> <span class="op">+</span> <span class="nm">4</span>)); <span class="cm">// "Total: 7" (con paréntesis)</span>
System.out.<span class="fn">println</span>(<span class="nm">3</span> <span class="op">+</span> <span class="nm">4</span> <span class="op">+</span> <span class="fn">" es el total"</span>); <span class="cm">// "7 es el total" (primero suma)</span>

<span class="kw">int</span> x <span class="op">=</span> <span class="nm">10</span>, y <span class="op">=</span> <span class="nm">5</span>;
System.out.<span class="fn">println</span>(<span class="fn">"Suma: "</span> <span class="op">+</span> x <span class="op">+</span> y);        <span class="cm">// "Suma: 105" ← trampa frecuente</span>
System.out.<span class="fn">println</span>(<span class="fn">"Suma: "</span> <span class="op">+</span> (x <span class="op">+</span> y));     <span class="cm">// "Suma: 15" ✓</span>

<span class="cm">// String.format para mayor claridad y control</span>
System.out.<span class="fn">printf</span>(<span class="fn">"Suma de %d y %d = %d%n"</span>, x, y, x<span class="op">+</span>y);<span class="cm"> // "Suma de 10 y 5 = 15"</span>`,

  'cb-nombres':
    `<span class="cm">// ── Identificadores válidos ──────────────────────────────</span>
<span class="kw">int</span>    cantidad  <span class="op">=</span> <span class="nm">1</span>;      <span class="cm">// ✓ camelCase</span>
<span class="kw">double</span> precioFinal   <span class="op">=</span> <span class="nm">19.99</span>;    <span class="cm">// ✓ camelCase</span>
<span class="kw">char</span>   _inicial      <span class="op">=</span> <span class="fn">'A'</span>;    <span class="cm">// ✓ guión bajo permitido al inicio</span>
<span class="kw">int</span>    $codigoPostal <span class="op">=</span> <span class="nm">11000</span>;  <span class="cm">// ✓ $ permitido (poco frecuente)</span>

<span class="cm">// ── Identificadores inválidos (error de compilación) ─────
// int 2nota = 0;              ✗ empieza con dígito
// String mi nombre = "";      ✗ tiene espacio
// boolean es-mayor = false;   ✗ guión está prohibido
// double class = 3.0;         ✗ "class" es palabra reservada

// ── Constantes → UPPER_SNAKE_CASE ────────────────────────</span>
<span class="kw">final int</span>    MAX_INTENTOS   <span class="op">=</span> <span class="nm">3</span>;
<span class="kw">final double</span> TASA_IVA       <span class="op">=</span> <span class="nm">0.22</span>;
<span class="kw">final String</span> NOMBRE_SISTEMA <span class="op">=</span> <span class="fn">"GestorEscolar"</span>;

<span class="cm">// ── Resumen de convenciones ───────────────────────────────
// Variables · métodos : camelCase      → edadAlumno, calcularNota()
// Constantes (final)  : UPPER_SNAKE    → MAX_NOTAS, TASA_IVA
// Clases · Interfaces : PascalCase     → MiClase, Serializable
// Paquetes            : todo.minúsculas → com.iti.prog1</span>`

};

function renderCodeBlocks() {
  Object.entries(CODE_BLOCKS).forEach(([id, content]) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = content;
  });
}

// ── INIT ──────────────────────────────────────────────────

renderCodeBlocks();
loadExercises(); // Load exercises from JSON file
