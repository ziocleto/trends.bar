import React, {Fragment, useState} from "react";
import CanvasJSReact from '../../assets/canvasjs.react';
import {FlexContainer, LinkBack, TDAMBER, TDGREEN, TDRED, TH, TR, TrendSpan} from "./TrendPageStyle";
import {
  elaborateDataGraphs,
  getFirstDerivative,
  getTrendGraphs,
  groupData,
  groupDataWithDerivatives,
} from "../../modules/trends/dataGraphs";
import {sanitizePathRoot} from "../../futuremodules/utils/utils";
import {useQuery} from "@apollo/react-hooks";
import {Link, useLocation} from "react-router-dom";
import {Table} from "react-bootstrap";
import {TrendGrid} from "../common.styled";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const EmptyTrend = ({trendId}) => {
  return (
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
  )
};

const TrendPage = () => {

  // const trendVariables = ["Country", "Cases", "Deaths", "Recovered", "Cases velocity", "Deaths velocity", "Recovered velocity"];
  const trendVariables = ["Country", "Cases", "Deaths", "Recovered"];
  const trendVariablesDerivatives = ["Country", "Cases", "Cases(New)", "Cases(%)", "Deaths", "Deaths(New)", "Deaths(%)", "Recovered", "Recovered(New)", "Recovered(%)"];
  const trendVariablesDerivativesHeader = ["Country", "Cases", "New", "Change", "Deaths", "New", "Change", "Recovered", "New", "Change"];
  const groupBy = trendVariables[0];
  const groupFields = trendVariables.slice(1, trendVariables.length);

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

  let graphData = data.user.trend.trendGraphs;
  const chartOptions = elaborateDataGraphs(graphData, trendGroup, groupFields);
  const finalData = groupDataWithDerivatives(graphData, ["label", groupBy], groupFields, sortIndex, sortOrder);

  // console.log(chartOptions);

  return (
    <TrendGrid>
      <FlexContainer>
        <CanvasJSChart options={chartOptions}/>
      </FlexContainer>
      <FlexContainer>
        <Table striped bordered hover variant="dark" size="sm">
          <thead>
          <tr>
            {
              trendVariablesDerivativesHeader.map(elem =>
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
                {trendVariablesDerivatives.map(elem => {
                  if ( elem.includes("%") && e[elem] < 0 ) {
                    return (<TDGREEN><b>{e[elem]}</b></TDGREEN>)
                  } else if ( elem.includes("%") && e[elem] > 0 ) {
                    return (<TDRED><b>{e[elem]}</b></TDRED>)
                  } else if ( elem.includes("%") && e[elem] === 0 ) {
                    return (<TDAMBER><b>{e[elem]}</b></TDAMBER>)
                  }
                  return (<td>{e[elem]}</td>);
                })}
              </TR>
            )
          })}
          </tbody>
        </Table>
      </FlexContainer>
    </TrendGrid>
  );
};

export default TrendPage;
