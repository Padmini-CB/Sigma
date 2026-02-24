/**
 * SIGMA Interactive Script — Injected into template iframes
 * Makes every [data-sigma] element draggable, resizable, and editable.
 */
(function () {
  'use strict';

  // ── Styles ──────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    .sigma-selected {
      outline: 2px solid #3b82f6 !important;
      outline-offset: 2px;
      cursor: move;
    }
    .sigma-handle {
      display: none;
      position: absolute;
      width: 8px;
      height: 8px;
      background: #fff;
      border: 1.5px solid #3b82f6;
      border-radius: 2px;
      z-index: 10000;
      box-sizing: border-box;
    }
    .sigma-selected > .sigma-handle { display: block !important; }
    .sigma-editing {
      outline: 2px solid #20C997 !important;
      min-width: 20px;
      min-height: 10px;
    }
    [contenteditable="true"] {
      outline: none !important;
      cursor: text;
    }
    .sigma-drop-overlay {
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: rgba(59,130,246,0.08);
      border: 2px dashed #3b82f6;
      pointer-events: none;
      display: none;
    }
    .sigma-drop-overlay.active { display: block; }
  `;
  document.head.appendChild(style);

  // ── Drop overlay ──
  const dropOverlay = document.createElement('div');
  dropOverlay.className = 'sigma-drop-overlay';
  document.body.appendChild(dropOverlay);

  // ── Resize handles ──
  const HANDLES = [
    { pos: 'nw', cursor: 'nwse-resize', top: '-4px', left: '-4px' },
    { pos: 'ne', cursor: 'nesw-resize', top: '-4px', right: '-4px' },
    { pos: 'se', cursor: 'nwse-resize', bottom: '-4px', right: '-4px' },
    { pos: 'sw', cursor: 'nesw-resize', bottom: '-4px', left: '-4px' },
  ];

  function addResizeHandles(el) {
    HANDLES.forEach(({ pos, cursor, ...offsets }) => {
      const handle = document.createElement('div');
      handle.className = 'sigma-handle';
      handle.dataset.handle = pos;
      handle.style.cursor = cursor;
      Object.entries(offsets).forEach(([k, v]) => { handle.style[k] = v; });
      handle.style.position = 'absolute';
      el.appendChild(handle);

      handle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        startResize(el, pos, e);
      });
    });
  }

  function startResize(el, handle, startEvt) {
    const startX = startEvt.clientX;
    const startY = startEvt.clientY;
    const startW = el.offsetWidth;
    const startH = el.offsetHeight;
    const startLeft = parseInt(el.style.left || '0', 10);
    const startTop = parseInt(el.style.top || '0', 10);

    function onMove(e) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      let newW = startW, newH = startH, newL = startLeft, newT = startTop;

      if (handle.includes('e')) newW = Math.max(40, startW + dx);
      if (handle.includes('w')) { newW = Math.max(40, startW - dx); newL = startLeft + dx; }
      if (handle.includes('s')) newH = Math.max(20, startH + dy);
      if (handle.includes('n')) { newH = Math.max(20, startH - dy); newT = startTop + dy; }

      el.style.width = newW + 'px';
      el.style.height = newH + 'px';
      el.style.left = newL + 'px';
      el.style.top = newT + 'px';
    }
    function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  // ── Gather elements ──
  const sigmaElements = document.querySelectorAll('[data-sigma]');

  sigmaElements.forEach((el) => {
    // Ensure positioned so left/top work
    const cs = getComputedStyle(el);
    if (cs.position === 'static') el.style.position = 'relative';

    addResizeHandles(el);

    // ── Click to select + drag ──
    el.addEventListener('mousedown', (e) => {
      if (el.contentEditable === 'true') return;
      // Don't start drag from a resize handle
      if (e.target.classList.contains('sigma-handle')) return;
      e.stopPropagation();

      // Deselect all others
      document.querySelectorAll('.sigma-selected').forEach((s) => s.classList.remove('sigma-selected'));
      el.classList.add('sigma-selected');

      // Notify parent of selection
      notifyParent('select', el);

      // Start drag
      const startX = e.clientX;
      const startY = e.clientY;
      const origLeft = parseInt(el.style.left || '0', 10);
      const origTop = parseInt(el.style.top || '0', 10);

      function onMove(e2) {
        el.style.left = (origLeft + e2.clientX - startX) + 'px';
        el.style.top = (origTop + e2.clientY - startY) + 'px';
      }
      function onUp() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });

    // ── Double-click to edit text ──
    el.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      // Don't make pure image containers editable
      if (el.querySelector('img') && !el.textContent.trim()) return;

      el.contentEditable = 'true';
      el.classList.add('sigma-editing');
      el.classList.remove('sigma-selected');
      el.focus();

      // Select all text
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    });

    el.addEventListener('blur', () => {
      el.contentEditable = 'false';
      el.classList.remove('sigma-editing');
    });
  });

  // ── Click canvas background to deselect all ──
  document.addEventListener('click', (e) => {
    if (e.target === document.body || e.target === document.documentElement || e.target.classList.contains('canvas')) {
      document.querySelectorAll('.sigma-selected').forEach((s) => s.classList.remove('sigma-selected'));
      notifyParent('deselect', null);
    }
  });

  // ── Keyboard shortcuts ──
  document.addEventListener('keydown', (e) => {
    const selected = document.querySelector('.sigma-selected');
    if (!selected) return;

    // Delete element
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (selected.contentEditable !== 'true') {
        selected.remove();
        e.preventDefault();
      }
    }

    // Arrow nudge
    const step = e.shiftKey ? 10 : 1;
    if (e.key === 'ArrowUp') { selected.style.top = (parseInt(selected.style.top || '0', 10) - step) + 'px'; e.preventDefault(); }
    if (e.key === 'ArrowDown') { selected.style.top = (parseInt(selected.style.top || '0', 10) + step) + 'px'; e.preventDefault(); }
    if (e.key === 'ArrowLeft') { selected.style.left = (parseInt(selected.style.left || '0', 10) - step) + 'px'; e.preventDefault(); }
    if (e.key === 'ArrowRight') { selected.style.left = (parseInt(selected.style.left || '0', 10) + step) + 'px'; e.preventDefault(); }

    // Escape to deselect
    if (e.key === 'Escape') {
      if (selected.contentEditable === 'true') {
        selected.contentEditable = 'false';
        selected.classList.remove('sigma-editing');
      }
      selected.classList.remove('sigma-selected');
      notifyParent('deselect', null);
    }
  });

  // ── Drag-and-drop from parent (add new elements) ──
  document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    dropOverlay.classList.add('active');
  });

  document.addEventListener('dragleave', (e) => {
    if (e.relatedTarget === null || !document.body.contains(e.relatedTarget)) {
      dropOverlay.classList.remove('active');
    }
  });

  document.addEventListener('drop', (e) => {
    e.preventDefault();
    dropOverlay.classList.remove('active');
    const html = e.dataTransfer.getData('text/html');
    if (html) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      const newEl = wrapper.firstElementChild;
      if (newEl) {
        newEl.setAttribute('data-sigma', '');
        newEl.style.position = 'absolute';
        newEl.style.left = (e.clientX - 100) + 'px';
        newEl.style.top = (e.clientY - 50) + 'px';
        newEl.style.zIndex = '100';
        document.querySelector('.canvas').appendChild(newEl);
        // Re-init interactivity for the new element
        initElement(newEl);
      }
    }
  });

  // ── Re-init function for dynamically added elements ──
  function initElement(el) {
    const cs = getComputedStyle(el);
    if (cs.position === 'static') el.style.position = 'relative';
    addResizeHandles(el);

    el.addEventListener('mousedown', (e) => {
      if (el.contentEditable === 'true') return;
      if (e.target.classList.contains('sigma-handle')) return;
      e.stopPropagation();
      document.querySelectorAll('.sigma-selected').forEach((s) => s.classList.remove('sigma-selected'));
      el.classList.add('sigma-selected');
      notifyParent('select', el);

      const startX = e.clientX;
      const startY = e.clientY;
      const origLeft = parseInt(el.style.left || '0', 10);
      const origTop = parseInt(el.style.top || '0', 10);
      function onMove(e2) {
        el.style.left = (origLeft + e2.clientX - startX) + 'px';
        el.style.top = (origTop + e2.clientY - startY) + 'px';
      }
      function onUp() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });

    el.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      if (el.querySelector('img') && !el.textContent.trim()) return;
      el.contentEditable = 'true';
      el.classList.add('sigma-editing');
      el.classList.remove('sigma-selected');
      el.focus();
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    });

    el.addEventListener('blur', () => {
      el.contentEditable = 'false';
      el.classList.remove('sigma-editing');
    });
  }

  // ── Notify parent frame ──
  function notifyParent(action, el) {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: 'sigma-iframe',
        action,
        tagName: el ? el.tagName : null,
        text: el ? el.textContent.slice(0, 100) : null,
      }, '*');
    }
  }

  // ── Listen for commands from parent ──
  window.addEventListener('message', (e) => {
    if (!e.data || e.data.type !== 'sigma-command') return;
    const { command, html } = e.data;

    if (command === 'addElement' && html) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      const newEl = wrapper.firstElementChild;
      if (newEl) {
        newEl.setAttribute('data-sigma', '');
        newEl.style.position = 'absolute';
        newEl.style.zIndex = '100';
        document.querySelector('.canvas').appendChild(newEl);
        initElement(newEl);
      }
    }

    if (command === 'prepareExport') {
      // Deselect all and remove handles for clean export
      document.querySelectorAll('.sigma-selected').forEach((s) => s.classList.remove('sigma-selected'));
      document.querySelectorAll('.sigma-handle').forEach((h) => h.style.display = 'none');
      document.querySelectorAll('.sigma-editing').forEach((s) => {
        s.classList.remove('sigma-editing');
        s.contentEditable = 'false';
      });
      // Signal ready
      window.parent.postMessage({ type: 'sigma-iframe', action: 'exportReady' }, '*');
    }

    if (command === 'restoreHandles') {
      document.querySelectorAll('.sigma-handle').forEach((h) => h.style.display = '');
    }
  });

  // Signal parent that interactive mode is ready
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'sigma-iframe', action: 'ready' }, '*');
  }
})();
