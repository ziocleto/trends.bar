import {DangerColorSpan, Div, LightTextSpan} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {LabelWithRename} from "../../../../futuremodules/labelWithRename/LabelWithRename";
import React from "reactn";
import {Fragment} from "react";
import {onDeleteHeader, renameHeader} from "./DatasetElementsImporterLogic";
import {TableWidgetContainer} from "../ContentWidgets/ContentWidgetTable.styled";
import Table from "react-bootstrap/Table";
import {arrayExistsNotEmpty} from "../../../../futuremodules/utils/utils";
import {FAIcon} from "../../../../futuremodules/reactComponentStyles/reactCommon";
import {Col, Row} from "react-bootstrap";

const DeleteHeader = (props) => {
  return (
    <DangerColorSpan onClick={(e) => props.callback(e, props.elem, props.setDatasetI)}>
      <FAIcon icon={"minus-circle"}/>
    </DangerColorSpan>
  )
};

export const DatasetElementsImporter = ({datasetState}) => {

  const [datasetI, setDatasetI] = datasetState;

  return (
    <Fragment>
      <Row>
        <Col md={{span: 8, offset: 2}}>
          {arrayExistsNotEmpty(datasetI.sourceData) &&
          <TableWidgetContainer>
            <Table hover>
              <thead>
              <tr>
                <th>{" "}</th>
                <th>Element name</th>
                <th>Type</th>
                <th>Display name</th>
              </tr>
              </thead>
              <tbody>
              {datasetI.headers.map(elem =>
                <tr key={elem.name}>
                  <td>
                    <DeleteHeader elem={elem} setDatasetI={setDatasetI} callback={onDeleteHeader}/>
                  </td>
                  <td>
                    <LightTextSpan>
                    {elem.name}
                    </LightTextSpan>
                  </td>
                  <td>
                    {elem.type}
                  </td>
                  <td>
                    <strong>
                      <LabelWithRename
                        defaultValue={elem.displayName}
                        updater={(newValue) => renameHeader(elem.name, newValue, setDatasetI)}
                      />
                    </strong>
                  </td>
                </tr>
              )}
              </tbody>
            </Table>
          </TableWidgetContainer>
          }
        </Col>
      </Row>
    </Fragment>
  )
};
