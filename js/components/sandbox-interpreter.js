// ── SANDBOX INTERPRETER (FULL PSeInt-STYLE) ──
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
                    i = currentLoop.startLine;
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
                   i = currentLoop.startLine;
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
    setupSandboxEditor('sandbox-code', 'sandbox-output');
    setupSandboxEditor('modal-sandbox-code', 'modal-sandbox-output');
