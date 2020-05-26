import React, {Fragment} from "react";
import Table from "react-bootstrap/Table";
import {TableWidgetContainer} from "./ContentWidgetTable.styled";
import {mapEntries} from "../../../../futuremodules/utils/utils";

export const ContentWidgetTable = ({datasets, config}) => {

  if (!datasets) {
    return <Fragment/>
  }

  const ds = datasets[config.groupKey];

  return (
    <TableWidgetContainer>
      <Table striped bordered hover>
        <thead>
        <tr>
          {ds.headers.map(elem =>
            <th key={elem.name}>
              {elem.name}
            </th>
          )}
        </tr>
        </thead>
        <tbody>
        {mapEntries(ds.sourceData, (k,gk) =>
          <tr key={k}>
            {mapEntries(gk, (kk, elem) =>
              <td key={kk}>
                {elem}
              </td>
            )}
          </tr>
        )}
        </tbody>
      </Table>
    </TableWidgetContainer>
  )
};
