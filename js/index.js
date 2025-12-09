//

let zIndex = 1;

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  elmnt
    .querySelector(".window-header")
    .addEventListener("mousedown", dragMouseDown);
  elmnt
    .querySelector(".window-header")
    .addEventListener("touchstart", dragMouseDown);

  function dragMouseDown(e) {
    e.preventDefault();
    pos3 = e.clientX || e.touches[0].clientX;
    pos4 = e.clientY || e.touches[0].clientY;
    document.addEventListener("mouseup", closeDragElement);
    document.addEventListener("touchend", closeDragElement);
    document.addEventListener("mousemove", elementDrag);
    document.addEventListener("touchmove", elementDrag);

    elmnt.style.zIndex = ++zIndex;
  }

  function elementDrag(e) {
    e.preventDefault();
    pos1 = pos3 - (e.clientX || e.touches[0].clientX);
    pos2 = pos4 - (e.clientY || e.touches[0].clientY);
    pos3 = e.clientX || e.touches[0].clientX;
    pos4 = e.clientY || e.touches[0].clientY;

    var newTop = elmnt.offsetTop - pos2;
    var newLeft = elmnt.offsetLeft - pos1;

    var maxX = window.innerWidth - elmnt.offsetWidth;
    var maxY = window.innerHeight - elmnt.offsetHeight;

    newTop = Math.max(0, Math.min(newTop, maxY));
    newLeft = Math.max(0, Math.min(newLeft, maxX));

    elmnt.style.top = newTop + "px";
    elmnt.style.left = newLeft + "px";
  }

  function closeDragElement() {
    document.removeEventListener("mouseup", closeDragElement);
    document.removeEventListener("touchend", closeDragElement);
    document.removeEventListener("mousemove", elementDrag);
    document.removeEventListener("touchmove", elementDrag);
  }
}

// function setupWindowControls(window) {
//   const minimizeBtn = window.querySelector(".minimize-btn");
//   const maximizeBtn = window.querySelector(".maximize-btn");
//   const closeBtn = window.querySelector(".close-btn");
//   const content = window.querySelector(".window-content");

//   minimizeBtn.addEventListener("click", function () {
//     this.style.animation = "bounce 0.3s";
//     setTimeout(() => (this.style.animation = ""), 300);
//   });

//   maximizeBtn.addEventListener("click", function () {
//     this.style.animation = "bounce 0.3s";
//     setTimeout(() => (this.style.animation = ""), 300);
//   });

//   closeBtn.addEventListener("click", function () {
//     this.style.animation = "bounce 0.3s";
//     setTimeout(() => (this.style.animation = ""), 300);
//   });
// }

function animateTyping(element, text, speed) {
  let i = 0;
  function typing() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    }
  }
  typing();
}

document.addEventListener("DOMContentLoaded", function () {
  var windows = document.getElementsByClassName("window");
  for (var i = 0; i < windows.length; i++) {
    dragElement(windows[i]);
    setupWindowControls(windows[i]);
    windows[i].style.zIndex = ++zIndex;
  }

  const notepadContent = document.getElementById("notepadContent");
  const notepadText =
    "Hello!\nMy name is Elan Rubin, and I'm a computer science student at Drexel University.\nMy interests lie in the intersection between technology and art.";
  animateTyping(notepadContent, notepadText, 25);
});

function appendToDisplay(value) {
  document.getElementById("display").value += value;
}

function clearDisplay() {
  document.getElementById("display").value = "";
}

function calculate() {
  const display = document.getElementById("display");
  display.value = "I ❤ elanrubin.com";
  display.classList.add("flash");

  let flashCount = 0;
  const flashInterval = setInterval(() => {
    flashCount++;
    if (flashCount >= 1) {
      clearInterval(flashInterval);
      display.classList.remove("flash");
      setTimeout(clearDisplay, 500);
    }
  }, 1000);
}

