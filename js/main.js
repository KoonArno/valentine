// Background Music
const bgMusic = new Audio('music/song.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.1;

function startMusic() {
    bgMusic.play().catch(() => {});
}

// Gallery Data
const galleryData = {
    smile: {
        title: 'รอยยิ้มที่น่ารักของเธอ 😍',
        items: [
            { type: 'image', src: 'images/you_1_1.jpg', caption: 'ยิ้มหวานๆ ของเธอ' },
            { type: 'video', src: 'videos/you_1.mp4', caption: 'วิดีโอน่ารักของเธอ' },
            { type: 'video', src: 'videos/you_2.mp4', caption: 'ช่วงเวลาพิเศษ' },
            { type: 'video', src: 'videos/you_3.mp4', caption: 'ความทรงจำดีๆ' },
        ]
    },
    date: {
        title: 'เดทของเรา 💑',
        items: [
            { type: 'image', src: 'images/date_1.jpg', caption: 'เดทที่คาเฟ่น่ารัก' },
            { type: 'image', src: 'images/date_2.jpg', caption: 'ทานข้าวด้วยกัน' },
            { type: 'video', src: 'videos/album_UTW001zEqMW4_output.mp4', caption: 'วิดีโอตอนเดท' },
        ]
    }
};

// Gallery State
let currentGallery = null;
let currentSlide = 0;
let isPlaying = true;
let slideInterval = null;
const SLIDE_DURATION = 3000;

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
    
    if (index >= items.length) index = 0;
    if (index < 0) index = items.length - 1;
    
    currentSlide = index;
    
    const item = items[index];
    const slideImage = document.getElementById('slideImage');
    
    slideImage.innerHTML = '';
    slideImage.className = 'slide-image';
    
    if (item.type === 'video') {
        // Video slide
        slideImage.classList.add('video-slide');
        if (item.src) {
            // มีไฟล์วิดีโอจริง
            slideImage.innerHTML = `
                <video controls autoplay muted playsinline 
                    style="width: 100%; height: 100%; object-fit: contain;"
                    onplay="pauseSlideshow()" 
                    onended="resumeSlideshow()"
                    onpause="checkVideoEnded(this)">
                    <source src="${item.src}" type="video/mp4">
                    เบราว์เซอร์ไม่รองรับวิดีโอ
                </video>
            `;
        } else {
            // ไม่มีไฟล์ - แสดงกรอบเปล่า
            slideImage.innerHTML = '';
        }
        pauseSlideshow();
    } else {
        // Image slide
        if (item.src) {
            slideImage.innerHTML = `<img src="${item.src}" alt="${item.caption}">`;
        } else {
            // ไม่มีไฟล์ - แสดงกรอบเปล่า
            slideImage.innerHTML = '';
        }
        resumeSlideshow();
    }
    
    document.getElementById('modalCaption').textContent = item.caption;
    
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
        // แสดง icon บน dot เพื่อแยกประเภท
        const itemType = items[i].type;
        dot.innerHTML = itemType === 'video' ? '🎬' : '';
        dot.style.fontSize = '8px';
        dot.style.display = 'flex';
        dot.style.alignItems = 'center';
        dot.style.justifyContent = 'center';
        dot.style.lineHeight = '1';
    });
    
    const progressBar = document.getElementById('progressBar');
    if (progressBar && isPlaying && item.type !== 'video') {
        progressBar.classList.remove('animating');
        void progressBar.offsetWidth;
        progressBar.classList.add('animating');
    }
}

// Pause slideshow (called when video plays)
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

// Resume slideshow (called when video ends)
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

// Check if video ended
function checkVideoEnded(video) {
    if (video.ended || video.paused) {
        resumeSlideshow();
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
    
    const progressBar = document.getElementById('progressBar');
    progressBar.classList.remove('animating');
    void progressBar.offsetWidth;
    progressBar.classList.add('animating');
    
    slideInterval = setInterval(() => {
        showSlide(currentSlide + 1);
        const bar = document.getElementById('progressBar');
        bar.classList.remove('animating');
        void bar.offsetWidth;
        bar.classList.add('animating');
    }, SLIDE_DURATION);
}

// Stop Slideshow
function stopSlideshow() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
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
    
    if (pageNum !== 5) {
        resetLoveGame();
    }
}

function prevPage(pageNum) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page' + pageNum).classList.add('active');
    
    if (pageNum !== 5) {
        resetLoveGame();
    }
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

// Open gift
function openGift() {
    const box = document.getElementById('giftBox');
    const message = document.getElementById('surpriseMessage');
    
    box.classList.add('opening');
    
    setTimeout(() => {
        box.classList.add('hidden');
        message.classList.add('show');
        createFireworks();
        createConfettiBurst();
    }, 500);
}

// Reset gift
function resetGiftAndGoBack() {
    const box = document.getElementById('giftBox');
    const message = document.getElementById('surpriseMessage');
    
    box.classList.remove('hidden', 'opening');
    message.classList.remove('show');
    
    prevPage(5);
}

