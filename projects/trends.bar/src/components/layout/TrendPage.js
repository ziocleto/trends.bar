import React from "react";
import {Map, TileLayer} from "react-leaflet";
import CanvasJSReact from '../../assets/canvasjs.react';
import {FlexContainer, H2, TrendGraph, TrendGrid} from "./TrendPageStyle";
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";
import {useGlobal} from "reactn";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const TrendPage = props => {

  const [trendId, setTrendId] = useGlobal('trendId');
  const [loading, setLoading] = useGlobal('loading');

  if (!trendId) {
    setTrendId(props.match.params.id);
  }

  const TREND_QUERY = gql`
      {
          trendGraphs (trendId: "${trendId}") {
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
  `;

  const {data, loadingStatus} = useQuery(TREND_QUERY);
  if (loadingStatus !== loading) {
    setLoading(loadingStatus);
  }

  const position = [51.505, -0.09];
  const mapStyle = {
    height: "500px",
    width: "100%",
    borderRadius: "4px",
    border: "1px solid var(--middle-grey-color)"
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

  if (data) {
    let counter = 0;
    for (const trendGraph of data.trendGraphs) {
      let dpoints = [];
      const themeIndex = (counter%2+1);
      const titleColor = themeIndex !== 1 ? "#8ae9e9" : "#e76848";
      for (const p of trendGraph.values) {
        dpoints.push({x: new Date(p[0]), y: p[1]});
      }

      const option = {
        ...optionsBase,
        title: {
          text: trendGraph.graph.label,
          fontColor: titleColor
        },
        theme: "dark" + themeIndex.toString(),
        data: [{
          type: "splineArea",
          dataPoints: dpoints
        }]
      };
      chartsOptions.push(option);
      counter++;
    }
  }

  return (
    <div className="trend-layout">
      <TrendGrid>
        <FlexContainer>
          <div>
            <H2>
              Novel Coronavirus (2019-nCoV)
            </H2>
          </div>
          {chartsOptions && chartsOptions.map(item =>
            <TrendGraph>
              <CanvasJSChart key={item.title.text} options={item}/>
            </TrendGraph>
          )}
        </FlexContainer>
        <FlexContainer>
          <Map
            center={position}
            zoom="3"
            style={mapStyle}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </Map>
        </FlexContainer>
      </TrendGrid>
    </div>
  );
}

export default TrendPage;

// //
// //
// <JqxBarGauge
// //   className="myCustomClass myCustomClassTwo"
// //   style={{marginTop: 100, marginLeft: 100}}
// //   width={600} height={600} max={barState.max} values={barState.values}
// // />
