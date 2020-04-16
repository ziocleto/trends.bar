import React, {Fragment, useEffect, useState} from "react";
import {sanitizePathRoot} from "../../futuremodules/utils/utils";
import {useQuery} from "@apollo/react-hooks";
import {useLocation} from "react-router-dom";
import GridLayout from "react-grid-layout";
import {DivLayout} from "../dashboardProject/subcomponents/Layout/LayoutEditor.styled";
import {getTrendGraphsByUserTrendId, getTrendLayouts} from "../../modules/trends/queries";
import {
  checkQueryLoadedWithValue,
  getQueryLoadedWithValue,
  getQueryLoadedWithValueArrayNotEmpty
} from "../../futuremodules/graphqlclient/query";
import {ContentWidget} from "../dashboardProject/subcomponents/ContentWidgets/ContentWidget";

// const CanvasJSChart = CanvasJSReact.CanvasJSChart;

// const EmptyTrend = ({trendId}) => {
//   return (
//     <TrendGrid>
//       <FlexContainer>
//         <p>
//           Trend <TrendSpan>{trendId}</TrendSpan> is empty!
//         </p>
//         <p>
//           I'm sorry you ended up here, my associates will make sure this won't happen again!
//         </p>
//       </FlexContainer>
//       <FlexContainer>
//         <Link to={"/"}><LinkBack>Back to sanity, Marty!</LinkBack></Link>
//       </FlexContainer>
//     </TrendGrid>
//   )
// };

// const TrendPage = () => {
//
//   const groupBy = "Country";
//   const trendVariables = ["Cases", "Deaths"];
//   const trendVariablesDerivatives = [
//     {key: groupBy, label: groupBy},
//     {key: "Cases", label: "Cases"},
//     {key: "Cases(Dx)", label: "Daily"},
//     {key: "Cases(Dx2)", label: "Change"},
//     {key: "Cases(Dx%)", label: "%", percSignPosTrend: -1},
//     {key: "Deaths", label: "Deaths"},
//     {key: "Deaths(Dx)", label: "Daily"},
//     {key: "Deaths(Dx2)", label: "Change"},
//     {key: "Deaths(Dx%)", label: "%", percSignPosTrend: -1},
//     // {key:"Recovered",label:"Recovered"},
//     // {key:"Recovered(Dx)",label:"New"},
//     // {key:"Recovered(Dx2)",label:"Change"},
//     // {key:"Recovered(Dx%)",label:"%"}
//   ];
//
//   const groupFields = trendVariables.slice(0, trendVariables.length);
//
//   const location = useLocation();
//   const trendIdFull = sanitizePathRoot(location.pathname);
//   const [username, trendId] = trendIdFull.split("/");
//   const [sortIndex, setSortIndex] = useState(groupFields[0]);
//   const [sortOrder, setSortOrder] = useState(1);
//   const [trendGroup, setTrendGroup] = useState("Worldwide");
//
//   const {data, loading, error} = useQuery(getTrendGraphs(), {variables: {name: username, trendId: trendId}});
//
//   if (loading) {
//     return <Fragment/>;
//   }
//
//   if ((!data && loading === false) || (loading === false && !data.user) || (loading === false && !data.user.trend) || error) {
//     return <EmptyTrend trendId={trendId}/>;
//   }
//
//   let graphData = data.user.trend.trendGraphs;
//   const chartOptions = elaborateDataGraphs(graphData, trendGroup, groupFields);
//   const finalData = groupDataWithDerivatives(graphData, ["label", groupBy], groupFields, sortIndex, sortOrder);
//
//   return (
//     <TrendGrid>
//       <FlexContainer>
//         <CanvasJSChart options={chartOptions}/>
//       </FlexContainer>
//       <FlexContainer>
//         <Table striped bordered hover variant="dark" size="sm">
//           <thead>
//           <tr>
//             {
//               trendVariablesDerivatives.map(elem =>
//                 (<TH key={elem.key}
//                      onClick={() => {
//                        setSortIndex(elem.key);
//                        setSortOrder(sortOrder === 1 ? -1 : 1);
//                      }}>
//                   {elem.yValueSubGroup}
//                 </TH>)
//               )
//             }
//           </tr>
//           </thead>
//           <tbody>
//           {finalData.map((e) => {
//             return (
//               <TR key={e[groupBy]} onClick={() => {
//                 setTrendGroup(e[groupBy]);
//               }}>
//                 {trendVariablesDerivatives.map(elem => {
//                   const tdkey = e[groupBy] + elem.key;
//                   if (elem.key.includes("%")) {
//                     const posSign = positiveSignForDx2(elem);
//                     const value = float100ToPerc(e[elem.key]);
//                     if (Math.sign(e[elem.key]) === posSign) {
//                       return (<TDGREEN key={tdkey}><b>{value}</b></TDGREEN>);
//                     }
//                     if (Math.sign(e[elem.key]) === -posSign) {
//                       return (<TDRED key={tdkey}><b>{value}</b></TDRED>);
//                     }
//                     return (<TDAMBER key={tdkey}><b>{value}</b></TDAMBER>)
//                   }
//                   return (<td key={tdkey}>{e[elem.key]}</td>);
//                 })}
//               </TR>
//             )
//           })}
//           </tbody>
//         </Table>
//       </FlexContainer>
//     </TrendGrid>
//   );
// };

const TrendPage = () => {

  const location = useLocation();
  const trendIdFull = sanitizePathRoot(location.pathname);
  const [username, trendId] = trendIdFull.split("/");

  const trendLayoutQuery = useQuery(getTrendLayouts(), {variables: {name: username, trendId: trendId}});
  const queryResults = useQuery(getTrendGraphsByUserTrendId(), {variables: {name: username, trendId: trendId}});

  const [layout, setLayout] = useState(null);

  useEffect(() => {
    trendLayoutQuery.refetch().then(() => {
        const queryLayout = getQueryLoadedWithValueArrayNotEmpty(trendLayoutQuery);
        if (queryLayout) {
          setLayout(queryLayout[0]);
        }
      }
    );
  }, [trendLayoutQuery]);

  if (!layout || !checkQueryLoadedWithValue(queryResults)) return (<Fragment/>);

  return (
    <GridLayout layout={layout.gridLayout}
                cols={layout.cols * layout.granularity}
                rowHeight={layout.width / (layout.cols * layout.granularity)}
                width={layout.width}>
      {layout.gridLayout.map(elem => {
        return (
          <DivLayout key={elem.i}>
            <ContentWidget data={getQueryLoadedWithValue(queryResults)}
                           config={layout.gridContent[layout.gridLayout.findIndex(v => v.i === elem.i)]}/>
          </DivLayout>
        );
      })}
    </GridLayout>
  );
};

export default TrendPage;
