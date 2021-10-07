import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import * as cr from "./pages/lucymode/src/templateGenerator/contentReader";

import * as dl from "./dl";
class PCViewer extends React.Component {
  state = { pc: null, test: 0 };
  componentDidMount() {
    var r = Math.random();
    this.setState({ test: r });
  }
  renderPorts = (lstPorts) => {
    var j = [];
    j.push({ i: "text", content: "Ports" });
    for (var p in lstPorts) {
      var sub = [];
      sub.push({
        i: "hstack",
        spacing: "4",
        content: [
          { i: "text", content: lstPorts[p].protocol },
          { i: "text", content: lstPorts[p].portid },
        ],
      });
      for (var s in lstPorts[p].service) {
        sub.push({
          i: "hstack",
          spacing: "4",
          content: [
            { i: "text", content: lstPorts[p].service[s].cpe },
            { i: "text", content: lstPorts[p].service[s].name },
            { i: "text", content: lstPorts[p].service[s].product },
            { i: "text", content: lstPorts[p].service[s].version },
          ],
        });
      }
      j.push({ i: "box", p: "4", content: sub });
    }
    return j;
  };

  render() {
    const { pc } = this.state;
    var passpc = this.props.pc;
    var j = {
      content: [
        {
          i: "box",
          bg: "#3395FF",
          w: "90vw",
          boxShadow: "dark-lg",
          content: {
            i: "vstack",
            content: [{ i: "text", content: "loading" }],
          },
        },
      ],
    };
    if (pc == null) {
      this.setState({ pc: passpc });
    }

    if (pc != null) {
      j = {
        content: [
          {
            i: "box",
            bg: "#3395FF",
            w: "90vw",
            boxShadow: "dark-lg",
            content: {
              i: "vstack",
              content: [
                { i: "text", content: "NIC" },
                { i: "text", content: pc.hostAddress.ip },
                { i: "text", content: pc.hostAddress.mac },
                { i: "text", content: pc.hostAddress.vendor },
                this.renderPorts(pc.lstPorts),
              ],
            },
          },
        ],
      };
    }

    return <div>{cr.contentReader(j)}</div>;
  }
}

export default PCViewer;
