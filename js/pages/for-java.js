/* ============================================================
   for-java.js
   Lógica interactiva para la página de Estructura FOR en Java.
   ============================================================ */

// ── CONFIG ───────────────────────────────────────────────
const MODULE_NAME     = 'for';
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
    const response = await fetch('../data/exercises-for.json');
    if (!response.ok) throw new Error('No se pudo cargar exercises-for.json');
    EXERCISES = await response.json();
    renderEjercicios('todos');
  } catch (err) {
    if (container) {
      container.innerHTML = `
        <div class="card card-accent coral">
          <h3>Error al cargar ejercicios</h3>
          <p>Verificá que el archivo <code>data/exercises-for.json</code> exista.</p>
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

  'cb-for-basic': `<span class="cm">// Sintaxis: bucle FOR</span>
<span class="kw">for</span> (inicialización; condición; actualización) {
    <span class="cm">// cuerpo: se repite mientras condición sea true</span>
    sentencia;
}

<span class="cm">// ── Ejemplo: contar del 1 al 5 ───────────────────────────</span>
<span class="kw">for</span> (<span class="kw">int</span> i <span class="op">=</span> <span class="nm">1</span>; i <span class="op"><=</span> <span class="nm">5</span>; i<span class="op">++</span>) {
    System.out.<span class="fn">println</span>(i);
}
<span class="cm">// Imprime: 1  2  3  4  5</span>

<span class="cm">// La variable i solo existe dentro del for (alcance limitado)</span>
<span class="cm">// System.out.println(i);  ← error de compilación fuera del for</span>`,

  'cb-for-variations': `<span class="cm">// ① Conteo ascendente (lo más común)</span>
<span class="kw">for</span> (<span class="kw">int</span> i <span class="op">=</span> <span class="nm">1</span>; i <span class="op"><=</span> <span class="nm">10</span>; i<span class="op">++</span>) { <span class="cm">/* 1..10 */</span> }

<span class="cm">// ② Conteo decreciente</span>
<span class="kw">for</span> (<span class="kw">int</span> i <span class="op">=</span> <span class="nm">10</span>; i <span class="op">>=</span> <span class="nm">1</span>; i<span class="op">--</span>) { <span class="cm">/* 10..1 */</span> }

<span class="cm">// ③ Paso de 2 (solo pares)</span>
<span class="kw">for</span> (<span class="kw">int</span> i <span class="op">=</span> <span class="nm">0</span>; i <span class="op"><=</span> <span class="nm">20</span>; i <span class="op">+=</span> <span class="nm">2</span>) { <span class="cm">/* 0,2,4,...20 */</span> }

<span class="cm">// ④ Actualización multiplicativa (potencias de 2)</span>
<span class="kw">for</span> (<span class="kw">int</span> p <span class="op">=</span> <span class="nm">1</span>; p <span class="op"><=</span> <span class="nm">1024</span>; p <span class="op">*=</span> <span class="nm">2</span>) { <span class="cm">/* 1,2,4,8,...1024 */</span> }

<span class="cm">// ⑤ Recorrer un arreglo con índice</span>
<span class="kw">int</span>[] arr <span class="op">=</span> {<span class="nm">10</span>, <span class="nm">20</span>, <span class="nm">30</span>, <span class="nm">40</span>};
<span class="kw">for</span> (<span class="kw">int</span> i <span class="op">=</span> <span class="nm">0</span>; i <span class="op"><</span> arr.length; i<span class="op">++</span>) {
    System.out.<span class="fn">println</span>(arr[i]);
}`,

  'cb-for-vs-while': `<span class="cm">// ── FOR ─────────────────────────────────────────────────</span>
<span class="kw">for</span> (<span class="kw">int</span> i <span class="op">=</span> <span class="nm">1</span>; i <span class="op"><=</span> <span class="nm">10</span>; i<span class="op">++</span>) {
    System.out.<span class="fn">println</span>(i);
}

<span class="cm">// ── WHILE equivalente ────────────────────────────────────</span>
<span class="kw">int</span> i <span class="op">=</span> <span class="nm">1</span>;           <span class="cm">// inicialización</span>
<span class="kw">while</span> (i <span class="op"><=</span> <span class="nm">10</span>) {   <span class="cm">// condición</span>
    System.out.<span class="fn">println</span>(i);
    i<span class="op">++</span>;              <span class="cm">// actualización</span>
}

<span class="cm">// Producen exactamente el mismo resultado.</span>
<span class="cm">// Diferencia práctica:</span>
<span class="cm">//   FOR  → cuando sabés cuántas iteraciones de antemano</span>
<span class="cm">//   WHILE → cuando la condición de salida es dinámica</span>`,

  'cb-foreach': `<span class="cm">// FOR clásico: requiere índice, puede modificar el arreglo</span>
<span class="kw">int</span>[] nums <span class="op">=</span> {<span class="nm">5</span>, <span class="nm">12</span>, <span class="nm">3</span>, <span class="nm">8</span>, <span class="nm">17</span>};
<span class="kw">for</span> (<span class="kw">int</span> i <span class="op">=</span> <span class="nm">0</span>; i <span class="op"><</span> nums.length; i<span class="op">++</span>) {
    System.out.<span class="fn">println</span>(nums[i]);
}

<span class="cm">// FOR-EACH: más limpio cuando solo necesitás el valor</span>
<span class="kw">for</span> (<span class="kw">int</span> n : nums) {     <span class="cm">// "para cada n en nums"</span>
    System.out.<span class="fn">println</span>(n);
}

<span class="cm">// FOR-EACH con String[]</span>
<span class="kw">String</span>[] frutas <span class="op">=</span> {<span class="str">"manzana"</span>, <span class="str">"banana"</span>, <span class="str">"naranja"</span>};
<span class="kw">for</span> (<span class="kw">String</span> f : frutas) {
    System.out.<span class="fn">println</span>(f.<span class="fn">toUpperCase</span>());
}

<span class="cm">// ⚠ El FOR-EACH NO puede:</span>
<span class="cm">//   - Modificar los elementos del arreglo</span>
<span class="cm">//   - Recorrer en orden inverso</span>
<span class="cm">//   - Acceder al índice de la posición actual</span>`,

  'cb-nested-for': `<span class="cm">// Bucles anidados: externo controla filas, interno controla columnas</span>
<span class="kw">for</span> (<span class="kw">int</span> i <span class="op">=</span> <span class="nm">1</span>; i <span class="op"><=</span> <span class="nm">4</span>; i<span class="op">++</span>) {          <span class="cm">// 4 filas</span>
    <span class="kw">for</span> (<span class="kw">int</span> j <span class="op">=</span> <span class="nm">1</span>; j <span class="op"><=</span> <span class="nm">4</span>; j<span class="op">++</span>) {      <span class="cm">// 4 columnas</span>
        System.out.<span class="fn">printf</span>(<span class="str">"%4d"</span>, i <span class="op">*</span> j);
    }
    System.out.<span class="fn">println</span>();
}
<span class="cm">// Total: 4×4 = 16 productos. Resultado:</span>
<span class="cm">//    1   2   3   4</span>
<span class="cm">//    2   4   6   8</span>
<span class="cm">//    3   6   9  12</span>
<span class="cm">//    4   8  12  16</span>`,

  'cb-for-patterns': `<span class="cm">// Patrón 1: suma acumulada</span>
<span class="kw">int</span> suma <span class="op">=</span> <span class="nm">0</span>;
<span class="kw">for</span> (<span class="kw">int</span> i <span class="op">=</span> <span class="nm">1</span>; i <span class="op"><=</span> <span class="nm">100</span>; i<span class="op">++</span>) suma <span class="op">+=</span> i;
<span class="cm">// suma → 5050</span>

<span class="cm">// Patrón 2: máximo en arreglo</span>
<span class="kw">int</span>[] arr <span class="op">=</span> {<span class="nm">34</span>, <span class="nm">7</span>, <span class="nm">62</span>, <span class="nm">18</span>, <span class="nm">5</span>};
<span class="kw">int</span> max <span class="op">=</span> arr[<span class="nm">0</span>];
<span class="kw">for</span> (<span class="kw">int</span> n : arr) <span class="kw">if</span> (n <span class="op">></span> max) max <span class="op">=</span> n;
<span class="cm">// max → 62</span>

<span class="cm">// Patrón 3: contador (cuántos cumplen una condición)</span>
<span class="kw">int</span> pares <span class="op">=</span> <span class="nm">0</span>;
<span class="kw">for</span> (<span class="kw">int</span> n : arr) <span class="kw">if</span> (n <span class="op">%</span> <span class="nm">2</span> <span class="op">==</span> <span class="nm">0</span>) pares<span class="op">++</span>;
<span class="cm">// pares → 2  (34 y 62)</span>

<span class="cm">// Patrón 4: búsqueda con break</span>
<span class="kw">int</span> objetivo <span class="op">=</span> <span class="nm">18</span>, posicion <span class="op">=</span> <span class="nm">-1</span>;
<span class="kw">for</span> (<span class="kw">int</span> i <span class="op">=</span> <span class="nm">0</span>; i <span class="op"><</span> arr.length; i<span class="op">++</span>) {
    <span class="kw">if</span> (arr[i] <span class="op">==</span> objetivo) { posicion <span class="op">=</span> i; <span class="kw">break</span>; }
}
<span class="cm">// posicion → 3</span>`
};

function renderCodeBlocks() {
  Object.entries(CODE_BLOCKS).forEach(([id, content]) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = content;
  });
}

