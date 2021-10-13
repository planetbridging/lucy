import React from "react";
import { v4 as uuidv4 } from "uuid";
import * as cr from "../lucymode/src/templateGenerator/contentReader";
import * as dl from "../../dl";
import * as xmlP from "../../xmlProcess";
import FileViewer from "../../FileViewer";
import PCViewer from "../../PCViewer";
class ShowComputers extends React.Component {
  state = { lstNetwork: [] };

  processXml = (files, sendBack) => {
    for (var f in files) {
      if (files[f].endsWith(".xml") && files[f].includes("nmap")) {
        this.getXmlScan(files[f], sendBack);
      }
    }
  };

  getXmlScan = async (file, sendBack) => {
    var xml = await dl.getLink("http://localhost:1789/" + file);
    var lstcomputers = await xmlP.parseXML(xml, file);
    sendBack(lstcomputers, file);
  };

  renderFileViewer = (file) => {
    var j = {
      i: "slidepanel",
      side: "top",
      size: "full",
      btn1content: {
        i: "text",
        fontSize: "xs",
        content: "File: " + file,
      },
      btn1colorScheme: "blue",
      btn2content: "Back",
      btn2colorScheme: "blue",
      content: <FileViewer path={file} />,
      title: file,
    };
    return j;
  };

  renderPcViewer = (pc) => {
    var j = {
      i: "slidepanel",
      side: "top",
      size: "full",
      btn1content: {
        i: "text",
        fontSize: "xs",
        content: "IP: " + pc.hostAddress.ip,
      },
      btn1colorScheme: "blue",
      btn2content: "Back",
      btn2colorScheme: "blue",
      content: <PCViewer pc={pc} />,
      title: pc.hostAddress.ip,
    };
    return j;
  };

  renderComputers = (lstpc) => {
    var lst = [];
    console.log(lstpc);

    for (var p in lstpc) {
      lst.push({
        i: "wrapitem",
        content: {
          i: "box",
          p: "4",
          bg: "#2770BF",
          boxShadow: "dark-lg",
          content: [
            this.renderFileViewer(lstpc[p].file),
            this.renderPcViewer(lstpc[p]),
            {
              i: "text",
              fontSize: "xs",
              content: "Ports: " + lstpc[p].lstPorts.length,
            },
            {
              i: "text",
              fontSize: "xs",
              content: "CVEs: " + lstpc[p].lstCve.length,
            },
            {
              i: "text",
              fontSize: "xs",
              content: "CPEs: " + lstpc[p].lstCpe.length,
            },
            {
              i: "text",
              fontSize: "xs",
              content: "Exploits: " + lstpc[p].lstExploits.length,
            },
            {
              i: "text",
              fontSize: "xs",
              content: "MSFs: " + lstpc[p].lstMsf.length,
            },
          ],
        },
      });
      //console.log(lstpc[p].hostAddress.ip);
    }
    return { i: "wrap", content: lst };
  };

  render() {
    /*{
      i: "button",
      colorScheme: "blue",
      content: {
        i: "text",
        content: "Find exploits",
        fontSize: "xs",
      },
    },*/
    var files = this.props.files;
    var lstComputers = this.props.lstComputers;
    this.processXml(files, this.props.sendBack);
    var j = {
      content: [
        {
          i: "box",
          p: "4",
          content: {
            i: "vstack",
            content: [
              {
                i: "flex",
                spacing: "4",
                content: [
                  {
                    i: "box",
                    p: "3",
                    content: {
                      i: "text",
                      content: {
                        i: "hstack",
                        spacing: "10",
                        content: [
                          { i: "text", content: "File count: " + files.length },
                          {
                            i: "text",
                            content: "Computer count: " + lstComputers.length,
                          },
                        ],
                      },
                      color: "white",
                    },
                  },
                ],
              },
              {
                i: "box",

                content: this.renderComputers(lstComputers),
              },
            ],
          },

          bg: "#3395FF",
          boxShadow: "dark-lg",
        },
      ],
    };
    return <div>{cr.contentReader(j)}</div>;
  }
}

export default ShowComputers;
