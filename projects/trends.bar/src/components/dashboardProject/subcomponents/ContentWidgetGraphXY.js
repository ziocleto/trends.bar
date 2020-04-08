import "./react-grid-styles.css"
import "./react-resizable-styles.css"

import React, {Fragment, useState, useRef, useEffect} from "react";
import {getArrayFromJsonPath} from "../../../modules/trends/jsonPath";
import {transformData} from "../../../modules/trends/dataTransformer";
import uniqueId from "lodash/uniqueId";
// import CanvasJSReact from '../../../assets/canvasjs.react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
//import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";

am4core.useTheme(am4themes_dark);


// var CanvasJS = CanvasJSReact.CanvasJS;
// var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export const ContentWidgetGraphXY = ({data,config}) => {

    let chart = useRef();

    let grafo = null;
    const [graphId] = useState(uniqueId('graph-'));

    useEffect(() => {
        console.log('mounted ');

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
                    // type: "area",
                    // showInLegend: true,
                    // fillOpacity: 0.3,
                    data: serieData
                });
            } catch (ex) {
                console.log("Error building graphxy", ex)
            }
        }

        let chart = am4core.create(graphId, am4charts.XYChart);

        chart.paddingRight = 20;

        // let data = [];
        // for (let i = 1; i < 366; i++) {
        //     visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
        //     data.push({ date: new Date(2018, 0, i), name: "name" + i, value: visits });
        // }

        // chart.data = graphData[0].data;

        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 50;
        dateAxis.renderer.grid.template.location = 0.5;
        dateAxis.startLocation = 0.5;
        dateAxis.endLocation = 0.5;

// Create value axis
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

        graphData.forEach((e,i) => {
            console.log(`Serie: ${e.name}`);
            console.log(`${JSON.stringify(e.data)}`);
            let series = chart.series.push(new am4charts.LineSeries());
            series.name=e.name;
            series.dataFields.valueY = "y";
            series.dataFields.dateX = "label";
            series.tooltipText = "{dateX.formatDate(dd/MM)} - {name} {valueY.value}";
            series.strokeWidth = 3;
            series.tensionX = 0.8;
            series.bullets.push(new am4charts.CircleBullet());
            series.data = e.data;
        });

        chart.cursor = new am4charts.XYCursor();
        // let scrollbarX = new am4charts.XYChartScrollbar();
        // scrollbarX.series.push(series);
        // chart.scrollbarX = scrollbarX;

        grafo = chart;

        return () => {
            console.log('will unmount');
            if (grafo) {
                grafo.dispose();
            }
        }
    }, [data,config]);

    //console.log("GRAPHDATA:", JSON.stringify(graphData[0].data));

    // const itemclick = e => {
    //     if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
    //         e.dataSeries.visible = false;
    //     } else {
    //         e.dataSeries.visible = true;
    //     }
    //     e.chart.render();
    // };
    //
    // const options = {
    //     zoomEnabled: true,
    //     axisX: {
    //         valueFormatString: "DD MMM"
    //     },
    //     title: {
    //         text: config.graphXYTitle
    //     },
    //     legend: {
    //         cursor: "pointer",
    //         itemclick: itemclick
    //     },
    //     theme: "dark1",
    //     backgroundColor: "#00000000",
    //     animationEnabled: true,
    //     interactivityEnabled: true,
    //
    //     data: graphData
    // };
    //
    // const containerProps = {
    //     height: "100%"
    // };
    return (
        <Fragment>
            <div id={graphId} style={{ width: "100%", height: "100%" }}></div>
            {/*<CanvasJSChart*/}
            {/*    // im using the index just for the example*/}
            {/*    // you will only need to use dataPoints.toString().*/}
            {/*    // when the data is not the same as the previous data*/}
            {/*    // it will remount the component and trigger the animation*/}
            {/*    key={graphData.toString()}*/}
            {/*    options={options}*/}
            {/*    containerProps = {containerProps}*/}
            {/*    onRef={ref => (chart.current = ref)}*/}
            {/*/>*/}
        </Fragment>
    );
}
