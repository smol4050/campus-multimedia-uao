const DOM = {
    loader: document.getElementById('loader'),
    homeScreen: document.getElementById('home-screen'),
    appContainer: document.getElementById('app'),
    themeToggle: document.getElementById('theme-toggle'),
    filtersContainer: document.getElementById('filters-container'),
    zonesList: document.getElementById('zones-list'),
    emptyState: document.getElementById('empty-state'),
    zoneDetail: document.getElementById('zone-detail'),
    zCategory: document.getElementById('zone-category'),
    zTitle: document.getElementById('zone-title'),
    zImage: document.getElementById('zone-image'),
    zDesc: document.getElementById('zone-description'),
    zAudio: document.getElementById('zone-audio'),
    minimapWrapper: document.getElementById('minimap-wrapper'),
    btnCloseMap: document.getElementById('btn-close-map')
};

export const hideLoader = () => {
    setTimeout(() => DOM.loader.classList.add('hidden'), 600);
};

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

export const renderFiltersUI = (categories, currentFilter, onFilterClick) => {
    DOM.filtersContainer.innerHTML = '';
    const fragment = document.createDocumentFragment();

    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `filter-btn ${cat === currentFilter ? 'active' : ''}`;
        btn.textContent = cat;
        btn.addEventListener('click', () => onFilterClick(cat));
        fragment.appendChild(btn);
    });

    DOM.filtersContainer.appendChild(fragment);
};

export const renderZonesListUI = (zones, activeZoneId, onZoneSelect) => {
    DOM.zonesList.innerHTML = '';
    if (zones.length === 0) {
        DOM.zonesList.innerHTML = '<p style="padding: 20px; opacity: 0.6;">No zones found.</p>';
        return;
    }

    const fragment = document.createDocumentFragment();
    zones.forEach(zone => {
        const btn = document.createElement('button');
        btn.className = `zone-item ${zone.id === activeZoneId ? 'active' : ''}`;
        btn.innerHTML = `
            <span class="zone-item-title">${zone.name}</span>
            <span class="zone-item-cat">${zone.category}</span>
        `;
        btn.addEventListener('click', () => onZoneSelect(zone.id));
        fragment.appendChild(btn);
    });

    DOM.zonesList.appendChild(fragment);
};

export const renderZoneDetailUI = (zone) => {
    DOM.zAudio.pause();

    DOM.zCategory.textContent = zone.category;
    DOM.zTitle.textContent = zone.name;
    DOM.zImage.src = zone.image;
    DOM.zImage.alt = `${zone.name} view`;
    DOM.zDesc.textContent = zone.description;
    DOM.zAudio.src = zone.audio;
    DOM.zAudio.load();

    DOM.emptyState.classList.remove('active');
    DOM.zoneDetail.classList.remove('hidden');

    DOM.zoneDetail.style.animation = 'none';
    DOM.zoneDetail.offsetHeight;
    DOM.zoneDetail.style.animation = null;
};