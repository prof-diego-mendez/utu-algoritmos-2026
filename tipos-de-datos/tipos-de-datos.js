/* ============================================================
   tipos-de-datos.js
   Lógica interactiva para la página de Tipos de Datos en Java.
   ============================================================ */

// ── EJERCICIOS ─────────────────────────────────────────────

const EXERCISES = [

  // ── BÁSICO (1–8) ────────────────────────────────────────

  {
    titulo: "El tipo correcto para cada situación",
    nivel: "Básico",
    tema: "Primitivos",
    enunciado: `Para cada variable, elegí el tipo de dato más adecuado y justificá tu elección:\n\na) La edad de una persona.\nb) El precio de un producto (puede tener centavos).\nc) El promedio de un alumno con 2 decimales.\nd) Si un usuario está o no conectado.\ne) La inicial del nombre de una persona.\nf) La cantidad de habitantes de un país.`,
    hint: "Pensá en el rango de valores posibles y si necesitás decimales. Para edades, int es suficiente. Para precios con centavos, double es preferible. Para una respuesta sí/no, boolean es ideal."
  },
  {
    titulo: "Declaración y asignación",
    nivel: "Básico",
    tema: "Declaración",
    enunciado: `Escribí las declaraciones Java para:\n\na) Una variable entera llamada anio con valor 2026.\nb) Una constante double llamada PI con valor 3.14159.\nc) Una variable String llamada nombre con valor "María".\nd) Un char llamado inicial con la letra 'D'.\ne) Un boolean llamado aprobado con valor false.\n\n¿Cuál de estas variables podría cambiar su valor durante la ejecución? ¿Cuál nunca debería cambiar?`,
    hint: "Las constantes se declaran con la palabra clave 'final' antes del tipo. Ejemplo: final double PI = 3.14159; Una vez asignada, no puede modificarse o el compilador dará error."
  },
  {
    titulo: "Identificadores válidos en Java",
    nivel: "Básico",
    tema: "Declaración",
    enunciado: `Indicá si cada identificador es válido o inválido en Java. Si es inválido, explicá por qué y proponé una corrección:\n\na) int 2nota = 8;\nb) double precioFinal = 99.9;\nc) boolean es-mayor = true;\nd) String nombre completo = "Ana";\ne) char _inicial = 'A';\nf) long class = 1000L;\ng) int $precio = 500;\nh) double promedio_final_alumno = 7.5;\n\nLuego: ¿cuál es la convención de nombres (naming convention) recomendada en Java para variables, constantes y clases?`,
    hint: "Los identificadores en Java: deben empezar con letra, $ o _; no pueden tener espacios; no pueden ser palabras reservadas (class, int, boolean, etc.); son case-sensitive. La convención es camelCase para variables y métodos, UPPER_CASE para constantes, PascalCase para clases."
  },
  {
    titulo: "Literales y sufijos de tipos",
    nivel: "Básico",
    tema: "Primitivos",
    enunciado: `En Java, el tipo de un literal puede identificarse por su forma o su sufijo. Indicá qué tipo tiene cada literal y por qué:\n\na) 42\nb) 42L\nc) 3.14\nd) 3.14f\ne) 'A'\nf) "A"\ng) true\nh) 0xFF   (hexadecimal)\ni) 1_000_000   (guión bajo como separador)\n\nPara los incisos h) e i): ¿de qué tipo son? ¿Se pueden asignar directamente a un int?`,
    hint: "Sin sufijo, los enteros son int y los decimales son double. L indica long, f indica float. Las comillas simples son char, las dobles son String. Los literales hexadecimales (0x...) son int o long. El guión bajo en literales numéricos es solo visual, no cambia el tipo ni el valor."
  },
  {
    titulo: "Operaciones enteras",
    nivel: "Básico",
    tema: "Aritmética",
    enunciado: `Sin ejecutar el código, calculá el resultado de cada expresión Java. Todos son int salvo que se indique otro tipo:\n\na) 10 / 3\nb) 10 % 3\nc) 7 / 2\nd) -7 / 2\ne) 10 % 2 — ¿qué característica nos indica este resultado sobre el número 10?\nf) 15 % 7\n\nPara cada uno: ¿el resultado es el esperado? ¿Sorprendió alguno?`,
    hint: "Recordá: en Java, la división entre enteros descarta el decimal (trunca hacia cero). El operador % devuelve el resto de la división. Si el resultado de n % 2 es 0, el número es par."
  },
  {
    titulo: "Overflow y límites",
    nivel: "Básico",
    tema: "Primitivos",
    enunciado: `Respondé las siguientes preguntas sobre los límites de los tipos primitivos:\n\na) ¿Qué valor tiene una variable byte inicializada en 127 si le sumás 2?\nb) ¿Por qué no sería correcto usar int para guardar el número 10 000 000 000?\nc) ¿Qué tipo usarías para guardar la distancia en metros entre la Tierra y el Sol (aprox. 150 000 000 000 m)?\nd) ¿Puede un short guardar el valor 40 000? Justificá.`,
    hint: "El rango de byte es -128 a 127; si superás 127 el valor 'da la vuelta' a -128. El rango de int es aproximadamente ±2100 millones. Para valores más grandes, long puede guardar hasta ±9.2 × 10¹⁸."
  },
  {
    titulo: "Expresiones con char",
    nivel: "Básico",
    tema: "char y Unicode",
    enunciado: `En Java, char almacena un carácter como número Unicode de 16 bits. Respondé:\n\na) ¿Qué devuelve (int) 'B'? ¿Y (int) 'a'?\nb) Si 'A' es 65 y 'Z' es 90, ¿a qué carácter corresponde (char) 72?\nc) ¿Qué pasa si escribís char c = 'AB'; ? ¿Es válido?\nd) ¿Podés sumar dos char en Java? ¿Qué tipo retorna la suma?`,
    hint: "Los valores ASCII/Unicode de 'A'=65, 'a'=97. Podés forzar la conversión con (char) número para obtener el carácter correspondiente. Los char se pueden sumar pero el resultado es de tipo int, no char."
  },
  {
    titulo: "String: inmutabilidad",
    nivel: "Básico",
    tema: "String",
    enunciado: `Analizá el siguiente código y respondé:\n\nString nombre = "Juan";\nnombre = nombre + " García";\nSystem.out.println(nombre);\n\na) ¿Qué muestra la última línea?\nb) ¿El String "Juan" fue modificado? ¿O se creó uno nuevo?\nc) ¿Qué significa que String sea inmutable?\nd) ¿Cuántos objetos String se crearon en total en estas líneas?`,
    hint: "Los String en Java no se modifican: son inmutables. Cuando hacés nombre + \" García\", Java crea un tercer String nuevo y reasigna la referencia. El String original \"Juan\" sigue existiendo en memoria (hasta que el GC lo limpie)."
  },

  // ── INTERMEDIO (9–16) ────────────────────────────────────

  {
    titulo: "Casting de double a int",
    nivel: "Intermedio",
    tema: "Casting",
    enunciado: `Sin ejecutar el código, determiná qué valor imprime cada línea. Explicá por qué:\n\na) System.out.println((int) 9.99);\nb) System.out.println((int) -3.7);\nc) System.out.println((int) 3.5 + (int) 3.5);\nd) double d = 7 / 2;\n   System.out.println(d);\ne) double e = 7.0 / 2;\n   System.out.println(e);\n\n¿Cuál es la diferencia entre los casos d) y e)?`,
    hint: "El casting (int) trunca hacia cero (no redondea). -3.7 → -3, no -4. En el caso d), la división 7/2 se evalúa primero como enteros dando 3, y luego 3 se convierte a double: 3.0. En e), 7.0/2 ya es double desde el inicio."
  },
  {
    titulo: "Wrapper classes y parsing",
    nivel: "Intermedio",
    tema: "Wrappers",
    enunciado: `Escribí el código Java para:\n\na) Convertir el String "42" a un entero int.\nb) Convertir el String "3.14" a un double.\nc) Convertir un int número = 100 a su representación como String.\nd) Obtener el valor máximo que puede almacenar un int (sin escribirlo manualmente).\ne) ¿Qué excepción lanzaría Integer.parseInt("abc")? ¿Cómo la evitarías?`,
    hint: "Usá Integer.parseInt(), Double.parseDouble(), String.valueOf() o Integer.toString(). El valor máximo está en Integer.MAX_VALUE. Para evitar excepciones al parsear, podés usar un try-catch o validar con un método que verifique si la cadena es numérica."
  },
  {
    titulo: "Concatenación vs. suma",
    nivel: "Intermedio",
    tema: "String",
    enunciado: `Analizá cada expresión y decí qué imprime. Justificá:\n\na) System.out.println("Resultado: " + 3 + 7);\nb) System.out.println("Resultado: " + (3 + 7));\nc) System.out.println(3 + 7 + " es el resultado");\nd) int x = 5, y = 3;\n   System.out.println("Suma: " + x + y);\n   System.out.println("Suma: " + (x + y));\n\n¿Qué regla general podés extraer de estos ejemplos?`,
    hint: "El operador + se evalúa de izquierda a derecha. Si hay un String en el lado izquierdo, el operando derecho se convierte a texto. Los paréntesis cambian el orden de evaluación y fuerzan la suma aritmética antes de la concatenación."
  },
  {
    titulo: "Métodos de String",
    nivel: "Intermedio",
    tema: "String",
    enunciado: `Dado: String texto = "Programación en Java";\n\nEscribí expresiones Java para:\na) Obtener la longitud del texto.\nb) Pasar todo a mayúsculas.\nc) Obtener los primeros 11 caracteres ("Programación").\nd) Verificar si contiene la palabra "Java".\ne) Reemplazar "Java" por "Python".\nf) Obtener el índice donde empieza "Java" (usá indexOf).\ng) Comparar con "programación en java" ignorando mayúsculas (usá equalsIgnoreCase).`,
    hint: "substring(inicio, fin) usa índices base 0. indexOf devuelve -1 si no encuentra el texto. La 'ó' de Programación cuenta como un solo carácter. Contá cuidadosamente: P(0)r(1)o(2)g(3)r(4)a(5)m(6)a(7)c(8)i(9)ó(10)n(11)."
  },
  {
    titulo: "Inferencia de tipos y var",
    nivel: "Intermedio",
    tema: "Declaración",
    enunciado: `En Java 10+, podés usar var para que el compilador infiera el tipo:\n\nvar x = 10;        // el compilador infiere int\nvar y = 3.14;      // infiere double\nvar s = "Hola";    // infiere String\n\nPara cada declaración con var, decí qué tipo inferiría el compilador y por qué:\na) var a = 100L;\nb) var b = 'Z';\nc) var c = true;\nd) var d = 2.5f;\ne) var e = "42";\nf) var f = 42;\n\n¿Cuál es la diferencia entre var e = "42" y var f = 42?`,
    hint: "El sufijo L indica long, el sufijo f indica float. Sin sufijo, los literales enteros son int y los decimales son double. 'Z' entre comillas simples es char. 'true'/'false' son boolean. Var no crea tipos dinámicos: el tipo se fija en compilación."
  },
  {
    titulo: "Operadores relacionales y lógicos",
    nivel: "Intermedio",
    tema: "Operadores",
    enunciado: `Evaluá cada expresión Java como true o false. Justificá tu respuesta:\n\nDatos: int a = 10, b = 5, c = 10;\n\na) a == c\nb) a != b\nc) a > b && b > 0\nd) a < b || c == 10\ne) !(a == b)\nf) a >= c && b < 0\ng) (a + b) == 15\nh) a == 10 & b++ > 3   // ¿cuánto vale b después?\ni) a == 10 && b++ > 3  // ¿cuánto vale b después?\n\n¿Cuál es la diferencia entre & y && en Java?`,
    hint: "Los operadores && y || son 'de cortocircuito': si el primer operando ya determina el resultado, el segundo no se evalúa. El operador & siempre evalúa ambos lados. En el inciso h), b++ se evalúa siempre. En i) con &&, b++ solo se evalúa si el lado izquierdo es true."
  },
  {
    titulo: "Formateo de salida con printf",
    nivel: "Intermedio",
    tema: "String",
    enunciado: `En Java, System.out.printf() y String.format() permiten insertar valores en un texto con formato.\n\nAnalizá qué imprime cada línea:\n\na) System.out.printf("Hola, %s!%n", "Diego");\nb) System.out.printf("%d + %d = %d%n", 3, 4, 3+4);\nc) System.out.printf("%.2f%n", 3.14159);\nd) System.out.printf("%10s%n", "Java");    // ¿qué hace el 10?\ne) System.out.printf("%-10s|%n", "Java");  // ¿qué hace el -?\n\nLuego escribí una línea que muestre: "Alumno: Ana | Nota: 8.50" usando printf con variables String nombre = "Ana" y double nota = 8.5.`,
    hint: "Los especificadores: %s = String, %d = entero, %f = decimal, %n = salto de línea. El número antes del especificador define el ancho mínimo. El punto seguido de un número define los decimales (%.2f = 2 decimales). El signo - alinea a la izquierda."
  },
  {
    titulo: "Cálculos con la clase Math",
    nivel: "Intermedio",
    tema: "Aritmética",
    enunciado: `La clase Math de Java provee métodos matemáticos listos para usar. Calculá el resultado de:\n\ndouble a = -4.7;\ndouble b = 2.0;\n\na) Math.abs(a)         // valor absoluto\nb) Math.pow(b, 3)      // potencia\nc) Math.sqrt(16.0)     // raíz cuadrada\nd) Math.ceil(a)        // redondeo hacia arriba\ne) Math.floor(a)       // redondeo hacia abajo\nf) Math.round(a)       // redondeo al entero más cercano\ng) Math.max(3, 7)\nh) Math.min(3, 7)\n\n¿Qué tipo retorna Math.round(double)? ¿Y Math.pow()?`,
    hint: "Math.abs devuelve el valor sin signo. Math.pow(2, 3) = 8.0. Math.ceil(-4.7) = -4.0 (redondea hacia el entero superior, que para negativos es el menos negativo). Math.floor(-4.7) = -5.0. Math.round(double) retorna long. Math.pow() retorna double."
  },

  // ── AVANZADO (17–20) ─────────────────────────────────────

  {
    titulo: "Detección de errores en tipos",
    nivel: "Avanzado",
    tema: "Errores de tipo",
    enunciado: `El siguiente código tiene 5 errores de tipos de datos. Identificalos, explicá por qué son errores y escribí la corrección:\n\nint a = 3.5;\nbyte b = 200;\nchar c = "A";\nboolean d = 1;\nlong e = 5000000000;\n\ndouble resultado = a / 2;\nSystem.out.println(resultado);`,
    hint: "Errores típicos: asignar double a int sin casting, exceder el rango de byte (máx 127), usar comillas dobles para char (deben ser simples), asignar entero a boolean (Java no acepta 0/1 como booleanos), y los literales long grandes necesitan sufijo L. ¿Qué imprimiría la última línea?"
  },
  {
    titulo: "Elección de tipo según contexto real",
    nivel: "Avanzado",
    tema: "Diseño",
    enunciado: `Diseñá la declaración de variables para representar los datos de un estudiante universitario.\nDebés incluir al menos 8 variables de al menos 5 tipos distintos.\n\nRequisitos:\n· Nombre completo y apellido por separado.\n· Número de legajo (puede tener hasta 7 dígitos).\n· Promedio con decimales.\n· Si está graduado o no.\n· Año de ingreso.\n· Inicial de la carrera (una letra).\n· Al menos una constante con justificación.\n\nPara cada variable justificá por qué elegiste ese tipo específico.`,
    hint: "El promedio admite decimales → double. El legajo con hasta 7 dígitos cabe en int (máx ~2100 millones). El año corriente cabe en int o incluso short (max 32767). Pensá si la inicial de carrera es realmente un char o podría ser un String de 1 carácter según el contexto."
  },
  {
    titulo: "Precisión decimal: float vs double",
    nivel: "Avanzado",
    tema: "Precisión",
    enunciado: `Analizá el problema de precisión en punto flotante:\n\nfloat f  = 0.1f + 0.2f;\ndouble d = 0.1 + 0.2;\nSystem.out.println(f);\nSystem.out.println(d);\n\na) ¿Cuál esperarías que sea el resultado de cada uno?\nb) ¿Por qué el resultado puede no ser exactamente 0.3?\nc) ¿Qué tipo es más preciso, float o double? ¿Por qué?\nd) En una aplicación bancaria que maneja dinero, ¿cuál preferirías? ¿O existiría una mejor alternativa?\ne) ¿Cómo compararías correctamente dos double que deberían ser iguales?`,
    hint: "Los números de punto flotante siguen el estándar IEEE 754 y no pueden representar exactamente todos los decimales. Double tiene 15-17 dígitos significativos, float solo 6-9. Para dinero en producción se usa BigDecimal. Para comparar doubles: Math.abs(a - b) < 0.000001 en vez de a == b."
  },
  {
    titulo: "Diseño de variables para un sistema de alumnos",
    nivel: "Avanzado",
    tema: "Aplicación integrada",
    enunciado: `Diseñá y declará todas las variables Java necesarias para representar los datos de un alumno y sus 3 notas parciales. El sistema deberá eventualmente:\n\n· Guardar nombre, apellido, legajo (formato "2026-XXX") y edad.\n· Guardar las 3 notas (escala 0–10, con decimales).\n· Calcular y guardar el promedio.\n· Guardar el resultado final como String: "Aprobado", "En recuperación" o "Desaprobado".\n· Mostrar un resumen.\n\nTarea: escribí únicamente las declaraciones de variables con valores de ejemplo (hardcodeados, sin estructuras de control). Calculá el promedio con una sola expresión aritmética. Para el resultado final, asigná el String manualmente según los valores que elegiste.\n\n¿Qué tipos usaste y por qué?`,
    hint: "El legajo es String no numérico. Las notas admiten decimales → double. El promedio = (nota1 + nota2 + nota3) / 3.0 — el 3.0 fuerza división real. El resultado es un String asignado directamente: String resultado = \"Aprobado\"; según el valor del promedio que calculaste. Ninguna instrucción requiere if ni bucles."
  }

];

