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

(function () {
          var currentType = 'variable';

          var RESERVED = new Set([
            // Palabras clave del lenguaje Java (JLS 17)
            'abstract', 'assert', 'boolean', 'break', 'byte',
            'case', 'catch', 'char', 'class', 'const',
            'continue', 'default', 'do', 'double', 'else',
            'enum', 'extends', 'final', 'finally', 'float',
            'for', 'goto', 'if', 'implements', 'import',
            'instanceof', 'int', 'interface', 'long', 'native',
            'new', 'package', 'private', 'protected', 'public',
            'return', 'short', 'static', 'strictfp', 'super',
            'switch', 'synchronized', 'this', 'throw', 'throws',
            'transient', 'try', 'void', 'volatile', 'while',
            // Literales reservados
            'true', 'false', 'null',
            // Palabras contextuales (Java 9–21)
            'var', 'record', 'sealed', 'permits', 'yield',
            'module', 'open', 'opens', 'exports', 'requires',
            'provides', 'uses', 'with', 'to', 'transitive',
            // Tipos de la API estándar muy usados como nombre de variable
            'String', 'Integer', 'Double', 'Float', 'Long',
            'Short', 'Byte', 'Character', 'Boolean', 'Object',
            'System', 'Math', 'Scanner', 'Array', 'Arrays',
            'List', 'ArrayList', 'Map', 'HashMap', 'Set',
            'HashSet', 'Optional', 'Exception', 'Error'
          ]);

          window.setVnameType = function (btn) {
            document.querySelectorAll('.vname-type').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentType = btn.dataset.type;
            var input = document.getElementById('vname-input');
            input.placeholder = currentType === 'variable' ? 'nombreVariable' : 'MAX_INTENTOS';
            validateName();
          };

          window.validateName = function () {
            var name = document.getElementById('vname-input').value;
            var wrap = document.getElementById('vname-wrap');
            var badge = document.getElementById('vname-badge');
            var rules = document.getElementById('vname-rules');
            var sugg = document.getElementById('vname-suggestion');

            if (!name) {
              wrap.className = 'vname-wrap';
              badge.className = 'vname-badge';
              badge.textContent = '—';
              rules.innerHTML = '';
              sugg.style.display = 'none';
              return;
            }

            var checks = [];
            var errors = 0;
            var warns = 0;

            // 1. No empieza con dígito
            var noDigitStart = !/^\d/.test(name);
            checks.push({
              ok: noDigitStart, warn: false,
              text: noDigitStart
                ? 'No empieza con un dígito ✓'
                : 'No puede empezar con un dígito — ej: <code>2nota</code> es inválido'
            });
            if (!noDigitStart) errors++;

            // 2. Solo caracteres permitidos
            var validChars = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name);
            checks.push({
              ok: validChars, warn: false,
              text: validChars
                ? 'Solo letras, dígitos, <code>_</code> y <code>$</code> ✓'
                : 'Contiene caracteres no permitidos (espacios, guiones, ñ, acentos…)'
            });
            if (!validChars) errors++;

            // 3. No es palabra reservada
            var notReserved = !RESERVED.has(name);
            var reservedNote = RESERVED.has(name)
              ? ([
                'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const',
                'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'final', 'finally', 'float',
                'for', 'goto', 'if', 'implements', 'import', 'instanceof', 'int', 'interface', 'long', 'native',
                'new', 'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp',
                'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'try', 'void',
                'volatile', 'while', 'true', 'false', 'null', 'var', 'record', 'sealed', 'permits', 'yield',
                'module', 'open', 'opens', 'exports', 'requires', 'provides', 'uses', 'with', 'to', 'transitive'
              ].includes(name)
                ? 'palabra clave del lenguaje'
                : 'nombre de tipo estándar — sí compila, pero es confuso y no convencional')
              : '';
            checks.push({
              ok: notReserved, warn: false,
              text: notReserved
                ? 'No es una palabra reservada ✓'
                : '<code>' + name + '</code> es ' + reservedNote
            });
            if (!notReserved) errors++;

            // 4. Convención según tipo
            if (currentType === 'variable') {
              var startsLower = /^[a-z_$]/.test(name);
              checks.push({
                ok: startsLower, warn: !startsLower,
                text: startsLower
                  ? 'Empieza en minúscula — convención <em>camelCase</em> ✓'
                  : 'Las variables deben empezar con minúscula (<em>camelCase</em>): <code>' +
                  name.charAt(0).toLowerCase() + name.slice(1) + '</code>'
              });
              if (!startsLower) warns++;
            } else {
              var isUpperSnake = /^[A-Z][A-Z0-9_]*$/.test(name);
              checks.push({
                ok: isUpperSnake, warn: !isUpperSnake,
                text: isUpperSnake
                  ? 'Sigue la convención <em>UPPER_SNAKE_CASE</em> ✓'
                  : 'Las constantes usan <em>UPPER_SNAKE_CASE</em>: todo mayúsculas con <code>_</code> como separador'
              });
              if (!isUpperSnake) warns++;
            }

            // 5. Nombre de un solo carácter
            if (name.length === 1 && /^[a-zA-Z_$]$/.test(name)) {
              checks.push({
                ok: false, warn: true,
                text: 'Un solo carácter está permitido pero usa nombres descriptivos (excepción: contadores <code>i</code>, <code>j</code>)'
              });
              warns++;
            }

            // Render
            rules.innerHTML = checks.map(c => {
              var cls = c.ok ? 'vname-rule-ok' : (c.warn ? 'vname-rule-warn' : 'vname-rule-ko');
              var icon = c.ok ? '✓' : (c.warn ? '⚠' : '✗');
              return '<div class="vname-rule ' + cls + '">'
                + '<span class="vname-rule-icon">' + icon + '</span>'
                + '<span>' + c.text + '</span>'
                + '</div>';
            }).join('');

            // Estado global
            if (errors > 0) {
              wrap.className = 'vname-wrap invalid';
              badge.className = 'vname-badge ko';
              badge.textContent = '✗ Inválido';
            } else if (warns > 0) {
              wrap.className = 'vname-wrap warn';
              badge.className = 'vname-badge warn';
              badge.textContent = '⚠ Convención';
            } else {
              wrap.className = 'vname-wrap valid';
              badge.className = 'vname-badge ok';
              badge.textContent = '✓ Válido';
            }

            // Sugerencia
            var suggested = suggest(name, currentType);
            if (suggested && suggested !== name) {
              sugg.style.display = 'block';
              sugg.innerHTML = '💡 Sugerencia: <strong>' + suggested + '</strong>';
            } else {
              sugg.style.display = 'none';
            }
          };

          function suggest(name, type) {
            var clean = name.replace(/[^a-zA-Z0-9_$]/g, '');
            if (!clean) return null;
            if (type === 'variable') {
              return clean.charAt(0).toLowerCase() + clean.slice(1);
            } else {
              // convierte camelCase o texto a UPPER_SNAKE
              return clean
                .replace(/([a-z])([A-Z])/g, '$1_$2')
                .toUpperCase()
                .replace(/^_+|_+$/g, '');
            }
          }
        })();

