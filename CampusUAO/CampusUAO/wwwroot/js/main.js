import { fetchZonesData } from './api.js';
import * as UI from './ui.js';
import * as MapUI from './map.js';

const AppState = {
    zones: [],
    categories: [],
    currentFilter: 'Todos',
    activeZoneId: null
};

const initApp = async () => {
    UI.initThemeUI();
    MapUI.initMapUI();
    bindGlobalEvents();

    const data = await fetchZonesData();
    if (data.length > 0) {
        AppState.zones = data;
        const cats = new Set(data.map(z => z.category));
        AppState.categories = ['Todos', ...Array.from(cats)];

        // Renderizamos el carrusel inicial
        UI.renderWelcomeCarousel(AppState.zones, handleZoneSelect);
        updateView();
    } else {
        document.getElementById('zones-list').innerHTML = '<p style="color:red; padding: 20px;">Data loading failed.</p>';
    }

    UI.hideLoader();
};

const bindGlobalEvents = () => {
    document.getElementById('theme-toggle').addEventListener('click', UI.toggleThemeUI);
    document.getElementById('btn-explore').addEventListener('click', UI.showApp);

    document.getElementById('btn-fullscreen-map').addEventListener('click', () => {
        UI.toggleFullscreenMap(true);
        MapUI.resizeMap();
    });

    document.getElementById('btn-close-map').addEventListener('click', () => {
        UI.toggleFullscreenMap(false);
        MapUI.resizeMap();
    });
};

const handleFilterChange = (newFilter) => {
    AppState.currentFilter = newFilter;
    updateView();
};

const handleZoneSelect = (zoneId) => {
    AppState.activeZoneId = zoneId;
    updateView();

    const selectedZone = AppState.zones.find(z => z.id === zoneId);
    if (selectedZone) {
        UI.renderZoneDetailUI(selectedZone);
        MapUI.focusMapOnZone(selectedZone);
    }
};

const updateView = () => {
    const filteredZones = AppState.currentFilter === 'Todos'
        ? AppState.zones
        : AppState.zones.filter(z => z.category === AppState.currentFilter);

    UI.renderFiltersUI(AppState.categories, AppState.currentFilter, handleFilterChange);
    UI.renderZonesListUI(filteredZones, AppState.activeZoneId, handleZoneSelect);
    MapUI.renderMarkersUI(filteredZones, handleZoneSelect);
};

document.addEventListener('DOMContentLoaded', initApp);