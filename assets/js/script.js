var textBlockEl = $(".time-block");
var dayDisplayEl = $("#day-display");
var submitBtn = $("#submit");
var historyEl = $("#history-container");
var history = [];

// Variable for modal.
var modal = document.getElementById("myModal");
// Variable for modal button.
var btn = document.getElementById("clear-history");
// Variable for the appropriate element that closes the modal.
var span = document.getElementsByClassName("confirmNoBtn")[0];
// Variable for the appropriate element that clears the local storage.
var clear = document.getElementsByClassName("confirmYesBtn")[0];

$(document).ready(function () {
  // Function to display the current time through day.js API.
  displayDay();
  function displayDay() {
    var currentTime = dayjs().format("MMM DD, YYYY [at] hh:mm:ss a");
    dayDisplayEl.text(currentTime);
  }
  setInterval(displayDay, 1000); // Interval to properly countdown the time.

  function receiveData() {
    var city = JSON.parse(localStorage.getItem("city"));
    console.log(city);
    var apiKey = "9fd400a4835f3cb9983a527ae1c32bd9";
    var queryURL =
      "http://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=" +
      apiKey;

    fetch(queryURL)
      .then((response) => response.json())
      .then((results) => {
        const temperature = results.main.temp;
        const windSpeed = results.wind.speed;
        const humidity = results.main.humidity;
        console.log("temperature: " + temperature);
        console.log("wind speed: " + windSpeed);
        console.log("humidity: " + humidity);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  searchHistory();
  function searchHistory() {
    var storedCity = JSON.parse(localStorage.getItem("city"));
    const historyBtn = document.createElement("button");
    historyBtn.setAttribute("id", "history");
    historyBtn.innerText = storedCity;
    document.body.appendChild(historyBtn);
    document.getElementById("history-container").appendChild(historyBtn);
  }

  $("#submit").on("click", function (event) {
    event.preventDefault();
    var history = [];

    searchedCity = $("#search-text").val().trim().toUpperCase();
    history.push(searchedCity);

    localStorage.setItem("city", JSON.stringify(history));
    receiveData();
  });
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
