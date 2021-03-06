let restaurants,
  neighborhoods,
  cuisines,
  mapVisible = true;
var newMap;
var markers = [];

/*


  Fetch neighborhoods and cuisines as soon as the page is loaded


*/

document.addEventListener('DOMContentLoaded', (event) => {
  initMap(); // added 
  fetchNeighborhoods();
  fetchCuisines();
});

/*


  Fetch all neighborhoods and set their HTML


*/

fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}

/*


  Set neighborhoods HTML


*/

fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/*


  Fetch all cuisines and set their HTML


*/

fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/*


  Set cuisines HTML


*/

fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');
  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/*


  Initialize leaflet map, called from HTML

*/

initMap = () => {
  self.newMap = L.map('map')
    .setView([40.7, -74.00], 11);

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/{z}/{x}/{y}?access_token={mapboxToken}', {
    mapboxToken: 'pk.eyJ1Ijoic2Ftc29ubG9mdGluIiwiYSI6ImNqd3p5cWtiYjFsamY0OW41bHhmYzA3M28ifQ.GUqU9qMr88rI0cw4Yu6_Cg',
    tileSize: 512,
    zoomOffset: -1,
    maxZoom: 22,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11/tiles'
  }).addTo(newMap);

  updateRestaurants();
}

/*


  Toggled Map


*/

toggleMap = () => {
  let locateMap = document.getElementById('map');
  mapVisible = !mapVisible;

  if (mapVisible === false) {
    locateMap.style.display = "none";
  } else {
    locateMap.style.display = "flex";
  }
}

/*


  Update page and map for current restaurants


*/

updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  })
}

/*


  Clear current restaurants, their HTML and remove their map markers


*/

resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  if (self.markers) {
    self.markers.forEach(marker => marker.remove());
  }
  self.markers = [];
  self.restaurants = restaurants;
}

/*


  Create all restaurants HTML and add them to the webpage


*/

fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
}

/*


  Create restaurant HTML


*/

createRestaurantHTML = (restaurant) => {
  const more = document.createElement('a');
  more.href = DBHelper.urlForRestaurant(restaurant);
  more.setAttribute('tabindex', '0');

  const li = document.createElement('li');

  more.append(li);

  const image = document.createElement('img');
  let alt = "Photo of " + restaurant.name + " restaurant";
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.setAttribute('alt', alt);
  li.append(image);

  const description = document.createElement('div');
  description.className = 'restaurant-description';
  li.append(description);

  let rName = restaurant.name
  if (rName.length >= 22) {
    rName = restaurant.name.slice(0, 22)
    rName = rName + "...";
  }

  const name = document.createElement('h2');
  name.innerHTML = rName;
  description.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.cuisine_type + " • " + restaurant.neighborhood;
  description.append(neighborhood);

  const type = document.createElement('p');
  type.className = 'restaurant-type';
  type.innerHTML = 'Click to View Details';
  description.append(type);

  return more
}

/*


  Add markers for current restaurants to the map


*/

addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
    marker.on("click", onClick);
    function onClick() {
      window.location.href = marker.options.url;
    }
    self.markers.push(marker);
  });

}
