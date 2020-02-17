import React, {Fragment} from "react";
import Spinner from "react-bootstrap/Spinner";
import {useDispatch, useSelector} from "react-redux";
import {loadTrend} from "../../actions/TrendActions";

const Navbar = () => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.auth.loading);
  const trend = useSelector(state => state.trend);

  const title = trend && trend.name ? trend.name : "";

  return (
    <div className="navbarGrid">
      <div className="navbarlogo-a">
        <a href="/#" onClick={() => {
          dispatch(loadTrend(null))
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
          dispatch(loadTrend(null))
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
