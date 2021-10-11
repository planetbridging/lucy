import React from "react";
import { v4 as uuidv4 } from "uuid";
import ContentEditable from "react-contenteditable";
import * as cr from "../lucymode/src/templateGenerator/contentReader";
class Cpelookup extends React.Component {
  state = { value: "", results: [], selected: "" };

  onChange = (e) => {
    this.setState({ value: e.target.value });
  };

  btnSelectCpe = (item) => {
    var tmp_results = this.props.dataManager.searchCpe(item);

    this.setState({ results: tmp_results, selected: item });
  };

  renderResults = () => {
    const { results, selected } = this.state;
    var j = { i: "text", content: "" };
    if (selected != "" && results.length == 0) {
      j = {
        i: "center",
        content: { i: "text", content: "Didn't find anything :(" },
      };
    } else if (selected != "" && results.length > 0) {
      j = {
        i: "center",
        content: { i: "text", content: "Found: " + results.length },
      };
    }
    console.log(results);
    return j;
  };

  render() {
    const { value, selected } = this.state;

    var lstfound = [];
    if (value != "") {
      lstfound = this.props.sendBack(value);
    }

    var onClickSelected = this.btnSelectCpe;
    const btnlst = lstfound.map(function (item) {
      return {
        i: "wrapitem",
        content: {
          i: "button",
          colorScheme: "blue",
          content: { i: "text", fontSize: "xs", content: item },
          onClick: (e) => onClickSelected(item),
        },
      };
    });

    var showResults = this.renderResults();

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
        showResults,
      ],
    };
    return <div>{cr.contentReader(j)}</div>;
  }
}

export default Cpelookup;