document.addEventListener("DOMContentLoaded", function () {
  const slider = document.querySelector(".slider"); // Select the slider container
  const slides = document.querySelectorAll(".slider img"); // Select all slides (images)
  const slideCount = slides.length; // Number of slides
  const interval = 2000; // Time for each slide transition in milliseconds (3 seconds)

  let currentIndex = 0; // Index of the current slide
  let startX = 0; // Starting x coordinate for touch
  let endX = 0; // Ending x coordinate for touch

  function goToSlide(index) {
    const offset = slides[0].clientWidth * index; // Calculate the offset based on slide width
    slider.style.transform = `translateX(-${offset}px)`; // Apply the translation to show the correct slide
    currentIndex = index; // Update the current slide index
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slideCount; // Move to the next slide, wrap around if needed
    goToSlide(currentIndex); // Show the next slide
  }

  function previousSlide() {
    currentIndex = (currentIndex - 1 + slideCount) % slideCount; // Move to the previous slide, wrap around if needed
    goToSlide(currentIndex); // Show the previous slide
  }

  // Automatically transition to the next slide every few seconds
  setInterval(nextSlide, interval);

  // Optional: Add click event listeners for navigation dots
  const navLinks = document.querySelectorAll(".slider-nav a"); // Select all navigation dots
  navLinks.forEach((link, index) => {
    link.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent the default anchor behavior
      goToSlide(index); // Show the slide corresponding to the clicked dot
    });
  });

  // Swipe handling
  slider.addEventListener("touchstart", function (event) {
    startX = event.touches[0].clientX; // Store the starting x coordinate
  });

  slider.addEventListener("touchend", function (event) {
    endX = event.changedTouches[0].clientX; // Store the ending x coordinate
    const diffX = endX - startX; // Calculate the difference
    if (Math.abs(diffX) > 50) {
      // If the swipe is significant
      if (diffX > 0) {
        previousSlide(); // Swipe right, go to the previous slide
      } else {
        nextSlide(); // Swipe left, go to the next slide
      }
    }
  });
});

//app icon code - data-driven grid system

// Grid configuration - square cells matching app icon size
const GRID_CONFIG = {
  cellWidth: 6, // rem - matches .app-icon width
  cellHeight: 6, // rem - square cells (app icon is 4rem, centered in 6rem)
  cols: 0, // will be calculated
  rows: 0, // will be calculated
};

// App data - will be loaded from JSON
let APP_DATA = [];

// Window data - will be loaded from JSON
let WINDOW_DATA = [];

let draggedApp = null;
let dragStartX = 0;
let dragStartY = 0;
let isDraggingApp = false;

// Load app data from JSON
async function loadAppData() {
  try {
    const response = await fetch("/data/apps.json");
    APP_DATA = await response.json();
    return APP_DATA;
  } catch (error) {
    console.error("Error loading app data:", error);
    return [];
  }
}

// Load window data from JSON
async function loadWindowData() {
  try {
    const response = await fetch("/data/windows.json");
    WINDOW_DATA = await response.json();
    return WINDOW_DATA;
  } catch (error) {
    console.error("Error loading window data:", error);
    return [];
  }
}

function calculateGridDimensions() {
  const container = document.getElementById("appIconsContainer");
  const rect = container.getBoundingClientRect();
  const remSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

  // Account for 1rem padding on all sides (2rem total width/height)
  const paddingTotal = 2 * remSize;
  const usableWidth = rect.width - paddingTotal;
  const usableHeight = rect.height - paddingTotal;

  GRID_CONFIG.cols = Math.floor(usableWidth / (GRID_CONFIG.cellWidth * remSize));
  GRID_CONFIG.rows = Math.floor(usableHeight / (GRID_CONFIG.cellHeight * remSize));
}

