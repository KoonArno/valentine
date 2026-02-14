// Gallery Data - แก้ไขเพิ่มรูปและวิดีโอของคุณที่นี่
// type: 'image' หรือ 'video'
const galleryData = {
    smile: {
        title: 'รอยยิ้มที่น่ารักของเธอ 😍',
        items: [
            // ตัวอย่างรูปภาพ
            // { type: 'image', src: 'images/smile/1.jpg', caption: 'ยิ้มตอนเจอกันครั้งแรก' },
            // { type: 'image', src: 'images/smile/2.jpg', caption: 'ยิ้มตอนกินข้าว' },
            // ตัวอย่างวิดีโอ
            // { type: 'video', src: 'videos/smile-moment.mp4', caption: 'วิดีโอน่ารัก' },
            { type: 'image', emoji: '😊', caption: 'ยิ้มหวานๆ ของเธอ' },
            { type: 'image', emoji: '🥰', caption: 'ยิ้มตอนมีความสุข' },
            { type: 'video', emoji: '🎥', caption: 'วิดีโอน่ารักของเธอ' },
        ]
    },
    date: {
        title: 'เดทของเรา 💑',
        items: [
            { type: 'image', emoji: '☕', caption: 'เดทที่คาเฟ่น่ารัก' },
            { type: 'video', emoji: '📹', caption: 'วิดีโอตอนเดท' },
            { type: 'image', emoji: '🎡', caption: 'เที่ยวสวนสนุก' },
        ]
    },
    birthday: {
        title: 'วันเกิดปีที่แล้ว 🎂',
        items: [
            { type: 'video', emoji: '🎬', caption: 'วิดีโอวันเกิด' },
            { type: 'image', emoji: '🎂', caption: 'เป่าเค้กวันเกิด' },
            { type: 'image', emoji: '🎁', caption: 'ของขวัญสุดพิเศษ' },
        ]
    }
};

// Gallery State
let currentGallery = null;
let currentSlide = 0;
let isPlaying = true;
let slideInterval = null;
let progressInterval = null;
const SLIDE_DURATION = 3000; // 3 วินาทีต่อรูป

// Open Gallery
function openGallery(galleryId) {
    currentGallery = galleryId;
    currentSlide = 0;
    isPlaying = true;
    
    const data = galleryData[galleryId];
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('galleryModal').classList.add('active');
    
    createDots(data.items.length);
    showSlide(0);
    startSlideshow();
    
    // Create sparkle effect
    createGallerySparkles();
}

// Close Gallery
function closeGallery() {
    document.getElementById('galleryModal').classList.remove('active');
    stopSlideshow();
    currentGallery = null;
}

// Create Dots
function createDots(count) {
    const dotsContainer = document.getElementById('slideshowDots');
    dotsContainer.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => {
            stopSlideshow();
            showSlide(i);
            if (isPlaying) startSlideshow();
        };
        dotsContainer.appendChild(dot);
    }
}

