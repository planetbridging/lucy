const fs = require("fs");
const http = require("https");
const https = require("https");

const file_help = require("./file_reading");

async function download(url, dest, cb) {
  const file = fs.createWriteStream(dest);

  const request = http.get(url, (response) => {
    // check if response is success
    if (response.statusCode !== 200) {
      return cb("Response status was " + response.statusCode);
    }

    response.pipe(file);
  });

  // close() is async, call cb after close completes
  file.on("finish", () => file.close(cb));

  // check for request error too
  request.on("error", (err) => {
    fs.unlink(dest);
    return cb(err.message);
  });

  file.on("error", (err) => {
    // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    return cb(err.message);
  });
}

async function anotherDownload(url, path) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        const filePath = fs.createWriteStream(path);
        res.pipe(filePath);
        filePath.on("finish", () => {
          filePath.close();
          console.log("Download Completed");
          resolve();
        });
      })
      .on("error", (err) => {
        console.log("Error: " + err.message);
      });
  });
}

var years = [
  "2002",
  "2003",
  "2004",
  "2005",
  "2006",
  "2007",
  "2008",
  "2009",
  "2010",
  "2011",
  "2012",
  "2013",
  "2014",
  "2015",
  "2016",
  "2017",
  "2018",
  "2019",
  "2020",
  "2021",
];

async function prepareCpelookup() {
  for (var i in years) {
    var p1 = __dirname + "/bewear/" + years[i] + ".zip";
    var p2 = __dirname + "/bewear/nvdcve-1.1-" + years[i] + ".json";
    var check1 = await file_help.checkExist(p1);
    var check2 = await file_help.checkExist(p2);
    if (!check1) {
      console.log("downloading " + years[i]);
      await anotherDownload(
        "https://nvd.nist.gov/feeds/json/cve/1.1/nvdcve-1.1-" +
          years[i] +
          ".json.zip",
        p1
      );
      console.log("downloaded " + years[i]);
    }

    if (!check2) {
      console.log("extracting " + years[i]);
      file_help.extractZip(p1, __dirname + "/bewear/");
      console.log("extracted " + years[i]);
    }
  }
}

module.exports = {
  download,
  anotherDownload,
  prepareCpelookup,
};
