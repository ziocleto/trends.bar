import "./react-grid-styles.css"
import "./react-resizable-styles.css"

import React, {Fragment, useState} from "react";
import GridLayout from 'react-grid-layout';
import {DivLayout, ButtonBar, SpanRemoveLayoutCell, SpanEditLayoutCell} from "./LayoutEditor.styled";
import Button from "react-bootstrap/Button";
import {getDefaultTrendLayout} from "../../../modules/trends/layout";
import {upsertTrendLayout} from "../../../modules/trends/mutations";
import {useMutation, useQuery} from "@apollo/react-hooks";
import {useGlobal} from "reactn";
import {EditingUserTrend} from "../../../modules/trends/globals";
import {alertSuccess} from "../../../futuremodules/alerts/alerts";
import {getTrendLayouts} from "../../../modules/trends/queries";
import {getTrendGraphs} from "../../../modules/trends/dataGraphs";

export const LayoutEditor = ({username}) => {

  const [trendId] = useGlobal(EditingUserTrend);
  //const [savedLayout] = useQuery(getTrendLayouts(trendId, username));
  const [trendLayoutMutation] = useMutation(upsertTrendLayout);

  const [layout, setLayout] = useState(getDefaultTrendLayout(trendId,username));
  const [absoluteIndex,setAbsoluteIndex]=useState(Math.max(...(layout.gridLayout.map((v,i)=> Number(v.i))))+1);

  console.log("trendID",trendId);
  console.log("layout", JSON.stringify(layout));

  const onLayoutChange = (gridLayout) => {
    setLayout( {
      ...layout,
      gridLayout: gridLayout
    });
  };

  const cloneGridLayout = () => {
    return [...layout.gridLayout];
  }


  const onAddCell = () => {
    const newLayout = cloneGridLayout();
    newLayout.push({
      i: absoluteIndex.toString(),
      x: 0,
      y: Infinity,
      w: 1,
      h: 1
    })
    setAbsoluteIndex(absoluteIndex+1);
    onLayoutChange(newLayout);
  }

  const onRemoveCell = (event, cellCode) => {
    event.preventDefault();
    const newLayout = cloneGridLayout();
    newLayout.splice(newLayout.findIndex(c => c.i===cellCode),1);
    onLayoutChange(newLayout);
  }

  const onEditCell = (event, cellCode) => {
    event.preventDefault();
    console.log("Edit cell "+cellCode);
  }

  const onSaveLayout = () => {
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
  }

  return (
      <Fragment>
        <ButtonBar>
          <Button onClick={onAddCell}>Add Cell</Button>{' '}
          <Button onClick={onSaveLayout}>Save Layout</Button>
        </ButtonBar>
        <GridLayout className="layout"
                    layout={layout.gridLayout}
                    cols={layout.cols*layout.granularity}
                    rowHeight={layout.width/(layout.cols*layout.granularity)}
                    width={layout.width}
                    onLayoutChange={onLayoutChange}>
          { layout.gridLayout.map( elem => {
            return (
                <DivLayout key={elem.i}>
                  <SpanRemoveLayoutCell
                      title="Remove cell"
                      onClick={(event) => onRemoveCell(event,elem.i)}>
                    X
                  </SpanRemoveLayoutCell>
                  <SpanEditLayoutCell
                    title="Edit cell content"
                    onClick={(event) => onEditCell(event, elem.i)}
                  >
                    Edit
                  </SpanEditLayoutCell>
                </DivLayout>
            );
          })}
        </GridLayout>
      </Fragment>
  )
};
