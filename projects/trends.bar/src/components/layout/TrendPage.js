import React, {useEffect, useState} from "react";
import {Map, TileLayer} from "react-leaflet";
import CanvasJSReact from '../../assets/canvasjs.react';
import {FlexContainer, H2, TrendGrid} from "./TrendPageStyle";
import {useDispatch, useSelector} from "react-redux";
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const TrendPage = () => {

    const dispatch = useDispatch();
    const trendId = useSelector(state => state.trend.name);
    const [casesGraph, setCasesGraph] = useState({});

  const HELLO_QUERY = gql` 
        {
          hello
        }`;

  const { loading, data } = useQuery( HELLO_QUERY );

  //
  // const entities = useSelector(state => state.entities.entries);
  // const group = useSelector(state => state.entities.groupSelected);
  // const hasResized = useSelector(state => state.wasm.resize);

  const position = [51.505, -0.09];
  const mapStyle = {
    height: "500px",
    width: "100%",
    borderRadius: "4px",
    border: "1px solid var(--middle-grey-color)"
  }

  const options = {
    title: {
      text: "Cases"
    },
    theme: "dark2",
    backgroundColor: "#343a40",
    animationEnabled: true,
    interactivityEnabled: true,
    data: [{
      type: "column",
      dataPoints: [
        {  y: 10  },
        {  y: 15  },
        {  y: 25  },
        {  y: 30  },
        {  y: 28  }
      ]
    }]
  }

  return (
    <div className="trend-layout">
      <TrendGrid>
        <FlexContainer>
          <div>
            Let's see what we got:
            {loading ? <p>Loading</p> : <p>Timestamp: {data.hello}</p>}
            <H2>
              Novel Coronavirus (2019-nCoV)
            </H2>
          </div>
          <div>
            Globally 78811 confirmed (1017 new)<br/>

            China 77042 confirmed (650 new)
            2445 deaths (97 new)<br/>

            Outside of China 1769 confirmed (367 new)
            28 countries
            17 deaths (6 new)
          </div>
          <CanvasJSChart options = {options}
            /* onRef = {ref => this.chart = ref} */
          />
        </FlexContainer>
        <FlexContainer>
          <Map center={position} zoom="3" style={mapStyle}>
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

//
// <JqxBarGauge
//   className="myCustomClass myCustomClassTwo"
//   style={{marginTop: 100, marginLeft: 100}}
//   width={600} height={600} max={barState.max} values={barState.values}
// />
