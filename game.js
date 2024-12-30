// Variables
let workDuration = 25; // Default work duration
let breakDuration = 5; // Default break duration
let isWorkSession = true; // Track session type (Work or Break)
let timer = null; // Variable for the interval

const timeDisplay = document.getElementById('time');
const startButton = document.getElementById('start-btn');
const resetButton = document.getElementById('reset-btn');
const workInput = document.getElementById('work-duration');
const breakInput = document.getElementById('break-duration');
const sessionLabel = document.getElementById('session-label'); // New element for session type
const quoteDisplay = document.getElementById('quote');
const percentageDisplay = document.getElementById('percentage'); // Element for percentage display
const progressBar = document.getElementById('progress-bar'); // Progress bar element

// Prevent multiple timers from running
let isTimerRunning = false;

// Sound to play when the timer ends (Ensure the correct sound URL is used)
const ringtone = new Audio('music.mp3'); // Replace with your preferred sound URL
ringtone.load(); // Preload sound to prevent delay when played

// Validate and sanitize input when the user finishes typing
function validateAndSetInput(inputField, defaultValue, callback) {
  inputField.addEventListener('blur', () => {
    let value = parseInt(inputField.value); // Convert input to integer
    if (isNaN(value) || value <= 0) {
      value = defaultValue; // Revert to default if invalid
    }
    inputField.value = value; // Ensure valid integer is displayed
    callback(value); // Update the corresponding variable
  });
}

// Apply validation for work and break inputs
validateAndSetInput(workInput, 25, (value) => {
  if (!isTimerRunning) {
    workDuration = value;
    resetTimer();
  }
});

validateAndSetInput(breakInput, 5, (value) => {
  if (!isTimerRunning) {
    breakDuration = value;
    resetTimer();
  }
});

// Start Timer
startButton.addEventListener('click', () => {
  if (!isTimerRunning) {
    isTimerRunning = true;
    startTimer();
    startButton.disabled = true; // Disable the "Start" button
  }
});

// Reset Timer
resetButton.addEventListener('click', () => {
  clearInterval(timer);
  isTimerRunning = false;
  startButton.disabled = false; // Re-enable the "Start" button
  resetTimer();
});

// Load random motivational quote
const quotes = [
  "Stay focused and never give up!",
  "Success is built on consistency.",
  "Take breaks, but never quit.",
  "Hard work always pays off!",
];

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteDisplay.textContent = quotes[randomIndex];
}

// Function to play sound when timer ends
function playSound() {
  ringtone.play()
    .catch((error) => {
      console.error("Error playing sound:", error);
    });
}

// Start Timer Function
function startTimer() {
  const totalDuration = isWorkSession ? workDuration * 60 : breakDuration * 60; // Total time in seconds
  let remainingTime = totalDuration;

  sessionLabel.textContent = isWorkSession ? "Focus Time" : "Rest Time"; // Update session label
  percentageDisplay.textContent = "0% completed"; // Reset percentage
  progressBar.style.width = "0%"; // Reset progress bar

  timer = setInterval(() => {
    if (remainingTime > 0) {
      remainingTime--;

      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      // Update progress bar and percentage
      const progressPercentage = Math.round(((totalDuration - remainingTime) / totalDuration) * 100);
      percentageDisplay.textContent = `${progressPercentage}% completed`;
      progressBar.style.width = `${progressPercentage}%`;

    } else {
      clearInterval(timer);
      playSound(); // Play sound when timer ends
      isTimerRunning = false;
      startButton.disabled = false; // Re-enable the "Start" button
      progressBar.style.width = "0%"; // Reset progress bar for the next session

      isWorkSession = !isWorkSession; // Toggle session type

      // Alert the user and start the next session automatically
      setTimeout(() => {
        if (isWorkSession) {
          alert("Break over! Time to work.");
        } else {
          alert("Work done! Take a break.");
        }
        resetTimer();
        startTimer(); // Automatically start the next session
      }, 1000); // Delay session change by 1 second
    }
  }, 1000);
}

// Reset Timer Function
function resetTimer() {
  clearInterval(timer); // Clear any existing timer
  isTimerRunning = false; // Reset running state
  startButton.disabled = false; // Enable the start button
  sessionLabel.textContent = isWorkSession ? "Focus Time" : "Rest Time"; // Reset session label
  percentageDisplay.textContent = ""; // Clear percentage display
  progressBar.style.width = "0%"; // Reset progress bar
  timeDisplay.textContent = `${isWorkSession ? workDuration : breakDuration}:00`;
}

// Initial Setup
resetTimer();
showRandomQuote();
