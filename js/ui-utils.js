/**
 * ============================================================
 * UI Utilities - Toast Notifications & Loading States
 * ============================================================
 * Provides visual feedback for async operations and user actions
 * 
 * Usage:
 *   Toast.show('Success!', 'Operation completed', 'success')
 *   Loading.show('Loading...')
 *   Loading.hide()
 * ============================================================ */

const Toast = (function() {
  let container = null;
  let toastQueue = [];
  const TOAST_LIMIT = 3;
  const DEFAULT_DURATION = 4000;

  // Icons for different toast types
  const icons = {
    success: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>`,
    error: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>`,
    info: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>`
  };

  function getContainer() {
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('role', 'status');
      document.body.appendChild(container);
    }
    return container;
  }

  function createToast(message, title, type, duration) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    
    toast.innerHTML = `
      <div class="toast-icon" aria-hidden="true">${icons[type]}</div>
      <div class="toast-content">
        ${title ? `<div class="toast-title">${title}</div>` : ''}
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Cerrar notificación">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

    // Close button handler
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => removeToast(toast));

    // Auto-remove after duration
    let timeoutId;
    if (duration > 0) {
      timeoutId = setTimeout(() => removeToast(toast), duration);
      toast.dataset.timeoutId = timeoutId;
    }

    // Pause on hover
    toast.addEventListener('mouseenter', () => {
      if (timeoutId) clearTimeout(timeoutId);
    });

    toast.addEventListener('mouseleave', () => {
      if (duration > 0) {
        timeoutId = setTimeout(() => removeToast(toast), 1000);
        toast.dataset.timeoutId = timeoutId;
      }
    });

    return toast;
  }

  function removeToast(toast) {
    if (!toast || !toast.parentNode) return;
    
    toast.classList.remove('show');
    toast.classList.add('hide');
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
      processQueue();
    }, 300);
  }

  function processQueue() {
    while (toastQueue.length > 0 && getContainer().children.length < TOAST_LIMIT) {
      const toastData = toastQueue.shift();
      showToastImmediately(toastData);
    }
  }

  function showToastImmediately({ message, title, type, duration }) {
    const toast = createToast(message, title, type, duration);
    const container = getContainer();
    container.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
  }

  function show(message, title = '', type = 'info', duration = DEFAULT_DURATION) {
    const toastData = { message, title, type, duration };
    
    if (getContainer().children.length < TOAST_LIMIT) {
      showToastImmediately(toastData);
    } else {
      toastQueue.push(toastData);
    }
  }

  // Convenience methods
  function success(message, title, duration) {
    show(message, title || 'Éxito', 'success', duration);
  }

  function error(message, title, duration) {
    show(message, title || 'Error', 'error', duration);
  }

  function warning(message, title, duration) {
    show(message, title || 'Advertencia', 'warning', duration);
  }

  function info(message, title, duration) {
    show(message, title || 'Información', 'info', duration);
  }

  // Clear all toasts
  function clearAll() {
    const container = getContainer();
    Array.from(container.children).forEach(toast => removeToast(toast));
    toastQueue = [];
  }

  return {
    show,
    success,
    error,
    warning,
    info,
    clearAll
  };
})();

/**
 * Loading State Manager
 */
const Loading = (function() {
  let overlay = null;
  let showCount = 0;

  function getOverlay() {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'loading-overlay';
      overlay.innerHTML = `
        <div class="spinner spinner-lg"></div>
        <div class="loading-overlay-text">Cargando...</div>
      `;
      document.body.appendChild(overlay);
    }
    return overlay;
  }

  function show(text = 'Cargando...') {
    const overlay = getOverlay();
    const textEl = overlay.querySelector('.loading-overlay-text');
    if (textEl) textEl.textContent = text || 'Cargando...';
    
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    showCount++;
  }

  function hide() {
    const overlay = getOverlay();
    showCount = Math.max(0, showCount - 1);
    
    if (showCount === 0) {
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  function isActive() {
    return showCount > 0;
  }

  // Show loading state on button
  function showOnButton(button, isLoading = true) {
    if (!button) return;
    
    if (isLoading) {
      button.classList.add('btn-loading');
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
    } else {
      button.classList.remove('btn-loading');
      button.disabled = false;
      button.setAttribute('aria-busy', 'false');
    }
  }

  return {
    show,
    hide,
    isActive,
    showOnButton
  };
})();

/**
 * Skeleton Loader Utilities
 */
const Skeleton = (function() {
  function show(container, type = 'text', count = 3) {
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
      const skeleton = document.createElement('div');
      skeleton.className = `skeleton skeleton-${type}`;
      container.appendChild(skeleton);
    }
  }

  function hide(container) {
    if (!container) return;
    const skeletons = container.querySelectorAll('.skeleton');
    skeletons.forEach(s => s.remove());
  }

  return {
    show,
    hide
  };
})();

/**
 * Sandbox Loading State (specific for variables.html sandbox)
 */
const SandboxLoader = (function() {
  function show(outputContainer) {
    if (!outputContainer) return;
    
    outputContainer.innerHTML = `
      <div class="out-line" style="display:flex;align-items:center;gap:10px;">
        <div class="spinner spinner-sm"></div>
        <span style="color:var(--muted);font-size:0.8rem;">Ejecutando código...</span>
      </div>
    `;
  }

  function hide(outputContainer) {
    // Handled by runSandbox function
  }

  return {
    show,
    hide
  };
})();

// Auto-initialize: Show toast container when needed
// No automatic initialization needed - lazy loaded

// Export for global use
window.Toast = Toast;
window.Loading = Loading;
window.Skeleton = Skeleton;
window.SandboxLoader = SandboxLoader;
