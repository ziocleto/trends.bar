import React, {Fragment} from "reactn";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {Container, Row} from "react-bootstrap";
import {
  ButtonBgDiv,
  ButtonDiv,
  Div,
  Flex,
  Mx05
} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {
  RowSeparator,
  RowSeparatorDouble,
  RowSeparatorDoubleHR
} from "../../../../futuremodules/reactComponentStyles/reactCommon";
import {ContentWidgetText} from "../ContentWidgets/ContentWidgetText";
import {ContentWidgetMenuBar} from "./LayoutEditor.styled";
import {ContentWidgetTable} from "../ContentWidgets/ContentWidgetTable";
import {ContentWidgetTextSingle} from "../ContentWidgets/ContentWidgetTextSingle";
import {ContentWidgetTextWithSubtitle} from "../ContentWidgets/ContentWidgetTextWithSubtitle";
import {ContentWidgetGraphXY} from "../ContentWidgets/ContentWidgetGraphXY";
import {DatasetElements} from "../DataSources/DatasetElements";

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
                <ContentWidgetTable datasets={datasets} config={keys}/>}
                {keys.type === "graphxy" &&
                <ContentWidgetGraphXY datasets={datasets} config={keys}/>}
              </Div>
              <RowSeparatorDoubleHR/>
              <Row>
                <DatasetElements datasets={datasets}
                                 keys={keys}
                                 setGroupKey={setGroupKey}
                                 setSubGroupKey={setSubGroupKey}
                                 setValueNameKey={setValueNameKey}
                                 setValueFunction={setValueFunction}/>
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
