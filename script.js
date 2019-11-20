
// API app idea --- an app that lets the user compare the weather in the city of their choosing with the weather on Mars. 

// User will be greeted by a space-themed landing page with an input form. The instructions will tell the user to enter the name of their/any city and submit. On submit, two panels will slide into view with information on their selected city's weather and Mars' weather, respectively. Each panel will detail specifics about temperature, forecast, meteorological events etc. There will also be information on the page that directly compares the two e.g. Mars is ___ degrees colder than Toronto.

// This will use a weather API and a NASA api.

// Potential pseudo code

const weatherCompare = {};

const marsApi = `EwwwPaMx8qEpAqWR0mgPxqaVTDLBFsckriIbLtgc`;
const weatherApi = `8f12648509075ad5f7b59b7ecc23f813`

weatherCompare.getMarsWeather = function(){
    $.ajax({
        url: `https://api.nasa.gov/insight_weather/?api_key=${marsApi}&feedtype=json&ver=1.0`,
        method: `GET`,
        dataType: `json`,
        // version: 1,
        // feedtype: `JSON`,
        // api_key: `${marsApi}`
    }).then(function (marsResult){
        const marsTemperature = marsResult['342'].AT.av;
        console.log(`It is ${marsTemperature} degrees on Mars`);
    })
}

weatherCompare.getCityWeather = function(userCity){
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/weather?q=${userCity}&appid=${weatherApi}`,
        method: `GET`,
        dataType: `json`,
    }).then(function(cityResult){
        let cityTemperature = parseInt(cityResult.main.temp);
        let cityTemperatureConverted = (cityTemperature - 273.15)
        console.log(`It is ${cityTemperature - 273.15} degrees in Toronto`);
    })
}

weatherCompare.userCity = function(){
    $('h1').on("click", function(){
        // userCity = form.val();

        weatherCompare.getCityWeather("Toronto")
    })
}

// Start app
weatherCompare.init = function() {
    // when(weatherCompare.getMarsWeather, weatherCompare.getCityWeather).done(function( marsWeather, cityWeather ){
    //     const city = `${cityWeather}`
    //     const mars = `${marsWeather}`

    //     $('section').html(city/mars/blah blah blah);
    // })
    weatherCompare.getMarsWeather();
    weatherCompare.userCity();
}

$(function() {
    weatherCompare.init();
});