// Google mapsin API:n skript
'use strict';

let map, infoWindow, markerCurrentPlace, markerSearchPlace;
const API_BASE_URL = 'http://localhost:5000';

/**
 * Rajapinnan yleisfunktio
 */
function initMap() {
  const API_KEY_GEOCODE = 'AIzaSyCCwRrNbVDo_cepl_VaXyxVQEa_nL50AdY';
  // Peruskarttaasetukset
  const opt = {
    center: {
      lat: 60.223907,
      lng: 24.758295,
    },
    zoom: 11,
    scrollwheel: false,
  };

  clearGallery();

  // Karttaa luominen Google-rajapinnan kautta
  map = new google.maps.Map(document.getElementById('map'), opt);
  // Ponnahdusilmoitusta luominen (olion)
  infoWindow = new google.maps.InfoWindow();

  /**
   * Merkin ikonia asentaminen funktio
   * @param {object} marker   Merkki-olio
   * @param {number} size     Ikonin koko pikselilla
   * @param {number} iconName Ikonin tiedoston nimi
   */
  function setMarkerIcon(marker, size, iconName) {
    marker.setIcon({
      url: `./media/img/${iconName}`,
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(size, size),
    });
  }

  /**
   * Osoitetta yksityikohtia antaminen koordinoiden perusteella
   * @param {object} map     sivustolla oleva kartta
   * @param {object} coords  koordinaatit
   * @param {object} marker  paikan luottu merkki
   */
  function getAddressFromCoords(map, coords, marker) {
    const lat = coords.lat;
    const lng = coords.lng;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY_GEOCODE}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        printLocationData(map, data.results[0], marker);
      })
      .catch((err) => console.log(err.message));
  }

  /**
   * Osoitteen tietojen tulostaminen funktio
   * @param {*} map     sivustolla oleva kartta
   * @param {*} place   löydetty paikka
   * @param {*} marker  luottu merkki
   */
  function printLocationData(map, place, marker) {
    let address = '';
    if (place.formatted_address) {
      address = place.formatted_address.split(',', 2);
      sessionStorage.setItem(
        'sessionCurrentAddress',
        address[0] + ',' + address[1]
      );
      sessionStorage.setItem('sessionCurrentLat', place.geometry.location.lat);
      sessionStorage.setItem('sessionCurrentLng', place.geometry.location.lng);
      sessionStorage.setItem('sessionClickedParkspotId', marker.id);
    }

    let durationMsg = '';

    // Ponnahdusilmoituksen viestiä luominen merkin tyypin perusteella
    if (marker.type === 'currentLocation') {
      durationMsg = `<div><strong>Your address:</strong><br>${address}
      <p
        id='infoWindowText'><strong>Add parkspot</strong>
        <a href='#' class="open-popup" onclick='openPopup()'>
          <img id='addParkspotBtn' 
        src="./media/img/parkkiMerkki48.ico">
        </a>
        
      </p>`;
    } else if (marker.type === 'searchLocation') {
      durationMsg = `${address}
      <p
      id='infoWindowText'><strong>Add parkspot</strong>
      <a href='#' class="open-popup" onclick='openPopup()'>
          <img id='addParkspotBtn' 
        src="./media/img/parkkiMerkki48.ico">
        </a>
    </p>`;
    } else {
      durationMsg = `
        <strong>Address:</strong><br>${address} 
        ${getDurationMsg(marker)}
        <p
          id='infoWindowText'><strong>Parkspots qty:</strong> ${marker.parkqty}
        </p>
        <p
          id='infoWindowText'><strong>E-Parkspots qty:</strong> ${marker.electricqty}
        </p>
        <p
          id='infoWindowText'><strong>Route to here</strong>
          <img id='findRouteBtn' src="./media/img/route.png">
          <a href='#' class="open-popup" onclick='openPopupImage()'>
          <img id='addImageBtn' 
        src="./media/img/addImage.ico">
        </a>
        <a href='#' class="open-popup" onclick='deleteParkspotById(${
  marker.id
})'>
          <img id='addImageBtn' 
        src="./media/img/delete.ico">
        </a>
        </p>`;
    }

    // Ponnahdusilmoitusta löydettysijainnissa luominen
    infoWindow.setContent(durationMsg);
    infoWindow.open(map, marker);

    // Löytöosoitteen tietojen laittaminen taulukkoon sivulle
    /* for (let i = 0; i < place.address_components.length; i++) {
      if (place.address_components[i].types[0] == 'postal_code') {
        document.getElementById('postal_code').innerHTML =
          place.address_components[i].long_name;
      }
      if (place.address_components[i].types[0] == 'country') {
        document.getElementById('country').innerHTML =
          place.address_components[i].long_name;
      }
    }
    document.getElementById('location').innerHTML = place.formatted_address; */

    document.getElementById('address').innerHTML = marker.address;
    document.getElementById('duration').innerHTML = marker.duration;
    document.getElementById('parkqty').innerHTML = marker.parkqty;
    document.getElementById('electricqty').innerHTML = marker.electricqty;
    document.getElementById('timestamp').innerHTML = marker.timestamp;

    printImagesByParkspotId(marker.id);
    // Osoitetietotaulukkoa sivulta saaminen
    const receivedGeoData = document.querySelector('.geoData');
    // Osoitetietojen taulukkoa näyttäminen sivulle
    receivedGeoData.classList.remove('hidden');
  }

  /**
   * Klikatun merkin tietojen tuloste funktio
   * @param {object} map
   * @param {object} marker
   */
  const getClickedMarkerAddress = async (map, marker) => {
    // Google API:n linkki
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${marker.address}&key=${API_KEY_GEOCODE}`;
    const response = await fetch(url);
    const data = await response.json();
    printLocationData(map, data.results[0], marker);
    // Klikatun merkin linkille tapahtumankäsitteliäjn nimeäminen
    setTimeout(() => {
      document.querySelector('#findRouteBtn').addEventListener('click', () => {
        // Tapahtumankäsittelijän funktio (reititystä varten)
        getDirection(data.results[0].formatted_address);
      });
    }, 1000);
  };

  /**
   * Lisätään kartalle nykysijainti-nappia
   */
  const setCurrentLocationFunctionality = () => {
    // Luodaan napin
    const locationButton = document.createElement('div');

    locationButton.classList.add('custom-map-control-button');
    locationButton.id = 'currentLocation';

    // Lisätään luovaa nappia kartalle
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

    // Napin toiminto
    locationButton.addEventListener('click', () => {
      removeNonPlaceMarkers();
      hideRoute();
      // Kun sijaintihaku onnistuu (laitteen GPS on päällä)
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Nykyistä positiota saaminen
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            // Nykyisen position merkkiä luominen kartalle
            markerCurrentPlace = new google.maps.Marker({
              position: pos,
              map,
            });

            markerCurrentPlace.type = 'currentLocation';

            setMarkerIcon(markerCurrentPlace, 50, 'currentPlace.png');

            // Ponnahdusilmoitusta nykysijainnissa luominen
            infoWindow.setPosition(pos);
            infoWindow.setContent('Olet tässä');
            // Ponnahdusilmoitusta näyttäminen
            infoWindow.open(map, markerCurrentPlace);
            map.setCenter(pos);
            map.setZoom(17);

            getAddressFromCoords(map, pos, markerCurrentPlace);
            document.querySelector('.geoData').classList.remove('hidden');
          },
          // Virhekäsittely
          () => {
            handleLocationError(true, infoWindow, map.getCenter());
          }
        );
      } else {
        // Kun sijaintihaku ei onnistunut
        handleLocationError(false, infoWindow, map.getCenter());
      }
    });

    // Sijaintihakua epäonnistumista funktio
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(
        browserHasGeolocation
          ? 'Error: The Geolocation service failed.'
          : "Error: Your browser doesn't support geolocation."
      );
      // Ponnahdusilmoitusta näyttäminen (virheen saattuessa)
      infoWindow.open(map);
    }
  };

  setCurrentLocationFunctionality();

  /**
   * Lisätään kartalle osoitehaku-toimintoa
   */
  const setSearchLocationFunctionality = () => {
    // Hakukenttaa sivulta saaminen
    const input = document.getElementById('searchInput');
    // Lisätään hakukenttaa kartalle
    map.controls[google.maps.ControlPosition.LEFT_CENTER].push(input);

    /*
    Google-rajapinnan 'Autocomplete' käyttäminen
    (osakirjattuvaa osoitetta haku ja täyttäminen automaattisesti)
    */
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    // Osoitehakukentan muutosten seuranta toiminto
    autocomplete.addListener('place_changed', function () {
      // Viimeistä ponnahdusilmoitusta sulkeminen
      infoWindow.close();
      removeNonPlaceMarkers();
      hideRoute();
      // Löydetyn osoitteen merkkiä luominen kartalle
      markerSearchPlace = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29),
      });
      markerSearchPlace.type = 'searchLocation';
      // Löytyvää osoiteetta saaminen
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        window.alert(`Autocomplete's returned place contains no geometry`);
        return;
      }

      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      // Löytyvää positiota merkkiä luominen kartalle
      setMarkerIcon(markerSearchPlace, 50, 'searchPlace.png');

      markerSearchPlace.setPosition(place.geometry.location);
      markerSearchPlace.setVisible(true);

      // Osoiteilmoitustietojen luominen (kartan merkille antamista varten)
      printLocationData(map, place, markerSearchPlace);
    });
  };

  setSearchLocationFunctionality();

  // Reititys-toimintoa lisääminen
  // Luodaan Google Directions-API:n oliot
  const directionsService = new google.maps.DirectionsService();
  const directionsDisplay = new google.maps.DirectionsRenderer();

  /**
   * Reititys-toiminnan pääfunktio
   * @param {String} destination  Toimituspisteen osoite
   */
  function getDirection(destination) {
    // Otetaan nykysijäinnin osoitteen
    navigator.geolocation.getCurrentPosition((position) => {
      // Nykyistä positiota saaminen
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${pos.lat},${pos.lng}&key=${API_KEY_GEOCODE}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          origin = data.results[0].formatted_address;
          // console.log(origin);
          hideRoute();

          // Luodaan reititys lähde- ja toimituspisteiden perusteella
          directionsDisplay.setMap(map);
          const request = {
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING,
          };

          // Reitityksen käsittely
          directionsService.route(request, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              const distance = result.routes[0].legs[0].distance.text;
              const duration = result.routes[0].legs[0].duration.text;
              // Taulukkoon reitityksen tietojen tuloste
              document.getElementById('routeDistance').innerText = distance;
              document.getElementById('routeDuration').innerText = duration;
              document
                .getElementById('routeDistanceRow')
                .classList.remove('hidden');
              document
                .getElementById('routeDurationRow')
                .classList.remove('hidden');
              // Reitityksen näyttö kartalle
              directionsDisplay.setDirections(result);
            } else {
              hideRoute();
            }
          });
        })
        .catch((err) => console.log(err.message));
    });
  }

  /**
   * Kartalla olevan reitityksen poisto funktio
   */
  function hideRoute() {
    directionsDisplay.setDirections({
      routes: [],
    });
    // Taulukolla olevien reitityksen tietojen poisto
    document.getElementById('routeDistanceRow').classList.add('hidden');
    document.getElementById('routeDurationRow').classList.add('hidden');
  }

  /* 
  Nykyisiä merkkeja tietojen lukeminen
  (tietokannasta, joka on tällä hetkellä paikallinen json-tiedosto)
  */
  const markers = [];
  // let placesFromFile = [];
  // let places = [];
  // Tietokannan tiedoston paikallinen osoite
  // const placesFile = '../places.json';
  getPlacesFromDb();

  async function getPlacesFromDb() {
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(API_BASE_URL + '/parkspots', fetchOptions);
    const res = await response.json();
    const json = res.parkspots;
    const parkspots = json.map((el) => {
      const lat = el.lat;
      const lng = el.lng;
      el.position = { lat, lng };
      return el;
    });
    await setParkspots(parkspots);
    return json;
  }

  // Json-tiedoston lukeminen-toiminto
  async function setParkspots(places) {
    places.forEach((place) => {
      place.icon = './media/img/parkkiMerkki48.ico';
      place.animation = google.maps.Animation.DROP;
      place.map = map;
      place.draggable = false;
      markers.push(new google.maps.Marker(place));
    });
    // Animaatio-toiminta merkeille
    markers.forEach((el) => {
      el.addListener('click', toggleBounce);
    });
  }

  // setParkspots(parkspots);

  /**
   * Tarkastellaan pysäköinnin aikaa ja tulostaa sen pituus sekä osoite
   * @param {object} place    merkki-olio
   * @returns                 sallittu pysäköintiaika (String)
   */
  function getDurationMsg(place) {
    let msg = '';
    if (place.duration !== 0) {
      msg += `
        <p id='infoWindowText'><strong>Max parking time, h: </strong> ${place.duration}</p>
      `;
    } else {
      msg += `
        <p id='infoWindowText'>Max parking time, h: infinite</p>
      `;
    }

    return msg;
  }

  /**
   * Poistetaan kaikki kartalla olevia merkkeja,
   * paitsi json-tiedostosta ladattua
   */
  function removeNonPlaceMarkers() {
    // Nykysijäinnin merkkiä poistetaan
    if (markerCurrentPlace) {
      markerCurrentPlace.setVisible(false);
      markerCurrentPlace.setMap(null);
      markerCurrentPlace = null;
    }
    // Hakuosoitteen merkkiä poistetaan
    if (markerSearchPlace) {
      markerSearchPlace.setVisible(false);
      markerSearchPlace.setMap(null);
      markerSearchPlace = null;
    }
  }

  /**
   * Merkkien animaatio-funktio
   */
  function toggleBounce() {
    // Tarkistetaan, onko joka toinen merkki avattuna ja suljetaan tätä, kun on
    if (this.getAnimation() !== null) {
      this.setAnimation(null);
      infoWindow.close();
    } else {
      // Animaatio ei tällä hetkellä ole käytössä
      /* this.setAnimation(google.maps.Animation.BOUNCE); */
      // Painetulla merkilla tietojen näyttö
      removeNonPlaceMarkers();
      getClickedMarkerAddress(map, this);
    }
  }

  /**
   * Osoitehaun kentän kartalle ilmestyminen kartan luomisen jälkeen
   */
  function searchFieldSet() {
    document.getElementById('searchInput').classList.remove('hidden');
  }

  setTimeout(searchFieldSet, 2000);

  async function getLastParkspots(qty) {
    const allParkspots = await getPlacesFromDb();
    const sorted = allParkspots.sort((a, b) => a.id - b.id).reverse();
    const resultSorted = [];

    for (let i = 0; i < qty; i++) {
      resultSorted.push(sorted[i]);
    }

    return resultSorted;
  }

  getLastParkspots(3);
}

