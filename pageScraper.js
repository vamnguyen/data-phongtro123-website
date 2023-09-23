const scrapeCategory = (browser, url) =>
  new Promise(async (resolve, reject) => {
    try {
      let page = await browser.newPage();
      console.log(">> Open new tab ...");
      await page.goto(url);
      console.log(">> go to " + url);
      await page.waitForSelector("#webpage");
      console.log(">> Website loaded done.");

      const dataCategory = await page.$$eval(
        "#navbar-menu > ul > li",
        (els) => {
          dataCategory = els.map((el) => {
            return {
              category: el.querySelector("a").innerText,
              link: el.querySelector("a").href,
            };
          });
          return dataCategory;
        }
      );

      await page.close();
      console.log("Scrape data successfully and close tab browser.");
      resolve(dataCategory);
    } catch (err) {
      console.log("Could not resolve the browser instance => ", err);
      reject(err);
    }
  });

// Scrape data in each category
const scraper = (browser, url) =>
  new Promise(async (resolve, reject) => {
    try {
      let page = await browser.newPage();
      console.log(">> Open new tab ...");
      await page.goto(url);
      console.log(">> go to " + url);
      await page.waitForSelector("#main");
      console.log(">> Website loaded done.");

      const scrapeData = {};

      // get data header in #main
      const headerData = await page.$eval("header", (el) => {
        return {
          title: el.querySelector("h1").innerText,
          description: el.querySelector("p").innerText,
        };
      });
      scrapeData.header = headerData;

      // get links detail item
      const detailLinks = await page.$$eval(
        "#left-col > .section.section-post-listing > ul > li",
        (els) => {
          detailLinks = els.map((el) => {
            return el.querySelector(".post-meta > h3 > a").href;
          });
          return detailLinks;
        }
      );

      // scrape detail page
      const scraperDetail = async (link) => {
        try {
          let pageDetail = await browser.newPage();
          await pageDetail.goto(link);
          console.log(">> go to " + link);
          await pageDetail.waitForSelector("#main");

          const detailData = {};
          // Start scrape
          // Images
          const images = await pageDetail.$$eval(
            "#left-col > article > div.post-images > div > div.swiper-wrapper > div.swiper-slide",
            (els) => {
              images = els.map((el) => {
                return el.querySelector("img")?.src;
              });
              return images.filter((img) => img !== "");
            }
          );
          detailData.images = images;

          // get header detail page data
          const header = await pageDetail.$eval("header.page-header", (el) => {
            return {
              title: el.querySelector("h1 > a").innerText,
              star: el
                .querySelector("h1 > span")
                ?.className?.replace(/^\D+/g, ""),
              class: {
                content: el.querySelector("p").innerText,
                classType: el.querySelector("p > a > strong").innerText,
              },
              address: el.querySelector("address").innerText,
              attributes: {
                price: el.querySelector("div.post-attributes > .price > span")
                  .innerText,
                acreage: el.querySelector(
                  "div.post-attributes > .acreage > span"
                ).innerText,
                published: el.querySelector(
                  "div.post-attributes > .published > span"
                ).innerText,
                hashtag: el.querySelector(
                  "div.post-attributes > .hashtag > span"
                ).innerText,
              },
            };
          });
          detailData.header = header;

          // thông tin mô tả
          const mainContentHeader = await pageDetail.$eval(
            "#left-col > article.the-post > section.post-main-content",
            (el) => el.querySelector("div.section-header > h2").innerText
          );
          const mainContentContent = await pageDetail.$$eval(
            "#left-col > article.the-post > section.post-main-content > .section-content > p",
            (els) => els.map((el) => el.innerText)
          );
          detailData.mainContent = {
            header: mainContentHeader,
            content: mainContentContent,
          };

          // đặc điểm tin đăng
          const overviewHeader = await pageDetail.$eval(
            "#left-col > article.the-post > section.post-overview",
            (el) => el.querySelector("div.section-header > h3").innerText
          );
          const overviewContent = await pageDetail.$$eval(
            "#left-col > article.the-post > section.post-overview > .section-content > table.table > tbody > tr",
            (els) =>
              els.map((el) => ({
                name: el.querySelector("td:first-child").innerText,
                content: el.querySelector("td:last-child").innerText,
              }))
          );
          detailData.overview = {
            header: overviewHeader,
            content: overviewContent,
          };

          // thông tin liên hệ
          const contactHeader = await pageDetail.$eval(
            "#left-col > article.the-post > section.post-contact",
            (el) => el.querySelector("div.section-header > h3").innerText
          );
          const contactContent = await pageDetail.$$eval(
            "#left-col > article.the-post > section.post-contact > .section-content > table.table > tbody > tr",
            (els) =>
              els.map((el) => ({
                name: el.querySelector("td:first-child").innerText,
                content: el.querySelector("td:last-child").innerText,
              }))
          );
          detailData.contact = {
            header: contactHeader,
            content: contactContent,
          };

          await pageDetail.close();
          console.log("Scrape detail page data done and closed tab.");
          return detailData;
        } catch (error) {
          console.log("Get data detail page error: " + error);
        }
      };

      const detailPages = [];
      // Loop each detail page to get data
      for (const link of detailLinks) {
        const detailPage = await scraperDetail(link);
        detailPages.push(detailPage);
      }

      scrapeData.body = detailPages;

      console.log("Scrape data successfully and close browser!");
      resolve(scrapeData);
    } catch (error) {
      console.log("Could not resolve the browser instance => ", error);
      reject(error);
    }
  });

module.exports = {
  scrapeCategory,
  scraper,
};
