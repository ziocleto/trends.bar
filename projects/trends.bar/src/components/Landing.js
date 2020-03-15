import React, {useEffect, useRef} from "react";
import {useGlobal} from 'reactn';
import {sanitizePathRoot} from "../futuremodules/utils/utils";
import gql from "graphql-tag";
import {useMutation} from "@apollo/react-hooks";

const Landing = () => {
  const [, setTrend] = useGlobal("trendId");
  const searchBox = useRef(null);

  useEffect(() => {
    if (searchBox.current) {
      searchBox.current.focus();
      searchBox.current.select();
    }
  }, []);

  const CREATE_TREND = gql`
      mutation CreateTrend($trendId: String!) {
          createTrend(trendId: $trendId) {
              _id,
              trendId
          }
      }`;

  const [createTrend] = useMutation(CREATE_TREND);

  return (
    <section className="landing">
      <div className="landing-inner large">
        <div>
          <span className="colorLogo1">Search </span>
          <span className="colorLogo2">trend</span>
        </div>
        <div className="my-2"/>
        <div className="searchbar-a searchTrend small">
          <input
            ref={searchBox}
            type="text"
            className="search-bar"
            id="search-bar"
            onKeyUp={e => {
              if (e.keyCode === 13) {
                const trendId = sanitizePathRoot(e.target.value);
                setTrend(trendId).then();
                createTrend({ variables: { trendId: trendId } }).then();
              }
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Landing;