async function openPopup() {
  const fadeIn = (el, timeout, display) => {
    el.style.opacity = 0;
    el.style.display = display || 'block';
    el.style.transition = `opacity ${timeout}ms`;
    setTimeout(() => {
      el.style.opacity = 1;
    }, 10);
  };

  const addForm = document.querySelector('#addParkspotForm');
  const divPopup = document.querySelector('.popup-bg-parkspot');
  fadeIn(divPopup, 800, 'block');
  document.querySelector('html').classList.add('no-scroll');

  document.querySelector('.formAddress').value = sessionStorage.getItem(
    'sessionCurrentAddress'
  );
  document.querySelector('.formLat').value =
    sessionStorage.getItem('sessionCurrentLat');
  document.querySelector('.formLng').value =
    sessionStorage.getItem('sessionCurrentLng');

  addForm.addEventListener('submit', addParkspotListenerHandler);
  async function addParkspotListenerHandler(evt) {
    evt.preventDefault();
    const data = serializeJson(addForm);
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(API_BASE_URL + '/parkspots/add', fetchOptions);
    const json = await response.json();
    if (json.parkspot) {
      alert(`Parkspot has been added`);
    } else {
      alert(json.message);
    }
    closePopup('.popup-bg-parkspot');
    addForm.removeEventListener('submit', addParkspotListenerHandler);
    initMap();
  }
}

