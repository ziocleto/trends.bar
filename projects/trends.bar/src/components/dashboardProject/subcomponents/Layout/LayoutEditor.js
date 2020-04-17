import "./react-grid-styles.css"
import "./react-resizable-styles.css"

import React, {Fragment, useState} from "reactn";
import GridLayout from 'react-grid-layout';
import {DivLayout, SpanEditLayoutCell, SpanRemoveLayoutCell} from "./LayoutEditor.styled";
import {Button, ButtonGroup, ButtonToolbar} from "react-bootstrap";
import {getDefaultCellContent} from "../../../../modules/trends/layout";
import {upsertTrendLayout} from "../../../../modules/trends/mutations";
import {useMutation} from "@apollo/react-hooks";
import {useGetTrend, useTrendIdGetter} from "../../../../modules/trends/globals";
import {ButtonDiv, DangerColorSpan} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {LayoutContentWidget} from "./LayoutContentWidget";
import {SpinnerTopMiddle} from "../../../../futuremodules/spinner/Spinner";

export const LayoutEditor = ({username}) => {

  const trendId = useTrendIdGetter();
  const { layout, setLayout, datasets } = useGetTrend(trendId, username);

  const [trendLayoutMutation] = useMutation(upsertTrendLayout);
  const [showDatasetPicker, setShowDatasetPicker] = useState({});

  const onGridLayoutChange = (gridLayout) => {
    setLayout({
      ...layout,
      gridLayout: gridLayout
    });
  };

  const onAddCell = () => {
    const newGridLayout = [...layout.gridLayout];
    const newGridContent = [...layout.gridContent];
    const newIndex = Math.max(...(layout.gridLayout.map((v) => Number(v.i)))) + 1;
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
    console.log("SAVING:", layout);
    trendLayoutMutation({
      variables: {
        trendLayout: layout
      }
    }).then();
  };

  const onSaveCellContent = (content) => {
    const newGridContent = [...layout.gridContent];
    newGridContent[newGridContent.findIndex(c => c.i === content.i)] = {...content};
    setLayout({
      ...layout,
      gridContent: newGridContent
    });
  };

  if (!layout || !datasets) {
    return <SpinnerTopMiddle/>
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
              <LayoutContentWidget datasets={datasets}
                                   layout={layout}
                                   setLayout={setLayout}
                                   config={layout.gridContent[layout.gridLayout.findIndex(v => v.i === elem.i)]}
                                   showDatasetPicker={showDatasetPicker}
                                   setShowDatasetPicker={setShowDatasetPicker}
                                   onSave={onSaveCellContent}
              />
              <SpanRemoveLayoutCell title="Remove element">
                <ButtonDiv onClick={() => onRemoveCell(elem.i)}>
                  <DangerColorSpan><i className={"fas fa-times"}/></DangerColorSpan>
                </ButtonDiv>
              </SpanRemoveLayoutCell>
              <SpanEditLayoutCell title="Edit element">
                <ButtonDiv
                  color={'var(--logo-color-1)'}
                  hoveredColor={"white"}
                  onClick={() => setShowDatasetPicker({[elem.i]: true})}>
                  <i className={"fa fa-edit"}/>
                </ButtonDiv>
              </SpanEditLayoutCell>
            </DivLayout>
          );
        })}
      </GridLayout>
    </Fragment>
  )
};
