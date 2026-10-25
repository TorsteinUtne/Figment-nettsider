/*
  Figment – felles skript for hele nettstedet.
  Bygget på designmalen «Onda» fra 8B (MIT-lisens, se LICENSE).

  Delene under ser etter elementene sine og hopper over seg selv hvis
  siden ikke har dem. Du kan derfor bruke samme fil på alle sider.

    1. Header og mobilmeny
    2. Hero: bokstavanimasjon
    3. Prosjektfilter
    4. Bevegelse med GSAP og Lenis (slås av ved «reduser bevegelse»)
*/
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  /* Årstall i footer */
  document.querySelectorAll('[data-year]').forEach(element => { element.textContent = new Date().getFullYear(); });

  /* 1. Header og mobilmeny */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 24);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });

    const toggle = header.querySelector('.site-header__menu');
    const menu = header.querySelector('.menu');
    const close = menu?.querySelector('.menu__close');
    if (toggle && menu && close) {
      const setOpen = open => {
        menu.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
        if (open) { window.lenis?.stop(); close.focus(); } else { window.lenis?.start(); toggle.focus(); }
      };
      toggle.addEventListener('click', () => setOpen(true));
      close.addEventListener('click', () => setOpen(false));
      menu.addEventListener('keydown', event => {
        if (event.key === 'Escape') setOpen(false);
        if (event.key !== 'Tab') return;
        const items = [...menu.querySelectorAll('a, button')];
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      });
    }
  }

  /* 2. Hero: deler tittelen i bokstaver som reiser seg én etter én */
  const heroTitle = document.querySelector('[data-split-chars]');
  if (heroTitle && !reduce.matches) {
    heroTitle.setAttribute('aria-label', heroTitle.textContent.replace(/\s+/g, ' ').trim());
    let i = 0;
    heroTitle.querySelectorAll('.hero__line').forEach(line => {
      const text = line.firstChild && line.firstChild.nodeType === 3 ? line.firstChild : null;
      if (!text) return;
      const fragment = document.createDocumentFragment();
      text.textContent.split(/(\s+)/).forEach(word => {
        if (!word) return;
        if (/^\s+$/.test(word)) { fragment.append(' '); return; }
        const group = document.createElement('span');
        group.className = 'hero__word';
        group.setAttribute('aria-hidden', 'true');
        [...word].forEach(char => {
          const mask = document.createElement('span');
          mask.className = 'hero__char-mask';
          const inner = document.createElement('span');
          inner.className = 'hero__char';
          inner.style.setProperty('--i', i++);
          inner.textContent = char;
          mask.append(inner);
          group.append(mask);
        });
        fragment.append(group);
      });
      text.replaceWith(fragment);
    });
    const end = i * 28 + 150;
    const frame = heroTitle.closest('.hero');
    frame?.style.setProperty('--dot-delay', `${end + 250}ms`);
    frame?.style.setProperty('--foot-delay', `${end + 350}ms`);
  }
  /* Hero: roterende tekst etter det faste «Vi». Står stille ved «reduser bevegelse». */
  document.querySelectorAll('[data-rotator]').forEach(rotator => {
    const items = [...rotator.querySelectorAll('.rotator__item')];
    if (items.length < 2 || reduce.matches) return;
    const interval = Number(rotator.dataset.interval) || 5000;
    let index = 0, timer = null;
    const next = () => {
      const current = items[index];
      index = (index + 1) % items.length;
      current.classList.remove('is-active');
      current.classList.add('is-leaving');
      items[index].classList.remove('is-leaving');
      items[index].classList.add('is-active');
      setTimeout(() => current.classList.remove('is-leaving'), 900);
    };
    const start = () => { if (!timer) timer = setInterval(next, interval); };
    const stop = () => { clearInterval(timer); timer = null; };
    start();
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  });

  const hero = document.querySelector('.hero');
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => hero.classList.toggle('is-offscreen', !entry.isIntersecting)).observe(hero);
  }

  /* 3. Prosjektfilter: knapper med data-filter, prosjekter med data-tags */
  const filterBar = document.querySelector('[data-filters]');
  if (filterBar) {
    const list = document.querySelector(filterBar.dataset.filters);
    const items = [...list.querySelectorAll('[data-tags]')];
    const empty = document.querySelector('[data-filter-empty]');
    const apply = tag => {
      let shown = 0;
      items.forEach(item => {
        const match = tag === 'alle' || item.dataset.tags.split(',').map(t => t.trim()).includes(tag);
        item.hidden = !match;
        if (match) shown++;
      });
      if (empty) empty.hidden = shown > 0;
      filterBar.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === tag)));
      window.ScrollTrigger?.refresh();
    };
    filterBar.addEventListener('click', event => {
      const button = event.target.closest('[data-filter]');
      if (button) apply(button.dataset.filter);
    });
    const fromUrl = new URLSearchParams(location.search).get('bransje');
    if (fromUrl && filterBar.querySelector(`[data-filter="${fromUrl}"]`)) apply(fromUrl);
  }

  /* 4. Bevegelse */
  if (!window.gsap || !window.ScrollTrigger) return;
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  const splitWords = element => {
    const original = element.innerHTML;
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { fragment.append(part); return; }
        const word = document.createElement('span');
        word.className = 'ink__word';
        word.textContent = part;
        fragment.append(word);
      });
      node.replaceWith(fragment);
    });
    return () => { element.innerHTML = original; };
  };

  const start = () => gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    const cleanups = [];

    /* Myk scrolling */
    const lenis = window.lenis = new Lenis({ lerp: 0.1, anchors: { offset: -(header ? header.offsetHeight : 0) } });
    const tick = time => lenis.raf(time * 1000);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    cleanups.push(() => { gsap.ticker.remove(tick); gsap.ticker.lagSmoothing(500, 33); lenis.destroy(); window.lenis = null; });

    /* data-motion="rise": overskriften glir opp og prikken faller på plass */
    document.querySelectorAll('[data-motion~="rise"]').forEach(element => {
      const dot = element.querySelector('.dot');
      const timeline = gsap.timeline({ paused: true });
      timeline.fromTo(element, { yPercent: 30, clipPath: 'inset(0% -6% 100% -6%)' }, { yPercent: 0, clipPath: 'inset(-30% -6% -30% -6%)', duration: .95, ease: 'expo.out', clearProps: 'clipPath,transform' }, 0);
      if (dot) timeline.fromTo(dot, { scale: 0, yPercent: -260 }, { scale: 1, yPercent: 0, duration: .75, ease: 'back.out(2.2)', clearProps: 'transform' }, .42);
      ScrollTrigger.create({ trigger: element, start: 'top 90%', once: true, animation: timeline });
    });

    /* data-motion="ink": teksten mørkner ord for ord mens du scroller */
    document.querySelectorAll('[data-motion~="ink"]').forEach(element => {
      cleanups.push(splitWords(element));
      gsap.fromTo(element.querySelectorAll('.ink__word'), { opacity: .18 }, { opacity: 1, stagger: .06, ease: 'none', scrollTrigger: { trigger: element, start: 'top 88%', end: 'bottom 62%', scrub: .4 } });
    });

    /* data-motion="iris": bildet åpner seg fra en sirkel */
    document.querySelectorAll('[data-motion~="iris"]').forEach(element => {
      const image = element.querySelector('img, video');
      const timeline = gsap.timeline({ paused: true });
      timeline.fromTo(element, { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)', duration: 1.15, ease: 'expo.inOut', clearProps: 'clipPath' }, 0);
      if (image) timeline.fromTo(image, { scale: 1.2 }, { scale: 1, duration: 1.5, ease: 'expo.out', clearProps: 'transform' }, .15);
      ScrollTrigger.create({ trigger: element, start: 'top 86%', once: true, animation: timeline });
    });

    /* data-motion="up": grupper av elementer glir inn etter hverandre */
    document.querySelectorAll('[data-motion~="up"]').forEach(group => {
      gsap.from(group.children, { y: 40, opacity: 0, duration: .9, stagger: .08, ease: 'expo.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: group, start: 'top 88%', once: true } });
    });

    /* Forsiden: intro-linjene glir inn */
    const intro = document.querySelector('.intro');
    if (intro) {
      gsap.timeline({ scrollTrigger: { trigger: intro, start: 'top 85%', end: 'top 35%', scrub: true } })
        .fromTo(intro.querySelectorAll('.intro__line'), { yPercent: 70, xPercent: index => (index ? 6 : -4) }, { yPercent: 0, xPercent: 0, stagger: .12, ease: 'power2.out' }, 0)
        .fromTo(intro.querySelector('.intro__title .dot'), { scale: 0 }, { scale: 1, duration: .1 }, .9);
    }

    /* Tjenester: kortene stables og skygges når neste kort kommer */
    const services = document.querySelector('.services');
    if (services) {
      const cards = [...services.querySelectorAll('.service')];
      services.classList.add('is-deck');
      cards.forEach((card, index) => card.style.setProperty('--i', index));
      cards.forEach((card, index) => {
        const next = cards[index + 1];
        if (!next) return;
        gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: next, start: 'top bottom', end: () => `top ${parseFloat(getComputedStyle(next).top) || 0}px`, scrub: true, invalidateOnRefresh: true } })
          .to(card, { scale: .92 }, 0)
          .to(card.querySelector('.service__shade'), { opacity: .5 }, 0);
      });
      cleanups.push(() => { services.classList.remove('is-deck'); cards.forEach(card => card.style.removeProperty('--i')); });
    }

    /* Tidslinje: ringen tegnes og årstallet skifter mens du scroller */
    const timelineSection = document.querySelector('.timeline');
    if (timelineSection) {
      const steps = [...timelineSection.querySelectorAll('.step')];
      const stations = [...timelineSection.querySelectorAll('.timeline__station')];
      const year = timelineSection.querySelector('.timeline__year');
      timelineSection.classList.add('is-cycle');
      const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
        trigger: timelineSection.querySelector('.timeline__steps'), start: 'top 62%', end: 'bottom 62%', scrub: true,
        onUpdate: self => { if (year) year.textContent = steps[Math.min(steps.length - 1, Math.floor(self.progress * steps.length))].querySelector('.step__year').textContent; }
      } });
      tl.fromTo(timelineSection.querySelector('.timeline__arc'), { attr: { 'stroke-dashoffset': 1 } }, { attr: { 'stroke-dashoffset': 0 }, duration: 1 }, 0)
        .fromTo(timelineSection.querySelector('.timeline__arm'), { rotation: 0 }, { rotation: 360, duration: 1 }, 0);
      steps.forEach((step, index) => {
        const at = index / steps.length;
        tl.fromTo(step, { opacity: .2 }, { opacity: 1, duration: .07 }, Math.max(0, at - .03));
        if (stations[index]) tl.fromTo(stations[index], { scale: .4 }, { scale: 1.35, duration: .05, ease: 'back.out(3)' }, at).to(stations[index], { scale: 1, duration: .08 }, at + .06);
      });
      cleanups.push(() => timelineSection.classList.remove('is-cycle'));
    }

    /* Prosjekter: sporet flyttes sidelengs mens seksjonen står fast */
    const work = document.querySelector('.work');
    if (work) {
      const track = work.querySelector('.work__track');
      const stage = work.querySelector('.work__stage');
      work.classList.add('is-track');
      const run = () => Math.max(0, track.offsetWidth - (work.clientWidth - 2 * parseFloat(getComputedStyle(stage).paddingLeft)));
      const setRun = () => work.style.setProperty('--run', `${Math.round(run())}px`);
      setRun();
      ScrollTrigger.addEventListener('refreshInit', setRun);
      gsap.fromTo(work.querySelector('.work__plate'), { clipPath: 'inset(0% 3.2% 0% 3.2% round 40px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power1.out', scrollTrigger: { trigger: work, start: 'top bottom', end: 'top 15%', scrub: true } });
      const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: work, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true } });
      tl.to(track, { x: () => -run() }, 0);
      work.querySelectorAll('.case__img').forEach(image => tl.fromTo(image, { xPercent: -5 }, { xPercent: 5 }, 0));
      cleanups.push(() => { work.classList.remove('is-track'); work.style.removeProperty('--run'); ScrollTrigger.removeEventListener('refreshInit', setRun); });
    }

    return () => cleanups.reverse().forEach(fn => fn());
  });

  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  fontsReady.then(() => { start(); ScrollTrigger.refresh(); });
  addEventListener('load', () => ScrollTrigger.refresh());
})();
