// ==================== STATE & VARIABLES ====================
const DOM = {
    // Inputs
    singleInput: document.getElementById('singleInput'),
    btnAdd: document.getElementById('btnAdd'),
    bulkTextarea: document.getElementById('bulkTextarea'),
    toggleSwitch: document.getElementById('inputToggle'),
    inputGroup: document.querySelector('.input-group'),
    optionsList: document.getElementById('optionsList'),

    // Status
    totalCount: document.getElementById('totalCount'),

    // Wheel
    canvas: document.getElementById('wheelCanvas'),
    spinBtn: document.getElementById('centerCircle'),

    // Result
    resultOverlay: document.getElementById('resultOverlay'),
    resultText: document.getElementById('resultText'),
    btnClose: document.getElementById('btnClose'),

    // Theme
    themeToggle: document.getElementById('themeToggle'),

    // Sound
    soundToggle: document.getElementById('soundToggle'),

    // Debug
    debugToggle: document.getElementById('debugToggle'),
    debugPanel: document.getElementById('debugPanel'),
    debugAngle: document.getElementById('debugAngle'),
    debugSlice: document.getElementById('debugSlice'),
    debugSliceAngle: document.getElementById('debugSliceAngle'),

    // History
    historyList: document.getElementById('historyList'),
    clearHistory: document.getElementById('clearHistory'),

    // Confetti
    confettiContainer: document.getElementById('confettiContainer')
};

const CTX = DOM.canvas.getContext('2d');

// Varsayılan seçenekler
let options = [
    'Seçenek 1',
    'Seçenek 2',
    'Seçenek 3',
    'Seçenek 4',
    'Seçenek 5',
    'Seçenek 6'
];

// Renk Paleti
const COLORS = [
    '#eb0055', // Pembe
    '#ff5e00', // Turuncu
    '#ffcc00', // Sarı
    '#5cc926', // Yeşil
    '#1890ff', // Mavi
    '#7000ff'  // Mor
];

let isSpinning = false;
let currentRotation = 0;

// New Feature States
let soundEnabled = true;
let debugEnabled = false;
let history = [];

// Audio Context for sounds
let audioContext = null;

// ==================== INITIALIZATION ====================
function init() {
    initTheme();
    initSound();
    initDebug();
    loadHistory();
    resizeCanvas();
    renderList();
    drawWheel();
    updateUI();

    window.addEventListener('resize', () => {
        resizeCanvas();
        drawWheel();
    });
}

function resizeCanvas() {
    const size = 500;
    const dpr = window.devicePixelRatio || 1;
    DOM.canvas.width = size * dpr;
    DOM.canvas.height = size * dpr;
    CTX.scale(dpr, dpr);
}

// ==================== THEME LOGIC ====================
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        DOM.themeToggle.textContent = '☀️';
    } else {
        document.documentElement.removeAttribute('data-theme');
        DOM.themeToggle.textContent = '🌙';
    }
}

DOM.themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    if (newTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        DOM.themeToggle.textContent = '☀️';
    } else {
        document.documentElement.removeAttribute('data-theme');
        DOM.themeToggle.textContent = '🌙';
    }

    localStorage.setItem('theme', newTheme);
});

// ==================== SOUND LOGIC ====================
function initSound() {
    const savedSound = localStorage.getItem('soundEnabled');
    soundEnabled = savedSound !== 'false';
    updateSoundButton();
}

function updateSoundButton() {
    if (soundEnabled) {
        DOM.soundToggle.textContent = '🔊';
        DOM.soundToggle.classList.remove('muted');
    } else {
        DOM.soundToggle.textContent = '🔇';
        DOM.soundToggle.classList.add('muted');
    }
}

DOM.soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem('soundEnabled', soundEnabled);
    updateSoundButton();
});

function playTickSound() {
    if (!soundEnabled) return;

    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
    } catch (e) {
        console.log('Audio not supported');
    }
}

function playWinSound() {
    if (!soundEnabled) return;

    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

        notes.forEach((freq, i) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = freq;
            oscillator.type = 'sine';

            const startTime = audioContext.currentTime + i * 0.1;
            gainNode.gain.setValueAtTime(0.15, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.3);
        });
    } catch (e) {
        console.log('Audio not supported');
    }
}

// ==================== DEBUG LOGIC ====================
function initDebug() {
    const savedDebug = localStorage.getItem('debugEnabled');
    debugEnabled = savedDebug === 'true';
    updateDebugPanel();
}

