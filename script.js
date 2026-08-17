/* ============================================================
   MOSTBET CASINO REVIEW — script.js
   Многоязычный сайт: + переключатель языков. Поп-апов нет.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Шапка + кнопка наверх ---------- */
  var hdr = document.getElementById('hdr');
  var up = document.getElementById('up');

  function onScroll() {
    var y = window.scrollY;
    if (hdr) hdr.classList.toggle('is-stuck', y > 8);
    if (up) up.classList.toggle('is-shown', y > 620);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (up) {
    up.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Мобильное меню ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Переключатель языков ---------- */
  var lang = document.getElementById('lang');
  var langBtn = document.getElementById('langBtn');

  if (lang && langBtn) {
    langBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = lang.classList.toggle('is-open');
      langBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (!lang.contains(e.target)) {
        lang.classList.remove('is-open');
        langBtn.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lang.classList.contains('is-open')) {
        lang.classList.remove('is-open');
        langBtn.setAttribute('aria-expanded', 'false');
        langBtn.focus();
      }
    });
  }

  /* ---------- Копирование промокода ---------- */
  document.querySelectorAll('.code').forEach(function (btn) {
    var original = btn.innerHTML;
    var doneLabel = btn.getAttribute('data-done') || 'copied';
    btn.addEventListener('click', function () {
      var value = btn.getAttribute('data-code') || '';

      function done() {
        btn.classList.add('is-done');
        btn.innerHTML = value + ' <em>' + doneLabel + ' ✓</em>';
        setTimeout(function () {
          btn.classList.remove('is-done');
          btn.innerHTML = original;
        }, 2200);
      }
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = value;
        ta.setAttribute('readonly', '');
        ta.style.position = 'absolute';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
        done();
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done).catch(fallback);
      } else {
        fallback();
      }
    });
  });

  /* ---------- Фильтры бонусов ---------- */
  var filters = document.querySelectorAll('.filter');
  var bonuses = document.querySelectorAll('.bonus');

  filters.forEach(function (f) {
    f.addEventListener('click', function () {
      filters.forEach(function (x) { x.classList.remove('is-on'); });
      f.classList.add('is-on');
      var pick = f.getAttribute('data-f');
      bonuses.forEach(function (card) {
        var cat = card.getAttribute('data-cat');
        card.classList.toggle('is-hidden', !(pick === 'all' || cat === pick));
      });
    });
  });

  /* ---------- FAQ: открыт один пункт ---------- */
  var faqItems = document.querySelectorAll('.faq details');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        faqItems.forEach(function (other) { if (other !== item) other.open = false; });
      }
    });
  });

  /* ---------- Оглавление: подсветка активного раздела ---------- */
  var tocLinks = document.querySelectorAll('.toc a[href^="#"]');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var map = {}, targets = [];
    tocLinks.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      var el = document.getElementById(id);
      if (el) { map[id] = link; targets.push(el); }
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          tocLinks.forEach(function (l) { l.classList.remove('is-active'); });
          var active = map[en.target.id];
          if (active) active.classList.add('is-active');
        }
      });
    }, { rootMargin: '-92px 0px -70% 0px', threshold: 0 });
    targets.forEach(function (t) { spy.observe(t); });
  }

  /* ---------- Плавное появление блоков ----------
     .reveal ставит opacity:0, поэтому нужна страховка: если
     IntersectionObserver не сработает (фоновая вкладка, prerender,
     троттлинг рендера) — открываем блоки вручную. */
  var reveals = [].slice.call(document.querySelectorAll(
    '.card, .step, .bonus, .fig--wide, .cta-strip, .codebox, .pros__col, .author, .quote, .formbox, .tbl-wrap, .game'
  ));
  reveals.forEach(function (el) { el.classList.add('reveal'); });

  function sweepReveals() {
    var h = window.innerHeight || document.documentElement.clientHeight;
    reveals = reveals.filter(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < h - 40 && r.bottom > 0) { el.classList.add('is-in'); return false; }
      return true;
    });
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: .1 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  var sweepQueued = false;
  function queueSweep() {
    if (sweepQueued) return;
    sweepQueued = true;
    window.requestAnimationFrame(function () { sweepQueued = false; sweepReveals(); });
  }
  sweepReveals();
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
  window.addEventListener('load', sweepReveals);

  /* ---------- Форма обратной связи: никуда не отправляется ---------- */
  var form = document.getElementById('contactForm');
  if (form) {
    var ok = document.getElementById('formOk');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (ok) { ok.classList.add('is-shown'); ok.setAttribute('role', 'status'); }
      form.reset();
      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        var label = btn.textContent;
        var sent = btn.getAttribute('data-sent') || 'Message sent ✓';
        btn.textContent = sent;
        btn.disabled = true;
        setTimeout(function () { btn.textContent = label; btn.disabled = false; }, 4000);
      }
      if (ok && ok.scrollIntoView) ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ---------- Партнёрские переходы ---------- */
  /* ЗАМЕНИТЬ ссылку на свою кампанию из партнёрки */
  var OFFER = 'https://xtsplkmost.com/8BPU?sub1=mostbetcasino-review.com';

  document.querySelectorAll('a[href="/go"], a[href="/go/"]').forEach(function (link) {
    link.setAttribute('rel', 'nofollow noopener');
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var lang = document.documentElement.lang || 'en';
      window.open(OFFER + '&sub2=' + encodeURIComponent(lang), '_blank', 'noopener');
    });
  });

});
