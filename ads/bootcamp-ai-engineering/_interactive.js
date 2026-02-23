/**
 * Sigma Interactive Layer
 * Select, Drag, Resize, Edit, Delete, Layer management
 * Include via <script src="_interactive.js"></script> at end of body.
 */
(function () {
  'use strict';

  let selected = null;
  let dragState = null;
  let resizeState = null;
  const HANDLE_SIZE = 10;

  // ── Selection Box ──
  const box = document.createElement('div');
  box.id = 'sigma-sel';
  Object.assign(box.style, {
    position: 'absolute', pointerEvents: 'none', border: '2px solid #3b82f6',
    zIndex: '9999', display: 'none', boxSizing: 'border-box'
  });
  document.body.appendChild(box);

  // ── Resize Handles ──
  const handles = {};
  const cursors = {
    nw: 'nwse-resize', n: 'ns-resize', ne: 'nesw-resize', e: 'ew-resize',
    se: 'nwse-resize', s: 'ns-resize', sw: 'nesw-resize', w: 'ew-resize'
  };
  Object.keys(cursors).forEach(function (dir) {
    const h = document.createElement('div');
    Object.assign(h.style, {
      position: 'absolute', width: HANDLE_SIZE + 'px', height: HANDLE_SIZE + 'px',
      background: '#3b82f6', border: '1px solid #fff', borderRadius: '2px',
      cursor: cursors[dir], zIndex: '10000', display: 'none', pointerEvents: 'auto'
    });
    h.dataset.handle = dir;
    document.body.appendChild(h);
    handles[dir] = h;
  });

  // ── Layer Control Bar ──
  const bar = document.createElement('div');
  bar.id = 'sigma-bar';
  bar.innerHTML =
    '<button data-action="back" title="Send Back">&#8681;</button>' +
    '<button data-action="forward" title="Bring Forward">&#8679;</button>' +
    '<button data-action="delete" title="Delete" style="color:#f85149">&#10005;</button>';
  Object.assign(bar.style, {
    position: 'absolute', display: 'none', zIndex: '10001',
    background: 'rgba(13,17,23,0.92)', borderRadius: '6px', padding: '2px 4px',
    gap: '2px', border: '1px solid rgba(255,255,255,0.15)', flexDirection: 'row'
  });
  bar.querySelectorAll('button').forEach(function (btn) {
    Object.assign(btn.style, {
      background: 'none', border: 'none', color: '#fff', cursor: 'pointer',
      fontSize: '16px', padding: '4px 8px', lineHeight: '1'
    });
  });
  document.body.appendChild(bar);

  function positionUI() {
    if (!selected) return;
    var r = selected.getBoundingClientRect();
    var sx = window.scrollX, sy = window.scrollY;
    box.style.left = (r.left + sx) + 'px';
    box.style.top = (r.top + sy) + 'px';
    box.style.width = r.width + 'px';
    box.style.height = r.height + 'px';
    box.style.display = 'block';

    var hs = HANDLE_SIZE / 2;
    var positions = {
      nw: [r.left + sx - hs, r.top + sy - hs],
      n: [r.left + sx + r.width / 2 - hs, r.top + sy - hs],
      ne: [r.right + sx - hs, r.top + sy - hs],
      e: [r.right + sx - hs, r.top + sy + r.height / 2 - hs],
      se: [r.right + sx - hs, r.bottom + sy - hs],
      s: [r.left + sx + r.width / 2 - hs, r.bottom + sy - hs],
      sw: [r.left + sx - hs, r.bottom + sy - hs],
      w: [r.left + sx - hs, r.top + sy + r.height / 2 - hs]
    };
    Object.keys(positions).forEach(function (dir) {
      handles[dir].style.left = positions[dir][0] + 'px';
      handles[dir].style.top = positions[dir][1] + 'px';
      handles[dir].style.display = 'block';
    });

    bar.style.left = (r.left + sx) + 'px';
    bar.style.top = (r.top + sy - 32) + 'px';
    bar.style.display = 'flex';
  }

  function hideUI() {
    box.style.display = 'none';
    bar.style.display = 'none';
    Object.keys(handles).forEach(function (d) { handles[d].style.display = 'none'; });
  }

  function selectEl(el) {
    if (selected && selected !== el) {
      selected.contentEditable = 'false';
    }
    selected = el;
    positionUI();
  }

  function deselect() {
    if (selected) { selected.contentEditable = 'false'; }
    selected = null;
    hideUI();
  }

  // ── Click to Select ──
  document.addEventListener('mousedown', function (e) {
    // Handle bar buttons
    if (e.target.dataset && e.target.dataset.action) {
      e.preventDefault();
      e.stopPropagation();
      if (!selected) return;
      var act = e.target.dataset.action;
      if (act === 'delete') { selected.remove(); deselect(); }
      if (act === 'forward') {
        var z = parseInt(selected.style.zIndex || 0) + 1;
        selected.style.zIndex = z;
        positionUI();
      }
      if (act === 'back') {
        var zb = parseInt(selected.style.zIndex || 0) - 1;
        selected.style.zIndex = Math.max(0, zb);
        positionUI();
      }
      return;
    }

    // Handle resize
    if (e.target.dataset && e.target.dataset.handle) {
      e.preventDefault();
      resizeState = {
        dir: e.target.dataset.handle,
        startX: e.clientX, startY: e.clientY,
        origRect: selected.getBoundingClientRect(),
        origLeft: parseInt(selected.style.left) || selected.offsetLeft,
        origTop: parseInt(selected.style.top) || selected.offsetTop,
        origW: selected.offsetWidth, origH: selected.offsetHeight
      };
      return;
    }

    // Find sigma element
    var el = e.target.closest('[data-sigma]');
    if (!el) { deselect(); return; }

    e.preventDefault();
    selectEl(el);

    // Start drag
    dragState = {
      startX: e.clientX, startY: e.clientY,
      origLeft: parseInt(el.style.left) || el.offsetLeft,
      origTop: parseInt(el.style.top) || el.offsetTop
    };
  });

  document.addEventListener('mousemove', function (e) {
    if (resizeState && selected) {
      var dx = e.clientX - resizeState.startX;
      var dy = e.clientY - resizeState.startY;
      var d = resizeState.dir;
      var w = resizeState.origW, h = resizeState.origH;
      var l = resizeState.origLeft, t = resizeState.origTop;

      if (d.includes('e')) w += dx;
      if (d.includes('w')) { w -= dx; l += dx; }
      if (d.includes('s')) h += dy;
      if (d.includes('n')) { h -= dy; t += dy; }

      if (w > 20) { selected.style.width = w + 'px'; selected.style.left = l + 'px'; }
      if (h > 20) { selected.style.height = h + 'px'; selected.style.top = t + 'px'; }
      positionUI();
      return;
    }
    if (dragState && selected) {
      var ddx = e.clientX - dragState.startX;
      var ddy = e.clientY - dragState.startY;
      selected.style.left = (dragState.origLeft + ddx) + 'px';
      selected.style.top = (dragState.origTop + ddy) + 'px';
      positionUI();
    }
  });

  document.addEventListener('mouseup', function () {
    dragState = null;
    resizeState = null;
  });

  // ── Double-click to Edit Text ──
  document.addEventListener('dblclick', function (e) {
    var el = e.target.closest('[data-sigma]');
    if (!el) return;
    var isImg = el.tagName === 'IMG' || el.querySelector('img');
    if (!isImg) {
      el.contentEditable = 'true';
      el.focus();
    }
  });

  // ── Keyboard: Delete key ──
  document.addEventListener('keydown', function (e) {
    if (!selected) return;
    if (selected.contentEditable === 'true' && selected.isContentEditable) return;
    if (e.key === 'Delete' || e.key === 'Backspace') {
      selected.remove();
      deselect();
    }
    if (e.key === ']') {
      selected.style.zIndex = parseInt(selected.style.zIndex || 0) + 1;
      positionUI();
    }
    if (e.key === '[') {
      selected.style.zIndex = Math.max(0, parseInt(selected.style.zIndex || 0) - 1);
      positionUI();
    }
    if (e.key === 'Escape') {
      deselect();
    }
  });
})();
