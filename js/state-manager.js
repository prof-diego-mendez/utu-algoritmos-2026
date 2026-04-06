/**
 * ============================================================
 * State Manager - Shared State Management System
 * ============================================================
 * Centralized localStorage management for unified progress tracking
 * across all modules (Algoritmos, Variables, Java Types)
 * 
 * Usage:
 *   StateManager.init()                    // Initialize on page load
 *   StateManager.setExercise(module, id)   // Mark exercise as complete
 *   StateManager.getProgress()             // Get overall progress
 *   StateManager.subscribe(callback)       // Listen for changes
 * ============================================================ */

const StateManager = (function() {
  // ── CONFIGURATION ────────────────────────────────────────
  
  const STORAGE_KEY = 'programacion_i_state';
  const VERSION = '1.0.0';
  
  // Module identifiers
  const MODULES = {
    ALGORITMOS: 'algoritmos',
    VARIABLES: 'variables',
    JAVA: 'java'
  };

  // ── STATE STRUCTURE ─────────────────────────────────────
  
  let state = {
    version: VERSION,
    lastUpdated: null,
    modules: {
      [MODULES.ALGORITMOS]: {
        completed: {},    // { exerciseIndex: true/false }
        answers: {},      // { exerciseIndex: "user answer text" }
        lastAccessed: null
      },
      [MODULES.VARIABLES]: {
        completed: {},
        answers: {},
        lastAccessed: null
      },
      [MODULES.JAVA]: {
        completed: {},
        answers: {},
        lastAccessed: null
      }
    }
  };

  // ── SUBSCRIPTION SYSTEM ─────────────────────────────────
  
  let subscribers = [];

  function notifySubscribers() {
    subscribers.forEach(callback => {
      try {
        callback(state);
      } catch (error) {
        console.error('State subscriber error:', error);
      }
    });
  }

  // ── PERSISTENCE ─────────────────────────────────────────
  
  function save() {
    try {
      state.lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      notifySubscribers();
      return true;
    } catch (error) {
      console.error('Failed to save state:', error);
      return false;
    }
  }

  function load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with default state to ensure structure
        state = { ...state, ...parsed };
        
        // Migrate old localStorage keys if they exist
        migrateOldData();
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to load state:', error);
      return false;
    }
  }

  // ── MIGRATION FROM OLD SYSTEM ───────────────────────────
  
  function migrateOldData() {
    let migrated = false;
    
    // Migrate Algoritmos old keys
    try {
      const algoCompleted = localStorage.getItem('algo_completados');
      const algoRespuestas = localStorage.getItem('algo_respuestas');
      
      if (algoCompleted) {
        const completed = JSON.parse(algoCompleted);
        Object.entries(completed).forEach(([index, value]) => {
          if (value) {
            state.modules[MODULES.ALGORITMOS].completed[index] = true;
          }
        });
        localStorage.removeItem('algo_completados');
        migrated = true;
      }
      
      if (algoRespuestas) {
        const answers = JSON.parse(algoRespuestas);
        state.modules[MODULES.ALGORITMOS].answers = answers;
        localStorage.removeItem('algo_respuestas');
        migrated = true;
      }
    } catch (e) {
      console.warn('Could not migrate algoritmos data:', e);
    }
    
    // Migrate Java Types old keys
    try {
      const tdCompleted = localStorage.getItem('td_completados');
      const tdRespuestas = localStorage.getItem('td_respuestas');
      
      if (tdCompleted) {
        const completed = JSON.parse(tdCompleted);
        Object.entries(completed).forEach(([index, value]) => {
          if (value) {
            state.modules[MODULES.JAVA].completed[index] = true;
          }
        });
        localStorage.removeItem('td_completados');
        migrated = true;
      }
      
      if (tdRespuestas) {
        const answers = JSON.parse(tdRespuestas);
        state.modules[MODULES.JAVA].answers = answers;
        localStorage.removeItem('td_respuestas');
        migrated = true;
      }
    } catch (e) {
      console.warn('Could not migrate tipos-de-datos data:', e);
    }
    
    if (migrated) {
      console.log('✓ Migrated old localStorage data to unified state');
      save();
    }
  }

  // ── PUBLIC API ──────────────────────────────────────────
  
  /**
   * Initialize the state manager
   * Call this on every page load
   */
  function init() {
    load();
    console.log('✓ State Manager initialized');
    return state;
  }

  /**
   * Get current state
   */
  function getState() {
    return state;
  }

  /**
   * Mark an exercise as completed
   * @param {string} module - Module ID (algoritmos, variables, java)
   * @param {number|string} exerciseId - Exercise index/ID
   * @param {boolean} completed - Completion status
   */
  function setExercise(module, exerciseId, completed = true) {
    const moduleId = MODULES[module.toUpperCase()];
    if (!moduleId || !state.modules[moduleId]) {
      console.error('Invalid module:', module);
      return false;
    }
    
    state.modules[moduleId].completed[exerciseId] = completed;
    state.modules[moduleId].lastAccessed = new Date().toISOString();
    return save();
  }

  /**
   * Save an exercise answer
   * @param {string} module - Module ID
   * @param {number|string} exerciseId - Exercise index/ID
   * @param {string} answer - User's answer text
   */
  function setAnswer(module, exerciseId, answer) {
    const moduleId = MODULES[module.toUpperCase()];
    if (!moduleId || !state.modules[moduleId]) {
      console.error('Invalid module:', module);
      return false;
    }
    
    state.modules[moduleId].answers[exerciseId] = answer;
    state.modules[moduleId].lastAccessed = new Date().toISOString();
    return save();
  }

  /**
   * Get exercise completion status
   * @param {string} module - Module ID
   * @param {number|string} exerciseId - Exercise index/ID
   */
  function getExercise(module, exerciseId) {
    const moduleId = MODULES[module.toUpperCase()];
    if (!moduleId || !state.modules[moduleId]) {
      return null;
    }
    
    return {
      completed: !!state.modules[moduleId].completed[exerciseId],
      answer: state.modules[moduleId].answers[exerciseId] || null
    };
  }

  /**
   * Get progress for a specific module
   * @param {string} module - Module ID
   * @param {number} totalExercises - Total exercises in module
   */
  function getModuleProgress(module, totalExercises) {
    const moduleId = MODULES[module.toUpperCase()];
    if (!moduleId || !state.modules[moduleId]) {
      return { completed: 0, total: totalExercises, percentage: 0 };
    }
    
    const completed = Object.values(state.modules[moduleId].completed)
      .filter(Boolean).length;
    
    return {
      completed,
      total: totalExercises,
      percentage: totalExercises > 0 
        ? Math.round((completed / totalExercises) * 100) 
        : 0
    };
  }

  /**
   * Get overall progress across all modules
   */
  function getOverallProgress() {
    let totalCompleted = 0;
    let totalExercises = 0;
    
    Object.values(state.modules).forEach(module => {
      const completed = Object.values(module.completed).filter(Boolean).length;
      totalCompleted += completed;
      // We don't know total exercises per module from state alone
      // This should be called with module totals as parameters
    });
    
    return {
      completed: totalCompleted,
      lastUpdated: state.lastUpdated
    };
  }

  /**
   * Get detailed progress report
   */
  function getProgressReport() {
    return {
      algoritmos: {
        completed: Object.values(state.modules.algoritmos.completed).filter(Boolean).length,
        answers: Object.keys(state.modules.algoritmos.answers).length,
        lastAccessed: state.modules.algoritmos.lastAccessed
      },
      variables: {
        completed: Object.values(state.modules.variables.completed).filter(Boolean).length,
        answers: Object.keys(state.modules.variables.answers).length,
        lastAccessed: state.modules.variables.lastAccessed
      },
      java: {
        completed: Object.values(state.modules.java.completed).filter(Boolean).length,
        answers: Object.keys(state.modules.java.answers).length,
        lastAccessed: state.modules.java.lastAccessed
      },
      overall: {
        totalCompleted: Object.values(state.modules).reduce((sum, m) => 
          sum + Object.values(m.completed).filter(Boolean).length, 0
        ),
        lastUpdated: state.lastUpdated
      }
    };
  }

  /**
   * Subscribe to state changes
   * @param {function} callback - Function to call when state changes
   * @returns {function} Unsubscribe function
   */
  function subscribe(callback) {
    subscribers.push(callback);
    // Return unsubscribe function
    return () => {
      subscribers = subscribers.filter(sub => sub !== callback);
    };
  }

  /**
   * Clear all state (useful for testing)
   */
  function clear() {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }

  /**
   * Export state as JSON (for backup)
   */
  function exportState() {
    return JSON.stringify(state, null, 2);
  }

  /**
   * Import state from JSON (for restore)
   */
  function importState(jsonString) {
    try {
      const imported = JSON.parse(jsonString);
      if (imported.version) {
        state = imported;
        save();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import state:', error);
      return false;
    }
  }

  // ── RETURN PUBLIC API ───────────────────────────────────
  
  return {
    init,
    getState,
    setExercise,
    setAnswer,
    getExercise,
    getModuleProgress,
    getOverallProgress,
    getProgressReport,
    subscribe,
    clear,
    exportState,
    importState,
    MODULES
  };
})();

// Auto-initialize when script loads
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    StateManager.init();
  });
}
