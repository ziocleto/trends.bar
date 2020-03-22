import React, {useEffect, useRef} from "react";
import {useGlobal} from 'reactn';
import {sanitizePathRoot} from "../futuremodules/utils/utils";
import {Redirect} from "react-router-dom";
import {LandingInner, LandingSearchBar, LandingSection} from "./Landing.styled";

const Landing = () => {
  const [trendId, setTrend] = useGlobal("trendId");
  const searchBox = useRef(null);

  useEffect(() => {
    if (searchBox.current) {
      searchBox.current.focus();
      searchBox.current.select();
    }
  }, []);

  if ( trendId ) {
    return <Redirect push={true} to={`/${trendId}`}/>
  }

  const keyUpCallback = (e) => {
    if (e.keyCode === 13) {
      const trendId = sanitizePathRoot(e.target.value);
      setTrend(trendId).then();
    }
  };

  return (
    <LandingSection>
      <LandingInner>
        <div>
          <span className="colorLogo1">Search </span>
          <span className="colorLogo2">trend</span>
        </div>
        <LandingSearchBar>
          <input
            ref={searchBox}
            type="text"
            className="search-bar"
            id="search-bar"
            onKeyUp={e=>keyUpCallback(e)}
          />
        </LandingSearchBar>
      </LandingInner>
    </LandingSection>
  );
};

export default Landing;
