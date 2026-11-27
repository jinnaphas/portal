/* =========================================================================
 *  Precise Portal — app.js
 *  ไม่ต้องแก้ไฟล์นี้ในการเพิ่มเนื้อหา  →  แก้ที่ data/portal-data.js
 * ========================================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------------------
   *  Config & helpers
   * ------------------------------------------------------------------- */
  var CONFIG = Object.assign({
    orgName: 'Precise',
    title: 'Precise Portal',
    brandTagline: '',
    logo: '',
    heroTitle: 'ทุกเรื่องสำคัญขององค์กร',
    heroAccent: 'รวมไว้ในที่เดียว',
    tagline: '',
    journey: null,
    footerNote: ''
  }, window.PORTAL_CONFIG || {});

  var RAW = Array.isArray(window.PORTAL_DATA) ? window.PORTAL_DATA : [];
  var COLORS = ['orange', 'green', 'blue'];
  var FAV_KEY = 'precise-portal:favorites';

  var I = function (name, opts) { return window.PortalIcons.svg(name, opts); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var fmt = function (n) { return Number(n || 0).toLocaleString('th-TH'); };
  var norm = function (s) { return String(s || '').normalize('NFC').toLowerCase().replace(/\s+/g, ' ').trim(); };
  var asList = function (v) { return Array.isArray(v) ? v : (v ? [v] : []); };

  /* ---------------------------------------------------------------------
   *  Data model: ต้นไม้หมวดหมู่ + ดัชนีค้นหา
   * ------------------------------------------------------------------- */
  var NODES = new Map();   // path -> node
  var LINKS = new Map();   // key  -> link
  var INDEX = [];          // รายการสำหรับค้นหา

  function prepare(list, parent) {
    var out = [];
    list.forEach(function (n, i) {
      if (!n || typeof n !== 'object') return;
      n.id = String(n.id || ('item-' + (i + 1))).trim().replace(/[\s/#?%]+/g, '-');
      n.parent = parent || null;
      n.depth = parent ? parent.depth + 1 : 0;
      n.path = parent ? parent.path + '/' + n.id : n.id;
      n.color = COLORS.indexOf(n.color) > -1 ? n.color : (parent ? parent.color : COLORS[out.length % COLORS.length]);
      if (NODES.has(n.path)) console.warn('[Portal] พบ id ซ้ำ:', n.path);
      NODES.set(n.path, n);

      n.links = asList(n.links).filter(function (l) { return l && typeof l === 'object'; });
      n.links.forEach(function (l, j) {
        l._node = n;
        l._key = n.path + '::' + (l.id || l.title || j);
        LINKS.set(l._key, l);
      });

      n.children = prepare(asList(n.children), n);
      n._links = n.links.length + n.children.reduce(function (s, c) { return s + c._links; }, 0);
      n._subs = n.children.length + n.children.reduce(function (s, c) { return s + c._subs; }, 0);
      out.push(n);
    });
    return out;
  }

  var ROOTS = prepare(RAW, null);

  function trail(n) { var t = []; while (n) { t.unshift(n); n = n.parent; } return t; }
  function pathLabel(n) { return n ? trail(n).map(function (x) { return x.title; }).join(' › ') : ''; }
  function isAncestor(a, n) { while (n) { if (n === a) return true; n = n.parent; } return false; }

  function buildIndex(nodes) {
    nodes.forEach(function (n) {
      INDEX.push({
        type: 'category', node: n, title: n.title, icon: n.icon || 'folder', color: n.color, depth: n.depth,
        pathLabel: n.parent ? pathLabel(n.parent) : (n.subtitle || 'หมวดหมู่หลัก'),
        hay: norm([n.title, n.subtitle, n.description, asList(n.keywords).join(' ')].join(' '))
      });
      n.links.forEach(function (l) {
        INDEX.push({
          type: 'link', node: n, link: l, title: l.title, icon: l.icon || 'link', color: l.color || n.color, depth: n.depth + 1,
          pathLabel: pathLabel(n),
          hay: norm([l.title, l.description, asList(l.tag || l.tags).join(' '), asList(l.keywords).join(' '), n.title, n.subtitle].join(' '))
        });
      });
      buildIndex(n.children);
    });
  }
  buildIndex(ROOTS);

  function search(tokens) {
    var q = tokens.join(' ');
    return INDEX.map(function (e) {
      for (var i = 0; i < tokens.length; i++) if (e.hay.indexOf(tokens[i]) === -1) return null;
      var t = norm(e.title), score = 0;
      if (t === q) score += 100;
      if (t.indexOf(q) === 0) score += 40;
      if (t.indexOf(q) > -1) score += 20;
      tokens.forEach(function (tk) { if (t.indexOf(tk) > -1) score += 5; });
      if (e.type === 'category') score += 3;
      score -= e.depth * 0.5;
      return { e: e, s: score };
    }).filter(Boolean).sort(function (a, b) { return b.s - a.s; }).map(function (x) { return x.e; });
  }

  function highlight(text, tokens) {
    var raw = String(text || ''), low = raw.toLowerCase();
    if (!tokens.length || low.length !== raw.length) return esc(raw);
    var marks = new Array(raw.length);
    tokens.forEach(function (t) {
      var i = low.indexOf(t);
      while (t && i > -1) { for (var k = i; k < i + t.length; k++) marks[k] = true; i = low.indexOf(t, i + t.length); }
    });
    var out = '', open = false;
    for (var i = 0; i < raw.length; i++) {
      if (marks[i] && !open) { out += '<mark>'; open = true; }
      if (!marks[i] && open) { out += '</mark>'; open = false; }
      out += esc(raw[i]);
    }
    return open ? out + '</mark>' : out;
  }

  /* ---------------------------------------------------------------------
   *  Links
   * ------------------------------------------------------------------- */
  function target(l) {
    var url = String(l.url || '').trim();
    if (!url || url === '#' || /^javascript:/i.test(url)) return { href: '#', kind: 'placeholder' };
    if (url.indexOf('#/') === 0) return { href: url, kind: 'internal' };
    return { href: url, kind: 'external', newTab: l.newTab !== false };
  }
  function aAttrs(t) {
    var s = 'href="' + esc(t.href) + '"';
    if (t.kind === 'external' && t.newTab) s += ' target="_blank" rel="noopener noreferrer"';
    if (t.kind === 'placeholder') s += ' data-placeholder="1"';
    return s;
  }
  function tagClass(tag) {
    var t = norm(tag);
    if (/ใหม่|new|hot/.test(t)) return 'hot';
    if (/dashboard|report|รายงาน|data/.test(t)) return 'data';
    if (/ฟอร์ม|form|แบบฟอร์ม/.test(t)) return 'form';
    if (/จำกัด|lock|private|confidential/.test(t)) return 'lock';
    return '';
  }

  /* ---------------------------------------------------------------------
   *  Favorites (เก็บในเบราว์เซอร์ของผู้ใช้แต่ละคน)
   * ------------------------------------------------------------------- */
  var favs = (function () {
    try { var v = JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); return Array.isArray(v) ? v : []; }
    catch (e) { return []; }
  })();
  function saveFavs() { try { localStorage.setItem(FAV_KEY, JSON.stringify(favs)); } catch (e) { /* ignore */ } }
  function isFav(key) { return favs.indexOf(key) > -1; }
  function favLinks() { return favs.map(function (k) { return LINKS.get(k); }).filter(Boolean); }
  function toggleFav(key, btn) {
    var i = favs.indexOf(key);
    if (i > -1) favs.splice(i, 1); else favs.unshift(key);
    saveFavs();
    var on = isFav(key);
    document.querySelectorAll('[data-fav]').forEach(function (b) {
      if (b.getAttribute('data-fav') !== key) return;
      b.setAttribute('aria-pressed', String(on));
      b.setAttribute('aria-label', on ? 'นำออกจากรายการโปรด' : 'เพิ่มในรายการโปรด');
      b.title = on ? 'นำออกจากรายการโปรด' : 'เพิ่มในรายการโปรด';
    });
    if (btn) { btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop'); }
    updateFavCount();
    toast(on ? 'เพิ่มในรายการโปรดแล้ว' : 'นำออกจากรายการโปรดแล้ว', 'star');
    var v = route().view;
    if (v === 'home' || v === 'favorites') render({ keepScroll: true });
  }
  function updateFavCount() {
    var n = favLinks().length, el = document.getElementById('fav-count');
    if (!el) return;
    el.textContent = n > 99 ? '99+' : String(n);
    el.hidden = n === 0;
  }

  /* ---------------------------------------------------------------------
   *  Templates
   * ------------------------------------------------------------------- */
  function greeting() {
    var h = new Date().getHours();
    if (h >= 5 && h < 12) return 'สวัสดีตอนเช้า';
    if (h >= 12 && h < 17) return 'สวัสดีตอนบ่าย';
    if (h >= 17 && h < 21) return 'สวัสดีตอนเย็น';
    return 'สวัสดี';
  }
  function thaiDate() {
    try { return new Intl.DateTimeFormat('th-TH', { dateStyle: 'full' }).format(new Date()); }
    catch (e) { return new Date().toLocaleDateString(); }
  }

  function heroHTML() {
    var stats = [
      { n: ROOTS.length, label: 'หมวดหมู่', color: 'orange' },
      { n: ROOTS.reduce(function (s, r) { return s + r._subs; }, 0), label: 'หมวดย่อย', color: 'green' },
      { n: ROOTS.reduce(function (s, r) { return s + r._links; }, 0), label: 'ลิงก์', color: 'blue' }
    ];
    return '' +
      '<section class="hero">' +
        '<div class="hero-pattern" aria-hidden="true"></div>' +
        '<div class="container hero-grid' + (CONFIG.journey ? '' : ' no-aside') + '">' +
          '<div class="hero-main">' +
            '<p class="eyebrow"><span class="pulse" aria-hidden="true"></span>' + greeting() + ' · ' + esc(thaiDate()) + '</p>' +
            '<h1 class="hero-title" tabindex="-1">' + esc(CONFIG.heroTitle) +
              (CONFIG.heroAccent ? '<br><span class="accent">' + esc(CONFIG.heroAccent) + '</span>' : '') + '</h1>' +
            (CONFIG.tagline ? '<p class="lead">' + esc(CONFIG.tagline) + '</p>' : '') +
            '<button class="hero-search" type="button" data-open-search aria-label="ค้นหาหมวดหมู่ ลิงก์ หรือเอกสาร">' +
              I('search', { size: 22 }) + '<span>ค้นหาหมวดหมู่ ลิงก์ หรือเอกสาร…</span><kbd>/</kbd>' +
            '</button>' +
            '<dl class="hero-stats">' + stats.map(function (s) {
              return '<div data-color="' + s.color + '"><dt>' + s.label + '</dt><dd>' + fmt(s.n) + '</dd></div>';
            }).join('') + '</dl>' +
          '</div>' +
          (CONFIG.journey ? journeyHTML(CONFIG.journey) : '') +
        '</div>' +
      '</section>';
  }

  function journeyHTML(j) {
    var steps = asList(j.steps).map(function (s, i) {
      var color = COLORS.indexOf(s.color) > -1 ? s.color : COLORS[i % 3];
      return '<li data-color="' + color + '"><a class="journey-step" href="' + esc(s.link || '#/') + '">' +
        '<span class="step-num">' + (i + 1) + '</span>' +
        '<span class="step-body"><strong>' + esc(s.label) + '</strong>' + (s.desc ? '<span>' + esc(s.desc) + '</span>' : '') + '</span>' +
        I('chevron-right', { size: 18 }) + '</a></li>';
    }).join('');
    var goal = j.goal ? '<a class="journey-goal" href="' + esc(j.goal.link || '#/') + '">' +
      '<span class="goal-icon">' + I('sparkles', { size: 20 }) + '</span>' +
      '<span><small>' + esc(j.goal.caption || 'เป้าหมาย') + '</small><strong>' + esc(j.goal.label) + '</strong></span>' +
      I('arrow-right', { size: 18 }) + '</a>' : '';
    return '<aside class="journey" aria-label="' + esc(j.title) + '">' +
      '<div class="journey-head">' +
        (j.kicker ? '<span class="journey-kicker">' + esc(j.kicker) + '</span>' : '') +
        '<h2>' + esc(j.title) + '</h2>' + (j.subtitle ? '<p>' + esc(j.subtitle) + '</p>' : '') +
      '</div>' +
      '<ol class="journey-steps">' + steps + '</ol>' + goal + '</aside>';
  }

  function countText(n) {
    var parts = [];
    if (n._subs) parts.push(fmt(n._subs) + ' หมวดย่อย');
    parts.push(fmt(n._links) + ' ลิงก์');
    return parts.join(' · ');
  }

  function catCardHTML(n, i) {
    var chips = '';
    if (n.children.length) {
      chips = n.children.slice(0, 3).map(function (c) {
        return '<a class="chip" href="#/' + esc(c.path) + '">' + esc(c.title) + '</a>';
      }).join('') + (n.children.length > 3 ? '<span class="chip chip-more">+' + (n.children.length - 3) + '</span>' : '');
    } else if (n.links.length) {
      chips = n.links.slice(0, 3).map(function (l) {
        return '<a class="chip" ' + aAttrs(target(l)) + '>' + esc(l.title) + '</a>';
      }).join('') + (n.links.length > 3 ? '<span class="chip chip-more">+' + (n.links.length - 3) + '</span>' : '');
    }
    return '<article class="cat-card" data-color="' + n.color + '" style="--i:' + i + '">' +
      '<span class="icon-tile">' + I(n.icon || 'folder', { size: 26 }) + '</span>' +
      '<h3 class="cat-title"><a href="#/' + esc(n.path) + '">' + esc(n.title) + '</a></h3>' +
      (n.subtitle ? '<p class="cat-sub">' + esc(n.subtitle) + '</p>' : '') +
      (n.description ? '<p class="cat-desc">' + esc(n.description) + '</p>' : '') +
      (chips ? '<div class="cat-chips">' + chips + '</div>' : '') +
      '<div class="cat-spacer"></div>' +
      '<div class="cat-foot"><span>' + countText(n) + '</span><span class="arrow-circle" aria-hidden="true">' + I('arrow-right', { size: 18 }) + '</span></div>' +
    '</article>';
  }

  function tileHTML(l, opts) {
    opts = opts || {};
    var n = l._node, t = target(l), on = isFav(l._key);
    var desc = opts.showPath ? pathLabel(n) : l.description;
    var tags = asList(l.tag || l.tags);
    return '<div class="tile" data-color="' + (COLORS.indexOf(l.color) > -1 ? l.color : n.color) + '">' +
      '<span class="tile-icon">' + I(l.icon || 'link', { size: 21 }) + '</span>' +
      '<div class="tile-body">' +
        '<a class="tile-link" ' + aAttrs(t) + '>' + esc(l.title) +
          (t.kind === 'external' ? I('arrow-up-right', { size: 14 }) : '') + '</a>' +
        (desc ? '<p class="tile-desc">' + esc(desc) + '</p>' : '') +
        (tags.length ? '<div class="tile-meta">' + tags.map(function (g) {
          return '<span class="tag ' + tagClass(g) + '">' + esc(g) + '</span>';
        }).join('') + '</div>' : '') +
      '</div>' +
      '<button class="star-btn" type="button" data-fav="' + esc(l._key) + '" aria-pressed="' + on + '" ' +
        'aria-label="' + (on ? 'นำออกจากรายการโปรด' : 'เพิ่มในรายการโปรด') + '" title="' + (on ? 'นำออกจากรายการโปรด' : 'เพิ่มในรายการโปรด') + '">' +
        I('star', { size: 18 }) + '</button>' +
    '</div>';
  }

  function folderHTML(g) {
    return '<a class="folder" href="#/' + esc(g.path) + '" data-color="' + g.color + '">' +
      '<span class="folder-icon">' + I(g.icon || 'folder', { size: 20 }) + '</span>' +
      '<span class="folder-body"><span class="folder-title">' + esc(g.title) + '</span>' +
      '<span class="folder-meta">' + countText(g) + '</span></span>' +
      I('chevron-right', { size: 18 }) + '</a>';
  }

  function breadcrumbHTML(items) {
    var sep = '<span class="sep" aria-hidden="true">' + I('chevron-right', { size: 14 }) + '</span>';
    return '<nav class="breadcrumb" aria-label="เส้นทาง">' + items.map(function (it, i) {
      if (i === items.length - 1) return '<span aria-current="page">' + esc(it.title) + '</span>';
      return '<a href="' + esc(it.href) + '">' + (it.icon ? I(it.icon, { size: 15 }) : '') + esc(it.title) + '</a>';
    }).join(sep) + '</nav>';
  }

  function pageHeroHTML(o) {
    return '<section class="page-hero" data-color="' + o.color + '">' +
      '<div class="page-hero-art" aria-hidden="true">' + I(o.icon, { size: 260, stroke: 1.1 }) + '</div>' +
      '<div class="container">' +
        breadcrumbHTML(o.crumbs) +
        '<div class="page-title-row">' +
          '<span class="icon-tile lg">' + I(o.icon, { size: 32 }) + '</span>' +
          '<div class="page-title-text">' +
            (o.kicker ? '<p class="page-kicker">' + esc(o.kicker) + '</p>' : '') +
            '<h1 tabindex="-1">' + esc(o.title) + '</h1>' +
            (o.desc ? '<p class="page-desc">' + esc(o.desc) + '</p>' : '') +
            (o.pills ? '<div class="stat-pills">' + o.pills + '</div>' : '') +
          '</div>' +
        '</div>' +
        (o.subnav || '') +
      '</div>' +
    '</section>';
  }

  /* ---------------------------------------------------------------------
   *  Views
   * ------------------------------------------------------------------- */
  function viewHome() {
    var fl = favLinks();
    var favSection = fl.length ? '' +
      '<section class="section container" aria-labelledby="fav-title">' +
        '<div class="section-head"><div><h2 id="fav-title">' + I('star', { size: 22 }) + 'รายการโปรดของฉัน</h2>' +
          '<p>ลิงก์ที่คุณปักหมุดไว้ เข้าถึงได้ทันที</p></div>' +
          (fl.length > 8 ? '<a class="section-link" href="#/favorites">ดูทั้งหมด (' + fmt(fl.length) + ') ' + I('arrow-right', { size: 16 }) + '</a>' : '') +
        '</div>' +
        '<div class="link-grid">' + fl.slice(0, 8).map(function (l) { return tileHTML(l, { showPath: true }); }).join('') + '</div>' +
      '</section>' : '';

    var cats = ROOTS.length
      ? '<div class="cat-grid">' + ROOTS.map(catCardHTML).join('') + '</div>'
      : emptyHTML('ยังไม่มีหมวดหมู่', 'เพิ่มหมวดหมู่แรกได้ที่ไฟล์ data/portal-data.js', 'layout-grid');

    return {
      title: CONFIG.title,
      html: '<div class="view view-home">' + heroHTML() + favSection +
        '<section class="section container" aria-labelledby="cats-title">' +
          '<div class="section-head"><div><h2 id="cats-title">หมวดหมู่ทั้งหมด</h2>' +
          '<p>เลือกหมวดหมู่เพื่อดูหมวดย่อยและลิงก์ที่เกี่ยวข้อง</p></div>' +
          '<span class="section-meta">' + fmt(ROOTS.length) + ' หมวดหมู่</span></div>' +
          cats +
        '</section></div>'
    };
  }

  function viewNode(node) {
    var t = trail(node), root = t[0];
    var crumbs = [{ title: 'หน้าหลัก', href: '#/', icon: 'home' }].concat(t.map(function (x) {
      return { title: x.title, href: '#/' + x.path };
    }));
    var pills = (node._subs ? '<span class="stat-pill">' + I('folder', { size: 15 }) + '<strong>' + fmt(node._subs) + '</strong> หมวดย่อย</span>' : '') +
      '<span class="stat-pill">' + I('link', { size: 15 }) + '<strong>' + fmt(node._links) + '</strong> ลิงก์</span>';

    var subnav = '';
    if (node.children.length || node.parent) {
      subnav = '<nav class="subnav" aria-label="หมวดย่อย">' +
        (node.parent ? '<a class="back" href="#/' + esc(node.parent.path) + '">' + I('arrow-left', { size: 15 }) + esc(node.parent.title) + '</a>' : '') +
        node.children.map(function (c) {
          return '<a href="#/' + esc(c.path) + '">' + esc(c.title) + ' <span>' + c._links + '</span></a>';
        }).join('') + '</nav>';
    }

    var hero = pageHeroHTML({
      color: node.color, icon: node.icon || root.icon || 'folder', crumbs: crumbs,
      kicker: node.subtitle, title: node.title, desc: node.description, pills: pills, subnav: subnav
    });

    // ---- เนื้อหา ----
    var body = '', i = 0;
    if (node.links.length) {
      body += '<section class="sub-section" data-color="' + node.color + '" style="--i:' + (i++) + '">' +
        '<header class="sub-head"><span class="icon-tile sm">' + I('link', { size: 20 }) + '</span>' +
        '<div class="sub-head-text"><h2>ลิงก์ในหมวดนี้</h2><p>' + fmt(node.links.length) + ' รายการ</p></div></header>' +
        '<div class="sub-content"><div class="link-grid">' + node.links.map(function (l) { return tileHTML(l); }).join('') + '</div></div>' +
      '</section>';
    }
    node.children.forEach(function (c) {
      var hasF = c.children.length > 0, hasL = c.links.length > 0;
      body += '<section class="sub-section" data-color="' + c.color + '" style="--i:' + (i++) + '">' +
        '<header class="sub-head">' +
          '<span class="icon-tile sm">' + I(c.icon || 'folder', { size: 20 }) + '</span>' +
          '<div class="sub-head-text"><h2><a href="#/' + esc(c.path) + '">' + esc(c.title) + '</a></h2>' +
            '<p>' + (c.subtitle ? esc(c.subtitle) + ' · ' : '') + countText(c) + '</p></div>' +
          '<a class="sub-open" href="#/' + esc(c.path) + '" aria-label="เปิดหมวด ' + esc(c.title) + '"><span class="label">เปิดหมวดนี้</span>' + I('arrow-right', { size: 16 }) + '</a>' +
        '</header>' +
        (c.description ? '<p class="sub-desc">' + esc(c.description) + '</p>' : '') +
        '<div class="sub-content">' +
          (hasF ? (hasL ? '<div class="mini-label">หมวดย่อย</div>' : '') + '<div class="folder-grid">' + c.children.map(folderHTML).join('') + '</div>' : '') +
          (hasL ? (hasF ? '<div class="mini-label">ลิงก์</div>' : '') + '<div class="link-grid">' + c.links.map(function (l) { return tileHTML(l); }).join('') + '</div>' : '') +
          (!hasF && !hasL ? '<p class="empty-inline">ยังไม่มีลิงก์ในหมวดนี้</p>' : '') +
        '</div>' +
      '</section>';
    });
    if (!body) body = emptyHTML('ยังไม่มีเนื้อหาในหมวดนี้', 'เพิ่มลิงก์หรือหมวดย่อยได้ที่ไฟล์ data/portal-data.js', node.icon || 'folder');

    return {
      title: node.title + ' · ' + CONFIG.title,
      html: '<div class="view view-node" data-color="' + node.color + '">' + hero +
        '<div class="container page-body">' +
          '<aside class="side" aria-label="เมนูหมวดหมู่">' + sideHTML(root, node) + '</aside>' +
          '<div class="main-col">' + body + '</div>' +
        '</div></div>'
    };
  }

  function sideHTML(root, current) {
    function tree(n, depth) {
      return n.children.map(function (c) {
        var active = c === current, inPath = !active && isAncestor(c, current);
        var showKids = c.children.length && (depth < 1 || active || inPath);
        return '<li><a href="#/' + esc(c.path) + '" data-color="' + c.color + '" class="' + (active ? 'active' : '') + (inPath ? ' in-path' : '') + '"' +
          (active ? ' aria-current="page"' : '') + '><span class="tree-dot"></span><span class="tree-label">' + esc(c.title) + '</span>' +
          '<span class="count">' + c._links + '</span></a>' +
          (showKids ? '<ul>' + tree(c, depth + 1) + '</ul>' : '') + '</li>';
      }).join('');
    }
    var others = ROOTS.filter(function (r) { return r !== root; });
    return '<div class="side-card" data-color="' + root.color + '">' +
        '<a class="side-root' + (root === current ? ' active' : '') + '" href="#/' + esc(root.path) + '"' + (root === current ? ' aria-current="page"' : '') + '>' +
          '<span class="icon-tile">' + I(root.icon || 'folder', { size: 18 }) + '</span>' + esc(root.title) + '</a>' +
        (root.children.length ? '<ul class="tree">' + tree(root, 0) + '</ul>' : '') +
      '</div>' +
      (others.length ? '<div class="side-card side-other"><div class="side-title">หมวดหมู่อื่น</div>' +
        others.map(function (r) {
          return '<a href="#/' + esc(r.path) + '" data-color="' + r.color + '"><span class="dot"></span>' + esc(r.title) + '</a>';
        }).join('') + '</div>' : '');
  }

  function viewFavorites() {
    var fl = favLinks();
    var hero = pageHeroHTML({
      color: 'orange', icon: 'star',
      crumbs: [{ title: 'หน้าหลัก', href: '#/', icon: 'home' }, { title: 'รายการโปรด' }],
      kicker: 'My Favorites', title: 'รายการโปรดของฉัน',
      desc: 'ลิงก์ที่คุณปักหมุดไว้ด้วยปุ่มรูปดาว (บันทึกไว้ในเบราว์เซอร์นี้เท่านั้น)',
      pills: '<span class="stat-pill">' + I('star', { size: 15 }) + '<strong>' + fmt(fl.length) + '</strong> รายการ</span>'
    });
    var body = fl.length
      ? '<div class="link-grid">' + fl.map(function (l) { return tileHTML(l, { showPath: true }); }).join('') + '</div>'
      : emptyHTML('ยังไม่มีรายการโปรด', 'กดปุ่มรูปดาว ☆ ที่มุมขวาของลิงก์ใดก็ได้ เพื่อปักหมุดไว้ที่นี่', 'star', true);
    return { title: 'รายการโปรด · ' + CONFIG.title, html: '<div class="view" data-color="orange">' + hero + '<div class="container page-single">' + body + '</div></div>' };
  }

  function viewIcons() {
    var names = window.PortalIcons.names;
    var hero = pageHeroHTML({
      color: 'blue', icon: 'layout-grid',
      crumbs: [{ title: 'หน้าหลัก', href: '#/', icon: 'home' }, { title: 'ไอคอน' }],
      kicker: 'สำหรับผู้ดูแลเนื้อหา', title: 'ไอคอนที่ใช้ได้',
      desc: 'คลิกที่ไอคอนเพื่อคัดลอกชื่อ แล้วนำไปใส่ในช่อง icon ของไฟล์ data/portal-data.js (หรือใส่ Emoji แทนก็ได้)',
      pills: '<span class="stat-pill"><strong>' + names.length + '</strong> ไอคอน</span>'
    });
    var grid = '<div class="icon-gallery">' + names.map(function (n) {
      return '<button type="button" class="icon-cell" data-copy="' + esc(n) + '">' + I(n, { size: 26 }) + '<code>' + esc(n) + '</code></button>';
    }).join('') + '</div>';
    return { title: 'ไอคอน · ' + CONFIG.title, html: '<div class="view" data-color="blue">' + hero + '<div class="container page-single">' + grid + '</div></div>' };
  }

  function viewNotFound() {
    return {
      title: 'ไม่พบหน้า · ' + CONFIG.title,
      html: '<div class="view"><div class="container page-single" style="padding-top:64px">' +
        emptyHTML('ไม่พบหน้าที่คุณต้องการ', 'หมวดหมู่นี้อาจถูกย้ายหรือลบไปแล้ว ลองค้นหาอีกครั้ง', 'compass', true) + '</div></div>'
    };
  }

  function emptyHTML(title, text, icon, homeBtn) {
    return '<div class="empty-state" data-color="blue"><span class="icon-tile">' + I(icon || 'info', { size: 26 }) + '</span>' +
      '<h2' + (homeBtn ? ' tabindex="-1"' : '') + '>' + esc(title) + '</h2><p>' + esc(text) + '</p>' +
      (homeBtn ? '<a class="btn" href="#/">' + I('home', { size: 18 }) + 'กลับหน้าหลัก</a>' : '') + '</div>';
  }

  /* ---------------------------------------------------------------------
   *  Router
   * ------------------------------------------------------------------- */
  function route() {
    var h = location.hash;
    if (h.indexOf('#/') !== 0) return { view: 'home' };
    var p;
    try { p = decodeURIComponent(h.slice(2)); } catch (e) { p = h.slice(2); }
    p = p.replace(/^\/+|\/+$/g, '');
    if (!p) return { view: 'home' };
    if (p === 'favorites') return { view: 'favorites' };
    if (p === '_icons') return { view: 'icons' };
    var node = NODES.get(p);
    return node ? { view: 'node', node: node } : { view: 'notfound' };
  }

  function render(opts) {
    opts = opts || {};
    var r = route(), main = document.getElementById('main'), y = window.scrollY, v;
    if (r.view === 'home') v = viewHome();
    else if (r.view === 'favorites') v = viewFavorites();
    else if (r.view === 'icons') v = viewIcons();
    else if (r.view === 'node') v = viewNode(r.node);
    else v = viewNotFound();

    main.classList.toggle('no-anim', !!opts.keepScroll);
    main.innerHTML = v.html;
    document.title = v.title;
    document.getElementById('fav-btn').classList.toggle('is-active', r.view === 'favorites');
    updateFavCount();

    if (opts.keepScroll) { window.scrollTo(0, y); return; }
    window.scrollTo(0, 0);
    if (!opts.initial) {
      var h1 = main.querySelector('h1, h2[tabindex]');
      if (h1) h1.focus({ preventScroll: true });
    }
  }

  /* ---------------------------------------------------------------------
   *  Search palette
   * ------------------------------------------------------------------- */
  var Palette = (function () {
    var root = document.getElementById('palette');
    var input = document.getElementById('palette-input');
    var list = document.getElementById('palette-list');
    var count = 0, active = 0, lastFocus = null;

    function open() {
      if (!root.hidden) { input.focus(); input.select(); return; }
      lastFocus = document.activeElement;
      root.hidden = false;
      document.body.classList.add('no-scroll');
      input.value = '';
      update();
      input.focus(); // โฟกัสทันที เพื่อไม่ให้ตัวอักษรที่พิมพ์ต่อเนื่องหายไป
    }
    function close(restoreFocus) {
      if (root.hidden) return;
      root.hidden = true;
      document.body.classList.remove('no-scroll');
      if (restoreFocus !== false && lastFocus && lastFocus.focus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
    }
    function entryForNode(n) {
      return INDEX.find(function (e) { return e.type === 'category' && e.node === n; });
    }
    function entryForLink(l) {
      return INDEX.find(function (e) { return e.type === 'link' && e.link === l; });
    }
    function update() {
      var q = input.value, tokens = norm(q).split(' ').filter(Boolean), groups = [];
      if (!tokens.length) {
        var fl = favLinks().slice(0, 5).map(entryForLink).filter(Boolean);
        if (fl.length) groups.push({ title: 'รายการโปรด', items: fl });
        groups.push({ title: 'หมวดหมู่หลัก', items: ROOTS.map(entryForNode).filter(Boolean) });
      } else {
        var res = search(tokens);
        var cats = res.filter(function (e) { return e.type === 'category'; });
        var links = res.filter(function (e) { return e.type === 'link'; });
        if (cats.length) groups.push({ title: 'หมวดหมู่ · ' + fmt(cats.length), items: cats.slice(0, 8) });
        if (links.length) groups.push({ title: 'ลิงก์ · ' + fmt(links.length), items: links.slice(0, 24) });
        // กลุ่มที่มีผลลัพธ์ตรงที่สุดขึ้นก่อน (Enter จะเปิดรายการที่ตรงที่สุดเสมอ)
        if (res.length && res[0].type === 'link') groups.reverse();
      }
      count = groups.reduce(function (s, g) { return s + g.items.length; }, 0);
      if (!count) {
        list.innerHTML = '<div class="p-empty">' + I('search', { size: 36 }) +
          '<p>ไม่พบผลลัพธ์สำหรับ “' + esc(q) + '”</p><span>ลองใช้คำค้นอื่น หรือค้นด้วยภาษาอังกฤษ</span></div>';
        input.removeAttribute('aria-activedescendant');
        return;
      }
      var idx = 0;
      list.innerHTML = groups.map(function (g) {
        return '<div role="group" aria-label="' + esc(g.title) + '"><div class="p-group-title">' + esc(g.title) + '</div>' +
          g.items.map(function (e) { return itemHTML(e, idx++, tokens); }).join('') + '</div>';
      }).join('');
      setActive(0, true);
    }
    function itemHTML(e, i, tokens) {
      var t = e.type === 'link' ? target(e.link) : { href: '#/' + e.node.path, kind: 'internal' };
      var kind = e.type === 'category' ? 'หมวดหมู่' : (t.kind === 'external' ? I('arrow-up-right', { size: 16 }) : '');
      return '<a class="p-item" id="p-item-' + i + '" role="option" aria-selected="false" data-index="' + i + '" data-color="' + e.color + '" ' + aAttrs(t) + '>' +
        '<span class="p-icon">' + I(e.icon, { size: 19 }) + '</span>' +
        '<span class="p-text"><span class="p-title">' + highlight(e.title, tokens) + '</span>' +
        '<span class="p-path">' + esc(e.pathLabel) + '</span></span>' +
        '<span class="p-kind">' + kind + '</span>' +
        '<span class="p-enter" aria-hidden="true">' + I('corner-down-left', { size: 16 }) + '</span></a>';
    }
    function setActive(i, noScroll) {
      if (!count) return;
      active = (i + count) % count;
      list.querySelectorAll('.p-item').forEach(function (el) {
        var on = Number(el.getAttribute('data-index')) === active;
        el.classList.toggle('active', on);
        el.setAttribute('aria-selected', String(on));
        if (on) {
          input.setAttribute('aria-activedescendant', el.id);
          if (!noScroll) el.scrollIntoView({ block: 'nearest' });
        }
      });
      if (noScroll) list.scrollTop = 0;
    }

    input.addEventListener('input', update);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        var el = document.getElementById('p-item-' + active);
        if (el) el.click();
      }
      else if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'Tab') { e.preventDefault(); }
    });
    list.addEventListener('mousemove', function (e) {
      var a = e.target.closest('.p-item');
      if (a && Number(a.getAttribute('data-index')) !== active) setActive(Number(a.getAttribute('data-index')), true);
    });
    list.addEventListener('click', function (e) {
      if (e.target.closest('.p-item')) close(false);
    });
    root.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]')) close();
    });

    return { open: open, close: close, isOpen: function () { return !root.hidden; } };
  })();

  /* ---------------------------------------------------------------------
   *  Toast
   * ------------------------------------------------------------------- */
  var toastTimer;
  function toast(msg, icon) {
    var el = document.getElementById('toast');
    el.innerHTML = I(icon || 'info', { size: 18 }) + '<span>' + esc(msg) + '</span>';
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2600);
  }

  /* ---------------------------------------------------------------------
   *  Shell & events
   * ------------------------------------------------------------------- */
  function initShell() {
    var brand = document.getElementById('brand');
    var mark = CONFIG.logo
      ? '<img class="brand-logo" src="' + esc(CONFIG.logo) + '" alt="' + esc(CONFIG.orgName) + '">'
      : document.getElementById('brand-mark-tpl').innerHTML;
    var title = String(CONFIG.title), org = String(CONFIG.orgName || '');
    var nameHTML = (org && title.indexOf(org) === 0)
      ? esc(org) + '<span>' + esc(title.slice(org.length)) + '</span>'   // "Precise" เข้ม + " Portal" จาง
      : esc(title);
    brand.innerHTML = mark + '<span class="brand-text"><span class="brand-name">' + nameHTML + '</span>' +
      (CONFIG.brandTagline ? '<span class="brand-tag">' + esc(CONFIG.brandTagline) + '</span>' : '') + '</span>';
    brand.setAttribute('aria-label', CONFIG.title + ' — หน้าหลัก');

    document.querySelectorAll('[data-icon]').forEach(function (el) {
      el.innerHTML = I(el.getAttribute('data-icon'), { size: Number(el.getAttribute('data-size')) || 20 });
    });

    var y = new Date().getFullYear() + 543;
    var copyName = (org && title.indexOf(org) > -1) ? title : (org ? org + ' · ' + title : title);
    document.getElementById('footer-copy').textContent = '© ' + y + ' ' + copyName;
    document.getElementById('footer-note').textContent = CONFIG.footerNote || '';
    document.getElementById('footer-mark').innerHTML = document.getElementById('brand-mark-tpl').innerHTML;
  }

  document.addEventListener('click', function (e) {
    var el;
    if ((el = e.target.closest('[data-fav]'))) { e.preventDefault(); toggleFav(el.getAttribute('data-fav'), el); return; }
    if ((el = e.target.closest('[data-open-search]'))) { e.preventDefault(); Palette.open(); return; }
    if ((el = e.target.closest('[data-copy]'))) {
      var txt = el.getAttribute('data-copy');
      var done = function () { toast('คัดลอก "' + txt + '" แล้ว', 'check'); };
      try { navigator.clipboard.writeText(txt).then(done, function () { toast('ชื่อไอคอน: ' + txt, 'info'); }); }
      catch (err) { toast('ชื่อไอคอน: ' + txt, 'info'); }
      return;
    }
    if ((el = e.target.closest('[data-skip]'))) { e.preventDefault(); document.getElementById('main').focus(); return; }
    if ((el = e.target.closest('a[data-placeholder]'))) {
      e.preventDefault();
      toast('ลิงก์นี้ยังไม่ได้ตั้งค่าปลายทาง', 'info');
    }
  });

  document.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase();
    var typing = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); Palette.open(); return; }
    if (e.key === '/' && !typing && !Palette.isOpen()) { e.preventDefault(); Palette.open(); }
  });

  window.addEventListener('hashchange', function () {
    var h = location.hash;
    if (h && h !== '#' && h.indexOf('#/') !== 0) return; // anchor ปกติ ไม่ใช่การเปลี่ยนหน้า
    Palette.close(false);
    render();
  });

  initShell();
  render({ initial: true });
})();