function gridToPixels(gridX, gridY) {
  const remSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const container = document.getElementById("appIconsContainer");
  const rect = container.getBoundingClientRect();

  // Account for 1rem padding on all sides
  const paddingTotal = 2 * remSize;
  const usableHeight = rect.height - paddingTotal;

  // Bottom-left origin: (0,0) is at bottom-left corner
  // Y increases upward, so we need to flip it for screen coordinates
  // Icon (4rem) is centered in 6rem cell, so icon top is at cell_bottom + 1rem (padding) + icon_half (2rem)
  // Icon top in grid coords: gridY * 6rem + 3rem + 2rem = gridY * 6rem + 5rem from bottom
  // Convert to screen coords: containerHeight - (gridY * 6rem + 5rem)
  return {
    x: gridX * GRID_CONFIG.cellWidth * remSize,
    y: usableHeight - gridY * GRID_CONFIG.cellHeight * remSize - 5 * remSize,
  };
}

function pixelsToGrid(x, y) {
  const remSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const container = document.getElementById("appIconsContainer");
  const containerRect = container.getBoundingClientRect();

  // Account for 1rem padding on all sides
  const paddingTotal = 2 * remSize;
  const usableHeight = containerRect.height - paddingTotal;

  // Convert screen Y to bottom-left origin (Y increases upward from bottom)
  const flippedY = usableHeight - y;

  return {
    gridX: Math.floor(x / (GRID_CONFIG.cellWidth * remSize)),
    gridY: Math.floor(flippedY / (GRID_CONFIG.cellHeight * remSize)),
  };
}

function isGridOccupied(gridX, gridY, excludeAppId) {
  return APP_DATA.some(
    (app) => app.id !== excludeAppId && app.gridX === gridX && app.gridY === gridY,
  );
}

function renderGrid(showAvailability = false) {
  const grid = document.getElementById("desktopGrid");
  const container = document.getElementById("appIconsContainer");
  const rect = container.getBoundingClientRect();
  const remSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const cellWidth = GRID_CONFIG.cellWidth * remSize;
  const cellHeight = GRID_CONFIG.cellHeight * remSize;

  // Account for 1rem padding on all sides
  const paddingTotal = 2 * remSize;
  const usableWidth = rect.width - paddingTotal;
  const usableHeight = rect.height - paddingTotal;

  // Create SVG grid
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);

  // Draw vertical grid lines (left to right)
  for (let x = 0; x <= GRID_CONFIG.cols; x++) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x * cellWidth);
    line.setAttribute("y1", 0);
    line.setAttribute("x2", x * cellWidth);
    line.setAttribute("y2", usableHeight);
    line.setAttribute("stroke", "rgba(255, 255, 255, 0.2)");
    line.setAttribute("stroke-width", "1");
    svg.appendChild(line);
  }

  // Draw horizontal grid lines (bottom to top, aligned with grid cells)
  for (let y = 0; y <= GRID_CONFIG.rows; y++) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", 0);
    line.setAttribute("y1", usableHeight - y * cellHeight);
    line.setAttribute("x2", usableWidth);
    line.setAttribute("y2", usableHeight - y * cellHeight);
    line.setAttribute("stroke", "rgba(255, 255, 255, 0.2)");
    line.setAttribute("stroke-width", "1");
    svg.appendChild(line);
  }

  // Show availability indicators when dragging
  if (showAvailability) {
    const excludeId = draggedApp ? draggedApp.dataset.appId : null;

    for (let y = 0; y < GRID_CONFIG.rows; y++) {
      for (let x = 0; x < GRID_CONFIG.cols; x++) {
        const isOccupied = isGridOccupied(x, y, excludeId);

        // Position dot/X at the center of where the icon will be
        // Icon (4rem) is centered in 6rem cell
        // Icon center in grid coords (bottom-left origin): x * 6rem + 3rem, y * 6rem + 3rem
        // Convert to screen coords (top-left origin):
        const centerX = x * cellWidth + cellWidth / 2;
        const centerY = usableHeight - (y * cellHeight + cellHeight / 2);

        if (isOccupied) {
          // Draw X for occupied cells
          const size = 8;
          const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line1.setAttribute("x1", centerX - size);
          line1.setAttribute("y1", centerY - size);
          line1.setAttribute("x2", centerX + size);
          line1.setAttribute("y2", centerY + size);
          line1.setAttribute("stroke", "rgba(255, 100, 100, 0.6)");
          line1.setAttribute("stroke-width", "2");
          svg.appendChild(line1);

          const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line2.setAttribute("x1", centerX + size);
          line2.setAttribute("y1", centerY - size);
          line2.setAttribute("x2", centerX - size);
          line2.setAttribute("y2", centerY + size);
          line2.setAttribute("stroke", "rgba(255, 100, 100, 0.6)");
          line2.setAttribute("stroke-width", "2");
          svg.appendChild(line2);
        } else {
          // Draw dot for available cells
          const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          circle.setAttribute("cx", centerX);
          circle.setAttribute("cy", centerY);
          circle.setAttribute("r", "4");
          circle.setAttribute("fill", "rgba(255, 255, 255, 0.5)");
          svg.appendChild(circle);
        }
      }
    }
  }

  grid.innerHTML = "";
  grid.appendChild(svg);
}

