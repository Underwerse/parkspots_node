// Tämä on yleisskripti, jonka avulla lisätään toimintoja kaikille sivuille
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Lisätään 'header':in kuvalle linkki pääsivulle
  const header = document.querySelector('header');
  header.addEventListener('click', () => {
    window.location.href = '../index.html';
  });

  header.addEventListener('mousemove', () => {
    header.style.cursor = 'pointer';
  });

  // Lisätään 'menu':n aktiiville linkille korostusta
  const setActiveMenu = () => {
    const menuLinks = document.querySelectorAll('.main-menu li a');
    const url = document.location.href;
    for (let i = 0; i < menuLinks.length; i++) {
      if (url === menuLinks[i].href) {
        menuLinks[i].className += 'activeMenu';
      }
    }
  };

  setActiveMenu();

  async function getWeatherData() {
    //Tehdään muuttujia
    const apiUrl =
      'http://api.openweathermap.org/data/2.5/weather?id=660129&appid=b55f639a32a873e5d0147d5233056298&lang=fi';

    const response = await fetch(apiUrl);
    const weatherData = await response.json();
    //Luetaan etsittyä dataa ja tulostetaan innerHTML komennolla weatherAdjuster elementtiin
    const weatherElem = document.getElementById('weatherAdjuster');
    let htmlCode = `<p>`;

    const icon = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
    htmlCode += `<img src='${icon}'><img>`;
    htmlCode += `Place: ${weatherData.name}<br>`;
    htmlCode += `Weather: ${weatherData.weather[0].description}<br>`;
    htmlCode += `Temperature: ${Math.floor(weatherData.main.temp - 273)} °C<br>`;
    htmlCode += `Humidity: ${weatherData.main.humidity}%<br>`;
    htmlCode += `Wind: ${weatherData.wind.speed} m/s<br>`;
    htmlCode += `</p>`;

    //Lisätään tiedot innerHTML komennolla weather elementtiin
    weatherElem.innerHTML += htmlCode;
  }

  getWeatherData();

  /**
   * COVID-19 tiedot API
   */
  async function getCovidData() {
    //Tehdään muuttujia
    const date = new Date();
    const ye = new Intl.DateTimeFormat('en', {
      year: 'numeric',
    }).format(date);
    const mo = new Intl.DateTimeFormat('en', {
      month: '2-digit',
    }).format(date);
    let da = new Intl.DateTimeFormat('en', {
      day: '2-digit',
    }).format(date);
    // Määritetään päivä eilispäiväksi (jotta tilasto olisi jo saatavilla)
    da === 1 ? (da = 30) : (da -= 1);
    da < 10 ? (da = '0' + da) : da;
    const covidApiUrl = `https://covid-api.com/api/reports/total?date=${ye}-${mo}-${da}&iso=FIN`;
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // cors policy browser blocking bypass solution

    const response = await fetch(proxyUrl + covidApiUrl, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
    });

    const covidData = await response.json();

    covidResults(covidData.data);

    //Luetaan etsittyä dataa ja tulostetaan innerHTML komennolla weatherAdjuster elementtiin
    function covidResults(jsonData) {
      const covidElem = document.getElementById('covid');
      const formatter = new Intl.NumberFormat('fi');
      document.getElementById('newDesease').innerHTML = formatter.format(
        jsonData.confirmed_diff
      );
      document.getElementById('deseaseTotal').innerHTML = formatter.format(
        jsonData.confirmed
      );
      document.getElementById('newDeaths').innerHTML = formatter.format(
        jsonData.deaths_diff
      );
      document.getElementById('deathsTotal').innerHTML = formatter.format(
        jsonData.deaths
      );
    }
  }

  // getCovidData();
});
