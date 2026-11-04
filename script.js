/* André Tedesco · Landing page
   Animações em JS puro (sem bibliotecas). Respeita prefers-reduced-motion. */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
    for (let i = 1; i < 6; i++) html += `<span class="rm-col absolute top-[${TOP}px] bottom-0 w-px bg-[#DCDED8]" style="left:${i * W}%;--d:${i * 70}ms"></span>`;
    phases.forEach((p, i) => { html += `<span class="absolute top-6 font-mono text-[11px] tracking-[.05em] uppercase text-muted" style="left:calc(${i * W}% + 12px)">${p}</span>`; });
    steps.forEach((s, i) => {
      const d = 450 + i * 160;
      html += `<div class="rm-bar absolute h-12 rounded-md flex items-center px-[22px] ${kindCls[s.kind]}" style="left:${s.col * W}%;width:${s.span * W}%;top:${TOP + s.y}px;--d:${d}ms"><span class="text-[15px] font-semibold whitespace-nowrap">${s.t}</span></div>`;
      html += `<ul class="rm-b absolute space-y-1.5 text-[13px] leading-[18px] text-muted" style="left:calc(${s.col * W}% + 22px);top:${TOP + s.y + 70}px;--d:${d}ms">${s.b.map((x) => `<li>${x}</li>`).join('')}</ul>`;
    });
    html += `<span class="rm-b absolute inline-flex items-center gap-1.5 bg-white border border-ink/20 rounded px-2 py-1 font-mono text-[10px] tracking-[.05em]" style="left:22px;top:${TOP + 452 - 34}px;--d:1400ms"><span class="here-dot w-1.5 h-1.5 rounded-full bg-[#2FA36B]"></span>VOCÊ ESTÁ AQUI</span>`;
    rm.innerHTML = html;
  }
  const rmList = $('#roadmap-list');
  if (rmList) {
    const order = [0, 1, 2, 3, 4, 5];
    const phaseOf = [0, 2, 3, 4, 4, 5];
    rmList.innerHTML = order.map((i, k) => {
      const s = steps[i];
      return `<li class="relative pl-8 pb-8 last:pb-0">
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
      frag.innerHTML = node.textContent.split(' ').map((w) => (w ? `<span class="word" style="--d:${120 + (i++) * 55}ms">${w}</span>` : '')).join(' ');
      node.replaceWith(...frag.childNodes);
    });
  }

  /* ---------- Revelações no scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  const observeAll = () => {
    $$('.rv:not(.hero-rv), .band:not([data-hero-band]), .rm').forEach((el) => io.observe(el));
  };

  const startPage = () => {
    document.body.classList.remove('loading');
    $$('.hero-rv').forEach((el) => el.classList.add('in'));
    if (title) title.classList.add('words-in');
    setTimeout(() => $('[data-hero-band]')?.classList.add('in'), reduced ? 0 : 650);
    observeAll();
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

  /* ---------- O que muda: a linha mais perto do centro fica em foco ---------- */
  const bfList = $('#bf-list');
  const bfRows = bfList ? $$('.bf-row', bfList) : [];
  const onScrollFocus = () => {
    if (!bfList || window.innerWidth < 768 || reduced) return;
    const r = bfList.getBoundingClientRect();
    const mid = window.innerHeight / 2;
    const inZone = r.top < mid && r.bottom > mid;
    bfList.classList.toggle('bf-focus', inZone);
    if (!inZone) return;
    let best = null, bestD = Infinity;
    bfRows.forEach((row) => {
      const rr = row.getBoundingClientRect();
      const d = Math.abs(rr.top + rr.height / 2 - mid);
      if (d < bestD) { bestD = d; best = row; }
    });
    bfRows.forEach((row) => row.classList.toggle('on', row === best));
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

  /* ---------- Marca d'água do CTA com parallax leve ---------- */
  const ctaMark = $('#cta-mark');
  const onScrollParallax = () => {
    if (!ctaMark || reduced) return;
    const r = ctaMark.parentElement.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
    ctaMark.style.transform = `translateY(${p * 60}px) rotate(${p * -6}deg)`;
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => { onScrollNav(); onScrollFocus(); onScrollFab(); onScrollParallax(); ticking = false; });
  }, { passive: true });
  onScrollNav();

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
