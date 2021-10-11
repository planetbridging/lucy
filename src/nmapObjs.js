export class objComputer {
  constructor(hostname, hostAddress, file) {
    this.hostname = hostname;
    this.hostAddress = hostAddress;
    this.lstCpe = [];
    this.cpeCount = 0;
    this.cveCount = 0;
    this.lstPorts = [];
    this.lstExploits = [];
    this.lstMsf = [];
    this.file = file;
    this.findExploits = false;
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
  constructor(lstCpe, lstExploits, lstCveCpe) {
    this.lstCpe = lstCpe;
    this.lstExploits = lstExploits;
    this.lstCveCpe = lstCveCpe;
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
            lst.push([key, value, found.get(value[i])]);
          }
        }
      }
    }
    return lst;
  }
}
