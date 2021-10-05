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

var port = 1789;

(async () => {
  await prepare.prepareCpelookup();
  var server_http = http.createServer(app);
  await multiIoPass(server_http);
  var getFolders = await file_help.getDirectories(__dirname + "/networks/");
  var getFiles = await file_help.getFilesInFolder(__dirname + "/networks/htb");
  console.log(getFolders);
  app.use("/", express.static(__dirname + "/website"));
  server_http.listen(port, function () {
    console.log("server running at " + port);
  });
})();