function renderApps() {
  const container = document.getElementById("appIconsContainer");
  container.innerHTML = "";

  APP_DATA.forEach((appData) => {
    const appElement = createAppElement(appData);
    container.appendChild(appElement);
    positionApp(appElement, appData);
  });
}

function createAppElement(appData) {
  const appDiv = document.createElement(appData.type === "link" ? "a" : "div");
  appDiv.className = "app-icon";
  appDiv.id = `app-${appData.id}`;
  appDiv.dataset.appId = appData.id;

  if (appData.type === "link") {
    appDiv.href = appData.url;
    appDiv.target = "_blank";
  }

  const icon = document.createElement("i");
  icon.className = appData.icon;
  icon.style.background = appData.iconBg;

  const label = document.createElement("span");
  label.textContent = appData.label;

  appDiv.appendChild(icon);
  appDiv.appendChild(label);

  // Add event listeners
  setupAppEventListeners(appDiv, appData);

  return appDiv;
}

function setupAppEventListeners(appElement, appData) {
  let wasJustDragging = false;

  appElement.addEventListener("mousedown", function (e) {
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    draggedApp = appElement;
    wasJustDragging = false;

    // For links, prevent default immediately to avoid navigation
    if (appData.type === "link") {
      e.preventDefault();
    }

    // Start long press timer
    appElement._longPressTimer = setTimeout(() => {
      startDragging(appElement, e);
      wasJustDragging = true;
    }, 300);
  });

  appElement.addEventListener("click", function (e) {
    // Prevent default for links (handle manually)
    if (appData.type === "link") {
      e.preventDefault();
    }

    // Only handle click if we're not dragging and didn't just finish dragging
    if (!isDraggingApp && !wasJustDragging) {
      handleAppClick(appElement, appData, e);
    }

    // Reset flag after a short delay
    setTimeout(() => {
      wasJustDragging = false;
    }, 100);
  });
}

function startDragging(appElement, e) {
  isDraggingApp = true;
  draggedApp = appElement;
  appElement.classList.add("dragging");
  document.getElementById("desktopGrid").classList.add("visible");
  // Re-render grid with availability indicators
  renderGrid(true);
  e.preventDefault();
}

