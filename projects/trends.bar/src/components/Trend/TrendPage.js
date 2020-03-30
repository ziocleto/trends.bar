import React, {Fragment, useState} from "react";
import CanvasJSReact from '../../assets/canvasjs.react';
import {FlexContainer, LinkBack, TDAMBER, TDGREEN, TDRED, TH, TR, TrendSpan} from "./TrendPageStyle";
import {
  elaborateDataGraphs,
  float100ToPerc,
  getTrendGraphs,
  groupDataWithDerivatives,
  positiveSignForDx2,
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

  const groupBy = "Country";
  const trendVariables = ["Cases", "Deaths"];
  const trendVariablesDerivatives = [
    {key: groupBy, label: groupBy},
    {key: "Cases", label: "Cases"},
    {key: "Cases(Dx)", label: "Daily"},
    {key: "Cases(Dx2)", label: "Change"},
    {key: "Cases(Dx%)", label: "%", percSignPosTrend: -1},
    {key: "Deaths", label: "Deaths"},
    {key: "Deaths(Dx)", label: "Daily"},
    {key: "Deaths(Dx2)", label: "Change"},
    {key: "Deaths(Dx%)", label: "%", percSignPosTrend: -1},
    // {key:"Recovered",label:"Recovered"},
    // {key:"Recovered(Dx)",label:"New"},
    // {key:"Recovered(Dx2)",label:"Change"},
    // {key:"Recovered(Dx%)",label:"%"}
  ];

  const groupFields = trendVariables.slice(0, trendVariables.length);

  const location = useLocation();
  const trendIdFull = sanitizePathRoot(location.pathname);
  const [username, trendId] = trendIdFull.split("/");
  const [sortIndex, setSortIndex] = useState(groupFields[0]);
  const [sortOrder, setSortOrder] = useState(1);
  const [trendGroup, setTrendGroup] = useState("Worldwide");

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
              trendVariablesDerivatives.map(elem =>
                (<TH key={elem.key}
                     onClick={() => {
                       setSortIndex(elem.key);
                       setSortOrder(sortOrder === 1 ? -1 : 1);
                     }}>
                  {elem.label}
                </TH>)
              )
            }
          </tr>
          </thead>
          <tbody>
          {finalData.map((e) => {
            return (
              <TR key={e[groupBy]} onClick={() => {
                setTrendGroup(e[groupBy]);
              }}>
                {trendVariablesDerivatives.map(elem => {
                  const tdkey = e[groupBy] + elem.key;
                  if (elem.key.includes("%")) {
                    const posSign = positiveSignForDx2(elem);
                    const value = float100ToPerc(e[elem.key]);
                    if (Math.sign(e[elem.key]) === posSign) {
                      return (<TDGREEN key={tdkey}><b>{value}</b></TDGREEN>);
                    }
                    if (Math.sign(e[elem.key]) === -posSign) {
                      return (<TDRED key={tdkey}><b>{value}</b></TDRED>);
                    }
                    return (<TDAMBER key={tdkey}><b>{value}</b></TDAMBER>)
                  }
                  return (<td key={tdkey}>{e[elem.key]}</td>);
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
