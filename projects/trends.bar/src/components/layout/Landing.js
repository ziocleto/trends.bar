import React from "react";
import {Redirect} from "react-router-dom";
import {useGlobal} from 'reactn';

const Landing = () => {
  const [trend, setTrend] = useGlobal('trendId');

  console.log(" Ctrrent trend: ", trend);
  if (trend) {
    const rto = "/" + trend;
    return <Redirect to={rto}/>
  }

  return (
    <section className="landing">
      <div className="landing-inner large">
        <div>
          <span className="colorLogo1">Search </span>
          <span className="colorLogo2">trend</span>
        </div>
        <div className="my-2"></div>
        <div className="searchbar-a searchTrend small">
          <input
            type="text"
            className="search-bar"
            id="search-bar"
            onKeyUp={e => {
              if (e.keyCode === 13) {
                const tvalue = e.target.value.toLowerCase();
                setTrend(tvalue);
              }
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Landing;
