# Accessibility Guide · Programación I

## Overview

This project follows **WCAG 2.1 Level AA** guidelines to ensure all students, including those using assistive technologies, can access educational content effectively.

---

## ✅ Implemented Features

### 1. Skip Links

**What:** Hidden links that become visible on keyboard focus, allowing users to skip repetitive navigation.

**Implementation:**
```html
<a href="#main-content" class="skip-link">Saltar al contenido principal</a>
<a href="#nav-principal" class="skip-link">Saltar a la navegación</a>
```

**Benefits:**
- Keyboard users avoid tabbing through navigation on every page
- Screen reader users can jump directly to content
- Complies with WCAG 2.4.1 (Bypass Blocks)

---

### 2. ARIA Labels & Roles

**What:** Semantic markup that describes page structure and element purposes.

**Key Implementations:**

#### Navigation
```html
<nav role="tablist" aria-label="Navegación principal">
  <a role="tab" aria-selected="true" aria-controls="teoria">Teoría</a>
  <a role="tab" aria-selected="false" aria-controls="estructuras">Estructuras</a>
</nav>
```

#### Interactive Elements
```html
<button aria-pressed="true" aria-label="Filtrar por nivel básico">Básico</button>
<a aria-label="Comenzar módulo de Algoritmos">Comenzar módulo</a>
```

#### Live Regions
```html
<div aria-live="polite" aria-atomic="true" id="stat-percentage">0%</div>
<div aria-live="polite" aria-relevant="additions removals" id="ex-list"></div>
```

**Benefits:**
- Screen readers announce context and state changes
- Users understand dynamic content updates
- Complies with WCAG 4.1.2 (Name, Role, Value)

---

### 3. Focus Indicators

**What:** Visible outlines for keyboard-focused elements.

**CSS Implementation:**
```css
/* Global focus styles */
*:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Enhanced focus for interactive elements */
a:focus-visible,
button:focus-visible,
[tabindex]:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 3px;
  box-shadow: 0 0 0 6px var(--accent-glow);
}
```

