import React, {Fragment} from "react";
import {useGlobal} from "reactn";
import Spinner from "./Spinner";

const Navbar = (props) => {

  const [, setTrend] = useGlobal('trendId');
  const [loading] = useGlobal('loading');

  return (
    <div className="navbarGrid">
      <div className="navbarlogo-a">
        <a href="/" onClick={() => {
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
        <a href="/" onClick={() => {
          setTrend(null);
        }}>
          {" "}
          <span className="colorLogo1">T</span>
          <span>rends</span> <span className="colorLogo2">B</span>
          <span>ar</span>
        </a>
      </div>
      <div className="navbartitle-a">{props.trendId}</div>
    </div>
  );
};

export default Navbar;
