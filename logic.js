/* Essensplan – reine Logik (ohne DOM), damit sie separat testbar ist. */
(function (root) {
  'use strict';

  // ---------- Datum ----------
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function toKey(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function fromKey(k) { var p = k.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  function startOfDay(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function mondayOf(d) { var wd = (d.getDay() + 6) % 7; return addDays(startOfDay(d), -wd); }
  function diffDays(a, b) { return Math.round((startOfDay(b) - startOfDay(a)) / 86400000); }

  // ---------- Feiertage (bundesweit + Heiligabend/Silvester) ----------
  function easterSunday(y) {
    var a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4,
      f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3),
      h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4,
      l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451),
      month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(y, month - 1, day);
  }
  var holidayCache = {};
  function holidaysOfYear(y) {
    if (holidayCache[y]) return holidayCache[y];
    var e = easterSunday(y), map = {};
    function set(d, n) { map[toKey(d)] = n; }
    set(new Date(y, 0, 1), 'Neujahr');
    set(addDays(e, -2), 'Karfreitag');
    set(e, 'Ostersonntag');
    set(addDays(e, 1), 'Ostermontag');
    set(new Date(y, 4, 1), 'Tag der Arbeit');
    set(addDays(e, 39), 'Christi Himmelfahrt');
    set(addDays(e, 49), 'Pfingstsonntag');
    set(addDays(e, 50), 'Pfingstmontag');
    set(new Date(y, 9, 3), 'Tag der Dt. Einheit');
    set(new Date(y, 11, 24), 'Heiligabend');
    set(new Date(y, 11, 25), '1. Weihnachtstag');
    set(new Date(y, 11, 26), '2. Weihnachtstag');
    set(new Date(y, 11, 31), 'Silvester');
    holidayCache[y] = map;
    return map;
  }
  function holidayName(key) { return holidaysOfYear(+key.slice(0, 4))[key] || ''; }

  // ---------- Ähnlichkeit von Gerichtnamen ----------
  var STOP = { mit: 1, und: 1, an: 1, in: 1, im: 1, der: 1, die: 1, das: 1, den: 1, dem: 1, vom: 1, von: 1,
    nach: 1, art: 1, auf: 1, aus: 1, zu: 1, zum: 1, zur: 1, ein: 1, eine: 1, a: 1, la: 1, al: 1, oder: 1, dazu: 1 };

  function normalize(s) {
    return String(s || '').toLowerCase()
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/sosse|sauce/g, 'sosse')
      .replace(/[^a-z0-9]+/g, ' ').trim();
  }
  function stem(t) {
    if (t.length > 5 && /(en|er|es)$/.test(t)) return t.slice(0, -2);
    if (t.length > 4 && /[ens]$/.test(t)) return t.slice(0, -1);
    return t;
  }
  function tokens(s) {
    return normalize(s).split(' ').filter(function (t) { return t && !STOP[t]; }).map(stem);
  }
  function lev(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    var prev = [], cur = [], i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur = [i];
      for (j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur;
    }
    return prev[b.length];
  }
  function ratio(a, b) { var m = Math.max(a.length, b.length); return m ? 1 - lev(a, b) / m : 1; }
  function tokenMatch(a, b) {
    if (a === b) return 1;
    if (ratio(a, b) >= 0.8) return 0.9;
    // Komposita: "kartoffel" in "kartoffelsuppe"
    if (a.length >= 4 && b.length >= 4 && (a.indexOf(b) >= 0 || b.indexOf(a) >= 0)) return 0.6;
    return 0;
  }
  /** 0..1 – wie ähnlich sind zwei Gerichtnamen? */
  function similarity(x, y) {
    var A = tokens(x), B = tokens(y);
    if (!A.length || !B.length) return 0;
    var jx = A.join(''), jy = B.join('');
    if (jx === jy) return 1;
    var whole = ratio(jx, jy);
    var sum = 0, used = {};
    A.forEach(function (a) {
      var best = 0, bi = -1;
      B.forEach(function (b, i) { if (used[i]) return; var s = tokenMatch(a, b); if (s > best) { best = s; bi = i; } });
      if (bi >= 0 && best > 0) { used[bi] = 1; sum += best; }
    });
    var overlap = sum / Math.max(A.length, B.length);
    var contain = sum / Math.min(A.length, B.length); // eins ist Teil des anderen
    return Math.max(whole, overlap, contain * 0.8);
  }
  function isSameName(x, y) { return tokens(x).join(' ') === tokens(y).join(' ') && tokens(x).length > 0 || normalize(x) === normalize(y); }
  /** Liefert ähnliche Gerichte absteigend sortiert. */
  function findSimilar(name, meals, threshold) {
    threshold = threshold == null ? 0.62 : threshold;
    return meals.map(function (m) { return { meal: m, score: similarity(name, m.name) }; })
      .filter(function (r) { return r.score >= threshold; })
      .sort(function (a, b) { return b.score - a.score; });
  }

  // ---------- Planung ----------
  var NO_REPEAT_DAYS = 14; // kein Gericht innerhalb von 14 Tagen doppelt

  /** Tage (Keys), an denen mealId innerhalb ±13 Tagen um dayKey geplant ist (ohne dayKey selbst) */
  function conflicts(plan, mealId, dayKey) {
    var d = fromKey(dayKey), out = [];
    for (var i = -(NO_REPEAT_DAYS - 1); i <= NO_REPEAT_DAYS - 1; i++) {
      if (i === 0) continue;
      var k = toKey(addDays(d, i));
      if (plan[k] && plan[k].mealId === mealId) out.push(k);
    }
    return out;
  }
  function lastEatenBefore(plan, mealId, dayKey) {
    var best = null;
    Object.keys(plan).forEach(function (k) {
      if (k < dayKey && plan[k] && plan[k].mealId === mealId && (!best || k > best)) best = k;
    });
    return best;
  }
  /**
   * Füllt die Zieltage automatisch. Verändert eine KOPIE von plan und gibt {plan, filled, empty} zurück.
   * rnd: Zufallsfunktion (für Tests ersetzbar)
   */
  function autoFill(plan, meals, targetKeys, rnd) {
    rnd = rnd || Math.random;
    var p = JSON.parse(JSON.stringify(plan));
    targetKeys.forEach(function (k) { delete p[k]; });
    var pool = meals.filter(function (m) { return !m.noAuto; });
    var filled = 0, empty = [];
    targetKeys.slice().sort().forEach(function (k) {
      var cands = pool.filter(function (m) { return conflicts(p, m.id, k).length === 0; });
      if (!cands.length) { empty.push(k); return; }
      // Gewichtung: lange nicht gegessen bzw. nie gegessen -> wahrscheinlicher
      var weights = cands.map(function (m) {
        var last = lastEatenBefore(p, m.id, k);
        var days = last ? diffDays(fromKey(last), fromKey(k)) : 60;
        return Math.min(days, 60) + 5;
      });
      var total = weights.reduce(function (a, b) { return a + b; }, 0), r = rnd() * total, idx = 0;
      while (idx < weights.length - 1 && r >= weights[idx]) { r -= weights[idx]; idx++; }
      p[k] = { mealId: cands[idx].id };
      filled++;
    });
    return { plan: p, filled: filled, empty: empty };
  }

  function swapDays(plan, a, b) {
    var p = Object.assign({}, plan), ea = p[a], eb = p[b];
    if (eb) p[a] = eb; else delete p[a];
    if (ea) p[b] = ea; else delete p[b];
    return p;
  }

  // ---------- Datenvalidierung (Import) ----------
  function sanitizeState(raw) {
    if (!raw || typeof raw !== 'object') throw new Error('Keine gültige Sicherungsdatei.');
    var keyRe = /^\d{4}-\d{2}-\d{2}$/, out = { version: 1, meals: [], plan: {}, notes: {}, seedVersion: +raw.seedVersion || 1 }, ids = {};
    (Array.isArray(raw.meals) ? raw.meals : []).forEach(function (m) {
      if (!m || typeof m.name !== 'string' || typeof m.id !== 'string') return;
      var name = m.name.trim().slice(0, 80); if (!name || ids[m.id]) return;
      ids[m.id] = 1;
      out.meals.push({ id: m.id.slice(0, 40), name: name, info: typeof m.info === 'string' ? m.info.trim().slice(0, 200) : '',
        noAuto: !!m.noAuto, seed: !!m.seed, createdAt: +m.createdAt || Date.now() });
    });
    var plan = raw.plan && typeof raw.plan === 'object' ? raw.plan : {};
    Object.keys(plan).forEach(function (k) {
      if (keyRe.test(k) && plan[k] && ids[plan[k].mealId]) out.plan[k] = { mealId: plan[k].mealId };
    });
    var notes = raw.notes && typeof raw.notes === 'object' ? raw.notes : {};
    Object.keys(notes).forEach(function (k) {
      if (keyRe.test(k) && typeof notes[k] === 'string' && notes[k].trim()) out.notes[k] = notes[k].slice(0, 2000);
    });
    return out;
  }

  root.EP = {
    toKey: toKey, fromKey: fromKey, addDays: addDays, mondayOf: mondayOf, diffDays: diffDays, startOfDay: startOfDay,
    holidayName: holidayName, easterSunday: easterSunday,
    normalize: normalize, tokens: tokens, similarity: similarity, findSimilar: findSimilar, isSameName: isSameName,
    conflicts: conflicts, lastEatenBefore: lastEatenBefore, autoFill: autoFill, swapDays: swapDays,
    sanitizeState: sanitizeState, NO_REPEAT_DAYS: NO_REPEAT_DAYS
  };
})(typeof window !== 'undefined' ? window : globalThis);
