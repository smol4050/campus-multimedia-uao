export const fetchZonesData = async () => {
    try {
        const url = `data/zones.json?t=${new Date().getTime()}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};