function stopDragging(appElement, appData) {
  const rect = appElement.getBoundingClientRect();
  const container = document.getElementById("appIconsContainer");
  const containerRect = container.getBoundingClientRect();

  // Get center position relative to container
  const centerX = rect.left - containerRect.left + rect.width / 2;
  const centerY = rect.top - containerRect.top + rect.height / 2;

  let { gridX, gridY } = pixelsToGrid(centerX, centerY);

  // Find nearest unoccupied cell
  let attempts = 0;
  while (isGridOccupied(gridX, gridY, appData.id) && attempts < 100) {
    // Try adjacent cells
    const offsets = [
      [0, -1],
      [1, 0],
      [0, 1],
      [-1, 0],
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
    ];
    let found = false;
    for (const [dx, dy] of offsets) {
      const newX = gridX + dx;
      const newY = gridY + dy;
      if (
        newX >= 0 &&
        newX < GRID_CONFIG.cols &&
        newY >= 0 &&
        newY < GRID_CONFIG.rows &&
        !isGridOccupied(newX, newY, appData.id)
      ) {
        gridX = newX;
        gridY = newY;
        found = true;
        break;
      }
    }
    if (!found) break;
    attempts++;
  }

  // Update app data
  appData.gridX = gridX;
  appData.gridY = gridY;

  // Snap to grid
  positionApp(appElement, appData);

  appElement.classList.remove("dragging");
  document.getElementById("desktopGrid").classList.remove("visible");
  // Reset grid to normal (without availability indicators)
  renderGrid(false);
  isDraggingApp = false;
  draggedApp = null;
}

function positionApp(appElement, appData) {
  const pos = gridToPixels(appData.gridX, appData.gridY);
  appElement.style.left = `${pos.x}px`;
  appElement.style.top = `${pos.y}px`;
}

function handleAppClick(appElement, appData, e) {
  if (appData.type === "link") {
    e.preventDefault();
    window.open(appData.url, "_blank");
    addTerminalCommand(`visit ${appData.label.toLowerCase()}`);
  } else if (appData.type === "desktop") {
    toggleWindow(appData.window);
  } else if (appData.type === "resume") {
    e.preventDefault();
    if (!windowStates["Resume"]) {
      toggleWindow("Resume");
    }
  } else if (appData.type === "email") {
    e.preventDefault();
    window.open(
      "mailto:edr53@drexel.edu?subject=Hello%20Elan!&body=I%20love%20your%20website%20and%20am%20interested%20in%20hiring%20you.%0ASincerely%2C%0A%5BYour%20Name%5D",
    );
  }
}

// Global mouse event handlers for dragging
document.addEventListener("mousemove", function (e) {
  if (isDraggingApp && draggedApp) {
    e.preventDefault();
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;

    draggedApp.style.left = `${parseFloat(draggedApp.style.left) + dx}px`;
    draggedApp.style.top = `${parseFloat(draggedApp.style.top) + dy}px`;

    dragStartX = e.clientX;
    dragStartY = e.clientY;
  } else if (draggedApp && !isDraggingApp) {
    // If mouse moves during long press, cancel it
    const moveThreshold = 5;
    if (
      Math.abs(e.clientX - dragStartX) > moveThreshold ||
      Math.abs(e.clientY - dragStartY) > moveThreshold
    ) {
      if (draggedApp._longPressTimer) {
        clearTimeout(draggedApp._longPressTimer);
      }
    }
  }
});

document.addEventListener("mouseup", function (e) {
  if (draggedApp && draggedApp._longPressTimer) {
    clearTimeout(draggedApp._longPressTimer);
  }

  if (isDraggingApp && draggedApp) {
    // Find the app data
    const appId = draggedApp.dataset.appId;
    const appData = APP_DATA.find((app) => app.id === appId);
    if (appData) {
      stopDragging(draggedApp, appData);
    }
    e.preventDefault();
    e.stopPropagation();
  } else {
    // Reset draggedApp if we're not dragging
    draggedApp = null;
  }
});

// Initialize grid system and windows
document.addEventListener("DOMContentLoaded", async function () {
  // Load app data and window data from JSON first
  await loadAppData();
  await loadWindowData();

  // Initialize windows with positions and states
  initializeWindows();

  calculateGridDimensions();
  renderGrid();
  renderApps();

  // Recalculate on window resize
  window.addEventListener("resize", function () {
    calculateGridDimensions();
    renderGrid();
    renderApps();
  });
});

//update the time and volume

function updateTime() {
  try {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    const timeString = `${hours}:${minutes} ${ampm}`;
    document.getElementById("timeDisplay").textContent = timeString;
  } catch (error) {
    console.error("issue with updating time", error);
  }
}

