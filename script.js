// API app idea --- an app that lets the user compare the weather in the city of their choosing with the weather on Mars.

// User will be greeted by a space-themed landing page with an input form. The instructions will tell the user to enter the name of their/any city and submit. On submit, two panels will slide into view with information on their selected city's weather and Mars' weather, respectively. Each panel will detail specifics about temperature, forecast, meteorological events etc. There will also be information on the page that directly compares the two e.g. Mars is ___ degrees colder than Toronto.

// This will use a weather API and a NASA api.
// TESTINg
// Potential pseudo code

const weatherCompare = {};

const marsApi = `EwwwPaMx8qEpAqWR0mgPxqaVTDLBFsckriIbLtgc`;
const weatherApi = `8f12648509075ad5f7b59b7ecc23f813`;

weatherCompare.getMarsWeather = function() {
  const marsWeatherResults = $.ajax({
    url: `https://api.nasa.gov/insight_weather/?api_key=${marsApi}&feedtype=json&ver=1.0`,
    method: `GET`,
    dataType: `json`
    // version: 1,
    // feedtype: `JSON`,
    // api_key: `${marsApi}`
  });
  return marsWeatherResults;
};

weatherCompare.addMarsData = function(marsResult) {
  const marsAvgTemperature = marsResult[0]["343"].AT.av.toFixed(2);
  const marsMaxTemperature = marsResult[0]["343"].AT.mx.toFixed(2);
  const marsMinTemperature = marsResult[0]["343"].AT.mn.toFixed(2);

  let marsAvgSentence = `${marsAvgTemperature}°`;
  let marsMaxSentence = `${marsMaxTemperature}°`;
  let marsMinSentence = `${marsMinTemperature}°`;

  $("li.marsAverage").html(marsAvgSentence);
  $("li.marsMax").html(marsMaxSentence);
  $("li.marsMin").html(marsMinSentence);
};

weatherCompare.getCityWeather = function(userCity) {
  weatherCompare.getMarsWeather();
  const cityWeatherResults = $.ajax({
    url: `https://api.openweathermap.org/data/2.5/weather?q=${userCity}&appid=${weatherApi}`,
    method: `GET`,
    dataType: `json`
  });
  return cityWeatherResults;
};

weatherCompare.addCityData = function(cityResult) {
  let cityName = cityResult[0].name;

  let cityAvgTemperature = (cityResult[0].main.temp - 273.15).toFixed(2);
  let cityMaxTemperature = (cityResult[0].main.temp_max - 273.15).toFixed(2);
  let cityMinTemperature = (cityResult[0].main.temp_min - 273.15).toFixed(2);

    let cityAvgSentence = `${cityAvgTemperature}°`;
    let cityMaxSentence = `${cityMaxTemperature}°`;
    let cityMinSentence = `${cityMinTemperature}°`;

  $('h3.cityTitle').html(cityName);
  $("li.cityAverage").html(cityAvgSentence);
  $("li.cityMax").html(cityMaxSentence);
  $("li.cityMin").html(cityMinSentence);
};

weatherCompare.addDifferenceData = function(marsResult, cityResult) {
  const cityAvgTemperature = (cityResult[0].main.temp - 273.15).toFixed(2);
  const marsAvgTemperature = marsResult[0]["343"].AT.av.toFixed(2);

  const averageTempDifference = cityAvgTemperature - marsAvgTemperature;
  console.log(averageTempDifference);

  $(`li.averageTempDifference`).html(-Math.abs(averageTempDifference));
};

weatherCompare.getUserCity = function() {
    $("form.cityWeather").on("submit", function(event) {
    event.preventDefault();
    userCity = $(".cityWeather input").val();

    if (userCity !== "") {
      const userCityFunction = weatherCompare.getCityWeather(userCity);
      const marsWeatherFunction = weatherCompare.getMarsWeather();

      $.when(userCityFunction, marsWeatherFunction).done(function(cityData, marsData) {
        weatherCompare.addMarsData(marsData);
        weatherCompare.addCityData(cityData);
        weatherCompare.addDifferenceData(marsData, cityData);

        $('main').removeClass("displayNone");
      }).then(function(){
          $("html,body").animate({
              scrollTop: $("#resultsSection").offset().top
          },
              "slow"
          );
      })
    } else {
      alert("PLZ ENTER A CITY!!!!");
    }
  });
};

// Start app
weatherCompare.init = function() {
  weatherCompare.getUserCity();
};

$(function() {
  weatherCompare.init();
});
