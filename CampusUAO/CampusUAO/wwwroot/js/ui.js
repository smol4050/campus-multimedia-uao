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
    zImage: document.getElementById('zone-image'),
    zVideo: document.getElementById('zone-video'),
    zDesc: document.getElementById('zone-description'),
    zAudio: document.getElementById('zone-audio'),
    zLink: document.getElementById('zone-link'),
    audioVisualizer: document.getElementById('audio-visualizer'),
    minimapWrapper: document.getElementById('minimap-wrapper'),
    btnCloseMap: document.getElementById('btn-close-map')
};

// --- ANIMACIONES DEL AUDIO ---
DOM.zAudio.addEventListener('play', () => DOM.audioVisualizer.classList.add('active'));
DOM.zAudio.addEventListener('pause', () => DOM.audioVisualizer.classList.remove('active'));
DOM.zAudio.addEventListener('ended', () => DOM.audioVisualizer.classList.remove('active'));

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
        DOM.zonesList.innerHTML = '<p style="padding: 20px; opacity: 0.6;">No se encontraron zonas.</p>';
        return;
    }
    const fragment = document.createDocumentFragment();
    zones.forEach(zone => {
        const btn = document.createElement('button');
        btn.className = `zone-item ${zone.id === activeZoneId ? 'active' : ''}`;
        btn.innerHTML = `<span class="zone-item-title">${zone.name}</span><span class="zone-item-cat">${zone.category}</span>`;
        btn.addEventListener('click', () => onZoneSelect(zone.id));
        fragment.appendChild(btn);
    });
    DOM.zonesList.appendChild(fragment);
};

export const renderWelcomeCarousel = (zones, onZoneSelect) => {
    DOM.welcomeCarousel.innerHTML = '';
    zones.forEach(zone => {
        const card = document.createElement('div');
        card.className = 'carousel-card';
        // En el carrusel siempre usamos la imagen de portada
        card.innerHTML = `
            <img class="carousel-img" src="${zone.image}" alt="${zone.name}">
            <div class="carousel-info">
                <span>${zone.category}</span>
                <h4>${zone.name}</h4>
            </div>
        `;
        card.addEventListener('click', () => onZoneSelect(zone.id));
        DOM.welcomeCarousel.appendChild(card);
    });
};

export const renderZoneDetailUI = (zone) => {
    DOM.zAudio.pause();
    DOM.audioVisualizer.classList.remove('active');

    DOM.zCategory.textContent = zone.category;
    DOM.zTitle.textContent = zone.name;
    DOM.zDesc.textContent = zone.description;

    const gallery = document.getElementById("media-gallery");
    gallery.innerHTML = "";

    let mediaItems = [];

    if (zone.images) {
        zone.images.forEach(img => {
            mediaItems.push({ type: "image", src: img });
        });
    }

    if (zone.videos) {
        zone.videos.forEach(video => {
            mediaItems.push({ type: "video", src: video });
        });
    }

    let currentIndex = 0;

    const renderSlides = () => {
        gallery.innerHTML = mediaItems.map((item, i) => {
            if (item.type === "image") {
                return `
                    <div class="media-slide ${i === 0 ? 'active' : ''}">
                        <img src="${item.src}">
                    </div>
                `;
            } else {
                return `
                    <div class="media-slide ${i === 0 ? 'active' : ''}">
                        <video autoplay loop muted playsinline>
                            <source src="${item.src}" type="video/mp4">
                        </video>
                    </div>
                `;
            }
        }).join("");

        gallery.innerHTML += `
            <div class="gallery-controls">
                <button class="gallery-btn" id="prev-btn">‹</button>
                <button class="gallery-btn" id="next-btn">›</button>
            </div>
            <div class="gallery-dots">
                ${mediaItems.map((_, i) => `<span class="${i === 0 ? 'active' : ''}"></span>`).join("")}
            </div>
        `;
    };

    const updateSlide = () => {
        const slides = gallery.querySelectorAll(".media-slide");
        const dots = gallery.querySelectorAll(".gallery-dots span");

        slides.forEach((s, i) => {
            s.classList.toggle("active", i === currentIndex);
        });

        dots.forEach((d, i) => {
            d.classList.toggle("active", i === currentIndex);
        });
    };

    renderSlides();

    gallery.addEventListener("click", (e) => {
        if (e.target.id === "next-btn") {
            currentIndex = (currentIndex + 1) % mediaItems.length;
            updateSlide();
        }

        if (e.target.id === "prev-btn") {
            currentIndex = (currentIndex - 1 + mediaItems.length) % mediaItems.length;
            updateSlide();
        }
    });

    // AUTO SLIDE
    setInterval(() => {
        currentIndex = (currentIndex + 1) % mediaItems.length;
        updateSlide();
    }, 4000);

    // LINK
    if (zone.link) {
        DOM.zLink.href = zone.link;
        DOM.zLink.classList.remove('hidden');
        DOM.zLink.style.display = 'inline-flex';
    } else {
        DOM.zLink.classList.add('hidden');
    }

    // AUDIO
    DOM.zAudio.src = zone.audio;
    DOM.zAudio.load();

    DOM.emptyState.classList.add('hidden');
    DOM.zoneDetail.classList.remove('hidden');
};