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

// Se renombra a galleryTimeout por precisión técnica
let galleryTimeout = null;
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
        DOM.themeToggle.classList.add('active');
    }
};

export const toggleThemeUI = () => {
    document.body.classList.toggle('dark');

    const isDark = document.body.classList.contains('dark');

    DOM.themeToggle.classList.toggle('active', isDark);

    localStorage.setItem('uao-theme', isDark ? 'dark' : 'light');
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
        btn.innerHTML = `<span class="zone-item-cat">${zone.category}</span>
                         <span class="zone-item-title">${zone.name}</span>`;
        btn.onclick = () => onZoneSelect(zone.id);
        DOM.zonesList.appendChild(btn);
    });
};

export const renderWelcomeCarousel = (zones, onZoneSelect) => {
    DOM.welcomeCarousel.innerHTML = '';
    zones.forEach(zone => {
        const card = document.createElement('div');
        card.className = 'carousel-card';
        card.innerHTML = `<img src="${zone.images?.[0] || zone.image}" class="carousel-img">
                         <div class="carousel-info">
                            <span>${zone.category}</span>
                            <h4>${zone.name}</h4>
                         </div>`;
        card.onclick = () => onZoneSelect(zone.id);
        DOM.welcomeCarousel.appendChild(card);
    });
};

/* ================= GALERÍA PRO CORREGIDA ================= */
export const renderZoneDetailUI = (zone) => {
    // Limpieza de procesos previos
    clearTimeout(galleryTimeout);
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
    if (zone.images) zone.images.forEach(i => media.push({ type: 'image', src: i }));
    if (zone.videos) zone.videos.forEach(v => media.push({ type: 'video', src: v }));

    let index = 0;

    const render = () => {
        gallery.innerHTML = `
            <div id="slides-wrapper">
                ${media.map((m, i) => `
                    <div class="media-slide ${i === 0 ? 'active' : ''}">
                        ${m.type === 'image'
                ? `<img src="${m.src}">`
                : `<video muted playsinline autoplay preload="auto">
                                <source src="${m.src}" type="video/mp4">
                           </video>`}
                    </div>
                `).join('')}
            </div>
            <div class="gallery-controls">
                <button class="gallery-btn" id="prev">‹</button>
                <button class="gallery-btn" id="next">›</button>
            </div>
            <div class="gallery-dots">
                ${media.map((_, i) => `<span class="dot ${i === 0 ? 'active' : ''}" data-idx="${i}"></span>`).join('')}
            </div>
        `;
    };

    const update = () => {
        clearTimeout(galleryTimeout);
        const slides = gallery.querySelectorAll(".media-slide");
        const dots = gallery.querySelectorAll(".dot");

        slides.forEach((s, i) => s.classList.toggle("active", i === index));
        dots.forEach((d, i) => d.classList.toggle("active", i === index));

        const activeSlide = slides[index];
        const video = activeSlide.querySelector("video");

        if (video) {
            currentVideo = video;
            video.currentTime = 0;
            // Se usa promesa para manejar políticas de autoplay
            video.play().catch(err => console.log("Autoplay prevent: user interaction needed."));
            video.onended = () => next();
        } else {
            currentVideo = null;
            galleryTimeout = setTimeout(next, 4000);
        }
    };

    const next = () => {
        index = (index + 1) % media.length;
        update();
    };

    const prev = () => {
        index = (index - 1 + media.length) % media.length;
        update();
    };

    render();
    update();

    // Eventos de controles
    gallery.onclick = (e) => {
        if (e.target.id === "next") next();
        if (e.target.id === "prev") prev();
        if (e.target.classList.contains("dot")) {
            index = parseInt(e.target.dataset.idx);
            update();
        }
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