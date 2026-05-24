(function () {
  const saved = localStorage.getItem('tax_lang');
  if (saved === 'en') document.body.classList.remove('zh');
})();
