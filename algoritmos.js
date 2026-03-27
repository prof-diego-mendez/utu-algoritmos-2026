const EXERCISES = [
  { titulo: "La ruta al colegio", nivel: "Básico", tema: "Secuencia", enunciado: "Escribí en pseudocódigo los pasos para ir desde tu casa hasta el aula de clase. Incluí al menos 8 pasos detallados.\n\n¿Qué pasaría si saltás el paso de abrir la puerta del edificio? Reflexioná sobre la importancia del orden y la completitud en los algoritmos.", hint: "Pensá en: levantarse, vestirse, salir, caminar, llegar. Cada paso debe ser tan preciso que alguien que nunca hizo ese recorrido pueda seguirlo sin preguntar nada." },
  { titulo: "Preparar un sándwich", nivel: "Básico", tema: "Secuencia", enunciado: "Diseñá un algoritmo en lenguaje natural para preparar un sándwich de jamón y queso. Luego reescribilo en pseudocódigo usando: INICIO, FIN, LEER (para datos externos), ESCRIBIR (para mostrar resultados) y el operador de asignación ←.", hint: "Las acciones físicas se convierten en instrucciones. 'Untar manteca' es una operación. Los ingredientes son las 'entradas' del algoritmo. Pensá qué variables necesitás." },
  { titulo: "Suma, resta y promedio", nivel: "Básico", tema: "Secuencia", enunciado: "Escribí un algoritmo en pseudocódigo que:\n1. Pida al usuario dos números.\n2. Calcule su suma, su resta y su promedio.\n3. Muestre los tres resultados con etiquetas descriptivas.\n\nIdentificá claramente cuáles son las variables, las entradas y las salidas del algoritmo.", hint: "Necesitás al menos 5 variables: num1, num2, suma, resta, promedio. El promedio se calcula como (num1 + num2) / 2." },
  { titulo: "Mayor de edad", nivel: "Básico", tema: "Selección", enunciado: "Diseñá un algoritmo que lea la edad de una persona y determine si es:\n· Menor de edad (< 18)\n· Mayor de edad (≥ 18)\n· Adulto mayor (≥ 65)\n\nMostrá un mensaje diferente para cada caso. Describí también qué símbolo de diagrama de flujo usarías en cada paso.", hint: "Necesitás una estructura de decisión anidada o múltiple. Sugerencia: primero verificá si es ≥ 65, luego si es ≥ 18, y finalmente el caso restante." },
  { titulo: "¿Es divisible?", nivel: "Básico", tema: "Selección", enunciado: "Escribí un algoritmo que reciba un número entero y determine:\n· Si es divisible por 2.\n· Si es divisible por 3.\n· Si es divisible por ambos a la vez.\n· Si no es divisible por ninguno.\n\nRecordá que el operador MOD (resto) te indica si la división es exacta (resultado = 0).", hint: "Un número es divisible por N si número MOD N = 0. Para el caso 'ambos', usá el operador lógico Y (AND). Considerá los cuatro casos posibles y asegurate de cubrirlos todos." },
  { titulo: "Contador manual", nivel: "Básico", tema: "Repetición", enunciado: "Describí en pseudocódigo un algoritmo que:\na) Muestre todos los números del 1 al 100.\nb) Solo muestre los números pares del 1 al 100.\nc) Cuente hacia atrás del 100 al 1.\n\nPara cada variante, identificá qué tipo de bucle usás y por qué es el más adecuado.", hint: "Para los pares podés usar paso de 2 en 2 (i ← i + 2) o verificar si i MOD 2 = 0. Para contar hacia atrás, el incremento se convierte en decremento (i ← i − 1)." },
  { titulo: "Calculadora de notas", nivel: "Intermedio", tema: "Secuencia + Selección", enunciado: "Un alumno tiene 3 notas parciales (escala 0–10). Diseñá un algoritmo que:\n1. Calcule el promedio.\n2. Asigne la calificación:\n   · 'Excelente' si promedio ≥ 9\n   · 'Muy bueno' si promedio ≥ 7\n   · 'Aprobado' si promedio ≥ 6\n   · 'Desaprobado' si promedio < 6\n3. Muestre cuántos puntos le faltan para el siguiente nivel (o felicitación si sacó 10).", hint: "Usá una estructura SI anidada. Para los puntos faltantes: calculá la diferencia entre el umbral del siguiente nivel y el promedio. Si el promedio ya es 10, no hay 'siguiente nivel'." },
  { titulo: "El cajero automático", nivel: "Intermedio", tema: "Selección", enunciado: "Modelá en pseudocódigo el proceso de retirar dinero de un cajero automático. El usuario tiene un saldo inicial conocido. El algoritmo debe:\n1. Pedir el monto a retirar.\n2. Verificar que no exceda el saldo disponible.\n3. Verificar que el monto sea múltiplo de 100 (el cajero solo da billetes de $100).\n4. Realizar el débito o mostrar el mensaje de error correspondiente.", hint: "Necesitás dos condiciones independientes. Podés evaluarlas con Y para combinarlas, o por separado para dar mensajes de error distintos y más claros al usuario." },
  { titulo: "Adivinar el número", nivel: "Intermedio", tema: "Repetición + Selección", enunciado: "Diseñá el algoritmo de un juego donde la computadora 'elige' un número entre 1 y 100 (tratalo como un dato fijo, ej: 42). El usuario intenta adivinarlo.\n\nEn cada intento el algoritmo indica si el número secreto es mayor o menor. El juego termina cuando el usuario adivina o cuando supera 7 intentos.\n\nMostrá al final si ganó o perdió y cuántos intentos usó.", hint: "Usá un bucle MIENTRAS con dos condiciones de salida: que el usuario haya adivinado O que el contador supere 7. Usá una variable bandera (encontrado ← Falso) para registrar si ganó." },
  { titulo: "Suma de la serie", nivel: "Intermedio", tema: "Repetición", enunciado: "Escribí tres algoritmos separados. Para cada uno el usuario ingresa N:\na) Suma de los primeros N números naturales: 1 + 2 + … + N\nb) Factorial de N: N! = 1 × 2 × 3 × … × N\nc) Suma de cuadrados: 1² + 2² + … + N²\n\nRealizá la prueba de escritorio completa para N = 4 en los tres casos.", hint: "Los tres tienen estructura similar: inicializar acumulador, iterar de 1 a N, actualizar el acumulador. Para el factorial, el acumulador se inicializa en 1 y se multiplica (no se suma)." },
  { titulo: "Validación de datos", nivel: "Intermedio", tema: "Repetición + Selección", enunciado: "Un sistema pide al usuario ingresar su edad. El valor debe ser un entero entre 0 y 120 (inclusive).\n\nDiseñá un algoritmo que:\n1. Siga pidiendo la edad hasta recibir un valor válido.\n2. Muestre un mensaje de error descriptivo indicando por qué el valor es inválido (valor negativo vs. valor demasiado alto son errores distintos).", hint: "Usá un bucle HACER-MIENTRAS: ejecuta el pedido al menos una vez y repite si la condición de error sigue siendo verdadera. El mensaje debe ser distinto para cada tipo de error." },
  { titulo: "El número primo", nivel: "Intermedio", tema: "Repetición + Selección", enunciado: "Diseñá un algoritmo que determine si un número N ingresado por el usuario es primo o no.\n\nUn número primo solo es divisible por 1 y por sí mismo.\n\nDescribí tu estrategia: ¿desde qué número empezás a probar divisores? ¿hasta cuál llegás? ¿qué condición exacta te indica que N NO es primo? ¿cómo optimizás la búsqueda?", hint: "Solo necesitás probar divisores desde 2 hasta raíz cuadrada de N (o hasta N−1 si querés simplificar). Si encontrás cualquier divisor exacto (N MOD d = 0), N no es primo y podés salir del bucle." },
  { titulo: "Máximo y mínimo", nivel: "Intermedio", tema: "Repetición + Variables", enunciado: "El usuario ingresa 10 números enteros uno por uno. Diseñá un algoritmo que encuentre el mayor y el menor de todos ellos.\n\nRestricción: no podés guardar todos los números en memoria. Solo podés usar variables simples (sin listas ni arreglos).\n\nDescribí detalladamente cómo actualizás el máximo y el mínimo en cada paso del proceso.", hint: "Leé el primer número y asignalo tanto al máximo como al mínimo (como valor inicial). En cada iteración siguiente: si el número leído > máximo → actualizá máximo; si < mínimo → actualizá mínimo." },
  { titulo: "Conversor de temperaturas", nivel: "Intermedio", tema: "Selección + Cálculo", enunciado: "Diseñá un algoritmo que convierta temperaturas entre tres escalas. El usuario elige escala de origen, escala destino e ingresa el valor.\n\nFórmulas:\n· F = C × 9/5 + 32\n· C = (F − 32) × 5/9\n· K = C + 273.15\n· C = K − 273.15\n\nContemplá todas las conversiones posibles (6 combinaciones). Considerá los valores físicamente imposibles (por ej. K < 0).", hint: "Una estrategia elegante: convertí siempre primero a Celsius, luego del Celsius al destino. Eso reduce las combinaciones de 6 a 4 casos. Recordá validar que Kelvin no sea negativo." },
  { titulo: "Tabla de multiplicar", nivel: "Intermedio", tema: "Bucles anidados", enunciado: "Diseñá un algoritmo que genere y muestre la tabla de multiplicar del 1 al 10 completa.\nFormato: 1×1=1, 1×2=2, …, 10×10=100.\n\nRespondé:\n· ¿Cuántas instrucciones de multiplicación ejecuta el algoritmo en total?\n· ¿Qué tipo de estructura de control necesitás?\n· ¿Qué representa cada variable en el algoritmo?", hint: "Necesitás dos bucles PARA anidados: el externo para el multiplicando (1 a 10) y el interno para el multiplicador (1 a 10). En total se realizan 10 × 10 = 100 multiplicaciones." },
  { titulo: "Sistema de votación", nivel: "Avanzado", tema: "Repetición + Acumuladores", enunciado: "En una elección hay 3 candidatos (A, B, C). El algoritmo debe:\n1. Recibir votos uno por uno (1=A, 2=B, 3=C, 0=fin de votación).\n2. Contar los votos de cada candidato y los votos nulos (cualquier valor distinto de 0, 1, 2 o 3).\n3. Al finalizar, mostrar: el ganador, el porcentaje de votos de cada candidato (sobre votos válidos).\n4. Detectar ballotage si la diferencia entre los dos más votados es menor al 5%.", hint: "Usá tres contadores (votosA, votosB, votosC) y uno para nulos. Los porcentajes se calculan sobre el total de votos válidos. Para el ballotage, encontrá los dos mayores valores y calculá la diferencia porcentual." },
  { titulo: "Búsqueda binaria", nivel: "Avanzado", tema: "Repetición + Lógica", enunciado: "Tenés una lista imaginaria de 10 números enteros ordenados de menor a mayor:\n[3, 7, 12, 19, 25, 31, 37, 44, 50, 63]\n\nDiseñá el algoritmo de búsqueda binaria para encontrar un valor X. Describí:\n· ¿Qué es el punto medio?\n· ¿Cómo se descarta la mitad?\n· ¿Cuándo termina la búsqueda?\n\nRealizá la prueba de escritorio buscando X = 37. ¿Cuántas comparaciones necesitás?", hint: "La búsqueda binaria usa dos índices: inicio y fin. Punto medio = (inicio + fin) / 2 (entero). Si lista[medio] = X → encontrado. Si lista[medio] < X → inicio = medio + 1. Si lista[medio] > X → fin = medio − 1." },
  { titulo: "Control de stock", nivel: "Avanzado", tema: "Lógica aplicada", enunciado: "Un negocio tiene 5 productos con nombre, precio y stock inicial. Diseñá un algoritmo que simule ventas:\n· El usuario ingresa código de producto (1–5) y cantidad.\n· El algoritmo verifica stock disponible.\n· Si hay stock: procesa la venta (descuenta stock, acumula total vendido).\n· Alerta si el stock cae por debajo de 3 unidades.\n· Termina cuando el usuario ingresa 0.\n· Al final muestra el total recaudado.", hint: "Representá cada producto con sus variables (nombre1, precio1, stock1, etc.). Usá una estructura de selección múltiple para identificar el producto por código. La alerta de stock bajo se verifica después de cada venta exitosa." },
  { titulo: "El algoritmo roto", nivel: "Avanzado", tema: "Detección de errores", enunciado: "El siguiente algoritmo pretende calcular el promedio de N números ingresados por el usuario, pero tiene 4 errores lógicos. Encontralos, explicá por qué cada uno es un error y escribí la versión corregida.\n\nINICIO\n  suma ← 1\n  LEER n\n  PARA i ← 0 HASTA n HACER\n    LEER numero\n    suma ← suma + numero\n  FIN PARA\n  promedio ← suma / n + 1\n  ESCRIBIR promedio\nFIN", hint: "Buscá errores en: (1) la inicialización de suma, (2) el rango del bucle PARA (¿debe empezar en 0?), (3) la fórmula del promedio, (4) ¿qué pasa si n = 0? El algoritmo no contempla ese caso." },
  { titulo: "Diseño libre: problema real", nivel: "Avanzado", tema: "Diseño completo", enunciado: "Elegí un proceso de tu vida cotidiana que involucre decisiones y repeticiones.\nEjemplos: pedir delivery, registrarse en una app, buscar un contacto, calcular vuelto en una caja.\n\nDiseñá el algoritmo completo:\n1. Identificá entradas y salidas.\n2. Escribilo en pseudocódigo.\n3. Identificá todas las estructuras de control usadas.\n4. Realizá la prueba de escritorio con un ejemplo concreto.", hint: "Criterios de evaluación: completitud (todos los casos), claridad (sin ambigüedad), corrección (resultado esperado) y eficiencia (sin pasos redundantes). Mientras más complejo el proceso, mayor el desafío." }
];

