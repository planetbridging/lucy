import React from "react";
import io from "socket.io-client";
import * as sec from "../crypto";
import * as sc from "./lucymode/src/templateGenerator/staticContent";
import * as dc from "./lucymode/src/templateGenerator/dynamicContent";
import * as cr from "./lucymode/src/templateGenerator/contentReader";

var lstComputers = [];

var sk = "";
const chatSocket = io.connect("http://localhost:1789");

chatSocket.on("setup", function (data) {
  sk = data;
});

chatSocket.on("test", function (data) {
  var de = sec.decrypt(sk, data);
  console.log(de);
});

class HomePage extends React.Component {
  state = {};

  componentDidMount() {}

  generateStatistics = () => {};

  render() {
    var j = {
      content: [
        {
          i: "box",
          bg: "#848484",
          content: [
            {
              i: "center",
              content: {
                i: "wrap",
                spacing: "5",
                content: [
                  {
                    i: "wrapitem",
                    content: {
                      i: "box",
                      p: "2",
                      content: {
                        i: "slidepanel",
                        side: "left",
                        size: "xs",
                        btn1content: "Menu",
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
                      },
                    },
                  },
                  {
                    i: "box",
                    content: [
                      { i: "box", content: "Computers" },

                      { i: "center", content: { i: "box", content: "0" } },
                    ],
                    p: "1",
                  },
                ],
                w: "95vw",
              },
            },
            {
              i: "center",
              content: {
                i: "grid",
                content: [
                  {
                    i: "griditem",
                    content: [
                      { i: "box", content: "1", bg: "#616161" },
                      { i: "box", content: "2", bg: "#848484" },
                    ],
                    colSpan: "1",
                    bg: "#111111",
                  },
                  {
                    i: "griditem",
                    content: [
                      { i: "box", content: "1", bg: "#616161" },
                      { i: "box", content: "2", bg: "#848484" },
                    ],
                    colStart: "5",
                    colEnd: "6",
                    bg: "#111111",
                  },
                ],
                w: "90vw",
                h: "90vh",
                bg: "#3395FF",
                templateColumns: "repeat(5, 1fr)",
                gap: "4",
              },
            },
          ],
        },
      ],
    };
    return <div>{cr.contentReader(j)}</div>;
  }
}

export default HomePage;
