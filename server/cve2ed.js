var cvemitre = "https://cve.mitre.org/data/refs/refmap/source-EXPLOIT-DB.html";

const request = require("request-promise");
const cheerio = require("cheerio");

async function getTbl() {
  var lstCve = new Map();
  const result = await request.get(cvemitre);
  const $ = cheerio.load(result);
  $("table")
    .children("tbody")
    .children("tr")
    .each((tindex, tele) => {
      var exploitnum = "";
      var cve = "";
      $(tele)
        .children("td")
        .each((tdindex, tdelement) => {
          if (tdindex == 0 && $(tdelement).text().includes("EXPLOIT-DB:")) {
            exploitnum = $(tdelement).text().split("EXPLOIT-DB:")[1];
          }
          if (tdindex == 1 && $(tdelement).text().includes("CVE-")) {
            //cve = "CVE-" + $(tdelement).text().split("CVE-")[1];
            //
            cve = $(tdelement).text();
            cve = cve.replace(/(\r\n|\n|\r)/gm, "");
          }
          /*console.log(exploitnum);
          console.log(cve);*/
          lstCve.set(cve, exploitnum);
        });
    });
  console.log(lstCve);
  return lstCve;
  //console.log(lstCve);
}

module.exports = {
  getTbl,
};
