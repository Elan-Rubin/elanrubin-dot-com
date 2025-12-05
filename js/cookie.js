class CookieGame {
  constructor() {
    // Game state
    this.cookies = 0;
    this.clickPower = 1;
    this.autoClickerCount = 0;
    this.clickUpgradeCost = 10;
    this.autoUpgradeCost = 15;

    // Initialize game elements once they exist
    this.initializeElements();
  }

  initializeElements() {
    // DOM elements
    this.cookieButton = document.getElementById("cookieButton");
    this.cookieCount = document.getElementById("cookieCount");
    this.clickUpgrade = document.getElementById("clickUpgrade");
    this.autoUpgrade = document.getElementById("autoUpgrade");
    this.clickUpgradeCostElement = document.getElementById("clickUpgradeCost");
    this.autoUpgradeCostElement = document.getElementById("autoUpgradeCost");

    if (
      !this.cookieButton ||
      !this.cookieCount ||
      !this.clickUpgrade ||
      !this.autoUpgrade
    ) {
      // Elements not found, retry in a moment
      setTimeout(() => this.initializeElements(), 100);
      return;
    }

    // Bind methods
    this.handleClick = this.handleClick.bind(this);
    this.buyClickUpgrade = this.buyClickUpgrade.bind(this);
    this.buyAutoUpgrade = this.buyAutoUpgrade.bind(this);
    this.updateDisplay = this.updateDisplay.bind(this);
    this.autoClick = this.autoClick.bind(this);
    this.createFloatingNumber = this.createFloatingNumber.bind(this);

    // Load saved game
    this.loadGame();

    // Setup event listeners
    console.log("Setting up click handler");
    this.cookieButton.addEventListener("click", this.handleClick);
    this.clickUpgrade.addEventListener("click", this.buyClickUpgrade);
    this.autoUpgrade.addEventListener("click", this.buyAutoUpgrade);

    // Start auto clicker
    setInterval(this.autoClick, 1000);

    // Start auto save
    setInterval(() => this.saveGame(), 10000);

    // Initial display update
    this.updateDisplay();
  }

  handleClick(event) {
    console.log("Cookie clicked!");
    this.cookies += this.clickPower;
    this.createFloatingNumber(event, `+${this.clickPower}`);
    this.updateDisplay();
  }

  createFloatingNumber(event, text) {
    const rect = this.cookieButton.getBoundingClientRect();
    const number = document.createElement("div");
    number.className = "cookie-number";
    number.textContent = text;
    number.style.left = `${rect.left + rect.width / 2}px`;
    number.style.top = `${rect.top + rect.height / 2}px`;
    document.body.appendChild(number);

    // Remove the element after animation
    number.addEventListener("animationend", () => {
      document.body.removeChild(number);
    });
  }

  buyClickUpgrade() {
    if (this.cookies >= this.clickUpgradeCost) {
      this.cookies -= this.clickUpgradeCost;
      this.clickPower += 1;
      this.clickUpgradeCost = Math.round(this.clickUpgradeCost * 1.5);
      this.updateDisplay();
    }
  }

  buyAutoUpgrade() {
    if (this.cookies >= this.autoUpgradeCost) {
      this.cookies -= this.autoUpgradeCost;
      this.autoClickerCount += 1;
      this.autoUpgradeCost = Math.round(this.autoUpgradeCost * 1.5);
      this.updateDisplay();
    }
  }

  autoClick() {
    if (this.autoClickerCount > 0) {
      this.cookies += this.autoClickerCount;
      this.updateDisplay();
    }
  }

  updateDisplay() {
    if (this.cookieCount) {
      this.cookieCount.textContent = Math.floor(this.cookies);
      this.clickUpgradeCostElement.textContent = this.clickUpgradeCost;
      this.autoUpgradeCostElement.textContent = this.autoUpgradeCost;

      // Update button states
      this.clickUpgrade.disabled = this.cookies < this.clickUpgradeCost;
      this.autoUpgrade.disabled = this.cookies < this.autoUpgradeCost;
    }
  }

  saveGame() {
    const gameState = {
      cookies: this.cookies,
      clickPower: this.clickPower,
      autoClickerCount: this.autoClickerCount,
      clickUpgradeCost: this.clickUpgradeCost,
      autoUpgradeCost: this.autoUpgradeCost,
    };
    localStorage.setItem("cookieGameSave", JSON.stringify(gameState));
  }

  loadGame() {
    const savedGame = localStorage.getItem("cookieGameSave");
    if (savedGame) {
      const gameState = JSON.parse(savedGame);
      this.cookies = gameState.cookies;
      this.clickPower = gameState.clickPower;
      this.autoClickerCount = gameState.autoClickerCount;
      this.clickUpgradeCost = gameState.clickUpgradeCost;
      this.autoUpgradeCost = gameState.autoUpgradeCost;
    }
  }
}

// Create a singleton instance
let cookieGameInstance = null;

// Function to initialize or return existing game
function initCookieGame() {
  if (!cookieGameInstance) {
    console.log("Creating new cookie game instance");
    cookieGameInstance = new CookieGame();
  }
  return cookieGameInstance;
}

// Initialize game when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.cookieGame = initCookieGame();
  console.log("cookie game initialized");
});

// Also try to initialize when the script loads
window.cookieGame = initCookieGame();