// Show Slide
function showSlide(index) {
    if (!currentGallery) return;
    
    const data = galleryData[currentGallery];
    const items = data.items;
    
    // Wrap around
    if (index >= items.length) index = 0;
    if (index < 0) index = items.length - 1;
    
    currentSlide = index;
    
    const item = items[index];
    const slideImage = document.getElementById('slideImage');
    
    // ล้างเนื้อหาเก่า
    slideImage.innerHTML = '';
    slideImage.className = 'slide-image';
    
    if (item.type === 'video') {
        // แสดงวิดีโอ
        slideImage.classList.add('video-slide');
        if (item.src) {
            // มีไฟล์วิดีโอจริง
            slideImage.innerHTML = `
                <video controls autoplay muted playsinline 
                    onplay="pauseSlideshow()" 
                    onended="resumeSlideshow()"
                    onpause="checkVideoEnded(this)">
                    <source src="${item.src}" type="video/mp4">
                    เบราว์เซอร์ไม่รองรับวิดีโอ
                </video>
            `;
        } else {
            // ใช้ emoji แทนตอนยังไม่มีไฟล์
            slideImage.innerHTML = `<div class="video-placeholder">${item.emoji || '🎥'}</div>`;
        }
        pauseSlideshow();
    } else {
        // แสดงรูปภาพ
        if (item.src) {
            slideImage.innerHTML = `<img src="${item.src}" alt="${item.caption}">`;
        } else {
            slideImage.innerHTML = item.emoji || '📷';
        }
        resumeSlideshow();
    }
    
    document.getElementById('modalCaption').textContent = item.caption;
    
    // Update dots
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
        // เพิ่ม icon แยกประเภท
        const itemType = items[i].type;
        dot.innerHTML = itemType === 'video' ? '🎬' : '';
    });
    
    // Reset progress bar animation
    const progressBar = document.getElementById('progressBar');
    if (progressBar && isPlaying && item.type !== 'video') {
        progressBar.classList.remove('animating');
        void progressBar.offsetWidth; // Force reflow
        progressBar.classList.add('animating');
    }
}

// Check if video ended
function checkVideoEnded(video) {
    if (video.ended || video.paused) {
        resumeSlideshow();
    }
}

// Pause slideshow
function pauseSlideshow() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.classList.remove('animating');
    }
}

// Resume slideshow
function resumeSlideshow() {
    if (!isPlaying) return;
    stopSlideshow();
    slideInterval = setInterval(() => {
        showSlide(currentSlide + 1);
    }, SLIDE_DURATION);
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.classList.remove('animating');
        void progressBar.offsetWidth;
        progressBar.classList.add('animating');
    }
}

// Next/Prev Slide
function nextSlide() {
    stopSlideshow();
    showSlide(currentSlide + 1);
    if (isPlaying) startSlideshow();
}

function prevSlide() {
    stopSlideshow();
    showSlide(currentSlide - 1);
    if (isPlaying) startSlideshow();
}

// Play/Pause
function togglePlay() {
    isPlaying = !isPlaying;
    document.getElementById('playPauseBtn').textContent = isPlaying ? '⏸️' : '▶️';
    
    if (isPlaying) {
        startSlideshow();
    } else {
        stopSlideshow();
    }
}

// Start Slideshow
function startSlideshow() {
    stopSlideshow();
    
    // Start progress bar animation
    const progressBar = document.getElementById('progressBar');
    progressBar.classList.remove('animating');
    void progressBar.offsetWidth; // Force reflow to restart animation
    progressBar.classList.add('animating');
    
    slideInterval = setInterval(() => {
        showSlide(currentSlide + 1);
        // Restart progress bar animation for new slide
        const bar = document.getElementById('progressBar');
        bar.classList.remove('animating');
        void bar.offsetWidth; // Force reflow
        bar.classList.add('animating');
    }, SLIDE_DURATION);
}

// Stop Slideshow
function stopSlideshow() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
    // Stop progress bar animation
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.classList.remove('animating');
    }
}

// Gallery Sparkles
function createGallerySparkles() {
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.innerHTML = ['✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 4)];
            sparkle.style.left = (Math.random() * 100) + '%';
            sparkle.style.top = (Math.random() * 100) + '%';
            sparkle.style.fontSize = (20 + Math.random() * 30) + 'px';
            document.querySelector('.gallery-modal').appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 1000);
        }, i * 100);
    }
}

// Close modal on outside click
document.addEventListener('click', (e) => {
    const modal = document.getElementById('galleryModal');
    if (e.target === modal) {
        closeGallery();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!currentGallery) return;
    
    if (e.key === 'Escape') closeGallery();
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
    }
});

