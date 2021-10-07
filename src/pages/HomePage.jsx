import React from "react";
/*import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";*/

import ContentEditable from "react-contenteditable";
import { asBlob } from "html-docx-js-typescript";
// if you want to save the docx file, you need import 'file-saver'
import { saveAs } from "file-saver";

import * as sc from "./lucymode/src/templateGenerator/staticContent";
import * as dc from "./lucymode/src/templateGenerator/dynamicContent";
import * as cr from "./lucymode/src/templateGenerator/contentReader";
import * as gen from "../generateReport";
import * as ic from "@chakra-ui/icons";

//import * as ws from "../WebSock";

import SelectNetwork from "./home/SelectNetwork";
import ShowComputers from "./home/ShowComputers";

import io from "socket.io-client";
import * as sec from "../crypto";
var lstNmapDone = new Map();
var lstComputers = [];
var lstNetworks = [];
var lstXml = [];
var lstSelectedNetworks = [];
var sk = "";
const chatSocket = io.connect("http://localhost:1789");

chatSocket.on("setup", function (data) {
  sk = data;
});

chatSocket.on("test", function (data) {
  var de = sec.decrypt(sk, data);
  //console.log(de);
});

class HomePage extends React.Component {
  state = {
    menuItems: [],
    currentTab: 0,
    report: "loading",
    selectedXml: [],
  };

  componentDidMount() {
    this.setState({
      menuItems: [
        ["home", "DragHandleIcon", (e) => this.btnSetTab(0), "blue"],
        ["recon", "ViewIcon", (e) => this.btnSetTab(1), "blue.200"],
        ["scan", "Search2Icon", (e) => this.btnSetTab(2), "blue.200"],
        ["upgrade", "TriangleUpIcon", (e) => this.btnSetTab(3), "blue.200"],
        ["reconnect", "RepeatClockIcon", (e) => this.btnSetTab(4), "blue.200"],
        ["report", "EditIcon", (e) => this.btnSetTab(5), "blue.200"],
      ],
    });
    this.listeners();
  }

  loadProcessedXml = (lst, file) => {
    //console.log(file);
    if (!lstNmapDone.has(file)) {
      lstNmapDone.set(file);
      if (lstComputers.length == 0) {
        lstComputers = lst;
      } else {
        for (var l in lst) {
          var found = false;
          var lstnic = lst[l].hostAddress;
          //console.log(lstnic);
          for (var newnic in lstnic) {
            for (var pc in lstComputers) {
              for (var nic in lstComputers[pc].hostAddress) {
                if (lstComputers[pc] == lstnic[newnic]) {
                  found = true;
                  break;
                }
              }
              if (found) {
                break;
              }
            }
            if (found) {
              break;
            }
          }
          if (!found) {
            lstComputers.push(lst[l]);
          }
        }
        //console.log(lstComputers);
        this.forceUpdate();
      }
    }
  };

  SendSelectedNework = (items) => {
    var j_t_s = JSON.stringify(items);
    var e_e = sec.encrypt(sk, j_t_s);
    chatSocket.emit("selectNetwork", e_e);
    lstSelectedNetworks = items;
    this.forceUpdate();
  };

  listeners = () => {
    //var { lstNetworks } = this.state;
    var r = this;
    chatSocket.on("networks", function (data) {
      var de = sec.decrypt(sk, data);
      if (de.substring(",")) {
        var lst = [];
        var d = de.split(",");
        for (var i in d) {
          lst.push(d[i]);
        }

        lstNetworks = lst;
      } else {
        lstNetworks = [de];
      }
      r.forceUpdate();
    });

    chatSocket.on("networkResults", function (data) {
      var de = sec.decrypt(sk, data);
      var j = JSON.parse(de);
      for (var f in j) {
        if (!lstXml.includes(j[f])) {
          lstXml.push(j[f]);
        }
      }
      r.forceUpdate();
    });
  };

  btnSetTab = (num) => {
    //console.log(num);
    this.setBtnTab(num);
  };

  setBtnTab = (num) => {
    const { menuItems } = this.state;
    if (num <= menuItems.length) {
      for (var i in menuItems) {
        menuItems[i][3] = "blue.200";
      }
      menuItems[num][3] = "blue";
      this.setState({ menuItems: menuItems, currentTab: num });
      //this.forceUpdate();
    }
  };

