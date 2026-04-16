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
    audioVisualizer: document.getElementById('audio-visualizer')
};

let galleryInterval = null;

// Quita el cargador al inicio
export const hideLoader = () => {
    if (DOM.loader) {
        DOM.loader.classList.add('hidden');
    }
};

// Pasa de la pantalla de inicio a la app
export const showApp = () => {
    DOM.homeScreen.classList.remove('active');
    DOM.homeScreen.classList.add('hidden');
    DOM.appContainer.classList.remove('hidden');
};

export const initThemeUI = () => {
    const isDark = localStorage.getItem('uao-theme') === 'dark';
    if (isDark) document.body.classList.add('dark');
};

export const toggleThemeUI = () => {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('uao-theme', isDark ? 'dark' : 'light');
};

// CARRUSEL DE BIENVENIDA (ORIGINAL)
export const renderWelcomeCarousel = (zones, onZoneSelect) => {
    if (!DOM.welcomeCarousel) return;
    DOM.welcomeCarousel.innerHTML = '';
    zones.forEach(zone => {
        const card = document.createElement('div');
        card.className = 'carousel-card';
        card.innerHTML = `
            <img src="${zone.images?.[0] || zone.image}" class="carousel-img">
            <div class="carousel-info">
                <span>${zone.category}</span>
                <h4>${zone.name}</h4>
            </div>
        `;
        card.onclick = () => onZoneSelect(zone.id);
        DOM.welcomeCarousel.appendChild(card);
    });
};

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
        btn.innerHTML = `<strong>${zone.name}</strong><br><small>${zone.category}</small>`;
        btn.onclick = () => onZoneSelect(zone.id);
        DOM.zonesList.appendChild(btn);
    });
};

// DETALLE DE ZONA (VIDEO CORREGIDO + BOTÓN LINK)
export const renderZoneDetailUI = (zone) => {
    if (galleryInterval) clearInterval(galleryInterval);

    DOM.zTitle.textContent = zone.name;
    DOM.zDesc.textContent = zone.description;
    DOM.zCategory.textContent = zone.category;

    // Mostrar/Ocultar Link
    if (zone.link) {
        DOM.zLink.href = zone.link;
        DOM.zLink.style.display = 'inline-flex';
    } else {
        DOM.zLink.style.display = 'none';
    }

    DOM.zAudio.src = zone.audio || '';
    DOM.zAudio.load();

    const gallery = document.getElementById('media-gallery');
    gallery.innerHTML = '';

    const media = [];
    if (zone.images) zone.images.forEach(i => media.push({ type: 'img', src: i }));
    if (zone.videos) zone.videos.forEach(v => media.push({ type: 'vid', src: v }));

    let currentIdx = 0;

    const render = () => {
        gallery.innerHTML = `
            <div id="slides-wrapper">
                ${media.map((m, i) => `
                    <div class="media-slide ${i === 0 ? 'active' : ''}">
                        ${m.type === 'img' ? `<img src="${m.src}">` : `<video src="${m.src}" autoplay muted loop playsinline></video>`}
                    </div>
                `).join('')}
            </div>
            <div class="gallery-controls">
                <button class="gallery-btn" id="prev-slide">❮</button>
                <button class="gallery-btn" id="next-slide">❯</button>
            </div>
        `;
    };

    if (media.length > 0) {
        render();
        const slides = gallery.querySelectorAll('.media-slide');
        const update = (step) => {
            slides[currentIdx].classList.remove('active');
            currentIdx = (currentIdx + step + media.length) % media.length;
            slides[currentIdx].classList.add('active');
        };
        gallery.querySelector('#next-slide').onclick = () => update(1);
        gallery.querySelector('#prev-slide').onclick = () => update(-1);
        galleryInterval = setInterval(() => update(1), 4000);
    }

    DOM.emptyState.classList.add('hidden');
    DOM.zoneDetail.classList.remove('hidden');
};

// Necesaria para el botón de cerrar mapa si main.js la llama
export const toggleFullscreenMap = (isFullscreen) => {
    const wrapper = document.getElementById('minimap-wrapper');
    if (wrapper) wrapper.classList.toggle('fullscreen', isFullscreen);
};