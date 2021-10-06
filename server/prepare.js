const fs = require("fs");
const http = require("https");
const https = require("https");
const readline = require("readline");

const file_help = require("./file_reading");
const getCve2eb = require("./cve2ed");
const e = require("cors");

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

var lstCve = new Map();
var lstCveLink = new Map();

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

    var tmp = await file_help.getLocalJson(p2);
    var root = tmp["CVE_Items"];
    //console.log("reading " + p2);
    for (var r in root) {
      //console.log(root[r]["configurations"]["nodes"][0]["cpe_match"]);
      try {
        var cpes = [];
        var lstcpe = root[r]["configurations"]["nodes"][0]["cpe_match"];
        for (var lcpe in lstcpe) {
          var cpe = lstcpe[lcpe]["cpe23Uri"].replace("cpe:2.3:", "");
          clean = cpe.split(":*").join("");
          cpes.push(clean);
        }
        var cvssv2 = root[r]["impact"]["baseMetricV2"]["cvssV2"];
        var cve = root[r]["cve"]["CVE_data_meta"]["ID"];
        lstCve.set(cve, cpes);
      } catch {
        //console.log(root[r]["cve"]["CVE_data_meta"]["ID"]);
      }
    }
    //console.log(lstCve);
    //break;
  }
  var cvelink = __dirname + "/bewear/cve2eb.txt";
  var checklink = await file_help.checkExist(cvelink);
  if (!checklink) {
    lstCveLink = await getCve2eb.getTbl();
    var tmpsave = fs.createWriteStream(cvelink, {
      flags: "a", // 'a' means appending (old data will be preserved)
    });
    for (const [key, value] of lstCveLink.entries()) {
      tmpsave.write(key + "," + value + "\n");
    }
  } else {
    require("fs")
      .readFileSync(cvelink, "utf-8")
      .split(/\r?\n/)
      .forEach(function (line) {
        if (line.includes(",")) {
          var tsplit = line.split(",");
          lstCveLink.set(tsplit[0], tsplit[1]);
        }
      });
  }
  //console.log(lstCve);
}

module.exports = {
  download,
  anotherDownload,
  prepareCpelookup,
};
