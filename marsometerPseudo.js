
// API app idea --- an app that lets the user compare the weather in the city of their choosing with the weather on Mars. 

// User will be greeted by a space-themed landing page with an input form. The instructions will tell the user to enter the name of their/any city and submit. On submit, two panels will slide into view with information on their selected city's weather and Mars' weather, respectively. Each panel will detail specifics about temperature, forecast, meteorological events etc. There will also be information on the page that directly compares the two e.g. Mars is ___ degrees colder than Toronto.

// This will use a weather API and a NASA api.

// Potential pseudo code

/* 

1. User enters city into form and submits
2. Data is taken from form and sent to AJAX API call
3. Weather data is retrieved from user-selected city and NASA insight API
4. Wait until both calls have been completed and all data has been retrieved
5. Append data to HTML in a fun way which allows the user to compare both data sets 

*/

const weatherCompare = {};

const marsApi = `EwwwPaMx8qEpAqWR0mgPxqaVTDLBFsckriIbLtgc`;

weatherCompare.getMarsWeather = function(){
    const marsWeather = $.ajax({
        url: `https://api.nasa.gov/planetary/apod?api_key=${marsApi}`,
        method: GET,
    }).then(function (result){
        console.log(result)
    })
}

weatherCompare.getCityWeather = function(){
    const cityWeather = $.ajax({
        url: cityweatherbjhslk,
        method: GET,
    }).then( function(result){

    })
}

weatherCompare.userCity = function(){
    $('form').on(submit, function(){
        userCity = form.val();

        weatherCompare.getCityWeather(userCity)
    })
}

// Start app
weatherCompare.init = function() {
    when(weatherCompare.getMarsWeather, weatherCompare.getCityWeather).done(function( marsWeather, cityWeather ){
        const city = `${cityWeather}`
        const mars = `${marsWeather}`

        $('section').html(shjkfdshjkfdjhk);
    })
}

$(function() {
    weatherCompare.init();
});