// Celebrate
function celebrate() {
    createFireworks();
    createConfettiBurst();
    
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
                particle.style.position = 'fixed';
                particle.style.width = '6px';
                particle.style.height = '6px';
                particle.style.borderRadius = '50%';
                particle.style.backgroundColor = color;
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                particle.style.pointerEvents = 'none';
                particle.style.zIndex = '90';
                
                const angle = (j / 20) * Math.PI * 2;
                const velocity = 100 + Math.random() * 100;
                const tx = Math.cos(angle) * velocity;
                const ty = Math.sin(angle) * velocity;
                
                document.body.appendChild(particle);
                
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

// Love Game
let loveGameLevel = 0;
let noButtonRunCount = 0;

function handleLoveNoPress(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const noBtn = document.getElementById('loveNoBtn');
    const yesBtn = document.getElementById('loveYesBtn');
    const hint = document.getElementById('loveGameHint');
    
    if (!noBtn || noBtn.style.opacity === '0') return;
    
    if (hint && noButtonRunCount === 0) {
        hint.style.opacity = '0';
    }
    
    moveNoButton(noBtn);
    growYesButton(yesBtn);
    
    noButtonRunCount++;
    
    if (loveGameLevel >= 15) {
        setTimeout(() => {
            noBtn.style.opacity = '0';
            noBtn.style.pointerEvents = 'none';
            createConfettiBurst();
            createFireworks();
        }, 300);
    }
}

function moveNoButton(btn) {
    const rect = btn.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    const padding = 80;
    const maxX = viewportWidth - rect.width - padding;
    const maxY = viewportHeight - rect.height - padding;
    
    const newX = padding + Math.random() * (maxX - padding);
    const newY = padding + Math.random() * (maxY - padding);
    
    btn.style.position = 'fixed';
    btn.style.left = newX + 'px';
    btn.style.top = newY + 'px';
    btn.style.transition = 'all 0.3s ease-out';
    btn.style.zIndex = '50';
}

function growYesButton(btn) {
    loveGameLevel++;
    
    const scale = 1 + (loveGameLevel * 0.15);
    btn.style.transform = `scale(${Math.min(scale, 5)})`;
    btn.style.transition = 'transform 0.3s ease';
}

function handleLoveYes() {
    const options = document.getElementById('loveGameOptions');
    const successMsg = document.getElementById('loveSuccessMessage');
    const hint = document.getElementById('loveGameHint');
    
    if (options) options.style.display = 'none';
    if (hint) hint.style.display = 'none';
    if (successMsg) successMsg.style.display = 'block';
    
    createConfettiBurst();
    createConfettiBurst();
    createFireworks();
    
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
    
    loveGameLevel = 0;
    noButtonRunCount = 0;
    
    if (noBtn) {
        noBtn.style = '';
    }
    
    if (yesBtn) {
        yesBtn.style = '';
    }
    
    if (options) options.style.display = 'flex';
    if (successMsg) successMsg.style.display = 'none';
    if (hint) {
        hint.style.display = 'block';
        hint.style.opacity = '1';
    }
}

// ============================================
// Card Preview Slideshow
// ============================================
const cardPreviewIntervals = [];

function initCardPreviews() {
    const placeholders = document.querySelectorAll('.photo-placeholder[data-gallery]');
    
    placeholders.forEach(placeholder => {
        const galleryId = placeholder.dataset.gallery;
        const data = galleryData[galleryId];
        if (!data || !data.items.length) return;
        
        // Clear existing content
        placeholder.innerHTML = '';
        
        // Create slides
        data.items.forEach((item, index) => {
            const slide = document.createElement('div');
            slide.className = 'card-slide' + (index === 0 ? ' active' : '');
            
            if (item.type === 'video') {
                // For video: show first frame as poster or a thumbnail
                if (item.src) {
                    const video = document.createElement('video');
                    video.src = item.src;
                    video.muted = true;
                    video.playsInline = true;
                    video.preload = 'metadata';
                    video.currentTime = 0.5; // grab a frame at 0.5s
                    slide.appendChild(video);
                }
                // Play icon overlay
                const icon = document.createElement('div');
                icon.className = 'video-icon';
                icon.innerHTML = '▶️';
                slide.appendChild(icon);
            } else {
                // Image
                if (item.src) {
                    const img = document.createElement('img');
                    img.src = item.src;
                    img.alt = item.caption;
                    img.loading = 'lazy';
                    slide.appendChild(img);
                }
            }
            
            placeholder.appendChild(slide);
        });
        
        // Create dots
        if (data.items.length > 1) {
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'card-dots';
            
            data.items.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'card-dot' + (index === 0 ? ' active' : '');
                dotsContainer.appendChild(dot);
            });
            
            placeholder.appendChild(dotsContainer);
        }
        
        // Auto-swipe
        if (data.items.length > 1) {
            let currentIndex = 0;
            const slides = placeholder.querySelectorAll('.card-slide');
            const dots = placeholder.querySelectorAll('.card-dot');
            
            const interval = setInterval(() => {
                slides[currentIndex].classList.remove('active');
                if (dots[currentIndex]) dots[currentIndex].classList.remove('active');
                
                currentIndex = (currentIndex + 1) % slides.length;
                
                slides[currentIndex].classList.add('active');
                if (dots[currentIndex]) dots[currentIndex].classList.add('active');
            }, 2500);
            
            cardPreviewIntervals.push(interval);
        }
    });
}

// Initialize
createFloatingHearts();
initCardPreviews();
