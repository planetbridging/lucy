import xml2js from "xml2js";
import * as objs from "./nmapObjs";

export async function parseXML(data) {
  return new Promise((resolve) => {
    var lstHosts = [];
    var parser = new xml2js.Parser({
      trim: true,
      explicitArray: true,
    });

    parser.parseString(data, function (err, result) {
      try {
        var obj = result.nmaprun;
        let addy = null;
        var hostName = "";
        for (var h in obj["host"]) {
          var host = obj["host"][h];
          try {
            hostName = host["hostnames"][0]["hostname"][0]["$"]["name"];
          } catch {}
          try {
            addy = new objs.objNic(
              host["address"][0]["$"]["addr"],
              host["address"][1]["$"]["addr"],
              host["address"][1]["$"]["vendor"]
            );
          } catch {
            try {
              addy = new objs.objNic(host["address"][0]["$"]["addr"], "", "");
            } catch {}
          }
          let newHost = new objs.objComputer(hostName, addy);
          var found_ports = false;
          for (var hostp in host["ports"]) {
            for (var hostport in host["ports"][hostp]["port"]) {
              try {
                let hPort = new objs.objPort(
                  host["ports"][hostp]["port"][hostport]["$"]["protocol"],
                  host["ports"][hostp]["port"][hostport]["$"]["portid"]
                );

                try {
                  let hPortService = new objs.objService(
                    host["ports"][hostp]["port"][hostport]["service"][0]["$"][
                      "name"
                    ],
                    host["ports"][hostp]["port"][hostport]["service"][0]["$"][
                      "product"
                    ],
                    host["ports"][hostp]["port"][hostport]["service"][0]["$"][
                      "version"
                    ],
                    host["ports"][hostp]["port"][hostport]["service"][0][
                      "cpe"
                    ][0]
                  );
                  hPort.service.push(hPortService);

                  var tcpe =
                    host["ports"][hostp]["port"][hostport]["service"][0][
                      "cpe"
                    ][0];

                  var cleancpe = tcpe.replace("cpe:/", "");

                  if (!newHost.lstCpe.includes(cleancpe)) {
                    newHost.lstCpe.push(cleancpe);
                    found_ports = true;
                  }
                } catch {}

                newHost.lstPorts.push(hPort);
              } catch {
                console.log("Error reading ports");
              }
            }
          }
          if (found_ports) {
            lstHosts.push(newHost);
          }
          //console.log(host);
          //console.log(host['$']);
        }
        // console.log(addy);
        resolve(lstHosts);
      } catch (err) {
        console.log("Something really broke" + err);
      }
    });
  });
}