// Create floating hearts
function createFloatingHearts() {
    const container = document.getElementById('floatingHearts');
    const hearts = ['💖', '💕', '💗', '💓', '💞', '💘', '🩷'];
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (8 + Math.random() * 6) + 's';
        heart.style.fontSize = (15 + Math.random() * 25) + 'px';
        container.appendChild(heart);
        
        setTimeout(() => heart.remove(), 15000);
    }, 800);
}

// Navigation
function nextPage(pageNum) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page' + pageNum).classList.add('active');
    createMusicNotes();
    
    // Reset love meter when leaving quiz page
    if (pageNum !== 5) {
        resetLoveMeter();
        resetLoveGame();
    }
}

function prevPage(pageNum) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page' + pageNum).classList.add('active');
    
    // Reset love meter and love game when entering/leaving quiz page
    if (pageNum !== 5) {
        resetLoveMeter();
        resetLoveGame();
    }
}

// Reset Love Meter
function resetLoveMeter() {
    const meter = document.getElementById('loveMeter');
    const fill = document.getElementById('loveMeterFill');
    
    if (meter && fill) {
        meter.style.display = 'none';
        fill.style.width = '0%';
    }
}

// Reset Gift and Go Back
function resetGiftAndGoBack() {
    const box = document.getElementById('giftBox');
    const message = document.getElementById('surpriseMessage');
    
    // Reset gift box
    box.classList.remove('hidden', 'opening');
    
    // Hide message
    message.classList.remove('show');
    
    // Go back to previous page
    prevPage(5);
}

// Create kiss effect
function createKiss(e) {
    const kiss = document.createElement('div');
    kiss.className = 'kiss';
    kiss.innerHTML = '💋';
    kiss.style.left = e.clientX + 'px';
    kiss.style.top = e.clientY + 'px';
    document.body.appendChild(kiss);
    
    setTimeout(() => kiss.remove(), 2000);
    
    // Create multiple kisses
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const extraKiss = document.createElement('div');
            extraKiss.className = 'kiss';
            extraKiss.innerHTML = '💋';
            extraKiss.style.left = (e.clientX + (Math.random() - 0.5) * 100) + 'px';
            extraKiss.style.top = (e.clientY + (Math.random() - 0.5) * 100) + 'px';
            document.body.appendChild(extraKiss);
            setTimeout(() => extraKiss.remove(), 2000);
        }, i * 200);
    }
}

// Create rose petals
function createRosePetals() {
    const petals = ['🌹', '🌸', '🌺', '🏵️', '💮'];
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const petal = document.createElement('div');
            petal.className = 'rose-petal';
            petal.innerHTML = petals[Math.floor(Math.random() * petals.length)];
            petal.style.left = Math.random() * 100 + '%';
            petal.style.animationDuration = (3 + Math.random() * 3) + 's';
            document.body.appendChild(petal);
            
            setTimeout(() => petal.remove(), 6000);
        }, i * 150);
    }
}

// Show sparkle effect
function showSparkle(e) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.innerHTML = '✨';
    sparkle.style.left = e.clientX + 'px';
    sparkle.style.top = e.clientY + 'px';
    sparkle.style.fontSize = '30px';
    document.body.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 1000);
    
    // Create multiple sparkles
    for (let i = 0; i < 8; i++) {
        const s = document.createElement('div');
        s.className = 'sparkle';
        s.innerHTML = ['✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 4)];
        s.style.left = (e.clientX + (Math.random() - 0.5) * 150) + 'px';
        s.style.top = (e.clientY + (Math.random() - 0.5) * 150) + 'px';
        s.style.fontSize = (20 + Math.random() * 20) + 'px';
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 1000);
    }
}

// Love meter
function showLoveMeter(btn) {
    const meter = document.getElementById('loveMeter');
    const fill = document.getElementById('loveMeterFill');
    
    meter.style.display = 'block';
    setTimeout(() => {
        fill.style.width = '100%';
    }, 100);
    
    // Confetti burst
    createConfettiBurst();
}

