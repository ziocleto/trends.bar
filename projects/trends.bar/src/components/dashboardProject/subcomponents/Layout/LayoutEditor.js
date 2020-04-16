import "./react-grid-styles.css"
import "./react-resizable-styles.css"

import React, {Fragment, useEffect, useGlobal, useState} from "reactn";
import GridLayout from 'react-grid-layout';
import {DivLayout, SpanEditLayoutCell, SpanRemoveLayoutCell} from "./LayoutEditor.styled";
import {Button, ButtonGroup, ButtonToolbar} from "react-bootstrap";
import {getDefaultCellContent, getDefaultTrendLayout, globalLayoutState} from "../../../../modules/trends/layout";
import {upsertTrendLayout} from "../../../../modules/trends/mutations";
import {useMutation, useQuery} from "@apollo/react-hooks";
import {getTrendLayouts} from "../../../../modules/trends/queries";
import {EditingLayoutDataSource, useTrendIdGetter} from "../../../../modules/trends/globals";
import {getQueryLoadedWithValueArrayNotEmpty} from "../../../../futuremodules/graphqlclient/query";
import {
  ButtonDiv,
  DangerColorSpan,
  Logo1TextSpan
} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {useGlobalState} from "../../../../futuremodules/globalhelper/globalHelper";
import {LayoutContentWidget} from "./LayoutContentWidget";

export const LayoutEditor = ({username}) => {

  const trendId = useTrendIdGetter();
  const datasets = useGlobalState(EditingLayoutDataSource);
  const [showDatasetPicker, setShowDatasetPicker] = useState({});

  const [trendLayoutMutation] = useMutation(upsertTrendLayout);
  const trendLayoutQuery = useQuery(getTrendLayouts(), {variables: {name: username, trendId: trendId}});

  const [layout, setLayout] = useGlobal(globalLayoutState);
  const [absoluteIndex, setAbsoluteIndex] = useState(0);

  useEffect(() => {
    if (!layout && datasets) {
      const ll = {
        ...getDefaultTrendLayout(datasets),
        trendId,
        username
      };
      setAbsoluteIndex(Math.max(...(ll.gridLayout.map((v) => Number(v.i)))) + 1);
      setLayout(ll).then();
    }
  }, [layout, setLayout, datasets, trendId, username]);

  useEffect(() => {
    trendLayoutQuery.refetch().then(() => {
        const queryLayout = getQueryLoadedWithValueArrayNotEmpty(trendLayoutQuery);
        if (queryLayout) {
          setLayout(queryLayout[0]);
          setAbsoluteIndex(Math.max(...(queryLayout[0].gridLayout.map((v) => Number(v.i)))) + 1);
        }
      }
    );
  }, [trendLayoutQuery, setLayout]);

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
    // console.log("SAVE", JSON.stringify((content)));
    const newGridContent = [...layout.gridContent];
    newGridContent[newGridContent.findIndex(c => c.i === content.i)] = {...content};
    setLayout({
      ...layout,
      gridContent: newGridContent
    });
  };

  if (!layout) {
    return <Fragment/>
  }

  return (
    <Fragment>
      <ButtonToolbar className="justify-content-between" aria-label="Toolbar with Button groups">
        <ButtonGroup aria-label="First group">
          <Button onClick={onAddCell}>Add Cell</Button>{' '}
        </ButtonGroup>
        <ButtonGroup>
          <Button onClick={onSaveLayout}>Save Layout</Button>
        </ButtonGroup>
      </ButtonToolbar>
      <GridLayout layout={layout.gridLayout}
                  cols={12}
                  rowHeight={50}
                  width={1024}
                  onLayoutChange={onGridLayoutChange}>
        {layout.gridLayout.map(elem => {
          return (
            <DivLayout key={elem.i}>
              <LayoutContentWidget data={datasets}
                                   showDatasetPicker={showDatasetPicker}
                                   setShowDatasetPicker={setShowDatasetPicker}
                                   cellIndex={elem.i}
                                   onSave={onSaveCellContent}
              />
              <SpanRemoveLayoutCell title="Remove cell">
                <ButtonDiv onClick={() => onRemoveCell(elem.i)}>
                  <DangerColorSpan><i className={"fas fa-times"}/></DangerColorSpan>
                </ButtonDiv>
              </SpanRemoveLayoutCell>
              <SpanEditLayoutCell title="Remove cell">
                <ButtonDiv onClick={() => setShowDatasetPicker({[elem.i]: true})}>
                  <Logo1TextSpan><i className={"fa fa-th"}/></Logo1TextSpan>
                </ButtonDiv>
              </SpanEditLayoutCell>
            </DivLayout>
          );
        })}
      </GridLayout>
    </Fragment>
  )
};