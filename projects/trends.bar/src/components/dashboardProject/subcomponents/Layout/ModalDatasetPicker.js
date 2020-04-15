import React, {Fragment, useEffect, useState} from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {EditingLayoutDataSource} from "../../../../modules/trends/globals";
import {useGlobalState} from "../../../../futuremodules/globalhelper/globalHelper";
import {
  ScriptElementsContainer,
  ScriptKeyContainer,
  ScriptKeyContainerTitle,
  ScriptResultContainer
} from "../DataSources/DataSources-styled";
import {Col, Container, Row} from "react-bootstrap";
import {
  Flex,
  FlexVertical,
  SecondaryAltColorTextSpanBold
} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {LabelWithRename} from "../../../../futuremodules/labelWithRename/LabelWithRename";
import {RowSeparator, RowSeparatorDouble} from "../../../../futuremodules/reactComponentStyles/reactCommon";
import {modalGraphTreeHeight} from "./ModalDatasetPicker-styled";
import {ContentWidgetText} from "../ContentWidgetText";

export const ModalDatasetPixel = (props) => {

  const datasets = useGlobalState(EditingLayoutDataSource);
  const [keys, setKeys] = useState({
    groupKey: Object.keys(datasets)[0],
    subGroupKey: Object.keys(datasets[Object.keys(datasets)[0]])[0],
    valueNameKey: Object.keys(datasets[Object.keys(datasets)[0]][Object.keys(datasets[Object.keys(datasets)[0]])[0]])[0],
    value: null
  });

  const groupKey = keys && keys.groupKey;
  const subGroupKey = keys && keys.subGroupKey;
  const valueNameKey = keys && keys.valueNameKey;
  let value = keys && keys.value;

  useEffect( () => {
    setLastValue();
  }, [] );

  const setGroupKey = (k) => {
    setKeys({
      groupKey: k
    });
  };

  const setSubGroupKey = (k) => {
    setKeys({
      groupKey,
      subGroupKey: k
    });
  };

  const setValueNameKey = (k) => {
    setKeys({
      groupKey,
      subGroupKey,
      valueNameKey: k
    });
  };

  const setValue = (k) => {
    setKeys({
      groupKey,
      subGroupKey,
      valueNameKey,
      value: k
    });
  };

  const setFirstValue = () => {
    value = datasets[groupKey][subGroupKey][valueNameKey][0].y;
    props.updater( {
      title: value,
      subtitle: valueNameKey
    });
  };

  const setLastValue = () => {
    const length = datasets[groupKey][subGroupKey][valueNameKey].length;
    value = datasets[groupKey][subGroupKey][valueNameKey][length - 1].y;
    props.updater({
      title: value,
      subtitle: valueNameKey
    });
  };

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={true}
      onClose={() => props.onClose()}
    >
      <Modal.Body>
        <ScriptResultContainer>
          <Container fluid>
            <RowSeparator/>
            <ContentWidgetText config={props.widget} onSave={(newValue) => props.updater(newValue)}/>
            <RowSeparatorDouble/>
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
                                           selected={elem === groupKey}
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
                    {groupKey && Object.keys(datasets[groupKey]).map(elem =>
                      (<ScriptKeyContainer key={elem}
                                           selected={elem === subGroupKey}
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
                    {subGroupKey && Object.keys(datasets[groupKey][subGroupKey]).map(elem =>
                      (<ScriptKeyContainer key={groupKey + subGroupKey + elem}
                                           selected={elem === valueNameKey}
                                           onClick={(e) => setValueNameKey(elem)}
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
                    {valueNameKey &&
                    <Fragment>
                      <ScriptKeyContainer key={groupKey + subGroupKey + valueNameKey + "last"}
                                          selected={true}
                                          onClick={() => setLastValue()}>
                        Last
                      </ScriptKeyContainer>
                      <ScriptKeyContainer key={groupKey + subGroupKey + valueNameKey + "first"}
                                          onClick={() => setFirstValue()}>
                        First
                      </ScriptKeyContainer>
                    </Fragment>
                    }
                  </FlexVertical>
                </ScriptElementsContainer>
              </Col>

            </Row>
          </Container>
        </ScriptResultContainer>

        <div className="mt-3">
          <Button variant="info" onClick={() => {
            props.onClose(false)
          }}>
            Alright...
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
