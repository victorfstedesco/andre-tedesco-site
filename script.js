/* André Tedesco · Landing page
   Animações sincronizadas por seção + Smooth Scroll estilo Framer (JS puro).
   Respeita prefers-reduced-motion. */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- Botões com rolagem de texto e seta ---------- */
  $$('.btn').forEach((btn) => {
    const label = btn.textContent.trim();
    const icon = btn.dataset.icon
      ? `<svg class="w-[18px] h-[18px] shrink-0" aria-hidden="true"><use href="#${btn.dataset.icon}"/></svg>` : '';
    btn.innerHTML = `${icon}<span class="roll"><span class="roll-in"><span aria-hidden="true">${label}</span><span>${label}</span></span></span>` +
      `<span class="arr" aria-hidden="true"><svg class="a1"><use href="#arrow"/></svg><svg class="a2"><use href="#arrow"/></svg></span>`;
  });

  /* ---------- Marquee contínuo: duplica o grupo ---------- */
  $$('[data-marquee]').forEach((track) => {
    const g = $('[data-marquee-group]', track);
    const clone = g.cloneNode(true); clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  /* ---------- Roadmap (desktop em escada + lista no mobile) ---------- */
  const steps = [
    { t: 'Primeiro contato', col: 0, span: 2, y: 452, kind: 'navy', b: ['Mensagem no WhatsApp', 'Resposta do próprio André', 'Dúvidas sobre o processo', 'Horário combinado'] },
    { t: 'Primeira conversa', col: 2, span: 1, y: 356, kind: 'blue', b: ['Sua história, no seu tempo', 'O que te trouxe aqui', 'Sem julgamentos'] },
    { t: 'Plano terapêutico', col: 3, span: 1, y: 260, kind: 'blue', b: ['Objetivos definidos juntos', 'Frequência das sessões', 'Primeiras ferramentas'] },
    { t: 'Sessões', col: 4, span: 2, y: 164, kind: 'soft', b: ['Registro de pensamentos', 'Exercícios entre as sessões', 'O que funcionou na semana'] },
    { t: 'Revisões do plano', col: 4, span: 2, y: 356, kind: 'white', b: ['Ajustes de frequência', 'Novos objetivos, se fizer sentido'] },
    { t: 'Encerramento', col: 5, span: 1, y: 40, kind: 'gray', b: ['Combinado, nunca sozinho'] },
  ];
  const phases = ['Hoje', 'Primeiros dias', '1ª conversa', 'Primeiras semanas', 'Ao longo dos meses', 'Quando fizer sentido'];
  const kindCls = {
    navy: 'bg-ink text-white', blue: 'bg-blue text-white', soft: 'bg-[#E3E6DF] text-ink',
    white: 'bg-white text-ink shadow-[0_2px_8px_rgba(0,0,0,.06)]', gray: 'bg-[#D9DCD4] text-ink',
  };
  const rm = $('#roadmap');
  if (rm) {
    const TOP = 56, W = 100 / 6;
    let html = '';
    for (let i = 1; i < 6; i++) html += `<span class="rm-col absolute top-[${TOP}px] bottom-0 w-px bg-[#DCDED8]" style="left:${i * W}%;--d:${i * 55}ms"></span>`;
    phases.forEach((p, i) => { html += `<span class="rm-b absolute top-6 font-mono text-[11px] tracking-[.05em] uppercase text-muted" style="left:calc(${i * W}% + 12px);--d:${i * 45}ms">${p}</span>`; });
    steps.forEach((s, i) => {
      const d = 160 + i * 105;
      html += `<div class="rm-bar absolute h-12 rounded-md flex items-center px-[22px] ${kindCls[s.kind]}" style="left:${s.col * W}%;width:${s.span * W}%;top:${TOP + s.y}px;--d:${d}ms"><span class="text-[15px] font-semibold whitespace-nowrap">${s.t}</span></div>`;
      html += `<ul class="rm-b absolute space-y-1.5 text-[13px] leading-[18px] text-muted" style="left:calc(${s.col * W}% + 22px);top:${TOP + s.y + 70}px;--d:${d}ms">${s.b.map((x) => `<li>${x}</li>`).join('')}</ul>`;
    });
    html += `<span class="rm-b absolute inline-flex items-center gap-1.5 bg-white border border-ink/20 rounded px-2 py-1 font-mono text-[10px] tracking-[.05em]" style="left:22px;top:${TOP + 452 - 34}px;--d:760ms"><span class="here-dot w-1.5 h-1.5 rounded-full bg-[#2FA36B]"></span>VOCÊ ESTÁ AQUI</span>`;
    rm.innerHTML = html;
  }
  const rmList = $('#roadmap-list');
  if (rmList) {
    const order = [0, 1, 2, 3, 4, 5];
    const phaseOf = [0, 2, 3, 4, 4, 5];
    rmList.innerHTML = order.map((i, k) => {
      const s = steps[i];
      return `<li class="band-item relative pl-8 pb-8 last:pb-0" style="--i:${k}">
        ${k < order.length - 1 ? '<span class="absolute left-[7px] top-5 bottom-0 w-px bg-[#DCDED8]"></span>' : ''}
        <span class="absolute left-0 top-1.5 w-[15px] h-[15px] rounded ${s.kind === 'navy' ? 'bg-ink' : s.kind === 'blue' ? 'bg-blue' : 'bg-white border border-ink/25'}"></span>
        <span class="block font-mono text-[11px] tracking-[.05em] uppercase text-muted">${phases[phaseOf[i]]}</span>
        <span class="inline-block mt-1.5 rounded-md px-4 py-2.5 text-[15px] font-semibold ${kindCls[s.kind]}">${s.t}</span>
        <ul class="mt-2.5 space-y-1 text-[14px] text-muted">${s.b.map((x) => `<li>${x}</li>`).join('')}</ul>
      </li>`;
    }).join('');
  }

  /* ---------- Título do hero: revelação palavra por palavra ---------- */
  const title = $('#hero-title');
  if (title) {
    let i = 0;
    [...title.childNodes].forEach((node) => {
      if (node.nodeType !== Node.TEXT_NODE) return;
      const frag = document.createElement('span');
      frag.innerHTML = node.textContent.split(' ').map((w) => (w ? `<span class="word" style="--d:${80 + (i++) * 42}ms">${w}</span>` : '')).join(' ');
      node.replaceWith(...frag.childNodes);
    });
  }

  /* ---------- Preparação de stagger alinhado por seção ---------- */
  $$('.rv:not(.hero-rv)').forEach((rv) => {
    const kids = [...rv.children];
    if (kids.length > 1) {
      kids.forEach((kid, idx) => {
        kid.classList.add('rv-kid');
        kid.style.setProperty('--kd', `${idx * 65}ms`);
      });
    }
  });

  $$('[data-band]').forEach((band) => {
    const body = $('.band-body', band);
    if (!body) return;

    // Seção "O que muda": alinha pares horizontais (01+04, 02+05, 03+06)
    const bfRowsInBand = $$('.bf-row', body);
    if (bfRowsInBand.length) {
      bfRowsInBand.forEach((row, idx) => {
        row.style.setProperty('--i', String(idx % 3));
      });
      return;
    }

    // Seção FAQ: escalona as perguntas
    const faqs = $$('.faq', body);
    if (faqs.length) {
      faqs.forEach((faq, idx) => {
        faq.classList.add('band-item');
        faq.style.setProperty('--i', String(idx));
      });
      return;
    }

    // Seção Roadmap: já possui animação própria sincronizada com .band.in
    if ($('#roadmap', body)) return;

    // Seção Sobre e Sigilo: possui coluna principal + sub-grid de cards
    const children = [...body.children];
    if (children.length === 2 && children[1].children.length >= 2 && !children[1].classList.contains('bg-ink')) {
      children[0].classList.add('band-item');
      children[0].style.setProperty('--i', '0');
      let step = 1;
      [...children[1].children].forEach((sub) => {
        if (sub.classList.contains('grid')) {
          [...sub.children].forEach((card) => {
            card.classList.add('band-item');
            card.style.setProperty('--i', String(step++));
          });
        } else {
          sub.classList.add('band-item');
          sub.style.setProperty('--i', String(step++));
        }
      });
      return;
    }

    // Padrão (Hero band, O Problema, Por que a TCC, Instagram, CTA)
    children.forEach((child, idx) => {
      child.classList.add('band-item');
      if (child.classList.contains('hover:-translate-y-1')) {
        child.classList.add('hover-lift');
      }
      child.style.setProperty('--i', String(idx));
    });
  });

  /* ---------- Revelações no scroll sincronizadas ---------- */
  const activateBand = (band) => {
    if (!band || band.classList.contains('in')) return;
    band.classList.add('in');
    $$('.rm', band).forEach((el) => el.classList.add('in'));
    setTimeout(() => band.classList.add('settled'), reduced ? 0 : 1050);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      if (el.hasAttribute('data-band')) {
        activateBand(el);
      } else {
        el.classList.add('in');
      }
      io.unobserve(el);
    });
  }, { threshold: 0.02, rootMargin: '0px 0px -10% 0px' });

  const observeAll = () => {
    $$('.rv:not(.hero-rv), .band:not([data-hero-band])').forEach((el) => io.observe(el));
  };

  const startPage = () => {
    document.body.classList.remove('loading');
    $$('.hero-rv').forEach((el) => el.classList.add('in'));
    if (title) title.classList.add('words-in');
    setTimeout(() => activateBand($('[data-hero-band]')), reduced ? 0 : 320);
    observeAll();
    onScrollFrame();
  };

  /* ---------- Navbar ---------- */
  const nav = $('#nav');
  const onScrollNav = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  const menuBtn = $('#menu-btn'), menu = $('#menu');
  menuBtn?.addEventListener('click', () => {
    const open = menu.classList.toggle('hidden') === false;
    menuBtn.setAttribute('aria-expanded', String(open));
    if (open) nav.classList.add('scrolled');
  });
  $$('#menu a').forEach((a) => a.addEventListener('click', () => { menu.classList.add('hidden'); menuBtn.setAttribute('aria-expanded', 'false'); }));

  /* ---------- O que muda: foco alinhado por linha no scroll ---------- */
  const bfList = $('#bf-list');
  const bfRows = bfList ? $$('.bf-row', bfList) : [];
  const onScrollFocus = () => {
    if (!bfList || window.innerWidth < 768 || reduced) return;
    const r = bfList.getBoundingClientRect();
    const mid = window.innerHeight / 2;
    const inZone = r.top < mid && r.bottom > mid;
    bfList.classList.toggle('bf-focus', inZone);
    if (!inZone) return;
    let bestD = Infinity;
    const dists = bfRows.map((row) => {
      const rr = row.getBoundingClientRect();
      const d = Math.abs(rr.top + rr.height / 2 - mid);
      if (d < bestD) bestD = d;
      return d;
    });
    // Destaca os itens da mesma linha horizontal (ex: 01 e 04 juntos no desktop)
    bfRows.forEach((row, idx) => row.classList.toggle('on', Math.abs(dists[idx] - bestD) < 18));
  };

  /* ---------- FAQ: uma aberta por vez ---------- */
  $$('#faq-list .faq').forEach((item) => {
    $('button', item).addEventListener('click', () => {
      const willOpen = !item.classList.contains('open');
      $$('#faq-list .faq').forEach((o) => { o.classList.remove('open'); $('button', o).setAttribute('aria-expanded', 'false'); });
      if (willOpen) { item.classList.add('open'); $('button', item).setAttribute('aria-expanded', 'true'); }
    });
  });

  /* ---------- Botão flutuante: aparece após o hero, some no CTA final ---------- */
  const fab = $('#fab');
  let ctaVisible = false;
  const ctaEl = $('#cta');
  if (ctaEl) new IntersectionObserver(([e]) => { ctaVisible = e.isIntersecting; onScrollFab(); }, { threshold: 0.2 }).observe(ctaEl);
  function onScrollFab() { fab?.classList.toggle('show', window.scrollY > window.innerHeight * 0.9 && !ctaVisible); }

  /* ---------- Parallax suave nas fotos e marca d'água do CTA ---------- */
  const ctaMark = $('#cta-mark');
  const zoomEls = $$('.zoom');
  const onScrollParallax = () => {
    if (reduced) return;
    const vh = window.innerHeight;
    if (ctaMark) {
      const r = ctaMark.parentElement.getBoundingClientRect();
      if (r.bottom >= 0 && r.top <= vh) {
        const p = (r.top + r.height / 2 - vh / 2) / vh;
        ctaMark.style.transform = `translate3d(0, ${p * 56}px, 0) rotate(${p * -6}deg)`;
      }
    }
    zoomEls.forEach((z) => {
      const parent = z.parentElement;
      if (!parent) return;
      const r = parent.getBoundingClientRect();
      if (r.bottom < -40 || r.top > vh + 40) return;
      const p = (r.top + r.height / 2 - vh / 2) / vh;
      z.style.setProperty('--py', `${(p * -18).toFixed(2)}px`);
    });
  };

  function onScrollFrame() {
    onScrollNav();
    onScrollFocus();
    onScrollFab();
    onScrollParallax();
  }

  /* ---------- Smooth Scroll estilo Framer (inércia suave + âncoras) ---------- */
  let currentY = window.scrollY;
  let targetY = window.scrollY;
  let rafId = null;
  let lastTime = 0;
  let anchorAnim = null;

  const getMaxScroll = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

  const smoothStep = (now) => {
    const dt = lastTime ? Math.min(64, now - lastTime) : 16.67;
    lastTime = now;

    if (anchorAnim) {
      const elapsed = now - anchorAnim.start;
      const t = clamp(elapsed / anchorAnim.duration, 0, 1);
      const eased = easeOutQuart(t);
      currentY = anchorAnim.from + (anchorAnim.to - anchorAnim.from) * eased;
      targetY = currentY;
      window.scrollTo(0, currentY);
      onScrollFrame();
      if (t < 1) {
        rafId = requestAnimationFrame(smoothStep);
      } else {
        anchorAnim = null;
        rafId = null;
        lastTime = 0;
      }
      return;
    }

    targetY = clamp(targetY, 0, getMaxScroll());
    const diff = targetY - currentY;

    if (Math.abs(diff) > 0.15) {
      // Amortecimento exponencial independente de FPS (sensação Framer/Lenis)
      const alpha = 1 - Math.exp(-dt * 0.012);
      currentY += diff * alpha;
      window.scrollTo(0, currentY);
      onScrollFrame();
      rafId = requestAnimationFrame(smoothStep);
    } else {
      currentY = targetY;
      window.scrollTo(0, targetY);
      onScrollFrame();
      rafId = null;
      lastTime = 0;
    }
  };

  const startSmoothLoop = () => {
    if (!rafId) {
      lastTime = performance.now();
      rafId = requestAnimationFrame(smoothStep);
    }
  };

  if (!reduced && finePointer) {
    window.addEventListener('wheel', (e) => {
      if (e.ctrlKey || e.metaKey || document.body.classList.contains('loading')) return;
      e.preventDefault();
      if (anchorAnim) anchorAnim = null;
      if (!rafId) {
        currentY = window.scrollY;
        targetY = currentY;
      }
      let dy = e.deltaY;
      if (e.deltaMode === 1) dy *= 16;
      else if (e.deltaMode === 2) dy *= window.innerHeight;
      targetY = clamp(targetY + dy, 0, getMaxScroll());
      startSmoothLoop();
    }, { passive: false });
  }

  // Navegação suave nas âncoras (#abordagem, #como-funciona, #sobre, #sigilo, #faq, #topo)
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      const targetEl = $(hash);
      if (!targetEl) return;
      e.preventDefault();
      const offset = hash === '#topo' ? 0 : 80;
      const dest = clamp(targetEl.getBoundingClientRect().top + window.scrollY - offset, 0, getMaxScroll());
      history.pushState(null, '', hash);
      if (reduced) {
        window.scrollTo(0, dest);
        currentY = targetY = dest;
        onScrollFrame();
        return;
      }
      currentY = window.scrollY;
      targetY = dest;
      anchorAnim = { from: currentY, to: dest, start: performance.now(), duration: 820 };
      startSmoothLoop();
    });
  });

  // Mantém sincronizado caso o usuário role pela barra de rolagem, teclado ou touch
  let scrollTick = false;
  window.addEventListener('scroll', () => {
    if (!rafId) {
      currentY = window.scrollY;
      targetY = currentY;
    }
    if (scrollTick || rafId) return;
    scrollTick = true;
    requestAnimationFrame(() => { onScrollFrame(); scrollTick = false; });
  }, { passive: true });

  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  /* ---------- Loader (só na primeira visita da sessão) ---------- */
  const loader = $('#loader');
  let seen = false;
  try { seen = sessionStorage.getItem('at-intro') === '1'; } catch (e) { /* storage indisponível */ }
  if (!loader || seen || reduced) { loader?.remove(); startPage(); return; }

  $$('.logo-anim line', loader).forEach((l, i) => l.style.setProperty('--d', `${250 + i * 32}ms`));
  $$('.logo-anim circle', loader).forEach((c, i) => c.style.setProperty('--d', `${600 + i * 45}ms`));
  requestAnimationFrame(() => requestAnimationFrame(() => loader.classList.add('go')));

  const count = $('#ld-count'), prog = $('#ld-prog'), phrase = $('#ld-phrase'), label = $('#ld-label'), win = $('#ld-win');
  const MIN = 2000, MAX = 6500, t0 = performance.now();
  let loaded = document.readyState === 'complete', shown = 0, current = phrase.textContent, done = false;
  window.addEventListener('load', () => { loaded = true; });

  const setPhrase = (txt) => {
    if (txt === current) return; current = txt;
    phrase.style.opacity = 0;
    setTimeout(() => { phrase.textContent = txt; phrase.style.opacity = 1; }, 300);
  };

  const tick = (now) => {
    const el = now - t0;
    const ready = (loaded && el > MIN) || el > MAX;
    const target = ready ? 100 : Math.min(92, (el / MIN) * 92);
    shown += (target - shown) * 0.07 + (shown < target ? 0.15 : 0);
    shown = Math.min(shown, target);
    const n = Math.round(shown);
    count.textContent = String(n).padStart(3, '0');
    prog.style.width = `${shown}%`;
    setPhrase(n < 40 ? 'Respire fundo.' : n < 96 ? 'Preparando um espaço seguro para você.' : 'Bem-vindo.');
    if (n >= 100 && !done) { done = true; label.textContent = 'Pronto'; setTimeout(reveal, 350); return; }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  function reveal() {
    const top = window.innerHeight / 2 - 120;
    const m = Math.max(16, (window.innerWidth - 1200) / 2);
    win.style.transition = 'none';
    win.style.clipPath = `inset(${top}px ${m}px ${top}px ${m}px round 6px)`;
    win.classList.add('on');
    loader.classList.add('light');
    win.getBoundingClientRect();
    win.style.transition = '';
    requestAnimationFrame(() => { win.style.clipPath = 'inset(0px 0px 0px 0px round 0px)'; });
    try { sessionStorage.setItem('at-intro', '1'); } catch (e) { /* ignore */ }
    setTimeout(() => {
      loader.classList.add('out');
      startPage();
      setTimeout(() => loader.remove(), 800);
    }, 1150);
  }
})();
