const DOM = {
    loader: document.getElementById('loader'),
    homeScreen: document.getElementById('home-screen'),
    appContainer: document.getElementById('app'),
    themeToggle: document.getElementById('theme-toggle'),
    filtersContainer: document.getElementById('filters-container'),
    zonesList: document.getElementById('zones-list'),
    emptyState: document.getElementById('empty-state'),
    welcomeCarousel: document.getElementById('welcome-carousel'),
    zoneDetail: document.getElementById('zone-detail'),
    zCategory: document.getElementById('zone-category'),
    zTitle: document.getElementById('zone-title'),
    zDesc: document.getElementById('zone-description'),
    zAudio: document.getElementById('zone-audio'),
    zLink: document.getElementById('zone-link'),
    audioVisualizer: document.getElementById('audio-visualizer'),
    minimapWrapper: document.getElementById('minimap-wrapper'),
    btnCloseMap: document.getElementById('btn-close-map')
};

let galleryInterval = null;
let currentVideo = null;

/* ================= AUDIO ================= */
DOM.zAudio.addEventListener('play', () => DOM.audioVisualizer.classList.add('active'));
DOM.zAudio.addEventListener('pause', () => DOM.audioVisualizer.classList.remove('active'));
DOM.zAudio.addEventListener('ended', () => DOM.audioVisualizer.classList.remove('active'));

/* ================= BASICS ================= */
export const hideLoader = () => setTimeout(() => DOM.loader.classList.add('hidden'), 600);

export const showApp = () => {
    DOM.homeScreen.classList.add('hidden');
    DOM.appContainer.classList.remove('hidden');
};

export const toggleFullscreenMap = (isFullscreen) => {
    if (isFullscreen) {
        DOM.minimapWrapper.classList.add('fullscreen');
        DOM.btnCloseMap.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    } else {
        DOM.minimapWrapper.classList.remove('fullscreen');
        DOM.btnCloseMap.classList.add('hidden');
        document.body.style.overflow = '';
    }
};

export const initThemeUI = () => {
    const savedTheme = localStorage.getItem('uao-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark');
        DOM.themeToggle.textContent = '☀️';
    } else {
        DOM.themeToggle.textContent = '🌙';
    }
};

export const toggleThemeUI = () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('uao-theme', isDark ? 'dark' : 'light');
    DOM.themeToggle.textContent = isDark ? '☀️' : '🌙';
};

/* ================= UI ================= */

export const renderFiltersUI = (categories, currentFilter, onFilterClick) => {
    DOM.filtersContainer.innerHTML = '';
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `filter-btn ${cat === currentFilter ? 'active' : ''}`;
        btn.textContent = cat;
        btn.onclick = () => onFilterClick(cat);
        DOM.filtersContainer.appendChild(btn);
    });
};

export const renderZonesListUI = (zones, activeZoneId, onZoneSelect) => {
    DOM.zonesList.innerHTML = '';
    zones.forEach(zone => {
        const btn = document.createElement('button');
        btn.className = `zone-item ${zone.id === activeZoneId ? 'active' : ''}`;
        btn.innerHTML = `<span>${zone.name}</span>`;
        btn.onclick = () => onZoneSelect(zone.id);
        DOM.zonesList.appendChild(btn);
    });
};

export const renderWelcomeCarousel = (zones, onZoneSelect) => {
    DOM.welcomeCarousel.innerHTML = '';
    zones.forEach(zone => {
        const card = document.createElement('div');
        card.className = 'carousel-card';
        card.innerHTML = `<img src="${zone.images?.[0] || zone.image}">`;
        card.onclick = () => onZoneSelect(zone.id);
        DOM.welcomeCarousel.appendChild(card);
    });
};

/* ================= GALERÍA PRO ================= */

export const renderZoneDetailUI = (zone) => {
    clearInterval(galleryInterval);
    if (currentVideo) {
        currentVideo.pause();
        currentVideo = null;
    }

    DOM.zCategory.textContent = zone.category;
    DOM.zTitle.textContent = zone.name;
    DOM.zDesc.textContent = zone.description;

    const gallery = document.getElementById("media-gallery");
    gallery.innerHTML = "";

    let media = [];

    if (zone.images) {
        zone.images.forEach(i => media.push({ type: 'image', src: i }));
    }

    if (zone.videos) {
        zone.videos.forEach(v => media.push({ type: 'video', src: v }));
    }

    let index = 0;

    const render = () => {
        gallery.innerHTML = media.map((m, i) => `
            <div class="media-slide ${i === 0 ? 'active' : ''}">
                ${m.type === 'image'
                ? `<img src="${m.src}">`
                : `<video muted playsinline preload="auto">
                        <source src="${m.src}" type="video/mp4">
                   </video>`}
            </div>
        `).join('') + `
        <div class="gallery-controls">
            <button class="gallery-btn" id="prev">‹</button>
            <button class="gallery-btn" id="next">›</button>
        </div>
        `;
    };

    const update = () => {
        const slides = gallery.querySelectorAll(".media-slide");
        slides.forEach((s, i) => s.classList.toggle("active", i === index));

        const active = slides[index];
        const video = active.querySelector("video");

        if (video) {
            currentVideo = video;
            video.currentTime = 0;
            video.play().catch(() => { });

            video.onended = () => {
                next();
            };
        } else {
            currentVideo = null;
            galleryInterval = setTimeout(next, 3000);
        }
    };

    const next = () => {
        clearTimeout(galleryInterval);
        index = (index + 1) % media.length;
        update();
    };

    const prev = () => {
        clearTimeout(galleryInterval);
        index = (index - 1 + media.length) % media.length;
        update();
    };

    render();
    update();

    gallery.onclick = (e) => {
        if (e.target.id === "next") next();
        if (e.target.id === "prev") prev();
    };

    /* LINK */
    if (zone.link) {
        DOM.zLink.href = zone.link;
        DOM.zLink.classList.remove('hidden');
    } else {
        DOM.zLink.classList.add('hidden');
    }

    /* AUDIO */
    DOM.zAudio.src = zone.audio;
    DOM.zAudio.load();

    DOM.emptyState.classList.add('hidden');
    DOM.zoneDetail.classList.remove('hidden');
};