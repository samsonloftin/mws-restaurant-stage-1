// Service Worker Registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
    .register('./sw.js')
    .then(function(reg) {
      // Succeeded 
      console.log('Succeeded:', reg.scope);
    }, function(err) {
      // Failed
      console.log('Failed: ', err);
    });
}