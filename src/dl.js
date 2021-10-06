const https = require("https");
const http = require("http");

export function dynamic_link(link, type) {
  return new Promise((resolve, reject) => {
    http
      .get(link, (resp) => {
        let data = "";

        // A chunk of data has been received.
        resp.on("data", (chunk) => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on("end", () => {
          try {
            //console.log(JSON.parse(data).id);

            //let getUser = await getUserInfo(JSON.parse(data).id);

            resolve(data);
          } catch (e) {
            console.log("token failed");
            resolve("");
          }
        });
      })
      .on("error", (err) => {
        console.log("Error: " + err.message);
      });
  });
}

export function dynamic_link_https(link, type) {
  return new Promise((resolve, reject) => {
    https
      .get(link, (resp) => {
        let data = "";

        // A chunk of data has been received.
        resp.on("data", (chunk) => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on("end", () => {
          try {
            //console.log(JSON.parse(data).id);

            //let getUser = await getUserInfo(JSON.parse(data).id);
            var j = JSON.parse(data);
            var e = { d: j, t: type };
            resolve(e);
          } catch (e) {
            console.log("token failed");
            resolve("");
          }
        });
      })
      .on("error", (err) => {
        console.log("Error: " + err.message);
        resolve("broke");
      });
  });
}

export async function getLink(path, other) {
  var data = await dynamic_link(path.replace("https://", "http://"), other);
  return data;
}
