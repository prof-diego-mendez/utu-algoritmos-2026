/* ============================================================
   if-java.js
   Lógica interactiva para la página de Estructura IF en Java.
   ============================================================ */

// ── CONFIG ───────────────────────────────────────────────
const MODULE_NAME   = 'if';
const TOTAL_EXERCISES = 20;
let EXERCISES = [];

// ── EXERCISES (JSON) ─────────────────────────────────────

async function loadExercises() {
  const container = document.getElementById('ex-list');
  if (container) {
    container.innerHTML = `
      <div class="ex-loading">
        <div class="ex-loading-spinner"></div>
        <div class="ex-loading-text">Cargando ejercicios...</div>
      </div>`;
  }
  try {
    const response = await fetch('../data/exercises-if.json');
    if (!response.ok) throw new Error('No se pudo cargar exercises-if.json');
    EXERCISES = await response.json();
    renderEjercicios('todos');
  } catch (err) {
    if (container) {
      container.innerHTML = `
        <div class="card card-accent coral">
          <h3>Error al cargar ejercicios</h3>
          <p>Verificá que el archivo <code>data/exercises-if.json</code> exista.</p>
          <p style="font-family:'DM Mono',monospace;font-size:0.8rem;margin-top:0.5rem">Detalle: ${err.message}</p>
        </div>`;
    }
  }
}

function updateStats() {
  const report = StateManager.getModuleProgress(MODULE_NAME, TOTAL_EXERCISES);
  document.getElementById('cnt-total').textContent = TOTAL_EXERCISES;
  document.getElementById('cnt-done').textContent  = report.completed;
  document.getElementById('cnt-pct').textContent   = report.percentage + '%';
  document.getElementById('prog-fill').style.width = report.percentage + '%';
}

