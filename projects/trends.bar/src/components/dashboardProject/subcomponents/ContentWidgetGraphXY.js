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
    for (let i=0;i<config.series.length;i++) {
        try {
            const serieData = getArrayFromJsonPath(data, config.series[i].query).map(e => {
                const serieRow = {
                    label: transformData(e[config.series[i].fieldX], config.series[i].transformX),
                    y: transformData(e[config.series[i].fieldY], config.series[i].transformY)
                }
                return serieRow;
            });
            graphData.push({
                name: config.series[i].title,
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

    const options = {
        title: {
            text: config.title
        },
        animationEnabled: true,
        theme: "dark2",
        toolTip:{
            content: "{name} {label}: {y}"
        },
        legend: {
            horizontalAlign: "center", // "center" , "right"
            verticalAlign: "bottom",  // "top" , "bottom"
            fontSize: 15
        },
        axisX:{
            interlacedColor: "#202020",
            labelAngle: -45,
            interval: graphData.length===0 || graphData[0].dataPoints.length<30?1:Math.ceil(graphData[0].dataPoints.length/30)
        },
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