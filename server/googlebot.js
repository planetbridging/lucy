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
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    this.page = await this.browser.newPage();
    await this.page.setDefaultNavigationTimeout(60000);
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

  async pressNextBing() {
    /*const attr = await this.page.$$eval("a", (el) =>
      el.map((x) => x.getAttribute("title"))
    );*/

    const links = await this.page.$$("a");
    //console.log(attr);
    for (var i in links) {
      try {
        const title = await (await links[i].getProperty("title")).jsonValue();
        const href = await (await links[i].getProperty("href")).jsonValue();
        var t = await title;
        var thref = await href;
        if (t.includes("Next page")) {
          /*const href = await links[i].href;
          console.log("---");
          console.log(href);
          console.log("---");*/
          await this.page.goto(thref);
          return true;
        }
        //var attr = await links[i].getAttribute("title");
        //let linkText = await attr.jsonValue();
        //console.log(attr);
        /*if (attr.includes("Next page")) {
          links[i].click();
        }*/
      } catch {
        console.log("broke");
      }
    }
    //const hrefs = await this.page.$$eval("a", (as) => as.map((a) => a.href));
    /*const links = await this.page.$$("a");

    for (var i in links) {
      //console.log(links[i]);

      try {
        let valueHandle = await links[i].getAttribute("title");
        //console.log(valueHandle);
        let linkText = await valueHandle.jsonValue();
        console.log(linkText);
      } catch {}

    }*/
    return false;
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

function getText(linkText) {
  linkText = linkText.replace(/\r\n|\r/g, "\n");
  linkText = linkText.replace(/\ +/g, " ");

  // Replace &nbsp; with a space
  var nbspPattern = new RegExp(String.fromCharCode(160), "g");
  return linkText.replace(nbspPattern, " ");
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
