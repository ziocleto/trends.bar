import React, {useEffect, useRef} from "react";
import {useGlobal} from 'reactn';
import {sanitize} from "../utils/utils";

const Landing = () => {
  const [,setTrend] = useGlobal("trendId");
  const searchBox = useRef(null);

  useEffect(() => {
    if (searchBox.current) {
      searchBox.current.focus();
      searchBox.current.select();
    }
  }, []);

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
                setTrend(sanitize(e.target.value)).then();
              }
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Landing;
