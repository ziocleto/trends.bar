import React from "reactn";
import "./DataSources.css"
import {Fragment} from "react";
import {NiceSearchBar} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {Col, Row} from "react-bootstrap";
import {CustomTitle, RowSeparator} from "../../../../futuremodules/reactComponentStyles/reactCommon";

// const SearchResults = ({editingTrend}) => {
//   const fetchApi = useApi('fetch');
//   const [fetchResult] = fetchApi;
//   const gatherSource = useGatherSource(editingTrend);
//   const [results, setResults] = useState([]);
//
//   useEffect(() => {
//     if (fetchResult && (fetchResult.api.startsWith("similar/") && fetchResult.method === "get")) {
//       setResults(fetchResult.ret);
//     }
//   }, [fetchResult]);
//
//   return (
//     <Fragment>
//       {results.map(e => {
//         const key = e._id;
//         return (
//           <SearchBarResultContainer
//             key={key}
//             onClick={() => gatherSource(e.sourceDocument)}
//           >
//             <SearchBarResultTrendId>
//               {e.trendId}
//             </SearchBarResultTrendId>
//             {/*<InfoTextSpanBold>*/}
//             {/*  {e.count}*/}
//             {/*</InfoTextSpanBold>*/}
//             <SearchBarResultUser>
//               <i className="fas fa-user"/>{" "}{e.username}
//             </SearchBarResultUser>
//           </SearchBarResultContainer>
//         )
//       })
//       }
//     </Fragment>
//   )
//
// };

export const ImportDataSources = ({editingTrend}) => {

  // const similarSources = useGetSimilarSources();

  return (
    <Fragment>
      <Row>
        <Col>
        <CustomTitle text={"Cheekily grab an existing one..."} icon={"poll"}/>
        </Col>
      </Row>
      <RowSeparator/>
      <Row>
        <Col>
        <NiceSearchBar
          width={"100%"}
          type="text"
          className="search-bar"
          id={"grabsearchbar"}
          autoComplete={"off"}
          // onChange={e => similarSources(e.target.value)}
        >
        </NiceSearchBar>
        {/*<SearchResults editingTrend={editingTrend}/>*/}
        </Col>
      </Row>
    </Fragment>
  )
};
