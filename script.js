// API app idea --- an app that lets the user compare the weather in the city of their choosing with the weather on Mars. 

// User will be greeted by a space-themed landing page with an input form. The instructions will tell the user to enter the name of their/any city and submit. On submit, two panels will slide into view with information on their selected city's weather and Mars' weather, respectively. Each panel will detail specifics about temperature, forecast, meteorological events etc. There will also be information on the page that directly compares the two e.g. Mars is ___ degrees colder than Toronto.

// This will use a weather API and a NASA api.
// TESTINg
// Potential pseudo code

const weatherCompare = {};

const marsApi = `EwwwPaMx8qEpAqWR0mgPxqaVTDLBFsckriIbLtgc`;
const weatherApi = `8f12648509075ad5f7b59b7ecc23f813`

weatherCompare.getMarsWeather = function () {
    $.ajax({
        url: `https://api.nasa.gov/insight_weather/?api_key=${marsApi}&feedtype=json&ver=1.0`,
        method: `GET`,
        dataType: `json`,
        // version: 1,
        // feedtype: `JSON`,
        // api_key: `${marsApi}`
<<<<<<< HEAD
    }).then(function (marsResult){
        console.log(marsResult);
        const marsTemperature = (marsResult['343'].AT.av).toFixed(0);

        let marsTempToAppend = (`It is ${marsTemperature} degrees on Mars`);
       
        $('li.marsTemperature').append(marsTempToAppend);
    })
}

weatherCompare.getCityWeather = function(userCity){
    weatherCompare.getMarsWeather();

=======
    }).then(function (marsResult) {
        const marsTemperature = marsResult['342'].AT.av;
        console.log(`It is ${marsTemperature} degrees on Mars`);
    })
}

weatherCompare.getCityWeather = function (userCity) {
>>>>>>> c89a93663711a50269fb99d27d37360cd2b6e1db
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/weather?q=${userCity}&appid=${weatherApi}`,
        method: `GET`,
        dataType: `json`,
<<<<<<< HEAD
    }).then(function(cityResult){
        let cityName = cityResult.name;

=======
    }).then(function (cityResult) {
>>>>>>> c89a93663711a50269fb99d27d37360cd2b6e1db
        let cityTemperature = parseInt(cityResult.main.temp);
        let cityTemperatureConverted = (cityTemperature - 273);

        let cityTempToAppend = (`It is ${cityTemperatureConverted} degrees in ${cityName}`);

        $('li.cityTemperature').html(cityTempToAppend);
    })
}

<<<<<<< HEAD
weatherCompare.userCity = function(){
    $('.cityWeather').on("submit", function(event){
        event.preventDefault();
        userCity = $('.cityWeather input').val();

        if (userCity !== ''){
            weatherCompare.getCityWeather(userCity)
        } else {
            alert("PLZ ENTER A CITY!!!!");
        }
=======
weatherCompare.userCity = function () {
    $('h1').on("click", function () {
        // userCity = form.val();
>>>>>>> c89a93663711a50269fb99d27d37360cd2b6e1db

    })
}

// Start app
<<<<<<< HEAD
weatherCompare.init = function() {
    // $.when(weatherCompare.getMarsWeather, weatherCompare.getCityWeather).done(function( marsWeather, cityWeather ){
    //     console.log("done");
=======
weatherCompare.init = function () {
    // when(weatherCompare.getMarsWeather, weatherCompare.getCityWeather).done(function( marsWeather, cityWeather ){
    //     const city = `${cityWeather}`
    //     const mars = `${marsWeather}`

    //     $('section').html(city/mars/blah blah blah);
>>>>>>> c89a93663711a50269fb99d27d37360cd2b6e1db
    // })
    // weatherCompare.getMarsWeather();
    weatherCompare.userCity();
}

$(function () {
    weatherCompare.init();
});