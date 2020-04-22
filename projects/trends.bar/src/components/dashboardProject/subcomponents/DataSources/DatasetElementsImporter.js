import {DangerColorSpan, Flex, Mx1} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {LabelWithRename} from "../../../../futuremodules/labelWithRename/LabelWithRename";
import React from "reactn";
import {Fragment} from "react";
import {onDeleteHeader, renameHeader} from "./DatasetElementsImporterLogic";
import {TableWidgetContainer} from "../ContentWidgets/ContentWidgetTable.styled";
import Table from "react-bootstrap/Table";
import {arrayExistsNotEmpty} from "../../../../futuremodules/utils/utils";

const DeleteHeader = (props) => {
  return (
    <DangerColorSpan onClick={(e) => props.callback(e, props.elem, props.setDatasetI)}>
      <i className="fas fa-minus-circle"/>
    </DangerColorSpan>
  )
};

export const DatasetElementsImporter = ({datasetState}) => {

  console.log("DatasetElementsImporter", datasetState[0]);
  const [datasetI, setDatasetI] = datasetState;

  return (
    <Fragment>
      {arrayExistsNotEmpty(datasetI.sourceData) &&
      <TableWidgetContainer>
        <Table hover>
          <thead>
          <tr>
            <th>Element</th>
            <th>Type</th>
          </tr>
          </thead>
          <tbody>
          {datasetI.headers.map(elem =>
            <tr key={elem.name}>
              <td>
                <Flex>
                  <DeleteHeader elem={elem} setDatasetI={setDatasetI} callback={onDeleteHeader}/>
                  <Mx1/>
                  <div>
                    <b>
                      <LabelWithRename
                        defaultValue={elem.name}
                        updater={(newValue) => renameHeader(elem, newValue)}
                      />
                    </b>
                  </div>
                </Flex>
              </td>
              <td>
                {elem.type}
              </td>
            </tr>
          )}
          </tbody>
        </Table>
      </TableWidgetContainer>
      }
    </Fragment>
  )
};
