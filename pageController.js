const { scrapeCategory, scraper } = require("./pageScraper");
const fs = require("fs");

const scrapeController = async (browserInstance) => {
  const url = "https://phongtro123.com";
  const indexs = [1, 2, 3, 4];
  try {
    let browser = await browserInstance;
    // Call scraper function in file pageScraper.js
    const categories = await scrapeCategory(browser, url);

    const selectedCategories = categories.filter((category, index) =>
      indexs.some((i) => i === index)
    );

    // selectedCategories[0].link =>> scrape data "Cho thuê phòng trọ"
    // const result1 = await scraper(browser, selectedCategories[0].link);
    // fs.writeFileSync("chothuephongtro.json", JSON.stringify(result1), (err) => {
    //   if (err) console.log("Write data into file json failed. " + err);
    //   console.log("Write date into file successfully.");
    // });

    const result2 = await scraper(browser, selectedCategories[1].link);
    fs.writeFileSync("nhachothue.json", JSON.stringify(result2), (err) => {
      if (err) console.log("Write data into file json failed. " + err);
      console.log("Write date into file successfully.");
    });

    const result3 = await scraper(browser, selectedCategories[2].link);
    fs.writeFileSync("chothuecanho.json", JSON.stringify(result3), (err) => {
      if (err) console.log("Write data into file json failed. " + err);
      console.log("Write date into file successfully.");
    });

    const result4 = await scraper(browser, selectedCategories[3].link);
    fs.writeFileSync("chothuematbang.json", JSON.stringify(result4), (err) => {
      if (err) console.log("Write data into file json failed. " + err);
      console.log("Write date into file successfully.");
    });

    await browser.close();
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
  }
};

module.exports = scrapeController;
