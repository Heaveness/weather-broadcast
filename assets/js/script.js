$(document).ready(function () {
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

    function receiveData(city) {
        console.log(city);
        var apiKey = "9fd400a4835f3cb9983a527ae1c32bd9";
        var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&type=like&sort=population&units=metric&appid=" + apiKey;

        fetch(queryURL)
            .then((response) => response.json())
            .then((data) => {
            const temperature = data.main.temp + "°C";
            const windSpeed = (data.wind.speed * 3.6).toFixed(2) + "km/h";
            const humidity = data.main.humidity + "%";
            const weatherIcon = data.weather[0].icon;
            const iconUrl = "http://openweathermap.org/img/w/" + weatherIcon + ".png";
            
            document.getElementById("current-1").innerHTML = city;
            document.getElementById("curTemp").innerHTML = temperature;
            document.getElementById("curWind").innerHTML = windSpeed;
            document.getElementById("curHumid").innerHTML = humidity;
            document.getElementById("curIcon").src = iconUrl;
            document.getElementById("curIcon").style.visibility = 'visible';

            console.log(weatherIcon)
            
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    }

    weatherDate();
    function weatherDate(){
        var currentDay = dayjs().format("DD/MM/YYYY");
        $("#current-day").text(currentDay);

        const forecastDateData = [];

        for (let i = 1; i < 6; i ++) {
            var forecastDate = dayjs().add(i, 'day').format("DD/MM/YYYY");
            forecastDateData.push(forecastDate);

            var forecastDate = document.querySelector(`.future${i}`);
            forecastDate.innerHTML = forecastDateData[i - 1];
        }
    }

    function fiveDayForecast(city){
        var apiKey = "9fd400a4835f3cb9983a527ae1c32bd9";
        var forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&type=like&sort=population&units=metric&appid=" + apiKey;

        const temperatureData = [];
        const windSpeedData = [];
        const humidityData = [];
        const weatherIconData = [];

        fetch(forecastQueryURL)
            .then((response) => response.json())
            .then((data) => {
            const forecastList = data.list;

            for (let i = 1; i < forecastList.length; i += 8) {
                const forecastData = forecastList[i];
                const temperature = forecastData.main.temp + "°C";
                const windSpeed = (forecastData.wind.speed * 3.6).toFixed(2) + "km/h"
                const humidity = forecastData.main.humidity + "%";
                const weatherIcon = "https://openweathermap.org/img/w/" + forecastData.weather[0].icon + ".png";

                temperatureData.push(temperature);
                windSpeedData.push(windSpeed);
                humidityData.push(humidity);
                weatherIconData.push(weatherIcon)

                for (let w = 0; w < windSpeedData.length; w++) {
                    let forecastTemp = document.querySelector(`.futTemp${w + 1}`);
                    let forecastWind = document.querySelector(`.futWind${w + 1}`);
                    let forecastHumid = document.querySelector(`.futHumid${w + 1}`);
                    let forecastIcon = document.querySelector(`.futIcon${w + 1}`);

                    forecastTemp.innerHTML = temperatureData[w];
                    forecastWind.innerHTML = windSpeedData[w];
                    forecastHumid.innerHTML = humidityData[w];
                    forecastIcon.src = weatherIconData[w];
                    forecastIcon.style.visibility = 'visible';
                }
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    }

    var storedCity = JSON.parse(localStorage.getItem("city")) || [];
    searchHistory();

    function searchHistory() {
        $("#history-container").html("");

        if (storedCity.length === 0) {
            return;
        }

        const addedCities = [];

        for (var i = 0; i < storedCity.length; i++) {
            if (i === 9){
                break;
            }
            if (/^[a-zA-Z\s]+$/.test(storedCity[i])) {
                if(!addedCities.includes(storedCity[i])){
                addedCities.push(storedCity[i]);
                const historyBtn = document.createElement("button");
                historyBtn.setAttribute("id", "history");
                historyBtn.innerText = storedCity[i];
                $("#history-container").append(historyBtn);

                (function (i) {
                    historyBtn.addEventListener("click", function () {
                        receiveData(storedCity[i]); // Pass the city at the captured index as a parameter to receiveData()
                        fiveDayForecast(storedCity[i]);
                    });
                })(i);
            }
            }
        }
    }
        
    var searchedHistory = storedCity;
    $("#submitBtn").click(function (event) {
        event.preventDefault();

        var searchedCity = $("#search-text").val().trim().toUpperCase();
        searchedHistory.push(searchedCity);

        if (!isNaN(searchedCity)) {
            alert("Please enter a valid city name.");
            return;
        }
        else if (searchedCity === "") {
            alert("Please enter a city name.");
            return;
        } 
        else if (!/^[a-zA-Z]*$/.test(searchedCity)){
            alert("Please enter a valid city name.");
            return;
        } else {
            localStorage.setItem("city", JSON.stringify(searchedHistory));
            receiveData(searchedCity);
            fiveDayForecast(searchedCity);
            searchHistory();
        }
    });

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