// Open gift
function openGift() {
    const box = document.getElementById('giftBox');
    const message = document.getElementById('surpriseMessage');
    
    // เริ่มแอนิเมชันกล่องหายไป
    box.classList.add('opening');
    
    // รอแอนิเมชันกล่องเสร็จ แล้วซ่อนกล่อง แสดงข้อความแทน
    setTimeout(() => {
        box.classList.add('hidden');
        message.classList.add('show');
        createFireworks();
        createConfettiBurst();
    }, 500);
}

// Celebrate
function celebrate() {
    createFireworks();
    createConfettiBurst();
    createRosePetals();
    
    // Create hearts everywhere
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.innerHTML = ['💖', '💕', '💗', '💓', '💞'][Math.floor(Math.random() * 5)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDuration = '5s';
            heart.style.fontSize = (20 + Math.random() * 30) + 'px';
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 5000);
        }, i * 50);
    }
}

// Create confetti
function createConfettiBurst() {
    const container = document.getElementById('confettiContainer');
    const colors = ['#ff6b9d', '#ff8fab', '#ffb3c6', '#ffc2d1', '#ffe4ec', '#fff0f5', '#ffd700', '#ff69b4'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.width = (8 + Math.random() * 8) + 'px';
        confetti.style.height = confetti.style.width;
        confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
        confetti.style.animationDelay = (Math.random() * 0.5) + 's';
        container.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 4000);
    }
}

// Create fireworks
function createFireworks() {
    const colors = ['#ff6b9d', '#ff8fab', '#ffb3c6', '#ffd700', '#ff1493', '#ff69b4'];
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight * 0.5;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            for (let j = 0; j < 20; j++) {
                const particle = document.createElement('div');
                particle.className = 'firework-particle';
                particle.style.backgroundColor = color;
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                
                const angle = (j / 20) * Math.PI * 2;
                const velocity = 100 + Math.random() * 100;
                const tx = Math.cos(angle) * velocity;
                const ty = Math.sin(angle) * velocity;
                
                particle.style.setProperty('--tx', tx + 'px');
                particle.style.setProperty('--ty', ty + 'px');
                particle.style.animation = 'none';
                
                document.body.appendChild(particle);
                
                // Animate manually for better control
                const startTime = Date.now();
                const duration = 1000;
                
                function animate() {
                    const elapsed = Date.now() - startTime;
                    const progress = elapsed / duration;
                    
                    if (progress < 1) {
                        const currentX = tx * progress;
                        const currentY = ty * progress + 0.5 * 200 * progress * progress;
                        particle.style.transform = `translate(${currentX}px, ${currentY}px)`;
                        particle.style.opacity = 1 - progress;
                        requestAnimationFrame(animate);
                    } else {
                        particle.remove();
                    }
                }
                
                requestAnimationFrame(animate);
            }
        }, i * 300);
    }
}

// Create music notes
function createMusicNotes() {
    const notes = ['🎵', '🎶', '♪', '♫'];
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const note = document.createElement('div');
            note.className = 'music-note';
            note.innerHTML = notes[Math.floor(Math.random() * notes.length)];
            note.style.left = (Math.random() * 80 + 10) + '%';
            note.style.bottom = '20%';
            note.style.animationDuration = (2 + Math.random() * 2) + 's';
            document.body.appendChild(note);
            
            setTimeout(() => note.remove(), 4000);
        }, i * 300);
    }
}

// Click anywhere to create sparkles
document.addEventListener('click', (e) => {
    if (!e.target.closest('.quiz-btn') && !e.target.closest('.photo-card') && !e.target.closest('.big-heart')) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.innerHTML = '✨';
        sparkle.style.left = e.clientX + 'px';
        sparkle.style.top = e.clientY + 'px';
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1000);
    }
});

// Initialize
createFloatingHearts();


// ============================================
// Love Game - Interactive Quiz Logic
// ============================================

