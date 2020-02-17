import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {loadTrend} from "../../actions/TrendActions";
import {Redirect} from "react-router-dom";

const Landing = () => {
  // if (auth.auth && auth.auth.isAuthenticated === true) {
  //   return <Redirect to="/dashboarduser" />;
  // }
  const dispatch = useDispatch();

  const trend = useSelector(state => state.trend);

  if (trend.name) {
    const rto = "/" + trend.name;
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
                dispatch(loadTrend(tvalue));
              }
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Landing;
