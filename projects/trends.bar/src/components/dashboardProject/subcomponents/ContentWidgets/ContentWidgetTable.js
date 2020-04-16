import "../Layout/react-grid-styles.css"
import "../Layout/react-resizable-styles.css"

import React, {Fragment} from "react";
import Table from "react-bootstrap/Table";
import {getLastValue} from "../../../../modules/trends/layout";
import {useGlobalState} from "../../../../futuremodules/globalhelper/globalHelper";
import {EditingLayoutDataSource} from "../../../../modules/trends/globals";

// export const ContentWidgetTable = ({data, config}) => {
//
//   const getDataRow = (data, query, field) => {
//     return getArrayFromJsonPath(data, query);
//   }
//
//   const getDataColumn = (data, query, field) => {
//     const dataRow = getDataRow(data, query);
//     return dataRow.map((v, i) => (typeof v === "object" && v[field] !== undefined) ? v[field] : null).filter(v => v !== null);
//   }
//
//   const keyData = getDataColumn(data, config.tableKeyQuery, config.tableKeyField);
//   const matrixData = keyData.map(e => {
//     return {key: e, transformedKey: transformData(e, config.tableKeyTransform), tableColumns: []}
//   });
//   for (let c = 0; c < config.tableColumns.length; c++) {
//     const column = config.tableColumns[c];
//     const colDataRow = getDataRow(data, column.query);
//     for (let k = 0; k < matrixData.length; k++) {
//       const colDataColumnIndex = colDataRow.findIndex(e => e[config.tableKeyField] === matrixData[k]["key"]);
//       if (colDataColumnIndex !== -1) {
//         const colDataColumn = colDataRow[colDataColumnIndex][column.field];
//         matrixData[k].tableColumns.push(transformData(colDataColumn, column.transform));
//       } else {
//         matrixData[k].tableColumns.push(null);
//       }
//     }
//   }
//
//   return (
//     <Fragment>
//       <div>
//         <Table striped bordered hover size="sm">
//           <thead>
//           <tr>
//             <th>{config.tableKeyTitle}</th>
//             {
//               config.tableColumns.map((e, i) => (
//                 <th key={'th' + i.toString()}>{e.title}</th>
//               ))
//             }
//           </tr>
//           </thead>
//           <tbody>
//           {
//             matrixData.map((e, i) => (
//               <tr key={"tr" + i.toString()}>
//                 <td>{e.transformedKey}</td>
//                 {
//                   e.tableColumns.map((c, k) => (
//                     <td key={"td" + i.toString() + "-" + k.toString()}>{c}</td>
//                   ))
//                 }
//               </tr>
//             ))
//           }
//           </tbody>
//         </Table>
//       </div>
//     </Fragment>
//   )
// };

export const ContentWidgetTable = ({config}) => {

  const datasets = useGlobalState(EditingLayoutDataSource);

  // const getDataRow = (data, query, field) => {
  //     return getArrayFromJsonPath(data, query);
  // }
  //
  // const getDataColumn = (data, query, field) => {
  //     const dataRow = getDataRow(data, query);
  //     return dataRow.map((v, i) => (typeof v === "object" && v[field] !== undefined) ? v[field] : null).filter(v => v !== null);
  // }
  //
  // const keyData = getDataColumn(data, config.tableKeyQuery, config.tableKeyField);
  // const matrixData = keyData.map(e => {
  //     return {key: e, transformedKey: transformData(e, config.tableKeyTransform), tableColumns: []}
  // });
  // for (let c = 0; c < config.tableColumns.length; c++) {
  //     const column = config.tableColumns[c];
  //     const colDataRow = getDataRow(data, column.query);
  //     for (let k = 0; k < matrixData.length; k++) {
  //         const colDataColumnIndex = colDataRow.findIndex(e => e[config.tableKeyField] === matrixData[k]["key"]);
  //         if (colDataColumnIndex !== -1) {
  //             const colDataColumn = colDataRow[colDataColumnIndex][column.field];
  //             matrixData[k].tableColumns.push(transformData(colDataColumn, column.transform));
  //         } else {
  //             matrixData[k].tableColumns.push(null);
  //         }
  //     }
  // }

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
