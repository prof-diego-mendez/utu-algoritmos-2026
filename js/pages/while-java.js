/* ============================================================
   while-java.js
   Lógica interactiva para la página de Estructura WHILE en Java.
   ============================================================ */

// ── CONFIG ───────────────────────────────────────────────
const MODULE_NAME     = 'while';
const TOTAL_EXERCISES = 20;
let EXERCISES = [];

// ── EXERCISES ────────────────────────────────────────────

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
    const response = await fetch('../data/exercises-while.json');
    if (!response.ok) throw new Error('No se pudo cargar exercises-while.json');
    EXERCISES = await response.json();
    renderEjercicios('todos');
  } catch (err) {
    if (container) {
      container.innerHTML = `
        <div class="card card-accent coral">
          <h3>Error al cargar ejercicios</h3>
          <p>Verificá que el archivo <code>data/exercises-while.json</code> exista.</p>
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
  if (!window.location.hash) window.history.replaceState(null, '', '#intro');
  handleHashChange();
})();

// ── BLOQUES DE CÓDIGO ────────────────────────────────────

const CODE_BLOCKS = {

  'cb-while': `<span class="cm">// Sintaxis: bucle WHILE</span>
<span class="kw">while</span> (condición) {
    <span class="cm">// cuerpo: se repite mientras condición sea true</span>
    sentencia;
}
<span class="cm">// esta línea se ejecuta cuando condición es false</span>

<span class="cm">// ── Ejemplo: contar del 1 al 5 ───────────────────────────</span>
<span class="kw">int</span> i <span class="op">=</span> <span class="nm">1</span>;                  <span class="cm">// ① inicialización</span>
<span class="kw">while</span> (i <span class="op"><=</span> <span class="nm">5</span>) {            <span class="cm">// ② condición</span>
    System.out.<span class="fn">println</span>(i);  <span class="cm">// ③ cuerpo</span>
    i<span class="op">++</span>;                    <span class="cm">// ④ actualización</span>
}
<span class="cm">// Imprime: 1  2  3  4  5</span>`,

  'cb-while-parts': `<span class="cm">// Las 4 partes esenciales del bucle WHILE</span>

<span class="kw">int</span> suma <span class="op">=</span> <span class="nm">0</span>;    <span class="cm">// ① INICIALIZACIÓN: variable de control + acumulador</span>
<span class="kw">int</span> i    <span class="op">=</span> <span class="nm">1</span>;

<span class="kw">while</span> (i <span class="op"><=</span> <span class="nm">100</span>) {      <span class="cm">// ② CONDICIÓN: ¿seguir o salir?</span>
    suma <span class="op">+=</span> i;            <span class="cm">// ③ CUERPO: trabajo útil</span>
    i<span class="op">++</span>;                  <span class="cm">// ④ ACTUALIZACIÓN: acercar al fin</span>
}
System.out.<span class="fn">println</span>(suma); <span class="cm">// → 5050</span>

<span class="cm">// ⚠ Sin la actualización → bucle INFINITO</span>
<span class="cm">// ⚠ Sin la inicialización → error de compilación (variable no definida)</span>`,

  'cb-do-while': `<span class="cm">// Sintaxis: DO-WHILE (ejecuta el cuerpo AL MENOS UNA VEZ)</span>
<span class="kw">do</span> {
    <span class="cm">// cuerpo: se ejecuta primero, luego se evalúa la condición</span>
    sentencia;
} <span class="kw">while</span> (condición);  <span class="cm">// ← punto y coma obligatorio</span>

<span class="cm">// ── Ejemplo: validar entrada ─────────────────────────────</span>
<span class="kw">int</span> numero;
<span class="kw">do</span> {
    System.out.<span class="fn">print</span>(<span class="str">"Ingresá un número entre 1 y 100: "</span>);
    numero <span class="op">=</span> scanner.<span class="fn">nextInt</span>();
} <span class="kw">while</span> (numero <span class="op"><</span> <span class="nm">1</span> <span class="op">||</span> numero <span class="op">></span> <span class="nm">100</span>);
System.out.<span class="fn">println</span>(<span class="str">"Número válido: "</span> <span class="op">+</span> numero);`,

  'cb-while-vs-dowhile': `<span class="cm">// WHILE: puede ejecutarse 0 veces</span>
<span class="kw">int</span> x <span class="op">=</span> <span class="nm">10</span>;
<span class="kw">while</span> (x <span class="op"><</span> <span class="nm">5</span>) {
    System.out.<span class="fn">println</span>(<span class="str">"WHILE: nunca se imprime"</span>);
    x<span class="op">++</span>;
}

<span class="cm">// DO-WHILE: siempre se ejecuta al menos 1 vez</span>
<span class="kw">int</span> y <span class="op">=</span> <span class="nm">10</span>;
<span class="kw">do</span> {
    System.out.<span class="fn">println</span>(<span class="str">"DO-WHILE: se imprime una vez aunque 10 < 5 sea false"</span>);
    y<span class="op">++</span>;
} <span class="kw">while</span> (y <span class="op"><</span> <span class="nm">5</span>);`,

  'cb-break': `<span class="cm">// break: salir del bucle inmediatamente</span>
<span class="kw">int</span> i <span class="op">=</span> <span class="nm">1</span>;
<span class="kw">while</span> (i <span class="op"><=</span> <span class="nm">100</span>) {
    <span class="kw">if</span> (i <span class="op">%</span> <span class="nm">7</span> <span class="op">==</span> <span class="nm">0</span>) {
        System.out.<span class="fn">println</span>(<span class="str">"Primer múltiplo de 7: "</span> <span class="op">+</span> i);
        <span class="kw">break</span>;  <span class="cm">// sale del bucle al encontrarlo</span>
    }
    i<span class="op">++</span>;
}
<span class="cm">// → Primer múltiplo de 7: 7</span>
<span class="cm">// El break hace que el while termine antes de llegar a 100</span>`,

  'cb-continue': `<span class="cm">// continue: salta la iteración actual y va a la condición</span>
<span class="kw">int</span> i <span class="op">=</span> <span class="nm">0</span>;
<span class="kw">while</span> (i <span class="op"><</span> <span class="nm">10</span>) {
    i<span class="op">++</span>;                         <span class="cm">// ← actualización ANTES del continue</span>
    <span class="kw">if</span> (i <span class="op">%</span> <span class="nm">2</span> <span class="op">==</span> <span class="nm">0</span>) <span class="kw">continue</span>;   <span class="cm">// salta los pares</span>
    System.out.<span class="fn">print</span>(i <span class="op">+</span> <span class="str">" "</span>);
}
<span class="cm">// → 1 3 5 7 9  (solo impares)</span>

<span class="cm">// ⚠ Si i++ estuviera después del continue, el bucle sería infinito</span>
<span class="cm">//   cuando i=2: salta el println pero también salta i++  → i nunca avanza</span>`,

  'cb-nested': `<span class="cm">// Bucles anidados: el interno se ejecuta completo por cada iteración del externo</span>
<span class="kw">int</span> i <span class="op">=</span> <span class="nm">1</span>;
<span class="kw">while</span> (i <span class="op"><=</span> <span class="nm">3</span>) {        <span class="cm">// externo: 3 iteraciones</span>
    <span class="kw">int</span> j <span class="op">=</span> <span class="nm">1</span>;
    <span class="kw">while</span> (j <span class="op"><=</span> <span class="nm">4</span>) {    <span class="cm">// interno: 4 iteraciones por cada i</span>
        System.out.<span class="fn">print</span>(i <span class="op">*</span> j <span class="op">+</span> <span class="str">"\t"</span>);
        j<span class="op">++</span>;
    }
    System.out.<span class="fn">println</span>();
    i<span class="op">++</span>;
}
<span class="cm">// Total: 3 × 4 = 12 productos impresos</span>
<span class="cm">// ⚠ j debe reiniciarse DENTRO del bucle externo</span>`,

  'cb-accumulator': `<span class="cm">// Patrón acumulador: acumular un resultado a través de las iteraciones</span>

<span class="cm">// Suma: neutro = 0</span>
<span class="kw">int</span> suma <span class="op">=</span> <span class="nm">0</span>;
<span class="kw">int</span> i    <span class="op">=</span> <span class="nm">1</span>;
<span class="kw">while</span> (i <span class="op"><=</span> <span class="nm">10</span>) { suma <span class="op">+=</span> i; i<span class="op">++</span>; }
<span class="cm">// suma → 55</span>

<span class="cm">// Producto (factorial): neutro = 1</span>
<span class="kw">int</span> fact <span class="op">=</span> <span class="nm">1</span>;
<span class="kw">int</span> n    <span class="op">=</span> <span class="nm">5</span>;
<span class="kw">while</span> (n <span class="op">></span> <span class="nm">0</span>) { fact <span class="op">*=</span> n; n<span class="op">--</span>; }
<span class="cm">// fact → 120  (5! = 5×4×3×2×1)</span>

<span class="cm">// Contador: cuántos elementos cumplen una condición</span>
<span class="kw">int</span> pares <span class="op">=</span> <span class="nm">0</span>;
<span class="kw">int</span> k     <span class="op">=</span> <span class="nm">1</span>;
<span class="kw">while</span> (k <span class="op"><=</span> <span class="nm">20</span>) {
    <span class="kw">if</span> (k <span class="op">%</span> <span class="nm">2</span> <span class="op">==</span> <span class="nm">0</span>) pares<span class="op">++</span>;
    k<span class="op">++</span>;
}
<span class="cm">// pares → 10</span>`
};

function renderCodeBlocks() {
  Object.entries(CODE_BLOCKS).forEach(([id, content]) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = content;
  });
}

