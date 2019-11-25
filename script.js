const weatherCompare = {};

const marsApiKey = `EwwwPaMx8qEpAqWR0mgPxqaVTDLBFsckriIbLtgc`;
const weatherApiKey = `8f12648509075ad5f7b59b7ecc23f813`;

const $cityPhoto = $(".cityPhoto");

weatherCompare.getMarsWeather = function () {
  const marsWeatherResults = $.ajax({
    url: `https://api.nasa.gov/insight_weather/?api_key=${marsApiKey}&feedtype=json&ver=1.0`,
    method: `GET`,
    dataType: `json`,
  });
  return marsWeatherResults;
};

weatherCompare.getCityWeather = function (userCity) {
  const cityWeatherResults = $.ajax({
    url: `https://api.openweathermap.org/data/2.5/weather?q=${userCity}&appid=${weatherApiKey}`,
    method: `GET`,
    dataType: `json`
  });
  return cityWeatherResults;
};

weatherCompare.getCityPhoto = function (userCity) {
  const cityPhotoResult = $.ajax({
    url: `https://api.teleport.org/api/urban_areas/slug:${userCity.toLowerCase()}/images/`,
    method: `GET`,
    dataType: `json`,
  });
  return cityPhotoResult;
}

weatherCompare.addCityPhoto = function (cityPhotoResult) {
  const cityPhotoToAppend = cityPhotoResult.photos[0].image.mobile;

  $(".cityPhoto").html(`<img class="cityImage" src="${cityPhotoToAppend}" alt="">`)
}

weatherCompare.addCityPhotoCatch = function () {
  $(".cityPhoto").html(`<img class="cityImage" src="./assets/genericCity.jpg" alt="">`)
}

weatherCompare.addMarsData = function (marsResult) {
  const marsDataObject = marsResult[0]
  let marsDateArray = [];

  for (key in marsDataObject) {
    keyNumber = parseInt(key);
    if (keyNumber > 0) {
      marsDateArray.push(keyNumber);
    };
  };

  let marsCurrentDay = Math.max(...marsDateArray);
  
  const marsAvgTemperature = ((marsResult[0][marsCurrentDay].AT.av - 32) * 5 / 9).toFixed(2);
  const marsMaxTemperature = ((marsResult[0][marsCurrentDay].AT.mx - 32) * 5 / 9).toFixed(2);
  const marsMinTemperature = ((marsResult[0][marsCurrentDay].AT.mn - 32) * 5 / 9).toFixed(2);

  $("li.marsAverage").html(`${marsAvgTemperature}°`);
  $("li.marsMax").html(`${marsMaxTemperature}°`);
  $("li.marsMin").html(`${marsMinTemperature}°`);
};

weatherCompare.addCityData = function (cityResult, userCity) {
  const userCityPhoto = weatherCompare.getCityPhoto(userCity);
  $.when(userCityPhoto)
    .done(function (cityPhotoResult) {
      weatherCompare.addCityPhoto(cityPhotoResult);
    })
    .fail(weatherCompare.addCityPhotoCatch());

  let cityName = cityResult[0].name;

  let cityAvgTemperature = (cityResult[0].main.temp - 273.15).toFixed(2);
  let cityMaxTemperature = (cityResult[0].main.temp_max - 273.15).toFixed(2);
  let cityMinTemperature = (cityResult[0].main.temp_min - 273.15).toFixed(2);

  $("p.cityTitle").html(cityName);
  $("li.cityAverage").html(`${cityAvgTemperature}°`);
  $("li.cityMax").html(`${cityMaxTemperature}°`);
  $("li.cityMin").html(`${cityMinTemperature}°`);
};

weatherCompare.addDifferenceData = function (marsResult, cityResult) {
  const marsDataObject = marsResult[0]
  let marsDateArray = [];

  for (key in marsDataObject) {
    keyNumber = parseInt(key);
    if (keyNumber > 0) {
      marsDateArray.push(keyNumber);
    }
  };

  let marsCurrentDay = Math.max(...marsDateArray);

  const marsAvgTemperature = ((marsResult[0][marsCurrentDay].AT.av - 32) * 5 / 9).toFixed(2);

  const cityAvgTemperature = (cityResult[0].main.temp - 273.15).toFixed(2);

  const averageTempDifference = (cityAvgTemperature - marsAvgTemperature).toFixed(2);

  $("li.averageTempDifference").html(-Math.abs(averageTempDifference));
};

weatherCompare.getUserInput = function () {
  $("form.cityWeather").on("submit", function (event) {
    event.preventDefault();
    userCity = $(".cityWeather input").val();
    $("input").val('');

    if (userCity !== "") {
      const userCityWeather = weatherCompare.getCityWeather(userCity);
      const marsWeatherFunction = weatherCompare.getMarsWeather();

      $(".majorTom").addClass("displayNone");
      $("div.atomPreloader").removeClass("displayNone");
      // 
      $.when(userCityWeather, marsWeatherFunction).done(function (cityData, marsData) {

        weatherCompare.addMarsData(marsData);
        weatherCompare.addCityData(cityData, userCity);
        weatherCompare.addDifferenceData(marsData, cityData);

        $("#resultsSection").removeClass("displayNone");
      }).then(function () {
        setTimeout(function () { 
          $(".majorTom").removeClass("displayNone");
          $("div.atomPreloader").addClass("displayNone");

          $("html,body").animate({
            scrollTop: $("#resultsSection").offset().top
          },
            300,
            "linear"
          );
        }, 
          500);
      });
    } else {
      alert("PLZ ENTER A CITY!!!!!");
    }
  });
};

// Start app
weatherCompare.init = function() {
  weatherCompare.getUserInput();
};

$(function () {
  weatherCompare.init();
});