// Service Worker Registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(function(registration) {
      // Registration was successful
      console.log('Registration Successful:', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('Registration Failed: ', err);
    });
}