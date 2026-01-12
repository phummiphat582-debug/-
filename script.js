// === PWA Service Worker Register (สำคัญ) ===
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/-/sw.js')
      .then(reg => {
        console.log('Service Worker registered:', reg.scope);
      })
      .catch(err => {
        console.error('Service Worker registration failed:', err);
      });
  });
}

// === placeholder functions (กัน error) ===
function addRow(){}
function copyWithPrompt(){}
function printPDF(){}
