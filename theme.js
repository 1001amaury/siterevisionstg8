(function () {
  var root = document.documentElement;
  try { root.dataset.theme = localStorage.getItem('revision-theme') === 'dark' ? 'dark' : 'light'; }
  catch (e) { root.dataset.theme = 'light'; }
  function update() {
    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
      var dark = root.dataset.theme === 'dark';
      button.textContent = dark ? '☀ Mode clair' : '☾ Mode sombre';
      button.setAttribute('aria-label', dark ? 'Activer le mode clair' : 'Activer le mode sombre');
    });
  }
  document.addEventListener('DOMContentLoaded', function () {
    update();
    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
      button.addEventListener('click', function () {
        root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
        try { localStorage.setItem('revision-theme', root.dataset.theme); } catch (e) {}
        update();
      });
    });
  });
})();