// ── SIMULADOR DE BUCLE WHILE ─────────────────────────────

(function() {
  const SIM_CODE = [
    { id: 'ws0', text: '<span class="kw">int</span> i = <span class="nm">1</span>;' },
    { id: 'ws1', text: '<span class="kw">int</span> suma = <span class="nm">0</span>;' },
    { id: 'ws2', text: '' },
    { id: 'ws3', text: '<span class="kw">while</span> (i <= <span class="val" id="ws-lim">5</span>) {' },
    { id: 'ws4', text: '    suma += i;' },
    { id: 'ws5', text: '    i++;' },
    { id: 'ws6', text: '}' },
  ];

  function buildSimCode() {
    const el = document.getElementById('loop-sim-code');
    if (!el) return;
    el.innerHTML = SIM_CODE.map(l =>
      l.text === ''
        ? `<span class="tl-w" id="${l.id}">&nbsp;</span>`
        : `<span class="tl-w" id="${l.id}">${l.text}</span>`
    ).join('\n');
  }

  window.runLoopSim = function() {
    const limite = Math.min(Math.max(parseInt(document.getElementById('ls-limit').value, 10) || 5, 1), 15);
    const limEl = document.getElementById('ws-lim');
    if (limEl) limEl.textContent = limite;

    const iterList = document.getElementById('loop-iter-list');
    const summary  = document.getElementById('loop-summary');
    if (!iterList) return;

    iterList.innerHTML = '';
    let suma = 0;
    for (let i = 1; i <= limite; i++) {
      suma += i;
      const row = document.createElement('div');
      row.className = 'loop-iter-row';
      row.innerHTML = `<span class="loop-iter-idx">[${i}]</span><span>i=${i} &nbsp;→&nbsp; suma=${suma}</span>`;
      iterList.appendChild(row);
    }

    if (summary) {
      summary.textContent = `${limite} iteraciones · suma final = ${suma}`;
    }

    // highlight condition line
    document.querySelectorAll('.tl-w').forEach(el => el.classList.remove('tl-active', 'tl-cond-true'));
    ['ws0','ws1'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('tl-active');
    });
    const condEl = document.getElementById('ws3');
    if (condEl) condEl.classList.add('tl-cond-true');
  };

  window.addEventListener('DOMContentLoaded', () => {
    buildSimCode();
    setTimeout(runLoopSim, 80);
  });
})();

