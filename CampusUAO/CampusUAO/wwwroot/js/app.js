///**
// * Arquitectura modular centralizada para "Explora el Campus UAO"
// * Implementa patrón Módulo / IIFE para encapsular estado y lógica.
// */

//const App = (() => {
//    // ==========================================================================
//    // Estado Global de la Aplicación
//    // ==========================================================================
//    const state = {
//        zones: [],
//        categories: [],
//        currentFilter: 'Todos',
//        activeZoneId: null
//    };

//    // ==========================================================================
//    // Elementos del DOM
//    // ==========================================================================
//    const DOM = {
//        // Core Layout
//        loader: document.getElementById('loader'),
//        homeScreen: document.getElementById('home-screen'),
//        appContainer: document.getElementById('app'),
//        btnExplore: document.getElementById('btn-explore'),
//        themeToggle: document.getElementById('theme-toggle'),

//        // Navigation & Lists
//        filtersContainer: document.getElementById('filters-container'),
//        zonesList: document.getElementById('zones-list'),
//        emptyState: document.getElementById('empty-state'),
//        zoneDetail: document.getElementById('zone-detail'),

//        // Zone Content
//        zCategory: document.getElementById('zone-category'),
//        zTitle: document.getElementById('zone-title'),
//        zImage: document.getElementById('zone-image'),
//        zDesc: document.getElementById('zone-description'),
//        zAudio: document.getElementById('zone-audio'),

//        // Map Elements
//        minimapWrapper: document.getElementById('minimap-wrapper'),
//        btnFullscreenMap: document.getElementById('btn-fullscreen-map'),
//        btnCloseMap: document.getElementById('btn-close-map')
//    };

//    // ==========================================================================
//    // Inicialización & Configuración
//    // ==========================================================================
//    const init = async () => {
//        initTheme();
//        bindEvents();
//        await loadData();
//    };

//    const loadData = async () => {
//        try {
//            const response = await fetch('data/zones.json');
//            if (!response.ok) throw new Error('Network response was not ok');

//            const data = await response.json();
//            state.zones = data;

//            const cats = new Set(data.map(z => z.category));
//            state.categories = ['Todos', ...Array.from(cats)];

//            renderFilters();
//            renderZonesList();

//        } catch (error) {
//            console.error('Error cargando los datos:', error);
//            DOM.zonesList.innerHTML = '<p style="color:red; padding: 20px;">Error al cargar las zonas. Verifica el JSON.</p>';
//        } finally {
//            setTimeout(() => {
//                DOM.loader.classList.add('hidden');
//            }, 600);
//        }
//    };

//    const bindEvents = () => {
//        // Theme
//        DOM.themeToggle.addEventListener('click', toggleTheme);

//        // Navigation: Home -> App
//        DOM.btnExplore.addEventListener('click', navigateToApp);

//        // Map Fullscreen Logic
//        DOM.btnFullscreenMap.addEventListener('click', openFullscreenMap);
//        DOM.btnCloseMap.addEventListener('click', closeFullscreenMap);
//    };

//    // ==========================================================================
//    // Lógica de Navegación UX
//    // ==========================================================================
//    const navigateToApp = () => {
//        DOM.homeScreen.classList.add('hidden');
//        DOM.appContainer.classList.remove('hidden');
//    };

//    const openFullscreenMap = () => {
//        DOM.minimapWrapper.classList.add('fullscreen');
//        DOM.btnCloseMap.classList.remove('hidden');
//        document.body.style.overflow = 'hidden'; // Prevenir scroll de fondo
//    };

//    const closeFullscreenMap = () => {
//        DOM.minimapWrapper.classList.remove('fullscreen');
//        DOM.btnCloseMap.classList.add('hidden');
//        document.body.style.overflow = '';
//    };

//    // ==========================================================================
//    // Lógica del Tema (Dark Mode)
//    // ==========================================================================
//    const initTheme = () => {
//        const savedTheme = localStorage.getItem('uao-theme');
//        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

//        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
//            document.body.classList.add('dark');
//            DOM.themeToggle.textContent = '☀️';
//        } else {
//            DOM.themeToggle.textContent = '🌙';
//        }
//    };

//    const toggleTheme = () => {
//        document.body.classList.toggle('dark');
//        const isDark = document.body.classList.contains('dark');
//        localStorage.setItem('uao-theme', isDark ? 'dark' : 'light');
//        DOM.themeToggle.textContent = isDark ? '☀️' : '🌙';
//    };

//    // ==========================================================================
//    // Renderizado UI
//    // ==========================================================================
//    const renderFilters = () => {
//        DOM.filtersContainer.innerHTML = '';
//        const fragment = document.createDocumentFragment();

//        state.categories.forEach(cat => {
//            const btn = document.createElement('button');
//            btn.className = `filter-btn ${cat === state.currentFilter ? 'active' : ''}`;
//            btn.textContent = cat;

//            btn.addEventListener('click', () => {
//                state.currentFilter = cat;
//                renderFilters();
//                renderZonesList();
//            });

//            fragment.appendChild(btn);
//        });

//        DOM.filtersContainer.appendChild(fragment);
//    };

//    const renderZonesList = () => {
//        DOM.zonesList.innerHTML = '';
//        const fragment = document.createDocumentFragment();

//        const filteredZones = state.currentFilter === 'Todos'
//            ? state.zones
//            : state.zones.filter(z => z.category === state.currentFilter);

//        if (filteredZones.length === 0) {
//            DOM.zonesList.innerHTML = '<p style="padding: 20px; opacity: 0.6;">No hay zonas en esta categoría.</p>';
//            return;
//        }

//        filteredZones.forEach(zone => {
//            const btn = document.createElement('button');
//            btn.className = `zone-item ${zone.id === state.activeZoneId ? 'active' : ''}`;

//            btn.innerHTML = `
//                <span class="zone-item-title">${zone.name}</span>
//                <span class="zone-item-cat">${zone.category}</span>
//            `;

//            btn.addEventListener('click', () => selectZone(zone.id));
//            fragment.appendChild(btn);
//        });

//        DOM.zonesList.appendChild(fragment);
//    };

//    // ==========================================================================
//    // Interacciones de Contenido
//    // ==========================================================================
//    const selectZone = (id) => {
//        state.activeZoneId = id;
//        renderZonesList();

//        const zone = state.zones.find(z => z.id === id);
//        if (zone) renderZoneDetail(zone);
//    };

//    const renderZoneDetail = (zone) => {
//        DOM.zAudio.pause();

//        DOM.zCategory.textContent = zone.category;
//        DOM.zTitle.textContent = zone.name;
//        DOM.zImage.src = zone.image;
//        DOM.zImage.alt = `Vista de ${zone.name}`;
//        DOM.zDesc.textContent = zone.description;

//        DOM.zAudio.src = zone.audio;
//        DOM.zAudio.load();

//        DOM.emptyState.classList.remove('active');
//        DOM.zoneDetail.classList.remove('hidden');

//        DOM.zoneDetail.style.animation = 'none';
//        DOM.zoneDetail.offsetHeight;
//        DOM.zoneDetail.style.animation = null;
//    };

//    return { init };
//})();

//document.addEventListener('DOMContentLoaded', App.init);