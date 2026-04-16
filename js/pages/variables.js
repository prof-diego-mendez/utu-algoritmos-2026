    // ── EXERCISES ──
    const EXERCISES = [
      {
        n: 1, cat: 'basico', title: 'Declarar variables simples',
        stmt: 'Declará tres variables: una con tu nombre, una con tu edad y una con tu altura en metros. Luego mostrá los tres valores en pantalla.',
        hint: `nombre ← "Tu nombre"\nedad    ← 20\naltura  ← 1.70\nESCRIBIR nombre\nESCRIBIR edad\nESCRIBIR altura`
      },
      {
        n: 2, cat: 'basico', title: 'Cambiar el valor de una variable',
        stmt: 'Creá una variable llamada <code>temperatura</code> con valor 20. Luego cambiá su valor a 35 y mostrala.',
        hint: `temperatura ← 20\nESCRIBIR temperatura   // → 20\ntemperatura ← 35\nESCRIBIR temperatura   // → 35`
      },
      {
        n: 3, cat: 'aritmetica', title: 'Suma de dos números',
        stmt: 'Pedí dos números al usuario, guardalos en variables y mostrá su suma.',
        hint: `ESCRIBIR "Ingresá el primer número:"\nLEER a\nESCRIBIR "Ingresá el segundo número:"\nLEER b\nsuma ← a + b\nESCRIBIR "La suma es: " + suma`
      },
      {
        n: 4, cat: 'aritmetica', title: 'Perímetro de un rectángulo',
        stmt: 'Guardá el largo y el ancho de un rectángulo en variables. Calculá y mostrá su perímetro (2 × largo + 2 × ancho).',
        hint: `ESCRIBIR "Ingresá el largo:"\nLEER largo\nESCRIBIR "Ingresá el ancho:"\nLEER ancho\nperimetro ← 2 * largo + 2 * ancho\nESCRIBIR "Perímetro: " + perimetro`
      },
      {
        n: 5, cat: 'aritmetica', title: 'Área de un triángulo',
        stmt: 'Calculá el área de un triángulo dada su base y altura. El área es (base × altura) ÷ 2.',
        hint: `ESCRIBIR "Ingresá la base:"\nLEER base\nESCRIBIR "Ingresá la altura:"\nLEER altura\narea   ← (base * altura) / 2\nESCRIBIR "Área: " + area`
      },
      {
        n: 6, cat: 'aritmetica', title: 'Promedio de tres notas',
        stmt: 'Pedí tres notas al usuario, guardalas en variables y calculá su promedio.',
        hint: `LEER nota1\nLEER nota2\nLEER nota3\npromedio ← (nota1 + nota2 + nota3) / 3\nESCRIBIR "Promedio: " + promedio`
      },
      {
        n: 7, cat: 'aritmetica', title: 'Conversión Celsius → Fahrenheit',
        stmt: 'Leé una temperatura en grados Celsius y convertila a Fahrenheit. La fórmula es: F = C × 9 ÷ 5 + 32.',
        hint: `LEER celsius\nfahrenheit ← celsius * 9 / 5 + 32\nESCRIBIR celsius + "°C = " + fahrenheit + "°F"`
      },
      {
        n: 8, cat: 'aritmetica', title: 'División entera y resto',
        stmt: 'Pedí dos números. Mostrá el resultado de la división entera y también el resto usando <code>mod</code>.',
        hint: `LEER a\nLEER b\ncociente ← a / b\nresto    ← a mod b\nESCRIBIR "Cociente: " + cociente\nESCRIBIR "Resto: " + resto`
      },
      {
        n: 9, cat: 'aritmetica', title: 'Precio con descuento',
        stmt: 'Guardá el precio de un producto y un porcentaje de descuento. Calculá y mostrá el precio final.',
        hint: `LEER precio\nLEER descuento   // ej: 20 para 20%\nahorro    ← precio * descuento / 100\nfinal     ← precio - ahorro\nESCRIBIR "Precio final: " + final`
      },
      {
        n: 10, cat: 'aritmetica', title: 'Potenciación simple',
        stmt: 'Pedí una base y un exponente. Calculá la potencia y mostrá el resultado.',
        hint: `LEER base\nLEER exp\nresultado ← base ^ exp\nESCRIBIR base + " ^ " + exp + " = " + resultado`
      },
      {
        n: 11, cat: 'intercambio', title: 'Intercambiar dos variables',
        stmt: 'Tenés dos variables, <code>x</code> e <code>y</code>. Intercambiá sus valores usando una variable auxiliar.',
        hint: `x   ← 5\ny   ← 10\naux ← x\nx   ← y\ny   ← aux\nESCRIBIR "x = " + x + ", y = " + y   // x=10, y=5`
      },
      {
        n: 12, cat: 'intercambio', title: 'Duplicar un valor',
        stmt: 'Guardá un número en una variable y creá otra variable que tenga el doble de ese valor. Mostrá ambas.',
        hint: `LEER original\ndoble    ← original * 2\nESCRIBIR "Original: " + original\nESCRIBIR "Doble: " + doble`
      },
      {
        n: 13, cat: 'intercambio', title: 'Acumulador',
        stmt: 'Empezá con una variable <code>total</code> en 0. Sumale 5, luego 8 y luego 12, actualizando siempre la misma variable. Mostrá el total final.',
        hint: `total ← 0\ntotal ← total + 5\ntotal ← total + 8\ntotal ← total + 12\nESCRIBIR "Total: " + total   // → 25`
      },
      {
        n: 14, cat: 'intercambio', title: 'Contador de pasos',
        stmt: 'Creá una variable <code>pasos</code> que empiece en 0. Incrementala de a 1 exactamente tres veces y mostrá el valor final.',
        hint: `pasos ← 0\npasos ← pasos + 1\npasos ← pasos + 1\npasos ← pasos + 1\nESCRIBIR "Pasos: " + pasos   // → 3`
      },
      {
        n: 15, cat: 'aritmetica', title: 'Segundos a horas, minutos y segundos',
        stmt: 'Dado un total de segundos, calculá cuántas horas, minutos y segundos restantes contiene usando división entera y módulo.',
        hint: `LEER total\nhoras    ← total / 3600\nresto1   ← total mod 3600\nminutos  ← resto1 / 60\nsegundos ← resto1 mod 60\nESCRIBIR horas + "h " + minutos + "m " + segundos + "s"`
      },
      {
        n: 16, cat: 'texto', title: 'Concatenar nombre completo',
        stmt: 'Pedí el nombre y el apellido por separado, guardalos en variables y mostrá el nombre completo en una sola línea.',
        hint: `LEER nombre\nLEER apellido\ncompleto ← nombre + " " + apellido\nESCRIBIR "Nombre completo: " + completo`
      },
      {
        n: 17, cat: 'texto', title: 'Mensaje personalizado',
        stmt: 'Pedí el nombre del usuario y su edad. Mostrá un mensaje del estilo: "Hola, Ana. Tenés 25 años."',
        hint: `LEER nombre\nLEER edad\nESCRIBIR "Hola, " + nombre + ". Tenés " + edad + " años."`
      },
      {
        n: 18, cat: 'aritmetica', title: 'Cálculo del IMC',
        stmt: 'Pedí el peso (kg) y la altura (m) de una persona. Calculá el IMC: peso ÷ (altura × altura).',
        hint: `LEER peso\nLEER altura\nimc    ← peso / (altura * altura)\nESCRIBIR "IMC: " + imc`
      },
      {
        n: 19, cat: 'aritmetica', title: 'Interés simple',
        stmt: 'Guardá el capital, la tasa de interés anual (%) y la cantidad de años. Calculá el interés simple: I = capital × tasa ÷ 100 × años.',
        hint: `LEER capital\nLEER tasa\nLEER años\ninteres ← capital * tasa / 100 * años\ntotal   ← capital + interes\nESCRIBIR "Interés generado: " + interes\nESCRIBIR "Total acumulado: " + total`
      },
      {
        n: 20, cat: 'intercambio', title: 'Intercambiar sin variable auxiliar',
        stmt: 'Intercambiá los valores de dos variables numéricas sin usar una tercera variable auxiliar. Usá solo operaciones aritméticas.',
        hint: `LEER a\nLEER b\na ← a + b\nb ← a - b      // b = a original\na ← a - b      // a = b original\nESCRIBIR "a = " + a\nESCRIBIR "b = " + b`
      }
    ];

    const CAT_COLOR = { basico: 'b-purple', aritmetica: 'b-blue', intercambio: 'b-amber', texto: 'b-teal' };
    const CAT_LABEL = { basico: 'Básico', aritmetica: 'Aritmética', intercambio: 'Intercambio', texto: 'Texto' };

    let done = new Set();
    let currentFilter = 'todos';

    function buildProgress() {
      const dotsEl = document.getElementById('prog-dots');
      dotsEl.innerHTML = '';
      EXERCISES.forEach(ex => {
        const d = document.createElement('div');
        d.className = 'prog-dot' + (done.has(ex.n) ? ' done' : '');
        d.title = 'Ejercicio ' + ex.n;
        d.onclick = () => document.getElementById('ex-' + ex.n)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        dotsEl.appendChild(d);
      });
      document.getElementById('prog-count').textContent = done.size;
      document.getElementById('prog-fill').style.width = (done.size / 20 * 100) + '%';
    }

    function buildExercises() {
      const list = document.getElementById('ex-list');
      list.innerHTML = '';
      EXERCISES.forEach(ex => {
        const card = document.createElement('div');
        card.className = 'ex-card' + (done.has(ex.n) ? ' solved' : '');
        card.id = 'ex-' + ex.n;
        if (currentFilter !== 'todos' && ex.cat !== currentFilter) card.classList.add('hidden');

        card.innerHTML = `
      <div class="ex-header" onclick="toggleCard(${ex.n})">
        <div class="ex-num">${done.has(ex.n) ? '✓' : ex.n}</div>
        <div class="ex-title">${ex.title}</div>
        <div class="ex-tags"><span class="badge ${CAT_COLOR[ex.cat]}">${CAT_LABEL[ex.cat]}</span></div>
        <span class="ex-chevron">▾</span>
      </div>
      <div class="ex-body">
        <div class="ex-stmt">${ex.stmt}</div>
        <div class="ex-actions">
          <button class="btn-ghost" onclick="toggleHint(${ex.n})">💡 Ver solución</button>
          <button class="btn-solve" onclick="toggleDone(${ex.n})">${done.has(ex.n) ? '✓ Resuelto' : 'Marcar como resuelto'}</button>
          <button class="btn-ghost" onclick="loadInSandbox(${ex.n})">▶ Probar en sandbox</button>
        </div>
        <div class="ex-hint" id="hint-${ex.n}">
          <div class="ex-hint-header">// solución sugerida</div>
          <pre>${ex.hint}</pre>
        </div>
      </div>`;
        list.appendChild(card);
      });
    }

    function toggleCard(n) {
      const card = document.getElementById('ex-' + n);
      card.classList.toggle('open');
    }
    function toggleHint(n) {
      document.getElementById('hint-' + n).classList.toggle('visible');
    }
    function toggleDone(n) {
      done.has(n) ? done.delete(n) : done.add(n);
      buildExercises();
      buildProgress();
    }

    function loadInSandbox(n) {
      const ex = EXERCISES.find(e => e.n === n);
      if (!ex) return;
      document.getElementById('modal-sandbox-code').value = ex.hint;
      openModal();
      setTimeout(() => runSandboxPseint('modal-sandbox-code', 'modal-sandbox-output'), 100);
    }

    function filterExs(cat, btn) {
      currentFilter = cat;
      document.querySelectorAll('.ex-controls .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      buildExercises();
    }

    // Active nav link on scroll
    const sections = ['concepto', 'tipos', 'operaciones', 'logica', 'sandbox', 'ejercicios'];
    window.addEventListener('scroll', () => {
      let found = '';
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 100) found = id;
      });
      document.querySelectorAll('.page-nav-link').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + found);
      });
    }, { passive: true });

    buildProgress();
    buildExercises();

// Integrate StateManager with Variables module exercises
    const VARIABLES_MODULE = 'variables';
    const VARIABLES_TOTAL = 20;

    // Override toggleDone to use StateManager
    const originalToggleDone = typeof toggleExercise !== 'undefined' ? toggleExercise : null;
    if (originalToggleDone) {
      window.toggleExercise = function (idx) {
        const completed = StateManager.setExercise(VARIABLES_MODULE, idx, !StateManager.getExercise(VARIABLES_MODULE, idx)?.completed);
        buildProgress();
        buildExercises();
      };
    }

    // Override saveSolution to use StateManager
    const originalSaveSolution = typeof saveSolution !== 'undefined' ? saveSolution : null;
    if (originalSaveSolution) {
      window.saveSolution = function (idx, text) {
        StateManager.setAnswer(VARIABLES_MODULE, idx, text);
      };
    }

    // Override getSolution to use StateManager
    const originalGetSolution = typeof getSolution !== 'undefined' ? getSolution : null;
    if (originalGetSolution) {
      window.getSolution = function (idx) {
        return StateManager.getExercise(VARIABLES_MODULE, idx)?.answer || '';
      };
    }
