export class objComputer {
  constructor(hostname, hostAddress, file) {
    this.hostname = hostname;
    this.hostAddress = hostAddress;
    this.lstCpe = [];
    this.lstCve = [];
    this.lstPorts = [];
    this.lstExploits = [];
    this.lstMsf = [];
    this.file = file;
    this.findExploits = false;
  }

  appendCve(cve) {
    if (!this.lstCve.includes(cve)) {
      this.lstCve.push(cve);
    }
  }

  appendExploits(id) {
    if (!this.lstExploits.includes(id)) {
      this.lstExploits.push(id);
    }
  }

  appendMsf(info, cve) {
    if (info[0] != "") {
      if (!this.lstMsf.includes(cve)) {
        this.lstMsf.push(cve);
      }
    }
  }
}

export class objNic {
  constructor(ip, mac, vendor) {
    this.ip = ip;
    this.mac = mac;
    this.vendor = vendor;
  }
}

export class objPort {
  constructor(protocol, portid) {
    this.protocol = protocol;
    this.portid = portid;
    this.service = [];
  }
}

export class objService {
  constructor(name, product, version, cpe) {
    this.name = name;
    this.product = product;
    this.version = version;
    this.cpe = cpe;
  }
}

export class objManager {
  constructor(lstCpe, lstExploits, lstCveCpe, exploitDb, lstMsf) {
    this.lstCpe = lstCpe;
    this.lstExploits = lstExploits;
    this.lstCveCpe = lstCveCpe;
    this.lstExploitDb = exploitDb;
    this.lstMsf = lstMsf;
  }

  searchCpe(cpe) {
    var lst = [];
    if (this.lstCpe.has(cpe)) {
      var found = new Map();
      for (const [key, value] of this.lstCveCpe.entries()) {
        if (value[1].includes(cpe)) {
          found.set(key, value[0]);
        }
      }
      for (const [key, value] of this.lstExploits.entries()) {
        for (var i in value) {
          if (found.has(value[i])) {
            var msf = ["", ""];
            if (this.lstMsf.has(value[i])) {
              msf = this.lstMsf.get(value[i]);
            }
            lst.push([key, value[i], msf]);
          }
        }
      }
    }
    return lst;
  }

  getCpeResults(cpe) {
    var lst = [];
    var lstids = this.searchCpe(cpe);
    for (var r in lstids) {
      if (this.lstExploitDb.has(lstids[r][0])) {
        var id = this.lstExploitDb.get(lstids[r][0]);
        lst.push([lstids[r][0], lstids[r][1], lstids[r][2], id[0], id[1]]);
      }
    }
    return lst;
  }
}