function calcOp() {
          var a1 = +document.getElementById('a1').value;
          var b1 = +document.getElementById('b1').value;
          var a2 = +document.getElementById('a2').value;
          var b2 = +document.getElementById('b2').value;
          var a3 = +document.getElementById('a3').value;
          var b3 = +document.getElementById('b3').value;
          var a4 = +document.getElementById('a4').value;
          var b4 = +document.getElementById('b4').value;
          var a5 = +document.getElementById('a5').value;
          var b5 = +document.getElementById('b5').value;

          document.getElementById('r-sum').textContent = fmt(a1 + b1);
          document.getElementById('r-sub').textContent = fmt(a2 - b2);
          document.getElementById('r-mul').textContent = fmt(a3 * b3);

          // División: simula int/int (trunca hacia cero)
          if (b4 === 0) {
            document.getElementById('r-div').textContent = '∞ (/ 0)';
            document.getElementById('div-real').textContent = '∞';
            document.getElementById('div-note').style.display = 'block';
          } else {
            var realDiv = a4 / b4;
            var intDiv = Math.trunc(realDiv);
            document.getElementById('r-div').textContent = intDiv;
            document.getElementById('div-real').textContent = +realDiv.toFixed(6);
            // Mostrar la nota solo cuando hay diferencia
            document.getElementById('div-note').style.display =
              (intDiv !== realDiv) ? 'block' : 'none';
          }

          // Módulo
          if (b5 === 0) {
            document.getElementById('r-mod').textContent = '∞ (/ 0)';
          } else {
            document.getElementById('r-mod').textContent = fmt(a5 % b5);
          }
        }

        function fmt(n) {
          if (!isFinite(n)) return '∞';
          // Redondear a 10 decimales para evitar ruido de punto flotante
          return +n.toFixed(10);
        }

