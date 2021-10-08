var express = require("express");
var uuid = require("uuid");
const http = require("http");
const app = express();
const { encrypt, decrypt } = require("./crypto");
const file_help = require("./file_reading");
const prepare = require("./prepare");
//const lstcve = require("./security_data/lstcve_db");

var connectionCount = 0;

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

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

    var lstCpe = prepare.exportLstCpeDictionary();
    var e_lstCpe = encrypt(secretKey, lstCpe);
    io.emit("lstcpe", e_lstCpe);

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
        /*for (var l in lst) {
          var j = getFilesInNetwork(lst[l]);
          
          console.log(j);
          //
        }*/
      } catch (e) {
        console.log("selectNetwork");
        console.log(e);
      }
    });
    //var socketId = socket.id;
    //var clientIp = socket.request.connection.remoteAddress;

    //console.log(socket.request.connection);

    /*var i = 0;
    while (i < 100) {
      io.emit("setup", i);
      await sleep(1000);
      i++;
    }*/
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

(async () => {
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
})();
