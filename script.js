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
let currentTemp = '';
let windDeg = '';
let windSpeed = '';
let currentHumid = '';
let currentUv = '';
let currentIcon = '';

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
let severityBlock = document.querySelector("#severityWarning");


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
    

    fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+targetLat+'&lon='+targetLon+'&units=imperial&appid='+oneWeatherKey)
    .then(function(response) {
        return response.json();
    }) 
    .then(function(data){
        console.log(data);
        console.log(data.current.dt);
        //assign info from the fetched data
        currentDateUnix = data.current.dt;
        currentTemp = data.current.temp;
        windDeg = data.current.wind_deg;
        windSpeed = data.current.wind_speed;
        currentHumid = data.current.humidity;
        currentUv = data.current.uvi;
        currentIcon = data.current.weather[0].icon;
        console.log(currentIcon);
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
    tempBlock.textContent = 'Temp: '+currentTemp+"°F";
    windBlock.textContent = 'Wind: '+windDeg+' Degrees, '+windSpeed+' mph';
    humidBlock.textContent = 'Humidity: '+currentHumid+'%';
    
    let currentIconUrl = 'http://openweathermap.org/img/wn/'+currentIcon+'.png';
    iconBlock.src = currentIconUrl;

    severityBlock.textContent = currentUv;
    if (currentUv <= 2){
        severityBlock.classList.add('btn-success');
        severityBlock.classList.remove('btn-warning');
        severityBlock.classList.remove('btn-danger');
    } else {
        if (currentUv <= 5){
            severityBlock.classList.remove('btn-success');
            severityBlock.classList.add('btn-warning');
            severityBlock.classList.remove('btn-danger');
        }else{
            severityBlock.classList.remove('btn-success');
            severityBlock.classList.remove('btn-warning');
            severityBlock.classList.add('btn-danger');
        }
    }
}

//Assign the pertinent information to the display blocks

//Move past searches into history as clickable objects to bring their info back up

//Make save function to remember your search history and last open search in local storage

//Eventlisteners to interact with the page
searchBtn.addEventListener('click', searchFunction);