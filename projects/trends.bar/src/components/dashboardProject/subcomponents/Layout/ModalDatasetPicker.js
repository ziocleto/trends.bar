import React, {Fragment} from "reactn";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {ScriptElementsContainer, ScriptKeyContainer, ScriptKeyContainerTitle} from "../DataSources/DataSources-styled";
import {Col, Container, Row} from "react-bootstrap";
import {
  ButtonBgDiv,
  ButtonDiv,
  Div,
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
import {ContentWidgetText} from "../ContentWidgets/ContentWidgetText";
import {ContentWidgetMenuBar} from "./LayoutEditor.styled";
import {ContentWidgetTable} from "../ContentWidgets/ContentWidgetTable";
import {getFirstValue, getLastValue} from "../../../../modules/trends/layout";
import {ContentWidgetTextSingle} from "../ContentWidgets/ContentWidgetTextSingle";
import {ContentWidgetTextWithSubtitle} from "../ContentWidgets/ContentWidgetTextWithSubtitle";
import {ContentWidgetGraphXY} from "../ContentWidgets/ContentWidgetGraphXY";

export const ModalDatasetPixel = ({layout, setLayout, config, onClose}) => {

  const datasets = layout.datasets;
  const keys = config;

  const setWidgetData = (groupKey, subGroupKey, valueNameKey, valueFunctionName) => {
    return {
      groupKey,
      subGroupKey,
      valueNameKey,
      valueFunctionName,
    }
  };

  const setGridContent = (gc) => {
    setLayout({
      ...layout,
      gridContent: gc
    });
  };

  const setGroupKey = (groupKey) => {
    let gc = layout.gridContent;

    const subGroupKey = Object.keys(datasets[groupKey])[0];
    const valueNameKey = Object.keys(datasets[groupKey][Object.keys(datasets[groupKey])[0]])[0];

    gc[config.i] = {
      ...gc[config.i],
      ...setWidgetData(groupKey, subGroupKey, valueNameKey, keys.valueFunctionName)
    };

    setGridContent(gc);
  };

  const setSubGroupKey = (subGroupKey) => {
    let gc = layout.gridContent;

    gc[config.i] = {
      ...gc[config.i],
      ...setWidgetData(keys.groupKey, subGroupKey, keys.valueNameKey, keys.valueFunctionName)
    };

    setGridContent(gc);
  };

  const setValueNameKey = (valueNameKey) => {
    let gc = layout.gridContent;

    gc[config.i] = {
      ...gc[config.i],
      ...setWidgetData(keys.groupKey, keys.subGroupKey, valueNameKey, keys.valueFunctionName)
    };

    setGridContent(gc);
  };

  const setValueFunction = (valueFunctionName) => {
    let gc = layout.gridContent;

    gc[config.i] = {
      ...gc[config.i],
      ...setWidgetData(keys.groupKey, keys.subGroupKey, keys.valueNameKey, valueFunctionName)
    };

    setGridContent(gc);
  };

  const setWidgetType = (widgetType) => {
    let gc = layout.gridContent;

    gc[config.i] = {
      ...gc[config.i],
      type: widgetType
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
          onHide={() => onClose()}
        >
          <Modal.Body>
            <ContentWidgetMenuBar>
              <Flex alignContent={"center"}
                    height={"100%"}
                    padding={"0 10px"}
              >
                <Flex alignContent={"center"}
                      height={"100%"}
                      fontSize={"1.0rem"}>
                  <ButtonBgDiv
                    padding={"10px"}
                    onClick={() => setWidgetType("text-single")}>
                    <i className={"fas fa-minus"}/>
                  </ButtonBgDiv>
                  <Mx05/>
                  <ButtonBgDiv padding={"10px"} onClick={() => setWidgetType("text-subtitle")}>
                    <i className={"fas fa-equals"}/>
                  </ButtonBgDiv>
                  <Mx05/>
                  <ButtonBgDiv padding={"10px"} active onClick={() => setWidgetType("text")}>
                    <i className={"fas fa-bars"}/>
                  </ButtonBgDiv>
                  <Mx05/>
                  <ButtonBgDiv padding={"10px"} onClick={() => setWidgetType("table")}>
                    <i className={"fas fa-border-all"}/>
                  </ButtonBgDiv>
                  <Mx05/>
                  <ButtonBgDiv padding={"10px"} onClick={() => setWidgetType("graphxy")}>
                    <i className={"fas fa-chart-line"}/>
                  </ButtonBgDiv>
                </Flex>
                <ButtonDiv
                  color={"light"}
                  hoveredColor={"var(--info)"}
                  onClick={() => onClose()}>
                  <i className={"fas fa-times"}/>
                </ButtonDiv>
              </Flex>
            </ContentWidgetMenuBar>
            <Container fluid>
              <RowSeparatorDouble/>
              <RowSeparatorDouble/>
              <RowSeparator/>
              <Div width={"100%"} height={"100%"} maxHeight={"300px"}>
                {keys.type === "text-single" &&
                <ContentWidgetTextSingle datasets={datasets} config={keys}/>}
                {keys.type === "text-subtitle" &&
                <ContentWidgetTextWithSubtitle datasets={datasets} config={keys}/>}
                {keys.type === "text" &&
                <ContentWidgetText datasets={datasets} config={keys}/>}
                {keys.type === "table" &&
                <ContentWidgetTable config={keys}/>}
                {keys.type === "graphxy" &&
                <ContentWidgetGraphXY datasets={datasets} config={keys}/>}
              </Div>
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
                      {datasets && Object.keys(datasets).map(elem =>
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
                      {datasets && keys.groupKey && Object.keys(datasets[keys.groupKey]).map(elem =>
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
                      {datasets && keys.subGroupKey && Object.keys(datasets[keys.groupKey][keys.subGroupKey]).map(elem =>
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
                      {datasets &&  keys.valueNameKey &&
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

              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => {
              onClose(false)
            }}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Fragment>
  )
};
