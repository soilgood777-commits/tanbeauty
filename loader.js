/* Tan Beauty page loader for Imweb code widgets */
(function () {
  var me = document.currentScript;
  if (!me) { var all = document.querySelectorAll('script[src*="loader.js"][data-page]:not([data-tb-done])'); me = all[all.length - 1]; }
  if (!me || me.getAttribute('data-tb-done')) return;
  me.setAttribute('data-tb-done', '1');
  var base = me.src.replace(/[^\/]*$/, '');
  var page = me.getAttribute('data-page') || 'home';
  var host = document.createElement('div');
  host.className = 'tb-app';
  // Imweb moves widget scripts to the end of <body>; mount inside the code widget instead.
  var slot = document.querySelector('[data-widget-type="code"]');
  if (slot) slot.appendChild(host); else me.parentNode.insertBefore(host, me);
  // The design has its own header, footer and floating buttons: hide Imweb's defaults.
  var css = document.createElement('style');
  css.textContent = '#doz_header_wrap,#doz_footer_wrap{display:none!important}' +
    '.tb-app{width:100%}' +
    '[data-widget-type="code"],[data-widget-type="code"]>*{overflow:visible!important}';
  document.head.appendChild(css);
  if (slot) {
    for (var el = slot; el && el !== document.body; el = el.parentElement) {
      el.style.padding = '0'; el.style.margin = '0'; el.style.maxWidth = 'none'; el.style.width = '100%';
      if (getComputedStyle(el).overflow !== 'visible') el.style.overflow = 'visible';
    }
  }
  function text(url) {
    return fetch(url, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error(url + ' ' + r.status); return r.text();
    });
  }
  function load(src) {
    return new Promise(function (ok, fail) {
      var s = document.createElement('script');
      s.src = src; s.onload = ok; s.onerror = function () { fail(new Error('load ' + src)); };
      document.head.appendChild(s);
    });
  }
  var react = window.React && window.ReactDOM ? Promise.resolve() :
    load('https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js')
      .then(function () { return load('https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js'); });
  Promise.all([text(base + 'pages/' + page + '.html'), text(base + 'tanbeauty-runtime.js'), react])
    .then(function (r) {
      host.innerHTML = r[0].split('__TB_BASE__/').join(base);
      var s = document.createElement('script');
      s.textContent = r[1];
      document.body.appendChild(s);
    })
    .catch(function (e) { console.error('[tanbeauty]', e); });
})();
