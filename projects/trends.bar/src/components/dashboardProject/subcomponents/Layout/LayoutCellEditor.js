import React, {Fragment} from "reactn";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {ButtonGroup, Container, Dropdown, DropdownButton, Row} from "react-bootstrap";
import {Flex} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {CustomTitle, RowSeparatorDoubleHR} from "../../../../futuremodules/reactComponentStyles/reactCommon";
import {DatasetElements} from "../DataSources/DatasetElements";
import {ContentWidget} from "../ContentWidgets/ContentWidget";

export const LayoutCellEditor = ({layout, setLayout, config, onClose}) => {

  const datasets = layout.dataSources;
  const keys = config;

  // const setWidgetData = (groupKey, subGroupKey, valueNameKey, valueFunctionName) => {
  //   return {
  //     groupKey,
  //     subGroupKey,
  //     valueNameKey,
  //     valueFunctionName,
  //   }
  // };

  const setGridContent = (gc) => {
    setLayout({
      ...layout,
      gridContent: gc
    });
  };

  // const setGroupKey = (groupKey) => {
  //   let gc = layout.gridContent;
  //
  //   const subGroupKey = Object.keys(datasets[groupKey])[0];
  //   const valueNameKey = Object.keys(datasets[groupKey][Object.keys(datasets[groupKey])[0]])[0];
  //
  //   gc[config.i] = {
  //     ...gc[config.i],
  //     ...setWidgetData(groupKey, subGroupKey, valueNameKey, keys.valueFunctionName)
  //   };
  //
  //   setGridContent(gc);
  // };
  //
  // const setSubGroupKey = (subGroupKey) => {
  //   let gc = layout.gridContent;
  //
  //   gc[config.i] = {
  //     ...gc[config.i],
  //     ...setWidgetData(keys.groupKey, subGroupKey, keys.valueNameKey, keys.valueFunctionName)
  //   };
  //
  //   setGridContent(gc);
  // };
  //
  // const setValueNameKey = (valueNameKey) => {
  //   let gc = layout.gridContent;
  //
  //   gc[config.i] = {
  //     ...gc[config.i],
  //     ...setWidgetData(keys.groupKey, keys.subGroupKey, valueNameKey, keys.valueFunctionName)
  //   };
  //
  //   setGridContent(gc);
  // };
  //
  // const setValueFunction = (valueFunctionName) => {
  //   let gc = layout.gridContent;
  //
  //   gc[config.i] = {
  //     ...gc[config.i],
  //     ...setWidgetData(keys.groupKey, keys.subGroupKey, keys.valueNameKey, valueFunctionName)
  //   };
  //
  //   setGridContent(gc);
  // };

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
      <Modal.Body>
        <Flex alignContent={"center"}>
          <ButtonGroup>
            <DropdownButton as={ButtonGroup} title={<CustomTitle text={"Text "} icon={"layer-group"}/>}>
              <Dropdown.Item onClick={() => setWidgetType("text-single")}>Single</Dropdown.Item>
              <Dropdown.Item onClick={() => setWidgetType("text-subtitle")}>Double</Dropdown.Item>
              <Dropdown.Item onClick={() => setWidgetType("text")}>Triple</Dropdown.Item>
            </DropdownButton>
            <Button onClick={() => setWidgetType("table")}>
              <CustomTitle text={"Table"} icon={"border-all"}/>
            </Button>
            <Button onClick={() => setWidgetType("graphxy")}>
              <CustomTitle text={"Graph"} icon={"chart-line"}/>
            </Button>
          </ButtonGroup>
        </Flex>
        <Container fluid>
          <RowSeparatorDoubleHR/>
          <ContentWidget datasets={datasets} config={keys}/>
          <RowSeparatorDoubleHR/>
          <Row>
            <DatasetElements datasets={datasets}
                             keys={keys}/>
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
    </Fragment>
  )
};