  renderSelectNetwork = () => {
    var j = {
      i: "slidepanel",
      side: "left",
      size: "xs",
      btn1content: {
        i: "HamburgerIcon",
        w: "8",
        h: "8",
        color: "white",
      },
      btn1colorScheme: "blue",
      btn2content: "Back",
      btn2colorScheme: "blue",
      content: {
        i: "wrapitem",
        content: {
          i: "slidepanel",
          side: "top",
          size: "full",
          btn1content: "Udemy & more",
          btn1colorScheme: "blue",
          btn2content: "Back",
          btn2colorScheme: "blue",
        },
      },
    };
    return j;
  };

  onReportChange = (e) => {
    this.setState({ report: e.target.value });
  };

  renderMenu = () => {
    const { menuItems } = this.state;
    var lstMenu = [];
    for (var i in menuItems) {
      lstMenu.push({
        i: "button",

        onClick: menuItems[i][2],
        colorScheme: menuItems[i][3],
        size: "sm",
        content: {
          i: "box",
          content: [
            {
              i: menuItems[i][1],
              w: "3",
              h: "3",
              color: "white",
            },
            {
              i: "text",
              content: menuItems[i][0],
              color: "white",
            },
          ],
        },
      });
    }

    var j = {
      i: "center",
      content: {
        i: "hstack",
        spacing: "5",
        content: [
          /*{
            i: "wrapitem",
            p: "2",
            content: {
              i: "vstack",
              content: [this.renderSelectNetwork()],
            },
          },*/

          lstMenu,
        ],
        w: "95vw",
      },
    };
    return j;
  };

  btnGenerate = () => {
    var data = gen.generator(lstComputers, lstSelectedNetworks);
    this.setState({ report: data });
  };

  btnExport = () => {
    this.exportData();
  };

  exportData = async () => {
    const { report } = this.state;
    asBlob(report).then((data) => {
      saveAs(data, "file.docx"); // save as docx file
    });
  };

  renderCurrentTab = (currentTab, lstNetworks) => {
    const { menuItems, report } = this.state;

    if (currentTab == 5) {
      console.log("reloaded");

      var j = {
        i: "flex",
        content: [
          { i: "button", content: "Generate", onClick: this.btnGenerate },
          { i: "button", content: "Export", onClick: this.btnExport },
        ],
      };
      return (
        <div>
          {cr.contentReader(j)}
          <ContentEditable
            innerRef={this.contentEditable}
            html={report} // innerHTML of the editable div
            disabled={false} // use true to disable editing
            onChange={(e) => this.onReportChange(e)} // handle innerHTML change
            tagName="article" // Use a custom HTML tag (uses a div by default)
          />
        </div>
      );
      /*return (
        <ReactQuill
          theme="snow"
          value={data}
          
        />
      );*/
    } else if (currentTab == 0) {
      var ReactSN = (
        <SelectNetwork items={lstNetworks} sendBack={this.SendSelectedNework} />
      );
      var ReactSC = (
        <ShowComputers
          files={lstXml}
          sendBack={this.loadProcessedXml}
          lstComputers={lstComputers}
        />
      );
      var j = { i: "flex", content: [ReactSN, ReactSC] };

      return <div>{cr.contentReader(j)}</div>;
    } else {
      //console.log(this.state.currentTab);
      return <p>current tab is {menuItems[currentTab]}</p>;
    }
  };

  render() {
    const { report, currentTab } = this.state;

    var j = {
      content: [
        {
          i: "box",
          bg: "#3395FF",
          content: {
            i: "vstack",
            content: [
              {
                i: "box",
                w: "100vw",
                boxShadow: "base",
                rounded: "sm",
                content: this.renderMenu(),
              },
              {
                i: "box",
                w: "100vw",
                p: "4",
                content: this.renderCurrentTab(currentTab, lstNetworks),
                flex: "1",
                bg: "#3395FF",
              },
            ],
          },
        },
      ],
    };

    return <div>{cr.contentReader(j)}</div>;
  }
}

export default HomePage;
