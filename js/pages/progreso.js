
// Update dashboard with progress data
    function updateDashboard() {
      const report = StateManager.getProgressReport();
      
      // Overall stats
      const totalCompleted = report.overall.totalCompleted;
      const totalExercises = 60;
      const percentage = Math.round((totalCompleted / totalExercises) * 100);
      
      // Animate values
      animateValue('overall-percentage', 0, percentage, 1000, '%');
      animateValue('total-completed', 0, totalCompleted, 1000);
      document.getElementById('overall-bar').style.width = percentage + '%';
      
      // Count total answers
      const totalAnswers = report.algoritmos.answers + report.variables.answers + report.java.answers;
      animateValue('total-answers', 0, totalAnswers, 1000);
      
      // Module stats
      updateModule('algo', report.algoritmos);
      updateModule('variables', report.variables);
      updateModule('java', report.java);
    }

    function updateModule(prefix, data) {
      const percentage = Math.round((data.completed / 20) * 100);
      animateValue(prefix + '-completed', 0, data.completed, 1000);
      document.getElementById(prefix + '-bar').style.width = percentage + '%';
      document.getElementById(prefix + '-percentage').textContent = percentage + '%';
    }

    function animateValue(elementId, start, end, duration, suffix = '') {
      const element = document.getElementById(elementId);
      if (!element) return;
      
      const range = end - start;
      const startTime = performance.now();
      
      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (range * ease));
        
        element.textContent = current + suffix;
        
        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }
      
      requestAnimationFrame(update);
    }

    function resetProgress() {
      if (confirm('¿Estás seguro de que querés reiniciar todo tu progreso? Esta acción no se puede deshacer.')) {
        StateManager.clear();
      }
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(updateDashboard, 100);
      
      // Subscribe to updates
      StateManager.subscribe(updateDashboard);
    });
