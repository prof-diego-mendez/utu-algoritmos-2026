# Loading States & Toast Notifications Guide

## Overview

The project now includes a comprehensive feedback system for async operations and user actions, providing visual feedback through **toast notifications** and **loading indicators**.

---

## Components

### 1. Toast Notifications

Toast notifications provide feedback for user actions without interrupting workflow.

#### Features
- **4 variants:** success, error, warning, info
- **Auto-dismiss:** Disappears after 4 seconds (configurable)
- **Stackable:** Up to 3 toasts visible at once
- **Interactive:** Pause on hover, manual close button
- **Accessible:** ARIA live regions, keyboard accessible
- **Animated:** Smooth slide-in/out transitions

#### Usage

```javascript
// Basic usage
Toast.show('Message text');

// With title
Toast.show('Operation completed', 'Success');

// With type (success, error, warning, info)
Toast.show('File saved successfully', 'Guardado', 'success');

// Custom duration (in milliseconds)
Toast.show('Temporary message', 'Info', 'info', 2000);
```

#### Convenience Methods

```javascript
// Success toast (green)
Toast.success('Response saved', 'Saved');

// Error toast (red)
Toast.error('Invalid input', 'Error');

// Warning toast (amber)
Toast.warning('Please fill all fields', 'Required');

// Info toast (blue)
Toast.info('Processing...', 'Info');
```

#### Examples

```javascript
// After saving exercise
function saveAnswer(idx) {
  StateManager.setAnswer(MODULE_NAME, idx, answer);
  Toast.success('Tu respuesta se guardó automáticamente', 'Respuesta guardada');
}

// After completing exercise
function toggleDone(idx) {
  StateManager.setExercise(MODULE_NAME, idx, true);
  Toast.success('¡Seguí así!', 'Ejercicio completado');
}

// On validation error
if (!answer) {
  Toast.warning('Escribí una respuesta antes de guardar', 'Respuesta vacía');
  return;
}

// On code execution error
if (error) {
  Toast.error(error, 'Error en el código');
}
```

---

### 2. Loading Spinner

Inline loading indicator for small operations.

#### Variants

```html
<!-- Standard (20px) -->
<div class="spinner"></div>

<!-- Small (16px) -->
<div class="spinner spinner-sm"></div>

<!-- Large (32px) -->
<div class="spinner spinner-lg"></div>
```

#### Usage in JavaScript

```javascript
// Show loading in container
container.innerHTML = `
  <div style="display:flex;align-items:center;gap:10px;">
    <div class="spinner spinner-sm"></div>
    <span>Loading...</span>
  </div>
`;
```

---

### 3. Loading Overlay

Full-screen loading overlay for major operations.

#### Usage

```javascript
// Show overlay
Loading.show('Saving progress...');

// Hide overlay
Loading.hide();

// Show with custom text
Loading.show('Processing your answer...');
```

#### Features
- **Stackable:** Call show() multiple times, must call hide() same number
- **Body scroll lock:** Prevents background scrolling
- **Backdrop blur:** Frosted glass effect
- **Accessible:** aria-hidden attribute management

---

### 4. Button Loading State

Shows spinner on button during async operations.

#### Usage

```javascript
const button = document.getElementById('save-btn');

// Start loading
Loading.showOnButton(button, true);

// Stop loading
Loading.showOnButton(button, false);
```

#### CSS Class

```css
.btn-loading {
  /* Text becomes transparent */
  /* Spinner appears in center */
  /* Button disabled */
}
```

---

### 5. Skeleton Loaders

Placeholder animations for content loading.

#### Variants

```html
<!-- Text line -->
<div class="skeleton skeleton-text"></div>

<!-- Title -->
<div class="skeleton skeleton-title"></div>

<!-- Card -->
<div class="skeleton skeleton-card"></div>
```

#### Usage

```javascript
// Show skeleton
Skeleton.show(container, 'text', 5); // 5 lines

// Hide skeleton
Skeleton.hide(container);
```

---

### 6. Sandbox Loader

Specialized loader for code execution feedback.

#### Usage

```javascript
// Show loading
SandboxLoader.show(outputContainer);

// Execution happens...

// Results replace loader automatically
```

#### Visual

```
⚪ Executing code...
```

---

## CSS Variables

Customize toast colors via CSS variables:

```css
:root {
  --success: #10b981;
  --success-bg: rgba(16, 185, 129, 0.15);
  
  --error: #ef4444;
  --error-bg: rgba(239, 68, 68, 0.15);
  
  --warning: #f59e0b;
  --warning-bg: rgba(245, 158, 11, 0.15);
  
  --info: #3b82f6;
  --info-bg: rgba(59, 130, 246, 0.15);
}
```

---

## Implementation Examples

### Example 1: Form Submission

```javascript
async function submitForm(data) {
  const submitBtn = document.getElementById('submit-btn');
  
  // Show button loading
  Loading.showOnButton(submitBtn, true);
  
  try {
    await api.submit(data);
    Toast.success('Form submitted successfully', 'Success');
  } catch (error) {
    Toast.error(error.message, 'Submission failed');
  } finally {
    Loading.showOnButton(submitBtn, false);
  }
}
```

### Example 2: Data Loading

```javascript
async function loadExercises() {
  // Show full-screen loading
  Loading.show('Loading exercises...');
  
  try {
    const response = await fetch('exercises.json');
    const exercises = await response.json();
    renderExercises(exercises);
    Toast.success(`${exercises.length} exercises loaded`, 'Loaded');
  } catch (error) {
    Toast.error('Failed to load exercises', 'Error');
  } finally {
    Loading.hide();
  }
}
```