function updateDebugPanel() {
    if (debugEnabled) {
        DOM.debugPanel.classList.remove('hidden');
        DOM.debugToggle.classList.add('active');
    } else {
        DOM.debugPanel.classList.add('hidden');
        DOM.debugToggle.classList.remove('active');
    }
}

function updateDebugInfo(angle, sliceIndex, sliceAngle) {
    if (!debugEnabled) return;

    const angleDegrees = ((angle * 180 / Math.PI) % 360).toFixed(1);
    DOM.debugAngle.textContent = angleDegrees + '°';
    DOM.debugSlice.textContent = options[sliceIndex] || '-';
    DOM.debugSliceAngle.textContent = (sliceAngle * 180 / Math.PI).toFixed(1) + '°';
}

DOM.debugToggle.addEventListener('click', () => {
    debugEnabled = !debugEnabled;
    localStorage.setItem('debugEnabled', debugEnabled);
    updateDebugPanel();
});

// ==================== HISTORY LOGIC ====================
function loadHistory() {
    const saved = localStorage.getItem('wheelHistory');
    if (saved) {
        try {
            history = JSON.parse(saved);
            renderHistory();
        } catch (e) {
            history = [];
        }
    }
}

function saveHistory() {
    localStorage.setItem('wheelHistory', JSON.stringify(history.slice(0, 20))); // Max 20 items
}

function addToHistory(winner) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    history.unshift({ winner, time: timeStr });
    if (history.length > 20) history.pop();

    saveHistory();
    renderHistory();
}

function renderHistory() {
    if (history.length === 0) {
        DOM.historyList.innerHTML = '<p class="empty-history">Henüz sonuç yok</p>';
        return;
    }

    DOM.historyList.innerHTML = history.map(item => `
        <div class="history-item">
            <span class="winner">${item.winner}</span>
            <span class="time">${item.time}</span>
        </div>
    `).join('');
}

DOM.clearHistory.addEventListener('click', () => {
    history = [];
    localStorage.removeItem('wheelHistory');
    renderHistory();
});

// ==================== CONFETTI LOGIC ====================
function createConfetti() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#fee140'];
    const confettiCount = 100;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';

        const duration = Math.random() * 2 + 2;
        const delay = Math.random() * 0.5;
        const xOffset = (Math.random() - 0.5) * 200;

        confetti.style.animation = `confettiFall ${duration}s ease-out ${delay}s forwards`;
        confetti.style.setProperty('--x-offset', xOffset + 'px');

        DOM.confettiContainer.appendChild(confetti);

        setTimeout(() => confetti.remove(), (duration + delay) * 1000);
    }
}

// ==================== UI LOGIC ====================
DOM.toggleSwitch.addEventListener('change', (e) => {
    const isBulk = e.target.checked;

    if (isBulk) {
        DOM.inputGroup.style.display = 'none';
        DOM.optionsList.classList.add('hidden');
        DOM.bulkTextarea.classList.add('active');
        DOM.bulkTextarea.value = options.join('\n');
    } else {
        const text = DOM.bulkTextarea.value.trim();
        if (text) {
            options = text.split('\n').map(s => s.trim()).filter(s => s);
            // Remove duplicates
            options = [...new Set(options)];
        }

        DOM.inputGroup.style.display = 'flex';
        DOM.optionsList.classList.remove('hidden');
        DOM.bulkTextarea.classList.remove('active');
        renderList();
        drawWheel();
        updateUI();
    }
});

DOM.bulkTextarea.addEventListener('input', () => {
    const text = DOM.bulkTextarea.value.trim();
    options = text.split('\n').map(s => s.trim()).filter(s => s);
    options = [...new Set(options)]; // Remove duplicates
    drawWheel();
    updateUI();
});

DOM.btnAdd.addEventListener('click', addSingleOption);
DOM.singleInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addSingleOption();
});

function addSingleOption() {
    const val = DOM.singleInput.value.trim();
    if (val && !options.includes(val)) { // Prevent duplicates
        options.push(val);
        DOM.singleInput.value = '';
        renderList();
        drawWheel();
        updateUI();
    } else if (options.includes(val)) {
        DOM.singleInput.value = '';
        // Could show a message that it's duplicate
    }
}

