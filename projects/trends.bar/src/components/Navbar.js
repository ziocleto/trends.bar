import React from "react";
import {useGlobal} from "reactn";
import {Link} from "react-router-dom";

const Navbar = (props) => {

  const [, setTrend] = useGlobal('trendId');

  return (
    <div className="navbarGrid">
      <div className="navbarlogo-a" onClick={() => {setTrend(null).then();}}>
        <Link to={"/"}>
          <img src="/ehlogo.svg" alt=""/>
        </Link>
      </div>
      <div className="navbareh-a navdiv-titletext" onClick={() => {setTrend(null).then();}} >
        <Link to={"/"}>
          {" "}
          <span className="colorLogo1">T</span>
          <span>rends</span> <span className="colorLogo2">B</span>
          <span>ar</span>
        </Link>
      </div>
      <div className="navbartitle-a">{props.trendId}</div>
    </div>
  );
};

export default Navbar;