// ── SIMULADOR FOR ─────────────────────────────────────────

(function() {
  function escH(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  window.runForSim = function() {
    const ini  = parseInt(document.getElementById('fs-ini').value,  10);
    const fin  = parseInt(document.getElementById('fs-fin').value,  10);
    const paso = parseInt(document.getElementById('fs-paso').value, 10);

    const preview = document.getElementById('for-sim-code-preview');
    const panel   = document.getElementById('for-sim-panel');
    if (!preview || !panel) return;

    const op = paso >= 0 ? '+=' : '-=';
    const cond = paso >= 0 ? '&lt;=' : '&gt;=';

    preview.innerHTML =
      `<span class="kw">for</span> (<span class="kw">int</span> i = <span class="val">${escH(ini)}</span>; i ${cond} <span class="val">${escH(fin)}</span>; i ${op} <span class="val">${escH(Math.abs(paso))}</span>) {\n` +
      `    System.out.<span class="fn">println</span>(i);\n` +
      `}`;

    panel.innerHTML = '';

    // Validation
    if (paso === 0) {
      panel.innerHTML = '<div class="for-sim-error">⚠ paso = 0 → bucle infinito</div>';
      return;
    }
    if (paso > 0 && ini > fin) {
      panel.innerHTML = '<div class="for-sim-error">⚠ inicio &gt; fin con paso positivo → 0 iteraciones</div>';
      const row = document.createElement('div');
      row.className = 'loop-sim-lbl';
      row.textContent = '// cuerpo nunca se ejecuta';
      panel.appendChild(row);
      return;
    }
    if (paso < 0 && ini < fin) {
      panel.innerHTML = '<div class="for-sim-error">⚠ inicio &lt; fin con paso negativo → 0 iteraciones</div>';
      return;
    }

    const MAX_ITER = 20;
    let count = 0;
    const lbl = document.createElement('div');
    lbl.className = 'loop-sim-lbl';
    panel.appendChild(lbl);

    for (let i = ini; paso > 0 ? i <= fin : i >= fin; i += paso) {
      if (count >= MAX_ITER) {
        const more = document.createElement('div');
        more.className = 'loop-sim-lbl';
        more.textContent = `… (mostrando solo ${MAX_ITER} de más)`;
        panel.appendChild(more);
        break;
      }
      const row = document.createElement('div');
      row.className = 'loop-iter-row';
      row.innerHTML = `<span class="loop-iter-idx">[${count+1}]</span><span>i = ${i}</span>`;
      panel.appendChild(row);
      count++;
    }

    lbl.textContent = `// ${count} iteración${count !== 1 ? 'es' : ''}`;

    const sum = document.createElement('div');
    sum.className = 'loop-summary';
    sum.textContent = `${count} iteraciones · i final = ${ini + paso * count}`;
    panel.appendChild(sum);
  };

  window.addEventListener('DOMContentLoaded', () => setTimeout(runForSim, 80));
})();

// ── CONVERSOR FOR ↔ WHILE ────────────────────────────────

(function() {
  function escH(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  window.runForConv = function() {
    const ini  = parseInt(document.getElementById('fc-ini').value,  10);
    const fin  = parseInt(document.getElementById('fc-fin').value,  10);
    const paso = parseInt(document.getElementById('fc-paso').value, 10);

    const forEl   = document.getElementById('for-conv-for');
    const whileEl = document.getElementById('for-conv-while');
    if (!forEl || !whileEl) return;

    const cond    = paso >= 0 ? `&lt;=` : `&gt;=`;
    const upd     = Math.abs(paso) === 1
      ? (paso > 0 ? 'i++' : 'i--')
      : (paso > 0 ? `i += ${paso}` : `i -= ${Math.abs(paso)}`);
    const updW    = Math.abs(paso) === 1
      ? (paso > 0 ? 'i++;' : 'i--;')
      : (paso > 0 ? `i += ${paso};` : `i -= ${Math.abs(paso)};`);

    forEl.innerHTML =
      `<span class="kw">for</span> (<span class="kw">int</span> i = <span class="val">${escH(ini)}</span>; i ${cond} <span class="val">${escH(fin)}</span>; ${upd}) {\n` +
      `    System.out.<span class="fn">println</span>(i);\n` +
      `}`;

    whileEl.innerHTML =
      `<span class="kw">int</span> i = <span class="val">${escH(ini)}</span>;              <span class="cm">// init</span>\n` +
      `<span class="kw">while</span> (i ${cond} <span class="val">${escH(fin)}</span>) {      <span class="cm">// cond</span>\n` +
      `    System.out.<span class="fn">println</span>(i);\n` +
      `    ${updW}                    <span class="cm">// update</span>\n` +
      `}`;
  };

  window.addEventListener('DOMContentLoaded', () => setTimeout(runForConv, 80));
})();

// ── GENERADOR DE PATRÓN ──────────────────────────────────

(function() {
  window.runPattern = function() {
    const n    = Math.min(Math.max(parseInt(document.getElementById('pat-n').value, 10) || 5, 1), 10);
    const tipo = document.getElementById('pat-tipo').value;
    const out  = document.getElementById('pat-output');
    const stats = document.getElementById('pat-stats');
    if (!out) return;

    let lines = [], totalIter = 0;

    if (tipo === 'triangulo') {
      for (let i = 1; i <= n; i++) {
        let row = '';
        for (let j = 1; j <= i; j++) { row += '*'; totalIter++; }
        lines.push(row);
      }
    } else if (tipo === 'invertido') {
      for (let i = n; i >= 1; i--) {
        let row = '';
        for (let j = 1; j <= i; j++) { row += '*'; totalIter++; }
        lines.push(row);
      }
    } else if (tipo === 'piramide') {
      for (let i = 1; i <= n; i++) {
        let row = ' '.repeat(n - i);
        for (let j = 1; j <= (2 * i - 1); j++) { row += '*'; totalIter++; }
        lines.push(row);
      }
    } else if (tipo === 'cuadrado') {
      for (let i = 1; i <= n; i++) {
        let row = '';
        for (let j = 1; j <= n; j++) { row += '*'; totalIter++; }
        lines.push(row);
      }
    }

    out.textContent = lines.join('\n');
    if (stats) stats.textContent = `N=${n} · ${lines.length} filas · ${totalIter} iteraciones internas`;
  };

  window.addEventListener('DOMContentLoaded', () => setTimeout(runPattern, 80));
})();

// ── INIT ─────────────────────────────────────────────────

window.addEventListener('DOMContentLoaded', () => {
  renderCodeBlocks();
  loadExercises();
});