// Store window states (will be populated from JSON)
let windowStates = {};

// Initialize windows from JSON data
function initializeWindows() {
  WINDOW_DATA.forEach((windowData) => {
    const windowElement = findWindowByTitle(windowData.title);
    if (windowElement) {
      // Set position
      windowElement.style.top = windowData.position.top;
      windowElement.style.left = windowData.position.left;

      // Set initial visibility
      windowStates[windowData.title] = windowData.isOpen;
      windowElement.style.display = windowData.isOpen ? "block" : "none";
    }
  });
}

// Load the resume PDF into the object viewer
async function loadResumePDF() {
  const resumeViewer = document.getElementById("resumeViewer");
  const downloadLink = document.getElementById("resumeDownloadLink");
  if (!resumeViewer || resumeViewer.data) return; // Already loaded

  try {
    // Fetch the directory listing as HTML
    const response = await fetch("pdf/resume/");
    const html = await response.text();

    // Parse HTML to find PDF files
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const links = doc.querySelectorAll("a");

    // Find first PDF file
    let pdfPath = null;
    for (const link of links) {
      const href = link.getAttribute("href");
      if (href && href.toLowerCase().endsWith(".pdf")) {
        pdfPath = href;
        break;
      }
    }

    if (pdfPath) {
      // Decode the URL-encoded path and extract just the filename
      const decodedPath = decodeURIComponent(pdfPath);
      // Get the filename from the path (handles both / and \ separators)
      const filename = decodedPath.split(/[/\\]/).pop();
      const resumePath = `pdf/resume/${filename}`;

      // Set the object data attribute to load the PDF
      resumeViewer.data = resumePath;

      // Set the download link href
      if (downloadLink) {
        downloadLink.href = resumePath;
        downloadLink.download = filename;
      }
    } else {
      console.error("No PDF found in resume folder");
    }
  } catch (error) {
    console.error("Error loading resume:", error);
  }
}

async function toggleWindow(windowName) {
  const windowElement = findWindowByTitle(windowName);
  if (windowElement) {
    windowStates[windowName] = !windowStates[windowName];
    if (windowStates[windowName]) {
      windowElement.style.display = "block";
      windowElement.style.animation = "openWindow 0.3s";
      windowElement.style.zIndex = ++zIndex; // Bring to front
      addTerminalCommand(`launch ${windowName.toLowerCase()}.exe`);

      // Load PDF if this is the Resume window
      if (windowName === "Resume") {
        await loadResumePDF();
      }
    } else {
      windowElement.style.animation = "closeWindow 0.3s";
      setTimeout(() => {
        windowElement.style.display = "none";
      }, 280);
      addTerminalCommand(`kill ${windowName.toLowerCase()}.exe`);
    }
    updateTerminalList();
  }
}

function findWindowByTitle(title) {
  const windows = document.getElementsByClassName("window");
  for (let window of windows) {
    const titleElement = window.querySelector(".window-title");
    if (titleElement && titleElement.textContent.trim() === title) {
      return window;
    }
  }
  return null;
}

// Update window controls to include visibility toggle
function setupWindowControls(window) {
  const closeBtn = window.querySelector(".close-btn");
  const windowTitle = window.querySelector(".window-title").textContent.trim();

  closeBtn.addEventListener("click", function () {
    this.style.animation = "bounce 0.3s";
    setTimeout(() => {
      this.style.animation = "";
      toggleWindow(windowTitle);
    }, 300);
  });
}

function updateTerminalList() {
  const terminalList = document.querySelector(".terminal-list");
  if (!terminalList) return;

  terminalList.innerHTML = Object.keys(windowStates)
    .map(
      (name) => `
        <li class="terminal-item">
            <span class="status-dot ${
              windowStates[name] ? "active" : ""
            }"></span>
            ${name}
        </li>
    `,
    )
    .join("");

  // Reattach click handlers
  const items = terminalList.querySelectorAll(".terminal-item");
  items.forEach((item) => {
    item.addEventListener("click", () => {
      const windowName = item.textContent.trim();
      toggleWindow(windowName);
    });
  });
}