let loveGameLevel = 0;
let noButtonRunCount = 0;
const runningMessages = [
    "จับไม่ได้หรอก! 😝",
    "เร็วกว่านี้อีก! 🏃‍♀️",
    "ไม่ให้กดหรอก 💨",
    "หนีแล้ววว~ 🏃",
    "อุ้ย! เกือบจับได้ 😱",
    "เร็วเข้า! 🏃‍♂️💨",
    "ลองกดรักดูสิ~ 💕",
    "รักดีกว่าน้า~ ❤️"
];

const escapingMessages = [
    "ช่วยด้วย! มันใหญ่มาก! 😱",
    "หนีลงล่างดีกว่า! 🏃‍♂️",
    "อย่ามาใกล้! 🙅‍♀️",
    "มันใหญ่เกินไปแล้ว! 😰",
    "หนีไม่พ้นแน่~ 💨",
    "ช่วยด้วยยย~ 🆘",
    "รักเถอะน่า~ 🥺💕",
    "ไม่ไหวแล้วว~ 😵"
];

function handleLoveNoPress(event) {
    // Prevent default to avoid any button submit behavior
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const noBtn = document.getElementById('loveNoBtn');
    const yesBtn = document.getElementById('loveYesBtn');
    const hint = document.getElementById('loveGameHint');
    
    if (!noBtn || noBtn.classList.contains('caught') || noBtn.style.opacity === '0') return;
    
    // Hide hint after first interaction
    if (hint && noButtonRunCount === 0) {
        hint.classList.add('hidden');
    }
    
    // Make the NO button run away immediately
    moveNoButton(noBtn);
    
    // Grow the YES button
    growYesButton(yesBtn);
    
    // Show running message
    showRunningMessage(noBtn);
    
    // Create small confetti burst at click position
    if (event) {
        createClickConfetti(event.clientX, event.clientY);
    }
    
    noButtonRunCount++;
    
    // Check if YES button should fill the screen (after 15 clicks)
    if (loveGameLevel >= 15) {
        setTimeout(() => {
            noBtn.style.opacity = '0';
            noBtn.style.pointerEvents = 'none';
            yesBtn.className = 'love-btn love-yes size-fill-screen';
            
            // Create big celebration
            createConfettiBurst();
            createConfettiBurst();
            createConfettiBurst();
            createFireworks();
        }, 300);
    }
}

function createClickConfetti(x, y) {
    const colors = ['#ff6b9d', '#ff8fab', '#ffb3c6', '#ffd700', '#ff69b4'];
    
    for (let i = 0; i < 15; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = x + 'px';
        confetti.style.top = y + 'px';
        confetti.style.width = (6 + Math.random() * 6) + 'px';
        confetti.style.height = confetti.style.width;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '1000';
        
        // Random direction
        const angle = (Math.random() * Math.PI * 2);
        const velocity = 50 + Math.random() * 100;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        confetti.style.animation = 'none';
        document.body.appendChild(confetti);
        
        // Animate
        const startTime = Date.now();
        const duration = 600;
        
        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                const currentX = x + tx * progress;
                const currentY = y + ty * progress + 0.5 * 200 * progress * progress;
                confetti.style.left = currentX + 'px';
                confetti.style.top = currentY + 'px';
                confetti.style.opacity = 1 - progress;
                confetti.style.transform = `rotate(${progress * 360}deg)`;
                requestAnimationFrame(animate);
            } else {
                confetti.remove();
            }
        }
        
        requestAnimationFrame(animate);
    }
}