### Example 3: Code Execution (Sandbox)

```javascript
function runCode() {
  const output = document.getElementById('output');
  
  // Show sandbox loader
  SandboxLoader.show(output);
  
  // Simulate execution delay
  setTimeout(() => {
    try {
      const result = execute(code);
      displayResult(result);
      Toast.success('Code executed successfully', 'Success');
    } catch (error) {
      Toast.error(error.message, 'Execution error');
    }
  }, 300);
}
```

### Example 4: Progressive Loading

```javascript
async function loadDashboard() {
  const container = document.getElementById('dashboard');
  
  // Show skeleton
  Skeleton.show(container, 'card', 3);
  
  try {
    const data = await fetchDashboardData();
    Skeleton.hide(container);
    renderDashboard(data);
  } catch (error) {
    Skeleton.hide(container);
    Toast.error('Failed to load dashboard', 'Error');
  }
}
```

---

## Best Practices

### ✅ Do's

1. **Show loading for operations > 200ms**
   ```javascript
   if (operationTime > 200) {
     Loading.show();
   }
   ```

2. **Provide context in toasts**
   ```javascript
   // ❌ Vague
   Toast.show('Done');
   
   // ✅ Specific
   Toast.success('Exercise 5 marked as complete', 'Completed');
   ```

3. **Use appropriate toast types**
   - Success: Operations completed successfully
   - Error: Something went wrong
   - Warning: User action needed
   - Info: General information

4. **Respect user attention**
   - Limit to 3 visible toasts
   - Auto-dismiss after reasonable time
   - Allow manual dismissal

5. **Combine loading + toast**
   ```javascript
   Loading.show('Saving...');
   api.save().then(() => {
     Loading.hide();
     Toast.success('Saved!', 'Success');
   });
   ```

### ❌ Don'ts

1. **Don't show loading for instant operations**
   ```javascript
   // ❌ Loading for < 100ms operation
   Loading.show();
   instantOperation(); // 50ms
   Loading.hide();
   
   // ✅ Only for async
   await asyncOperation();
   ```

2. **Don't stack too many toasts**
   ```javascript
   // ❌ Spam user
   for (let i = 0; i < 10; i++) {
     Toast.show(`Item ${i} saved`);
   }
   
   // ✅ Batch notification
   Toast.success('All 10 items saved', 'Batch complete');
   ```

3. **Don't block UI unnecessarily**
   ```javascript
   // ❌ Full overlay for minor operation
   Loading.show(); // Shows overlay
   minorOperation();
   
   // ✅ Button loading only
   Loading.showOnButton(button, true);
   ```

4. **Don't use error toasts for validation**
   ```javascript
   // ❌ Error toast for empty field
   if (!field) {
     Toast.error('Field required');
   }
   
   // ✅ Warning toast
   if (!field) {
     Toast.warning('Please fill this field', 'Required');
   }
   ```

---

## Accessibility

### ARIA Support

```html
<!-- Toast container -->
<div class="toast-container" 
     aria-live="polite" 
     role="status">
</div>

<!-- Individual toast -->
<div class="toast" role="alert">
  <div class="toast-icon" aria-hidden="true">...</div>
  <div class="toast-content">
    <div class="toast-title">Title</div>
    <div class="toast-message">Message</div>
  </div>
  <button class="toast-close" aria-label="Close notification">
    <svg aria-hidden="true">...</svg>
  </button>
</div>
```

### Keyboard Navigation

- **Tab:** Navigate to toast close button
- **Enter/Space:** Activate close button
- **Escape:** No action (toasts auto-dismiss)

### Screen Readers

- Toasts announced via `aria-live="polite"`
- Icons hidden with `aria-hidden="true"`
- Close buttons labeled with `aria-label`

---

## Performance

### Optimizations

1. **Lazy initialization:** Toast container created on first use
2. **CSS transitions:** Hardware-accelerated transforms
3. **Debounced operations:** Prevent rapid toast spam
4. **Memory management:** Removed toasts cleaned from DOM

### Metrics

| Operation | Duration |
|-----------|----------|
| Toast slide-in | 300ms |
| Toast slide-out | 300ms |
| Auto-dismiss | 4000ms (default) |
| Spinner rotation | 800ms/loop |
| Skeleton shimmer | 1500ms/cycle |

---

## Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| iOS Safari | 14+ | ✅ Full |
| Chrome Android | 90+ | ✅ Full |

---

## Troubleshooting

### Toasts not showing
**Check:** ui-utils.js loaded, container created, no JS errors

### Loading overlay stuck
**Solution:** Ensure show/hide calls are balanced
```javascript
Loading.show();
try {
  // operation
} finally {
  Loading.hide(); // Always call
}
```

### Spinner not animating
**Check:** CSS loaded, @keyframes spin defined

### Toast not auto-dismissing
**Check:** Duration > 0, not in infinite mode

---

## File Structure

```
01 algoritmos/
├── ui-utils.js          # Toast & Loading utilities
├── algoritmos.css       # Toast & loading styles
├── variables.html       # Uses SandboxLoader
└── LOADING-STATES-GUIDE.md  # This file
```

---

**Last Updated:** March 2026  
**Maintained by:** Prof. Diego Méndez · UTU · ITI 2026
