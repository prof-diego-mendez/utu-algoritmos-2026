/**
 * Exercise Manager - Loads exercises from JSON file
 * Separates content from logic for easier maintenance
 * 
 * Uses StateManager for unified progress tracking across all modules
 */
let EXERCISES = [];
const MODULE_NAME = 'algoritmos'; // For StateManager

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
    const response = await fetch('../data/exercises.json');
    if (!response.ok) throw new Error('Failed to load exercises');
    EXERCISES = await response.json();
    renderEjercicios('todos');
  } catch (error) {
    console.error('Error loading exercises:', error);
    // Fallback: show error message in exercises section
    if (container) {
      container.innerHTML = `
        <div class="card card-accent coral">
          <h3>Error al cargar ejercicios</h3>
          <p>No se pudo cargar el archivo exercises.json. Verificá que el archivo exista y tenga formato JSON válido.</p>
          <p style="font-family:'DM Mono',monospace;font-size:0.8rem;margin-top:0.5rem">Detalle: ${error.message}</p>
        </div>
      `;
    }
  }
}

// State is now managed by StateManager (unified across all modules)
// Old localStorage migration happens automatically in StateManager.init()

function updateStats() {
  const report = StateManager.getModuleProgress(MODULE_NAME, 20);
  document.getElementById('cnt-done').textContent = report.completed;
  document.getElementById('cnt-pct').textContent = report.percentage + '%';
  document.getElementById('prog-fill').style.width = report.percentage + '%';
  
  // Update ARIA progressbar
  const progressbar = document.querySelector('.progress-wrap');
  if (progressbar) {
    progressbar.setAttribute('aria-valuenow', report.percentage);
  }
}

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
            <textarea class="work-textarea" id="ta-${idx}" placeholder="Escribí tu solución acá… pseudocódigo, diagrama descrito, análisis…" rows="6">${savedText}</textarea>
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
  const item = document.getElementById('ex-item-' + idx);
  item.classList.toggle('open');
}

function saveAnswer(idx) {
  const ta = document.getElementById('ta-' + idx);
  const answer = ta.value.trim();
  
  if (!answer) {
    Toast.warning('Escribí una respuesta antes de guardar', 'Respuesta vacía');
    ta.focus();
    return;
  }
  
  StateManager.setAnswer(MODULE_NAME, idx, answer);
  
  // Show inline save message
  const msg = document.getElementById('saved-' + idx);
  if (msg) {
    msg.style.display = 'inline';
    setTimeout(() => msg.style.display = 'none', 2000);
  }
  
  // Show toast notification
  Toast.success('Tu respuesta se guardó automáticamente', 'Respuesta guardada');
}

function clearAnswer(idx) {
  const ta = document.getElementById('ta-' + idx);
  ta.value = '';
  StateManager.setAnswer(MODULE_NAME, idx, '');
  
  // Show confirmation toast
  Toast.info('Respuesta limpiada', '', 2000);
}

function toggleDone(idx) {
  const exerciseData = StateManager.getExercise(MODULE_NAME, idx);
  const isNowDone = !exerciseData.completed;
  
  StateManager.setExercise(MODULE_NAME, idx, isNowDone);
  
  const item = document.getElementById('ex-item-' + idx);
  const btn = document.getElementById('check-' + idx);
  item.classList.toggle('done', isNowDone);
  btn.classList.toggle('done', isNowDone);
  btn.textContent = isNowDone ? '✓' : '';
  updateStats();
  
  // Show toast notification
  if (isNowDone) {
    Toast.success('¡Seguí así!', 'Ejercicio completado');
  }
}

function filterEx(filtro, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-pressed', 'false');
  });
  btn.classList.add('active');
  btn.setAttribute('aria-pressed', 'true');
  renderEjercicios(filtro);
}

/**
 * Hash-based routing for section navigation
 * Updates active section and nav state based on URL hash
 */
