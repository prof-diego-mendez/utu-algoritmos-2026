# Typography Hierarchy Guide

## Overview

The typography system uses **multiple visual cues** beyond just font size to create clear hierarchy:
- **Color contrast** (white → light gray → muted gray)
- **Font weight** (300 → 800)
- **Letter spacing** (negative for headings, positive for small text)
- **Line height** (tight for headings, loose for body)
- **Spacing variations** (margins and padding)
- **Text shadows and effects** (subtle glows, gradients)

---

## Heading Hierarchy

### H1 - Hero Titles
```css
font-size: clamp(1.75rem, 5vw, 2.75rem)
font-weight: 800
line-height: 1.1
letter-spacing: -0.03em
color: Gradient (white → lavender)
text-shadow: Dual glow effect
```
**Use for:** Page titles, hero sections  
**Visual weight:** Maximum

### H2 - Section Headings
```css
font-size: 1.5rem
font-weight: 800
line-height: 1.3
letter-spacing: -0.02em
color: #ffffff (pure white)
border-bottom: 2px with gradient accent
margin: 3rem 0 1.5rem
text-shadow: Subtle glow
```
**Use for:** Major section breaks  
**Visual weight:** Very high  
**Special:** Gradient bar on left, bottom border

### H3 - Subsection Headings
```css
font-size: 1.15rem
font-weight: 700
line-height: 1.4
letter-spacing: -0.01em
color: #f5f5f7 (near white)
margin: 2rem 0 0.875rem
text-shadow: Light glow
```
**Use for:** Subsections within content  
**Visual weight:** High

### H4 - Minor Headings
```css
font-size: 1rem
font-weight: 600
line-height: 1.5
letter-spacing: 0em
color: #e5e5e7 (light gray)
margin: 1.5rem 0 0.75rem
```
**Use for:** Minor content divisions  
**Visual weight:** Medium-high

---

## Body Text Hierarchy

### Lead Paragraph (First in Section)
```css
font-size: 1.125rem
color: #c7c7cc (brighter gray)
line-height: 1.9
font-weight: 300
```
**Use for:** Opening paragraph after headings  
**Purpose:** Draws attention, sets context

### Standard Paragraph
```css
font-size: 1.0625rem
color: #b0b0b5 (medium gray)
line-height: 1.85
letter-spacing: 0.01em
font-weight: 300
margin-bottom: 1.25rem
```
**Use for:** General body content  
**Readability:** Optimized for long-form reading

### Emphasized Text
```css
/* Strong/Bold */
color: #ffffff
font-weight: 600
+ highlight background (accent glow)

/* Italic/Emphasis */
color: #c5c5ca
font-style: italic
font-weight: 400
```

---

## List Hierarchy

### List Items
```css
font-size: 1.0625rem
color: #b0b0b5
line-height: 1.85
margin-bottom: 0.625rem
padding-left: 0.5rem
font-weight: 300
```
**Bullet color:** var(--accent) - violet  
**Strong text:** #ffffff with weight 600

### Nested Lists
```css
font-size: 1rem
color: #a0a0a5 (darker gray)
```
**Purpose:** Visual subordination

---

## Special Text Elements

### Code Inline
```css
font-family: 'DM Mono', monospace
font-size: 0.875em
color: #e0d4fc (light lavender)
background: rgba(167, 139, 250, 0.12)
border: 1px solid rgba(167, 139, 250, 0.15)
padding: 0.125em 0.4em
letter-spacing: -0.02em
font-weight: 500
```

### Small Text
```css
font-size: 0.8125rem
color: #6b6d75 (dark gray)
letter-spacing: 0.02em
font-weight: 400
```
**Use for:** Captions, metadata, disclaimers

### Blockquotes
```css
border-left: 4px solid var(--accent)
background: var(--accent-glow)
padding: 1.25rem 1.5rem
color: #c4b5fd (lavender)
```

---

## Color Palette

| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| **Pure White** | `#ffffff` | Headings, emphasis |
| **Near White** | `#f5f5f7` | H3 headings |
| **Light Gray** | `#e5e5e7` | H4 headings |
| **Bright Gray** | `#c7c7cc` | Lead paragraphs |
| **Medium Gray** | `#b0b0b5` | Body text |
| **Dark Gray** | #a0a0a5 | Nested lists |
| **Muted** | `#8b8d97` | Secondary text |
| **Dark Muted** | `#6b6d75` | Small text |
| **Accent** | `var(--accent)` | Links, highlights |

---

## Spacing System

### Vertical Rhythm

