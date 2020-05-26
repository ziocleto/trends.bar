import {ScriptElementsContainer, ScriptKeyContainer, ScriptKeyContainerTitle} from "./DataSources-styled";
import {Div, Flex, FlexVertical, Mx1} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {modalGraphTreeHeight} from "../Layout/LayoutCellEditor-styled";
import React from "reactn";
import {useState} from "react";
import {mapEntries} from "../../../../futuremodules/utils/utils";
import {CustomColorTitle} from "../../../../futuremodules/reactComponentStyles/reactCommon";
import {getFirstKeyIndexOf} from "../ContentWidgets/ContentWidgetGraphXY";

export const DatasetElements = ({layout, setLayout, config}) => {

  const datasets = layout.dataSources;
  const [datasetIndex, setDatasetIndex] = useState(0);
  const [sourceDataXIndex, setSourceDataXIndex] = useState(getFirstKeyIndexOf(datasets[0], "x"));
  const [sourceDataYIndex, setSourceDataYIndex] = useState(getFirstKeyIndexOf(datasets[0], "y"));
  const [sourceDataZIndex, setSourceDataZIndex] = useState(getFirstKeyIndexOf(datasets[0], "z"));
  const [, setSourceDataValueIndex] = useState(0);

  const datasetIndexFromKeyName = (layout, setLayout, config, k) => {
    let gc = {...layout.gridContent};
    gc[config.i].groupKey = k;
    setDatasetIndex(k);
    setSourceDataXIndex(getFirstKeyIndexOf(datasets[k], "x"));
    setSourceDataYIndex(getFirstKeyIndexOf(datasets[k], "y"));
    setSourceDataZIndex(getFirstKeyIndexOf(datasets[k], "z"));
    setLayout( prevState => {
      return {
        ...prevState,
        gridContent: gc
      }
    });
    return k;
  }

  const datasetSourceIndexFromKeyName = (key) => {
    for (let i = 0; i < datasets[datasetIndex].headers.length; i++) {
      if (datasets[datasetIndex].headers[i].name === key ) {
        const isXGroup = datasets[datasetIndex].headers[i].key === "x";
        const isYGroup = datasets[datasetIndex].headers[i].key === "y";
        const isZGroup = datasets[datasetIndex].headers[i].key === "z";
        if ( isXGroup ) {
          setSourceDataXIndex(i);
        }
        if ( isYGroup ) {
          setSourceDataYIndex(i);
        }
        if ( isZGroup ) {
          setSourceDataZIndex(i);
        }
        if ( isYGroup || isZGroup ) {
          let gc = {...layout.gridContent};
          gc[config.i].groupKey = datasetIndex;
          if (isYGroup) gc[config.i].subGroupKey = i;
          if (isZGroup) gc[config.i].zGroupIndex = i;
          setLayout( prevState => {
            return {
              ...prevState,
              gridContent: gc
            }
          });
        }
      }
    }
  }

  const datasetSourceZIndex = (key) => {
    let gc = {...layout.gridContent};
    gc[config.i].zGroupRow = key;
    setLayout( prevState => {
      return {
        ...prevState,
        gridContent: gc
      }
    });

    setSourceDataValueIndex(key);
    return -1;
  }

  const isDataSourceIndexSelected = (key) => {
    return sourceDataXIndex === key || sourceDataYIndex === key || sourceDataZIndex === key;
  }

  const getDatasetKeyIcon = key => {
    if ( key === "x" ) return "clock";
    if ( key === "y" ) return "sort-amount-down";
    if ( key === "z" ) return "layer-group";
    return "none";
  }

  const getDatasetKeyColor = key => {
    if ( key === "x" ) return "var(--light)";
    if ( key === "y" ) return "var(--info)";
    if ( key === "z" ) return "var(--logo-color-1)";
    return "var(--logo-color-1)";
  }


  return (
    <Flex width={"100%"}>
      <Div padding={"2px"} width={"33%"}>
        <ScriptKeyContainerTitle>
          Sources
        </ScriptKeyContainerTitle>
        <ScriptElementsContainer>
          <FlexVertical
            padding={"2px"}
            justifyContent={"start"}
            height={modalGraphTreeHeight}
          >
            {mapEntries(datasets, (k,elem) =>
              (<ScriptKeyContainer key={k}
                                   selected={datasetIndex === parseInt(k)}
                                   onClick={() => setDatasetIndex(datasetIndexFromKeyName(layout, setLayout, config, parseInt(k)))}>
                {elem.name}
              </ScriptKeyContainer>)
            )}
          </FlexVertical>
        </ScriptElementsContainer>
      </Div>

      <Div margin={"0 10px"} padding={"2px"} width={"34%"}>
        <ScriptKeyContainerTitle>
          Elements
        </ScriptKeyContainerTitle>
        <ScriptElementsContainer>
          <FlexVertical
            padding={"2px"}
            justifyContent={"start"}
            height={modalGraphTreeHeight}
          >
            {mapEntries(datasets[datasetIndex].headers, (k, elem) =>
              (<ScriptKeyContainer key={elem.name}
                                   selected={isDataSourceIndexSelected(parseInt(k))}
                                   onClick={() => datasetSourceIndexFromKeyName(elem.name)}
              >
                <CustomColorTitle icon={getDatasetKeyIcon(elem.key)} text={elem.name} color={getDatasetKeyColor(elem.key)}/>
              </ScriptKeyContainer>)
            )}
          </FlexVertical>
        </ScriptElementsContainer>
      </Div>

      <Div margin={"0 10px"} padding={"2px"} width={"33%"}>
        <ScriptKeyContainerTitle>
          Values
        </ScriptKeyContainerTitle>
        <ScriptElementsContainer>
          <FlexVertical
            padding={"2px"}
            justifyContent={"start"}
            height={modalGraphTreeHeight}
          >
              <Flex width={"100%"}>
              <CustomColorTitle icon={"step-forward"} text={"Last"} color={"var(--info)"}/>
              <Mx1/>
              <ScriptKeyContainer
                onClick={() => datasetSourceZIndex(parseInt(datasets[datasetIndex].sourceData.length-1))}>
                {datasets[datasetIndex].sourceData[datasets[datasetIndex].sourceData.length-1][sourceDataYIndex]}
              </ScriptKeyContainer>
              </Flex>

            <Flex width={"100%"}>
              <CustomColorTitle icon={"step-backward"} text={"First"} color={"var(--info)"}/>
              <Mx1/>
              <ScriptKeyContainer
                onClick={() => datasetSourceZIndex(0)}>
                {datasets[datasetIndex].sourceData[0][sourceDataYIndex] || "None"}
              </ScriptKeyContainer>
            </Flex>

            {/*{mapEntries(datasets[datasetIndex].sourceData, (k,elem) =>*/}
            {/*    (<ScriptKeyContainer key={k}*/}
            {/*                         selected={sourceDataValueIndex === parseInt(k)}*/}
            {/*                         onClick={() => datasetSourceZIndex(parseInt(k))}*/}
            {/*    >*/}
            {/*      {elem[sourceDataIndex]}*/}
            {/*    </ScriptKeyContainer>)*/}
            {/*  )}*/}
          </FlexVertical>
        </ScriptElementsContainer>
      </Div>
    </Flex>
  )
};
