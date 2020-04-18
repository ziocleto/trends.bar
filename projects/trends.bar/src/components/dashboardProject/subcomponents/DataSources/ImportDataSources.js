import React from "reactn";
import "./DataSources.css"
import {Fragment, useEffect, useState} from "react";
import {NiceSearchBar} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {Row} from "react-bootstrap";
import {CustomTitle, RowSeparator} from "../../../../futuremodules/reactComponentStyles/reactCommon";
import {useLazyQuery, useQuery} from "@apollo/react-hooks";
import {getDatasets, getSimilarTrends} from "../../../../modules/trends/queries";
import {SearchBarResultContainer, SearchBarResultTrendId, SearchBarResultUser} from "../../../Landing/Landing.styled";
import {graphArrayToGraphTree2} from "../../../../modules/trends/dataGraphs";
import {getQueryLoadedWithValueArrayNotEmpty} from "../../../../futuremodules/graphqlclient/query";
import {updateTrendDatasets} from "../../../../modules/trends/globals";

const SearchResults = ({trendIdPartial, layout, setLayout}) => {
  const similarTrendQuery = useQuery(getSimilarTrends(trendIdPartial));
  const [datasetQueryCall, datasetQueryResult] = useLazyQuery(getDatasets());

  const [results, setResults] = useState([]);

  useEffect(() => {
      const queryRes = getQueryLoadedWithValueArrayNotEmpty(datasetQueryResult);
      if (queryRes) {
        updateTrendDatasets(layout, setLayout, graphArrayToGraphTree2(queryRes));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [datasetQueryResult, setLayout]);

  useEffect(() => {
    const res = getQueryLoadedWithValueArrayNotEmpty(similarTrendQuery);
    if (res) {
      setResults(res);
    }
  }, [similarTrendQuery]);

  return (
    <Fragment>
      {results.map(e => {
        const key = e.trendId + e.user.name;
        return (
          <SearchBarResultContainer
            key={key}
            onClick={() => {
              datasetQueryCall({
                  variables: {
                    name: e.user.name,
                    trendId: e.trendId
                  }
                }
              );
              setResults([]);
            }}
          >
            <SearchBarResultTrendId>
              {e.trendId}
            </SearchBarResultTrendId>
            <SearchBarResultUser>
              <i className="fas fa-user"/>{" "}{e.user.name}
            </SearchBarResultUser>
          </SearchBarResultContainer>
        )
      })
      }
    </Fragment>
  )

};

export const ImportDataSources = ({layout, setLayout}) => {

  const [trendIdPartial, setTrendIdPartial] = useState(null);

  return (
    <Fragment>
      <RowSeparator/>
      <Row>
        <CustomTitle text={"Grab Sources within Trends.Bar"} icon={"poll"}/>
      </Row>
      <RowSeparator/>
      <Row>
        <NiceSearchBar
          width={"100%"}
          type="text"
          className="search-bar"
          id={"grabsearchbar"}
          onChange={e => setTrendIdPartial(e.target.value)}
        >
        </NiceSearchBar>
        <SearchResults trendIdPartial={trendIdPartial} layout={layout} setLayout={setLayout}/>
      </Row>
    </Fragment>
  )
};