function renderEjercicios(filtro) {
  const container = document.getElementById('ex-list');
  container.innerHTML = '';
  const lista = filtro === 'todos' ? EXERCISES : EXERCISES.filter(e => e.nivel === filtro);

  lista.forEach(ex => {
    const idx    = EXERCISES.indexOf(ex);
    const data   = StateManager.getExercise(MODULE_NAME, idx);
    const isDone = data?.completed || false;
    const saved  = data?.answer || '';
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
            <textarea class="work-textarea" id="ta-${idx}" placeholder="Escribí tu código Java, análisis o justificación acá…" rows="6">${saved}</textarea>
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
  const val = document.getElementById('ta-' + idx).value;
  StateManager.setAnswer(MODULE_NAME, idx, val);
  const msg = document.getElementById('saved-' + idx);
  msg.style.display = 'inline';
  setTimeout(() => { msg.style.display = 'none'; }, 2000);
}

function clearAnswer(idx) {
  document.getElementById('ta-' + idx).value = '';
  StateManager.setAnswer(MODULE_NAME, idx, '');
}

function toggleDone(idx) {
  const data = StateManager.getExercise(MODULE_NAME, idx);
  StateManager.setExercise(MODULE_NAME, idx, !data.completed);
  const nowDone = !data.completed;
  document.getElementById('ex-item-' + idx).classList.toggle('done', nowDone);
  const btn = document.getElementById('check-' + idx);
  btn.classList.toggle('done', nowDone);
  btn.textContent = nowDone ? '✓' : '';
  updateStats();
}

function filterEx(filtro, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderEjercicios(filtro);
}

// ── NAVEGACIÓN (hash routing) ────────────────────────────

function showSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) sectionId = 'intro';
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('.nav-tab').forEach(tab => {
    const href = tab.getAttribute('href');
    const isActive = href === `#${sectionId}`;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleHashChange() {
  const hash = window.location.hash.slice(1) || 'intro';
  showSection(hash);
}

(function initRouter() {
  window.addEventListener('hashchange', handleHashChange);
  if (!window.location.hash) {
    window.history.replaceState(null, '', '#intro');
  }
  handleHashChange();
})();

// ── BLOQUES DE CÓDIGO ────────────────────────────────────

const CODE_BLOCKS = {

  'cb-if-simple': `<span class="cm">// Sintaxis: IF simple</span>
<span class="kw">if</span> (condición) {
    <span class="cm">// este bloque se ejecuta SOLO si condición es true</span>
    sentencia;
}
<span class="cm">// esta línea se ejecuta SIEMPRE (esté o no el if)</span>

<span class="cm">// ── Ejemplo concreto ─────────────────────────────────────</span>
<span class="kw">int</span> temperatura <span class="op">=</span> <span class="nm">35</span>;
<span class="kw">if</span> (temperatura <span class="op">></span> <span class="nm">30</span>) {
    System.out.<span class="fn">println</span>(<span class="fn">"Hace calor — usá protector solar"</span>);
}
System.out.<span class="fn">println</span>(<span class="fn">"Fin del programa"</span>);  <span class="cm">// siempre se ejecuta</span>`,

  'cb-if-else': `<span class="cm">// Sintaxis: IF-ELSE</span>
<span class="kw">if</span> (condición) {
    <span class="cm">// se ejecuta si condición es true</span>
    sentenciaA;
} <span class="kw">else</span> {
    <span class="cm">// se ejecuta si condición es false</span>
    sentenciaB;
}
<span class="cm">// Exactamente UNA de las dos ramas siempre se ejecuta</span>

<span class="cm">// ── Ejemplo: aprobado / desaprobado ──────────────────────</span>
<span class="kw">int</span> nota <span class="op">=</span> <span class="nm">7</span>;
<span class="kw">if</span> (nota <span class="op">>=</span> <span class="nm">6</span>) {
    System.out.<span class="fn">println</span>(<span class="fn">"Aprobado"</span>);
} <span class="kw">else</span> {
    System.out.<span class="fn">println</span>(<span class="fn">"Desaprobado"</span>);
}`,

  'cb-if-else-if': `<span class="cm">// Sintaxis: IF-ELSE-IF encadenado</span>
<span class="kw">if</span> (condición1) {
    sentenciaA;             <span class="cm">// solo si condición1 es true</span>
} <span class="kw">else if</span> (condición2) {
    sentenciaB;             <span class="cm">// solo si condición2 es true (y condición1 fue false)</span>
} <span class="kw">else if</span> (condición3) {
    sentenciaC;
} <span class="kw">else</span> {
    sentenciaD;             <span class="cm">// si NINGUNA condición fue true</span>
}

<span class="cm">// ── Ejemplo: calificación descriptiva ────────────────────</span>
<span class="kw">int</span> nota <span class="op">=</span> <span class="nm">8</span>;
<span class="kw">if</span>      (nota <span class="op">>=</span> <span class="nm">9</span>) { System.out.<span class="fn">println</span>(<span class="fn">"Sobresaliente"</span>); }
<span class="kw">else if</span> (nota <span class="op">>=</span> <span class="nm">7</span>) { System.out.<span class="fn">println</span>(<span class="fn">"Muy bueno"</span>);      }
<span class="kw">else if</span> (nota <span class="op">>=</span> <span class="nm">6</span>) { System.out.<span class="fn">println</span>(<span class="fn">"Bueno"</span>);           }
<span class="kw">else if</span> (nota <span class="op">>=</span> <span class="nm">5</span>) { System.out.<span class="fn">println</span>(<span class="fn">"Regular"</span>);         }
<span class="kw">else</span>               { System.out.<span class="fn">println</span>(<span class="fn">"Insuficiente"</span>);    }`,

  'cb-rel-ops': `<span class="kw">int</span> a <span class="op">=</span> <span class="nm">10</span>, b <span class="op">=</span> <span class="nm">5</span>;

<span class="kw">boolean</span> r1 <span class="op">=</span> a <span class="op">></span>  b;   <span class="cm">// 10 >  5 → true   (mayor que)</span>
<span class="kw">boolean</span> r2 <span class="op">=</span> a <span class="op"><</span>  b;   <span class="cm">// 10 <  5 → false  (menor que)</span>
<span class="kw">boolean</span> r3 <span class="op">=</span> a <span class="op">>=</span> b;   <span class="cm">// 10 >= 5 → true   (mayor o igual)</span>
<span class="kw">boolean</span> r4 <span class="op">=</span> a <span class="op"><=</span> b;   <span class="cm">// 10 <= 5 → false  (menor o igual)</span>
<span class="kw">boolean</span> r5 <span class="op">=</span> a <span class="op">==</span> b;   <span class="cm">// 10 == 5 → false  (igual a)     ← ¡doble =!</span>
<span class="kw">boolean</span> r6 <span class="op">=</span> a <span class="op">!=</span> b;   <span class="cm">// 10 != 5 → true   (distinto de)</span>`,

  'cb-log-ops': `<span class="kw">boolean</span> p <span class="op">=</span> <span class="nm">true</span>,  q <span class="op">=</span> <span class="nm">false</span>;

<span class="cm">// AND (&&): verdadero solo si AMBOS son verdaderos</span>
<span class="kw">boolean</span> r1 <span class="op">=</span> p <span class="op">&&</span> q;   <span class="cm">// true  && false → false</span>
<span class="kw">boolean</span> r2 <span class="op">=</span> p <span class="op">&&</span> p;   <span class="cm">// true  && true  → true</span>

<span class="cm">// OR (||): verdadero si AL MENOS UNO es verdadero</span>
<span class="kw">boolean</span> r3 <span class="op">=</span> p <span class="op">||</span> q;   <span class="cm">// true  || false → true</span>
<span class="kw">boolean</span> r4 <span class="op">=</span> q <span class="op">||</span> q;   <span class="cm">// false || false → false</span>

<span class="cm">// NOT (!): invierte el valor</span>
<span class="kw">boolean</span> r5 <span class="op">=</span> <span class="op">!</span>p;        <span class="cm">// !true  → false</span>
<span class="kw">boolean</span> r6 <span class="op">=</span> <span class="op">!</span>q;        <span class="cm">// !false → true</span>

<span class="cm">// Combinados: precedencia  ! > && > ||</span>
<span class="kw">int</span> edad <span class="op">=</span> <span class="nm">20</span>;
<span class="kw">boolean</span> tieneDocumento <span class="op">=</span> <span class="nm">true</span>;
<span class="kw">if</span> (edad <span class="op">>=</span> <span class="nm">18</span> <span class="op">&&</span> tieneDocumento) {
    System.out.<span class="fn">println</span>(<span class="fn">"Puede votar"</span>);
}`,

  'cb-ternary': `<span class="cm">// Sintaxis: condición ? valorSÍ : valorNO</span>
<span class="cm">// Es equivalente a un IF-ELSE de una línea para asignar un valor</span>

<span class="kw">int</span> edad <span class="op">=</span> <span class="nm">20</span>;

<span class="cm">// Con IF-ELSE (forma larga):</span>
<span class="kw">String</span> categoria;
<span class="kw">if</span> (edad <span class="op">>=</span> <span class="nm">18</span>) {
    categoria <span class="op">=</span> <span class="fn">"adulto"</span>;
} <span class="kw">else</span> {
    categoria <span class="op">=</span> <span class="fn">"menor"</span>;
}

<span class="cm">// Con operador ternario (forma corta — mismo resultado):</span>
<span class="kw">String</span> categoria2 <span class="op">=</span> (edad <span class="op">>=</span> <span class="nm">18</span>) <span class="op">?</span> <span class="fn">"adulto"</span> <span class="op">:</span> <span class="fn">"menor"</span>;

<span class="cm">// Más ejemplos:</span>
<span class="kw">int</span>    n    <span class="op">=</span> <span class="nm">17</span>;
<span class="kw">String</span> tipo <span class="op">=</span> (n <span class="op">%</span> <span class="nm">2</span> <span class="op">==</span> <span class="nm">0</span>) <span class="op">?</span> <span class="fn">"par"</span> <span class="op">:</span> <span class="fn">"impar"</span>;  <span class="cm">// "impar"</span>
<span class="kw">int</span>    max  <span class="op">=</span> (a <span class="op">></span> b) <span class="op">?</span> a <span class="op">:</span> b;              <span class="cm">// el mayor entre a y b</span>`,

  'cb-nested': `<span class="cm">// IF anidado: un IF dentro de otro</span>
<span class="kw">int</span>     edad        <span class="op">=</span> <span class="nm">20</span>;
<span class="kw">boolean</span> tieneCarnet <span class="op">=</span> <span class="nm">true</span>;

<span class="kw">if</span> (edad <span class="op">>=</span> <span class="nm">18</span>) {             <span class="cm">// outer if</span>
    <span class="kw">if</span> (tieneCarnet) {         <span class="cm">// inner if</span>
        System.out.<span class="fn">println</span>(<span class="fn">"Puede conducir"</span>);
    } <span class="kw">else</span> {
        System.out.<span class="fn">println</span>(<span class="fn">"Mayor de edad pero sin carnet"</span>);
    }
} <span class="kw">else</span> {
    System.out.<span class="fn">println</span>(<span class="fn">"Menor de edad"</span>);
}

<span class="cm">// Equivalente usando &&  (pero pierde especificidad del mensaje):</span>
<span class="kw">if</span> (edad <span class="op">>=</span> <span class="nm">18</span> <span class="op">&&</span> tieneCarnet) {
    System.out.<span class="fn">println</span>(<span class="fn">"Puede conducir"</span>);
}`,

  'cb-string-cmp': `<span class="cm">// ❌ INCORRECTO: == compara referencias, no contenido</span>
<span class="kw">String</span> color <span class="op">=</span> <span class="fn">"rojo"</span>;
<span class="kw">if</span> (color <span class="op">==</span> <span class="fn">"rojo"</span>) {   <span class="cm">// puede dar false aunque el contenido sea igual</span>
    System.out.<span class="fn">println</span>(<span class="fn">"¡Esto puede fallar!"</span>);
}

<span class="cm">// ✅ CORRECTO: .equals() compara el contenido</span>
<span class="kw">if</span> (color.<span class="fn">equals</span>(<span class="fn">"rojo"</span>)) {
    System.out.<span class="fn">println</span>(<span class="fn">"Siempre funciona"</span>);
}

<span class="cm">// ✅ Sin importar mayúsculas/minúsculas:</span>
<span class="kw">if</span> (color.<span class="fn">equalsIgnoreCase</span>(<span class="fn">"ROJO"</span>)) {
    System.out.<span class="fn">println</span>(<span class="fn">"Ignora mayúsculas"</span>);
}

<span class="cm">// ✅ Protegerse contra null:</span>
<span class="kw">if</span> (color <span class="op">!=</span> <span class="nm">null</span> <span class="op">&&</span> color.<span class="fn">equals</span>(<span class="fn">"rojo"</span>)) {
    System.out.<span class="fn">println</span>(<span class="fn">"Seguro contra NullPointerException"</span>);
}`
};

function renderCodeBlocks() {
  Object.entries(CODE_BLOCKS).forEach(([id, content]) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = content;
  });
}

// ── EVALUADOR DE CONDICIONES ─────────────────────────────

function updateCondEval() {
  const a = parseFloat(document.getElementById('ce-a').value);
  const b = parseFloat(document.getElementById('ce-b').value);
  if (isNaN(a) || isNaN(b)) return;

  const conditions = [
    { expr: `a > b`,   res: a > b,   label: `<span class="ce-var">a</span> <span class="ce-op">&gt;</span> <span class="ce-var">b</span>` },
    { expr: `a < b`,   res: a < b,   label: `<span class="ce-var">a</span> <span class="ce-op">&lt;</span> <span class="ce-var">b</span>` },
    { expr: `a >= b`,  res: a >= b,  label: `<span class="ce-var">a</span> <span class="ce-op">&gt;=</span> <span class="ce-var">b</span>` },
    { expr: `a <= b`,  res: a <= b,  label: `<span class="ce-var">a</span> <span class="ce-op">&lt;=</span> <span class="ce-var">b</span>` },
    { expr: `a == b`,  res: a === b, label: `<span class="ce-var">a</span> <span class="ce-op">==</span> <span class="ce-var">b</span>` },
    { expr: `a != b`,  res: a !== b, label: `<span class="ce-var">a</span> <span class="ce-op">!=</span> <span class="ce-var">b</span>` },
    { expr: `a > 0`,   res: a > 0,   label: `<span class="ce-var">a</span> <span class="ce-op">&gt;</span> <span class="ce-var">0</span>` },
    { expr: `b > 0`,   res: b > 0,   label: `<span class="ce-var">b</span> <span class="ce-op">&gt;</span> <span class="ce-var">0</span>` },
    { expr: `a > 0 && b > 0`, res: a > 0 && b > 0, label: `<span class="ce-var">a</span><span class="ce-op">&gt;0</span> <span class="ce-op">&&</span> <span class="ce-var">b</span><span class="ce-op">&gt;0</span>` },
    { expr: `a > 0 || b > 0`, res: a > 0 || b > 0, label: `<span class="ce-var">a</span><span class="ce-op">&gt;0</span> <span class="ce-op">||</span> <span class="ce-var">b</span><span class="ce-op">&gt;0</span>` },
    { expr: `!(a == b)`, res: !(a === b), label: `<span class="ce-op">!</span>(<span class="ce-var">a</span><span class="ce-op">==</span><span class="ce-var">b</span>)` },
    { expr: `a % 2 == 0`, res: a % 2 === 0, label: `<span class="ce-var">a</span> <span class="ce-op">% 2 ==</span> <span class="ce-var">0</span>` },
  ];

  const grid = document.getElementById('ce-grid');
  if (!grid) return;
  grid.innerHTML = conditions.map(c => `
    <div class="cond-eval-row">
      <span class="cond-eval-expr">${c.label}</span>
      <span class="cond-eval-result ${c.res ? 'true-val' : 'false-val'}">${c.res ? 'true' : 'false'}</span>
    </div>`).join('');
}

// ── SIMULADOR DE RAMA IF ─────────────────────────────────

(function() {
  const TRACER_CODE = [
    { id: 'tc0', text: '<span class="kw">int</span> nota = <span class="val" id="tc-nota-val">7</span>;', branch: 'decl' },
    { id: 'tc1', text: '<span class="kw">if</span> (<span class="val" id="tc-nota-val2">nota</span> <span class="op">>=</span> <span class="nm">9</span>) {<span class="cm" id="tc-e1"> // &lt;— evaluando…</span>', branch: 'c1' },
    { id: 'tc2', text: '    System.out.<span class="fn">println</span>(<span class="str">"Sobresaliente"</span>);', branch: 'b1' },
    { id: 'tc3', text: '} <span class="kw">else if</span> (nota <span class="op">>=</span> <span class="nm">7</span>) {<span class="cm" id="tc-e2"> // &lt;— evaluando…</span>', branch: 'c2' },
    { id: 'tc4', text: '    System.out.<span class="fn">println</span>(<span class="str">"Muy bueno"</span>);', branch: 'b2' },
    { id: 'tc5', text: '} <span class="kw">else if</span> (nota <span class="op">>=</span> <span class="nm">6</span>) {<span class="cm" id="tc-e3"> // &lt;— evaluando…</span>', branch: 'c3' },
    { id: 'tc6', text: '    System.out.<span class="fn">println</span>(<span class="str">"Bueno"</span>);', branch: 'b3' },
    { id: 'tc7', text: '} <span class="kw">else if</span> (nota <span class="op">>=</span> <span class="nm">5</span>) {<span class="cm" id="tc-e4"> // &lt;— evaluando…</span>', branch: 'c4' },
    { id: 'tc8', text: '    System.out.<span class="fn">println</span>(<span class="str">"Regular"</span>);', branch: 'b4' },
    { id: 'tc9', text: '} <span class="kw">else</span> {', branch: 'c5' },
    { id: 'tc10', text: '    System.out.<span class="fn">println</span>(<span class="str">"Insuficiente"</span>);', branch: 'b5' },
    { id: 'tc11', text: '}', branch: 'end' }
  ];

  function buildCode() {
    const container = document.getElementById('if-sim-code');
    if (!container) return;
    container.innerHTML = TRACER_CODE.map(l =>
      `<span class="tl" id="${l.id}" data-branch="${l.branch}">${l.text}</span>`
    ).join('\n');
  }

  window.runIFSim = function() {
    const nota = parseInt(document.getElementById('if-sim-nota').value, 10);
    if (isNaN(nota)) return;

    const valEl = document.getElementById('tc-nota-val');
    const valEl2 = document.getElementById('tc-nota-val2');
    if (valEl) valEl.textContent = nota;
    if (valEl2) valEl2.textContent = 'nota';

    let branch, output, badgeClass;
    if      (nota >= 9) { branch = 1; output = 'Sobresaliente'; badgeClass = 'tb-green'; }
    else if (nota >= 7) { branch = 2; output = 'Muy bueno';     badgeClass = 'tb-green'; }
    else if (nota >= 6) { branch = 3; output = 'Bueno';         badgeClass = 'tb-green'; }
    else if (nota >= 5) { branch = 4; output = 'Regular';       badgeClass = 'tb-amber'; }
    else                { branch = 5; output = 'Insuficiente';   badgeClass = 'tb-coral'; }

    const allLines = document.querySelectorAll('.tl');
    allLines.forEach(el => {
      el.classList.remove('tl-active', 'tl-skip', 'tl-cond-true', 'tl-cond-false');
    });

    // Highlight logic per branch
    const condTrue  = (n) => n >= 1 ? { c1: nota>=9, c2: nota>=7, c3: nota>=6, c4: nota>=5 }[`c${n}`] : false;
    const condLines = { c1: 'tc1', c2: 'tc3', c3: 'tc5', c4: 'tc7', c5: 'tc9' };
    const bodyLines = { b1: 'tc2', b2: 'tc4', b3: 'tc6', b4: 'tc8', b5: 'tc10' };

    // Declaration
    const declEl = document.getElementById('tc0');
    if (declEl) declEl.classList.add('tl-active');

    // Conditions 1..N
    for (let i = 1; i <= 4; i++) {
      const cEl = document.getElementById(condLines[`c${i}`]);
      const bEl = document.getElementById(bodyLines[`b${i}`]);
      if (i < branch) {
        // evaluated but false
        if (cEl) cEl.classList.add('tl-cond-false');
        if (bEl) bEl.classList.add('tl-skip');
      } else if (i === branch) {
        if (cEl) cEl.classList.add('tl-cond-true');
        if (bEl) bEl.classList.add('tl-active');
        break;
      }
    }
    // else branch (branch == 5)
    if (branch === 5) {
      const elseEl = document.getElementById('tc9');
      const elseBody = document.getElementById('tc10');
      if (elseEl) elseEl.classList.add('tl-active');
      if (elseBody) elseBody.classList.add('tl-active');
    } else {
      const elseEl = document.getElementById('tc9');
      const elseBody = document.getElementById('tc10');
      if (elseEl) elseEl.classList.add('tl-skip');
      if (elseBody) elseBody.classList.add('tl-skip');
    }

    const outEl = document.getElementById('if-sim-out');
    if (outEl) outEl.textContent = output;

    const badgeEl = document.getElementById('if-sim-badge');
    if (badgeEl) {
      badgeEl.className = `if-sim-branch-badge ${badgeClass}`;
      badgeEl.textContent = `Rama ${branch}: "${output}"`;
    }
  };

  window.addEventListener('DOMContentLoaded', () => {
    buildCode();
    setTimeout(runIFSim, 80);
  });
})();

// ── TABLA DE VERDAD INTERACTIVA ──────────────────────────

(function() {
  let pVal = true, qVal = false;

  function renderTruth() {
    const ops = [
      { expr: 'p',       val: pVal },
      { expr: 'q',       val: qVal },
      { expr: 'p && q',  val: pVal && qVal },
      { expr: 'p || q',  val: pVal || qVal },
      { expr: '!p',      val: !pVal },
      { expr: '!q',      val: !qVal },
      { expr: 'p && !q', val: pVal && !qVal },
      { expr: '!p || q', val: !pVal || qVal },
      { expr: 'p == q',  val: pVal === qVal },
      { expr: 'p != q',  val: pVal !== qVal },
    ];
    const grid = document.getElementById('truth-grid');
    if (!grid) return;
    grid.innerHTML = ops.map(o => `
      <div class="truth-res-cell">
        <span class="truth-res-expr">${o.expr}</span>
        <span class="truth-res-val ${o.val ? 'tv' : 'fv'}">${o.val ? 'true' : 'false'}</span>
      </div>`).join('');

    const btnP = document.querySelectorAll('.truth-toggle[data-var="p"] button');
    const btnQ = document.querySelectorAll('.truth-toggle[data-var="q"] button');
    btnP.forEach(b => {
      b.classList.remove('t-active-true', 't-active-false');
      if ((b.dataset.value === 'true') === pVal) b.classList.add(pVal ? 't-active-true' : 't-active-false');
    });
    btnQ.forEach(b => {
      b.classList.remove('t-active-true', 't-active-false');
      if ((b.dataset.value === 'true') === qVal) b.classList.add(qVal ? 't-active-true' : 't-active-false');
    });
  }

  window.setTruth = function(variable, value) {
    if (variable === 'p') pVal = value;
    else qVal = value;
    renderTruth();
  };

  window.addEventListener('DOMContentLoaded', () => setTimeout(renderTruth, 80));
})();

// ── CONVERSOR TERNARIO ───────────────────────────────────

function runTernary() {
  const cond     = document.getElementById('tern-cond').value || 'condición';
  const valSi    = document.getElementById('tern-si').value   || 'valorSÍ';
  const valNo    = document.getElementById('tern-no').value   || 'valorNO';

  const ternaryEl = document.getElementById('tern-out-ternary');
  const ifElseEl  = document.getElementById('tern-out-if');

  const typeGuess = valSi.startsWith('"') || valNo.startsWith('"') ? 'String' : 'int';

  if (ternaryEl) {
    ternaryEl.innerHTML =
      `<span class="kw">${typeGuess}</span> resultado = ` +
      `(<span class="var">${escHtml(cond)}</span>) ? ` +
      `<span class="str">${escHtml(valSi)}</span> : ` +
      `<span class="str">${escHtml(valNo)}</span>;`;
  }
  if (ifElseEl) {
    ifElseEl.innerHTML =
      `<span class="kw">${typeGuess}</span> resultado;\n` +
      `<span class="kw">if</span> (<span class="var">${escHtml(cond)}</span>) {\n` +
      `    resultado = <span class="str">${escHtml(valSi)}</span>;\n` +
      `} <span class="kw">else</span> {\n` +
      `    resultado = <span class="str">${escHtml(valNo)}</span>;\n` +
      `}`;
  }
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── TRAZADOR DE EJECUCIÓN (Diagramas) ────────────────────

(function() {
  const STEPS = [
    { id: 'tr0',  text: '<span class="kw">int</span> nota = <span class="val" id="tr-nval">7</span>;', tag: 'decl' },
    { id: 'tr1',  text: '', tag: 'blank' },
    { id: 'tr2',  text: '<span class="cm">// Se evalúan las condiciones de arriba hacia abajo</span>', tag: 'comment' },
    { id: 'tr3',  text: '<span class="kw">if</span> (nota <span class="op">>=</span> <span class="nm">9</span>) {           <span class="cm" id="tr-r1"></span>', tag: 'c1' },
    { id: 'tr4',  text: '    System.out.<span class="fn">println</span>(<span class="str">"Sobresaliente"</span>);', tag: 'b1' },
    { id: 'tr5',  text: '} <span class="kw">else if</span> (nota <span class="op">>=</span> <span class="nm">7</span>) { <span class="cm" id="tr-r2"></span>', tag: 'c2' },
    { id: 'tr6',  text: '    System.out.<span class="fn">println</span>(<span class="str">"Muy bueno"</span>);', tag: 'b2' },
    { id: 'tr7',  text: '} <span class="kw">else if</span> (nota <span class="op">>=</span> <span class="nm">6</span>) { <span class="cm" id="tr-r3"></span>', tag: 'c3' },
    { id: 'tr8',  text: '    System.out.<span class="fn">println</span>(<span class="str">"Bueno"</span>);', tag: 'b3' },
    { id: 'tr9',  text: '} <span class="kw">else if</span> (nota <span class="op">>=</span> <span class="nm">5</span>) { <span class="cm" id="tr-r4"></span>', tag: 'c4' },
    { id: 'tr10', text: '    System.out.<span class="fn">println</span>(<span class="str">"Regular"</span>);', tag: 'b4' },
    { id: 'tr11', text: '} <span class="kw">else</span> {                   <span class="cm" id="tr-r5"></span>', tag: 'c5' },
    { id: 'tr12', text: '    System.out.<span class="fn">println</span>(<span class="str">"Insuficiente"</span>);', tag: 'b5' },
    { id: 'tr13', text: '}', tag: 'end' },
  ];

  function buildTracer() {
    const c = document.getElementById('tracer-code-lines');
    if (!c) return;
    c.innerHTML = STEPS.map(s =>
      s.tag === 'blank'
        ? `<span class="tl" id="${s.id}">&nbsp;</span>`
        : `<span class="tl" id="${s.id}">${s.text}</span>`
    ).join('\n');
  }

  window.runTracer = function() {
    const nota = parseInt(document.getElementById('tracer-nota').value, 10);
    if (isNaN(nota)) return;

    const nval = document.getElementById('tr-nval');
    if (nval) nval.textContent = nota;

    document.querySelectorAll('#tracer-code-lines .tl').forEach(el => {
      el.classList.remove('tl-active', 'tl-skip', 'tl-cond-true', 'tl-cond-false');
    });

    // Mark declaration as active
    const d = document.getElementById('tr0');
    if (d) d.classList.add('tl-active');

    let activated = false;
    const conds = [
      { tag: 'c1', body: 'b1', result: nota >= 9, id: 'tr-r1', text: `// ${nota} >= 9 → ${nota >= 9}` },
      { tag: 'c2', body: 'b2', result: nota >= 7, id: 'tr-r2', text: `// ${nota} >= 7 → ${nota >= 7}` },
      { tag: 'c3', body: 'b3', result: nota >= 6, id: 'tr-r3', text: `// ${nota} >= 6 → ${nota >= 6}` },
      { tag: 'c4', body: 'b4', result: nota >= 5, id: 'tr-r4', text: `// ${nota} >= 5 → ${nota >= 5}` },
    ];

    for (const cond of conds) {
      const cEl = STEPS.find(s => s.tag === cond.tag);
      const bEl = STEPS.find(s => s.tag === cond.body);
      const condLine = cEl ? document.getElementById(cEl.id) : null;
      const bodyLine = bEl ? document.getElementById(bEl.id) : null;
      const commentEl = document.getElementById(cond.id);
      if (commentEl) commentEl.textContent = cond.text;

      if (!activated) {
        if (cond.result) {
          if (condLine) condLine.classList.add('tl-cond-true');
          if (bodyLine) bodyLine.classList.add('tl-active');
          activated = true;
        } else {
          if (condLine) condLine.classList.add('tl-cond-false');
          if (bodyLine) bodyLine.classList.add('tl-skip');
        }
      } else {
        if (condLine) condLine.classList.add('tl-skip');
        if (bodyLine) bodyLine.classList.add('tl-skip');
      }
    }

    // else branch
    const elseC = STEPS.find(s => s.tag === 'c5');
    const elseB = STEPS.find(s => s.tag === 'b5');
    const elseRemark = document.getElementById('tr-r5');
    const elseCEl = elseC ? document.getElementById(elseC.id) : null;
    const elseBEl = elseB ? document.getElementById(elseB.id) : null;
    if (!activated) {
      if (elseRemark) elseRemark.textContent = `// ninguna condición fue true`;
      if (elseCEl) elseCEl.classList.add('tl-active');
      if (elseBEl) elseBEl.classList.add('tl-active');
    } else {
      if (elseRemark) elseRemark.textContent = `// rama else: se salta`;
      if (elseCEl) elseCEl.classList.add('tl-skip');
      if (elseBEl) elseBEl.classList.add('tl-skip');
    }

    let branch, badgeClass;
    if      (nota >= 9) { branch = 'Sobresaliente'; badgeClass = 'tracer-badge tb-green'; }
    else if (nota >= 7) { branch = 'Muy bueno';     badgeClass = 'tracer-badge tb-green'; }
    else if (nota >= 6) { branch = 'Bueno';         badgeClass = 'tracer-badge tb-green'; }
    else if (nota >= 5) { branch = 'Regular';       badgeClass = 'tracer-badge tb-amber'; }
    else                { branch = 'Insuficiente';  badgeClass = 'tracer-badge tb-coral'; }

    const outEl = document.getElementById('tracer-output');
    const bEl   = document.getElementById('tracer-badge-el');
    if (outEl) outEl.textContent = branch;
    if (bEl) {
      bEl.className = badgeClass;
      bEl.textContent = branch;
    }
  };

  window.addEventListener('DOMContentLoaded', () => {
    buildTracer();
    setTimeout(runTracer, 100);
  });
})();

// ── INIT ─────────────────────────────────────────────────

window.addEventListener('DOMContentLoaded', () => {
  renderCodeBlocks();
  loadExercises();
  setTimeout(updateCondEval, 50);
  setTimeout(runTernary, 50);
});
