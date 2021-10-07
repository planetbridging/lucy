import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import * as cr from "./pages/lucymode/src/templateGenerator/contentReader";

import * as dl from "./dl";
class FileViewer extends React.Component {
  state = { file: "loading" };

  getFile = async (path) => {
    const { file } = this.state;
    if (file == "loading") {
      var f = await dl.getLink("http://localhost:1789/" + path);
      this.setState({ file: f });
    }
  };

  render() {
    const { file } = this.state;
    this.getFile(this.props.path);
    var j = {
      content: [
        {
          i: "box",
          bg: "#3395FF",
          w: "90vw",
          boxShadow: "dark-lg",
          content: { i: "text", content: file },
        },
      ],
    };
    return <div>{cr.contentReader(j)}</div>;
    //return <p>{file}</p>;
    /*return (
      <ReactQuill
        theme="snow"
        value={file}
        //onChange={(e) => this.onReportChange(e)}
      />
    );*/
  }
}

export default FileViewer;