function renderList() {
    DOM.optionsList.innerHTML = '';
    options.forEach((opt, index) => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <span>${opt}</span>
            <button class="btn-delete" onclick="removeOption(${index})">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </button>
        `;
        DOM.optionsList.appendChild(item);
    });
}

window.removeOption = function (index) {
    options.splice(index, 1);
    renderList();
    drawWheel();
    updateUI();
};

function updateUI() {
    DOM.totalCount.textContent = `Seçenek sayısı: ${options.length}`;
}

// ==================== WHEEL DRAWING ====================
function drawWheel() {
    const size = 500;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;

    CTX.clearRect(0, 0, size, size);

    const len = options.length;
    if (len === 0) {
        // Empty wheel
        CTX.beginPath();
        CTX.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        CTX.fillStyle = 'rgba(128, 128, 128, 0.2)';
        CTX.fill();
        CTX.fillStyle = 'rgba(128, 128, 128, 0.6)';
        CTX.font = '500 16px Poppins';
        CTX.textAlign = 'center';
        CTX.textBaseline = 'middle';
        CTX.fillText('Seçenek ekleyin', centerX, centerY);
        return;
    }

    const sliceAngle = (2 * Math.PI) / len;

    CTX.save();
    CTX.translate(centerX, centerY);
    CTX.rotate(currentRotation);

    options.forEach((opt, i) => {
        const angle = i * sliceAngle;

        // Draw slice
        CTX.beginPath();
        CTX.moveTo(0, 0);
        CTX.arc(0, 0, radius, angle, angle + sliceAngle);
        CTX.fillStyle = COLORS[i % COLORS.length];
        CTX.fill();
        CTX.strokeStyle = '#ffffff';
        CTX.lineWidth = 2;
        CTX.stroke();

        // Draw text
        CTX.save();
        CTX.rotate(angle + sliceAngle / 2);
        CTX.textAlign = 'right';
        CTX.fillStyle = '#ffffff';
        CTX.font = 'bold 20px Poppins';
        CTX.shadowColor = 'rgba(0, 0, 0, 0.3)';
        CTX.shadowBlur = 3;

        let text = opt;
        if (text.length > 12) text = text.substring(0, 10) + '...';

        CTX.fillText(text, radius - 25, 6);
        CTX.restore();
    });

    CTX.restore();
}

// ==================== SPIN LOGIC ====================
let lastTickAngle = 0;

DOM.spinBtn.addEventListener('click', () => {
    if (isSpinning || options.length < 2) return;

    isSpinning = true;

    const spinDuration = 5000 + Math.random() * 2000; // 5-7 seconds
    const minSpins = 5;
    const randomAngle = Math.random() * 2 * Math.PI;
    const targetRotation = currentRotation + (minSpins * 2 * Math.PI) + randomAngle;
    const startTime = performance.now();
    const startRot = currentRotation;

    lastTickAngle = currentRotation;
    const sliceAngle = (2 * Math.PI) / options.length;

    function animateSpin(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);
        const ease = 1 - Math.pow(1 - progress, 4); // Ease out quart

        currentRotation = startRot + ((targetRotation - startRot) * ease);

        // Play tick sound when crossing slice boundary
        const angleDiff = Math.abs(currentRotation - lastTickAngle);
        if (angleDiff >= sliceAngle * 0.5) {
            playTickSound();
            lastTickAngle = currentRotation;
        }

        drawWheel();

        // Update debug info during spin
        if (debugEnabled) {
            const sliceIndex = calculateSliceIndex(currentRotation);
            updateDebugInfo(currentRotation, sliceIndex, sliceAngle);
        }

        if (progress < 1) {
            requestAnimationFrame(animateSpin);
        } else {
            isSpinning = false;
            showResult();
        }
    }

    requestAnimationFrame(animateSpin);
});

function calculateSliceIndex(rotation) {
    const sliceAngle = (2 * Math.PI) / options.length;
    let normalizedRotation = rotation % (2 * Math.PI);
    if (normalizedRotation < 0) normalizedRotation += 2 * Math.PI;

    const pointerAngle = -Math.PI / 2;
    let effectiveAngle = (pointerAngle - normalizedRotation) % (2 * Math.PI);
    if (effectiveAngle < 0) effectiveAngle += 2 * Math.PI;

    return Math.floor(effectiveAngle / sliceAngle) % options.length;
}

function showResult() {
    const sliceAngle = (2 * Math.PI) / options.length;
    const index = calculateSliceIndex(currentRotation);
    const winner = options[index];

    // Update debug
    updateDebugInfo(currentRotation, index, sliceAngle);

    // Play win sound
    playWinSound();

    // Create confetti
    createConfetti();

    // Add to history
    addToHistory(winner);

    // Show modal
    DOM.resultText.textContent = winner;
    DOM.resultOverlay.classList.add('active');
}

DOM.btnClose.addEventListener('click', () => {
    DOM.resultOverlay.classList.remove('active');
});

// ==================== INIT ====================
init();
