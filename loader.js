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
  me.parentNode.insertBefore(host, me);
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
