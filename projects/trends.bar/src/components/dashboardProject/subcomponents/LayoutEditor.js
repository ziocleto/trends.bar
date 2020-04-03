import "./react-grid-styles.css"
import "./react-resizable-styles.css"

import React, {Fragment, useEffect, useState} from "react";
import GridLayout from 'react-grid-layout';
import {DivLayout, SpanEditLayoutCell, SpanRemoveLayoutCell} from "./LayoutEditor.styled";
import {Button, ButtonGroup, ButtonToolbar} from "react-bootstrap";
import {getDefaultCellContent, getDefaultTrendLayout} from "../../../modules/trends/layout";
import {upsertTrendLayout} from "../../../modules/trends/mutations";
import {useMutation, useQuery} from "@apollo/react-hooks";
import {getTrendGraphsByUserTrendId, getTrendLayouts} from "../../../modules/trends/queries";
import {useTrendIdGetter} from "../../../modules/trends/globals";
import {getQueryLoadedWithValueArrayNotEmpty} from "../../../futuremodules/graphqlclient/query";
import {CellContentEditor} from "./CellContentEditor";
import {ContentWidget} from "./ContentWidget";

export const LayoutEditor = ({username}) => {

  const trendId = useTrendIdGetter();

  const [trendLayoutMutation] = useMutation(upsertTrendLayout);
  const trendLayoutQuery = useQuery(getTrendLayouts(), {variables: {name: username, trendId: trendId}});
  const trendDataQuery = useQuery(getTrendGraphsByUserTrendId(), {variables: {name: username, trendId: trendId}});

  const [layout, setLayout] = useState(getDefaultTrendLayout(trendId, username));
  const [absoluteIndex, setAbsoluteIndex] = useState(Math.max(...(layout.gridLayout.map((v) => Number(v.i)))) + 1);
  const [editingCellKey, setEditingCellKey] = useState(null);
  const [editingCellContent, setEditingCellContent] = useState(null);
  const [trendData, setTrendData] = useState({});

  useEffect(() => {
    trendLayoutQuery.refetch().then(() => {
        const queryLayout = getQueryLoadedWithValueArrayNotEmpty(trendLayoutQuery);
        if (queryLayout) {
          setLayout(queryLayout[0]);
          setAbsoluteIndex(Math.max(...(queryLayout[0].gridLayout.map((v) => Number(v.i)))) + 1);
        }
      }
    );
  }, [trendLayoutQuery]);

  useEffect(() => {
    trendDataQuery.refetch().then(() => {
        const queryData = getQueryLoadedWithValueArrayNotEmpty(trendDataQuery);
        if (queryData) {
          setTrendData(queryData);
          console.log(queryData);
        }
      }
    );
  }, [trendDataQuery]);


  const onGridLayoutChange = (gridLayout) => {
    setLayout({
      ...layout,
      gridLayout: gridLayout
    });
  };

  const onAddCell = () => {
    const newGridLayout = [...layout.gridLayout];
    const newGridContent = [...layout.gridContent];
    const newIndex = absoluteIndex;
    console.log("NI" + newIndex);
    setAbsoluteIndex(newIndex + 1);
    newGridLayout.push({
      i: newIndex.toString(),
      x: 0,
      y: Infinity,
      w: 1,
      h: 1
    });
    newGridContent.push(getDefaultCellContent(newIndex));
    setLayout({
      ...layout,
      gridLayout: newGridLayout,
      gridContent: newGridContent
    });
  };

  const onRemoveCell = (cellCode) => {
    const newGridLayout = [...layout.gridLayout];
    const newGridContent = [...layout.gridContent];
    newGridLayout.splice(newGridLayout.findIndex(c => c.i === cellCode), 1);
    newGridContent.splice(newGridContent.findIndex(c => c.i === cellCode), 1);
    setLayout({
      ...layout,
      gridLayout: newGridLayout,
      gridContent: newGridContent
    });
  };

  const onEditCell = (cellCode) => {
    //console.log("Edit cell "+cellCode);
    setEditingCellKey(cellCode);
    setEditingCellContent(layout.gridContent.filter(v => v.i === cellCode)[0]);
  };

  const onSaveLayout = () => {
    //console.log(trendId);
    //console.log(username);
    console.log("SAVING:", layout);
    trendLayoutMutation({
      variables: {
        trendLayout: layout
      }
    }).then();
  };

  const onSaveCellContent = (content) => {
    console.log("SAVE", JSON.stringify((content)));
    const newGridContent = [...layout.gridContent];
    newGridContent[newGridContent.findIndex(c => c.i === editingCellKey)] = {...content};
    setLayout({
      ...layout,
      gridContent: newGridContent
    });
    setEditingCellKey(null);
    setEditingCellContent(null);
  };

  const onCancelSaveCellContent = () => {
    console.log("CANCEL");
    setEditingCellKey(null);
    setEditingCellContent(null);
  };

  if (editingCellContent) {
    return (
      <CellContentEditor
        data={trendData}
        content={editingCellContent}
        onSave={onSaveCellContent}
        onCancel={onCancelSaveCellContent}
      />
    )
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
      <GridLayout layout={layout.gridLayout}
                  cols={layout.cols * layout.granularity}
                  rowHeight={layout.width / (layout.cols * layout.granularity)}
                  width={layout.width}
                  onLayoutChange={onGridLayoutChange}>
        {layout.gridLayout.map(elem => {
          return (
            <DivLayout key={elem.i}>
              <SpanRemoveLayoutCell title="Remove cell">
                <Button variant="outline-danger" onClick={() => onRemoveCell(elem.i)}>
                  <i className={"fas fa-minus-circle"}/>
                </Button>
              </SpanRemoveLayoutCell>
              <SpanEditLayoutCell title="Edit cell">
                <Button variant="outline-info" onClick={() => onEditCell(elem.i)}>
                  <i className={"fas fa-edit"}/>
                </Button>
              </SpanEditLayoutCell>
              {/*<Button*/}
              {/*  variant="secondary"*/}
              {/*  title="Edit cell content"*/}
              {/*  onClick={() => onEditCell(elem.i)}*/}
              {/*>*/}
              {/*  Edit*/}
              {/*</Button>*/}
              <ContentWidget data={trendData}
                             config={layout.gridContent[layout.gridLayout.findIndex(v => v.i === elem.i)]}/>
            </DivLayout>
          );
        })}
      </GridLayout>
    </Fragment>
  )
};
