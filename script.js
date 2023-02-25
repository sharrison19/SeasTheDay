const url = "https://api.worldweatheronline.com/premium/v1/marine.ashx";
const api = "1b982ff97aa44f589c4221439232102";

// if th with id "d1h1" is clicked, execute
function createReport(a, b, responseObj, input) {
  //when th id = d1h1, a = 0 b = 0        api gives 7 days, but 8 hrs so cant use same variable

  document.querySelector(".date").innerHTML =
    "Date: " + responseObj.data.weather[a].date;

  document.querySelector(".time").innerHTML =
    "Time: " + responseObj.data.weather[a].hourly[b].time;

  document.querySelector(".temp").innerHTML =
    "Temperature: " + responseObj.data.weather[a].hourly[b].tempF + "°F";

  document.querySelector(".swell-height").innerHTML =
    "Swell Height: " +
    responseObj.data.weather[a].hourly[b].swellHeight_ft +
    "Ft";

  document.querySelector(".swell-period").innerHTML =
    "Swell Period: " +
    responseObj.data.weather[a].hourly[b].swellPeriod_secs +
    "seconds";

  document.querySelector(".swell-direction").innerHTML =
    "Swell Direction: " + responseObj.data.weather[a].hourly[b].swellDir;

  document.querySelector(".wind-speed").innerHTML =
    "Wind Speed: " +
    responseObj.data.weather[a].hourly[b].windspeedMiles +
    "mph";

  document.querySelector(".wind-direction").innerHTML =
    "Wind Direction: " + responseObj.data.weather[a].hourly[b].winddir16Point;

  document.querySelector(".description").value =
    "Description: " +
    responseObj.data.weather[a].hourly[b].weatherDesc[0].value;

  document.querySelector(".precipitation").innerHTML =
    "Precipitation: " +
    responseObj.data.weather[a].hourly[b].precipInches +
    "inches";

  document.querySelector(".humidity").innerHTML =
    "Humidity: " + responseObj.data.weather[a].hourly[b].humidity + "%";

  document.querySelector(".visibility").innerHTML =
    "Visibility: " +
    responseObj.data.weather[a].hourly[b].visibilityMiles +
    "Miles";

  document.querySelector(".pressure").innerHTML =
    "Pressure: " + responseObj.data.weather[a].hourly[b].pressure + "mb";

  document.querySelector(".cloud-cover").innerHTML =
    "Cloud Cover: " + responseObj.data.weather[a].hourly[b].cloudcover + "%";

  const img = document.querySelector("#weather-img");
  img.src = responseObj.data.weather[a].hourly[b].weatherIconUrl[0].value; //weatherIconURL index is always 0
}

function initMap() {
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
    document.querySelector(".coordinates").innerHTML = mapsMouseEvent.latLng;
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
}

window.initMap = initMap;