let completados = {};
let respuestas = {};

try {
  const s = localStorage.getItem('algo_completados');
  if (s) completados = JSON.parse(s);
  const r = localStorage.getItem('algo_respuestas');
  if (r) respuestas = JSON.parse(r);
} catch (e) { }

function saveState() {
  try {
    localStorage.setItem('algo_completados', JSON.stringify(completados));
    localStorage.setItem('algo_respuestas', JSON.stringify(respuestas));
  } catch (e) { }
}

function updateStats() {
  const done = Object.values(completados).filter(Boolean).length;
  document.getElementById('cnt-done').textContent = done;
  document.getElementById('cnt-pct').textContent = Math.round(done / 20 * 100) + '%';
  document.getElementById('prog-fill').style.width = Math.round(done / 20 * 100) + '%';
}

function renderEjercicios(filtro) {
  const container = document.getElementById('ex-list');
  container.innerHTML = '';
  const lista = filtro === 'todos' ? EXERCISES : EXERCISES.filter(e => e.nivel === filtro);

  lista.forEach(ex => {
    const idx = EXERCISES.indexOf(ex);
    const isDone = completados[idx];
    const nClass = ex.nivel === 'Básico' ? 'basico' : ex.nivel === 'Intermedio' ? 'intermedio' : 'avanzado';
    const bNivel = ex.nivel === 'Básico' ? 'badge-basico' : ex.nivel === 'Intermedio' ? 'badge-intermedio' : 'badge-avanzado';
    const savedText = respuestas[idx] || '';

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
  respuestas[idx] = ta.value;
  saveState();
  const msg = document.getElementById('saved-' + idx);
  msg.style.display = 'inline';
  setTimeout(() => msg.style.display = 'none', 2000);
}

function clearAnswer(idx) {
  document.getElementById('ta-' + idx).value = '';
  respuestas[idx] = '';
  saveState();
}

function toggleDone(idx) {
  completados[idx] = !completados[idx];
  saveState();
  const item = document.getElementById('ex-item-' + idx);
  const btn = document.getElementById('check-' + idx);
  item.classList.toggle('done', completados[idx]);
  btn.classList.toggle('done', completados[idx]);
  btn.textContent = completados[idx] ? '✓' : '';
  updateStats();
}

function filterEx(filtro, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderEjercicios(filtro);
}

function showSection(id, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (btn) btn.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Check if we need to open a specific tab (set by links from other pages)
(function() {
  const savedTab = localStorage.getItem('algo_tab');
  if (savedTab) {
    localStorage.removeItem('algo_tab');
    const section = document.getElementById(savedTab);
    if (section) {
      // Find matching nav button
      const tabs = document.querySelectorAll('.nav-tab');
      tabs.forEach(t => {
        if (t.textContent.trim().toLowerCase().startsWith(savedTab.replace('disenio','diseño').substring(0,4))) {
          showSection(savedTab, t);
        }
      });
      if (!section.classList.contains('active')) showSection(savedTab, null);
    }
  }
})();

renderEjercicios('todos');

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


