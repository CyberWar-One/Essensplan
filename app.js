/* Essensplan – Oberfläche. Alle Nutzerdaten werden nur per textContent ins DOM geschrieben (kein innerHTML). */
(function () {
  'use strict';
  var EP = window.EP;
  var STORE_KEY = 'essensplan.v1';
  var WD = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  var WD_LONG = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  var MON = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  // Gerichte aus den handschriftlichen Essensplänen (Jan. 2024 – Jan. 2026). [Name, Info/Kochbuch, nichtAutomatisch]
  var SEED_VERSION = 3;
  // Umbenennungen für bereits installierte Versionen (alter Name -> neuer Name)
  var RENAMES = { 'Mediterranes Gemüse mit Feta': 'Mediterranes Gemüse mit Feta und veganen Cevapcici' };
  var MEALS_START = [
    ['Dr. Oetker Pizza', 'auch: „Die Ofenfrische“'], ['Philadelphia-Pizza', ''],
    ['Blumenkohl mit Hackfleischsoße', 'Cholesterin Trennkost S. 60 (blau)'],
    ['Tortellini mit Brokkoli', 'Kl. Cholesterinbuch S. 20'],
    ['Lachs mit Kartoffeln und Spinat', 'Hardy Walle S. 84 · 750 g Spinat'],
    ['Lachs mit Kartoffeln und Rosenkohl', 'auch mariniert / TK-Rosenkohl'],
    ['Lachs mit Kartoffeln und Kohlrabi', 'Lachs gebraten'],
    ['Lachs mit Ofenkürbis', ''],
    ['Gebratener Lachs mit Karottengemüse und Kartöffelchen', 'One Pot'],
    ['Maggi Ofen-Lachs mit Kartoffelbrei', ''],
    ['Farfalle mit Räucherlachs', 'Philadelphia-Buch S. 102'],
    ['Schnelle Tomatensuppe mit Reis', 'Diabetes-Buch GU S. 50'],
    ['Tomatencremesuppe', 'GU Cholesterin-Buch'],
    ['Semmelknödel mit Pilzrahmsauce und Feldsalat', ''],
    ['Pellkartoffeln mit Matjes-Dip', 'Weight Watchers Blau S. 68'],
    ['Überbackene Aubergine', 'Diabetes-Buch S. 58'],
    ['Kartoffeln mit Grüner Soße', ''],
    ['Kartoffeln, Spinat und Ei', ''],
    ['Mediterranes Gemüse mit Feta und veganen Cevapcici', ''],
    ['Gemüse mit Feta und Gnocchi', 'mediterran oder Paprika/Zucchini/Karotten'],
    ['Mediterranes Gemüse mit Hackfleisch und Feta', 'Griechische Nudeln'],
    ['Hähnchenbrust mit Ananas', 'Diabetes-Buch S. 98'],
    ['Erasco Hühnersuppe', ''], ['Erasco Hühner-Reistopf', ''], ['Erasco Hühnertopf mit Wurzelbrot', ''],
    ['Butter-Erbsen mit gebratenen Gnocchi', ''], ['Butter-Erbsen mit Rostbratwürstchen', ''],
    ['Petersilien-Zucchini-Auflauf', 'GU Cholesterin S. 70'],
    ['Tomaten-Rührei mit Mozzarella und Brötchen', 'H. Walle S. 17'],
    ['Spanischer Gemüsereis', 'Cholesterin Trennkost S. 82'],
    ['Putengeschnetzeltes', 'H. Walle S. 38'],
    ['Butterbohnen mit Frikadellen', ''], ['Bifteki mit Butterbohnen', ''],
    ['Spiralnudeln mit Erbsen und Frischkäse', 'GU Cholesterin im Griff S. 64'],
    ['Ofenfisch (Iglo) mit Kartoffeln und Salat', 'Feldsalat'],
    ['Nudeln mit Pesto und Grana Padano', ''],
    ['Szegediner Gulasch mit Kartoffelbrei', ''],
    ['Ofenkürbis mit vegetarischen Gemüsebällchen', ''],
    ['Gebratene Maultaschen mit Mischgemüse', 'optional Thomy Sauce Hollandaise'],
    ['Brokkoli-Cremesuppe mit Baguette', ''],
    ['Gnocchi mit Rahmspinat und Grana Padano', ''],
    ['Linsensuppe', 'auch aus TK'],
    ['Braune Linsensuppe mit Lauch und Räuchertofu', 'mit Karotten, Kartoffeln, Zwiebel'],
    ['Grießbrei mit Dosenfrüchten', ''],
    ['Kartoffelsuppe mit Baguette', 'Kl. Cholesterin-Kochbuch S. 27'],
    ['Gefüllte Paprika', 'mit Reis oder Couscous · GU Cholesterin S. 68'],
    ['Linsen mit Hähnchen', 'H. Walle S. 44 · rote Linsen'],
    ['Nudeln mit geriebenem Käse und Apfelbrei', ''],
    ['Champignons mit Zwiebeln und Kartoffeln', 'mit Natur-Frischkäse · Salzkartoffeln oder Kartoffelbrei'],
    ['Gebratene Schupfnudeln mit Gurke oder Rosenkohl', ''],
    ['Kartoffeln mit Karottengemüse', ''], ['Erbsen mit Kartoffeln', ''],
    ['Reis mit Rosenkohl und Rostbratwurst', ''],
    ['Tortelloni mit Spinat', ''], ['TK-Tortelloni', ''], ['Tortelloni-Topf', 'Schneller Tortelloni-Topf'],
    ['Hackfleisch-Lauch-Suppe', 'Knorr'],
    ['Bami Goreng (Frosta)', ''], ['Nasi Goreng (Frosta)', ''],
    ['Vollkorn-Spaghetti mit Speck-Käse-Soße', 'Weight Watchers Blau S. 66'],
    ['Kartoffeln mit Mischgemüse und Sauce Hollandaise', ''],
    ['Erdnuss-Karotten-Suppe', 'Weight Watchers rot S. 13'],
    ['Spätzle-Chicken-Pfanne', 'Weight Watchers rot S. 41'],
    ['Brötchen mit Würstchen', ''], ['Ofenkäse mit Baguette', ''],
    ['Nudeln mit Tomaten-Thunfisch-Soße', 'mit Grana Padano'],
    ['Asiatische Nudeln (Fertiggericht)', ''],
    ['Lamm mit Bohnen und Kartoffeln', ''],
    ['Kartoffeln mit Quark', 'mit Leinsamenöl und Gewürzgurken'],
    ['Serbische Bohnensuppe mit Baguette', 'oder Ciabatta'],
    ['Grillen mit Baked Beans und Pizzabrot', 'Maigriller'],
    ['Gegrillte Putensteaks mit Pesto-Nudelsalat', ''],
    ['Rosenkohl mit Kartoffeln und Frikadellen', 'Heißluftfritteuse · Aldi-Frikadellen'],
    ['Hähnchencurry mit Kokosmilch', ''],
    ['Hähnchen-Cordon-bleu mit Reis und Soße', 'auch Heißluftfritteuse mit Butter-Erbsen'],
    ['One-Pot-Penne mit Parmesan', ''],
    ['Falafel mit Mischgemüse und Sauce Hollandaise', ''],
    ['Gebratene Falafel mit Rouladensoße und Spätzle', ''],
    ['Wasserbad-Gericht mit Reis', ''],
    ['Lasagne (Lidl) mit Salat', ''],
    ['Fischstäbchen mit Kartoffeln und Rahmspinat', ''],
    ['Wirsinggemüse mit Kräuterreis', ''],
    ['Zucchini-Suppe mit Baguette', ''],
    // Sonstiges – wird von „Automatisch füllen“ nie gewählt
    ['Essen gehen', '', true], ['Restessen', '', true], ['Etwas aus TK', '', true], ['Asia-Essen (Nidderau)', 'Asia-Nudeln', true]
  ];
  function startMeals() {
    return MEALS_START.map(function (r) { return { id: uid(), name: r[0], info: r[1] || '', noAuto: !!r[2], seed: false, createdAt: Date.now() }; });
  }
  /** Umstellung alter Installationen: alte Beispielgerichte (nur ungenutzte) raus, echte Gerichte rein. Nichts Genutztes wird gelöscht. */
  function migrateSeeds(s) {
    if (s.seedVersion >= SEED_VERSION) return s;
    s.meals.forEach(function (m) {
      Object.keys(RENAMES).forEach(function (oldName) {
        if (EP.normalize(m.name) === EP.normalize(oldName)) m.name = RENAMES[oldName];
      });
    });
    var used = {}; Object.keys(s.plan).forEach(function (k) { used[s.plan[k].mealId] = 1; });
    s.meals = s.meals.filter(function (m) { return !m.seed || used[m.id]; });
    startMeals().forEach(function (n) {
      if (!s.meals.some(function (m) { return EP.normalize(m.name) === EP.normalize(n.name); })) s.meals.push(n);
    });
    s.seedVersion = SEED_VERSION;
    return s;
  }

  // ---------- Zustand ----------
  var state = load();
  var weekOffset = 0;
  var undoSnap = null, undoTimer = null;
  var moveFrom = null;          // Tap-basiertes Verschieben
  var showPast = false;

  function uid() {
    var a = new Uint8Array(8); crypto.getRandomValues(a);
    return 'm' + Array.prototype.map.call(a, function (b) { return b.toString(16).padStart(2, '0'); }).join('');
  }
  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) { var s = EP.sanitizeState(JSON.parse(raw)); s.lastBackup = JSON.parse(raw).lastBackup || null; return migrateSeeds(s); }
    } catch (e) { console.error(e); }
    return { version: 1, meals: startMeals(), plan: {}, notes: {}, lastBackup: null, seedVersion: SEED_VERSION };
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
    catch (e) { alertBox('Speichern fehlgeschlagen: Speicher voll? Bitte eine Sicherung anlegen.'); }
  }
  function snapshot() { return JSON.stringify(state); }
  function commit(msg, snap) {
    save(); renderAll();
    if (msg) snack(msg, snap);
  }
  function mealById(id) { for (var i = 0; i < state.meals.length; i++) if (state.meals[i].id === id) return state.meals[i]; return null; }
  function mealName(id) { var m = mealById(id); return m ? m.name : ''; }

  // ---------- Hilfen ----------
  function $(id) { return document.getElementById(id); }
  function el(tag, props, kids) {
    var e = document.createElement(tag);
    if (props) Object.keys(props).forEach(function (k) {
      if (k === 'text') e.textContent = props[k];
      else if (k === 'cls') e.className = props[k];
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), props[k]);
      else e.setAttribute(k, props[k]);
    });
    (kids || []).forEach(function (c) { if (c) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  function todayKey() { return EP.toKey(new Date()); }
  function windowStart() { return EP.addDays(EP.mondayOf(new Date()), weekOffset * 7); }
  function windowKeys() { var s = windowStart(), out = []; for (var i = 0; i < 14; i++) out.push(EP.toKey(EP.addDays(s, i))); return out; }
  function fmtShort(k) { var d = EP.fromKey(k); return WD[d.getDay()] + ' ' + d.getDate() + '.' + (d.getMonth() + 1) + '.'; }
  function fmtLong(k) { var d = EP.fromKey(k); return WD_LONG[d.getDay()] + ', ' + d.getDate() + '. ' + MON[d.getMonth()] + ' ' + d.getFullYear(); }
  function relDays(k) {
    var n = EP.diffDays(new Date(), EP.fromKey(k));
    if (n === 0) return 'heute'; if (n === 1) return 'morgen'; if (n === -1) return 'gestern';
    return n > 0 ? 'in ' + n + ' Tagen' : 'vor ' + (-n) + ' Tagen';
  }

  // ---------- Snackbar / Rückgängig ----------
  function snack(text, snap) {
    $('snackText').textContent = text;
    undoSnap = snap || null;
    $('snackBtn').style.display = snap ? '' : 'none';
    $('snackbar').classList.add('show');
    clearTimeout(undoTimer);
    undoTimer = setTimeout(function () { $('snackbar').classList.remove('show'); undoSnap = null; }, 6000);
  }
  $('snackBtn').addEventListener('click', function () {
    if (!undoSnap) return;
    var lb = state.lastBackup;
    state = EP.sanitizeState(JSON.parse(undoSnap)); state.lastBackup = lb;
    undoSnap = null; save(); renderAll(); $('snackbar').classList.remove('show');
  });

  // ---------- Bestätigungsdialog ----------
  function ask(text, buttons) {
    return new Promise(function (resolve) {
      var dlg = $('confirm'), box = $('confirmBtns');
      $('confirmText').textContent = text;
      box.textContent = '';
      buttons.forEach(function (b) {
        box.appendChild(el('button', { cls: 'btn ' + (b.cls || ''), text: b.label, onclick: function () { dlg.close(); resolve(b.value); } }));
      });
      dlg.onclose = function () { resolve(undefined); };
      dlg.oncancel = function () { resolve(undefined); };
      dlg.showModal();
    });
  }
  function alertBox(text) { return ask(text, [{ label: 'OK', value: true, cls: 'primary' }]); }

  // ---------- Plan-Raster ----------
  function renderGrid() {
    var keys = windowKeys(), g = $('grid'), tk = todayKey();
    g.textContent = '';
    var w1 = keys[0], w1e = keys[6], w2 = keys[7], w2e = keys[13];
    g.appendChild(el('div', { cls: 'colhead', text: weekLabel(w1, w1e) }));
    g.appendChild(el('div', { cls: 'colhead', text: weekLabel(w2, w2e) }));
    for (var r = 0; r < 7; r++) { g.appendChild(cell(keys[r], tk)); g.appendChild(cell(keys[r + 7], tk)); }
    var s = EP.fromKey(keys[0]), e = EP.fromKey(keys[13]);
    $('rangeLabel').textContent = s.getDate() + '.' + (s.getMonth() + 1) + '. – ' + e.getDate() + '.' + (e.getMonth() + 1) + '.' + e.getFullYear();
  }
  function weekLabel(a, b) {
    var cur = EP.toKey(EP.mondayOf(new Date())), lbl = a === cur ? 'Diese Woche' : (a === EP.toKey(EP.addDays(EP.fromKey(cur), 7)) ? 'Nächste Woche' : 'KW ' + isoWeek(EP.fromKey(a)));
    return lbl;
  }
  function isoWeek(d) {
    var t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); var day = t.getUTCDay() || 7;
    t.setUTCDate(t.getUTCDate() + 4 - day); var y = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
    return Math.ceil(((t - y) / 86400000 + 1) / 7);
  }
  function cell(k, tk) {
    var d = EP.fromKey(k), entry = state.plan[k], note = state.notes[k], hol = EP.holidayName(k);
    var cls = 'cell' + (d.getDay() === 0 || d.getDay() === 6 ? ' weekend' : '') + (k === tk ? ' today' : '') + (k < tk ? ' past' : '') +
      (moveFrom === k ? ' movesrc' : '');
    var name = entry ? mealName(entry.mealId) : '';
    var c = el('button', { cls: cls, 'data-key': k, 'aria-label': fmtLong(k) + ': ' + (name || 'nichts geplant') }, [
      el('div', { cls: 'd' }, [el('span', { cls: 'wd', text: WD[d.getDay()] }), el('span', { text: d.getDate() + '.' + (d.getMonth() + 1) + '.' })]),
      el('div', { cls: 'm' + (name ? '' : ' empty'), text: name || '–' }),
      hol ? el('div', { cls: 'hol', text: '★ ' + hol }) : null,
      note ? el('div', { cls: 'note', text: '📝 ' + note }) : null
    ]);
    return c;
  }

  // Klick auf Tag (nach Drag wird der Klick unterdrückt)
  var suppressClick = false;
  $('grid').addEventListener('click', function (ev) {
    var c = ev.target.closest('.cell'); if (!c || suppressClick) return;
    var k = c.getAttribute('data-key');
    if (moveFrom) { finishMove(k); return; }
    openDay(k);
  });
  $('grid').addEventListener('contextmenu', function (ev) { if (ev.target.closest('.cell')) ev.preventDefault(); });

  // ---------- Drag & Drop (Touch: langes Drücken; Maus: direkt ziehen) ----------
  (function initDrag() {
    var src = null, ghost = null, timer = null, sx = 0, sy = 0, dragging = false, over = null, mouse = false;
    function begin() {
      dragging = true;
      if (navigator.vibrate) try { navigator.vibrate(25); } catch (e) { /* egal */ }
      src.classList.add('dragsrc');
      ghost = el('div', { cls: 'ghost', text: mealName(state.plan[src.getAttribute('data-key')].mealId) });
      document.body.appendChild(ghost); place(sx, sy);
    }
    function place(x, y) {
      if (!ghost) return;
      ghost.style.left = x + 'px'; ghost.style.top = y + 'px';
      var t = document.elementFromPoint(x, y), c = t && t.closest ? t.closest('.cell') : null;
      if (c === src) c = null;
      if (over && over !== c) over.classList.remove('drop');
      over = c; if (over) over.classList.add('drop');
    }
    function reset() {
      clearTimeout(timer); timer = null;
      if (ghost) ghost.remove(); ghost = null;
      if (src) src.classList.remove('dragsrc');
      if (over) over.classList.remove('drop');
      src = null; over = null; dragging = false;
    }
    function start(x, y, target, isMouse) {
      if (moveFrom) return;
      var c = target.closest && target.closest('.cell'); if (!c) return;
      if (!state.plan[c.getAttribute('data-key')]) return; // nur gefüllte Tage ziehen
      src = c; sx = x; sy = y; mouse = isMouse;
      if (!isMouse) timer = setTimeout(begin, 380);
    }
    function move(x, y, ev) {
      if (!src) return;
      if (!dragging) {
        var dist = Math.abs(x - sx) + Math.abs(y - sy);
        if (mouse && dist > 8) begin();
        else if (!mouse && dist > 12) { reset(); return; } // Nutzer scrollt
        else return;
      }
      if (ev.cancelable) ev.preventDefault();
      place(x, y);
    }
    function end() {
      if (dragging) {
        suppressClick = true; setTimeout(function () { suppressClick = false; }, 350);
        if (over) {
          var a = src.getAttribute('data-key'), b = over.getAttribute('data-key');
          reset(); doSwap(a, b); return;
        }
      }
      reset();
    }
    var grid = $('grid');
    grid.addEventListener('touchstart', function (e) { if (e.touches.length === 1) start(e.touches[0].clientX, e.touches[0].clientY, e.target, false); }, { passive: true });
    document.addEventListener('touchmove', function (e) { if (src) move(e.touches[0].clientX, e.touches[0].clientY, e); }, { passive: false });
    document.addEventListener('touchend', end);
    document.addEventListener('touchcancel', reset);
    grid.addEventListener('mousedown', function (e) { if (e.button === 0) start(e.clientX, e.clientY, e.target, true); });
    document.addEventListener('mousemove', function (e) { if (src) move(e.clientX, e.clientY, e); });
    document.addEventListener('mouseup', end);
  })();

  function doSwap(a, b) {
    if (a === b) return;
    var snap = snapshot(), ma = state.plan[a], mb = state.plan[b];
    state.plan = EP.swapDays(state.plan, a, b);
    var msg = mb ? fmtShort(a) + ' ⇄ ' + fmtShort(b) + ' getauscht' : mealName(ma.mealId) + ' → ' + fmtShort(b);
    commit(msg, snap);
  }
  function startMove(k) { moveFrom = k; $('sheet').close(); $('moveBanner').classList.add('show'); renderGrid(); }
  function finishMove(k) { var a = moveFrom; cancelMove(); doSwap(a, k); }
  function cancelMove() { moveFrom = null; $('moveBanner').classList.remove('show'); renderGrid(); }
  $('moveCancel').addEventListener('click', cancelMove);

  // ---------- Tages-Dialog ----------
  function openDay(k) {
    var body = $('sheetBody'), entry = state.plan[k], hol = EP.holidayName(k);
    body.textContent = '';
    body.appendChild(el('h3', { text: fmtLong(k) }));
    if (hol) body.appendChild(el('div', { cls: 'badge', text: '★ ' + hol }));
    body.appendChild(el('div', { cls: 'bigmeal', text: entry ? mealName(entry.mealId) : 'Noch nichts geplant' }));
    var em = entry ? mealById(entry.mealId) : null;
    if (em && em.info) body.appendChild(el('div', { cls: 'mealinfo', text: '📖 ' + em.info }));
    if (entry) {
      var c = EP.conflicts(state.plan, entry.mealId, k);
      if (c.length) body.appendChild(el('p', { cls: 'muted', text: '⚠️ Auch geplant: ' + c.map(fmtShort).join(', ') }));
    }
    var g = el('div', { cls: 'grid2' }, [
      el('button', { cls: 'btn primary', text: '🍲 Gericht wählen', onclick: function () { openPicker(k); } }),
      el('button', { cls: 'btn', text: '🎲 Zufällig', onclick: function () { randomFor(k); } }),
      entry ? el('button', { cls: 'btn', text: '↔ Verschieben', onclick: function () { startMove(k); } }) : null,
      entry ? el('button', { cls: 'btn danger', text: '✕ Entfernen', onclick: function () {
        var snap = snapshot(); delete state.plan[k]; $('sheet').close(); commit('Entfernt', snap); } }) : null
    ]);
    body.appendChild(g);
    body.appendChild(el('label', { cls: 'lbl', for: 'dayNote', text: '📝 Notiz für diesen Tag' }));
    var ta = el('textarea', { id: 'dayNote', rows: '3', maxlength: '2000', placeholder: 'z. B. Gäste, Einkauf, Absprachen…' });
    ta.value = state.notes[k] || '';
    body.appendChild(ta);
    body.appendChild(el('div', { cls: 'grid2' }, [
      el('button', { cls: 'btn', text: 'Schließen', onclick: function () { $('sheet').close(); } }),
      el('button', { cls: 'btn primary', text: '💾 Notiz speichern', onclick: function () { setNote(k, ta.value); $('sheet').close(); } })
    ]));
    if (!$('sheet').open) $('sheet').showModal();
  }
  function setNote(k, text) {
    var t = String(text || '').trim().slice(0, 2000), snap = snapshot();
    if ((state.notes[k] || '') === t) return;
    if (t) state.notes[k] = t; else delete state.notes[k];
    commit(t ? 'Notiz gespeichert' : 'Notiz gelöscht', snap);
  }
  function randomFor(k) {
    var cur = state.plan[k], meals = state.meals.filter(function (m) { return !cur || m.id !== cur.mealId; });
    var res = EP.autoFill(state.plan, meals, [k]);
    if (!res.filled) { alertBox('Kein passendes Gericht gefunden – alle wären innerhalb von 2 Wochen doppelt. Bitte mehr Gerichte anlegen.'); return; }
    var snap = snapshot(); state.plan = res.plan; commit(fmtShort(k) + ': ' + mealName(res.plan[k].mealId), snap); openDay(k);
  }
  async function assign(k, mealId) {
    var c = EP.conflicts(state.plan, mealId, k);
    if (c.length) {
      var ok = await ask('„' + mealName(mealId) + '“ gibt es schon am ' + c.map(fmtShort).join(', ') + '.\nTrotzdem eintragen?',
        [{ label: 'Ja, trotzdem', value: true, cls: 'primary' }, { label: 'Abbrechen', value: false }]);
      if (!ok) return;
    }
    var snap = snapshot(); state.plan[k] = { mealId: mealId }; $('sheet').close();
    commit(fmtShort(k) + ': ' + mealName(mealId), snap);
  }

  // ---------- Gericht auswählen ----------
  function openPicker(k) {
    var body = $('sheetBody');
    body.textContent = '';
    body.appendChild(el('h3', { text: 'Gericht für ' + fmtShort(k) }));
    var inp = el('input', { type: 'search', placeholder: 'Suchen oder neu eingeben…', maxlength: '80', autocomplete: 'off', enterkeyhint: 'done' });
    var list = el('ul', { cls: 'list' }), scroll = el('div', { cls: 'scroll' }, [list]);
    var addBtn = el('button', { cls: 'btn primary' });
    body.appendChild(inp); body.appendChild(addBtn); body.appendChild(scroll);
    body.appendChild(el('button', { cls: 'btn', text: '← Zurück', onclick: function () { openDay(k); } }));
    function draw() {
      var q = inp.value.trim(), nq = EP.normalize(q);
      list.textContent = '';
      var items = state.meals.map(function (m) {
        var conf = EP.conflicts(state.plan, m.id, k), last = EP.lastEatenBefore(state.plan, m.id, k);
        return { m: m, conf: conf, last: last };
      }).filter(function (it) {
        return !nq || EP.normalize(it.m.name).indexOf(nq) >= 0 || EP.similarity(q, it.m.name) >= 0.6;
      }).sort(function (a, b) {
        if (!!a.conf.length !== !!b.conf.length) return a.conf.length ? 1 : -1;
        return a.m.name.localeCompare(b.m.name, 'de');
      });
      items.forEach(function (it) {
        var sub = it.conf.length ? 'schon am ' + it.conf.map(fmtShort).join(', ') : (it.last ? 'zuletzt ' + relDays(it.last) : 'noch nie geplant');
        list.appendChild(el('li', { cls: 'pick', onclick: function () { assign(k, it.m.id); } }, [
          el('div', { cls: 'grow' }, [el('div', { cls: 'name', text: it.m.name }),
            it.m.info ? el('div', { cls: 'sub', text: '📖 ' + it.m.info }) : null,
            el('div', { cls: 'sub' + (it.conf.length ? ' warn' : ''), text: sub })])
        ]));
      });
      if (!items.length) list.appendChild(el('li', {}, [el('div', { cls: 'sub', text: 'Nichts gefunden.' })]));
      var exact = q && state.meals.some(function (m) { return EP.normalize(m.name) === nq; });
      addBtn.style.display = q && !exact ? '' : 'none';
      addBtn.textContent = '＋ „' + q + '“ neu anlegen';
    }
    addBtn.onclick = async function () {
      var m = await addMealFlow(inp.value);
      if (m) assign(k, m.id);
    };
    inp.addEventListener('input', draw);
    draw();
  }

  // ---------- Gericht anlegen mit Ähnlichkeitsprüfung ----------
  /** Gibt das neue oder ein bestehendes (ausgewähltes) Gericht zurück, oder null. */
  async function addMealFlow(rawName, excludeId) {
    var name = String(rawName || '').replace(/\s+/g, ' ').trim().slice(0, 80);
    if (!name) return null;
    name = name.charAt(0).toUpperCase() + name.slice(1);
    var others = state.meals.filter(function (m) { return m.id !== excludeId; });
    var same = others.filter(function (m) { return EP.normalize(m.name) === EP.normalize(name) || EP.similarity(name, m.name) >= 0.97; });
    if (same.length) {
      var use = await ask('„' + same[0].name + '“ gibt es schon.', [
        { label: 'Vorhandenes verwenden', value: true, cls: 'primary' }, { label: 'Abbrechen', value: false }]);
      return use && !excludeId ? same[0] : null;
    }
    var sim = EP.findSimilar(name, others).slice(0, 3);
    if (sim.length) {
      var btns = sim.map(function (s, i) { return { label: '„' + s.meal.name + '“ verwenden', value: s.meal.id, cls: i === 0 ? 'primary' : '' }; });
      if (excludeId) btns = [];
      btns.push({ label: '＋ Trotzdem „' + name + '“ ' + (excludeId ? 'so nennen' : 'neu anlegen'), value: '__new', cls: excludeId ? 'primary' : '' });
      btns.push({ label: 'Abbrechen', value: null });
      var r = await ask('Ähnliche Gerichte gefunden:\n' + sim.map(function (s) { return '• ' + s.meal.name; }).join('\n') +
        '\n\nIst das dasselbe?', btns);
      if (!r) return null;
      if (r !== '__new') return mealById(r);
    }
    if (excludeId) return { name: name };
    var meal = { id: uid(), name: name, info: '', noAuto: false, seed: false, createdAt: Date.now() };
    state.meals.push(meal); save(); renderMeals();
    return meal;
  }

  // ---------- Gerichte-Ansicht ----------
  function renderMeals() {
    var q = $('mealSearch').value.trim(), nq = EP.normalize(q), list = $('mealList'), tk = todayKey();
    list.textContent = '';
    var items = state.meals.filter(function (m) { return !nq || EP.normalize(m.name + ' ' + (m.info || '')).indexOf(nq) >= 0 || EP.similarity(q, m.name) >= 0.6; })
      .sort(function (a, b) { return a.name.localeCompare(b.name, 'de'); });
    items.forEach(function (m) {
      var last = EP.lastEatenBefore(state.plan, m.id, EP.toKey(EP.addDays(new Date(), 1)));
      var next = Object.keys(state.plan).filter(function (k) { return k > tk && state.plan[k].mealId === m.id; }).sort()[0];
      var sub = [next ? 'geplant ' + fmtShort(next) : null, last ? 'zuletzt ' + relDays(last) : null, m.noAuto ? 'nicht bei Automatik' : null]
        .filter(Boolean).join(' · ') || 'noch nie geplant';
      list.appendChild(el('li', {}, [
        el('div', { cls: 'grow' }, [el('div', { cls: 'name', text: m.name }),
          m.info ? el('div', { cls: 'sub', text: '📖 ' + m.info }) : null, el('div', { cls: 'sub', text: sub })]),
        el('button', { cls: 'ico', 'aria-label': 'Automatik an/aus', text: m.noAuto ? '🚫' : '🎲', onclick: function () {
          m.noAuto = !m.noAuto; save(); renderMeals(); snack(m.noAuto ? 'Wird nicht mehr automatisch gewählt' : 'Wird wieder automatisch gewählt'); } }),
        el('button', { cls: 'ico', 'aria-label': 'Bearbeiten', text: '✏️', onclick: function () { renameMeal(m); } }),
        el('button', { cls: 'ico', 'aria-label': 'Löschen', text: '🗑', onclick: function () { deleteMeal(m); } })
      ]));
    });
    $('mealCount').textContent = state.meals.length + ' Gerichte' + (q ? ' · ' + items.length + ' gefunden' : '') +
      ' · 🎲 = wird bei „Automatisch“ berücksichtigt';
  }
  $('mealSearch').addEventListener('input', renderMeals);
  async function addFromSearch() {
    var m = await addMealFlow($('mealSearch').value);
    if (m) { $('mealSearch').value = ''; renderMeals(); snack('„' + m.name + '“ gespeichert'); }
  }
  $('mealAddBtn').addEventListener('click', addFromSearch);
  $('mealSearch').addEventListener('keydown', function (e) { if (e.key === 'Enter') addFromSearch(); });

  async function renameMeal(m) {
    var body = $('sheetBody'); body.textContent = '';
    var inp = el('input', { id: 'editName', type: 'text', maxlength: '80' }); inp.value = m.name;
    var info = el('input', { id: 'editInfo', type: 'text', maxlength: '200', placeholder: 'z. B. GU Cholesterin S. 64' }); info.value = m.info || '';
    body.appendChild(el('h3', { text: 'Gericht bearbeiten' }));
    body.appendChild(el('label', { cls: 'lbl', for: 'editName', text: 'Name' })); body.appendChild(inp);
    body.appendChild(el('label', { cls: 'lbl', for: 'editInfo', text: '📖 Info (Kochbuch, Seite, Hinweis)' })); body.appendChild(info);
    body.appendChild(el('div', { cls: 'grid2' }, [
      el('button', { cls: 'btn', text: 'Abbrechen', onclick: function () { $('sheet').close(); } }),
      el('button', { cls: 'btn primary', text: 'Speichern', onclick: async function () {
        var newName = m.name;
        if (EP.normalize(inp.value) !== EP.normalize(m.name)) {
          var r = await addMealFlow(inp.value, m.id);
          if (!r || !r.name) return;
          newName = r.name;
        }
        var snap = snapshot(); m.name = newName; m.info = info.value.trim().slice(0, 200);
        $('sheet').close(); commit('Gespeichert', snap);
      } })
    ]));
    $('sheet').showModal(); inp.focus();
  }
  async function deleteMeal(m) {
    var tk = todayKey(), future = Object.keys(state.plan).filter(function (k) { return k >= tk && state.plan[k].mealId === m.id; });
    var ok = await ask('„' + m.name + '“ löschen?' + (future.length ? '\nEs ist noch geplant am ' + future.map(fmtShort).join(', ') + ' – diese Einträge werden entfernt.' : ''),
      [{ label: 'Löschen', value: true, cls: 'danger' }, { label: 'Abbrechen', value: false }]);
    if (!ok) return;
    var snap = snapshot();
    Object.keys(state.plan).forEach(function (k) { if (state.plan[k].mealId === m.id) delete state.plan[k]; });
    state.meals = state.meals.filter(function (x) { return x !== m; });
    commit('Gelöscht', snap);
  }

  // ---------- Automatisch füllen / Leeren ----------
  $('autoBtn').addEventListener('click', async function () {
    var tk = todayKey(), keys = windowKeys().filter(function (k) { return k >= tk; });
    if (!keys.length) { alertBox('Diese Tage liegen alle in der Vergangenheit.'); return; }
    var emptyKeys = keys.filter(function (k) { return !state.plan[k]; });
    var choice = await ask('Welche Tage sollen automatisch gefüllt werden?\n(Vergangene Tage bleiben unverändert.)', [
      { label: 'Nur leere Tage (' + emptyKeys.length + ')', value: 'empty', cls: 'primary' },
      { label: 'Alle Tage neu (' + keys.length + ')', value: 'all' },
      { label: 'Abbrechen', value: null }]);
    if (!choice) return;
    var targets = choice === 'all' ? keys : emptyKeys;
    if (!targets.length) { snack('Alle Tage sind schon gefüllt'); return; }
    var snap = snapshot(), res = EP.autoFill(state.plan, state.meals, targets);
    state.plan = res.plan;
    commit(res.filled + ' Tage gefüllt', snap);
    if (res.empty.length) alertBox(res.empty.length + ' Tag(e) blieben leer: Es gibt nicht genug Gerichte, ohne dass sich innerhalb von 2 Wochen etwas wiederholt.\nBitte mehr Gerichte anlegen oder bei manchen 🚫 wieder auf 🎲 stellen.');
  });
  $('clearBtn').addEventListener('click', async function () {
    var tk = todayKey(), keys = windowKeys().filter(function (k) { return k >= tk && state.plan[k]; });
    if (!keys.length) { snack('Nichts zu leeren'); return; }
    var ok = await ask(keys.length + ' geplante Tage (ab heute) leeren?\nNotizen bleiben erhalten.', [
      { label: 'Leeren', value: true, cls: 'danger' }, { label: 'Abbrechen', value: false }]);
    if (!ok) return;
    var snap = snapshot(); keys.forEach(function (k) { delete state.plan[k]; }); commit('Geleert', snap);
  });

  // ---------- Termine ----------
  function renderNotes() {
    var tk = todayKey(), list = $('noteList');
    list.textContent = '';
    var keys = Object.keys(state.notes).filter(function (k) { return showPast || k >= tk; }).sort();
    if (!keys.length) list.appendChild(el('li', {}, [el('div', { cls: 'sub', text: 'Keine Notizen.' })]));
    keys.forEach(function (k) {
      var hol = EP.holidayName(k), meal = state.plan[k] ? mealName(state.plan[k].mealId) : '';
      list.appendChild(el('li', { cls: 'pick', onclick: function () { $('noteDate').value = k; $('noteText').value = state.notes[k]; $('noteText').focus(); } }, [
        el('div', { cls: 'grow' }, [
          el('div', { cls: 'sub', text: fmtLong(k) + ' · ' + relDays(k) + (hol ? ' · ★ ' + hol : '') }),
          el('div', { cls: 'name', text: state.notes[k] }),
          meal ? el('div', { cls: 'sub', text: '🍲 ' + meal }) : null
        ]),
        el('button', { cls: 'ico', 'aria-label': 'Löschen', text: '🗑', onclick: async function (e) {
          e.stopPropagation();
          var ok = await ask('Notiz vom ' + fmtShort(k) + ' löschen?', [{ label: 'Löschen', value: true, cls: 'danger' }, { label: 'Abbrechen', value: false }]);
          if (ok) setNote(k, '');
        } })
      ]));
    });
    $('showPastNotes').textContent = showPast ? 'Vergangene ausblenden' : 'Vergangene anzeigen';
  }
  $('noteSave').addEventListener('click', function () {
    var k = $('noteDate').value;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(k)) { alertBox('Bitte ein Datum wählen.'); return; }
    if (!$('noteText').value.trim()) { alertBox('Bitte einen Text eingeben.'); return; }
    setNote(k, $('noteText').value); $('noteText').value = '';
  });
  $('showPastNotes').addEventListener('click', function () { showPast = !showPast; renderNotes(); });

  // ---------- Sicherung ----------
  function renderMore() {
    var used = Object.keys(state.plan).length;
    $('stats').textContent = state.meals.length + ' Gerichte · ' + used + ' geplante Tage (inkl. Verlauf) · ' + Object.keys(state.notes).length + ' Notizen';
    $('lastBackup').textContent = state.lastBackup ? 'Letzte Sicherung: ' + new Date(state.lastBackup).toLocaleString('de-DE') : 'Noch keine Sicherung gespeichert – empfohlen!';
    $('removeSeeds').style.display = state.meals.some(function (m) { return m.seed; }) ? '' : 'none';
  }
  $('exportBtn').addEventListener('click', function () {
    var data = JSON.stringify({ app: 'essensplan', exportedAt: new Date().toISOString(), version: 1, meals: state.meals, plan: state.plan, notes: state.notes }, null, 1);
    var blob = new Blob([data], { type: 'application/json' }), a = el('a', { download: 'essensplan-sicherung-' + todayKey() + '.json' });
    a.href = URL.createObjectURL(blob); document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
    state.lastBackup = Date.now(); save(); renderMore(); snack('Sicherung im Ordner „Downloads“ gespeichert');
  });
  $('importBtn').addEventListener('click', function () { $('importFile').value = ''; $('importFile').click(); });
  $('importFile').addEventListener('change', async function () {
    var f = this.files[0]; if (!f) return;
    if (f.size > 5 * 1024 * 1024) { alertBox('Datei ist zu groß.'); return; }
    try {
      var s = EP.sanitizeState(JSON.parse(await f.text()));
      var ok = await ask('Sicherung laden?\n' + s.meals.length + ' Gerichte, ' + Object.keys(s.plan).length + ' Tage, ' + Object.keys(s.notes).length + ' Notizen.\n\nDie aktuellen Daten werden ersetzt.',
        [{ label: 'Laden', value: true, cls: 'primary' }, { label: 'Abbrechen', value: false }]);
      if (!ok) return;
      var snap = snapshot(); s.lastBackup = state.lastBackup; state = s; commit('Sicherung geladen', snap);
    } catch (e) { alertBox('Die Datei konnte nicht gelesen werden: ' + e.message); }
  });
  $('removeSeeds').addEventListener('click', async function () {
    var usedIds = {}; Object.keys(state.plan).forEach(function (k) { usedIds[state.plan[k].mealId] = 1; });
    var rm = state.meals.filter(function (m) { return m.seed && !usedIds[m.id]; });
    if (!rm.length) { alertBox('Alle Beispielgerichte werden im Plan verwendet und bleiben daher erhalten.'); return; }
    var ok = await ask(rm.length + ' Beispielgerichte entfernen, die noch nie geplant wurden?', [{ label: 'Entfernen', value: true, cls: 'danger' }, { label: 'Abbrechen', value: false }]);
    if (!ok) return;
    var snap = snapshot(); state.meals = state.meals.filter(function (m) { return rm.indexOf(m) < 0; });
    state.meals.forEach(function (m) { m.seed = false; }); commit(rm.length + ' entfernt', snap);
  });
  $('resetAll').addEventListener('click', async function () {
    var ok = await ask('Wirklich ALLES löschen?\nGerichte, Plan und Notizen sind danach weg (außer du hast eine Sicherung).', [
      { label: 'Ja, alles löschen', value: true, cls: 'danger' }, { label: 'Abbrechen', value: false }]);
    if (!ok) return;
    var snap = snapshot(); state = { version: 1, meals: [], plan: {}, notes: {}, lastBackup: null, seedVersion: SEED_VERSION }; commit('Alles gelöscht', snap);
  });

  // ---------- Navigation ----------
  function showView(v) {
    document.querySelectorAll('.view').forEach(function (s) { s.classList.toggle('active', s.id === 'view-' + v); });
    document.querySelectorAll('.tab').forEach(function (t) { t.classList.toggle('active', t.getAttribute('data-view') === v); });
    window.scrollTo(0, 0);
  }
  document.querySelectorAll('.tab').forEach(function (t) { t.addEventListener('click', function () { showView(t.getAttribute('data-view')); }); });
  $('prevWeek').addEventListener('click', function () { weekOffset--; renderGrid(); });
  $('nextWeek').addEventListener('click', function () { weekOffset++; renderGrid(); });
  $('todayBtn').addEventListener('click', function () { weekOffset = 0; showView('plan'); renderGrid(); });
  // Tippen auf den Hintergrund schließt den Tagesdialog
  $('sheet').addEventListener('click', function (e) { if (e.target === this) this.close(); });

  function renderAll() { renderGrid(); renderMeals(); renderNotes(); renderMore(); }

  // Tageswechsel (App bleibt im Hintergrund offen)
  var lastDay = todayKey();
  document.addEventListener('visibilitychange', function () { if (!document.hidden && todayKey() !== lastDay) { lastDay = todayKey(); renderAll(); } });

  // Dauerhaften Speicher anfordern, damit Android die Daten nicht automatisch löscht
  if (navigator.storage && navigator.storage.persist) {
    navigator.storage.persist().then(function (p) {
      $('persistInfo').textContent = p ? '✅ Speicher ist als dauerhaft markiert.' : 'ℹ️ Speicher nicht dauerhaft markiert – regelmäßig sichern.';
    }).catch(function () {});
  }
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(function (e) { console.warn('SW', e); });
  }

  $('noteDate').value = todayKey();
  save(); renderAll();
  window.__ep = { get state() { return state; } }; // für Tests
})();
