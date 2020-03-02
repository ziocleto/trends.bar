import React, {Fragment} from "react";
import {useGlobal} from "reactn";
import Spinner from "./Spinner";

const Navbar = () => {

  const [trend, setTrend] = useGlobal('trendId');
  // eslint-disable-next-line
  const [loading] = useGlobal('loading');

  const title = trend && trend.name ? trend.name : "";

  return (
    <div className="navbarGrid">
      <div className="navbarlogo-a">
        <a href="/#" onClick={() => {
          setTrend(null);
        }}>
          {loading ? (
            <Fragment>
              <Spinner animation="border" variant="warning" size="sm"/>
              <div className="backdropModal"/>
            </Fragment>
          ) : (
            <img src="/ehlogo.svg" alt=""/>
          )}
        </a>
      </div>
      <div className="navbareh-a navdiv-titletext">
        <a href="/#" onClick={() => {
          setTrend(null);
        }}>
          {" "}
          <span className="colorLogo1">T</span>
          <span>rends</span> <span className="colorLogo2">B</span>
          <span>ar</span>
        </a>
      </div>
      <div className="navbartitle-a">{title}</div>
    </div>
  );
};

export default Navbar;
