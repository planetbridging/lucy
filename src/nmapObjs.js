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