// ── COMPARADOR WHILE vs DO-WHILE ─────────────────────────

(function() {
  window.runCmp = function() {
    const val = parseInt(document.getElementById('cmp-val').value, 10);
    const cond = val < 5;

    const whileRes  = document.getElementById('cmp-while-result');
    const doRes     = document.getElementById('cmp-do-result');
    const whileIter = document.getElementById('cmp-while-iter');
    const doIter    = document.getElementById('cmp-do-iter');

    // WHILE simulation
    let wLines = [], wVal = val, wCount = 0;
    while (wVal < 5 && wCount < 20) {
      wLines.push(`Iteración ${wCount + 1}: x = ${wVal}`);
      wVal++;
      wCount++;
    }
    if (whileRes) {
      if (wLines.length === 0) {
        whileRes.className = 'cmp-result no-exec';
        whileRes.textContent = '(cuerpo no ejecutado — condición false desde el inicio)';
      } else {
        whileRes.className = 'cmp-result';
        whileRes.textContent = wLines.join('\n');
      }
    }
    if (whileIter) whileIter.textContent = wLines.length;

    // DO-WHILE simulation
    let dLines = [], dVal = val, dCount = 0;
    do {
      dLines.push(`Iteración ${dCount + 1}: x = ${dVal}`);
      dVal++;
      dCount++;
    } while (dVal < 5 && dCount < 20);
    if (doRes) {
      doRes.className = 'cmp-result';
      doRes.textContent = dLines.join('\n');
    }
    if (doIter) doIter.textContent = dLines.length;
  };

  window.addEventListener('DOMContentLoaded', () => setTimeout(runCmp, 80));
})();

// ── TRAZADOR DE ACUMULADOR ───────────────────────────────

(function() {
  window.runAccTracer = function() {
    const n = Math.min(Math.max(parseInt(document.getElementById('acc-n').value, 10) || 5, 1), 12);
    const tbody = document.getElementById('acc-steps-body');
    const result = document.getElementById('acc-result-val');
    const formula = document.getElementById('acc-formula-val');
    if (!tbody) return;

    tbody.innerHTML = '';
    let suma = 0;
    for (let i = 1; i <= n; i++) {
      const prev = suma;
      suma += i;
      const tr = document.createElement('div');
      tr.className = 'acc-step-row';
      tr.innerHTML = `
        <span class="acc-i">${i}</span>
        <span class="acc-sum">${suma}</span>
        <span class="acc-op">${prev} + ${i} = ${suma}</span>`;
      tbody.appendChild(tr);
    }

    if (result) result.textContent = suma;
    if (formula) formula.textContent = `${n} × (${n}+1) / 2 = ${n*(n+1)/2}`;
  };

  window.addEventListener('DOMContentLoaded', () => setTimeout(runAccTracer, 80));
})();

// ── INIT ─────────────────────────────────────────────────

window.addEventListener('DOMContentLoaded', () => {
  renderCodeBlocks();
  loadExercises();
});
