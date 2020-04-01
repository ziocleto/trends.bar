import "./react-grid-styles.css"
import "./react-resizable-styles.css"

import React, {Fragment, useEffect, useState} from "react";
import GridLayout from 'react-grid-layout';
import {DivLayout, SpanRemoveLayoutCell} from "./LayoutEditor.styled";
import {Button, ButtonGroup, ButtonToolbar} from "react-bootstrap";
import {getDefaultTrendLayout} from "../../../modules/trends/layout";
import {upsertTrendLayout} from "../../../modules/trends/mutations";
import {useMutation, useQuery} from "@apollo/react-hooks";
import {getTrendLayouts} from "../../../modules/trends/queries";
import {useTrendIdGetter} from "../../../modules/trends/globals";
import {getQueryLoadedWithValueArrayNotEmpty} from "../../../futuremodules/graphqlclient/query";

export const LayoutEditor = ({username}) => {

  const trendId = useTrendIdGetter();

  const [trendLayoutMutation] = useMutation(upsertTrendLayout);
  const trendLayoutQuery = useQuery(getTrendLayouts(), {variables: {name: username, trendId: trendId}});

  const [layout, setLayout] = useState(getDefaultTrendLayout(trendId, username));
  const [absoluteIndex, setAbsoluteIndex] = useState(0);

  useEffect(() => {
    trendLayoutQuery.refetch().then(() => {
        const queryLayout = getQueryLoadedWithValueArrayNotEmpty(trendLayoutQuery);
        if (queryLayout) {
          setLayout(queryLayout[0]);
          setAbsoluteIndex(Math.max(...(queryLayout[0].gridLayout.map((v, i) => Number(v.i)))) + 1);
        }
      }
    );
  }, [trendLayoutQuery]);

  const onLayoutChange = (gridLayout) => {
    setLayout({
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
    });
    setAbsoluteIndex(absoluteIndex + 1);
    onLayoutChange(newLayout);
  };

  const onRemoveCell = (event, cellCode) => {
    event.preventDefault();
    const newLayout = cloneGridLayout();
    newLayout.splice(newLayout.findIndex(c => c.i === cellCode), 1);
    onLayoutChange(newLayout);
  };

  const onEditCell = (event, cellCode) => {
    event.preventDefault();
    //console.log("Edit cell "+cellCode);
  };

  const onSaveLayout = () => {
    trendLayoutMutation({
      variables: {
        trendLayout: layout
      }
    }).then(r => console.log("Saved mutation:", r));
  }

  return (
    <Fragment>
      <br/>
      <ButtonToolbar className="justify-content-between" aria-label="Toolbar with Button groups">
        <ButtonGroup aria-label="First group">
          <Button onClick={onAddCell}>Add Cell</Button>{' '}
        </ButtonGroup>
        <ButtonGroup>
          <Button onClick={onSaveLayout}>Save Layout</Button>
        </ButtonGroup>
      </ButtonToolbar>
      <GridLayout className="layout"
                  layout={layout.gridLayout}
                  cols={layout.cols * layout.granularity}
                  rowHeight={layout.width / (layout.cols * layout.granularity)}
                  width={layout.width}
                  onLayoutChange={onLayoutChange}>
        {layout.gridLayout.map(elem => {
          return (
            <DivLayout key={elem.i}>
              <SpanRemoveLayoutCell title="Remove cell">
                <Button variant="warning" onClick={(event) => onRemoveCell(event, elem.i)}>
                  X
                </Button>
              </SpanRemoveLayoutCell>
              <Button
                variant="secondary"
                title="Edit cell content"
                onClick={(event) => onEditCell(event, elem.i)}
              >
                Edit
              </Button>
            </DivLayout>
          );
        })}
      </GridLayout>
    </Fragment>
  )
};
