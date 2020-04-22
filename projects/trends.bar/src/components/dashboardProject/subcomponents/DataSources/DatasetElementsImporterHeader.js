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

export const DatasetElementsImporterHeader = ({state, dispatch, layout, setLayout}) => {

  const importDataSource = useImportDataSource();

  return (
    <Fragment>
      <Row>
        <Col>
          <Flex>
            <div>
              <Button variant={"success"}
                      onClick={() => importDataSource(layout, setLayout, state, dispatch)}>
                Use
              </Button>
            </div>
            <div>
              <ButtonDiv onClick={() => dispatch([editingDataSourceD, null])}>
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
            defaultValue={state.editingDataSource.name}
            updater={(newValue) => renameScript(newValue, state.editingDataSource, setLayout)}
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
            {state.editingDataSource.sourceDocument}
          </LightTextSpan>
        </Col>
      </Row>
    </Fragment>
  )
};
