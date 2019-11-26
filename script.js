const app = {};

const marsApiKey = `EwwwPaMx8qEpAqWR0mgPxqaVTDLBFsckriIbLtgc`;
const weatherApiKey = `8f12648509075ad5f7b59b7ecc23f813`;

const audioElement = document.createElement(`audio`);
audioElement.setAttribute(`src`, `./assets/audioClip/eagleHasLanded.mp3`);
audioElement.play();

app.volumeButton = function(){
  $(`.volumeButton`).on(`click`, function(){
    $(`.volumeButton`).toggleClass(`volumeOff`);
    $(`.volumeButton i`).toggleClass(`fas-volume-mute, fa-volume-up`)
  });
};

app.temperatureToggle = function(){
  $(`.toggleTempScale`).on(`click`, function(event){
    event.preventDefault();
    $(`.scale`).toggleClass(`celsius`);
  })
}

app.getMarsWeather = function () {
  const marsWeatherResults = $.ajax({
    url: `https://api.nasa.gov/insight_weather/?api_key=${marsApiKey}&feedtype=json&ver=1.0`,
    method: `GET`,
    dataType: `json`,
  });
  return marsWeatherResults;
};

app.getCityWeather = function (userCity) {
  const cityWeatherResults = $.ajax({
    url: `https://api.openweathermap.org/data/2.5/weather?q=${userCity}&appid=${weatherApiKey}`,
    method: `GET`,
    dataType: `json`
  });
  return cityWeatherResults;
};

app.getCityPhoto = function (userCity) {
  const formattedCity = userCity.replace(` `, `-`);
  const cityPhotoResult = $.ajax({
    url: `https://api.teleport.org/api/urban_areas/slug:${formattedCity.toLowerCase()}/images/`,
    method: `GET`,
    dataType: `json`,
  });
  return cityPhotoResult;
}

app.addCityPhoto = function (cityPhotoResult, userCity) {
  const cityPhotoToAppend = cityPhotoResult.photos[0].image.mobile;
  $(`.cityPhoto`).html(`<img class="cityImage" src="${cityPhotoToAppend}" alt="A photo of ${userCity}">`);
}

app.addCityPhotoCatch = function (userCity) {
  $(`.cityPhoto`).html(`<img class="cityImage" src="./assets/genericCity.jpg" alt="A photo of a generic city, as ${userCity} did not have one available">`);
}

app.addMarsData = function (cityResult, marsResult) {
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

  $(`li.marsAverage`).html(`${marsAvgTemperature}°C`);
  $(`li.marsMax`).html(`${marsMaxTemperature}°C`);
  $(`li.marsMin`).html(`${marsMinTemperature}°C`);

  app.addDifferenceData(marsAvgTemperature, marsMaxTemperature, marsMinTemperature, cityResult);
};

app.addCityData = function (cityResult, userCity) {
  const userCityPhoto = app.getCityPhoto(userCity);
  $.when(userCityPhoto)
    .done(function (cityPhotoResult) {
      app.addCityPhoto(cityPhotoResult, userCity);
    })
    .fail(app.addCityPhotoCatch(userCity));

  let cityName = cityResult[0].name;

  let cityAvgTemperature = (cityResult[0].main.temp - 273.15).toFixed(2);
  let cityMaxTemperature = (cityResult[0].main.temp_max - 273.15).toFixed(2);
  let cityMinTemperature = (cityResult[0].main.temp_min - 273.15).toFixed(2);

  $(`p.cityTitle`).html(cityName);
  $(`li.cityAverage`).html(`${cityAvgTemperature}°C`);
  $(`li.cityMax`).html(`${cityMaxTemperature}°C`);
  $(`li.cityMin`).html(`${cityMinTemperature}°C`);
};

app.addDifferenceData = function (avgMarsTemp, maxMarsTemp, minMarsTemp, cityResult) {
  let cityAvgTemperature = (cityResult[0].main.temp - 273.15).toFixed(2);
  let cityMaxTemperature = (cityResult[0].main.temp_max - 273.15).toFixed(2);
  let cityMinTemperature = (cityResult[0].main.temp_min - 273.15).toFixed(2);

  const averageTempDifference = (cityAvgTemperature - avgMarsTemp).toFixed(2);
  const maxTempDifference = (cityMaxTemperature - maxMarsTemp).toFixed(2);
  const minTempDifference = (cityMinTemperature - minMarsTemp).toFixed(2);

  $(`li.averageTempDifference`).html(`${- Math.abs(averageTempDifference)}°C`);
  $(`li.maxTempDifference`).html(`${-Math.abs(maxTempDifference)}°C`);
  $(`li.minTempDifference`).html(`${-Math.abs(minTempDifference)}°C`);
  $(`p.cityVsMars`).html(`${cityResult[0].name} vs. Mars`);

  app.toggleTheTemperature(cityAvgTemperature, cityMaxTemperature, cityMinTemperature, avgMarsTemp, maxMarsTemp, minMarsTemp, averageTempDifference, maxTempDifference, minTempDifference);
};

