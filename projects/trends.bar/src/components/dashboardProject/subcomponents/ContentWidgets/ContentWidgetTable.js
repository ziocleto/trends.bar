import React, {Fragment} from "react";
import Table from "react-bootstrap/Table";
import {TableWidgetContainer} from "./ContentWidgetTable.styled";

export const ContentWidgetTable = ({datasets, config}) => {

  if (!datasets) {
    return <Fragment/>
  }

  const dsIndex = 0;
  const ds = datasets[dsIndex];

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
        {ds.sourceData.map(gk =>
          <tr key={gk}>
            {gk.map(elem =>
              <td>
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
