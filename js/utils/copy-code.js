// ── COPY CODE ──
    function copyCode(btn) {
      const pre = btn.closest('.code-wrap').querySelector('pre');
      navigator.clipboard.writeText(pre.innerText).then(() => {
        btn.textContent = '✓ copiado';
        setTimeout(() => btn.textContent = 'copiar', 1800);
      }