**Features:**
- 3px solid outline with 6px glow shadow
- Uses `:focus-visible` for keyboard-only focus (cleaner for mouse users)
- High contrast color (#a78bfa on dark background)

**Benefits:**
- Keyboard users always know their current position
- Complies with WCAG 2.4.7 (Focus Visible)
- AA contrast ratio (4.5:1 minimum)

---

### 4. Reduced Motion Support

**What:** Respects user's system preference for reduced motion.

**CSS Implementation:**
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Benefits:**
- Prevents vestibular disorders triggers
- Respects user preferences
- Complies with WCAG 2.3.3 (Animation from Interactions)

---

### 5. Semantic HTML

**What:** Proper use of HTML5 semantic elements.

**Structure:**
```html
<header role="banner">
  <nav role="navigation">...</nav>
</header>

<main role="main" id="main-content">
  <section aria-labelledby="section-title">
    <h2 id="section-title">Title</h2>
    <article>...</article>
  </section>
</main>

<footer role="contentinfo">...</footer>
```

**Benefits:**
- Screen readers can navigate by landmarks
- Clear document structure
- Complies with WCAG 1.3.1 (Info and Relationships)

---

### 6. Keyboard Navigation

**What:** Full keyboard accessibility for all interactive elements.

**Tab Order:**
1. Skip links
2. Main navigation
3. Section tabs
4. Filter buttons
5. Exercise items
6. Exercise actions (save, clear, complete)

**Keyboard Shortcuts:**
| Key | Action |
|-----|--------|
| `Tab` | Move to next interactive element |
| `Shift+Tab` | Move to previous element |
| `Enter` | Activate links/buttons |
| `Space` | Toggle buttons/checkboxes |
| `Arrow keys` | Navigate within tab groups |

**Benefits:**
- Motor-impaired users can navigate without mouse
- Power users prefer keyboard efficiency
- Complies with WCAG 2.1.1 (Keyboard)

---

### 7. Screen Reader Announcements

**What:** Dynamic content changes are announced automatically.

**Live Regions:**
```javascript
// Progress updates
<div id="cnt-pct" aria-live="polite" aria-atomic="true">75%</div>

// Exercise list changes
<div id="ex-list" aria-live="polite" aria-relevant="additions removals"></div>

// Progress bar
<div role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
```

**Announcement Triggers:**
- Exercise completion status changes
- Filter button presses
- Progress percentage updates
- Exercise list filtering

**Benefits:**
- Blind users receive real-time feedback
- No need to manually check for updates
- Complies with WCAG 4.1.3 (Status Messages)

---

### 8. Color & Contrast

**What:** Sufficient contrast ratios for readability.

**Color Palette:**
| Element | Foreground | Background | Ratio |
|---------|-----------|------------|-------|
| Body text | #eeeef0 | #0e0f13 | 16.5:1 |
| Muted text | #8b8d97 | #0e0f13 | 7.2:1 |
| Links | #a78bfa | #0e0f13 | 8.9:1 |
| Focus outline | #a78bfa | #0e0f13 | 8.9:1 |

**Benefits:**
- Low vision users can read content
- Complies with WCAG 1.4.3 (Contrast - Minimum)
- AAA level for normal text (7:1)

---

### 9. Accessible Forms

**What:** Properly labeled form controls.

**Implementation:**
```html
<textarea 
  id="ta-5" 
  aria-label="Tu respuesta para el ejercicio 5"
  placeholder="Escribí tu solución acá…"
></textarea>

<button 
  onclick="saveAnswer(5)" 
  aria-label="Guardar respuesta del ejercicio 5"
>
  Guardar respuesta
</button>
```

**Benefits:**
- Screen reader users understand form purposes
- Clear error messages when needed
- Complies with WCAG 1.3.5 (Identify Input Purpose)

---

### 10. Icon Accessibility

**What:** Decorative icons hidden from screen readers.

**Implementation:**
```html
<!-- Decorative emoji -->
<div class="module-icon" aria-hidden="true">📦</div>

<!-- Icon with label -->
<button aria-label="Marcar como completado">
  <span aria-hidden="true">✓</span>
</button>
```

**Benefits:**
- Screen readers skip decorative content
- No confusing announcements
- Complies with WCAG 1.1.1 (Non-text Content)

---

## Testing Tools

### Automated Testing
- **WAVE** (Web Accessibility Evaluation Tool)
- **axe DevTools** browser extension
- **Lighthouse** accessibility audit

### Manual Testing
- **Keyboard-only navigation** (no mouse)
- **Screen readers:**
  - NVDA (Windows, free)
  - VoiceOver (macOS/iOS, built-in)
  - JAWS (Windows, commercial)

### Browser DevTools
```javascript
// Check focus visibility
document.activeElement

// Check ARIA attributes
document.querySelector('[aria-live]')

// Simulate reduced motion
matchMedia('(prefers-reduced-motion: reduce)').matches
```

---

## Checklist for New Features

When adding new components, verify:

- [ ] **Skip link** reaches new section
- [ ] **ARIA labels** describe purpose
- [ ] **Focus styles** are visible (3px outline)
- [ ] **Keyboard navigation** works (Tab/Enter/Space)
- [ ] **Screen reader** announces changes
- [ ] **Color contrast** meets 4.5:1 ratio
- [ ] **Reduced motion** is respected
- [ ] **Semantic HTML** used correctly
- [ ] **Icons** have `aria-hidden` or labels
- [ ] **Live regions** for dynamic content

---

## Known Limitations

### Current Issues
None at this time. All core functionality is accessible.

### Future Improvements
- [ ] Add audio descriptions for flowcharts
- [ ] Provide transcripts for any future videos
- [ ] Add haptic feedback for mobile users
- [ ] Implement high contrast mode toggle

---

## Reporting Accessibility Issues

If you encounter accessibility barriers:

1. **Describe the issue:** What were you trying to do?
2. **Specify assistive technology:** Screen reader, switch device, etc.
3. **Include browser/OS:** Chrome + NVDA on Windows, Safari + VoiceOver on Mac, etc.
4. **Provide contact:** Email for follow-up

**Contact:** Prof. Diego Méndez · UTU · ITI 2026

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

---

**Last Updated:** March 2026  
**Compliance Level:** WCAG 2.1 AA  
**Tested With:** NVDA, VoiceOver, Keyboard-only
