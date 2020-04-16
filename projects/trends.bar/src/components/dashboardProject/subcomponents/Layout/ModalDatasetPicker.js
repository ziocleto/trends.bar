import React, {Fragment, useEffect, useState, useGlobal} from "reactn";
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
import {globalLayoutState, setFirstValue, setLastValue} from "../../../../modules/trends/layout";

export const ModalDatasetPixel = (props) => {

  const datasets = useGlobalState(EditingLayoutDataSource);
  const [layout, setLayout] = useGlobal(globalLayoutState);

  console.log("datasets", datasets);
  console.log("layout", layout);
  if ( !datasets || !layout ) {
    return <Fragment/>
  }

  // useEffect(() => {
  //   if ( datasets ) {
  //     if ( !keys ) {
  //       setKeys(startupState());
  //     } else {
  //       const value = keys.valueFunction(keys);
  //       props.updater({
  //         title: value,
  //         subtitle: keys.valueNameKey,
  //         groupKey: keys.groupKey,
  //         subGroupKey: keys.subGroupKey,
  //         valueNameKey: keys.valueNameKey,
  //         valueFunction: keys.valueFunction
  //       });
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [keys, datasets]);

  const keys = layout.gridContent[props.cellIndex];

  const setWidgetData = (groupKey, subGroupKey, valueNameKey, valueFunction, datasets) => {
    return {
      groupKey,
      subGroupKey,
      valueNameKey,
      valueFunction,
      overtitle:subGroupKey,
      title:valueFunction(groupKey, subGroupKey, valueNameKey, datasets),
      subtitle:valueNameKey
    }
  };

  const setGridContent = (gc) => {
    setLayout({
      ...layout,
      gridContent:gc
    }).then();
  };

  const setGroupKey = (groupKey) => {
    let gc = layout.gridContent;

    const subGroupKey = Object.keys(datasets[groupKey])[0];
    const valueNameKey = Object.keys(datasets[groupKey][Object.keys(datasets[groupKey])[0]])[0];

    gc[props.cellIndex] = {
      ...gc[props.cellIndex],
      ...setWidgetData(groupKey, subGroupKey, valueNameKey, keys.valueFunction, datasets)
    };

    setGridContent(gc);
  };

  const setSubGroupKey = (subGroupKey) => {
    let gc = layout.gridContent;

    gc[props.cellIndex] = {
      ...gc[props.cellIndex],
      ...setWidgetData(keys.groupKey, subGroupKey, keys.valueNameKey, keys.valueFunction, datasets)
    };

    setGridContent(gc);
  };

  const setValueNameKey = (valueNameKey) => {
    let gc = layout.gridContent;

    gc[props.cellIndex] = {
      ...gc[props.cellIndex],
      ...setWidgetData(keys.groupKey, keys.subGroupKey, valueNameKey, keys.valueFunction, datasets)
    };

    setGridContent(gc);
  };

  const setValueFunction = (valueFunction) => {
    let gc = layout.gridContent;

    gc[props.cellIndex] = {
      ...gc[props.cellIndex],
      ...setWidgetData(keys.groupKey, keys.subGroupKey, keys.valueNameKey, valueFunction, datasets)
    };

    setGridContent(gc);
  };

  const setWidgetType = (widgetType) => {
    let gc = layout.gridContent;

    gc[props.cellIndex] = {
      ...gc[props.cellIndex],
      type:widgetType
    };

    setGridContent(gc);
  };

  return (
    <Fragment>
    {layout && (
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
                <b><i className={"fas fa-minus"}/></b>
              </ButtonDiv>
              <Mx05/>
              <ButtonDiv variant="outline-info" onClick={() => setWidgetType()}>
                <b><i className={"fas fa-equals"}/></b>
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
                <i className={"fas fa-chart-line"}/>
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
          {keys.type === "text" &&
          <ContentWidgetText config={keys} onSave={(newValue) => props.updater(newValue)}/>}
          {keys.type === "table" &&
          <ContentWidgetTable config={keys} onSave={(newValue) => props.updater(newValue)}/>}
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
