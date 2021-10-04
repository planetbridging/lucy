import React from "react";

import io from "socket.io-client";
import * as sec from "../crypto";
import * as sc from "./lucymode/src/templateGenerator/staticContent";
import * as dc from "./lucymode/src/templateGenerator/dynamicContent";
import * as cr from "./lucymode/src/templateGenerator/contentReader";
import * as ic from "@chakra-ui/icons";
var lstComputers = [];

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
  state = { menuItems: [] };

  componentDidMount() {
    this.setState({
      menuItems: [
        ["home", "DragHandleIcon", this.btnHome, "blue"],
        ["recon", "ViewIcon", this.btnRecon, "blue.200"],
        ["scan", "Search2Icon", this.btnScan, "blue.200"],
        ["upgrade", "TriangleUpIcon", this.btnUpgrade, "blue.200"],
        ["reconnect", "RepeatClockIcon", this.btnReconnect, "blue.200"],
        ["report", "EditIcon", this.btnReport, "blue.200"],
      ],
    });
  }

  btnHome = () => {
    this.setBtnTab(0);
  };

  btnRecon = () => {
    this.setBtnTab(1);
  };

  btnScan = () => {
    this.setBtnTab(2);
  };

  btnUpgrade = () => {
    this.setBtnTab(3);
  };

  btnReconnect = () => {
    this.setBtnTab(4);
  };

  btnReport = () => {
    this.setBtnTab(5);
  };

  setBtnTab = (num) => {
    const { menuItems } = this.state;
    if (num <= menuItems.length) {
      for (var i in menuItems) {
        menuItems[i][3] = "blue.200";
      }
      menuItems[num][3] = "blue";
      this.setState({ menuItems: menuItems });
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
          {
            i: "wrapitem",
            p: "2",
            content: {
              i: "vstack",
              content: [this.renderSelectNetwork()],
            },
          },

          lstMenu,
        ],
        w: "95vw",
      },
    };
    return j;
  };

  render() {
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
              content: [{ i: "text", content: "yay" }],
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
