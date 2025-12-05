// Music player functionality
const audio = document.getElementById("audioPlayer");
const playButton = document.getElementById("playButton");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const progressBar = document.getElementById("progressBar");
const progressContainer = document.getElementById("progressContainer");
const currentTimeDisplay = document.getElementById("currentTime");
const totalTimeDisplay = document.getElementById("totalTime");
const playlist = document.getElementById("playlist");
const playlistItems = document.querySelectorAll(".playlist-item");
let currentTrackIndex = 0;

let played = false;

// Play/Pause functionality
playButton.addEventListener("click", togglePlay);

function togglePlay() {
  if (audio.paused) {
    if (!played) {
      played = true;
      currentTrackIndex = -1;
      playNext();
    }
    audio.play();
    playButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
  } else {
    audio.pause();
    playButton.innerHTML = '<i class="fa-solid fa-play"></i>';
  }
}

// Playlist functionality
playlistItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    // played = true;
    currentTrackIndex = index;
    loadTrack(item.dataset.src);
    playlistItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
  });
});

function loadTrack(src) {
  played = true;
  audio.src = src;
  audio.load();
  playButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
  audio.play();
}

// Previous and Next buttons
prevButton.addEventListener("click", playPrevious);
nextButton.addEventListener("click", playNext);

function playPrevious() {
  currentTrackIndex =
    (currentTrackIndex - 1 + playlistItems.length) % playlistItems.length;
  loadTrack(playlistItems[currentTrackIndex].dataset.src);
  playlistItems.forEach((i) => i.classList.remove("active"));
  playlistItems[currentTrackIndex].classList.add("active");
}

function playNext() {
  currentTrackIndex = (currentTrackIndex + 1) % playlistItems.length;
  loadTrack(playlistItems[currentTrackIndex].dataset.src);
  playlistItems.forEach((i) => i.classList.remove("active"));
  playlistItems[currentTrackIndex].classList.add("active");
}

// Progress bar functionality
audio.addEventListener("timeupdate", updateProgress);
progressContainer.addEventListener("click", setProgress);

function updateProgress() {
  const percent = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = `${percent}%`;

  currentTimeDisplay.textContent = formatTime(audio.currentTime);
  totalTimeDisplay.textContent = formatTime(audio.duration);
}

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
}

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// Auto-play next track when current track ends
audio.addEventListener("ended", playNext);
