let oneWeatherKey = '838280be2c1fc8d64cd45714416631d8';

// API Link https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&appid={API key}
// Icon Link https://openweathermap.org/img/wn/{ICON NUMBER}.png
// Geocoding Link https://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid={API key}

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
let forecastDate = '';
let forecastTemp = '';
let forecastWind = '';
let forecastHumid = '';
let forecastUv = '';
let forecastIcon = '';

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
let historyBtn = document.querySelector('.historyBtn');
let history1 = document.querySelector('#history1');
history1.style.display = 'none'
let history2 = document.querySelector('#history2');
history2.style.display = 'none'
let history3 = document.querySelector('#history3');
history3.style.display = 'none'
let history4 = document.querySelector('#history4');
history4.style.display = 'none'
let history5 = document.querySelector('#history5');
history5.style.display = 'none'
let history6 = document.querySelector('#history6');
history6.style.display = 'none'

let memoryLast = '';
let historyArray = [history1,history2,history3,history4,history5,history6];
let historyCurrent = 0

let forecast1 = document.querySelector("#forecast1");
let forecast2 = document.querySelector("#forecast2");
let forecast3 = document.querySelector("#forecast3");
let forecast4 = document.querySelector("#forecast4");
let forecast5 = document.querySelector("#forecast5");

let forecastArray = [forecast1,forecast2,forecast3,forecast4,forecast5];

let saveArray = ['.','.','.','.','.','.'];
let savePoint = 0;

var loadData = function(){
    saveArray = JSON.parse(localStorage.getItem("saveArray"));
    savePoint = JSON.parse(localStorage.getItem("savePoint"))
 }
 
 loadData();

 if (savePoint != 0){
     console.log('saved data detected')
     for (let i = 0; i < savePoint; i++){
         historyArray[i].textContent = saveArray[i];
         historyArray[i].style.display = "inline";
     }
 }

//Function to parse and handle searching
let searchFunction = function(){
    initialSearch = cityInput.value
    cityInput.value = '';
    if (initialSearch == ''){
        window.alert("No city provided.")
        return;
    } else {
        if (memoryLast != ''){
            if (historyCurrent != 0){
                for (let i=historyCurrent;i>0;i--){
                    
                    historyArray[i].textContent = historyArray[i-1].textContent
                }
            }
            historyArray[0].textContent = memoryLast;
            console.log(historyArray[historyCurrent-1]);
            if (historyCurrent < historyArray.length-1){
                historyArray[historyCurrent].style.display = 'inline';
                historyCurrent += 1;
            }
            
        }

        //API call to determine latitude and longitude of the searched city
        fetch('https://api.openweathermap.org/geo/1.0/direct?q='+initialSearch+'&limit=5&appid='+oneWeatherKey)
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

                memoryLast = cityName;
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
        timeConvert();
        currentTemp = data.current.temp;
        windDeg = data.current.wind_deg;
        windSpeed = data.current.wind_speed;
        currentHumid = data.current.humidity;
        currentUv = data.current.uvi;
        currentIcon = data.current.weather[0].icon;

        updateFunction();
       

        for (let i = 0; i < 5; i++){
            forecastDate = forecastArray[i].children[0];
            currentDateUnix = data.daily[i].dt;
            timeConvert();
            forecastDate.textContent = 'Date: '+currentDate;
            forecastIcon = forecastArray[i].children[1];
            forecastIcon.src = 'https://openweathermap.org/img/wn/'+data.daily[i].weather[0].icon+'.png';
            forecastTemp = forecastArray[i].children[2];
            forecastTemp.textContent = 'Temp: '+data.daily[i].temp.day+'°F';
            forecastWind = forecastArray[i].children[3];
            forecastWind.textContent = 'Wind: '+data.daily[i].wind_speed+' mph';
            forecastHumid = forecastArray[i].children[4];
            forecastHumid.textContent = "Humidity: "+data.daily[i].humidity+"%";
        }
    })
}

//Convert Unix Time
let timeConvert = function(){
    let adjustedDate = currentDateUnix * 1000
    let dateObject = new Date(adjustedDate);
    currentDate = dateObject.toLocaleString('en-US');
    return;
}

//Assign the pertinent information to the display blocks

let updateFunction = function(){
    console.log(historyCurrent)
    //handle current day stats
    displayCityName.textContent = cityName +" "+currentDate;
    tempBlock.textContent = 'Temp: '+currentTemp+"°F";
    windBlock.textContent = 'Wind: '+windDeg+' Degrees, '+windSpeed+' mph';
    humidBlock.textContent = 'Humidity: '+currentHumid+'%';
    
    let currentIconUrl = 'https://openweathermap.org/img/wn/'+currentIcon+'.png';
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

    saveFunction();
}

//Move past searches into history as clickable objects to bring their info back up
let recallFunction = function(){

    console.log(this)

    initialSearch = this.textContent;
    if (memoryLast != ''){
            // if (historyCurrent != 0){
                for (let i=historyCurrent;i>0;i--){
                    historyArray[i].textContent = historyArray[i-1].textContent
                }
            
            historyArray[0].textContent = memoryLast;
            historyArray[historyCurrent].style.display = 'inline';
            if (historyCurrent < historyArray.length-1){
                historyCurrent += 1;
            }
        }

        //API call to determine latitude and longitude of the searched city
        fetch('https://api.openweathermap.org/geo/1.0/direct?q='+initialSearch+'&limit=5&appid='+oneWeatherKey)
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

                memoryLast = cityName;
                displayFunction();
            }
        })
    // }
}


let saveFunction = function(){
    saveArray[0] = historyArray[0].textContent
    saveArray[1] = historyArray[1].textContent
    saveArray[2] = historyArray[2].textContent
    saveArray[3] = historyArray[3].textContent
    saveArray[4] = historyArray[4].textContent
    saveArray[5] = historyArray[5].textContent
    savePoint = historyCurrent

    for (let i=0;i<5;i++){
        if (saveArray[i] == ""){
            savePoint = i
            break;
        }
    }
    console.log(savePoint +" "+ historyCurrent)
    console.log(saveArray)

    window.localStorage.setItem('saveArray', JSON.stringify(saveArray))
    window.localStorage.setItem('savePoint', JSON.stringify(savePoint))
    
}

let clearFunction = function(){
    window.localStorage.clear();
}


//Eventlisteners to interact with the page
searchBtn.addEventListener('click', searchFunction);
history1.addEventListener('click', recallFunction);
history2.addEventListener('click', recallFunction);
history3.addEventListener('click', recallFunction);
history4.addEventListener('click', recallFunction);
history5.addEventListener('click', recallFunction);
history6.addEventListener('click', recallFunction);