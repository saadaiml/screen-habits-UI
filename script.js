// 1. Your live Railway backend.
const API_URL = "https://screen-habits-api-production.up.railway.app/predict";

// 2. Grab references to the parts of the page we need.
const form = document.getElementById("habitsForm");
const submitBtn = document.getElementById("submitBtn");
const resultBox = document.getElementById("result");

// 3. Listen for the form being submitted.
form.addEventListener("submit", async function (event) {
  event.preventDefault(); // stop the page from refreshing

  // 4. Build the payload. Each dropdown's <option value="..."> already
  //    holds the NUMBER we want (the midpoint of the range the user picked) —
  //    see index.html, e.g. "6 to 8 hrs" has value="7".
  const payload = {
    age: Number(document.getElementById("age").value),
    daily_screen_time_hours: Number(document.getElementById("daily_screen_time_hours").value),
    social_media_hours: Number(document.getElementById("social_media_hours").value),
    gaming_hours: Number(document.getElementById("gaming_hours").value),
    work_study_hours: Number(document.getElementById("work_study_hours").value),
    sleep_hours: Number(document.getElementById("sleep_hours").value),
    notifications_per_day: Number(document.getElementById("notifications_per_day").value),
    app_opens_per_day: Number(document.getElementById("app_opens_per_day").value),
    weekend_screen_time: Number(document.getElementById("weekend_screen_time").value),
    gender: document.getElementById("gender").value,
    stress_level: document.getElementById("stress_level").value,
    academic_work_impact: document.getElementById("academic_work_impact").value
  };

  // 5. Show a loading state.
  submitBtn.disabled = true;
  submitBtn.textContent = "Predicting...";
  resultBox.hidden = true;

  try {
    // 6. Send the request to the backend.
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("The server couldn't process this request.");
    }

    const data = await response.json();

    // 7. Match the Streamlit style: a colored banner, checkmark/warning icon,
    //    and a bolded confidence percentage.
    const isFlagged = data.prediction === 1;
    const confidence = isFlagged
      ? (data.probability_of_1 * 100).toFixed(1)
      : ((1 - data.probability_of_1) * 100).toFixed(1);

    resultBox.className = "result " + (isFlagged ? "bad" : "good");
    resultBox.innerHTML = isFlagged
      ? `<span class="icon">⚠️</span> Higher addiction risk — <strong>confidence: ${confidence}%</strong>`
      : `<span class="icon">✅</span> Lower addiction risk — <strong>confidence: ${confidence}%</strong>`;

  } catch (err) {
    resultBox.className = "result bad";
    resultBox.innerHTML = `<span class="icon">⚠️</span> ${err.message}`;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Predict risk";
    resultBox.hidden = false;
  }
});
