import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import * as sc from "./lucymode/src/templateGenerator/staticContent";
import * as dc from "./lucymode/src/templateGenerator/dynamicContent";
import * as cr from "./lucymode/src/templateGenerator/contentReader";
import * as ic from "@chakra-ui/icons";
//import * as ws from "../WebSock";

import SelectNetwork from "./home/SelectNetwork";

import io from "socket.io-client";
import * as sec from "../crypto";
var lstComputers = [];
var lstNetworks = [];
var sk = "";
const chatSocket = io.connect("http://localhost:1789");

chatSocket.on("setup", function (data) {
  sk = data;
});

chatSocket.on("test", function (data) {
  var de = sec.decrypt(sk, data);
  //console.log(de);
});

function SendSelectedNework(items) {
  var j_t_s = JSON.stringify(items);
  var e_e = sec.encrypt(sk, j_t_s);
  chatSocket.emit("selectNetwork", e_e);
}

class HomePage extends React.Component {
  state = {
    menuItems: [],
    currentTab: 0,
    report: "hey hows it going<p>m</p><p>m</p>",
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
      console.log(de);
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
    this.setState({ report: e });
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
        i: "vstack",
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

  renderCurrentTab = (currentTab, lstNetworks) => {
    const { menuItems, report } = this.state;

    if (currentTab == 5) {
      return (
        <ReactQuill
          theme="snow"
          value={report}
          onChange={(e) => this.onReportChange(e)}
        />
      );
    } else if (currentTab == 0) {
      //console.log(ws.lstNetworks);
      return (
        <SelectNetwork items={lstNetworks} sendBack={SendSelectedNework} />
      );
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
          i: "flex",
          content: [
            { i: "box", content: this.renderMenu(), bg: "#222994" },
            {
              i: "box",
              h: "100vh",
              p: "4",
              content: this.renderCurrentTab(currentTab, lstNetworks),
              flex: "1",
              bg: "#3395FF",
              boxShadow: "dark-lg",
            },
          ],
        },
      ],
    };

    return <div>{cr.contentReader(j)}</div>;
  }
}

export default HomePage;
