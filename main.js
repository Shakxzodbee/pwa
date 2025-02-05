// main.js
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(function(registration) {
            console.log('Service Worker registratsiya qilindi:', registration);
        })
        .catch(function(error) {
            console.log('Service Worker registratsiya qilishda xato:', error);
        });
}