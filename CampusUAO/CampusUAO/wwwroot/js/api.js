export const fetchZonesData = async () => {
    try {
        const response = await fetch('data/zones.json');
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};