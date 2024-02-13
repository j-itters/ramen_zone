document.querySelectorAll("img").forEach((item) => {
    //Add event listener to button element with event to reveal image
    item.addEventListener("click", (event) => {
      const image = event.target.getAttribute("data-src");
      event.target.setAttribute("src", image);
    });
  });

mapboxgl.accessToken = 'pk.eyJ1IjoiamFtaWVjaG93IiwiYSI6ImNsczI5a2oxeDBqc3QybHBhZDRrYnJoMWoifQ.wLIXAScEoL9dMScxZBBjuw'; //Add default public map token from your Mapbox account
  
  const map = new mapboxgl.Map({
  container: 'my-map', // map container ID
  style: 'mapbox://styles/jamiechow/cls29snzv01s501p10blkft92', // style URL
  center: [-79.392496, 43.659804], // starting position [lng, lat]
  zoom: 13.25, // starting zoom
  });

  map.on('load', () => {

    // Adding Uoft property fill data
    map.addSource('uoft-data', {
      type: 'geojson',
      data: 'https://raw.githubusercontent.com/j-itters/j-itters.github.io/main/university_json/uoft.geojson' // Your URL to your buildings.geojson file
      });
      map.addLayer({
      'id': 'uoft-property',
      'type': 'fill',
      "layout": {
        "text": "UofT",
        "text-size": 10,
        "text-optional": false
      },
      'source': 'uoft-data',
      'paint': {
        'fill-color': '#f33e6e',
        'fill-opacity': 0.7,
        'fill-outline-color': 'black'
        }
    });

    map.addSource('tmu-data', {
      type: 'geojson',
      data: 'https://raw.githubusercontent.com/j-itters/j-itters.github.io/main/university_json/tmu.geojson' // Your URL to your buildings.geojson file
      });
      map.addLayer({
      'id': 'tmu-property',
      'type': 'fill',
      'source': 'tmu-data',
      'paint': {
        'fill-color': '#fc9003',
        'fill-opacity': 0.7,
        'fill-outline-color': 'black',
        }
    });
    map.addSource('label-data', {
      type: 'geojson',
      data: 'https://raw.githubusercontent.com/j-itters/j-itters.github.io/main/university_json/labels.geojson' // Your URL to your buildings.geojson file
      });
      map.addLayer({
        'id': 'uni-label',
        'type': 'symbol',
        'source': 'label-data',
        'layout': {
          'text-field': ['get', 'name'],
          'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
          },
    });
  });

  
