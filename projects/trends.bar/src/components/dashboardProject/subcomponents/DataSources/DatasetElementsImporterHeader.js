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
import {publishGraphs, renameScript} from "./DatasetElementsImporterHeaderLogic";

export const DatasetElementsImporterHeader = ({isEditingDataSource, setEditingDataSource, graphTree, setGraphTree, layout, setLayout}) => {
  return (
    <Fragment>
      <Row>
        <Col>
          <Flex>
            <div>
              <Button variant={"success"}
                      onClick={() => publishGraphs()}>
                Import
              </Button>
            </div>
            <div>
              <ButtonDiv onClick={() => setEditingDataSource(false).then()}>
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
            defaultValue={isEditingDataSource && graphTree.script.name}
            updater={(newValue) => renameScript(newValue, graphTree, setGraphTree)}
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
            {isEditingDataSource && graphTree.script.sourceDocument}
          </LightTextSpan>
        </Col>
      </Row>
    </Fragment>

  )
};
