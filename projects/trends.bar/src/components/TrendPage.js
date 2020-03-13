import React, {Fragment} from "react";
import CanvasJSReact from '../assets/canvasjs.react';
import {FlexContainer, TrendGraph, TrendGrid} from "./TrendPageStyle";
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";
import {useGlobal} from "reactn";
import {Button} from "react-bootstrap";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const TrendPage = props => {

  const [loading, setLoading] = useGlobal('loading');

  const trendId = props.trendId;

  const TREND_QUERY = gql`{
      trend (trendId: "${trendId}") {
          trendId
          aliases
          trendGraphs {
              dataset {
                  source
                  sourceName
              }
              graph {
                  label
                  subLabel
              }
              values
          }
      }
  }`;

  const {data, loadingStatus} = useQuery(TREND_QUERY);
  if (loadingStatus !== loading) {
    setLoading(loadingStatus);
  }

  if (data === undefined || data.trend.trendGraphs.length === 0) {
    return <Fragment/>
  }

  const optionsBase = {
    axisX: {
      valueFormatString: "DD MMM"
    },
    axisY: {
      title: "Number"
    },
    backgroundColor: "#343a40",
    animationEnabled: true,
    interactivityEnabled: true,
  }

  let chartsOptions = [];

  const sortByXGraph = (a, b) => {
    if (a.x < b.x) {
      return -1;
    }
    if (a.x > b.x) {
      return 1;
    }
    return 0;
  }

  if (data) {
    let allPoints = [];
    for (const trendGraph of data.trend.trendGraphs) {
      let dpoints = [];
      if ((trendGraph.graph.label === "Cases" && trendGraph.graph.subLabel === "Worldwide") ||
        (trendGraph.graph.label === "Deaths" && trendGraph.graph.subLabel === "Worldwide")) {
        for (const p of trendGraph.values) {
          dpoints.push({x: new Date(p[0]), y: p[1]});
        }
        dpoints.sort(sortByXGraph);
        allPoints.push(dpoints);
      }
    }

    const option = {
      ...optionsBase,
      title: {
        text:"Worldwide situation",
      },
      theme: "dark1",
      data: [{
        type: "splineArea",
        dataPoints: allPoints[0]
      },
        {
          type: "splineArea",
          dataPoints: allPoints[1]
        }]
    };
    chartsOptions.push(option);
    console.log(allPoints);
  }

  const updateTrend = () => {};

  return (
    <div className="trend-layout">
      <TrendGrid>
        <Button onClick={updateTrend}>Update</Button>
        <FlexContainer>
          {chartsOptions && chartsOptions.map(item =>
            <TrendGraph>
              <CanvasJSChart key={item.key} options={item}/>
            </TrendGraph>
          )}
        </FlexContainer>
        <FlexContainer>
        </FlexContainer>
      </TrendGrid>
    </div>
  );
}

export default TrendPage;