async function openPopupImage() {
  const fadeIn = (el, timeout, display) => {
    el.style.opacity = 0;
    el.style.display = display || 'block';
    el.style.transition = `opacity ${timeout}ms`;
    setTimeout(() => {
      el.style.opacity = 1;
    }, 10);
  };

  const addForm = document.querySelector('#addImageForm');
  const divPopupImage = document.querySelector('.popup-bg-image');
  fadeIn(divPopupImage, 800, 'block');
  document.querySelector('html').classList.add('no-scroll');

  document.querySelector('.formParkspotId').value = sessionStorage.getItem(
    'sessionClickedParkspotId'
  );

  addForm.addEventListener('submit', addImageListenerHandler);
  async function addImageListenerHandler(evt) {
    evt.preventDefault();
    const data = new FormData(addForm);
    const fetchOptions = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
      body: data,
    };
    const response = await fetch(
      API_BASE_URL + '/parkspots/add/image',
      fetchOptions
    );
    const json = await response.json();
    if (json.imageNewId) {
      alert(`Image has been added`);
    } else {
      alert(json.message);
    }
    closePopup('.popup-bg-image');
    addForm.removeEventListener('submit', addImageListenerHandler);
    initMap();
  }
}

function closePopup(windowClass) {
  const fadeOut = (el, timeout) => {
    el.style.opacity = 1;
    el.style.transition = `opacity ${timeout}ms`;
    el.style.opacity = 0;

    setTimeout(() => {
      el.style.display = 'none';
    }, timeout);
  };

  const divPopup = document.querySelector(windowClass);
  fadeOut(divPopup, 800);
  document.querySelector('html').classList.remove('no-scroll');
}

