const DOM = {
    loader: document.getElementById('loader'),
    homeScreen: document.getElementById('home-screen'),
    appContainer: document.getElementById('app'),
    zonesList: document.getElementById('zones-list'),
    zoneDetail: document.getElementById('zone-detail'),
    emptyState: document.getElementById('empty-state'),
    zTitle: document.getElementById('zone-title'),
    zDesc: document.getElementById('zone-description'),
    zAudio: document.getElementById('zone-audio'),
    zCategory: document.getElementById('zone-category'),
    zLink: document.getElementById('zone-link'),
    gallery: document.getElementById('media-gallery'),
    btnExplore: document.getElementById('btn-explore')
};

let galleryInterval = null;
let currentIdx = 0;

export const showApp = () => {
    DOM.homeScreen.classList.add('hidden');
    DOM.appContainer.classList.remove('hidden');
};

export const hideLoader = () => {
    DOM.loader.classList.add('hidden');
};

export const renderZonesListUI = (zones, activeId, onSelect) => {
    DOM.zonesList.innerHTML = '';
    zones.forEach(z => {
        const btn = document.createElement('button');
        btn.className = `zone-item ${z.id === activeId ? 'active' : ''}`;
        btn.style.cssText = "width:100%; padding:15px; margin-bottom:10px; border-radius:10px; border:1px solid var(--border); background:none; cursor:pointer; text-align:left; color:inherit;";
        btn.innerHTML = `<strong>${z.name}</strong><br><small>${z.category}</small>`;
        btn.onclick = () => onSelect(z.id);
        DOM.zonesList.appendChild(btn);
    });
};

export const renderZoneDetailUI = (zone) => {
    // 1. Resetear estados
    if (galleryInterval) clearInterval(galleryInterval);
    currentIdx = 0;

    // 2. Información textual
    DOM.zTitle.textContent = zone.name;
    DOM.zDesc.textContent = zone.description;
    DOM.zCategory.textContent = zone.category;

    // 3. Audio
    DOM.zAudio.src = zone.audio || '';
    DOM.zAudio.load();

    // 4. Multimedia (Imágenes y Videos)
    const media = [];
    if (zone.images) zone.images.forEach(s => media.push({ type: 'img', src: s }));
    if (zone.videos) zone.videos.forEach(s => media.push({ type: 'vid', src: s }));

    setupGallery(media);

    DOM.emptyState.classList.add('hidden');
    DOM.zoneDetail.classList.remove('hidden');
};

function setupGallery(media) {
    if (media.length === 0) {
        DOM.gallery.innerHTML = '<p style="color:white; padding:20px;">Sin multimedia disponible</p>';
        return;
    }

    DOM.gallery.innerHTML = `
        <div id="slides-wrapper">
            ${media.map((m, i) => `
                <div class="media-slide ${i === 0 ? 'active' : ''}" data-idx="${i}">
                    ${m.type === 'img'
            ? `<img src="${m.src}" alt="Campus">`
            : `<video src="${m.src}" autoplay muted loop playsinline></video>`}
                </div>
            `).join('')}
        </div>
        <div class="gallery-controls">
            <button class="gallery-btn" id="prev-media">❮</button>
            <button class="gallery-btn" id="next-media">❯</button>
        </div>
        <div class="gallery-dots">
            ${media.map((_, i) => `<span class="dot ${i === 0 ? 'active' : ''}" data-dot="${i}"></span>`).join('')}
        </div>
    `;

    const slides = DOM.gallery.querySelectorAll('.media-slide');
    const dots = DOM.gallery.querySelectorAll('.dot');

    const showSlide = (n) => {
        slides[currentIdx].classList.remove('active');
        dots[currentIdx].classList.remove('active');
        currentIdx = (n + media.length) % media.length;
        slides[currentIdx].classList.add('active');
        dots[currentIdx].classList.add('active');
    };

    DOM.gallery.querySelector('#next-media').onclick = () => showSlide(currentIdx + 1);
    DOM.gallery.querySelector('#prev-media').onclick = () => showSlide(currentIdx - 1);

    // Cambio automático cada 5 segundos
    galleryInterval = setInterval(() => showSlide(currentIdx + 1), 5000);
}