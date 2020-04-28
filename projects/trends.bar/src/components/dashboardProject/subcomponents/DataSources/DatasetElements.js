import {ScriptElementsContainer, ScriptKeyContainer, ScriptKeyContainerTitle} from "./DataSources-styled";
import {Div, Flex, FlexVertical} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {modalGraphTreeHeight} from "../Layout/LayoutCellEditor-styled";
import React from "reactn";
import {useState} from "react";

export const DatasetElements = ({datasets, keys}) => {

  const [datasetIndex, setDatasetIndex] = useState(-1);
  const [sourceDataIndex, setSourceDataIndex] = useState(-1);

  console.log("sourceDataIndex ", sourceDataIndex);
  const datasetIndexFromKeyName = (key) => {
    for (let i = 0; i < datasets.length; i++) {
      if (datasets[i].name === key ) {
        return i;
      }
    }
    return -1;
  }

  const datasetSourceIndexFromKeyName = (key) => {
    console.log("checkin key:", key);
    for (let i = 0; i < datasets[datasetIndex].headers.length; i++) {
      if (datasets[datasetIndex].headers[i].name === key ) {
        return i;
      }
    }
    return -1;
  }

  // const datasetSourceValueOf = (datasetIndex, sourceDataIndex, row) => {
  //   return datasets[datasetIndex].sourceData[row][sourceDataIndex];
  // }

  return (
    <Flex width={"100%"}>
      <Div padding={"0 0 0 10px"} width={"33%"}>
        <ScriptKeyContainerTitle>
          Sources
        </ScriptKeyContainerTitle>
        <ScriptElementsContainer>
          <FlexVertical
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

      <Div margin={"0 10px"} width={"34%"}>
        <ScriptKeyContainerTitle>
          Elements
        </ScriptKeyContainerTitle>
        <ScriptElementsContainer>
          <FlexVertical
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

      <Div margin={"0 10px"} width={"33%"}>
        <ScriptKeyContainerTitle>
          Values
        </ScriptKeyContainerTitle>
        <ScriptElementsContainer>
          <FlexVertical
            justifyContent={"start"}
            height={modalGraphTreeHeight}
          >
            {datasetIndex >=0 && sourceDataIndex >= 0 && datasets[datasetIndex].sourceData.map(elem =>
              (<ScriptKeyContainer
                                   // selected={setValueNameKey && elem === keys.valueNameKey}
                                   // onClick={() => setValueNameKey && setValueNameKey(elem)}
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
