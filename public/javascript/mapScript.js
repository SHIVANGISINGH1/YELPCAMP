mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 6 // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());
const marker = new mapboxgl.Marker({
    draggable: true,
    color: '#00BCD4'
})  
    .setLngLat(campground.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<h5>${campground.location}</h5>`))
    .addTo(map);