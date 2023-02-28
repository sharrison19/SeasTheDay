const url = "https://api.worldweatheronline.com/premium/v1/marine.ashx";
const api = "1b982ff97aa44f589c4221439232102";
window.initMap = function () {};

$(() => {
  window.initMap = function () {
    console.log("initMapCalled");
    const myLatlng = { lat: 41.6821, lng: -69.9598 };
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 10,
      center: myLatlng,
    });
    // Create the initial InfoWindow.
    let infoWindow = new google.maps.InfoWindow({
      content: "Click the map to get the marine weather!",
      position: myLatlng,
    });

    infoWindow.open(map);
    // Configure the click listener.
    map.addListener("click", (mapsMouseEvent) => {
      // Close the current InfoWindow.
      infoWindow.close();
      // Create a new InfoWindow.
      infoWindow = new google.maps.InfoWindow({
        position: mapsMouseEvent.latLng,
      });
      infoWindow.setContent(
        JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
      );
      infoWindow.open(map);
      // document.querySelector(".coordinates").innerHTML = mapsMouseEvent.latLng;
      fetch(
        url +
          "/?key=" +
          api +
          "&q=" +
          mapsMouseEvent.latLng.toString().slice(1, -1) +
          "&format=json&tide=yes"
      )
        .then((data) => data.text())
        .then((response) => {
          let responseObj = JSON.parse(response);
          console.log(responseObj);
          document.querySelectorAll(".timeSelector").forEach((timeSelector) =>
            timeSelector.addEventListener("click", (e) => {
              console.log(e.target.id);
              let day = parseInt(e.target.id.slice(1, 2)) - 1;
              let hour = parseInt(e.target.id.slice(3)) - 1;
              console.log(day);
              console.log(hour);
              createReport(day, hour, responseObj);
            })
          );
          createReport(0, 0, responseObj);
        });
    });
  };
});

function tidesReport(day, responseObj) {
  let htmlString = "<ul>";
  responseObj.data.weather[day].tides[0].tide_data.forEach((tide) => {
    htmlString += `
    <li>
    Tide Time:  ${tide.tideTime}
    Tide Height: ${tide.tideHeight_mt}
    Tide Type: ${tide.tide_type}
    </li>
      `;
    //{tideTime: '12:02 AM', tideHeight_mt: '0.30', tideDateTime: '2023-02-28 00:02', tide_type: 'LOW'}
  });
  document.querySelector(".weather-details-list").innerHTML = htmlString;
}

// if th with id "d1h1" is clicked, execute
function createReport(a, b, responseObj) {
  //when th id = d1h1, a = 0 b = 0        api gives 7 days, but 8 hrs so cant use same variable
  let time = responseObj.data.weather[a].date;
  if (time <= 1200 && time != 0) {
    time = time / 100;
    document.querySelector(".date").innerHTML = "Date: " + time + ":00am";
  } else if (time > 1200) {
    time = time / 100 - 12;
    document.querySelector(".date").innerHTML = "Date: " + time + ":00pm";
  } else {
    document.querySelector(".date").innerHTML = "Date: " + time + ":00am";
    //should return when time is 0, always going to be 12AM
  }

  let htmlString = `
  <img id="weather-img" src="${responseObj.data.weather[a].hourly[b].weatherIconUrl[0].value}" alt="weather" />
  <ul>
    <li class="coordinates">${responseObj.data.request[0].query}</li>
    <li class="date">Date: ${responseObj.data.weather[a].date}</li>
    <li class="time">Time: ${responseObj.data.weather[a].hourly[b].time}</li>
    <li class="temp">Temperature: ${responseObj.data.weather[a].hourly[b].tempF} °F</li>
    <li class="swell-height">Swell Height: ${responseObj.data.weather[a].hourly[b].swellHeight_ft} Ft</li>
    <li class="swell-period">Swell Period: ${responseObj.data.weather[a].hourly[b].swellPeriod_secs}</li>
    <li class="swell-direction">Swell Direction: ${responseObj.data.weather[a].hourly[b].swellDir}</li>
    <li class="wind-speed">Wind Speed: ${responseObj.data.weather[a].hourly[b].windspeedMiles}mph</li>
    <li class="wind-direction">Wind Direction: ${responseObj.data.weather[a].hourly[b].winddir16Point}</li>
    <li class="description">Description: ${responseObj.data.weather[a].hourly[b].weatherDesc[0].value}</li>
    <li class="precipitation">Precipitation: ${responseObj.data.weather[a].hourly[b].precipInches}</li>
    <li class="humidity">Humidity: ${responseObj.data.weather[a].hourly[b].humidity}%</li>
    <li class="visibility">Visibility: ${responseObj.data.weather[a].hourly[b].visibilityMiles}Miles</li>
    <li class="pressure">Pressure: ${responseObj.data.weather[a].hourly[b].pressure} mb</li>
    <li class="cloud-cover">Cloud Cover: ${responseObj.data.weather[a].hourly[b].cloudcover}%</li>
    <li class="tides">
  Click here to get tides information!
    </li>
  </ul>
`;
  document.querySelector(".weather-details-list").innerHTML = htmlString;

  document.querySelector(".tides").addEventListener("click", () => {
    tidesReport(0, responseObj);
  });
  //   document.querySelector(".date").innerHTML =
  //     "Date: " + responseObj.data.weather[a].date;

  //   document.querySelector(".time").innerHTML =
  //     "Time: " + responseObj.data.weather[a].hourly[b].time;

  //   document.querySelector(".temp").innerHTML =
  //     "Temperature: " + responseObj.data.weather[a].hourly[b].tempF + "°F";

  //   document.querySelector(".swell-height").innerHTML =
  //     "Swell Height: " +
  //     responseObj.data.weather[a].hourly[b].swellHeight_ft +
  //     "Ft";

  //   document.querySelector(".swell-period").innerHTML =
  //     "Swell Period: " +
  //     responseObj.data.weather[a].hourly[b].swellPeriod_secs +
  //     "seconds";

  //   document.querySelector(".swell-direction").innerHTML =
  //     "Swell Direction: " + responseObj.data.weather[a].hourly[b].swellDir;

  //   document.querySelector(".wind-speed").innerHTML =
  //     "Wind Speed: " +
  //     responseObj.data.weather[a].hourly[b].windspeedMiles +
  //     "mph";

  //   document.querySelector(".wind-direction").innerHTML =
  //     "Wind Direction: " + responseObj.data.weather[a].hourly[b].winddir16Point;

  //   document.querySelector(".description").innerHTML =
  //     "Description: " +
  //     responseObj.data.weather[a].hourly[b].weatherDesc[0].value;

  //   document.querySelector(".precipitation").innerHTML =
  //     "Precipitation: " +
  //     responseObj.data.weather[a].hourly[b].precipInches +
  //     "inches";

  //   document.querySelector(".humidity").innerHTML =
  //     "Humidity: " + responseObj.data.weather[a].hourly[b].humidity + "%";

  //   document.querySelector(".visibility").innerHTML =
  //     "Visibility: " +
  //     responseObj.data.weather[a].hourly[b].visibilityMiles +
  //     "Miles";

  //   document.querySelector(".pressure").innerHTML =
  //     "Pressure: " + responseObj.data.weather[a].hourly[b].pressure + "mb";

  //   document.querySelector(".cloud-cover").innerHTML =
  //     "Cloud Cover: " + responseObj.data.weather[a].hourly[b].cloudcover + "%";

  //   const img = document.querySelector("#weather-img");
  //   img.src = responseObj.data.weather[a].hourly[b].weatherIconUrl[0].value; //weatherIconURL index is always 0
  // }
}
