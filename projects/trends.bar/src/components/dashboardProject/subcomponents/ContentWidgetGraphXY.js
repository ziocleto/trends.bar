import "./react-grid-styles.css"
import "./react-resizable-styles.css"

import React, {Fragment, useRef} from "react";
import {getArrayFromJsonPath} from "../../../modules/trends/jsonPath";
import {transformData} from "../../../modules/trends/dataTransformer";
import CanvasJSReact from'../../../assets/canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export const ContentWidgetGraphXY = ({data,config}) => {

    let chart = useRef();
    const graphData=[];
    for (let i=0;i<config.graphXYSeries.length;i++) {
        try {
            const serieData = getArrayFromJsonPath(data, config.graphXYSeries[i].query).map(e => {
                const serieRow = {
                    label: transformData(e[config.graphXYSeries[i].fieldX], config.graphXYSeries[i].transformX),
                    y: transformData(e[config.graphXYSeries[i].fieldY], config.graphXYSeries[i].transformY)
                }
                return serieRow;
            });
            graphData.push({
                name: config.graphXYSeries[i].title,
                type: "area",
                showInLegend: true,
                fillOpacity: 0.3,
                dataPoints: serieData
            });
        } catch (ex) {
            console.log("Error building graphxy", ex)
        }
    }
    //console.log("GRAPHDATA:", JSON.stringify(graphData[0].data));

    const itemclick = e => {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    };

    const options = {
        zoomEnabled: true,
        axisX: {
            valueFormatString: "DD MMM"
        },
        title: {
            text: config.graphXYTitle
        },
        legend: {
            cursor: "pointer",
            itemclick: itemclick
        },
        theme: "dark1",
        backgroundColor: "#00000000",
        animationEnabled: true,
        interactivityEnabled: true,

        data: graphData
    };

    const containerProps = {
        height: "100%"
    };
    return (
        <Fragment>
            <CanvasJSChart
                // im using the index just for the example
                // you will only need to use dataPoints.toString().
                // when the data is not the same as the previous data
                // it will remount the component and trigger the animation
                key={graphData.toString()}
                options={options}
                containerProps = {containerProps}
                onRef={ref => (chart.current = ref)}
            />
        </Fragment>
    );
}
