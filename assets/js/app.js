/* ═══════════════════════════════════════════════
   SÉRIE VILA — Neymar Jr · interações
   sem dependências, vanilla JS
   ═══════════════════════════════════════════════ */
(function () {
  'use strict';

  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const body = document.body;
  const html = document.documentElement;

  const RM   = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = matchMedia('(pointer: fine)').matches;

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp  = (a, b, t) => a + (b - a) * t;
  const expo  = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

  /* ── toast ─────────────────────────────────── */
  let toastT;
  const toastEl = $('#toast');
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('show'), 1900);
  }

  /* ═══════════════════════════════════════════════
     MOTOR DE SCROLL — inspirado no landonorris.com
     · smooth scroll com lerp (estilo Lenis)
     · parallax [data-px] e skew por velocidade
     · marquees acelerados pela velocidade do scroll
     · galeria horizontal dirigida pelo scroll (sticky)
     · títulos fatiados em linhas com máscara
     ═══════════════════════════════════════════════ */
  const smoothEl = $('#smooth'), spacer = $('#scrollSpace');
  const marqTrack = $('.marquee-track'), fmTrack = $('.fm-track');
  const hscroll = $('[data-hscroll]'), stripEl = $('.strip');
  const heroInner = $('.hero-inner'), heroPhoto = $('.hero-photo');
  const cuts = $$('.cut'), cpPhoto = $('.cp-photo');
  const heroTen = $('#heroTen'), heroGlow = $('#heroGlow');

  let cur = window.scrollY, vel = 0, lastCur = cur;
  let vh = window.innerHeight, vw = window.innerWidth;
  let smoothOK = false, hscrollOK = false;
  let marqX = 0, marqHalf = 0, fmX = 0, fmHalf = 0;
  let pxItems = [], hsExtra = 0, hsBase = 0;

  function docTop(el) {
    return el.getBoundingClientRect().top + cur;
  }

  function measure() {
    vh = window.innerHeight; vw = window.innerWidth;
    if (smoothEl && spacer) spacer.style.height = smoothEl.scrollHeight + 'px';
    if (marqTrack) marqHalf = marqTrack.scrollWidth / 2;
    if (fmTrack) fmHalf = fmTrack.scrollWidth / 2;
    pxItems.forEach(o => {
      o.el.style.transform = 'none';
      o.base = o.el.getBoundingClientRect().top + cur + o.el.offsetHeight / 2;
      o.el.style.transform = '';
    });
    if (hscrollOK && hscroll && stripEl) {
      stripEl.style.transform = 'none';
      hsExtra = Math.max(0, stripEl.scrollWidth - vw);
      hsBase = hscroll.getBoundingClientRect().top + cur;
      hscroll.style.height = (hsExtra + vh) + 'px';
    }
  }

  function applyModes() {
    smoothOK = !RM && FINE && vw > 980;
    hscrollOK = !RM && vw > 980;
    body.classList.toggle('smooth-on', smoothOK);
    body.classList.toggle('hscroll-on', hscrollOK);
    if (marqTrack) body.classList.add('js-drive');
    /* na pista horizontal o lazy-load nunca dispara — vira eager */
    if (hscrollOK) $$('img[loading="lazy"]').forEach(i => { i.loading = 'eager'; });
  }

  /* títulos .sec-title viram linhas mascaradas */
  $$('.sec-title').forEach(t => {
    const parts = t.innerHTML.split(/<br\s*\/?>/i);
    t.innerHTML = parts.map(p => '<span class="line"><span class="line-in">' + p + '</span></span>').join('');
  });

  /* parallax: elementos marcados + hero */
  function collectPx() {
    pxItems = [];
    $$('[data-px]').forEach(el => {
      pxItems.push({ el: el, f: parseFloat(el.dataset.px) || 0.1, base: 0 });
    });
    if (heroTen) pxItems.push({ el: heroTen, f: 0.16, base: 0 });
    if (heroGlow) pxItems.push({ el: heroGlow, f: 0.07, base: 0 });
  }

  function frame() {
    const target = window.scrollY;

    if (smoothOK && smoothEl) {
      cur = lerp(cur, target, 0.095);
      if (Math.abs(cur - target) < 0.1) cur = target;
      smoothEl.style.transform = 'translate3d(0,' + (-cur).toFixed(2) + 'px,0)';
    } else {
      cur = target;
    }

    vel = cur - lastCur; lastCur = cur;
    const vClamp = clamp(vel, -80, 80);

    /* parallax */
    for (let i = 0; i < pxItems.length; i++) {
      const o = pxItems[i];
      const screenPos = o.base - cur;
      if (screenPos > -vh && screenPos < vh * 1.5) {
        o.el.style.transform = 'translate3d(0,' + ((vh / 2 - screenPos) * o.f).toFixed(1) + 'px,0)';
      }
    }

    /* saída do hero: conteúdo sobe e some, foto sai mais devagar */
    if (heroInner && cur < vh * 1.2) {
      const p = clamp(cur / (vh * 0.75), 0, 1);
      heroInner.style.opacity = (1 - p).toFixed(3);
      heroInner.style.transform = 'translate3d(0,' + (cur * 0.16).toFixed(1) + 'px,0)';
      if (heroPhoto) heroPhoto.style.transform = 'translateY(-50%) translate3d(0,' + (-cur * 0.08).toFixed(1) + 'px,0)';
    }

    /* skew por velocidade (galeria + foto do capítulo) */
    if (Math.abs(vClamp) > 0.5) {
      const sk = ' skewY(' + (vClamp * 0.018).toFixed(2) + 'deg)';
      for (let i = 0; i < cuts.length; i++) cuts[i].style.transform = 'skewY(' + (vClamp * 0.018).toFixed(2) + 'deg)';
      if (cpPhoto) cpPhoto.style.transform = 'skewY(' + (vClamp * 0.01).toFixed(2) + 'deg)';
    }

    /* marquees: base + velocidade do scroll, direção acompanha */
    if (!RM) {
      if (marqTrack && marqHalf) {
        marqX -= 0.55 + vClamp * 0.28;
        if (marqX <= -marqHalf) marqX += marqHalf;
        if (marqX > 0) marqX -= marqHalf;
        marqTrack.style.transform = 'translate3d(' + marqX.toFixed(1) + 'px,0,0)';
      }
      if (fmTrack && fmHalf) {
        fmX -= 0.9 + vClamp * 0.4;
        if (fmX <= -fmHalf) fmX += fmHalf;
        if (fmX > 0) fmX -= fmHalf;
        fmTrack.style.transform = 'translate3d(' + fmX.toFixed(1) + 'px,0,0)';
      }
    }

    /* galeria horizontal: progresso do scroll vira deslocamento lateral */
    if (hscrollOK && hscroll && stripEl && hsExtra > 0) {
      const prog = clamp((cur - hsBase) / hsExtra, 0, 1);
      stripEl.style.transform = 'translate3d(' + (-prog * hsExtra).toFixed(1) + 'px,0,0)';
    }

    requestAnimationFrame(frame);
  }

  applyModes();
  collectPx();
  measure();
  if (!RM) requestAnimationFrame(frame);

  let rsT;
  addEventListener('resize', () => {
    clearTimeout(rsT);
    rsT = setTimeout(() => { applyModes(); measure(); }, 150);
  });
  /* imagens mudam as larguras — re-medir quando carregarem */
  addEventListener('load', measure);
  $$('img').forEach(i => i.addEventListener('load', measure, { once: true }));
  if (smoothEl && 'ResizeObserver' in window) {
    new ResizeObserver(() => {
      if (spacer) spacer.style.height = smoothEl.scrollHeight + 'px';
    }).observe(smoothEl);
  }

  /* âncoras: pulo instantâneo do scroll nativo, o lerp desliza */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: Math.max(0, docTop(t) - 76), behavior: smoothOK ? 'instant' : 'smooth' });
    });
  });

  /* ── tema noite / marfim ───────────────────── */
  const themeBtn = $('#themeToggle');
  function applyTheme(t) {
    html.dataset.theme = t;
    if (themeBtn) themeBtn.setAttribute('aria-pressed', t === 'marfim');
    try { localStorage.setItem('nj-theme', t); } catch (e) { /* modo privado */ }
  }
  try {
    const saved = localStorage.getItem('nj-theme');
    if (saved === 'marfim' || saved === 'noite') applyTheme(saved);
  } catch (e) { /* sem storage */ }
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = html.dataset.theme === 'noite' ? 'marfim' : 'noite';
      applyTheme(next);
      showToast(next === 'marfim' ? 'MODO MARFIM — CLARO' : 'MODO NOITE — ESCURO');
    });
  }

  /* ── separar palavras (manifesto + citação) ── */
  function splitWords(p) {
    let i = 0;
    const wrapText = (node, parent) => {
      const parts = node.textContent.split(/(\s+)/);
      parts.forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { parent.appendChild(document.createTextNode(' ')); return; }
        const s = document.createElement('span');
        s.className = 'w';
        s.style.setProperty('--i', i++);
        s.textContent = part;
        parent.appendChild(s);
      });
    };
    Array.from(p.childNodes).forEach(node => {
      if (node.nodeType === 3) {
        const frag = document.createDocumentFragment();
        wrapText(node, frag);
        p.replaceChild(frag, node);
      } else if (node.nodeType === 1) {
        const em = node;
        while (em.firstChild) em.removeChild(em.firstChild);
        /* re-insere as palavras dentro do <em> */
        const words = node.textContent;
        em.textContent = '';
        const tmp = document.createElement('span');
        tmp.textContent = words;
        wrapText(tmp, em);
      }
    });
  }
  $$('.split-words, .quote-line').forEach(splitWords);

  /* ── contadores ────────────────────────────── */
  function runCounter(b) {
    const target = parseFloat(b.dataset.target) || 0;
    const pre  = b.dataset.prefix  || '';
    const suf  = b.dataset.suffix  || '';
    if (RM) { b.textContent = pre + target + suf; return; }
    const t0 = performance.now(), DUR = 1500;
    (function frame(now) {
      const p = clamp((now - t0) / DUR, 0, 1);
      b.textContent = pre + Math.round(expo(p) * target) + suf;
      if (p < 1) requestAnimationFrame(frame);
    })(t0);
  }

  /* ── reveals (só depois do preloader) ──────── */
  let revealsReady = false;
  function initReveals() {
    if (revealsReady) return;
    revealsReady = true;

    $$('[data-reveal]').forEach(el => {
      const d = el.getAttribute('data-delay');
      if (d) el.style.setProperty('--d', d + 'ms');
    });

    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.classList.add('inview');
        io.unobserve(en.target);
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -6% 0px' });

    $$('[data-reveal], .bars, .split-words, .quote-line, .sec-title').forEach(el => io.observe(el));

    const ioCount = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        runCounter(en.target);
        ioCount.unobserve(en.target);
      });
    }, { threshold: 0.6 });
    $$('[data-counter]').forEach(b => ioCount.observe(b));
  }

  /* ── preloader ─────────────────────────────── */
  const pre = $('#preloader'), pct = $('#prePct'), preBar = $('#preBar');
  function finishLoad() {
    if (body.classList.contains('loaded')) return;
    body.classList.add('loaded');
    if (pre) {
      pre.classList.add('done');
      setTimeout(() => { pre.style.visibility = 'hidden'; }, 1000);
    }
    initReveals();
  }
  if (RM || !pre) {
    finishLoad();
  } else {
    const t0 = performance.now(), DUR = 1150;
    (function tick(now) {
      const p = clamp((now - t0) / DUR, 0, 1);
      const e = expo(p);
      if (pct) pct.textContent = String(Math.round(e * 100)).padStart(3, '0');
      if (preBar) preBar.style.transform = 'scaleX(' + e + ')';
      if (p < 1) requestAnimationFrame(tick);
      else setTimeout(finishLoad, 160);
    })(t0);
    setTimeout(finishLoad, 5000); /* rede lenta? não trava */
  }

  /* ── nav: fundo, esconder ao descer, progresso ── */
  const nav = $('#nav'), progressBar = $('#progressBar');
  const heroTen = $('#heroTen'), heroGlow = $('#heroGlow');
  let lastY = 0, ticking = false;
  function onScroll() {
    ticking = false;
    const y = window.scrollY;
    if (nav) {
      nav.classList.toggle('scrolled', y > 24);
      if (y > lastY + 6 && y > 340 && !body.classList.contains('menu-open')) {
        nav.classList.add('nav--hidden');
      } else if (y < lastY - 4) {
        nav.classList.remove('nav--hidden');
      }
    }
    lastY = y;
    const max = Math.max(1, html.scrollHeight - window.innerHeight);
    if (progressBar) progressBar.style.transform = 'scaleX(' + (y / max) + ')';
  }
  addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* link ativo na nav conforme a seção visível */
  const navLinks = $$('.nav-links a[data-sec]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    const secIO = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        navLinks.forEach(a => {
          a.removeAttribute('data-active');
          if (a.dataset.sec === en.target.id) a.setAttribute('data-active', '');
        });
      });
    }, { rootMargin: '-38% 0px -55% 0px' });
    navLinks.forEach(a => {
      const sec = document.getElementById(a.dataset.sec);
      if (sec) secIO.observe(sec);
    });
  }

  /* ── menu tela cheia ───────────────────────── */
  const menuBtn = $('#menuBtn'), menu = $('#menu');
  function setMenu(open) {
    body.classList.toggle('menu-open', open);
    if (menuBtn) menuBtn.setAttribute('aria-expanded', open);
    if (menu) menu.setAttribute('aria-hidden', !open);
  }
  if (menuBtn) menuBtn.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
  $$('.menu-links a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* ── cursor customizado ────────────────────── */
  if (FINE && !RM) {
    body.classList.add('fine-cursor');
    const cur = $('#cursor');
    if (cur) {
      const dot = $('.cursor-dot', cur), ring = $('.cursor-ring', cur);
      let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
      addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        cur.classList.add('on');
        dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
      });
      (function loop() {
        rx = lerp(rx, mx, 0.16); ry = lerp(ry, my, 0.16);
        ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
        requestAnimationFrame(loop);
      })();
      const HOVER = 'a,button,[data-hover],input[type=range]';
      document.addEventListener('mouseover', e => {
        if (e.target.closest(HOVER)) cur.classList.add('is-hover');
      });
      document.addEventListener('mouseout', e => {
        if (e.target.closest(HOVER)) cur.classList.remove('is-hover');
      });
      document.addEventListener('mouseleave', () => cur.classList.remove('on'));
      document.addEventListener('mouseenter', () => cur.classList.add('on'));
    }
  }

  /* ── botões magnéticos ─────────────────────── */
  if (FINE && !RM) {
    $$('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.32;
        const y = (e.clientY - r.top - r.height / 2) * 0.32;
        el.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      });
      el.addEventListener('mouseleave', () => { el.style.transform = 'translate(0,0)'; });
    });
  }

  /* ── pôsteres com tilt ─────────────────────── */
  if (FINE && !RM) {
    $$('[data-tilt]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform =
          'perspective(900px) rotateX(' + (-py * 7) + 'deg) rotateY(' + (px * 9) + 'deg) translateY(-4px)';
        el.style.setProperty('--mx', ((px + 0.5) * 100) + '%');
        el.style.setProperty('--my', ((py + 0.5) * 100) + '%');
      });
      el.addEventListener('mouseleave', () => { el.style.transform = 'perspective(900px)'; });
    });
  }

  /* ── trajetória: capítulos por clube ───────── */
  const CLUBS = {
    santos1: {
      tag: 'A ORIGEM', years: '2009—2013', name: 'Santos FC',
      games: 230, goals: 138, color: '#C6A15B',
      img: 'assets/img/santos1-2011.jpg',
      blurb: 'Aos 17 anos, um garoto de Mogi devolveu o Santos ao topo da América. Libertadores de 2011, dribles em série e um bilhete só de ida para a Europa.',
      tags: ['LIBERTADORES 2011', 'COPA DO BRASIL 2010', 'PAULISTA ×3']
    },
    barca: {
      tag: 'A CONSAGRAÇÃO', years: '2013—2017', name: 'FC Barcelona',
      games: 186, goals: 105, color: '#A50044',
      img: 'assets/img/barca.jpg',
      blurb: 'MSN: a tríade mais devastadora do futebol moderno. Ao lado de Messi e Suárez, o triplete de 2014-15 e a Champions que veio completar a prateleira.',
      tags: ['CHAMPIONS LEAGUE 2015', 'MUNDIAL 2015', 'LA LIGA ×2', 'COPA DEL REY ×3']
    },
    psg: {
      tag: 'A TRANSFERÊNCIA', years: '2017—2023', name: 'Paris Saint-Germain',
      games: 173, goals: 118, color: '#004170',
      img: 'assets/img/psg-trio.jpg',
      blurb: '€222 milhões e Paris de joelhos. O recorde mundial de transferência, marcas históricas na Ligue 1 — e a lua-de-mel eternamente interrompida pela Champions.',
      tags: ['LIGUE 1 ×5', 'COPA DA FRANÇA ×3', 'RECORDE €222M']
    },
    hilal: {
      tag: 'O INTERREGNO', years: '2023—2025', name: 'Al-Hilal',
      games: 7, goals: 1, color: '#1E56C8',
      img: 'assets/img/hilal.jpg',
      blurb: 'O capítulo árabe: poucos minutos, muitas lágrimas. O joelho cedeu antes da adaptação — a estrela, essa, nunca baixou o brilho.',
      tags: ['RIADE', 'SAUDI PRO LEAGUE']
    },
    santos2: {
      tag: 'O RETORNO', years: '2025 —', name: 'Santos FC',
      live: true, color: '#EFEAE0',
      img: 'assets/img/santos2-juventude.jpg',
      blurb: 'A volta pra casa. Aos 33, o Menino da Vila reescreve o final na mesma arquibancada onde tudo começou — dessa vez, como lenda viva.',
      tags: ['VILA BELMIRO', 'CAPÍTULO ABERTO', 'CONTRATO ATÉ 2027']
    }
  };

  const panel = $('#clubPanel'), inner = $('#cpInner');
  function setClub(key, btn) {
    const c = CLUBS[key];
    if (!c || !panel) return;
    $$('.club-btn').forEach(b => {
      const on = b === btn;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on);
    });
      inner.classList.add('switching');
    setTimeout(() => {
      panel.style.setProperty('--club', c.color);
      const ph = $('#cpPhoto');
      if (ph) {
        ph.src = c.img;
        ph.alt = 'Neymar no capítulo ' + c.name;
      }
      $('#cpTag').textContent = c.tag;
      $('#cpYears').textContent = c.years;
      $('#cpName').textContent = c.name;
      $('#cpBlurb').textContent = c.blurb;
      if (c.live) {
        $('#cpGames').textContent = '—';
        $('#cpGoals').textContent = '—';
        $('#cpAvg').textContent = '—';
      } else {
        $('#cpGames').textContent = c.games;
        $('#cpGoals').textContent = c.goals;
        $('#cpAvg').textContent = (c.goals / c.games).toFixed(2).replace('.', ',');
      }
      const tags = $('#cpTags');
      tags.innerHTML = '';
      c.tags.forEach(t => {
        const s = document.createElement('span');
        s.className = 'chip mono';
        s.textContent = t;
        tags.appendChild(s);
      });
      inner.classList.remove('switching');
    }, 240);
  }
  $$('.club-btn').forEach(b => b.addEventListener('click', () => setClub(b.dataset.club, b)));

  /* ── copiar cores / tokens ─────────────────── */
  function copyText(txt) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(txt);
    return new Promise((res, rej) => {
      const ta = document.createElement('textarea');
      ta.value = txt;
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); res(); }
      catch (err) { rej(err); }
      ta.remove();
    });
  }
  $$('.swatch').forEach(s => s.addEventListener('click', () => {
    const hex = s.dataset.copy;
    copyText(hex)
      .then(() => showToast('HEX COPIADO — ' + hex))
      .catch(() => showToast(hex));
  }));
  const copyBtn = $('#copyTokens');
  if (copyBtn) copyBtn.addEventListener('click', () => {
    const tokens = JSON.stringify({
      serie: 'Vila — NJ10',
      cores: {
        alvinegro: '#09090C', marfim: '#EFEAE0', ouro: '#C6A15B',
        ouroClaro: '#E7CE9A', jade: '#2F6B58', garnet: '#A50044', azulParis: '#004170'
      },
      tipos: { display: 'Fraunces', texto: 'Space Grotesk', dados: 'IBM Plex Mono' },
      grid: { colunas: 12, gutter: 24, base: 8 }
    }, null, 2);
    copyText(tokens)
      .then(() => showToast('TOKENS COPIADOS — 7 CORES · 3 FONTES'))
      .catch(() => showToast('FALHA AO COPIAR'));
  });

  /* ── slider de escala tipográfica ──────────── */
  const slider = $('#specSize'), specT = $('#specTarget');
  if (slider && specT) {
    slider.addEventListener('input', () => { specT.style.fontSize = slider.value + 'px'; });
  }

  /* ── imagens: some com o recorte se o arquivo faltar ── */
  function killBroken(img) {
    const f = img.closest('figure, .cut');
    if (f) f.style.display = 'none';
    img.style.display = 'none';
  }
  $$('img').forEach(img => {
    if (img.complete && img.naturalWidth === 0) { killBroken(img); return; }
    img.addEventListener('error', () => killBroken(img));
  });

  /* ── galeria: arrastar para rolar (só no modo nativo) ── */
  const strip = $('.strip');
  if (strip && !hscrollOK) {
    let down = false, startX = 0, startL = 0, moved = false;
    strip.addEventListener('pointerdown', e => {
      if (body.classList.contains('hscroll-on')) return;
      down = true; moved = false;
      startX = e.clientX; startL = strip.scrollLeft;
      strip.classList.add('dragging');
    });
    addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 6) moved = true;
      strip.scrollLeft = startL - dx;
    });
    addEventListener('pointerup', () => {
      down = false;
      strip.classList.remove('dragging');
    });
    strip.addEventListener('click', e => { if (moved) e.preventDefault(); });
  }

  /* ── confetti dourado (clique no 10 / NJ) ──── */
  const cv = $('#fx');
  if (cv && cv.getContext) {
    const ctx = cv.getContext('2d');
    let parts = [], running = false;
    function sizeFx() {
      const d = Math.min(devicePixelRatio || 1, 2);
      cv.width = innerWidth * d; cv.height = innerHeight * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
    }
    sizeFx();
    addEventListener('resize', sizeFx);
    function burst(x, y) {
      const colors = ['#C6A15B', '#E7CE9A', '#EFEAE0', '#2F6B58'];
      for (let i = 0; i < 90; i++) {
        const a = Math.random() * Math.PI * 2, sp = 4 + Math.random() * 10;
        parts.push({
          x, y,
          vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 5,
          g: 0.34, rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
          w: 3 + Math.random() * 5, h: 6 + Math.random() * 8,
          c: colors[i % 4], t: 0, l: 70 + Math.random() * 40
        });
      }
      if (!running) { running = true; requestAnimationFrame(fxLoop); }
    }
    function fxLoop() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      parts = parts.filter(p => p.t < p.l && p.y < innerHeight + 40);
      parts.forEach(p => {
        p.t++; p.x += p.vx; p.y += p.vy; p.vy += p.g; p.vx *= 0.985; p.rot += p.vr;
        ctx.save();
        ctx.globalAlpha = p.t > p.l - 30 ? (p.l - p.t) / 30 : 1;
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (parts.length) requestAnimationFrame(fxLoop);
      else { running = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
    }
    if (heroTen) heroTen.addEventListener('click', e => {
      burst(e.clientX || innerWidth / 2, e.clientY || innerHeight / 2);
      showToast('GOOOOL — MENINO DA VILA');
    });
    const fnj = $('#footNj');
    if (fnj) fnj.addEventListener('click', e => burst(e.clientX, e.clientY));
  }

  /* ── rodapé / topo ─────────────────────────── */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  const toTop = $('#toTop');
  if (toTop) toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' });
  });

})();
