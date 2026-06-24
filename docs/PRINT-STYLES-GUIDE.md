# Print Styles Guide

## Overview

The project includes comprehensive print styles that allow students to print exercises, theory, and documentation with proper formatting, ink-efficient design, and professional layout.

---

## Features

### ✅ What's Included

1. **Ink-Saving Design** - Minimal backgrounds, optimized contrast
2. **Professional Typography** - Serif fonts for readability
3. **Page Break Control** - Prevents awkward breaks
4. **Element Hiding** - Removes non-essential UI elements
5. **Print Footer** - Attribution and print date
6. **Print Button** - Easy access to print dialog

---

## Print Button

### Location
- **Desktop:** Bottom-left corner (fixed position)
- **Mobile:** Hidden (use browser's print function)

### Appearance
```
┌────────────────┐
│ 🖨️  Imprimir   │
└────────────────┘
```

### Usage
```javascript
// Triggered by button click
<button class="print-btn" onclick="window.print()">
  Imprimir
</button>

// Or via keyboard shortcut
// Windows/Linux: Ctrl + P
// macOS: Cmd + P
```

---

## What Prints

### ✅ Included Elements

| Element | Print Style |
|---------|-------------|
| **Headings** | Bold, with borders (H2) |
| **Paragraphs** | Justified, 11pt, line-height 1.6 |
| **Code blocks** | Monospace, light gray background |
| **Cards** | White with borders |
| **Exercises** | Full content with badges |
| **Tables** | Full borders, alternating rows |
| **Lists** | Standard bullets/numbers |
| **Flow diagrams** | Simplified boxes |
| **Hero sections** | Light gray background |

---

## What Doesn't Print

### ❌ Hidden Elements

- Navigation (header, mobile, page)
- Hamburger menu
- Overlay backgrounds
- Filter buttons
- Exercise controls
- Work areas (answers)
- Hint boxes
- Check buttons
- Save/Clear buttons
- Sandbox/interpreter
- Progress bars
- Toast notifications
- Loading overlays
- Skip links
- Internal links

---

## Typography

### Font Changes

| Screen | Print |
|--------|-------|
| Roboto (sans-serif) | Georgia (serif) |
| Syne (display) | Georgia (bold) |
| DM Mono (code) | Courier New (code) |

### Font Sizes

| Element | Screen | Print |
|---------|--------|-------|
| H1 | clamp(1.75rem, 5vw, 2.75rem) | 24pt |
| H2 | 1.5rem | 18pt |
| H3 | 1.15rem | 14pt |
| Body | 1.0625rem | 11pt |
| Code | 0.875em | 9pt |
| Small | 0.8125rem | 9pt |

---

## Color Scheme

### Ink-Saving Colors

```css
/* Screen (dark theme) */
Background: #0e0f13 (dark)
Text: #eeeef0 (light)
Accent: #a78bfa (purple)

/* Print (light theme) */
Background: #ffffff (white)
Text: #000000 (black)
Borders: #cccccc (gray)
```

### Syntax Highlighting

| Element | Screen Color | Print Color |
|---------|--------------|-------------|
| Keywords | Purple (#c084fc) | Navy (#000080) |
| Functions | Teal (#34d399) | Green (#006600) |
| Comments | Gray (#52525b) | Gray (#666) |
| Numbers | Blue (#60a5fa) | Navy (#000080) |
| Strings | Teal (#34d399) | Green (#006600) |

---

## Page Layout

### Margins
```
Top:    1 inch (default browser)
Bottom: 1 inch (default browser)
Left:   1 inch (default browser)
Right:  1 inch (default browser)
```

### Page Breaks

```css
/* Avoid breaking inside these elements */
.card,
.code-block,
.ex-item,
table,
.hero {
  page-break-inside: avoid;
}

/* Start new page for each section */
.section:nth-child(n+2) {
  page-break-before: always;
}
```

---

## Exercise Printing

### What's Included

```
┌─────────────────────────────────────────┐
│ [1] Ejercicio: Título                   │
│     [Básico] [Secuencia]                │
│                                         │
│ Enunciado completo del ejercicio...     │
│ Múltiples párrafos con formato...       │
└─────────────────────────────────────────┘
```

### What's Excluded

- Answer textareas (students write on paper)
- Hint boxes (encourage problem-solving)
- Check buttons
- Save/Clear buttons
- Progress indicators

---

## Link Handling

### External Links
```html
<!-- Screen -->
<a href="https://example.com">Example</a>

<!-- Print -->
<a href="https://example.com">Example (https://example.com)</a>
```

### Internal Links
```html
<!-- Screen -->
<a href="#section">Section</a>

<!-- Print -->
<a href="#section">Section</a>
<!-- URL not shown for internal links -->
```

---

## Special Components

### Flow Diagrams

**Screen:**
```
┌─────┐   ┌──────────┐   ┌────────┐
│START│ → │ PROCESS  │ → │  END   │
└─────┘   └──────────┘   └────────┘
```

**Print:**
```
+-------+    +------------+    +--------+
| START | -> |  PROCESS   | -> |  END   |
+-------+    +------------+    +--------+
```

### Tables

**Print Style:**
```
┌──────────┬──────────┬──────────┐
│ Header 1 │ Header 2 │ Header 3 │
├──────────┼──────────┼──────────┤
│ Cell 1   │ Cell 2   │ Cell 3   │
├──────────┼──────────┼──────────┤
│ Cell 4   │ Cell 5   │ Cell 6   │
└──────────┴──────────┴──────────┘
```

### Cards

**Screen:** Dark background, colored borders  
**Print:** White background, gray borders

---

## Print Footer

### Content
```
---
Printed from Programación I - UTU ITI 2026
Prof. Diego Méndez
[Current Date]
```

### Position
- Bottom of last page
- Centered
- Separated by horizontal line
- Small font (9pt)

---

## Browser Print Settings

### Recommended Settings

| Setting | Value |
|---------|-------|
| **Paper Size** | A4 or Letter |
| **Orientation** | Portrait |
| **Margins** | Default (1 inch) |
| **Scale** | 100% |
| **Background Graphics** | OFF (saves ink) |
| **Headers and Footers** | OFF (we add our own) |

---

## Ink-Saving Tips

### Automatic Optimizations

1. **No dark backgrounds** - All backgrounds removed or lightened
2. **Minimal borders** - 1pt gray borders instead of thick colored
3. **Grayscale** - All colors converted to gray values
4. **No shadows** - Box shadows removed
5. **Simple bullets** - Standard bullets instead of custom icons

### Manual Tips for Students

1. **Print double-sided** - Saves paper
2. **Draft mode** - Use printer's draft quality
3. **Grayscale** - Even though we optimize, force grayscale
4. **Multiple pages per sheet** - 2 or 4 pages per sheet
5. **Select specific sections** - Print only what you need

---

## Use Cases

### Scenario 1: Print Exercises for Class

```
1. Navigate to ejercicios section
2. Click "Todos" filter (or specific level)
3. Click print button
4. Select pages: current section only
5. Print double-sided
```

**Result:** Clean exercise list with space for handwritten answers

---

### Scenario 2: Print Theory for Study

```
1. Navigate to teoría section
2. Click print button
3. Select "All pages"
4. Print with bookmarks
```

**Result:** Complete theory reference with clear hierarchy

---

### Scenario 3: Print Code Examples

```
1. Navigate to section with code
2. Click print button
3. Ensure "Background graphics" is OFF
4. Print
```

**Result:** Readable code with syntax highlighting preserved

---

## Accessibility

### Screen Reader Support

```html
<!-- Print button labeled -->
<button class="print-btn" aria-label="Imprimir esta página">

<!-- Print footer announced -->
<footer role="contentinfo">
  Printed from Programación I
</footer>
```

### Keyboard Navigation

- **Ctrl/Cmd + P:** Open print dialog
- **Tab:** Navigate to print button
- **Enter:** Activate print button

---

## Troubleshooting

### Issue: Backgrounds still printing
**Solution:** In print dialog, uncheck "Background graphics"

### Issue: Content cut off
**Solution:** Adjust scale to 90% or select "Fit to page"

### Issue: Too many pages
**Solution:** Print specific sections, use 2 pages per sheet

### Issue: Links showing URLs
**Solution:** This is intentional for external references

### Issue: Print button not visible
**Solution:** Use browser menu: File → Print or Ctrl/Cmd + P

---

## CSS Customization

### Override Print Styles

```css
@media print {
  /* Custom adjustments */
  body {
    font-size: 10pt; /* Smaller text */
  }
  
  .card {
    margin: 0.5em 0; /* Less spacing */
  }
  
  /* Hide specific element */
  .my-element {
    display: none !important;
  }
}
```

### Enable Cover Page

```css
/* Uncomment in algoritmos.css */
@media print {
  body:before {
    content: "Programación I\a Algoritmos y Fundamentos\a \a UTU - ITI 2026\a Prof. Diego Méndez";
    white-space: pre;
    text-align: center;
    font-size: 24pt;
    font-weight: bold;
    display: block;
    page-break-after: always;
    padding-top: 3in;
  }
}
```

---

## File Size

### Print CSS Impact

| File | Size | Print Styles |
|------|------|--------------|
| algoritmos.css | ~50KB | +8KB (16%) |

**Optimization:** All print styles in single `@media print` block

---

## Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| iOS Safari | 14+ | ✅ Full |

---

## Best Practices

### ✅ Do's

1. **Preview before printing** - Check layout
2. **Print specific sections** - Save paper
3. **Use double-sided** - Environmental friendly
4. **Keep margins** - Ensure content fits
5. **Test with different browsers** - Consistency

### ❌ Don'ts

1. **Don't print everything** - Select what you need
2. **Don't enable background graphics** - Wastes ink
3. **Don't scale too small** - Readability suffers
4. **Don't ignore print preview** - Check first

---

## Future Enhancements

Potential improvements:
- [ ] PDF export option
- [ ] Custom print templates
- [ ] Section selection UI
- [ ] QR codes for digital access
- [ ] Printable answer sheets
- [ ] Study guide format

---

**Last Updated:** March 2026  
**Tested On:** Chrome Print, Firefox Print, Safari Print  
**Maintained by:** Prof. Diego Méndez · UTU · ITI 2026
