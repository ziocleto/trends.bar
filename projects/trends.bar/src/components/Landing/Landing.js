import React, {Fragment, useEffect, useRef, useState} from "react";
import {
  LandingInner,
  LandingSection,
  SearchBarResultContainer,
  SearchBarResultTrendId,
  SearchBarResultUser
} from "./Landing.styled";
import {useQuery} from "@apollo/react-hooks";
import {Redirect} from "react-router-dom";
import {Logo1TextSpan, Logo2TextSpan, NiceSearchBar} from "../../futuremodules/reactComponentStyles/reactCommon.styled";
import {getQueryLoadedWithValueArrayNotEmpty} from "../../futuremodules/graphqlclient/query";
import {getSimilarTrends} from "../dashboardProject/DashBoardProjectLogic";

const SearchResults = ({trendIdPartial}) => {
  const similarDatasetsQuery = useQuery(getSimilarTrends(trendIdPartial));
  const [results, setResults] = useState([]);
  const [finalized, setfinalized] = useState({
    clicked: false,
    username: "",
    trendId: ""
  });

  useEffect(() => {
      const queryRes = getQueryLoadedWithValueArrayNotEmpty(similarDatasetsQuery);
      if (queryRes) {
        setResults(queryRes)
      }
    },
    [similarDatasetsQuery, setResults]);

  if ( finalized.clicked ) {
    return <Redirect push={true} to={`/${finalized.username}/${finalized.trendId}`}/>
  }

  return (
    <Fragment>
      {results.map(e => {
        const key = e.trendId + e.user.name;
        return (
          <SearchBarResultContainer
            key={key}
            onClick={ () => setfinalized({
              clicked: true,
              username: e.user.name,
              trendId: e.trendId
            }) }
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

const Landing = () => {
  const [trendIdPartial, setTrendIdPartial] = useState(null);
  const searchBox = useRef(null);

  useEffect(() => {
    if (searchBox.current) {
      searchBox.current.focus();
      searchBox.current.select();
    }
  }, []);

  return (
    <LandingSection>
      <LandingInner>
        <div>
          <Logo1TextSpan>Search </Logo1TextSpan>
          <Logo2TextSpan>trend</Logo2TextSpan>
        </div>
        <NiceSearchBar
            marginTop={"20px"}
            width={"50%"}
            ref={searchBox}
            type="text"
            className="search-bar"
            id="search-bar"
            autoComplete={"off"}
            onChange={e => setTrendIdPartial(e.target.value)}>
        </NiceSearchBar>
        <SearchResults trendIdPartial={trendIdPartial}/>
      </LandingInner>
    </LandingSection>
  );
};

export default Landing;