function moveNoButton(btn) {
    const rect = btn.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const yesBtn = document.getElementById('loveYesBtn');
    const yesRect = yesBtn ? yesBtn.getBoundingClientRect() : null;
    
    let newX, newY;
    const padding = 80;
    
    // Simple escape mode - just move to bottom when YES is big
    if (loveGameLevel >= 10) {
        const bottomPadding = 30;
        newX = padding + Math.random() * (viewportWidth - rect.width - padding * 2);
        newY = viewportHeight - rect.height - bottomPadding - (Math.random() * 80);
        btn.classList.add('escaping');
    } else {
        // Normal mode - simple random position
        const maxX = viewportWidth - rect.width - padding;
        const maxY = viewportHeight - rect.height - padding;
        
        // Simple random position with minimum distance from current position
        const minDistance = 120 + (loveGameLevel * 20);
        let attempts = 0;
        let validPosition = false;
        
        while (!validPosition && attempts < 10) {
            newX = padding + Math.random() * (maxX - padding);
            newY = padding + Math.random() * (maxY - padding);
            
            const distFromCurrent = Math.sqrt(
                Math.pow(newX - rect.left, 2) + 
                Math.pow(newY - rect.top, 2)
            );
            
            // Check if far enough from current position
            if (distFromCurrent >= minDistance) {
                validPosition = true;
            }
            attempts++;
        }
        
        // If can't find valid position, just use random
        if (!validPosition) {
            newX = padding + Math.random() * (maxX - padding);
            newY = padding + Math.random() * (maxY - padding);
        }
        
        btn.classList.remove('escaping');
    }
    
    // Ensure within bounds
    newX = Math.max(20, Math.min(newX, viewportWidth - rect.width - 20));
    newY = Math.max(20, Math.min(newY, viewportHeight - rect.height - 20));
    
    // Transition speed
    const transitionSpeed = loveGameLevel > 10 ? '0.15s' : (loveGameLevel > 5 ? '0.22s' : '0.3s');
    
    // Scale down as level increases
    const scale = Math.max(0.6, 1 - (loveGameLevel * 0.04));
    
    // Apply position
    btn.style.position = 'fixed';
    btn.style.left = newX + 'px';
    btn.style.top = newY + 'px';
    btn.style.transform = `scale(${scale})`;
    btn.style.setProperty('--btn-scale', scale);
    btn.style.transition = `all ${transitionSpeed} ease-out`;
    btn.style.zIndex = '50';
    btn.classList.add('running');
    
    setTimeout(() => {
        btn.classList.remove('running');
    }, parseFloat(transitionSpeed) * 1000);
}

function growYesButton(btn) {
    loveGameLevel++;
    
    // Remove previous size class
    btn.className = 'love-btn love-yes';
    
    // Add size class based on level
    if (loveGameLevel <= 15) {
        btn.classList.add('size-' + loveGameLevel);
    } else {
        btn.classList.add('size-fill-screen');
    }
    
    // Add pulse effect
    btn.classList.add('pulse');
    setTimeout(() => {
        btn.classList.remove('pulse');
    }, 500);
    
    // Create small sparkles around YES button
    createButtonSparkles(btn);
    
    // Make NO button run faster as YES gets bigger
    if (loveGameLevel > 10) {
        btn.style.transition = 'all 0.2s ease';
    }
    
    // Change card background as level increases
    const card = document.querySelector('.love-game-card');
    if (card) {
        // Remove previous level classes
        card.classList.remove('level-5', 'level-8', 'level-10', 'level-12', 'level-15');
        // Add current level class
        if (loveGameLevel >= 15) card.classList.add('level-15');
        else if (loveGameLevel >= 12) card.classList.add('level-12');
        else if (loveGameLevel >= 10) card.classList.add('level-10');
        else if (loveGameLevel >= 8) card.classList.add('level-8');
        else if (loveGameLevel >= 5) card.classList.add('level-5');
    }
}

