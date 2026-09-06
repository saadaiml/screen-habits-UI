// 1. This is the ONE line you change after deploying your backend to Render.
//    Right now it points to your own computer, for local testing.
const API_URL = "http://127.0.0.1:8000/predict";

// 2. Grab references to the parts of the page we need to work with.
const form = document.getElementById("habitsForm");
const submitBtn = document.getElementById("submitBtn");
const resultBox = document.getElementById("result");

// 3. Listen for the form being submitted.
form.addEventListener("submit", async function (event) {
  event.preventDefault(); // stop the page from refreshing (the browser's default behavior)

  // 4. Build the payload — an object matching the exact field names
  //    the FastAPI backend's UserData model expects.
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

  // 5. Show a loading state so the button doesn't look broken while waiting.
  submitBtn.disabled = true;
  submitBtn.textContent = "Checking...";
  resultBox.hidden = true;

  try {
    // 6. Send the actual request to the backend.
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    // 7. If the backend rejected the request (bad data, server error), stop here.
    if (!response.ok) {
      throw new Error("The server couldn't process this request.");
    }

    // 8. Parse the JSON response the backend sent back.
    const data = await response.json();

    // 9. Turn the raw numbers into a friendly message.
    const percent = Math.round(data.probability_of_1 * 100);
    const isFlagged = data.prediction === 1;

    resultBox.className = "result" + (isFlagged ? " flag" : "");
    resultBox.innerHTML = isFlagged
      ? `<h2>Worth paying attention to</h2><p>Your answers are similar to patterns linked with heavier screen dependence (about ${percent}% likelihood). Consider small changes to your daily routine.</p>`
      : `<h2>Looks fairly balanced</h2><p>Your answers don't show strong signs of screen dependence (about ${percent}% likelihood). Keep an eye on it if things change.</p>`;

  } catch (err) {
    // 10. If anything went wrong (network issue, server down, etc.), show it plainly.
    resultBox.className = "result error";
    resultBox.innerHTML = `<h2>Something went wrong</h2><p>${err.message}</p>`;
  } finally {
    // 11. Always restore the button, whether it succeeded or failed.
    submitBtn.disabled = false;
    submitBtn.textContent = "Check my result";
    resultBox.hidden = false;
  }
});