function showSection(sectionId) {
  // Validate section exists
  const section = document.getElementById(sectionId);
  if (!section) {
    sectionId = 'teoria'; // default fallback
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
  const hash = window.location.hash.slice(1) || 'teoria';
  showSection(hash);
}

/**
 * Initialize hash-based routing
 * - Listen for hash changes
 * - Handle initial load with hash
 * - Set default hash if none present
 */
(function initRouter() {
  // Listen for hash changes (back/forward buttons)
  window.addEventListener('hashchange', handleHashChange);

  // Handle initial page load
  if (!window.location.hash) {
    // No hash present, set default without triggering scroll
    window.history.replaceState(null, '', '#teoria');
  }
  handleHashChange();
})();

// Load exercises from JSON file (separates content from logic)
loadExercises();

// El contenido del pseudocódigo vive aquí en JS para que el formateador
// del editor HTML no pueda corromper la indentación.
const CODE_BLOCKS = {
  'cb-edad': `<span class="kw">INICIO</span>
  <span class="kw">LEER</span> <span class="nm">edad</span>
  <span class="kw">SI</span> <span class="nm">edad</span> <span class="op">>=</span> <span class="nm">18</span> <span class="kw">ENTONCES</span>
    <span class="kw">ESCRIBIR</span> <span class="fn">"Mayor de edad"</span>
  <span class="kw">SINO</span>
    <span class="kw">ESCRIBIR</span> <span class="fn">"Menor de edad"</span>
  <span class="kw">FIN SI</span>
<span class="kw">FIN</span>`,

  'cb-area': `<span class="kw">INICIO</span>
  <span class="kw">LEER</span> <span class="nm">base</span>
  <span class="kw">LEER</span> <span class="nm">altura</span>
  <span class="nm">area</span> <span class="op">←</span> <span class="nm">base</span> <span class="op">×</span> <span class="nm">altura</span>
  <span class="kw">ESCRIBIR</span> <span class="fn">"Área ="</span>, <span class="nm">area</span>
<span class="kw">FIN</span>`,

  'cb-temp': `<span class="kw">SI</span> <span class="nm">temperatura</span> <span class="op">></span> <span class="nm">30</span> <span class="kw">ENTONCES</span>
  <span class="kw">ESCRIBIR</span> <span class="fn">"Hace calor"</span>
<span class="kw">SINO</span>
  <span class="kw">ESCRIBIR</span> <span class="fn">"Temperatura normal"</span>
<span class="kw">FIN SI</span>`,

  'cb-bucle': `<span class="cm">// MIENTRAS — repite mientras la condición sea verdadera</span>
<span class="kw">MIENTRAS</span> <span class="nm">intentos</span> <span class="op"><</span> <span class="nm">3</span> <span class="kw">HACER</span>
  <span class="kw">ESCRIBIR</span> <span class="fn">"Intento número"</span>, <span class="nm">intentos</span>
  <span class="nm">intentos</span> <span class="op">←</span> <span class="nm">intentos</span> <span class="op">+</span> <span class="nm">1</span>
<span class="kw">FIN MIENTRAS</span>

<span class="cm">// PARA — repite un número fijo de veces</span>
<span class="kw">PARA</span> <span class="nm">i</span> <span class="op">←</span> <span class="nm">1</span> <span class="kw">HASTA</span> <span class="nm">5</span> <span class="kw">HACER</span>
  <span class="kw">ESCRIBIR</span> <span class="nm">i</span>, <span class="nm">i</span> <span class="op">×</span> <span class="nm">i</span>   <span class="cm">→ muestra cuadrados del 1 al 5</span>
<span class="kw">FIN PARA</span>`,

  'cb-suma': `<span class="kw">INICIO</span>
  <span class="nm">suma</span> <span class="op">←</span> <span class="nm">0</span>
  <span class="nm">i</span>    <span class="op">←</span> <span class="nm">1</span>
  <span class="kw">MIENTRAS</span> <span class="nm">i</span> <span class="op">≤</span> <span class="nm">5</span> <span class="kw">HACER</span>
    <span class="nm">suma</span> <span class="op">←</span> <span class="nm">suma</span> <span class="op">+</span> <span class="nm">i</span>
    <span class="nm">i</span>    <span class="op">←</span> <span class="nm">i</span> <span class="op">+</span> <span class="nm">1</span>
  <span class="kw">FIN MIENTRAS</span>
  <span class="kw">ESCRIBIR</span> <span class="nm">suma</span>   <span class="cm">→ resultado: 15</span>
<span class="kw">FIN</span>`
};

function renderCodeBlocks() {
  Object.entries(CODE_BLOCKS).forEach(([id, content]) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = content;
  });
}