(function () {
          var xVal = 5;
          var step = 0;
          var initialX = 5;

          window.incSetX = function () {
            var v = parseInt(document.getElementById('inc-x-input').value, 10);
            if (isNaN(v)) return;
            xVal = v;
            initialX = v;
            updateDisplay();
            clearResults();
            clearLog();
            step = 0;
          };

          window.incReset = function () {
            xVal = initialX;
            step = 0;
            updateDisplay();
            clearResults();
            clearLog();
          };

          window.incRun = function (btn) {
            var row = btn.closest('.inc-op');
            var op = row.dataset.op.trim();
            var prev = xVal;
            var operandEl = row.querySelector('.inc-operand');
            var n = operandEl ? (parseInt(operandEl.value, 10) || 0) : 0;

            step++;

            var desc = '';
            switch (op) {
              case 'post++': xVal++; desc = 'x++ → usó ' + prev + ', luego x = ' + xVal; break;
              case '++pre': ++xVal; desc = '++x → x = ' + xVal + ' (antes de usar)'; break;
              case 'post--': xVal--; desc = 'x-- → usó ' + prev + ', luego x = ' + xVal; break;
              case '--pre': --xVal; desc = '--x → x = ' + xVal + ' (antes de usar)'; break;
              case '+=': xVal += n; desc = 'x += ' + n + ' → ' + prev + ' + ' + n + ' = ' + xVal; break;
              case '-=': xVal -= n; desc = 'x -= ' + n + ' → ' + prev + ' - ' + n + ' = ' + xVal; break;
              case '*=': xVal *= n; desc = 'x *= ' + n + ' → ' + prev + ' × ' + n + ' = ' + xVal; break;
              case '/=': xVal = Math.trunc(xVal / n); desc = 'x /= ' + n + ' → ⌊' + prev + ' ÷ ' + n + '⌋ = ' + xVal + (n === 0 ? ' (⚠ div/0)' : ''); break;
              case '%=': xVal = n !== 0 ? xVal % n : NaN; desc = 'x %= ' + n + ' → ' + prev + ' mod ' + n + ' = ' + xVal + (n === 0 ? ' (⚠ div/0)' : ''); break;
            }

            if (isNaN(xVal)) xVal = 0;

            // Mostrar resultado en la fila
            var resId = 'res-' + op;
            var resEl = document.getElementById(resId);
            if (resEl) resEl.textContent = '→ x = ' + xVal;

            // Marcar fila como ejecutada
            document.querySelectorAll('.inc-op').forEach(r => r.classList.remove('ran'));
            row.classList.add('ran');

            updateDisplay();
            addLog(step, op, prev, xVal, desc, n);
          };

          function updateDisplay() {
            var el = document.getElementById('inc-val');
            el.textContent = xVal;
            el.classList.remove('flash');
            // reflow para reiniciar la transición
            void el.offsetWidth;
            el.classList.add('flash');
            setTimeout(function () { el.classList.remove('flash'); }, 250);
          }

          function clearResults() {
            document.querySelectorAll('.inc-op-result').forEach(function (el) { el.textContent = ''; });
            document.querySelectorAll('.inc-op').forEach(function (r) { r.classList.remove('ran'); });
          }

          function clearLog() {
            var log = document.getElementById('inc-log');
            log.innerHTML = '<span style="color:var(--muted);font-size:0.8rem;">Ejecutá una operación para ver el historial…</span>';
          }

          function addLog(s, op, before, after, desc, n) {
            var log = document.getElementById('inc-log');
            // Limpiar placeholder si es primer entrada
            if (log.querySelector('span')) log.innerHTML = '';

            var entry = document.createElement('div');
            entry.className = 'inc-log-entry';
            entry.innerHTML =
              '<span class="inc-log-step">' + s + '.</span>' +
              '<span class="inc-log-op">' + desc + '</span>';
            log.appendChild(entry);
            log.scrollTop = log.scrollHeight;
          }
        })();

