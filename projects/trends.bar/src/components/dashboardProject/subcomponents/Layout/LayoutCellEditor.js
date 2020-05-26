import React, {Fragment} from "reactn";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {ButtonGroup, Dropdown, DropdownButton} from "react-bootstrap";
import {DivBorder, Flex, FlexVertical} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {CustomTitle} from "../../../../futuremodules/reactComponentStyles/reactCommon";
import {DatasetElements} from "../DataSources/DatasetElements";
import {ContentWidget} from "../ContentWidgets/ContentWidget";
import {setWidgetType} from "../../DashBoardProjectLogic";

export const LayoutCellEditor = ({layout, setLayout, config, onClose}) => {

  const datasets = layout.dataSources;
  const keys = config;

  return (
    <Fragment>
      <Modal.Body>
        <Flex alignContent={"center"}>
          <ButtonGroup>
            <DropdownButton as={ButtonGroup} title={<CustomTitle text={"Text "} icon={"layer-group"}/>}>
              <Dropdown.Item onClick={() => setWidgetType("text-single", layout, config.i, setLayout)}>Single</Dropdown.Item>
              <Dropdown.Item onClick={() => setWidgetType("text-subtitle", layout, config.i, setLayout)}>Double</Dropdown.Item>
              <Dropdown.Item onClick={() => setWidgetType("text", layout, config.i, setLayout)}>Triple</Dropdown.Item>
            </DropdownButton>
            <Button onClick={() => setWidgetType("table", layout, config.i, setLayout)}>
              <CustomTitle text={"Table"} icon={"border-all"}/>
            </Button>
            <Button onClick={() => setWidgetType("graphxy", layout, config.i, setLayout)}>
              <CustomTitle text={"Graph"} icon={"chart-line"}/>
            </Button>
          </ButtonGroup>
        </Flex>
        <FlexVertical justifyContent={"center"}>
          <DivBorder margin={"20px 0px"} padding={"10px"} width={"100%"} height={"550px"}>
          <ContentWidget datasets={datasets} config={keys}/>
          </DivBorder>
          <DatasetElements layout={layout} setLayout={setLayout} config={config}/>
        </FlexVertical>
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
