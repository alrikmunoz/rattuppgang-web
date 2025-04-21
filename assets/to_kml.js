function reverseCoordinates(pos) {
    if (!pos) return '';
    const [lat, lon] = pos.split(',').map(coord => coord.trim());
    return `${lon},${lat}`;
}

function generateKMLForAllStations(data) {
    const kmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
<Document>`;
    const kmlFooter = `</Document></kml>`;

    let placemarks = '';

    for (const [stationName, stationData] of Object.entries(data)) {
        for (const [position, exitList] of Object.entries(stationData.exits)) {
            for (const exit of exitList) {
                placemarks += `
<Placemark>
    <name>${stationName} - ${exit.name}</name>
    <description>${stationName} - ${position} exit</description>
    <Point>
        <coordinates>${reverseCoordinates(exit.pos)},0</coordinates>
    </Point>
</Placemark>`;
            }
        }
    }

    return `${kmlHeader}${placemarks}${kmlFooter}`;
}


function exportAllToKML() {
    const kmlContent = generateKMLForAllStations(tunnelbanekarta);
    const blob = new Blob([kmlContent], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'tunnelbaneuppgångar.kml';
    a.click();

    URL.revokeObjectURL(url);
}

// Add event listener for KML export button
document.addEventListener('DOMContentLoaded', () => {
    const exportAllButton = document.createElement('button');
    exportAllButton.id = 'export-all-kml';
    exportAllButton.textContent = 'Export All to KML';
    const mainNode = document.querySelector('main');
    if (!mainNode) {
        console.error('Main node not found!');
        return;
    }
    mainNode.appendChild(exportAllButton);

    exportAllButton.addEventListener('click', exportAllToKML);
});