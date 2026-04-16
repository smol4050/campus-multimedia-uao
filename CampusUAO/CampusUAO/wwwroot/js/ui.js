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

export const initThemeUI = () => {
    const savedTheme = localStorage.getItem('uao-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        DOM.themeToggle.textContent = '☀️';
    }
};

export const toggleThemeUI = () => {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('uao-theme', isDark ? 'dark' : 'light');
    DOM.themeToggle.textContent = isDark ? '☀️' : '🌙';
};

/* ================= RENDERIZADO (CORREGIDO) ================= */

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

export const renderZoneDetailUI = (zone) => {
    // 1. Limpiar procesos anteriores
    if (galleryTimeout) clearTimeout(galleryTimeout);
    if (currentVideo) {
        currentVideo.pause();
        currentVideo = null;
    }

    // 2. Info Básica
    DOM.zCategory.textContent = zone.category;
    DOM.zTitle.textContent = zone.name;
    DOM.zDesc.textContent = zone.description;

    // 3. Galería con Lógica de Video
    const gallery = document.getElementById("media-gallery");
    gallery.innerHTML = "";

    const media = [];
    if (zone.images) zone.images.forEach(img => media.push({ type: 'image', src: img }));
    if (zone.videos) zone.videos.forEach(vid => media.push({ type: 'video', src: vid }));

    let index = 0;

    const renderStructure = () => {
        gallery.innerHTML = `
            <div id="slides-container">
                ${media.map((m, i) => `
                    <div class="media-slide ${i === 0 ? 'active' : ''}">
                        ${m.type === 'image'
                ? `<img src="${m.src}">`
                : `<video muted playsinline preload="auto">
                                    <source src="${m.src}" type="video/mp4">
                               </video>`}
                    </div>
                `).join('')}
            </div>
            <div class="gallery-controls">
                <button class="gallery-btn" id="prev-btn">‹</button>
                <button class="gallery-btn" id="next-btn">›</button>
            </div>
            <div class="gallery-dots">
                ${media.map((_, i) => `<span class="dot ${i === 0 ? 'active' : ''}" data-idx="${i}"></span>`).join('')}
            </div>
        `;
    };

    const updateView = () => {
        if (galleryTimeout) clearTimeout(galleryTimeout);
        if (currentVideo) currentVideo.pause();

        const slides = gallery.querySelectorAll(".media-slide");
        const dots = gallery.querySelectorAll(".dot");

        slides.forEach((s, i) => s.classList.toggle("active", i === index));
        dots.forEach((d, i) => d.classList.toggle("active", i === index));

        const activeSlide = slides[index];
        const video = activeSlide.querySelector("video");

        if (video) {
            currentVideo = video;
            video.currentTime = 0;
            video.play().catch(() => { });
            video.onended = () => changeSlide(1);
        } else {
            galleryTimeout = setTimeout(() => changeSlide(1), 4000);
        }
    };

    const changeSlide = (step) => {
        index = (index + step + media.length) % media.length;
        updateView();
    };

    renderStructure();
    updateView();

    // Eventos
    gallery.onclick = (e) => {
        if (e.target.id === "next-btn") changeSlide(1);
        if (e.target.id === "prev-btn") changeSlide(-1);
        if (e.target.classList.contains("dot")) {
            index = parseInt(e.target.dataset.idx);
            updateView();
        }
    };

    // 4. Audio y Link
    DOM.zLink.classList.toggle('hidden', !zone.link);
    if (zone.link) DOM.zLink.href = zone.link;

    DOM.zAudio.src = zone.audio;
    DOM.zAudio.load();

    DOM.emptyState.classList.add('hidden');
    DOM.zoneDetail.classList.remove('hidden');
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

export const toggleFullscreenMap = (isFullscreen) => {
    DOM.minimapWrapper.classList.toggle('fullscreen', isFullscreen);
    DOM.btnCloseMap.classList.toggle('hidden', !isFullscreen);
    document.body.style.overflow = isFullscreen ? 'hidden' : '';
};