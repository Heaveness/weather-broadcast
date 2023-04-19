// Function to make sure code is ready before being loaded.
$(document).ready(function () {
    // Global variable for the current day & time display.
    var dayDisplayEl = $("#day-display");

    // Variable for modal.
    var modal = document.getElementById("myModal");
    // Variable for modal button.
    var btn = document.getElementById("clear-history");
    // Variable for the appropriate element that closes the modal.
    var span = document.getElementsByClassName("confirmNoBtn")[0];
    // Variable for the appropriate element that clears the local storage.
    var clear = document.getElementsByClassName("confirmYesBtn")[0];

    // Function to display the current time through day.js API.
    displayDay();
    function displayDay() {
    var currentTime = dayjs().format("MMM DD, YYYY [at] hh:mm:ss a");
        dayDisplayEl.text(currentTime);
    }
    setInterval(displayDay, 1000); // Interval to properly countdown the time.

    // Function to receive current weather data from user search input.
    function receiveData(city) {
        // OpenWeatherMap API key and URL.
        var apiKey = "9fd400a4835f3cb9983a527ae1c32bd9";
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&type=like&sort=population&units=metric&appid=" + apiKey;

        // Fetch method to call the API.
        fetch(queryURL)
            // Stores it into response.json.
            .then((response) => response.json())
            // Data parameter for usage.
            .then((data) => {
            // Fetched current temperature, wind speed, humidity, & weather icon into variables.
            const temperature = data.main.temp + "°C";
            const windSpeed = (data.wind.speed * 3.6).toFixed(2) + "km/h";
            const humidity = data.main.humidity + "%";
            const weatherIcon = data.weather[0].icon;
            const iconUrl = "https://openweathermap.org/img/w/" + weatherIcon + ".png";
            
            // Displays above variables into respective HTML elements.
            document.getElementById("current-1").innerHTML = city;
            document.getElementById("curTemp").innerHTML = temperature;
            document.getElementById("curWind").innerHTML = windSpeed;
            document.getElementById("curHumid").innerHTML = humidity;
            document.getElementById("curIcon").src = iconUrl;
            document.getElementById("curIcon").style.visibility = 'visible';
        })
        // Catches any error with the API call.
        .catch((error) => {
            console.error("Error:", error);
        });
    }

    // Callback to activate function.
    weatherDate();
    // Function to call the current and future date from day.js for display.
    function weatherDate(){
        // Variable for current date.
        var currentDay = dayjs().format("DD/MM/YYYY");
        $("#current-day").text(currentDay);

        // Array to store the 5-day forecast dates.
        const forecastDateData = [];

        // For loop to cycle up to 5 days.
        for (let i = 1; i < 6; i ++) {
            // Adds 5 days of dates for forecast.
            var forecastDate = dayjs().add(i, 'day').format("DD/MM/YYYY");
            forecastDateData.push(forecastDate);

            // To display those 5 days into respective HTML elements.
            var forecastDate = document.querySelector(`.future${i}`);
            forecastDate.innerHTML = forecastDateData[i - 1];
        }
    }

    // Function to retrieve data for 5-day forecast.
    function fiveDayForecast(city){
        // API key and forecast URL.
        var apiKey = "9fd400a4835f3cb9983a527ae1c32bd9";
        var forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&type=like&sort=population&units=metric&appid=" + apiKey;

        // Empty arrays for push usage.
        const temperatureData = [];
        const windSpeedData = [];
        const humidityData = [];
        const weatherIconData = [];

        // Fetch method for the forecast data.
        fetch(forecastQueryURL)
            .then((response) => response.json())
            .then((data) => {
            // Stores the list of forecast into a variable for easier usage.
            const forecastList = data.list;

            // For loop to cycle through the forecast up to 5 days.
            for (let i = 1; i < forecastList.length; i += 8) {
                // Variables to retrieve temperature, wind speed, humidity, and weather icon for 5 days.
                const forecastData = forecastList[i];
                const temperature = forecastData.main.temp + "°C";
                const windSpeed = (forecastData.wind.speed * 3.6).toFixed(2) + "km/h"
                const humidity = forecastData.main.humidity + "%";
                const weatherIcon = "https://openweathermap.org/img/w/" + forecastData.weather[0].icon + ".png";

                // Pushes above variables into an array for usage.
                temperatureData.push(temperature);
                windSpeedData.push(windSpeed);
                humidityData.push(humidity);
                weatherIconData.push(weatherIcon)

                // For loop to display index values from above array in respective HTML elements.
                for (let w = 0; w < windSpeedData.length; w++) {
                    // Displayed by adding in classes with similar names but varied by numbers from HTML.
                    let forecastTemp = document.querySelector(`.futTemp${w + 1}`);
                    let forecastWind = document.querySelector(`.futWind${w + 1}`);
                    let forecastHumid = document.querySelector(`.futHumid${w + 1}`);
                    let forecastIcon = document.querySelector(`.futIcon${w + 1}`);

                    // Once variables are received then display the 5-day forecast.
                    forecastTemp.innerHTML = temperatureData[w];
                    forecastWind.innerHTML = windSpeedData[w];
                    forecastHumid.innerHTML = humidityData[w];
                    forecastIcon.src = weatherIconData[w];
                    forecastIcon.style.visibility = 'visible';
                }
            }
        })
        // Catch any potential error from the API call.
        .catch((error) => {
            console.error("Error:", error);
        });
    }

    // Variable to retrieve from local storage. If it doesn't exist then an empty array value.
    var storedCity = JSON.parse(localStorage.getItem("city")) || [];
    // Callback to display search history after page load.
    searchHistory();

    // Function to display search history from user input.
    function searchHistory() {
        // Empties anything in HTML element before usage.
        $("#history-container").html("");

        // If statement to prevent function running past this if search history is empty.
        if (storedCity.length === 0) {
            return;
        }

        // Empty array for searched cities to be pushed into.
        const addedCities = [];

        // For loop to cycle through local storage to display history.
        for (var i = 0; i < storedCity.length; i++) {
            // If statement to set a limit of history to 10.
            if (i === 11){
                break;
            }
            // Pushes searched cities into an array.
            addedCities.push(storedCity[i]);
            // Variable to create buttons.
            const historyBtn = document.createElement("button");
            // Sets attributes for the button.
            historyBtn.setAttribute("id", "history");
            // Displays searched city name into the buttons.
            historyBtn.innerText = storedCity[i];
            // Appends buttons to respective HTML element.
            $("#history-container").append(historyBtn);

            // Function to store corresponding data based on city into a button to call respective functions.
            (function (i) {
                historyBtn.addEventListener("click", function () {
                    receiveData(storedCity[i]);
                    fiveDayForecast(storedCity[i]);
                });
            })(i);
        }
    }

    // Function for the search button under search text box.
    $("#submitBtn").click(function (event) {
        event.preventDefault();
        searchCity();
    });
    
    // Function for user accessibility when user presses enter for search.
    $("#search-text").on("keydown", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            searchCity();
        }
    });

    // Variable for storing searched city.
    var searchedHistory = storedCity;
    // Function to search the city name value to respective functions for usage.
    function searchCity() {
        // Variable to gets the changed value in search text HTML element.
        var searchedCity = $("#search-text").val().trim().toUpperCase();

        // API key and url.
        var apiKey = "9fd400a4835f3cb9983a527ae1c32bd9";
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchedCity + "&type=like&sort=population&units=metric&appid=" + apiKey;

        // Fetch method for checking valid city names to prevent issues.
        fetch(queryURL)
            .then((response) => response.json())
            .then((data) => {
                // If statement for searched city is not found(error 404) then it stops function from running past this line.
                if (data.cod === "404"){
                    document.getElementById("warning-text").innerHTML = "City not found. Please enter a valid city name.";
                    return;
                }
                // Else if statement if user doesn't input anything but presses submit or enter.
                else if (searchedCity === "") {
                    document.getElementById("warning-text").innerHTML = "Please enter a city name...";
                    return;
                } 
                // Else if statement for searched city already existed in search history to prevent button duplication, but still runs respective function.
                else if (storedCity.includes(searchedCity)) {
                    document.getElementById("warning-text").innerHTML = "City already exists in search history.";
                    receiveData(searchedCity);
                    fiveDayForecast(searchedCity);
                }
                // Else statement for newly searched city to be pushed into local storage and used in respective functions.
                else {
                    // Removes any prior warning texts.
                    document.getElementById("warning-text").innerHTML = "";
                    searchedHistory.push(searchedCity);
                    // Pushed into local storage.
                    localStorage.setItem("city", JSON.stringify(searchedHistory));
                    receiveData(searchedCity);
                    fiveDayForecast(searchedCity);
                    searchHistory();
                }
            })
            // Catches any potential error in API call.
            .catch((error) => {
                console.error("Error:", error);
            })
    }

    // Onclick function when the user clicks the button, opens the modal.
    btn.onclick = function () {
        modal.style.display = "block";
    };

    // Onclick function when the user clicks on No button, closes the modal.
    span.onclick = function () {
        modal.style.display = "none";
    };

    // Onclick function when the user clicks anywhere outside of the modal, closes the modal.
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    // Onclick function when the user clicks on Yes button. It closes the modal then clears the local storage and reload the page.
    clear.onclick = function () {
        modal.style.display = "none";
        localStorage.clear();
        window.location.reload();
    };
});