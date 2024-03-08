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
      data: 'https://raw.githubusercontent.com/j-itters/j-itters.github.io/main/university_json/uoft.geojson' // Your URL to your uoft.geojson file
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
        'fill-color': '#ff5145',
        'fill-opacity': 0.7,
        'fill-outline-color': 'black',
        }
    });

    // Adding TMU property fill data
    map.addSource('tmu-data', {
      type: 'geojson',
      data: 'https://raw.githubusercontent.com/j-itters/j-itters.github.io/main/university_json/tmu.geojson' // Your URL to your tmu.geojson file
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

    // Adding labels to fill layers
    map.addSource('label-data', {
      type: 'geojson',
      data: 'https://raw.githubusercontent.com/j-itters/j-itters.github.io/main/university_json/labels.geojson' // Your URL to your labels.geojson file
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

    // Making the different coloured circles appear over each restaurant point when hovered over
    map.addSource('rating-data', {
      type: 'geojson',
      data: 'https://raw.githubusercontent.com/j-itters/j-itters.github.io/main/map.geojson' // Your URL to your map.geojson file
      });
      map.addLayer({
      'id': 'ramen-rating',
      'type': "circle",
      'source': 'rating-data',
      'paint': {
        'circle-radius': 24,
        'circle-color': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          [
            'interpolate',
            ['linear'],
            ['get', 'stars'],
            /*----------- making the colour scale for rating (fill) ----------*/
            4.0,
            '#ffffff',
            4.1,
            '#f5cbd6',
            4.2,
            '#f5b5c5',
            4.3,
            '#f5a6ba',
            4.4,
            '#f598b0',
            4.5,
            '#f589a5',
            4.6,
            '#f57697',
            4.7,
            '#f55f87',
            4.8,
            '#f54e7a',
            4.9,
            '#f33e6e'
          ],
          '#f33e6e'
            /*-----------------------------------------------------------------*/
        ],
        'circle-stroke-color':[
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          [
            'interpolate',
            ['linear'],
            ['get', 'stars'],
            /*----------- making the colour scale for rating (border) ----------*/
            4.0,
            '#ffffff',
            4.1,
            '#f5cbd6',
            4.2,
            '#f5b5c5',
            4.3,
            '#f5a6ba',
            4.4,
            '#f598b0',
            4.5,
            '#f589a5',
            4.6,
            '#f57697',
            4.7,
            '#f55f87',
            4.8,
            '#f54e7a',
            4.9,
            '#f33e6e'
          ],
          '#f33e6e'
            /*------------------------------------------------------------------*/
        ],
        'circle-stroke-width': 2,
        'circle-opacity': ['case',['boolean', ['feature-state', 'hover'], false], 0.5, 0 ],
        'circle-stroke-opacity': ['case',['boolean', ['feature-state', 'hover'], false],1,0]
        },
    });
  });

/*--------------------------------------------------------------------
SIMPLE CLICK EVENT
--------------------------------------------------------------------*/
  map.on('click', 'ramen-rating', (e) => {

    let ramenname = e.features[0].properties.name;
    console.log(ramenname);  //e is the event info triggered and is passed to the function as a parameter (e)

  });

/*--------------------------------------------------------------------
ADD POP-UP ON CLICK EVENT
--------------------------------------------------------------------*/

  map.on('mouseenter', 'ramen-rating', () => {
    map.getCanvas().style.cursor = 'pointer'; 
  });

  map.on('mouseleave', 'ramen-rating', () => {
    map.getCanvas().style.cursor = ''; 
  });
  
  map.on('click', 'ramen-rating', (e) => {
    new mapboxgl.Popup() //Declare new popup object on each click
        .setLngLat(e.lngLat) //Use method to set coordinates of popup based on mouse click location
        .setHTML("<b>Restaurant Name: </b> " + e.features[0].properties.name + "<br>" +
            "Rating: " + e.features[0].properties.stars) //Use click event properties to write text for popup
        .addTo(map); //Show popup on map
});

/*--------------------------------------------------------------------
HOVER EVENT USING setFeatureState() METHOD
// --------------------------------------------------------------------*/
let ramenID = null; //Declare initial ramen ID as null

map.on('mousemove', 'ramen-rating', (e) => {
    if (e.features.length > 0) { //If there are features in array enter conditional

        if (ramenID !== null) { //If ramenID IS NOT NULL set hover feature state back to false
            map.setFeatureState(
                { source: 'rating-data', id: ramenID },
                { hover: false }
            );
        }

        ramenID = e.features[0].id; //Update provID to featureID
        map.setFeatureState(
            { source: 'rating-data', id: ramenID },
            { hover: true } //Update hover feature state to TRUE
        );
    }
});

map.on('mouseleave', 'ramen-rating', () => { //If mouse leaves the geojson layer, set all hover states to false and ramenID variable back to null
    if (ramenID !== null) {
        map.setFeatureState(
            { source: 'rating-data', id: ramenID },
            { hover: false }
        );
    }
    ramenID = null;
});

/*--------------------------------------------------------------------
ADD INTERACTIVITY BASED ON HTML EVENT
--------------------------------------------------------------------*/

// Add event listener which returns map view to full screen on button click using flyTo method
document.getElementById('returnbutton').addEventListener('click', () => {
  map.flyTo({
    center: [-79.392496, 43.659804], // starting position [lng, lat]
    zoom: 13.25, // starting zoom
    essential: true
  });
});

/*--------------------------------------------------------------------
CREATE LEGEND IN JAVASCRIPT
--------------------------------------------------------------------*/
//Declare array variables for labels and colours
const legendlabels = [
  '4.0-4.1',
  '4.2-4.3',
  '4.4-4.5',
  '4.6-4.7',
  '4.8-4.9'
];

const legendcolours = [
  '#f5cbd6',
  '#f5b5c5',
  '#f598b0',
  '#f57697',
  '#f54e7a'
];

//Declare legend variable using legend div tag
const legend = document.getElementById('legend');

//For each layer create a block to put the colour and label in
legendlabels.forEach((label, i) => {
    const colour = legendcolours[i];

    const item = document.createElement('div'); //each layer gets a 'row' - this isn't in the legend yet, we do this later
    const key = document.createElement('span'); //add a 'key' to the row. A key will be the colour circle

    key.className = 'legend-key'; //the key will take on the shape and style properties defined in css
    key.style.backgroundColor = colour; // the background color is retreived from teh layers array

    const value = document.createElement('span'); //add a value variable to the 'row' in the legend
    value.innerHTML = `${label}`; //give the value variable text based on the label

    item.appendChild(key); //add the key (colour cirlce) to the legend row
    item.appendChild(value); //add the value to the legend row

    legend.appendChild(item); //add row to the legend
});