(function () {

          /* ── PESTAÑA ── */
          window.strTab = function (btn, panel) {
            document.querySelectorAll('.str-tab').forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('panel-concat').style.display = panel === 'concat' ? '' : 'none';
            document.getElementById('panel-methods').style.display = panel === 'methods' ? '' : 'none';
          };

          /* ── CONCATENACIÓN ── */
          function q(id) { return document.getElementById(id); }

          /* Renderiza un string mostrando espacios como · en monospace */
          function showSpaces(s) {
            return s.split('').map(function (c) {
              return c === ' ' ? '<span class="sp">·</span>' : '<span class="ch">' + c.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</span>';
            }).join('');
          }

          /* Actualiza el visualizador de espacios del input */
          function updateViz(inputId, vizId) {
            var el = document.getElementById(vizId);
            if (el) el.innerHTML = showSpaces(document.getElementById(inputId).value);
          }

          window.runConcat = function () {
            var s1 = q('s1').value;
            var s2 = q('s2').value;
            var res = s1 + s2;

            q('concat-result').textContent = '"' + res + '"';
            q('concat-meta').textContent = 'length: ' + res.length + ' carácter' + (res.length === 1 ? '' : 'es');

            // Código Java
            q('cj-s1').textContent = '"' + s1 + '"';
            q('cj-s2').textContent = '"' + s2 + '"';
            q('cj-res').textContent = '"' + res + '"';

            // Contadores
            q('ci-s1-len').textContent = s1.length;
            q('ci-s2-len').textContent = s2.length;
            q('ci-total-len').textContent = res.length;
          };

          /* ── MÉTODOS ── */
          window.runMethods = function () {
            var s = q('sm').value;
            updateViz('sm', 'sm-viz');

            /* setM: muestra el valor con comillas si es string, preservando espacios */
            function setM(id, val) {
              var el = q('m-' + id);
              if (typeof val === 'string') {
                /* Mostrar → "valor" con espacios visibles como · */
                el.innerHTML = '→  "' + showSpaces(val) + '"';
              } else {
                el.textContent = '→  ' + String(val);
              }
            }

            setM('length', s.length);
            setM('trim', s.trim());
            setM('upper', s.toUpperCase());
            setM('lower', s.toLowerCase());
            setM('charat', s.length > 0 ? s.charAt(0) : '(vacío)');
            setM('empty', s.length === 0 ? 'true' : 'false');
            setM('contains', s.includes('Mundo') ? 'true' : 'false');
            setM('indexof', s.indexOf('Mundo'));
            setM('sub', s.length >= 4 ? s.substring(0, 4) : s.substring(0));
            setM('replace', s.replace(/Mundo/g, 'Java'));
            setM('equals', s === 'hola' ? 'true' : 'false');
            setM('equalsic', s.toLowerCase() === 'hola' ? 'true' : 'false');
          };

          /* Inicializar — el value via JS preserva espacios sin problemas del parser HTML */
          q('sm').value = '  Hola Mundo  ';
          runConcat();
          runMethods();

        })();

(function () {
          // Asignar costantes iniciales para evitar harcoding visual molesto
          document.querySelectorAll('.wrap-const-val')[0].textContent = '2147483647';
          document.querySelectorAll('.wrap-const-val')[1].textContent = '-2147483648';

          window.runWrap = function () {
            var strEl = document.getElementById('win-str');
            if (!strEl) return;
            var str = strEl.value;

            // Int Parsing
            var resInt = document.getElementById('wres-int');
            if (/^[-+]?\d+$/.test(str)) {
              var i = parseInt(str, 10);
              if (i > 2147483647 || i < -2147483648) {
                resInt.textContent = '❌ NumberFormatException';
                resInt.className = 'wrap-res error';
                resInt.title = 'El valor está fuera de los límites permisibles de int';
              } else {
                resInt.textContent = i;
                resInt.className = 'wrap-res';
                resInt.removeAttribute('title');
              }
            } else {
              resInt.textContent = '❌ NumberFormatException';
              resInt.className = 'wrap-res error';
              resInt.title = 'La cadena contiene caracteres inválidos o espacios para tipo int';
            }

            // Double Parsing
            var resDouble = document.getElementById('wres-double');
            if (str.trim() === str && str !== "" && !isNaN(Number(str))) {
              var d = Number(str);
              resDouble.textContent = d + (Number.isInteger(d) ? '.0' : '');
              resDouble.className = 'wrap-res';
              resDouble.removeAttribute('title');
            } else {
              resDouble.textContent = '❌ NumberFormatException';
              resDouble.className = 'wrap-res error';
              resDouble.title = 'Formato decimal inválido en Java. No debe contener espacios en absoluto.';
            }

            // Double to String
            var num = document.getElementById('win-num').value;
            var resStr = document.getElementById('wres-str');
            if (num === "") num = "0.0";
            else if (Number.isInteger(Number(num))) num += ".0";
            resStr.textContent = '"' + num + '"';
          }

          // Initial run
          setTimeout(runWrap, 100);
        })();

