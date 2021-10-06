import React from "react";
import { v4 as uuidv4 } from "uuid";
import * as cr from "../lucymode/src/templateGenerator/contentReader";
import * as dl from "../../dl";
import * as xmlP from "../../xmlProcess";
class ShowComputers extends React.Component {
  state = { lstNetwork: [] };

  processXml = (files, sendBack) => {
    for (var f in files) {
      if (files[f].endsWith(".xml")) {
        this.getXmlScan(files[f], sendBack);
      }
    }
  };

  getXmlScan = async (file, sendBack) => {
    var xml = await dl.getLink("http://localhost:1789/" + file);
    var lstcomputers = await xmlP.parseXML(xml);
    sendBack(lstcomputers);
  };

  render() {
    var files = this.props.files;
    this.processXml(files, this.props.sendBack);
    var j = {
      content: [
        {
          i: "box",
          p: "4",
          content: {
            i: "flex",
            spacing: "4",
            content: [
              {
                i: "box",
                p: "3",
                content: {
                  i: "text",
                  content: "File count: " + files.length,
                  color: "white",
                },
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
