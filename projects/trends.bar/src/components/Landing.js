import React, {useEffect, useRef} from "react";
import {useGlobal} from 'reactn';
import {sanitizePathRoot} from "../futuremodules/utils/utils";
import {Redirect} from "react-router-dom";

const Landing = () => {
  const [trendId, setTrend] = useGlobal("trendId");
  const searchBox = useRef(null);

  useEffect(() => {
    if (searchBox.current) {
      searchBox.current.focus();
      searchBox.current.select();
    }
  }, []);

  if ( trendId !== null ) {
    return <Redirect push={true} to={`/${trendId}`}/>
  }

  const keyUpCallback = (e) => {
    if (e.keyCode === 13) {
      const trendId = sanitizePathRoot(e.target.value);
      setTrend(trendId).then();
    }
  }

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
            onKeyUp={e=>keyUpCallback(e)}
          />
        </div>
      </div>
    </section>
  );
};

export default Landing;
