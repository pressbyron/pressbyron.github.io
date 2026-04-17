function loadAndShowAd(onComplete) {
    const s = document.createElement('script');
    s.dataset.zone = '10888918';
    s.src = 'https://n6wxm.com/vignette.min.js';
    s.async = true;
    
    let isAdResolved = false;
    
    // Fallback if ad doesn't load/trigger
    const fallbackTimer = setTimeout(() => {
        if (!isAdResolved) {
            isAdResolved = true;
            console.log("Ad failed to load, applying free boost.");
            showSynergyFeedback("⚠️ Ad unavailable, free boost granted!", "var(--text-dim)");
            if (onComplete) onComplete();
        }
    }, 3000); // 3 seconds timeout
    
    s.onload = () => {
        // Monetag script loaded. If they use a promise-based API, we'd handle it here.
        // Assuming the ad loads/shows within the fallback window.
        // If it shows, clear the fallback.
    };
    
    document.body.appendChild(s);
}
