import "./react-grid-styles.css"
import "./react-resizable-styles.css"

import React, {Fragment, useState} from "react";
import GridLayout from 'react-grid-layout';
import {DivLayout} from "./LayoutEditor.styled";
import Button from "react-bootstrap/Button";
import {getDefaultTrendLayout} from "../../../modules/trends/layout";
import {upsertTrendLayout} from "../../../modules/trends/mutations";
import {useMutation} from "@apollo/react-hooks";
import {useGlobal} from "reactn";
import {EditingUserTrend} from "../../../modules/trends/globals";
import {alertSuccess} from "../../../futuremodules/alerts/alerts";

export const LayoutEditor = ({username}) => {

  const [trendId] = useGlobal(EditingUserTrend);
  const [layout, setLayout] = useState(getDefaultTrendLayout(trendId, username));
  const [trendLayoutMutation] = useMutation(upsertTrendLayout);


  const onLayoutChange = (gridLayout) => {
    setLayout( {
      ...layout,
      gridLayout: gridLayout
    });
  };

  return (
    <Fragment>
    <Button onClick={ ()=>{
      console.log(trendId);
      console.log(username);
      console.log(layout);
      trendLayoutMutation({
        variables: {
          trendLayout: layout
        }
      }).then(() =>
        console.log("Oh yeah")
        // alertSuccess(alertStore, "All set and done!")
      ).catch((e) => {
        console.log("Uacci uari uari", e);
      });
    } }>Save Layout</Button>
    <GridLayout className="layout"
                layout={layout.gridLayout}
                cols={layout.cols*layout.granularity}
                rowHeight={layout.width/(layout.cols*layout.granularity)}
                width={layout.width}
                onLayoutChange={onLayoutChange}>
      { layout.gridLayout.map( elem => {
        return (<DivLayout key={elem.i}></DivLayout>);
      })}
    </GridLayout>
    </Fragment>
  )
};