function createButtonSparkles(btn) {
    const rect = btn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 6; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = ['✨', '💖', '💕', '💫'][Math.floor(Math.random() * 4)];
            sparkle.style.position = 'fixed';
            sparkle.style.left = (centerX + (Math.random() - 0.5) * rect.width * 1.5) + 'px';
            sparkle.style.top = (centerY + (Math.random() - 0.5) * rect.height * 1.5) + 'px';
            sparkle.style.fontSize = (20 + Math.random() * 20) + 'px';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '1000';
            sparkle.style.animation = 'sparkle 0.8s ease-out forwards';
            document.body.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 800);
        }, i * 50);
    }
}

function showRunningMessage(btn) {
    const rect = btn.getBoundingClientRect();
    const message = document.createElement('div');
    const isEscaping = btn.classList.contains('escaping');
    
    message.className = 'running-message' + (isEscaping ? ' escaping-msg' : '');
    
    // Use different messages for escaping mode
    let msgText;
    if (isEscaping) {
        const escapeIndex = Math.min(Math.max(0, noButtonRunCount - 10), escapingMessages.length - 1);
        msgText = escapingMessages[escapeIndex];
    } else {
        const runIndex = Math.min(noButtonRunCount, runningMessages.length - 1);
        msgText = runningMessages[runIndex];
    }
    message.textContent = msgText;
    
    message.style.left = (rect.left + rect.width / 2 - 60) + 'px';
    message.style.top = (rect.top - 50) + 'px';
    document.body.appendChild(message);
    
    setTimeout(() => message.remove(), 2000);
}

function handleLoveYes() {
    const options = document.getElementById('loveGameOptions');
    const successMsg = document.getElementById('loveSuccessMessage');
    const hint = document.getElementById('loveGameHint');
    
    // Hide options
    if (options) {
        options.style.display = 'none';
    }
    
    // Hide hint
    if (hint) {
        hint.style.display = 'none';
    }
    
    // Show success message
    if (successMsg) {
        successMsg.style.display = 'block';
    }
    
    // Big celebration
    createConfettiBurst();
    createConfettiBurst();
    createFireworks();
    createRosePetals();
    
    // Create lots of hearts
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.innerHTML = ['💖', '💕', '💗', '💓', '💞', '💘'][Math.floor(Math.random() * 6)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDuration = '4s';
            heart.style.fontSize = (30 + Math.random() * 40) + 'px';
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 4000);
        }, i * 100);
    }
}

function resetLoveGame() {
    const noBtn = document.getElementById('loveNoBtn');
    const yesBtn = document.getElementById('loveYesBtn');
    const options = document.getElementById('loveGameOptions');
    const successMsg = document.getElementById('loveSuccessMessage');
    const hint = document.getElementById('loveGameHint');
    
    // Reset variables
    loveGameLevel = 0;
    noButtonRunCount = 0;
    
    // Reset NO button
    if (noBtn) {
        noBtn.style.position = 'relative';
        noBtn.style.left = 'auto';
        noBtn.style.top = 'auto';
        noBtn.style.transform = '';
        noBtn.style.transition = '';
        noBtn.style.opacity = '1';
        noBtn.style.pointerEvents = 'auto';
        noBtn.style.zIndex = '';
        noBtn.classList.remove('running', 'caught', 'escaping');
    }
    
    // Reset YES button
    if (yesBtn) {
        for (let i = 0; i <= 15; i++) {
            yesBtn.classList.remove('size-' + i);
        }
        yesBtn.classList.remove('size-fill-screen', 'pulse');
        yesBtn.style = '';
    }
    
    // Reset card background
    const card = document.querySelector('.love-game-card');
    if (card) {
        card.classList.remove('level-5', 'level-8', 'level-10', 'level-12', 'level-15');
    }
    
    // Show options
    if (options) {
        options.style.display = 'flex';
    }
    
    // Hide success message
    if (successMsg) {
        successMsg.style.display = 'none';
    }
    
    // Show hint
    if (hint) {
        hint.style.display = 'block';
        hint.classList.remove('hidden');
    }
}

// Reset love game when leaving page 5
const originalNextPage = window.nextPage;
const originalPrevPage = window.prevPage;