```
H2 → H2:        4rem (64px)
H3 → H3:        2.5rem (40px)
H4 → H4:        2rem (32px)
P → P:          1.25rem (20px)
```

### Section Spacing

```css
.section > h2 { margin-top: 4rem; }
.section > h3 { margin-top: 2.5rem; }
.section > h4 { margin-top: 2rem; }
.section > p  { margin-top: 1.25rem; }
```

### Card Spacing

```css
padding: 1.5rem 1.75rem
margin-bottom: 1.5rem
```

---

## Utility Classes

### Size Utilities
```html
<span class="text-xs">Extra small (0.75rem)</span>
<span class="text-sm">Small (0.875rem)</span>
<span class="text-lg">Large (1.125rem)</span>
<span class="text-xl">Extra large (1.25rem)</span>
```

### Weight Utilities
```html
<span class="font-light">Light (300)</span>
<span class="font-normal">Normal (400)</span>
<span class="font-medium">Medium (500)</span>
<span class="font-semibold">Semibold (600)</span>
<span class="font-bold">Bold (700)</span>
<span class="font-extrabold">Extra bold (800)</span>
```

### Color Utilities
```html
<span class="text-muted">Muted gray</span>
<span class="text-default">Default text</span>
<span class="text-accent">Accent color</span>
<span class="text-white">Pure white</span>
```

---

## Best Practices

### ✅ Do's

1. **Use heading levels sequentially** (H2 → H3 → H4)
2. **Lead paragraphs** for section introductions
3. **Consistent spacing** maintains rhythm
4. **Strong text** for key terms (with highlight)
5. **Code styling** for technical terms

### ❌ Don'ts

1. Don't skip heading levels (H2 → H4)
2. Don't use bold for entire paragraphs
3. Don't mix font families arbitrarily
4. Don't reduce line-height below 1.1 for headings
5. Don't use pure white for body text (eye strain)

---

## Accessibility

### Contrast Ratios

| Text Type | Background | Ratio | WCAG Level |
|-----------|------------|-------|------------|
| Headings (#fff) | #0e0f13 | 16.5:1 | AAA ✅ |
| Body (#b0b0b5) | #0e0f13 | 7.2:1 | AAA ✅ |
| Muted (#8b8d97) | #0e0f13 | 4.6:1 | AA ✅ |

### Readability Features

- **Letter spacing:** Negative for headings (-0.03em to 0)
- **Line height:** 1.1 (headings) to 1.9 (lead paragraphs)
- **Max line length:** ~75 characters (860px container)
- **Font size:** Minimum 0.8125rem (13px)

---

## Responsive Typography

### Fluid Sizing

```css
/* Hero titles scale with viewport */
font-size: clamp(1.75rem, 5vw, 2.75rem);

/* Body text remains readable */
font-size: clamp(1rem, 2.5vw, 1.125rem);
```

### Mobile Adjustments

```css
@media (max-width: 640px) {
  h2 { font-size: 1.25rem; }
  h3 { font-size: 1.0625rem; }
  .hero { padding: 2rem 1.5rem; }
}
```

---

## Examples

### Section Example
```html
<section>
  <h2>Título de Sección</h2>
  <p class="lead">Párrafo introductorio más grande y brillante.</p>
  
  <h3>Subsección</h3>
  <p>Contenido normal con <strong>énfasis resaltado</strong>.</p>
  
  <ul>
    <li>Item de lista</li>
    <li>Otro item con <strong>negrita</strong></li>
  </ul>
  
  <div class="card">
    <h3>Tarjeta</h3>
    <p>Contenido dentro de tarjeta con espaciado reducido.</p>
  </div>
</section>
```

### Visual Result
```
═══ Título de Sección ═══════════════════
  Párrafo introductorio más grande y brillante.

  ┌─ Subsección ──────────────────────────┐
  │ Contenido normal con énfasis resaltado│
  │                                        │
  │ • Item de lista                        │
  │ • Otro item con negrita                │
  └────────────────────────────────────────┘
  
  ┌─────────── Tarjeta ───────────────────┐
  │ │ Contenido dentro de tarjeta         │
  │ │ con espaciado reducido.             │
  └────────────────────────────────────────┘
```

---

## Maintenance

When adding new components:

1. **Match existing hierarchy** (use appropriate heading level)
2. **Check color contrast** (minimum 4.5:1 for AA)
3. **Maintain vertical rhythm** (use established spacing)
4. **Test with screen readers** (proper heading structure)
5. **Verify mobile responsiveness** (fluid sizing works)

---

**Last Updated:** March 2026  
**Maintained by:** Prof. Diego Méndez · UTU · ITI 2026