// 
app.toggleTheTemperature = function (cityAvgTemperature, cityMaxTemperature, cityMinTemperature, marsAvgTemperature, marsMaxTemperature, marsMinTemperature, averageTempDifference, maxTempDifference, minTempDifference){

  $(`.toggleTempScale`).on(`click`, function(){
    if ($(`ul.scale`).hasClass(`celsius`) === true) {
      $(`li.marsAverage`).html(`${marsAvgTemperature}°C`);
      $(`li.marsMax`).html(`${marsMaxTemperature}°C`);
      $(`li.marsMin`).html(`${marsMinTemperature}°C`);
      //
      $(`li.cityAverage`).html(`${cityAvgTemperature}°C`);
      $(`li.cityMax`).html(`${cityMaxTemperature}°C`);
      $(`li.cityMin`).html(`${cityMinTemperature}°C`);
      //
      $(`li.averageTempDifference`).html(`${- Math.abs(averageTempDifference)}°C`);
      $(`li.maxTempDifference`).html(`${-Math.abs(maxTempDifference)}°C`);
      $(`li.minTempDifference`).html(`${-Math.abs(minTempDifference)}°C`);

    } else {
      $(`li.marsAverage`).html(`${(marsAvgTemperature * 1.8 + 32).toFixed(2)}°F`);
      $(`li.marsMax`).html(`${(marsMaxTemperature * 1.8 + 32).toFixed(2)}°F`);
      $(`li.marsMin`).html(`${(marsMinTemperature * 1.8 + 32).toFixed(2)}°F`);
      //
      $(`li.cityAverage`).html(`${(cityAvgTemperature * 1.8 + 32).toFixed(2)}°F`);
      $(`li.cityMax`).html(`${(cityMaxTemperature * 1.8 + 32).toFixed(2)}°F`);
      $(`li.cityMin`).html(`${(cityMinTemperature * 1.8 + 32).toFixed(2)}°F`);
      //
      $(`li.averageTempDifference`).html(`${- Math.abs((averageTempDifference * 1.8 + 32).toFixed(2))}°F`);
      $(`li.maxTempDifference`).html(`${-Math.abs((maxTempDifference * 1.8 + 32).toFixed(2))}°F`);
      $(`li.minTempDifference`).html(`${-Math.abs((minTempDifference * 1.8 + 32).toFixed(2))}°F`);
    };
  });
};
// 

app.getUserInput = function () {
  const marsWeatherFunction = app.getMarsWeather();

  $(`form.cityWeather`).on(`submit`, function (event) {
    event.preventDefault();
    userCity = $(`.cityWeather input`).val();

    if ($(`.volumeButton`).hasClass(`volumeOff`) === false){
          audioElement.play();
    };

    $(`input`).val(``);

    if (userCity !== ``) {
      const userCityWeather = app.getCityWeather(userCity);

      $(`.majorTom`).addClass(`displayNone`);
      $(`div.atomPreloader`).removeClass(`displayNone`);
      // 
      $.when(userCityWeather, marsWeatherFunction).done(function (cityData, marsData) {

        app.addCityData(cityData, userCity);
        app.addMarsData(cityData, marsData);

        $(`#resultsSection`).removeClass(`displayNone`);
      }).then(function () {
        app.typedHeader = new Typed(`#typed-text`, {
          strings: [``, `Greetings Earthling 👽`, `You vs. Martian Weather`
          ],
          typeSpeed: 65,
          backSpeed: 25,
          bindInputFocusEvents: true,
          loop: false,
          cursorChar: ``,
          backDelay: 1000,
          startDelay: 0,
        });

        setTimeout(function () { 
          $(`.majorTom`).removeClass(`displayNone`);
          $(`div.atomPreloader`).addClass(`displayNone`);
          $(`html,body`).animate({
            scrollTop: $(`#resultsSection`).offset().top
          }, 300, `linear`);
        }, 500);
      })
        .fail(function(){
          $(`.majorTom`).removeClass(`displayNone`);
          $(`div.atomPreloader`).addClass(`displayNone`);
          Swal.fire(`Please check your spelling or enter another city`)
        })
    } else {
      Swal.fire(`Input cannot be left blank`);
    };
  });
};

app.init = function() {
  app.volumeButton();
  app.getUserInput();
  app.temperatureToggle();
};

$(function () {
  app.init();
});