renderCodeBlocks();

// ── MOBILE MENU TOGGLE ────────────────────────────────────
(function initMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const navOverlay = document.getElementById('nav-overlay');
  const navClose = document.getElementById('mobile-nav-close');
  const navLinks = mobileNav?.querySelectorAll('.nav-tab, .nav-tab-link');

  function openMenu() {
    if (!hamburgerBtn || !mobileNav || !navOverlay) return;
    
    hamburgerBtn.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('active');
    navOverlay.classList.add('active');
    navOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }

  function closeMenu() {
    if (!hamburgerBtn || !mobileNav || !navOverlay) return;
    
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('active');
    navOverlay.classList.remove('active');
    navOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore scrolling
  }

  // Toggle menu
  hamburgerBtn?.addEventListener('click', () => {
    const isOpen = hamburgerBtn.classList.contains('active');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close on overlay click
  navOverlay?.addEventListener('click', closeMenu);

  // Close on close button
  navClose?.addEventListener('click', closeMenu);

  // Close on nav link click
  navLinks?.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav?.classList.contains('active')) {
      closeMenu();
      hamburgerBtn?.focus(); // Return focus to hamburger
    }
  });

  // Handle resize - close menu if switching to desktop
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth >= 641) {
        closeMenu();
      }
    }, 100);
  });
})();





    // ── SANDBOX INTERPRETER (MULTIUSO) ──
    function runSandboxPseint(inputId, outputId) {
      const output = document.getElementById(outputId);

      if (typeof SandboxLoader !== 'undefined') SandboxLoader.show(output);

      setTimeout(() => {
        const code = document.getElementById(inputId).value;
        const lines = code.split('\n');
        const vars = {};
        const prints = [];
        let error = null;

        function evalExpr(expr) {
          expr = expr.trim();
          if (/^"[^"]*"$/.test(expr)) return expr.slice(1, -1);
          if (expr === 'verdadero') return true;
          if (expr === 'falso') return false;
          if (!isNaN(expr) && expr !== '') return parseFloat(expr);
          if (/^[a-záéíóúñA-ZÁÉÍÓÚÑ_][a-záéíóúñA-ZÁÉÍÓÚÑ0-9_]*$/.test(expr)) {
            if (expr in vars) return vars[expr];
            throw new Error('Variable no definida: "' + expr + '"');
          }
          return evalComplex(expr, vars);
        }

        function evalComplex(expr, vars) {
          const strings = [];
          let safe = expr.replace(/"[^"]*"/g, (m) => {
            strings.push(m);
            return '__STR' + (strings.length - 1) + '__';
          });

          safe = safe
            .replace(/verdadero/g, 'true')
            .replace(/falso/g, 'false')
            .replace(/\bAND\b/g, '&&')
            .replace(/\bOR\b/g, '||')
            .replace(/\bNOT\b/g, '!')
            .replace(/<>/g, '!==')
            .replace(/([^=!<>])=([^=])/g, '$1===$2')
            .replace(/×/g, '*').replace(/÷/g, '/')
            .replace(/\^/g, '**')
            .replace(/\bmod\b/g, '%');

          safe = safe.replace(/[a-záéíóúñA-ZÁÉÍÓÚÑ_][a-záéíóúñA-ZÁÉÍÓÚÑ0-9_]*/g, (m) => {
            if (m.startsWith('__STR')) return m; 
            if (m === 'true' || m === 'false') return m;
            if (m in vars) {
              const v = vars[m];
              return typeof v === 'string' ? JSON.stringify(v) : v;
            }
            throw new Error('Variable no definida: "' + m + '"');
          });

          safe = safe.replace(/__STR(\d+)__/g, (_, i) => strings[Number(i)]);
          try {
            return Function('"use strict"; return (' + safe + ')')();
          } catch (e) {
            throw new Error('Error en expresión: ' + expr);
          }
        }

        let execStack = [{ active: true, done: false, type: 'ROOT' }];
        function isExecuting() {
          return execStack.every(s => s.active);
        }

        let executionCount = 0;
        const MAX_STEPS = 10000;

        for (let i = 0; i < lines.length; i++) {
          if (executionCount++ > MAX_STEPS) {
             error = "Límite de ejecución excedido (posible bucle infinito asociado a MIENTRAS o PARA).";
             break;
          }

          let line = lines[i].trim();
          if (!line || line.startsWith('//')) continue;
          const ci = line.indexOf(' //');
          if (ci > 0) line = line.substring(0, ci).trim();

          try {
            if (line === 'INICIO' || line === 'FIN') continue;
            
            let upperLine = line.toUpperCase();

            // === BLOQUE SI ===
            if (upperLine.startsWith('SI ') && upperLine.endsWith(' ENTONCES')) {
              if (!isExecuting()) {
                execStack.push({ type: 'SI', active: false, done: true });
                continue;
              }
              let condExpr = line.substring(3, line.length - 9).trim();
              let isTrue = !!evalExpr(condExpr);
              execStack.push({ type: 'SI', active: isTrue, done: isTrue });
              continue;
            }
            if (upperLine === 'SINO') {
              let currentIf = execStack[execStack.length - 1];
              if (!currentIf || currentIf.type !== 'SI') throw new Error("SINO sin instrucciones SI previas");
              currentIf.active = !currentIf.done;
              currentIf.done = true;
              continue;
            }
            if (upperLine === 'FIN SI' || upperLine === 'FINSI') {
              let currentIf = execStack[execStack.length - 1];
              if (!currentIf || currentIf.type !== 'SI') throw new Error("FIN SI sin instrucciones SI previas");
              execStack.pop();
              continue;
            }

            // === BLOQUE MIENTRAS ===
            if (upperLine.startsWith('MIENTRAS ') && upperLine.endsWith(' HACER')) {
              if (!isExecuting()) {
                execStack.push({ type: 'MIENTRAS', active: false });
                continue;
              }
              let condExpr = line.substring(9, line.length - 6).trim();
              let isTrue = !!evalExpr(condExpr);
              execStack.push({ type: 'MIENTRAS', active: isTrue, startLine: i, condExpr: condExpr });
              continue;
            }
            if (upperLine === 'FIN MIENTRAS' || upperLine === 'FINMIENTRAS') {
              let currentLoop = execStack[execStack.length - 1];
              if (!currentLoop || currentLoop.type !== 'MIENTRAS') throw new Error("FIN MIENTRAS inesperado");
              if (currentLoop.active) {
                 if (!!evalExpr(currentLoop.condExpr)) {
                    i = currentLoop.startLine; // Re-evalúa para seguir ciclando
                 } else {
                    execStack.pop();
                 }
              } else {
                 execStack.pop();
              }
              continue;
            }

            // === BLOQUE PARA ===
            let matchPara = line.match(/^PARA\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*(?:←|=)\s*(.+?)\s+HASTA\s+(.+?)\s+HACER$/i);
            if (matchPara) {
              if (!isExecuting()) {
                execStack.push({ type: 'PARA', active: false });
                continue;
              }
              let varName = matchPara[1];
              vars[varName] = evalExpr(matchPara[2]);
              let endExpr = evalExpr(matchPara[3]);
              let isTrue = vars[varName] <= endExpr;
              execStack.push({ type: 'PARA', active: isTrue, startLine: i, varName: varName, endExpr: matchPara[3] });
              continue;
            }
            if (upperLine === 'FIN PARA' || upperLine === 'FINPARA') {
              let currentLoop = execStack[execStack.length - 1];
              if (!currentLoop || currentLoop.type !== 'PARA') throw new Error("FIN PARA inesperado");
              if (currentLoop.active) {
                vars[currentLoop.varName]++;
                let endExpr = evalExpr(currentLoop.endExpr);
                if (vars[currentLoop.varName] <= endExpr) {
                   i = currentLoop.startLine; // Re-evalúa para seguir ciclando
                } else {
                   execStack.pop();
                }
              } else {
                execStack.pop();
              }
              continue;
            }

            // --- EJECUCIÓN NORMAL SI ACTIVO ---
            if (!isExecuting()) {
              continue;
            }
            
            const readMatch = line.match(/^LEER\s+([a-záéíóúñA-ZÁÉÍÓÚÑ_][a-záéíóúñA-ZÁÉÍÓÚÑ0-9_]*)$/i);
            if (readMatch) {
              const varName = readMatch[1];
              const input = prompt("Ingresá un valor para la variable: " + varName);
              if (input === null) throw new Error("Ejecución cancelada por el usuario (LEER cancelado)");
              
              const sanitizedInput = input.trim().replace(',', '.');
              const num = Number(sanitizedInput);
              vars[varName] = (!isNaN(num) && sanitizedInput !== '') ? num : input;
              continue;
            }

            const assignMatch = line.match(/^(?:variable\s+)?([a-záéíóúñA-ZÁÉÍÓÚÑ_][a-záéíóúñA-ZÁÉÍÓÚÑ0-9_]*)\s*(?:←|=)\s*(.+)$/u);
            if (assignMatch) {
              vars[assignMatch[1]] = evalExpr(assignMatch[2]);
              continue;
            }

            const writeMatch = line.match(/^ESCRIBIR\s+(.+)$/i);
            if (writeMatch) {
              const exprList = writeMatch[1].split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(s => s.trim());
              const out = exprList.map(e => {
                let val = evalExpr(e);
                if (val === true) return "verdadero";
                if (val === false) return "falso";
                return val;
              }).join(' ');
              prints.push({ text: out, error: false });
              continue;
            }

            throw new Error('Línea no reconocida: "' + line + '"');
          } catch (e) {
            error = "Línea " + (i + 1) + ": " + e.message;
            break;
          }
        }

        output.innerHTML = '';
        if (prints.length === 0 && !error) {
          output.innerHTML = '<span style="color:var(--faint);font-size:0.8rem;">(sin salida — usá ESCRIBIR para mostrar resultados)</span>';
          return;
        }
        prints.forEach(p => {
          const div = document.createElement('div');
          div.className = 'out-line' + (p.error ? ' out-error' : '');
          div.textContent = p.text;
          output.appendChild(div);
        });
        if (error) {
          const div = document.createElement('div');
          div.className = 'out-line out-error';
          div.textContent = '⚠ ' + error;
          output.appendChild(div);

          if (typeof Toast !== 'undefined') Toast.error(error, 'Error en el código');
        } else if (prints.length > 0) {
          if (typeof Toast !== 'undefined') Toast.success(prints.length + ' resultado(s)', 'Código ejecutado');
        }
      }, 300);
    }

    function clearSandboxPseint(inputId, outputId) {
      document.getElementById(inputId).value = '';
      document.getElementById(outputId).innerHTML = '<span style="color:var(--faint);font-size:0.8rem;">La salida aparecerá aquí...</span>';
    }

    function setupSandboxEditor(inputId, outputId) {
      const el = document.getElementById(inputId);
      if (!el) return;
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
          e.preventDefault();
          const s = this.selectionStart, end = this.selectionEnd;
          this.value = this.value.substring(0, s) + '  ' + this.value.substring(end);
          this.selectionStart = this.selectionEnd = s + 2;
        }
        if (e.key === 'Enter' && e.ctrlKey) runSandboxPseint(inputId, outputId);
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener("DOMContentLoaded", () => {
        setupSandboxEditor('seq-sandbox-code', 'seq-sandbox-output');
        setupSandboxEditor('cond-sandbox-code', 'cond-sandbox-output');
        setupSandboxEditor('loop-sandbox-code', 'loop-sandbox-output');
      });
    } else {
      setupSandboxEditor('seq-sandbox-code', 'seq-sandbox-output');
      setupSandboxEditor('cond-sandbox-code', 'cond-sandbox-output');
      setupSandboxEditor('loop-sandbox-code', 'loop-sandbox-output');
    }
