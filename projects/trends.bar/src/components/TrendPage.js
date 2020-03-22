import React from "react";
import CanvasJSReact from '../assets/canvasjs.react';
import {FlexContainer} from "./TrendPageStyle";
import {elaborateDataGraphs, getTrendGraphs,} from "../modules/trends/dataGraphs";
import {sanitizePathRoot} from "../futuremodules/utils/utils";
import {useQuery, useSubscription} from "@apollo/react-hooks";
import {trendGraphSubcription} from "../modules/trends/subscriptions";
import {Link, useLocation} from "react-router-dom";
import {Table} from "react-bootstrap";
import {TrendGrid, TrendLayout} from "./common.styled";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const emptyTrend = (trendId) => {
  return (
    <TrendLayout>
      <TrendGrid>
        <FlexContainer>
          Tread {trendId} is empty, have a look at the hot trends, like, you guessed it...
          <Link to={"/coronavirus"}>{" "}CoronaVirus</Link>
        </FlexContainer>
      </TrendGrid>
    </TrendLayout>
  )
};

const TrendPage = () => {

  const location = useLocation();
  const trendIdFull = sanitizePathRoot(location.pathname);
  const [, trendId] = trendIdFull.split("/");

  const graphDataS = useSubscription(trendGraphSubcription());
  const graphDataQ = useQuery(getTrendGraphs(trendId));

  if ( !graphDataQ.data ) {
    return emptyTrend(trendId);
  }

  console.log("Trendid ", trendId)
  console.log(graphDataQ);

  const graphData = graphDataS.data ? graphDataS.data.trendGraphMutated.node.trendGraphs : graphDataQ.data.trend.trendGraphs;

  const chartOptions = elaborateDataGraphs(graphData);

  let countries = [];
  // for ( const elem of graphData.trend.trendGraphs ) {
  //   countries.push( {
  //     country: elem.graph.subLabel,
  //     cases: elem.values.
  //   });
  // }
  // console.log(graphData);

  return (
    <TrendLayout>
      <TrendGrid>
        <FlexContainer>
          <CanvasJSChart options={chartOptions}/>
        </FlexContainer>
        <FlexContainer>
          <Table striped bordered hover variant="dark" size="sm">
            <thead>
            <tr>
              <th>Country</th>
              <th>Cases</th>
              <th>Deaths</th>
            </tr>
            </thead>
            <tbody>
              {countries.map( (e) => {
                return (
                <tr key={e}>
                 <td>{e}</td>
                </tr>
                )
              } )}
            <tr>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <td colSpan="2">Larry the Bird</td>
              <td>@twitter</td>
            </tr>
            </tbody>
          </Table>
        </FlexContainer>
      </TrendGrid>
    </TrendLayout>
  );
}

export default TrendPage;
