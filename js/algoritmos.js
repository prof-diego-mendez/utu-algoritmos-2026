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


