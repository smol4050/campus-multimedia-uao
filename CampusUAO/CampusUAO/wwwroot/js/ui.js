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

/* Restauro el Carrusel de Bienvenida Original */
export const renderWelcomeCarousel = (zones, onZoneSelect) => {
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
        btn.innerHTML = `<span>${zone.category}</span><br><strong>${zone.name}</strong>`;
        btn.onclick = () => onZoneSelect(zone.id);
        DOM.zonesList.appendChild(btn);
    });
};

/* Detalle de Zona con Botón de Link y Videos Corregidos */
export const renderZoneDetailUI = (zone) => {
    if (galleryInterval) clearInterval(galleryInterval);

    DOM.zTitle.textContent = zone.name;
    DOM.zDesc.textContent = zone.description;
    DOM.zCategory.textContent = zone.category;

    // Botón de Link (Más información) restaurado
    if (zone.link) {
        DOM.zLink.href = zone.link;
        DOM.zLink.style.display = 'inline-flex';
        DOM.zLink.classList.remove('hidden');
    } else {
        DOM.zLink.style.display = 'none';
        DOM.zLink.classList.add('hidden');
    }

    DOM.zAudio.src = zone.audio;
    DOM.zAudio.load();

    // Galería con Videos Corregidos
    const gallery = document.getElementById('media-gallery');
    gallery.innerHTML = '';

    const media = [];
    if (zone.images) zone.images.forEach(i => media.push({ type: 'img', src: i }));
    if (zone.videos) zone.videos.forEach(v => media.push({ type: 'vid', src: v }));

    let currentIdx = 0;

    const renderMedia = () => {
        gallery.innerHTML = `
            <div id="slides-wrapper">
                ${media.map((m, i) => `
                    <div class="media-slide ${i === 0 ? 'active' : ''}">
                        ${m.type === 'img'
                ? `<img src="${m.src}">`
                : `<video src="${m.src}" autoplay muted loop playsinline></video>`}
                    </div>
                `).join('')}
            </div>
            <div class="gallery-controls">
                <button class="gallery-btn" id="prev-slide">❮</button>
                <button class="gallery-btn" id="next-slide">❯</button>
            </div>
            <div class="gallery-dots">
                ${media.map((_, i) => `<span class="dot ${i === 0 ? 'active' : ''}" data-idx="${i}"></span>`).join('')}
            </div>
        `;
    };

    const updateSlider = (newIdx) => {
        const slides = gallery.querySelectorAll('.media-slide');
        const dots = gallery.querySelectorAll('.dot');
        slides[currentIdx].classList.remove('active');
        dots[currentIdx].classList.remove('active');
        currentIdx = (newIdx + media.length) % media.length;
        slides[currentIdx].classList.add('active');
        dots[currentIdx].classList.add('active');
    };

    renderMedia();

    gallery.querySelector('#next-slide').onclick = () => updateSlider(currentIdx + 1);
    gallery.querySelector('#prev-slide').onclick = () => updateSlider(currentIdx - 1);

    galleryInterval = setInterval(() => updateSlider(currentIdx + 1), 4000);

    DOM.emptyState.classList.add('hidden');
    DOM.zoneDetail.classList.remove('hidden');
};