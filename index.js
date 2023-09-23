const { startBrowser } = require("./browser");
const scrapeController = require("./pageController");

// Start the browser and create a browser instance
let browser = startBrowser();

// Pass the browser instance to the scraper controller
scrapeController(browser);
