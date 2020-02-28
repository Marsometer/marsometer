const app = {}

let marsApiKey = `EwwwPaMx8qEpAqWR0mgPxqaVTDLBFsckriIbLtgc`
let weatherApiKey = `8f12648509075ad5f7b59b7ecc23f813`

let $volumeButton = $(`.volumeButton`)
let $majorTom = $(`.majorTom`)
let $atomPreloader = $(`div.atomPreloader`)
let $cityPhoto = $(`.cityPhoto`)
let $marsAverage = $(`li.marsAverage`)
let $marsMax = $(`li.marsMax`)
let $marsMin = $(`li.marsMin`)
let $cityAverage = $(`li.cityAverage`)
let $cityMax = $(`li.cityMax`)
let $cityMin = $(`li.cityMin`)
let $averageDifference = $(`li.averageTempDifference`)
let $maxDifference = $(`li.maxTempDifference`)
let $minDifference = $(`li.minTempDifference`)

let marsDateArray = []
let marsCelsiusObject = {}
let marsFahrenheitObject = {}
let cityCelsiusObject = {}
let cityFahrenheitObject = {}

let audioElement = document.createElement(`audio`)
audioElement.setAttribute(`src`, `./assets/audioClip/eagleHasLanded.mp3`)

// Toggles volume on/off
app.volumeButton = () => {
  $volumeButton.on(`click`, () => {
    $volumeButton.toggleClass(`volumeOff`)
    $(`.volumeButton i`).toggleClass(`fas-volume-mute, fa-volume-up`)
  })
}

app.playAudio = () => {
  if ($volumeButton.hasClass(`volumeOff`) === false) {
    audioElement.play()
  }
}

// Retrieves Mars' temperature from NASA's Insight API
app.getMarsWeather = () => {
  const marsWeatherResults = $.ajax({
    url: `https://api.nasa.gov/insight_weather/?api_key=${marsApiKey}&feedtype=json&ver=1.0`,
    method: `GET`,
    dataType: `json`,
  })
  return marsWeatherResults
}

// Retrieves city temperature from openweathermap.org
app.getCityWeather = userCity => {
  const cityWeatherResults = $.ajax({
    url: `https://api.openweathermap.org/data/2.5/weather?q=${userCity}&appid=${weatherApiKey}`,
    method: `GET`,
    dataType: `json`
  });
  return cityWeatherResults
};

// Retrieves city photo from teleport.org.
app.getCityPhoto = userCity => {
  const formattedCity = userCity.replace(` `, `-`)

  const cityPhotoResult = $.ajax({
    url: `https://api.teleport.org/api/urban_areas/slug:${formattedCity.toLowerCase()}/images/`,
    method: `GET`,
    dataType: `json`,
  });
  return cityPhotoResult
}

app.addCityPhoto = (cityPhotoResult, userCity) => {
  const cityPhotoToAppend = cityPhotoResult.photos[0].image.mobile;

  $cityPhoto.html(`<img class="cityImage" src="${cityPhotoToAppend}" alt="A photo of ${userCity}">`)
}

app.addCityPhotoCatch = userCity => {
  $cityPhoto.html(`<img class="cityImage" src="./assets/genericCity.jpg" alt="A photo of a generic city, as ${userCity} did not have one available">`)
}

// Converts returned Mars data into two easy-to-use objects
app.formatMarsData = marsResult => {
  for (key in marsResult[0]) {
    if (key > 0) {
      marsDateArray.push(key)
    }
  }
  
  marsFahrenheitObject = marsResult[0][Math.max(...marsDateArray)].AT
  
  for (const temperature in marsFahrenheitObject) {
    marsFahrenheitObject[temperature] = parseFloat(marsFahrenheitObject[temperature].toFixed(2))
  }

  marsCelsiusObject = { ...marsFahrenheitObject }
  
  for (const temperature in marsCelsiusObject) {
    marsCelsiusObject[temperature] = parseFloat(((marsCelsiusObject[temperature] - 32) * 5 / 9).toFixed(2))
  }
}