// ── ESTADO ────────────────────────────────────────────────

let completados = {};
let respuestas = {};

try {
  const sc = localStorage.getItem('td_completados');
  if (sc) completados = JSON.parse(sc);
  const sr = localStorage.getItem('td_respuestas');
  if (sr) respuestas = JSON.parse(sr);
} catch (e) { }

function saveState() {
  try {
    localStorage.setItem('td_completados', JSON.stringify(completados));
    localStorage.setItem('td_respuestas', JSON.stringify(respuestas));
  } catch (e) { }
}

// ── ESTADÍSTICAS ──────────────────────────────────────────

function updateStats() {
  const total = EXERCISES.length;
  const done = Object.values(completados).filter(Boolean).length;
  document.getElementById('cnt-total').textContent = total;
  document.getElementById('cnt-done').textContent = done;
  document.getElementById('cnt-pct').textContent = Math.round(done / total * 100) + '%';
  document.getElementById('prog-fill').style.width = Math.round(done / total * 100) + '%';
}

// ── RENDER EJERCICIOS ─────────────────────────────────────

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

// ── NAVEGACIÓN DE SECCIONES ───────────────────────────────

function showSection(id, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (btn) btn.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

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
<span class="kw">int</span>    nombreAlumno  <span class="op">=</span> <span class="nm">0</span>;      <span class="cm">// ✓ camelCase</span>
<span class="kw">double</span> precioFinal   <span class="op">=</span> <span class="nm">0.0</span>;    <span class="cm">// ✓ camelCase</span>
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
renderEjercicios('todos');
