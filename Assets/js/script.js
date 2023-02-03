//variable declaration
var submitFormElement = document.getElementById('user-form');
var submitTextAreaElement = document.getElementById('cityName');
var searchedCityElement = document.getElementById('city-searched');
var weatherDisplayElement = document.getElementById("weather-display");
var now = dayjs();
var currentCity;

//init function gets run when the webpage opens
function init(){
    //grabbing the latest city that was stored in local storage
    var storedCity = JSON.parse(localStorage.getItem("previousCity"));
    if (storedCity !== null){
        currentCity = storedCity;
    }
    //If there was no city saved in local storage, the web page loads without showing the data.
    if (currentCity !== ""){
        apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q="+currentCity+"&units=metric&appid=906a158a504520ea456e7b72ed30fe74"

        //grab the data from the api URL.
        fetch(apiUrl)
            .then(function (response) {
            if (response.ok) {
                response.json().then(function (weatherData) {
                    //Call the displayWeather function to display the weather that was downloaded for the previously searched city.
                    displayWeather(weatherData);
                });
            } else {
                alert("Error: " + response.statusText);
            }
            })
            .catch(function (error) {
                alert("Unable to connect to OpenWeather");
            });
    }
}

//function to display the next 5 days of the weather
function displayWeather(weatherData){
    //If there is already the data displayed, this removes all the data before adding the new data
    while (weatherDisplayElement.hasChildNodes()){
        weatherDisplayElement.removeChild(weatherDisplayElement.firstChild);
    }
    //Need the current date in order to determine the next 5 days
    currentDate = dayjs(now).format("M/D/YYYY");
    var counter = 0;
    //Loop through all 40 data points returned from the API.
    for (var i = 0; i < weatherData.list.length; i++){
        var date = new Date(weatherData.list[i].dt * 1000);
        activeDate = date.toLocaleDateString("default");
        //Only the first instance of each day will be shown.
        if (currentDate == activeDate){
            counter += 1;
            var today = new Date();
            var theNextDay = new Date();
            theNextDay.setDate(today.getDate()+counter);
            currentDate = theNextDay.toLocaleDateString("default");
        
            //Creating and adding all the elements to the web page
            var weatherEl = document.createElement("div");
            weatherEl.classList = "col weather-display";
            weatherEl.id = "weather-displayed"
            weatherEl.textContent = weatherData[i];

            var dateEl = document.createElement("span");
            dateEl.classList = "row text-left";
            dateEl.textContent = currentDate;
            weatherEl.append(dateEl);

            var tempEl = document.createElement("span");
            tempEl.classList = "row text-left";
            tempEl.textContent = "Temp: " + weatherData.list[i].main.temp;
            weatherEl.append(tempEl);

            var windEl = document.createElement("span");
            windEl.classList = "row text-left";
            windEl.textContent = "Wind Speed: " + weatherData.list[i].wind.speed;
            weatherEl.append(windEl);

            var humidityEl = document.createElement("span");
            humidityEl.classList = "row text-left";
            humidityEl.textContent = "Humidity: " + weatherData.list[i].main.humidity;
            weatherEl.append(humidityEl);

            weatherDisplayElement.append(weatherEl);
        }
    }
    if (submitTextAreaElement.value == ""){
        searchedCityElement.textContent = "Showing Weather For: " + currentCity;
        localStorage.setItem("previousCity", JSON.stringify(currentCity));
    } else {
        searchedCityElement.textContent = "Showing Weather For: " + submitTextAreaElement.value;
        localStorage.setItem("previousCity", JSON.stringify(submitTextAreaElement.value));
        
    }
    
}

//Getting the data after the submission form button is clicked
function getWeatherData(event){
    event.preventDefault();
    apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q="+submitTextAreaElement.value+"&units=metric&appid=906a158a504520ea456e7b72ed30fe74"

    fetch(apiUrl)
        .then(function (response) {
        if (response.ok) {
            response.json().then(function (weatherData) {
                console.log(weatherData);
                displayWeather(weatherData);
            });
        } else {
            alert("Error: " + response.statusText);
        }
        })
        .catch(function (error) {
            alert("Unable to connect to OpenWeather");
        });

}

//Initialize the web page and set up the event listener on the submit form button
init();
submitFormElement.addEventListener("click", getWeatherData);