async function printImagesByParkspotId(parkspotId) {
  clearGallery();
  const fetchOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + sessionStorage.getItem('token'),
    },
  };
  const response = await fetch(
    API_BASE_URL + `/images/${parkspotId}`,
    fetchOptions
  );
  const res = await response.json();
  const images = res.images;

  if (images.length) {
    const gallery = document.querySelector('.gallery');
    images.forEach((image) => {
      const newDiv = document.createElement('div');
      gallery.appendChild(newDiv);
      newDiv.classList.add('item');
      newDiv.innerHTML = `<img src="./thumbnails/${image.filename}">`;
    });

    gallery.classList.remove('hidden');
  }
}

function clearGallery() {
  document.querySelector('.gallery').innerHTML = '';
  document.querySelector('.gallery').innerText = '';
  document.querySelector('.gallery').classList.add('hidden');
}

async function deleteParkspotById(parkspotId) {
  const fetchOptions = {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + sessionStorage.getItem('token'),
    },
  };
  const response = await fetch(
    API_BASE_URL + `/parkspots/delete/${parkspotId}`,
    fetchOptions
  );
  const json = await response.json();
  if (json.isDeleted) {
    alert(`Parkspot has been deleted`);
  } else {
    alert(json.message);
  }
  initMap();
}
