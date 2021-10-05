const fs = require("fs");
const path = require("path");

async function read_csv(csv, skipfirst) {
  const readline = require("readline");
  var lst = [];
  const file = readline.createInterface({
    input: fs.createReadStream(csv),
    output: process.stdout,
    terminal: false,
  });
  var count = 0;
  for await (const line of file) {
    if (skipfirst && count == 0) {
      count += 1;
    } else {
      if (line.includes(",")) {
        lst.push(line.split(","));
        count += 1;
      }
    }
  }
  //console.log(lst.length.toString() + " data from " + csv);
  return lst;
}

async function read_file(path) {
  const readline = require("readline");
  var lst = [];
  const file = readline.createInterface({
    input: fs.createReadStream(path),
    output: process.stdout,
    terminal: false,
  });

  for await (const line of file) {
    lst.push(line);
  }
  //console.log(lst.length.toString() + " data from " + csv);
  return lst;
}

async function getFilesInFolder(path) {
  var lst = [];
  fs.readdirSync(path).forEach((file) => {
    lst.push(file);
  });
  return lst;
}

async function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path + "/" + file).isDirectory();
  });
}

async function getLocalJson(path) {
  try {
    let rawdata = fs.readFileSync(path);
    let data = JSON.parse(rawdata);
    return data;
  } catch {
    console.log("trouble loading " + path);
  }
  return [];
}

function appendToFile(data, path) {
  //var data = "\nLearn Node.js with the help of well built Node.js Tutorial.";
  fs.appendFileSync(path, data, "utf8");
  // append data to file
  /*(var file_descriptor  = fs.appendFile(path,data, 'utf8',
        // callback function
        function(err) {     
            if (err) throw err;
            // if no error
            //console.log("Data is appended to file successfully.")
    });*/

  /*fs.close(file_descriptor, (err) => {
        if (err)
          console.error('Failed to close file', err);
        else {
          console.log("\n> File Closed successfully");
        }
    });*/
}

async function checkExist(path) {
  if (fs.existsSync(path)) {
    return true;
  } else {
    return false;
  }
}

async function createFolder(dir) {
  //var dir = './tmp';

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    return false;
  } else {
    return true;
  }
}

module.exports = {
  read_csv,
  read_file,
  getFilesInFolder,
  getLocalJson,
  appendToFile,
  checkExist,
  createFolder,
  getDirectories,
};
