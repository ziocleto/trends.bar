import {Fragment} from "react";
import {Button, Col, Row} from "react-bootstrap";
import {
  ButtonDiv,
  Flex,
  LightTextSpan,
  SecondaryAltColorTextSpanBold
} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {RowSeparator} from "../../../../futuremodules/reactComponentStyles/reactCommon";
import {LabelWithRename} from "../../../../futuremodules/labelWithRename/LabelWithRename";
import React from "reactn";
import {renameScript, useImportDataSource} from "./DatasetElementsImporterHeaderLogic";
import {editingDataSourceD} from "../../../dashboardUser/DashboardUserLogic";

export const DatasetElementsImporterHeader = ({state, dispatch, datasetI, setDatasetI, setLayout}) => {

  const importDataSource = useImportDataSource(datasetI, setLayout, dispatch);

  return (
    <Fragment>
      <Row>
        <Col>
          <Flex>
            <div>
              <Button variant={"success"}
                      onClick={() => importDataSource()}>
                Import
              </Button>
            </div>
            <div>
              <ButtonDiv onClick={() => dispatch([editingDataSourceD, false])}>
                <b><i className="fas fa-times"/></b>
              </ButtonDiv>
            </div>
          </Flex>
        </Col>
      </Row>
      <RowSeparator/>
      <Row>
        <Col sm={2}>
          <SecondaryAltColorTextSpanBold>Name:</SecondaryAltColorTextSpanBold>
        </Col>
        <Col sm={10}>
          <LabelWithRename
            defaultValue={state.editingDataSource && datasetI.name}
            updater={(newValue) => renameScript(newValue, datasetI, setDatasetI)}
          />
        </Col>
      </Row>
      <RowSeparator/>
      <Row>
        <Col sm={2}>
          <SecondaryAltColorTextSpanBold>Source:</SecondaryAltColorTextSpanBold>
        </Col>
        <Col sm={10}>
          <LightTextSpan>
            {state.editingDataSource && datasetI.sourceDocument}
          </LightTextSpan>
        </Col>
      </Row>
    </Fragment>
  )
};
