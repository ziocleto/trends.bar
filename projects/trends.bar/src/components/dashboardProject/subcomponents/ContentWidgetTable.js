import "./react-grid-styles.css"
import "./react-resizable-styles.css"

import React, {Fragment} from "react";
import {getArrayFromJsonPath} from "../../../modules/trends/jsonPath";
import {transformData} from "../../../modules/trends/dataTransformer";
import Table from "react-bootstrap/Table";

export const ContentWidgetTable = ({data,config}) => {

    const getDataRow = (data,query,field) => {
        return getArrayFromJsonPath(data,query);
    }

    const getDataColumn = (data,query,field) => {
        const dataRow = getDataRow(data,query);
        return dataRow.map((v,i)=>(typeof v==="object" && v[field]!==undefined)?v[field]:null).filter(v => v!==null);
    }

    const keyData = getDataColumn(data, config.keyQuery, config.keyField);
    const matrixData = keyData.map(e => { return { key: e, transformedKey: transformData(e,config.keyTransform), columns: []}});
    for (let c=0;c<config.columns.length;c++) {
        const column = config.columns[c];
        const colDataRow = getDataRow(data,column.query);
        for (let k=0;k<matrixData.length;k++) {
            const colDataColumnIndex=colDataRow.findIndex(e => e[config.keyField]===matrixData[k]["key"]);
            if (colDataColumnIndex!==-1) {
                const colDataColumn = colDataRow[colDataColumnIndex][column.field];
                matrixData[k].columns.push(transformData(colDataColumn, column.transform));
            } else {
                matrixData[k].columns.push(null);
            }
        }
    }

    //console.log("MATRIX: ",JSON.stringify(matrixData));

    //console.log("KEYDATA",JSON.stringify(keyData));

    return (
        <Fragment>
            <div>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>{config.keyTitle}</th>
                            {
                                config.columns.map( (e,i) => (
                                    <th key={'th'+i.toString()}>{e.title}</th>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            matrixData.map( (e,i) => (
                                <tr key={"tr"+i.toString()}>
                                    <td>{e.transformedKey}</td>
                                    {
                                        e.columns.map((c,k)=> (
                                            <td key={"td"+i.toString()+"-"+k.toString()}>{c}</td>
                                        ))
                                    }
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </div>
        </Fragment>
    )
}
