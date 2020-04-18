import "./react-grid-styles.css"
import "./react-resizable-styles.css"

import React, {Fragment, useState} from "reactn";
import GridLayout from 'react-grid-layout';
import {DivLayout, SpanEditLayoutCell, SpanRemoveLayoutCell} from "./LayoutEditor.styled";
import {ButtonDiv, DangerColorSpan} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {LayoutContentWidget} from "./LayoutContentWidget";

export const LayoutEditor = ({layout, setLayout, username}) => {

  const [showDatasetPicker, setShowDatasetPicker] = useState({});
  const datasets = layout.datasets;

  const onGridLayoutChange = (gridLayout) => {
    setLayout({
      ...layout,
      gridLayout: gridLayout
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

  const onSaveCellContent = (content) => {
    const newGridContent = [...layout.gridContent];
    newGridContent[newGridContent.findIndex(c => c.i === content.i)] = {...content};
    setLayout({
      ...layout,
      gridContent: newGridContent
    });
  };

  return (
    <Fragment>
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
