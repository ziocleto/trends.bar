import React, {Fragment} from "react";
import Table from "react-bootstrap/Table";
import {getLastValue} from "../../../../modules/trends/layout";

export const ContentWidgetTable = ({datasets, config}) => {

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
          <th key={elem}>
            {elem}
          </th>
        )}
      </tr>
      </thead>
      <tbody>
      {Object.keys(datasets[config.groupKey]).map(gk =>
        <tr key={gk}>
          <td>
            {gk}
          </td>
          {Object.keys(datasets[config.groupKey][vn]).map(elem =>
            <td key={config.groupKey+ gk+ elem}>
              {getLastValue(config.groupKey, gk, elem, datasets)}
            </td>
          )}
        </tr>
      )}
      </tbody>
    </Table>
  )
};
