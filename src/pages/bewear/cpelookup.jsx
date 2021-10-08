import React from "react";
import { v4 as uuidv4 } from "uuid";
import ContentEditable from "react-contenteditable";
import * as cr from "../lucymode/src/templateGenerator/contentReader";
class Cpelookup extends React.Component {
  state = { value: "" };

  onChange = (e) => {
    this.setState({ value: e.target.value });
  };

  render() {
    const { value } = this.state;

    var lstfound = [];
    if (value != "") {
      lstfound = this.props.sendBack(value);
    }
    var btnlst = [];
    for (var lf in lstfound) {
      btnlst.push({
        i: "wrapitem",
        content: {
          i: "button",
          colorScheme: "blue",
          content: { i: "text", fontSize: "xs", content: lstfound[lf] },
        },
      });
    }

    var j = {
      content: [
        {
          i: "center",
          content: { i: "text", fontSize: "4xl", content: "Cpelookup" },
        },
        {
          i: "center",
          fontSize: "xs",
          content: { i: "text", content: "a:apache:http_server:2.0.28" },
        },
        {
          i: "box",
          boxShadow: "dark-lg",
          content: {
            i: "input",
            value: value,
            placeholder: "a:apache:http_server:2.0.28",
            onChange: (e) => this.onChange(e),
          },
        },
        { i: "box", p: "5", content: { i: "wrap", content: btnlst } },
      ],
    };
    return <div>{cr.contentReader(j)}</div>;
  }
}

export default Cpelookup;
