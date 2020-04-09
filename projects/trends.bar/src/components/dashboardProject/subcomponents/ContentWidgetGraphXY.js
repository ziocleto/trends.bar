import "./react-grid-styles.css"
import "./react-resizable-styles.css"

import React, {useEffect, useState} from "react";
import {getArrayFromJsonPath} from "../../../modules/trends/jsonPath";
import {transformData} from "../../../modules/trends/dataTransformer";
import uniqueId from "lodash/uniqueId";
import numeraljs from 'numeraljs'
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
//import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";

am4core.useTheme(am4themes_dark);


// var CanvasJS = CanvasJSReact.CanvasJS;
// var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export const ContentWidgetGraphXY = ({data, config}) => {

  // let chart = useRef();

  // let grafo = null;
  const [graphId] = useState(uniqueId('graph-'));

  useEffect(() => {

    const graphData = [];
    for (let i = 0; i < config.graphXYSeries.length; i++) {
      try {
        const serieData = getArrayFromJsonPath(data, config.graphXYSeries[i].query).map(e => {
          const serieRow = {
            x: transformData(e[config.graphXYSeries[i].fieldX], config.graphXYSeries[i].transformX),
            y: transformData(e[config.graphXYSeries[i].fieldY], config.graphXYSeries[i].transformY)
          }
          return serieRow;
        });
        graphData.push({
          name: config.graphXYSeries[i].title,
          data: serieData
        });
      } catch (ex) {
      }
    }

    let chart = am4core.create(graphId, am4charts.XYChart);

    chart.paddingRight = 20;

    let xAxis = null;
    if (config.graphXYXDataType === "value") {
      xAxis = chart.xAxes.push(new am4charts.ValueAxis());
    } else if (config.graphXYXDataType === "category") {
      xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    } else {
      xAxis = chart.xAxes.push(new am4charts.DateAxis());
    }

    xAxis.renderer.minGridDistance = 50;
    xAxis.renderer.grid.template.location = 0.5;
    xAxis.startLocation = 0.5;
    xAxis.endLocation = 0.5;

    // Create value axis
    chart.yAxes.push(new am4charts.ValueAxis());

    graphData.forEach((e, i) => {
      let series = chart.series.push(new am4charts.LineSeries());
      series.name = e.name;
      series.dataFields.valueY = "y";
      if (config.graphXYXDataType === "value") {
        series.dataFields.valueX = "x";
        series.tooltipText = "{valueX} - {name} {valueY.value}";
      } else if (config.graphXYXDataType === "category") {
        series.dataFields.categoryX = "x";
        series.tooltipText = "{categoryX} - {name} {valueY.value}";
      } else {
        series.dataFields.dateX = "x";
        series.tooltipText = "{dateX.formatDate(dd/MM)} - {name} {valueY.value}";
      }
      if (config.graphXYSeries[i].fillArea === "true") {
        series.fillOpacity = 0.2;
      } else {
        series.fillOpacity = 0;
      }

      if (numeraljs(config.graphXYSeries[i].lineWidth).value() === 0) {
        series.strokeWidth = 1;
      } else {
        series.strokeWidth = numeraljs(config.graphXYSeries[i].lineWidth).value();
      }
      series.strokeDasharray = config.graphXYSeries[i].lineStyle;
      series.tensionX = 1;
      if (config.graphXYSeries[i].bullet === "square") {
        let bullet = series.bullets.push(new am4charts.Bullet());
        let square = bullet.createChild(am4core.Rectangle);
        square.width = 5;
        square.height = 5;
        square.horizontalCenter = "middle";
        square.verticalCenter = "middle";
      } else if (config.graphXYSeries[i].bullet === "circle") {
        let bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.radius = 2.5;
      }
      series.data = e.data;
    });

    chart.cursor = new am4charts.XYCursor();
    // let scrollbarX = new am4charts.XYChartScrollbar();
    // scrollbarX.series.push(series);
    // chart.scrollbarX = scrollbarX;

    // grafo = chart;

    return () => {
      if (chart) {
        chart.dispose();
      }
    }
  }, [data, config, graphId]);

  return (
    <div id={graphId} style={{width: "100%", height: "100%"}}></div>
  );
}
