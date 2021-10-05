import React from "react";
import { v4 as uuidv4 } from "uuid";
import * as cr from "../lucymode/src/templateGenerator/contentReader";
import * as dc from "../lucymode/src/templateGenerator/dynamicContent";
class SelectNetwork extends React.Component {
  state = { selected: "nothing selected", lstNetwork: [] };

  handleCallback = () => {
    //const { lstChecked } = this.state;
    //this.setState({ lstDyn: dc.lstPanelIds, lstChecked: dc.lstCheck });
    this.forceUpdate();
    console.log("rerender page");
  };

  renderSelectedButton = (items) => {
    console.log(items);
    var j = {
      i: "slidepanel",
      side: "left",
      size: "xs",
      btn1content: {
        i: "AddIcon",
        w: "8",
        h: "8",
        color: "white",
      },
      btn1colorScheme: "blue",
      btn2content: "Back",
      btn2colorScheme: "blue",
      content: (
        <dc.CheckList
          id="0"
          items={items}
          parentCallback={this.handleCallback}
        />
      ),
    };
    return j;
  };

  render() {
    const { selected } = this.state;

    var checkeditems = [];
    for (var c in dc.lstCheck) {
      var tmp = dc.lstCheck[c].lst.map((i) => <p key={uuidv4()}>{i}</p>);
      checkeditems.push(tmp);
    }

    var j = {
      content: [
        {
          i: "box",
          p: "4",
          content: {
            i: "flex",
            spacing: "4",
            content: [
              this.renderSelectedButton(this.props.items),
              {
                i: "box",
                p: "3",
                content: {
                  i: "text",
                  content: "Selected Network: ",
                  color: "white",
                },
              },
              { i: "box", content: checkeditems },
            ],
          },
          flex: "1",
          bg: "#3395FF",
          boxShadow: "dark-lg",
        },
      ],
    };

    return <div>{cr.contentReader(j)}</div>;
  }
}

export default SelectNetwork;