// Converts returned city data into two easy-to-use objects
app.formatCityData = (cityResult, userCity) => {
  $.when(app.getCityPhoto(userCity))
    .done(cityPhotoResult => {
      app.addCityPhoto(cityPhotoResult, userCity)
    })
    .fail(app.addCityPhotoCatch(userCity));

  cityCelsiusObject = cityResult[0].main
  
  for (temperature in cityCelsiusObject){
    cityCelsiusObject[temperature] = parseFloat((cityCelsiusObject[temperature] - 273.15).toFixed(2))
  }

  cityFahrenheitObject = { ...cityCelsiusObject }

  for (temperature in cityFahrenheitObject) {
    cityFahrenheitObject[temperature] = parseFloat(((cityFahrenheitObject[temperature] * 9 / 5) + 32).toFixed(2))
  }

  $(`p.cityTitle`).html(cityResult[0].name)
  $(`p.cityVsMars`).html(`${cityResult[0].name} vs. Mars`)
};

app.appendCelsius = () => {
  let { av, mx, mn } = marsCelsiusObject
  let { temp, temp_max, temp_min } = cityCelsiusObject

  $marsAverage.html(`${av}°C`)
  $marsMax.html(`${mx}°C`)
  $marsMin.html(`${mn}°C`)
  $cityAverage.html(`${temp}°C`)
  $cityMax.html(`${temp_max}°C`)
  $cityMin.html(`${temp_min}°C`)
  $averageDifference.html(`${(av - temp).toFixed(2)}°C`)
  $maxDifference.html(`${(mx - temp_max).toFixed(2)}°C`)
  $minDifference.html(`${(mn - temp_min).toFixed(2)}°C`)
}

app.appendFahrenheit = () => {
  let { av, mx, mn } = marsFahrenheitObject
  let { temp, temp_max, temp_min } = cityFahrenheitObject

  $marsAverage.html(`${av}°F`)
  $marsMax.html(`${mx}°F`)
  $marsMin.html(`${mn}°F`)
  $cityAverage.html(`${temp}°F`)
  $cityMax.html(`${temp_max}°F`)
  $cityMin.html(`${temp_min}°F`)
  $averageDifference.html(`${(av - temp).toFixed(2)}°F`)
  $maxDifference.html(`${(mx - temp_max).toFixed(2)}°F`)
  $minDifference.html(`${(mn - temp_min).toFixed(2)}°F`)
}

app.temperatureToggle = () => {
  $(`.toggleTempScale`).on(`click`, e => {
    e.preventDefault()
    $(`.scale`).toggleClass(`celsius`)

    if ($(`ul.scale`).hasClass(`celsius`) === true) {
      app.appendCelsius()
    } else {
      app.appendFahrenheit()
    }
  })
}

// Runs if API calls are successful
app.onSuccess = () => {
  app.playAudio()
  app.appendCelsius()
  app.temperatureToggle()
  $(`#resultsSection`).removeClass(`displayNone`)
}

app.smoothScrollDown = () => {
  setTimeout(() => {
    $majorTom.removeClass(`displayNone`)
    $atomPreloader.addClass(`displayNone`)

    $(`html,body`).animate({
      scrollTop: $(`#resultsSection`).offset().top
    }, 300, `linear`)
  }, 500)
  $(`h2`).removeAttr(`id`)
}

app.getUserInput = () => {
  $(`form.cityWeather`).on(`submit`, e => {
    e.preventDefault()

    userCity = $(`.cityWeather input`).val()
    $(`input`).val(``)
    
    if (userCity !== ``) {
      const userCityWeather = app.getCityWeather(userCity)
      const marsWeatherFunction = app.getMarsWeather()

      $majorTom.addClass(`displayNone`)
      $atomPreloader.removeClass(`displayNone`)
      // 
      $.when(userCityWeather, marsWeatherFunction).done((cityData, marsData) => {
        const formatCityData = app.formatCityData(cityData, userCity)
        const formatMarsData = app.formatMarsData(marsData)

        $.when(formatCityData, formatMarsData).done(() => {
          app.onSuccess()
  
          app.typedHeader = new Typed(`#typed-text`, {
            strings: [``, `Greetings, Earthling 👽`, `You vs. Martian Weather`
            ],
            typeSpeed: 65,
            backSpeed: 25,
            bindInputFocusEvents: true,
            loop: false,
            cursorChar: ``,
            backDelay: 1000,
            startDelay: 0,
          })
        }).then(() => {
            app.smoothScrollDown()
        })
      }).fail(() => {
              $majorTom.removeClass(`displayNone`)
              $atomPreloader.addClass(`displayNone`)
              Swal.fire(`Please check your spelling or enter another city`)
            })
    } else {
      Swal.fire(`Input cannot be left blank`)
    }
  })
}

app.init = () => {
  app.volumeButton()
  app.getUserInput()
}

$(() => {
  app.init()
})