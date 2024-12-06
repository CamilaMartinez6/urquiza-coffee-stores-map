let map = L.map('map', { minZoom: 15 }).setView([-34.56860367496381, -58.485957296776725], 15);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let latlngs = [[-34.569770, -58.509432], [-34.561359, -58.491965], [-34.562631, -58.491021], [-34.559097, -58.483597], [-34.563892, -58.478977
], [-34.564078, -58.479299], [-34.566853, -58.476186], [-34.565706, -58.474327], [-34.572880, -58.468147], [-34.584787, -58.488790], [-34.569735, -58.509260]];
 
let polygon = L.polygon(latlngs, { color: '#49362c' }).addTo(map);

const query = `
[out:json];
node["amenity"="cafe"](poly:"-34.569770 -58.509432 -34.561359 -58.491965 -34.562631 -58.491021 -34.559097 -58.483597 -34.566766 -58.476216 -34.565706 -58.474327 -34.572880 -58.468147 -34.584787 -58.488790 -34.569735 -58.509260");
out body;`

const info =  {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `data=${encodeURIComponent(query)}`
}

fetch('https://overpass-api.de/api/interpreter', info)
    .then(response => response.json())
    .then(data => {
        if (data && data.elements) {
            const marcadores = [];

            data.elements.forEach(element => {
                if (element.lat && element.lon) {
                    const marcador = L.marker([element.lat, element.lon]).addTo(map);

                    marcadores.push(marcador);
                }
            });

            if (marcadores.length > 0) {
                const group = new L.featureGroup(marcadores);
                map.fitBounds(group.getBounds());
            }
        } else {
            console.error("No se encontraron resultados válidos.");
        }
    })
    .catch(error => {
        console.error('Error al hacer la consulta:', error);
    });
