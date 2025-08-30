const temperatureField = document.querySelector(".temp p");
const locationField = document.querySelector(".time_location p:nth-child(1)");
const timeField = document.querySelector(".time_location p:nth-child(2)");
const conditionField = document.querySelector(".condition p:nth-child(2)");
const searchField = document.querySelector(".search_area");
const form = document.querySelector(".form");
const toggleBtn = document.getElementById("themeToggle");
const errorBox = document.querySelector(".error");


const API_KEY = "c3bab0ce776242169bf65311252008"; 
let target = "Chennai";


form.addEventListener("submit", searchForLocation);

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  toggleBtn.innerText = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

(function initTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.body.classList.add("dark-mode");
    toggleBtn.innerText = "☀️ Light Mode";
  }
})();


async function fetchResults(targetLocation) {
  clearError();
  setLoading(true);
  try {
    const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(targetLocation)}&aqi=no`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Network response was not ok (${res.status})`);
    const data = await res.json();

    if (data.error) {
      throw new Error(data.error.message || "Unknown error");
    }

    const locationName = data.location.name;
    const time = data.location.localtime; // "YYYY-MM-DD HH:MM"
    const temp = data.current.temp_c;
    const condition = data.current.condition.text;

    updateDetails(temp, locationName, time, condition);
  } catch (err) {
    showError(err.message || "Something went wrong. Try another location.");
  } finally {
    setLoading(false);
  }
}

function updateDetails(temp, location, time, condition) {
  const [date, currentTime] = time.split(" ");
  const dayNumber = new Date(date).getDay();
  const dayName = getDayName(dayNumber);

  temperatureField.innerText = `${temp}°C`;
  locationField.innerText = location;
  timeField.innerText = `${currentTime} - ${dayName} ${date}`;
  conditionField.innerText = condition;
}

function searchForLocation(e) {
  e.preventDefault();
  const value = (searchField.value || "").trim();
  if (!value) {
    showError("Please type a location.");
    return;
  }
  fetchResults(value);
}

function getDayName(number) {
  switch (number) {
    case 0: return "Sunday";
    case 1: return "Monday";
    case 2: return "Tuesday";
    case 3: return "Wednesday";
    case 4: return "Thursday";
    case 5: return "Friday";
    case 6: return "Saturday";
    default: return "";
  }
}


function setLoading(isLoading) {
  if (isLoading) {
    temperatureField.innerText = "Loading...";
  }
}


function showError(msg) {
  if (errorBox) errorBox.textContent = msg;
}
function clearError() {
  if (errorBox) errorBox.textContent = "";
}


fetchResults(target);
