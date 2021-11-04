const puppeteer = require("puppeteer");
var fs = require("fs");

var emails = new Map();

class objWebScrap {
  constructor() {
    this.browser;
    this.page;
  }
  async jumpTo(link) {
    await this.page.goto(link);
    //await this.page.waitForNavigation();
  }

  async manualWait() {
    await this.page.waitForNavigation();
  }

  async open() {
    this.browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox"],
    });
    this.page = await this.browser.newPage();
  }

  async getLinks() {
    var googlelinks = new Map();
    const hrefs = await this.page.$$eval("a", (as) => as.map((a) => a.href));

    for (var i in hrefs) {
      if (
        !hrefs[i].includes("bing.com") &&
        !hrefs[i].includes("go.microsoft.com") &&
        !hrefs[i].includes("javascript:") &&
        hrefs[i] != ""
      ) {
        googlelinks.set(hrefs[i]);
      }
    }
    return googlelinks;
  }

  async findInPage(search) {
    var found = new Map();
    try {
      var txt = await this.page.$eval("*", (el) => el.innerText);
      var stxt = txt.split(" ");
      //console.log(stxt);
      for (var s in stxt) {
        if (stxt[s].includes(search)) {
          var clean = stxt[s].split(search);
          found.set(clean[0] + search);
        }
      }
    } catch {
      console.log("didnt work " + key);
    }
    return found;
  }

  async close() {
    await this.browser.close();
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

module.exports = {
  objWebScrap,
  sleep,
};

/*
(async () => {
  var endEmail = "@pciconsultingaustralia.com.au";
  for (var c = 0; c <= 110; c += 10) {
    console.log(c);
    await page.goto(
      'https://www.google.com.au/search?q="bendigoadelaide.com.au"&start=' + c
    );

    console.log(c + " done");
  }

  await browser.close();
})();
*/
