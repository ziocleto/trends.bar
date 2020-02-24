import React from "react";
import {Map, TileLayer} from "react-leaflet";
import styled from 'styled-components'
import 'jqwidgets-scripts/jqwidgets/styles/jqx.base.css';
import JqxBarGauge from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbargauge';

const TrendPage = () => {
  // const dispatch = useDispatch();
  //
  // const currentEntity = useSelector(state => state.entities.currentEntity);
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

  const barState = {
    max: 200,
    values: [102, 115, 130, 137]
  };

  const H3 = styled.h3` {
    color: var(--scheme-color-3)
  }`;

  const TrendGrid = styled.div` {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-areas: "trendLeft trendRight";
    box-sizing: border-box;
    margin: 10px;
  }`;

  const FlexContainer = styled.div` {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;    
    align-content: flex-start;
    align-items: flex-start;
    font-size: 13px;
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
  }`;


  return (
    <div className="trend-layout">
      <TrendGrid>
        <FlexContainer>
          <div>
            <H3>
              Novel Coronavirus (2019-nCoV)
            </H3>
          </div>
          <div>
            Globally 78811 confirmed (1017 new)<br/>

            China 77042 confirmed (650 new)
            2445 deaths (97 new)<br/>

            Outside of China 1769 confirmed (367 new)
            28 countries
            17 deaths (6 new)
          </div>
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
