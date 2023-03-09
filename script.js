const url = "https://api.worldweatheronline.com/premium/v1/marine.ashx";
const api = "1b982ff97aa44f589c4221439232102";
responseObj = null;
let isTides = false;

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function setDates(weather) {
  for (let i = 0; i < weather.length; i++) {
    const newDate = formatDate(weather[i].date);
    console.log({ i, date: weather[i].date, newDate });
    document.querySelector(`.day${i + 1}`).innerHTML = `
    <li class="day" id="d${i + 1}">${newDate}</li>`;
  }
}

window.initMap = function () {
  console.log("initMapCalled");
  const myLatlng = { lat: 41.6821, lng: -69.9598 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: myLatlng,
  });
  let infoWindow = new google.maps.InfoWindow({
    content: "Click the map to get the marine weather!",
    position: myLatlng,
  });

  infoWindow.open(map);
  map.addListener("click", (mapsMouseEvent) => {
    infoWindow.close();
    infoWindow = new google.maps.InfoWindow({
      position: mapsMouseEvent.latLng,
    });
    infoWindow.setContent(
      JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
    );
    infoWindow.open(map);
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
        responseObj = JSON.parse(response);
        setDates(responseObj.data.weather);
        createReport(0, 0, responseObj);
      });
  });
};

//Takes in the object and creates tides report
function tidesReport(day, responseObj) {
  let htmlString = "<ul class='tide-details-list'>";
  responseObj.data.weather[day].tides[0].tide_data.forEach((tide) => {
    htmlString += `
    <li class="tideType tideElement">Tide Type: ${tide.tide_type}</li>
    <li class="tideTime tideElement">Tide Time:  ${tide.tideTime}</li>
    <li class="tideHeight tideElement">Tide Height: ${tide.tideHeight_mt} mt</li>
    <br>
      `;
  });
  document.querySelector(".weather-container").innerHTML = htmlString;
  document.querySelector(".hours").style.display = "none";
  isTides = true;
}
//Takes in the object and creates marine weather report
function createReport(a, b, responseObj) {
  let time = responseObj.data.weather[a].hourly[b].time;
  let timeString = "";
  if (time < 1200 && time != 0) {
    time = time / 100;
    timeString = time + ":00 AM";
  } else if (time > 1200) {
    time = time / 100 - 12;
    timeString = time + ":00 PM";
  } else if (time == 0) {
    timeString = "12:00 AM";
  } else timeString = "12:00 PM";

  let htmlString = `
  <img id="weather-img" src="${
    responseObj.data.weather[a].hourly[b].weatherIconUrl[0].value
  }" alt="weather" />
  <ul class="weather-details-list">
    <li class="coordinates">${responseObj.data.request[0].query}</li>
    <li class="date">Date: ${formatDate(responseObj.data.weather[a].date)}</li>
    <li class="time">Time: ${timeString}</li>
    <li class="temp">Temperature: ${
      responseObj.data.weather[a].hourly[b].tempF
    } °F</li>
    <li class="swell-height">Swell Height: ${
      responseObj.data.weather[a].hourly[b].swellHeight_ft
    } ft </li>
    <li class="swell-period">Swell Period: ${
      responseObj.data.weather[a].hourly[b].swellPeriod_secs
    } seconds</li>
    <li class="swell-direction">Swell Direction: ${
      responseObj.data.weather[a].hourly[b].swellDir
    }°</li>
    <li class="wind-speed">Wind Speed: ${
      responseObj.data.weather[a].hourly[b].windspeedMiles
    } mph</li>
    <li class="wind-direction">Wind Direction: ${
      responseObj.data.weather[a].hourly[b].winddir16Point
    }</li>
    <li class="description">Description: ${
      responseObj.data.weather[a].hourly[b].weatherDesc[0].value
    }</li>
    <li class="precipitation">Precipitation: ${
      responseObj.data.weather[a].hourly[b].precipInches
    } in</li>
    <li class="humidity">Humidity: ${
      responseObj.data.weather[a].hourly[b].humidity
    }%</li>
    <li class="visibility">Visibility: ${
      responseObj.data.weather[a].hourly[b].visibilityMiles
    } mi</li>
    <li class="pressure">Pressure: ${
      responseObj.data.weather[a].hourly[b].pressure
    } mb</li>
    <li class="cloud-cover">Cloud Cover: ${
      responseObj.data.weather[a].hourly[b].cloudcover
    }%</li>
  </ul>
`;
  document.querySelector(".weather-container").innerHTML = htmlString;
  isTides = false;
  document.querySelector(".hours").style.display = "flex";
}
document.querySelector("#tides-btn").addEventListener("click", () => {
  tidesReport(0, responseObj);
});

document.querySelector("#marine-btn").addEventListener("click", () => {
  createReport(0, 0, responseObj);
});

document.querySelectorAll(".day").forEach((daySelector) =>
  daySelector.addEventListener("click", (e) => {
    const dayID = e.target.id;
    let day = parseInt(dayID.slice(1, 2)) - 1;
    if (isTides) {
      tidesReport(day, responseObj);
    } else {
      createReport(day, 0, responseObj);
      let timeBar = document.querySelector(".time-bar");
      timeBar.innerHTML = `
      <ul class = "hours">
        <li id="${dayID}h1" class ="timeSelector"> 12:00 AM </li>
        <li id="${dayID}h2" class ="timeSelector"> 3:00 AM </li>
        <li id="${dayID}h3" class ="timeSelector"> 6:00 AM </li>
        <li id="${dayID}h4" class ="timeSelector"> 9:00 AM </li>
        <li id="${dayID}h5" class ="timeSelector"> 12:00 PM </li>
        <li id="${dayID}h6" class ="timeSelector"> 3:00 PM </li>
        <li id="${dayID}h7" class ="timeSelector"> 6:00 PM </li>
        <li id="${dayID}h8" class ="timeSelector"> 9:00 PM </li>
      </ul>
      `;

      document.querySelectorAll(".timeSelector").forEach((timeSelector) =>
        timeSelector.addEventListener("click", (e) => {
          let day = parseInt(e.target.id.slice(1, 2)) - 1;
          let hour = parseInt(e.target.id.slice(3)) - 1;
          createReport(day, hour, responseObj);
        })
      );
    }
  })
);
