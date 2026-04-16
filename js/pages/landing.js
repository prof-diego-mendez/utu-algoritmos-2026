
// Display overall progress on landing page
      (function displayProgress() {
        // Wait for StateManager to initialize
        setTimeout(() => {
          const report = StateManager.getProgressReport();
          const totalCompleted = report.overall.totalCompleted;
          const totalExercises = 60; // 20 per module × 3 modules

          // Update stats with animation
          animateValue('stat-total', 0, totalCompleted, 1000);
          animateValue('stat-percentage', 0, Math.round((totalCompleted / totalExercises) * 100), 1000, '%');

          // Update on state changes
          StateManager.subscribe((state) => {
            const newReport = StateManager.getProgressReport();
            const newTotal = newReport.overall.totalCompleted;
            animateValue('stat-total', totalCompleted, newTotal, 500);
            animateValue('stat-percentage',
              Math.round((totalCompleted / totalExercises) * 100),
              Math.round((newTotal / totalExercises) * 100),
              500, '%'
            );
          });
        }, 100);
      })();

      // Animate number counter
      function animateValue(elementId, start, end, duration, suffix = '') {
        const element = document.getElementById(elementId);
        if (!element) return;

        const range = end - start;
        const startTime = performance.now();

        function update(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Easing function (ease-out-cubic)
          const ease = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(start + (range * ease));

          element.textContent = current + suffix;

          if (progress < 1) {
            requestAnimationFrame(update);
          }
        }

        requestAnimationFrame(update);
      }

// Mobile menu toggle for landing page
      (function initMobileMenu() {
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const mobileNav = document.getElementById('mobile-nav');
        const navOverlay = document.getElementById('nav-overlay');
        const navClose = document.getElementById('mobile-nav-close');
        const navLinks = mobileNav?.querySelectorAll('.nav-tab-link');

        function openMenu() {
          hamburgerBtn.classList.add('active');
          hamburgerBtn.setAttribute('aria-expanded', 'true');
          mobileNav.classList.add('active');
          navOverlay.classList.add('active');
          navOverlay.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
          hamburgerBtn.classList.remove('active');
          hamburgerBtn.setAttribute('aria-expanded', 'false');
          mobileNav.classList.remove('active');
          navOverlay.classList.remove('active');
          navOverlay.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }

        hamburgerBtn?.addEventListener('click', () => {
          const isOpen = hamburgerBtn.classList.contains('active');
          isOpen ? closeMenu() : openMenu();
        });

        navOverlay?.addEventListener('click', closeMenu);
        navClose?.addEventListener('click', closeMenu);
        navLinks?.forEach(link => link.addEventListener('click', closeMenu));

        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && mobileNav?.classList.contains('active')) {
            closeMenu();
            hamburgerBtn?.focus();
          }
        });
      })();