(function() {
          function parseStr(str) {
              let tokens = [];
              let regex = /\s*(?:(\d+(?:\.\d+)?)|("(?:[^"\\]|\\.)*")|([a-zA-Z_]\w*)|(\+)|(\()|(\)))\s*/g;
              let match;
              let lastIndex = 0;
              while ((match = regex.exec(str)) !== null) {
                  if (match.index !== lastIndex) throw "Caracter desconocido";
                  if (match[1]) tokens.push({type:'num', val: parseFloat(match[1])});
                  else if (match[2]) tokens.push({type:'str', val: match[2].slice(1,-1)});
                  else if (match[3]) tokens.push({type:'var', val: match[3]});
                  else if (match[4]) tokens.push({type:'+', val: '+'});
                  else if (match[5]) tokens.push({type:'(', val: '('});
                  else if (match[6]) tokens.push({type:')', val: ')'});
                  lastIndex = regex.lastIndex;
              }
              if (lastIndex !== str.length) throw "Sintaxis inválida";

              let pos = 0;
              let env = { x: {val: 10, ts: 'int'}, y: {val: 5, ts: 'int'} };

              function e() {
                  let left = t();
                  while (pos < tokens.length && tokens[pos].type === '+') {
                      pos++;
                      let right = t();
                      left = {type:'add', left: left, right: right};
                  }
                  return left;
              }

              function t() {
                  if (pos >= tokens.length) throw "Expresión cortada prematuramente";
                  let tok = tokens[pos++];
                  if (tok.type === 'num') return {type:'literal', ts:'number', val: tok.val};
                  if (tok.type === 'str') return {type:'literal', ts:'string', val: tok.val};
                  if (tok.type === 'var') {
                      if (!(tok.val in env)) throw "Variable '" + tok.val + "' no declarada";
                      return {type:'literal', ts: env[tok.val].ts, val: env[tok.val].val, name: tok.val};
                  }
                  if (tok.type === '(') {
                      let node = e();
                      if (pos >= tokens.length || tokens[pos].type !== ')') throw "Falta cerrar un paréntesis";
                      pos++;
                      return {type:'group', inner: node};
                  }
                  throw "Se esperaba un número, variable o cadena";
              }

              if (tokens.length === 0) return null;
              let res = e();
              if (pos < tokens.length) throw "Error de jerarquía (¿paréntesis desbalanceado?)";
              return res;
          }

          window.runCat = function() {
              let expr = document.getElementById('cl-expr').value;
              let stepsDiv = document.getElementById('cl-steps');
              let outDiv = document.getElementById('cl-out');
              
              if (!expr.trim()) {
                  stepsDiv.innerHTML = '';
                  outDiv.className = 'cl-out-term';
                  outDiv.textContent = '';
                  return;
              }

              let steps = [];
              function evaluate(node) {
                  if (node.type === 'literal') {
                      let rep = node.name || (node.ts === 'string' ? '"' + node.val + '"' : String(node.val));
                      return {val: node.val, ts: node.ts === 'string' ? 'String' : 'int', rep: rep};
                  }
                  if (node.type === 'group') {
                      return evaluate(node.inner);
                  }
                  if (node.type === 'add') {
                      let L = evaluate(node.left);
                      let R = evaluate(node.right);
                      let ts = (L.ts === 'String' || R.ts === 'String') ? 'String' : 'int';
                      let val = (ts === 'String') ? String(L.val) + String(R.val) : Number(L.val) + Number(R.val);
                      let outRep = (ts === 'String') ? '"' + val + '"' : String(val);
                      steps.push(`<div class="cl-step-row"><code>${L.rep} + ${R.rep}</code> <span style="color:var(--muted); margin:0 0.5rem;">→</span> <span style="color:var(--${ts==='String'?'amber':'teal'})">${outRep}</span> <span style="font-size:0.75rem; color:var(--muted); margin-left:0.5rem">(${ts})</span></div>`);
                      return {val: val, ts: ts, rep: outRep};
                  }
              }

              try {
                  let ast = parseStr(expr);
                  if (!ast) throw "No hay código a evaluar";
                  let end = evaluate(ast);
                  stepsDiv.innerHTML = steps.length > 0 ? steps.join('') : '<div class="cl-step-row" style="opacity:0.6; border-color:var(--muted)">Expresión litera directa. Nada que procesar.</div>';
                  outDiv.className = 'cl-out-term';
                  outDiv.textContent = end.ts === 'String' ? end.val : String(end.val);
              } catch (err) {
                  stepsDiv.innerHTML = `<div class="cl-step-row" style="border-left-color:var(--coral); color:var(--coral)"><i style="font-size: 0.9rem">Error Sintáctico:</i> ${err}</div>`;
                  outDiv.className = 'cl-out-term cl-out-error';
                  outDiv.textContent = "Error de compilación o ejecución";
              }
          }

          setTimeout(runCat, 100);
        })();
