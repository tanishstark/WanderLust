
let accessToken = mapToken;
mapboxgl.accessToken = accessToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

console.log(coordinates);
const marker = new mapboxgl.Marker({ color: 'red' })
    .setLngLat(coordinates) // coordinates should be an array [lng, lat]
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h4>Welcome to Wanterlust</h4><p>Exact Location will be provided after booking</p>`
        )
    )
    .addTo(map);