// Terminal command display with typing animation
function addTerminalCommand(command) {
  const terminalCommands = document.getElementById("terminalCommands");
  if (!terminalCommands) return;

  // Get the current active line (the last one with just the prompt)
  const currentLine = terminalCommands.lastChild;
  const promptText = "C:\\Users\\Elan> ";

  // Typing animation
  let i = 0;
  function typeChar() {
    if (i < command.length) {
      currentLine.textContent = promptText + command.substring(0, i + 1);
      i++;
      setTimeout(typeChar, 30);
    } else {
      // After typing is complete, add a new empty prompt line
      const newCommandLine = document.createElement("div");
      newCommandLine.className = "terminal-line";
      newCommandLine.textContent = promptText;
      terminalCommands.appendChild(newCommandLine);

      // Keep only last 4 lines (3 completed + 1 empty prompt)
      const allChildren = Array.from(terminalCommands.children);
      if (allChildren.length > 4) {
        terminalCommands.removeChild(allChildren[0]);
      }

      // Auto-scroll to bottom
      terminalCommands.scrollTop = terminalCommands.scrollHeight;
    }
  }
  typeChar();
}

// Initialize terminal when DOM is loaded
// document.addEventListener('DOMContentLoaded', function() {
//     createTerminal();
// });

// Update time every second
setInterval(updateTime, 1000);

// Initial time update
document.addEventListener("DOMContentLoaded", function () {
  updateTime();
  updateTerminalList();

  // Initialize terminal with welcome message and first prompt
  const terminalCommands = document.getElementById("terminalCommands");
  if (terminalCommands) {
    // Add welcome message
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const timeString = `${hours}:${minutes}:${now.getSeconds().toString().padStart(2, "0")}`;

    const welcomeLine = document.createElement("div");
    welcomeLine.className = "terminal-line";
    welcomeLine.textContent = `connected at ${timeString}`;
    terminalCommands.appendChild(welcomeLine);

    // Add first empty prompt
    const commandLine = document.createElement("div");
    commandLine.className = "terminal-line";
    commandLine.textContent = "C:\\Users\\Elan> ";
    terminalCommands.appendChild(commandLine);
  }

});
//sometiemes this doesnt work

// Desktop selection box functionality
document.addEventListener("DOMContentLoaded", function () {
  const desktopSection = document.getElementById("desktopSection");
  const selectionBox = document.getElementById("selectionBox");
  let isSelecting = false;
  let startX = 0;
  let startY = 0;

  desktopSection.addEventListener("mousedown", function (e) {
    // Only start selection if clicking directly on the desktop (not on windows or icons)
    if (e.target !== desktopSection && !e.target.closest("#desktopSection")) {
      return;
    }

    // Prevent selection if clicking on any interactive elements
    if (
      e.target.closest(".window") ||
      e.target.closest(".app-icon") ||
      e.target.closest(".desktop-icon") ||
      e.target.closest("#taskBar")
    ) {
      return;
    }

    isSelecting = true;
    startX = e.pageX;
    startY = e.pageY;

    selectionBox.style.left = startX + "px";
    selectionBox.style.top = startY + "px";
    selectionBox.style.width = "0px";
    selectionBox.style.height = "0px";
    selectionBox.style.display = "block";

    e.preventDefault();
  });

  document.addEventListener("mousemove", function (e) {
    if (!isSelecting) return;

    const currentX = e.pageX;
    const currentY = e.pageY;

    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);

    selectionBox.style.width = width + "px";
    selectionBox.style.height = height + "px";
    selectionBox.style.left = Math.min(currentX, startX) + "px";
    selectionBox.style.top = Math.min(currentY, startY) + "px";
  });

  document.addEventListener("mouseup", function () {
    if (isSelecting) {
      isSelecting = false;
      selectionBox.style.display = "none";
    }
  });
});
