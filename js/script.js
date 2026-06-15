document.addEventListener('DOMContentLoaded', () => {
    
    // --- Lock Screen Logic (Keypad) ---
    const lockScreen = document.getElementById('lock-screen');
    const keyBtns = document.querySelectorAll('.key-btn:not(.action-key)');
    const keyClear = document.getElementById('key-clear');
    const keyDel = document.getElementById('key-del');
    const digits = document.querySelectorAll('.passcode-display .digit');
    const errorMsg = document.getElementById('error-msg');
    let currentPasscode = '';

    if (lockScreen && digits.length > 0) {
        document.body.style.overflow = 'hidden'; // Prevent scrolling while locked

        function updateDisplay() {
            digits.forEach((digit, index) => {
                if (index < currentPasscode.length) {
                    digit.innerText = currentPasscode[index];
                } else {
                    digit.innerText = '';
                }
            });
        }

        function checkPasscode() {
            if (currentPasscode === '160649') {
                // Redirect to the new Music Player page first
                document.body.classList.add('fade-out');
                setTimeout(() => {
                    window.location.href = 'music.html';
                }, 600);
            } else {
                errorMsg.style.opacity = 1;
                const displayObj = document.querySelector('.passcode-display');
                displayObj.classList.add('shake');
                setTimeout(() => {
                    displayObj.classList.remove('shake');
                    currentPasscode = '';
                    updateDisplay();
                }, 500);
            }
        }

        keyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (currentPasscode.length < 6) {
                    currentPasscode += btn.innerText;
                    updateDisplay();
                    errorMsg.style.opacity = 0;
                    
                    if (currentPasscode.length === 6) {
                        setTimeout(checkPasscode, 200); // slight delay to see the last digit
                    }
                }
            });
        });

        if (keyDel) {
            keyDel.addEventListener('click', () => {
                currentPasscode = currentPasscode.slice(0, -1);
                updateDisplay();
                errorMsg.style.opacity = 0;
            });
        }

        if (keyClear) {
            keyClear.addEventListener('click', () => {
                currentPasscode = '';
                updateDisplay();
                errorMsg.style.opacity = 0;
            });
        }
    }

    // --- Page Transitions ---
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const target = this.getAttribute('href');
            // If it's a local HTML link and not an empty hash
            if (target && target.endsWith('.html')) {
                e.preventDefault();
                document.body.classList.add('fade-out');
                setTimeout(() => {
                    window.location.href = target;
                }, 600); // Wait for fadeOut animation to finish
            }
        });
    });
    
    // --- Envelope Animation on Landing Page ---
    const envelopeWrapper = document.querySelector('.envelope-wrapper');
    if (envelopeWrapper) {
        envelopeWrapper.addEventListener('click', () => {
            envelopeWrapper.classList.add('open');
            // After envelope drops, maybe play a sound or add confetti here
            setTimeout(() => {
                triggerConfetti();
            }, 800);
        });
    }

    // --- Lightbox for Gallery ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.querySelector('.lightbox-content-wrapper');
    const closeBtn = document.querySelector('.close-btn');

    if (lightbox) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const src = item.getAttribute('data-src');
                const type = item.getAttribute('data-type');
                
                lightboxContent.innerHTML = ''; // clear previous content

                if (type === 'video') {
                    const video = document.createElement('video');
                    video.src = src;
                    video.controls = true;
                    video.autoplay = true;
                    video.id = 'lightbox-media';
                    lightboxContent.appendChild(video);
                } else {
                    const img = document.createElement('img');
                    img.src = src;
                    img.id = 'lightbox-media';
                    lightboxContent.appendChild(img);
                }

                lightbox.classList.add('active');
            });
        });

        closeBtn.addEventListener('click', () => {
            lightbox.classList.remove('active');
            lightboxContent.innerHTML = ''; // stop video playing when closed
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
                lightbox.classList.remove('active');
                lightboxContent.innerHTML = ''; // stop video playing when closed
            }
        });
    }

    // --- Confetti on Wishes Page ---
    const wishesPage = document.querySelector('.wishes-section');
    if (wishesPage) {
        // Trigger confetti repeatedly
        const duration = 15 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti({ ...defaults, particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#f8c8dc', '#e6a8d7', '#d81b60', '#ffffff']
            });
            confetti({ ...defaults, particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#f8c8dc', '#e6a8d7', '#d81b60', '#ffffff']
            });
        }, 250);
    }
});

// Helper for one-off confetti (used in intro)
function triggerConfetti() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#f8c8dc', '#e6a8d7', '#d81b60']
        });
    }
}
