let oneWeatherKey = '838280be2c1fc8d64cd45714416631d8';

// API Link https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&appid={API key}
// Icon Link http://openweathermap.org/img/wn/{ICON NUMBER}.png
// Geocoding Link http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid={API key}

let initialSearch = '';
let targetLat = '';
let targetLon = '';
let cityName = '';
let currentDateUnix = '';
let currentDate = '';

let historyArray = [];
let historyVolume = 8;

//Target all relevant elements on the page
let cityInput = document.querySelector('#cityInput');
let searchBtn = document.querySelector('#searchBtn');
let historyBlock = document.querySelector('#historyBlock');
let mainPanel = document.querySelector('#mainPanel');
let displayCityName = document.querySelector('#cityNameDisplay');
let tempBlock = document.querySelector('#tempBlock');
let windBlock = document.querySelector('#windBlock');
let humidBlock = document.querySelector('#humidBlock');
let uvBlock = document.querySelector('#uvBlock');
let iconBlock = document.querySelector('#iconBlock');


//Function to parse and handle searching
let searchFunction = function(){
    initialSearch = cityInput.value
    cityInput.value = '';
    if (initialSearch == ''){
        window.alert("No city provided.")
        return;
    } else {
        //API call to determine latitude and longitude of the searched city
        fetch('http://api.openweathermap.org/geo/1.0/direct?q='+initialSearch+'&limit=5&appid='+oneWeatherKey)
        .then(function (response) {
            return response.json();
          })
        .then(function(data) {
            if (data.length == 0){
                window.alert("Cannot find a city named"+initialSearch+".");
            } else {
                cityName = data[0].name
                targetLat = data[0].lat;
                targetLon = data[0].lon;
                console.log(cityName+" "+targetLat+" "+targetLon+" "+currentDate);
                displayFunction();
            }
        })
    }
}


//Use Lat and Lon to make API call for the weather information
let displayFunction = function(){
    

    fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+targetLat+'&lon='+targetLon+'&appid='+oneWeatherKey)
    .then(function(response) {
        return response.json();
    }) 
    .then(function(data){
        console.log(data);
        console.log(data.current.dt);
        //assign info from the fetched data
        currentDateUnix = data.current.dt;
    })
    .then(function(){
        timeConvert();
    });

}

//Convert Unix Time
let timeConvert = function(){
    let adjustedDate = currentDateUnix * 1000
    let dateObject = new Date(adjustedDate);
    currentDate = dateObject.toLocaleString('en-US');
    displayCityName.textContent = cityName +" "+currentDate;
}

//Assign the pertinent information to the display blocks

//Move past searches into history as clickable objects to bring their info back up

//Make save function to remember your search history and last open search in local storage

//Make eventlisteners to interact with the page

searchBtn.addEventListener('click', searchFunction);