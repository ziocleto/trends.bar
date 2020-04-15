import React, {Fragment, useEffect, useState} from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {EditingLayoutDataSource} from "../../../../modules/trends/globals";
import {useGlobalState} from "../../../../futuremodules/globalhelper/globalHelper";
import {ScriptElementsContainer, ScriptKeyContainer, ScriptKeyContainerTitle} from "../DataSources/DataSources-styled";
import {Col, Container, Row} from "react-bootstrap";
import {
  ButtonDiv,
  DangerColorSpan,
  Flex,
  FlexVertical,
  Mx05
} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {
  RowSeparator,
  RowSeparatorDouble,
  RowSeparatorDoubleHR
} from "../../../../futuremodules/reactComponentStyles/reactCommon";
import {modalGraphTreeHeight} from "./ModalDatasetPicker-styled";
import {ContentWidgetText} from "../ContentWidgetText";
import {ContentWidgetMenuBar} from "../LayoutEditor.styled";
import {ContentWidgetTable} from "../ContentWidgetTable";

export const ModalDatasetPixel = (props) => {

  const datasets = useGlobalState(EditingLayoutDataSource);

  const setFirstValue = (keys) => {
    return datasets[keys.groupKey][keys.subGroupKey][keys.valueNameKey][0].y;
  };

  const setLastValue = (keys) => {
    const length = datasets[keys.groupKey][keys.subGroupKey][keys.valueNameKey].length;
    return datasets[keys.groupKey][keys.subGroupKey][keys.valueNameKey][length - 1].y;
  };

  const [keys, setKeys] = useState(null);

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

  useEffect(() => {
    if ( datasets ) {
      if ( !keys ) {
        setKeys(startupState());
      } else {
        const value = keys.valueFunction(keys);
        props.updater({
          title: value,
          subtitle: keys.valueNameKey,
          groupKey: keys.groupKey,
          subGroupKey: keys.subGroupKey,
          valueNameKey: keys.valueNameKey,
          valueFunction: keys.valueFunction
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys, datasets]);

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

  const setWidgetType = (widgetType) => {
    setKeys({
      ...keys,
      widgetType
    });
  };

  return (
    <Fragment>
    {keys && (
      <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={true}
      onHide={() => props.onClose()}
    >
      <Modal.Body>
        <ContentWidgetMenuBar>
          <Flex alignContent={"center"}
                height={"100%"}
                padding={"0 8px"}
          >
            <Flex alignContent={"center"}
                  height={"100%"}
                  padding={"0"}>
              <ButtonDiv variant="outline-info" onClick={() => setWidgetType()}>
                <b>-</b>
              </ButtonDiv>
              <Mx05/>
              <ButtonDiv variant="outline-info" onClick={() => setWidgetType()}>
                <b>=</b>
              </ButtonDiv>
              <Mx05/>
              <ButtonDiv variant="outline-info" onClick={() => setWidgetType("text")}>
                <i className={"fas fa-bars"}/>
              </ButtonDiv>
              <Mx05/>
              <ButtonDiv variant="outline-info" onClick={() => setWidgetType("table")}>
                <i className={"fas fa-table"}/>
              </ButtonDiv>
              <Mx05/>
              <ButtonDiv variant="outline-info" onClick={() => setWidgetType()}>
                <i className={"fas fa-chart-line"}/>table
              </ButtonDiv>
            </Flex>
            <ButtonDiv onClick={() => props.onClose()}>
              <DangerColorSpan><i className={"fas fa-times"}/></DangerColorSpan>
            </ButtonDiv>
          </Flex>
        </ContentWidgetMenuBar>
        <Container fluid>
          <RowSeparatorDouble/>
          <RowSeparator/>
          {props.widget.type === "text" &&
          <ContentWidgetText config={props.widget} onSave={(newValue) => props.updater(newValue)}/>}
          {props.widget.type === "table" &&
          <ContentWidgetTable config={props.widget} onSave={(newValue) => props.updater(newValue)}/>}
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
    )}
    </Fragment>
  )
};
