let map = null;
let currentMarkers = [];

// Variables integradas de Mapbox
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoic21vbDQwNTAiLCJhIjoiY21ueXh0djNjMDc3eDJxcG1hdjJ3cHE0eSJ9.zcn7z1InAFd0DwiVFSUTSA';
const MAPBOX_STYLE = 'smol4050/cmnyy4dvn002401qtat3t8odt';

export const initMapUI = () => {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    map = new mapboxgl.Map({
        container: 'map-container',
        style: `mapbox://styles/${MAPBOX_STYLE}`,
        center: [-76.5215, 3.3536], // Longitud primero
        zoom: 16.5,
        pitch: 60,   // Inclinación 3D
        bearing: -20, // Rotación
        antialias: true
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
};

export const renderMarkersUI = (zones, onMarkerClick) => {
    currentMarkers.forEach(marker => marker.remove());
    currentMarkers = [];

    zones.forEach(zone => {
        if (zone.lat && zone.lng) {
            const popup = new mapboxgl.Popup({
                offset: 25,
                closeButton: false,
                closeOnClick: false,
                className: 'custom-map-popup'
            }).setText(zone.name);

            const marker = new mapboxgl.Marker({ color: '#9c27b0' })
                .setLngLat([zone.lng, zone.lat])
                .addTo(map);

            const markerElement = marker.getElement();

            markerElement.addEventListener('mouseenter', () => popup.addTo(map));
            markerElement.addEventListener('mouseleave', () => popup.remove());
            markerElement.addEventListener('click', () => {
                onMarkerClick(zone.id);
            });

            marker.setPopup(popup);
            currentMarkers.push(marker);
        }
    });
};

export const focusMapOnZone = (zone) => {
    if (map && zone.lat && zone.lng) {
        map.flyTo({
            center: [zone.lng, zone.lat],
            zoom: 18.5,
            pitch: 65,
            bearing: map.getBearing() + 15,
            duration: 2000,
            essential: true
        });
    }
};

export const resizeMap = () => {
    if (map) {
        setTimeout(() => map.resize(), 300);
    }
};