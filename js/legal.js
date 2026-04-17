const legalContent = {
    privacy: {
        title: "Privacy Policy",
        content: `
            <p>At <strong>idlepolyjump.com</strong>, we value your privacy. This policy outlines how we handle data.</p>
            <h3>1. Personal Data</h3>
            <p>We do not collect any personally identifiable information (PII) such as your name, email, or address. We do not require account registration.</p>
            <h3>2. LocalStorage</h3>
            <p>We use your browser's <strong>LocalStorage</strong> to save your game progress, currency, and settings. This data remains on your device and is not sent to our servers.</p>
            <h3>3. Third-Party Advertising</h3>
            <p>We use third-party advertising services (specifically <strong>Monetag</strong>) to serve ads when you visit our website. These companies may use information (not including your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.</p>
            <h3>4. External Links</h3>
            <p>Our site may contain links to other websites. We are not responsible for the privacy practices of those sites.</p>
        `
    },
    cookies: {
        title: "Cookie Policy",
        content: `
            <p>This policy explains how <strong>idlepolyjump.com</strong> uses cookies and similar technologies.</p>
            <h3>1. What are Cookies?</h3>
            <p>Cookies are small text files stored on your device. While we don't use traditional server-side cookies for the game itself, we use <strong>LocalStorage</strong> (which functions similarly) to store your game state.</p>
            <h3>2. Why do we use them?</h3>
            <ul>
                <li><strong>Functional:</strong> Necessary for the game to function (saving your progress).</li>
                <li><strong>Advertising:</strong> Third-party partners (like Monetag) use trackers to serve personalized ads and analyze traffic.</li>
            </ul>
            <h3>3. Controlling your data</h3>
            <p>You can clear your browser's cookies and LocalStorage at any time via your browser settings. Note that clearing LocalStorage will reset all game progress.</p>
        `
    }
};

function showLegal(type) {
    const data = legalContent[type];
    if (!data) return;

    const modal = document.getElementById('legal-modal');
    const title = document.getElementById('legal-modal-title');
    const body = document.getElementById('legal-modal-body');

    if (modal && title && body) {
        // If cookie banner is open, we don't necessarily need to hide it,
        // but we ensure the legal modal is on top (which it is by z-index)
        title.innerText = data.title;
        body.innerHTML = data.content;
        toggleModal('legal-modal');
    }
}

function acceptCookies() {
    localStorage.setItem('polyJump_cookieConsent', 'true');
    const banner = document.getElementById('cookie-banner');
    if (banner) banner.classList.remove('active');
}

// Check for consent on load
window.addEventListener('DOMContentLoaded', () => {
    const consent = localStorage.getItem('polyJump_cookieConsent');
    if (!consent) {
        setTimeout(() => {
            const banner = document.getElementById('cookie-banner');
            if (banner) banner.classList.add('active');
        }, 1000);
    }
});
