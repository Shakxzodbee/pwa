if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => { // Ensure it's registered after page loads
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('Service Worker registered successfully:', registration);
            })
            .catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
    });
}
