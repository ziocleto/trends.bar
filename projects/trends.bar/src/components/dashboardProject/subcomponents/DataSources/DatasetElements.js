import {Col} from "react-bootstrap";
import {ScriptElementsContainer, ScriptKeyContainer, ScriptKeyContainerTitle} from "./DataSources-styled";
import {FlexVertical} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {modalGraphTreeHeight} from "../Layout/LayoutCellEditor-styled";
import React, {Fragment} from "reactn";
import {useState} from "react";

export const DatasetElements = ({datasets, keys}) => {

  const [datasetIndex, setDatasetIndex] = useState(-1);

  const datasetIndexFromKeyName = (key) => {
    for (let i = 0; i < datasets.length; i++) {
      if (datasets[i].name === key ) {
        return i;
      }
    }
    return -1;
  }

  return (
    <Fragment>
      <Col>
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
      </Col>

      <Col>
        <ScriptKeyContainerTitle>
          Sub Groups
        </ScriptKeyContainerTitle>
        <ScriptElementsContainer>
          <FlexVertical
            justifyContent={"start"}
            height={modalGraphTreeHeight}
          >
            {datasetIndex >= 0 && datasets[datasetIndex].headers.map(elem =>
              (<ScriptKeyContainer key={elem.name}
                                   // selected={setSubGroupKey && elem === keys.subGroupKey}
                                   // onClick={(e) => setSubGroupKey && setSubGroupKey(elem)}
              >
                {elem.name}
              </ScriptKeyContainer>)
            )}
          </FlexVertical>
        </ScriptElementsContainer>
      </Col>

      <Col>
        <ScriptKeyContainerTitle>
          Elements
        </ScriptKeyContainerTitle>
        <ScriptElementsContainer>
          <FlexVertical
            justifyContent={"start"}
            height={modalGraphTreeHeight}
          >
            {datasets && keys.subGroupKey && Object.keys(datasets[keys.groupKey][keys.subGroupKey]).map(elem =>
              (<ScriptKeyContainer key={keys.groupKey + keys.subGroupKey + elem}
                                   // selected={setValueNameKey && elem === keys.valueNameKey}
                                   // onClick={() => setValueNameKey && setValueNameKey(elem)}
              >
                {elem}
              </ScriptKeyContainer>)
            )}
          </FlexVertical>
        </ScriptElementsContainer>
      </Col>

      {/*{setValueFunction &&*/}
      {/*<Col>*/}
      {/*  <ScriptKeyContainerTitle>*/}
      {/*    Values*/}
      {/*  </ScriptKeyContainerTitle>*/}
      {/*  <ScriptElementsContainer>*/}
      {/*    <FlexVertical*/}
      {/*      justifyContent={"start"}*/}
      {/*      height={modalGraphTreeHeight}*/}
      {/*    >*/}
      {/*      {datasets && keys.valueNameKey &&*/}
      {/*      <Fragment>*/}
      {/*        <ScriptKeyContainer key={keys.groupKey + keys.subGroupKey + keys.valueNameKey + "last"}*/}
      {/*                            selected={keys.valueFunctionName === getLastValue.name}*/}
      {/*                            onClick={() => setValueFunction(getLastValue.name)}>*/}
      {/*          Last*/}
      {/*        </ScriptKeyContainer>*/}
      {/*        <ScriptKeyContainer key={keys.groupKey + keys.subGroupKey + keys.valueNameKey + "first"}*/}
      {/*                            selected={keys.valueFunctionName === getFirstValue.name}*/}
      {/*                            onClick={() => setValueFunction(getFirstValue.name)}>*/}
      {/*          First*/}
      {/*        </ScriptKeyContainer>*/}
      {/*      </Fragment>*/}
      {/*      }*/}
      {/*    </FlexVertical>*/}
      {/*  </ScriptElementsContainer>*/}
      {/*</Col>*/}
      {/*}*/}
    </Fragment>
  )
};
