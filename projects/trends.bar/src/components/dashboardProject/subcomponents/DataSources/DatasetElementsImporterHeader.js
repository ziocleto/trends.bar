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

export const DatasetElementsImporterHeader = ({isEditingDataSource, setEditingDataSource, datasetI, setDatasetI, layout, setLayout}) => {

  const importDataSource = useImportDataSource(datasetI, layout, setLayout, setEditingDataSource);

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
              <ButtonDiv onClick={() => setEditingDataSource(false)}>
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
            defaultValue={isEditingDataSource && datasetI.name}
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
            {isEditingDataSource && datasetI.sourceDocument}
          </LightTextSpan>
        </Col>
      </Row>
    </Fragment>

  )
};
