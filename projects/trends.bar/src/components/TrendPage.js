import React, {Fragment} from "react";
import CanvasJSReact from '../assets/canvasjs.react';
import {FlexContainer} from "./TrendPageStyle";
import {elaborateDataGraphs, getTrendGraphs,} from "../modules/trends/dataGraphs";
import {sanitizePathRoot} from "../futuremodules/utils/utils";
import {useQuery} from "@apollo/react-hooks";
import {Link, useLocation} from "react-router-dom";
import {Table} from "react-bootstrap";
import {TrendGrid, TrendLayout} from "./common.styled";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const EmptyTrend = (trendId) => {
  return (
    <TrendLayout>
      <TrendGrid>
        <FlexContainer>
          Tread {trendId} is empty, I'm sorry you ended up here, my associates will make sure this won't happen again!
          <Link to={"/"}>{" "}Back to sanity, Marty!</Link>
        </FlexContainer>
      </TrendGrid>
    </TrendLayout>
  )
};

const TrendPage = () => {

  const location = useLocation();
  const trendIdFull = sanitizePathRoot(location.pathname);
  const [username, trendId] = trendIdFull.split("/");

  // const graphDataS = useSubscription(trendGraphSubcription());
  const {data, loading, error} = useQuery(getTrendGraphs(), {variables: {name: username, trendId: trendId}});

  if ((!data && loading === false) || error) {
    return <EmptyTrend trendId={trendId}/>;
  }

  if (loading) {
    return <Fragment/>;
  }
  // console.log("Trendid ", trendId);
  // console.log("Username ", username);
  // console.log(data);

  // const graphData = graphDataS.data ? graphDataS.data.trendGraphMutated.node.trendGraphs : graphDataQ.data.trend.trendGraphs;
  const graphData = data.user.trend.trendGraphs;

  const chartOptions = elaborateDataGraphs(graphData);

  let countries = {};
  for (const elem of graphData) {
    if ( elem.title === "Cases" ) {
      countries[elem.label] = {
        ...countries[elem.label],
        Cases: elem.values[elem.values.length - 1].y
      };
    }
    if ( elem.title === "Deaths" ) {
      countries[elem.label] = {
        ...countries[elem.label],
        Deaths: elem.values[elem.values.length - 1].y
      };
    }
  }
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
            {Object.keys(countries).map((e) => {
              return (
                <tr key={e}>
                  <td>{e}</td>
                  <td>{countries[e].Cases}</td>
                  <td>{countries[e].Deaths}</td>
                </tr>
              )
            })}
            </tbody>
          </Table>
        </FlexContainer>
      </TrendGrid>
    </TrendLayout>
  );
}

export default TrendPage;
