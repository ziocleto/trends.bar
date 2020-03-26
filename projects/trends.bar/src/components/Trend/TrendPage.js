import React, {Fragment, useState} from "react";
import CanvasJSReact from '../../assets/canvasjs.react';
import {FlexContainer, LinkBack, TH, TR, TrendSpan} from "./TrendPageStyle";
import {elaborateDataGraphs, getTrendGraphs, groupData,} from "../../modules/trends/dataGraphs";
import {sanitizePathRoot} from "../../futuremodules/utils/utils";
import {useQuery} from "@apollo/react-hooks";
import {Link, useLocation} from "react-router-dom";
import {Table} from "react-bootstrap";
import {TrendGrid, TrendLayout} from "../common.styled";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const EmptyTrend = ({trendId}) => {
  return (
    <TrendLayout>
      <TrendGrid>
        <FlexContainer>
          <p>
          Trend <TrendSpan>{trendId}</TrendSpan> is empty!
          </p>
          <p>
          I'm sorry you ended up here, my associates will make sure this won't happen again!
          </p>
        </FlexContainer>
        <FlexContainer>
          <Link to={"/"}><LinkBack>Back to sanity, Marty!</LinkBack></Link>
        </FlexContainer>
      </TrendGrid>
    </TrendLayout>
  )
};

const TrendPage = () => {

  const trendVariables = ["Country", "Cases", "Deaths", "Recovered"];
  const groupBy = trendVariables[0];
  const groupFields = [trendVariables[1], trendVariables[2], trendVariables[3]];

  const location = useLocation();
  const trendIdFull = sanitizePathRoot(location.pathname);
  const [username, trendId] = trendIdFull.split("/");
  const [sortIndex, setSortIndex] = useState(groupFields[0]);
  const [sortOrder, setSortOrder] = useState(1);
  const [trendGroup, setTrendGroup] = useState("Italy");

  // const graphDataS = useSubscription(trendGraphSubcription());
  const {data, loading, error} = useQuery(getTrendGraphs(), {variables: {name: username, trendId: trendId}});

  if (loading) {
    return <Fragment/>;
  }

  if ((!data && loading === false) || (loading === false && !data.user) || (loading === false && !data.user.trend) || error) {
    return <EmptyTrend trendId={trendId}/>;
  }

  const graphData = data.user.trend.trendGraphs;
  const chartOptions = elaborateDataGraphs(graphData, trendGroup, groupFields);
  const finalData = groupData(graphData, ["label", groupBy], groupFields, sortIndex, sortOrder);

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
              {
                trendVariables.map(elem =>
                  (<TH key={elem}
                    onClick={() => {
                      setSortIndex(elem);
                      setSortOrder(sortOrder === 1 ? -1 : 1);
                    }}>
                    {elem}
                  </TH>)
                )
              }
            </tr>
            </thead>
            <tbody>
            {finalData.map((e) => {
              return (
                <TR key={e[trendVariables[0]]} onClick={() => {
                  setTrendGroup(e[trendVariables[0]]);
                }}>
                  {trendVariables.map(elem => (<td>{e[elem]}</td>))}
                </TR>
              )
            })}
            </tbody>
          </Table>
        </FlexContainer>
      </TrendGrid>
    </TrendLayout>
  );
};

export default TrendPage;
