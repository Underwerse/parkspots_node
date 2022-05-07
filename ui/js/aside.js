// Tämä moduuli tulostaa sivulle 'aside'-elementin
'use strict';

// Elementtia luominen
const aside = `
  <aside class='aside'>
    
    <section class='geoData hidden'>
      <h2>Selected parkspot's details</h2>
      <table class="geo-data" id="geoData">
        <tbody>
          <tr>
            <td>Address:</td>
            <td><span id="address"></span></td>
          </tr>
          <tr>
            <td>Max parking time, h.:</td>
            <td><span id="duration"></span></td>
          </tr>
          <tr>
            <td>Parkspots qty:</td>
            <td><span id="parkqty"></span></td>
          </tr>
          <tr>
            <td>E-Parkspots qty:</td>
            <td><span id="electricqty"></span></td>
          </tr>
          <tr>
            <td>Adding time:</td>
            <td><span id="timestamp"></span></td>
          </tr>
          <tr id='routeDistanceRow' class='hidden'>
            <td>Distance:</td>
            <td><span id="routeDistance"></span></td>
          </tr>
          <tr id='routeDurationRow' class='hidden'>
            <td>Travel time:</td>
            <td><span id="routeDuration"></span></td>
          </tr>
        </tbody>
      </table>

      <div class="gallery hidden">
        
      </div>
    </section>
    
    <section>
      <h2>Weather forecast</h2>

      <div id="weatherAdjuster">

		  </div>
    </section>

  </aside>
`;

// Elementtia tulostaminen
document.write(aside);
