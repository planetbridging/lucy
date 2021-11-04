var express = require("express");
var uuid = require("uuid");
const http = require("http");
const app = express();
const { encrypt, decrypt } = require("./crypto");
const file_help = require("./file_reading");
const prepare = require("./prepare");
const { objWebScrap, sleep } = require("./googlebot");
//const lstcve = require("./security_data/lstcve_db");

var connectionCount = 0;

async function multiIoPass(server) {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", async function (socket) {
    connectionCount += 1;
    console.log("connectionCount: " + connectionCount);

    socket.on("disconnect", () => {
      connectionCount -= 1;
      console.log("connectionCount: " + connectionCount);
    });

    var tk = uuid.v4();
    var secretKey = tk;

    //var sendFolders = encrypt(secretKey, getFolders);

    var txt_test = encrypt(secretKey, "Hello from socket server");
    io.emit("setup", secretKey);
    io.emit("test", txt_test);

    var sendFolders = await getNetworks();
    var enSendFolders = encrypt(secretKey, sendFolders);
    io.emit("networks", enSendFolders);

    var lstCpe = prepare.getLstCpeString();
    var e_lstCpe = encrypt(secretKey, lstCpe);
    io.emit("lstcpe", e_lstCpe);

    var lstExploits = prepare.getLstExploitsString();
    var e_lstExploits = encrypt(secretKey, lstExploits);
    io.emit("lstexploits", e_lstExploits);

    var lstCveCpe = prepare.getLstCveCpeString();
    var e_lstCveCpe = encrypt(secretKey, lstCveCpe);
    io.emit("lstcvecpe", e_lstCveCpe);

    socket.on("selectNetwork", async (msg) => {
      try {
        var de = decrypt(secretKey, msg);
        var lst = JSON.parse(de);
        console.log(lst);
        for (var l in lst) {
          //console.log(lst[l]);
          var j = await getFilesInNetwork(lst[l]);
          var e_e = encrypt(secretKey, j);
          io.emit("networkResults", e_e);
        }
      } catch (e) {
        console.log("selectNetwork");
        console.log(e);
      }
    });
  });

  io.on("disconnect", () => {
    console.log("boo");
  });
}

async function getNetworks() {
  var getFolders = await file_help.getDirectories(__dirname + "/networks/");
  var data = "";
  for (var i in getFolders) {
    data += getFolders[i] + ",";
  }
  data = data.substring(0, data.length - 1);
  return data;
}

async function getFilesInNetwork(path) {
  var getSelectedFiles = await file_help.getFilesInFolder(
    __dirname + "/networks/" + path
  );
  var lst = [];
  for (var l in getSelectedFiles) {
    lst.push(path + "/" + getSelectedFiles[l]);
  }
  var j_t_s = JSON.stringify(lst);
  return j_t_s;
}

var port = 1789;

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

(async () => {
  readline.question(`did you want to test something ?`, (name) => {
    if (name.includes("y")) {
      //testingAutoScraping();
      testingAutoSiteSearch();
    } else {
      startup();
    }
    //readline.close();
  });
})();

async function startup() {
  await prepare.prepareCpelookup();
  var server_http = http.createServer(app);
  await multiIoPass(server_http);
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept,authtoken"
    );
    next();
  });
  app.use("/", express.static(__dirname + "/website"));
  app.use("/", express.static(__dirname + "/networks"));
  server_http.listen(port, function () {
    console.log("server running at " + port);
  });
}

async function testingAutoScraping() {
  var item = "@bendigoadelaide.com.au";
  var findSearch = '"' + item + '"';

  var newBot = new objWebScrap();
  await newBot.open();

  var lstlinks = new Map();
  var results = new Map();

  var size = 1;
  var count = 0;
  while (size > 0) {
    console.log("checking bing page " + (count / 10 + 1));
    /*var link =
      'https://www.google.com.au/search?q="bendigoadelaide.com.au"&start=' +
      count;*/
    var link =
      "https://www.bing.com/search?q=" + findSearch + "&first=" + count;
    await newBot.jumpTo(link);
    await sleep(2000);
    console.log("page " + link);
    var getLinks = await newBot.getLinks();

    for (const [key, value] of getLinks.entries()) {
      console.log("checking " + key);
      try {
        await newBot.jumpTo(key);
        if (!lstlinks.has(key)) {
          var found = await newBot.findInPage(item);
          results.set(found);
          console.log("found items count " + found.size);
          console.log(found);
        }
      } catch {}
    }
    console.log(getLinks);
    getLinks.forEach((value, key) => lstlinks.set(key, value));
    size = getLinks.size;

    count += 10;
  }
  await newBot.close();
}

async function testingAutoSiteSearch() {
  readline.question(`what do you want to search ? \n`, async (q1) => {
    readline.question(`what site do you want to search ? \n`, async (q2) => {
      await siteSearch(q1, q2);
      readline.close();
    });
  });
}

async function siteSearch(search, site) {
  var fpath = __dirname + "//sitesearch//" + site;
  await file_help.createFolder(fpath);
  var subfpath = fpath + "//" + search;
  await file_help.createFolder(subfpath);
  console.log("searching: " + search);

  var newBot = new objWebScrap();
  await newBot.open();

  var findSearch = "site:" + site + ' "' + search + '"';

  var lstlinks = new Map();
  var approvedlinks = new Map();
  var size = 1;
  var count = 0;

  while (size > 0) {
    var link =
      "https://www.bing.com/search?q=" + findSearch + "&first=" + count;
    await newBot.jumpTo(link);
    await sleep(2000);
    console.log("page " + link);
    var getLinks = await newBot.getLinks();
    for (const [key, value] of getLinks.entries()) {
      if (!approvedlinks.has(key)) {
        file_help.appendToFile(key + "\n", subfpath + "//links.csv");
        approvedlinks.set(key);
      }
    }
    //console.log(getLinks);
    getLinks.forEach((value, key) => lstlinks.set(key, value));
    size = getLinks.size;

    count += 10;
    //console.log(approvedlinks);
  }
  await newBot.close();
}
