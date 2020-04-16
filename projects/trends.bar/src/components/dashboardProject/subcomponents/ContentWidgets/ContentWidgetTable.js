import "../Layout/react-grid-styles.css"
import "../Layout/react-resizable-styles.css"

import React, {Fragment} from "react";
import Table from "react-bootstrap/Table";
import {getLastValue} from "../../../../modules/trends/layout";
import {useGlobalState} from "../../../../futuremodules/globalhelper/globalHelper";
import {EditingLayoutDataSource} from "../../../../modules/trends/globals";

export const ContentWidgetTable = ({config}) => {

  const datasets = useGlobalState(EditingLayoutDataSource);

  if (!datasets) {
    return <Fragment/>
  }

  const vn = Object.keys(datasets[config.groupKey])[0];

  return (
    <Table striped bordered hover>
      <thead>
      <tr>
        <th>{config.groupKey}</th>
        {Object.keys(datasets[config.groupKey][vn]).map(elem =>
          <th>
            {elem}
          </th>
        )}
      </tr>
      </thead>
      <tbody>
      {Object.keys(datasets[config.groupKey]).map(gk =>
        <tr>
          <td>
            {gk}
          </td>
          {Object.keys(datasets[config.groupKey][vn]).map(elem =>
            <td>
              {getLastValue(config.groupKey, gk, elem, datasets)}
            </td>
          )}
        </tr>
      )}
      </tbody>
    </Table>
  )
};
