import React, {Fragment, useEffect, useState} from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {EditingLayoutDataSource} from "../../../../modules/trends/globals";
import {useGlobalState} from "../../../../futuremodules/globalhelper/globalHelper";
import {ScriptElementsContainer, ScriptKeyContainer, ScriptKeyContainerTitle} from "../DataSources/DataSources-styled";
import {Col, Container, Row} from "react-bootstrap";
import {Flex, FlexVertical} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {RowSeparator, RowSeparatorDoubleHR} from "../../../../futuremodules/reactComponentStyles/reactCommon";
import {modalGraphTreeHeight} from "./ModalDatasetPicker-styled";
import {ContentWidgetText} from "../ContentWidgetText";

export const ModalDatasetPixel = (props) => {

  const datasets = useGlobalState(EditingLayoutDataSource);

  const setFirstValue = (keys) => {
    return datasets[keys.groupKey][keys.subGroupKey][keys.valueNameKey][0].y;
  };

  const setLastValue = (keys) => {
    const length = datasets[keys.groupKey][keys.subGroupKey][keys.valueNameKey].length;
    return datasets[keys.groupKey][keys.subGroupKey][keys.valueNameKey][length - 1].y;
  };

  const startupState = () => {
    const groupKey = props.widget.groupKey || Object.keys(datasets)[0];
    const subGroupKey = props.widget.subGroupKey || Object.keys(datasets[Object.keys(datasets)[0]])[0];
    const valueNameKey = props.widget.valueNameKey || Object.keys(datasets[Object.keys(datasets)[0]][Object.keys(datasets[Object.keys(datasets)[0]])[0]])[0];
    const valueFunction = props.widget.valueFunction || setLastValue;
    return {
      groupKey,
      subGroupKey,
      valueNameKey,
      valueFunction
    }
  };

  const [keys, setKeys] = useState(startupState);

  useEffect(() => {
    const value = keys.valueFunction(keys);
    props.updater({
      title: value,
      subtitle: keys.valueNameKey,
      groupKey: keys.groupKey,
      subGroupKey: keys.subGroupKey,
      valueNameKey: keys.valueNameKey,
      valueFunction: keys.valueFunction
    });
  }, [keys]);

  const setGroupKey = (k) => {
    setKeys({
      ...keys,
      groupKey: k,
      subGroupKey: Object.keys(datasets[k])[0],
      valueNameKey: Object.keys(datasets[k][Object.keys(datasets[k])[0]])[0],
    });
  };

  const setSubGroupKey = (k) => {
    setKeys({
      ...keys,
      subGroupKey: k,
      valueNameKey: Object.keys(datasets[keys.groupKey][k])[0],
    });
  };

  const setValueNameKey = (k) => {
    setKeys({
      ...keys,
      valueNameKey: k,
    });
  };

  const setValueFunction = (k) => {
    setKeys({
      ...keys,
      valueFunction: k,
    });
  };

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={true}
      onHide={() => props.onClose()}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <Flex justifyContent={"center"}>
            <div>
              {keys.subGroupKey}
            </div>
          </Flex>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          <RowSeparator/>
          <ContentWidgetText config={props.widget} onSave={(newValue) => props.updater(newValue)}/>
          <RowSeparatorDoubleHR/>
          <Row>

            <Col>
              <ScriptKeyContainerTitle>
                Groups
              </ScriptKeyContainerTitle>
              <ScriptElementsContainer>
                <FlexVertical
                  justifyContent={"start"}
                  height={modalGraphTreeHeight}
                >
                  {Object.keys(datasets).map(elem =>
                    (<ScriptKeyContainer key={elem}
                                         selected={elem === keys.groupKey}
                                         onClick={e => setGroupKey(elem)}>
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
                  {keys.groupKey && Object.keys(datasets[keys.groupKey]).map(elem =>
                    (<ScriptKeyContainer key={elem}
                                         selected={elem === keys.subGroupKey}
                                         onClick={(e) => setSubGroupKey(elem)}
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
                  {keys.subGroupKey && Object.keys(datasets[keys.groupKey][keys.subGroupKey]).map(elem =>
                    (<ScriptKeyContainer key={keys.groupKey + keys.subGroupKey + elem}
                                         selected={elem === keys.valueNameKey}
                                         onClick={() => setValueNameKey(elem)}
                    >
                      {elem}
                    </ScriptKeyContainer>)
                  )}
                </FlexVertical>
              </ScriptElementsContainer>
            </Col>

            <Col>
              <ScriptKeyContainerTitle>
                Values
              </ScriptKeyContainerTitle>
              <ScriptElementsContainer>
                <FlexVertical
                  justifyContent={"start"}
                  height={modalGraphTreeHeight}
                >
                  {keys.valueNameKey &&
                  <Fragment>
                    <ScriptKeyContainer key={keys.groupKey + keys.subGroupKey + keys.valueNameKey + "last"}
                                        selected={keys.valueFunction.toString() === setLastValue.toString()}
                                        onClick={() => setValueFunction(setLastValue)}>
                      Last
                    </ScriptKeyContainer>
                    <ScriptKeyContainer key={keys.groupKey + keys.subGroupKey + keys.valueNameKey + "first"}
                                        selected={keys.valueFunction.toString() === setFirstValue.toString()}
                                        onClick={() => setValueFunction(setFirstValue)}>
                      First
                    </ScriptKeyContainer>
                  </Fragment>
                  }
                </FlexVertical>
              </ScriptElementsContainer>
            </Col>

          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => {
          props.onClose(false)
        }}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
