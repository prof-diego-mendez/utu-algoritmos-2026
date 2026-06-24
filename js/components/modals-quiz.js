// ── MODAL LOGIC ──
    function openModal() {
      const modal = document.getElementById('sandbox-modal');
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      const modal = document.getElementById('sandbox-modal');
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    window.addEventListener('click', (e) => {
      const modal = document.getElementById('sandbox-modal');
      if (e.target === modal) closeModal();
    });

function answerQuiz(btn) {
      var isCorrect = btn.getAttribute('data-correct') === 'true';
      var buttons = document.querySelectorAll('.quiz-options button');
      var feedback = document.getElementById('quiz-feedback');
      buttons.forEach(function (b) { b.disabled = true; });
      if (isCorrect) {
        btn.classList.add('correct');
        feedback.textContent = 'Correcto. Un algoritmo siempre debe ser finito: si no tiene fin, no es un algoritmo válido.';
        feedback.className = 'quiz-feedback correct';
      } else {
        btn.classList.add('incorrect');
        buttons[1].classList.add('reveal-correct');
        feedback.textContent = 'No es correcto. La opción que NO es propiedad de un algoritmo es que pueda repetirse infinitamente — eso precisamente lo invalida.';
        feedback.className = 'quiz-feedback incorrect';
      }
    }
