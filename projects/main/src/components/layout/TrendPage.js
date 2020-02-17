import React from "react";
import {Map, TileLayer} from "react-leaflet";

const TrendPage = () => {
  // const dispatch = useDispatch();
  //
  // const currentEntity = useSelector(state => state.entities.currentEntity);
  // const entities = useSelector(state => state.entities.entries);
  // const group = useSelector(state => state.entities.groupSelected);
  // const hasResized = useSelector(state => state.wasm.resize);

  const position = [51.505, -0.09];
  const mapStyle = {
    height: "100%",
    width: "100%",
  }

  return (
    <div className="trend-layout">
      <Map center={position} zoom="3" style={mapStyle}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </Map>
    </div>
  );
}

export default TrendPage;
