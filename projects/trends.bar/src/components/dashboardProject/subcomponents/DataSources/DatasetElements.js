import {ScriptElementsContainer, ScriptKeyContainer, ScriptKeyContainerTitle} from "./DataSources-styled";
import {Div, Flex, FlexVertical} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {modalGraphTreeHeight} from "../Layout/LayoutCellEditor-styled";
import React from "reactn";
import {useState} from "react";

export const DatasetElements = ({layout, setLayout, config}) => {

  const datasets = layout.dataSources;
  const [datasetIndex, setDatasetIndex] = useState(-1);
  const [sourceDataIndex, setSourceDataIndex] = useState(-1);
  const [sourceDataValueIndex, setSourceDataValueIndex] = useState(-1);

  const datasetIndexFromKeyName = (key) => {
    for (let i = 0; i < datasets.length; i++) {
      if (datasets[i].name === key ) {
        return i;
      }
    }
    return -1;
  }

  const datasetSourceIndexFromKeyName = (key) => {
    for (let i = 0; i < datasets[datasetIndex].headers.length; i++) {
      if (datasets[datasetIndex].headers[i].name === key ) {
        const isYGroup = datasets[datasetIndex].headers[i].key === "y";
        const isZGroup = datasets[datasetIndex].headers[i].key === "z";
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
        return i;
      }
    }
    return -1;
  }

  const datasetSourceZindex = (key) => {
    setSourceDataValueIndex(key);
    return -1;
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
            {datasets.map(elem =>
              (<ScriptKeyContainer key={elem.name}
                                   // selected={datasetIndex === keys.groupKey}
                                   onClick={() => setDatasetIndex(datasetIndexFromKeyName(elem.name))}>
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
            {datasetIndex >= 0 && datasets[datasetIndex].headers.map(elem =>
              (<ScriptKeyContainer key={elem.name}
                                   // selected={setSubGroupKey && elem === keys.subGroupKey}
                                   onClick={(e) => setSourceDataIndex(datasetSourceIndexFromKeyName(elem.name))}
              >
                {elem.name}
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
            {datasetIndex >=0 && sourceDataIndex >= 0 && datasets[datasetIndex].sourceData.map(elem =>
              (<ScriptKeyContainer
                                   // selected={setValueNameKey && elem === keys.zGroupIndex}
                                   //  onClick={(e) => setSourceDataIndex(datasetSourceIndexFromKeyName(elem.name))}
              >
                {elem[sourceDataIndex]}
              </ScriptKeyContainer>)
            )}
          </FlexVertical>
        </ScriptElementsContainer>
      </Div>
    </Flex>
  )
};
