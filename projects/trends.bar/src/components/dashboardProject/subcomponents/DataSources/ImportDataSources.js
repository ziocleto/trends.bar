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

const SearchResults = ({trendIdPartial, datasets, setDatasets}) => {
  const {data, loading} = useQuery(getSimilarTrends(trendIdPartial));
  const [datasetQueryCall, datasetQueryResult] = useLazyQuery(getDatasets());

  const [results, setResults] = useState([]);

  useEffect(() => {
      const queryRes = getQueryLoadedWithValueArrayNotEmpty(datasetQueryResult);
      if (queryRes) {
        const gt = graphArrayToGraphTree2(queryRes);
        setDatasets(prevState => {
          return {...prevState, ...gt};
        });
      }
    }
    , [datasetQueryResult, setDatasets]);

  if (data && data.trend_similar && loading === false) {
    if (results !== data.trend_similar) {
      setResults(data.trend_similar);
    }
  }

  return (
    <Fragment>
      {results.map(e => {
        const key = e.trendId + e.user.name;
        return (
          <SearchBarResultContainer
            key={key}
            onClick={() => {
              console.log("Who ya gonna call?");
              datasetQueryCall({
                  variables: {
                    name: e.user.name,
                    trendId: e.trendId
                  }
                }
              )
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

export const ImportDataSources = ({datasets, setDatasets}) => {

  const [trendIdPartial, setTrendIdPartial] = useState(null);

  return (
    <Fragment>
      <RowSeparator/>
      <Row>
        <CustomTitle text={"Grab Sources from somebody else:"} icon={"poll"}/>
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
        <SearchResults trendIdPartial={trendIdPartial} datasets={datasets} setDatasets={setDatasets}/>
      </Row>
    </Fragment>
  )
};
