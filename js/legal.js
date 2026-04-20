const legalContent = {
    privacy: {
        title: "Privacy Policy",
        content: `
            <p>You can view our full Privacy Policy at <a href="privacy.html" target="_blank" style="color:var(--accent-0);">idlepolyjump.com/privacy</a>.</p>
        `
    },
    cookies: {
        title: "Cookie Policy",
        content: `
            <p>This policy explains how <strong>idlepolyjump.com</strong> uses cookies and similar technologies.</p>
            <h3>1. What are Cookies?</h3>
            <p>Cookies are small text files stored on your device. We use <strong>LocalStorage</strong> to store your game state.</p>
            <h3>2. Why do we use them?</h3>
            <ul>
                <li><strong>Functional:</strong> Necessary for the game to function (saving your progress).</li>
            </ul>
            <h3>3. Controlling your data</h3>
            <p>You can clear your browser's LocalStorage at any time via your browser settings. Note that clearing LocalStorage will reset all game progress.</p>
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
        title.innerText = data.title;
        body.innerHTML = data.content;
        toggleModal('legal-modal');
    }
}
