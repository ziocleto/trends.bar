import {Col} from "react-bootstrap";
import {ScriptElementsContainer, ScriptKeyContainer, ScriptKeyContainerTitle} from "./DataSources-styled";
import {FlexVertical} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {modalGraphTreeHeight} from "../Layout/LayoutCellEditor-styled";
import React, {Fragment} from "reactn";
import {getFirstValue, getLastValue} from "../../../../modules/trends/layout";

export const DatasetElements = ({datasets, keys, setGroupKey, setSubGroupKey, setValueNameKey, setValueFunction}) => {

  return (
    <Fragment>
      <Col>
        <ScriptKeyContainerTitle>
          Groups
        </ScriptKeyContainerTitle>
        <ScriptElementsContainer>
          <FlexVertical
            justifyContent={"start"}
            height={modalGraphTreeHeight}
          >
            {datasets && Object.keys(datasets).map(elem =>
              (<ScriptKeyContainer key={elem}
                                   selected={setGroupKey && elem === keys.groupKey}
                                   onClick={e => setGroupKey && setGroupKey(elem)}>
                {elem}
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
            {datasets && keys.groupKey && Object.keys(datasets[keys.groupKey]).map(elem =>
              (<ScriptKeyContainer key={elem}
                                   selected={setSubGroupKey && elem === keys.subGroupKey}
                                   onClick={(e) => setSubGroupKey && setSubGroupKey(elem)}
              >
                {elem}
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
                                   selected={setValueNameKey && elem === keys.valueNameKey}
                                   onClick={() => setValueNameKey && setValueNameKey(elem)}
              >
                {elem}
              </ScriptKeyContainer>)
            )}
          </FlexVertical>
        </ScriptElementsContainer>
      </Col>

      {setValueFunction &&
      <Col>
        <ScriptKeyContainerTitle>
          Values
        </ScriptKeyContainerTitle>
        <ScriptElementsContainer>
          <FlexVertical
            justifyContent={"start"}
            height={modalGraphTreeHeight}
          >
            {datasets && keys.valueNameKey &&
            <Fragment>
              <ScriptKeyContainer key={keys.groupKey + keys.subGroupKey + keys.valueNameKey + "last"}
                                  selected={keys.valueFunctionName === getLastValue.name}
                                  onClick={() => setValueFunction(getLastValue.name)}>
                Last
              </ScriptKeyContainer>
              <ScriptKeyContainer key={keys.groupKey + keys.subGroupKey + keys.valueNameKey + "first"}
                                  selected={keys.valueFunctionName === getFirstValue.name}
                                  onClick={() => setValueFunction(getFirstValue.name)}>
                First
              </ScriptKeyContainer>
            </Fragment>
            }
          </FlexVertical>
        </ScriptElementsContainer>
      </Col>
      }
    </Fragment>
  )
};
