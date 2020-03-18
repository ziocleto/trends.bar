import React from "react";
import Entries from "./entities/Entries";
import ImageEditor from "./entities/ImageEditor";
import AppEditor from "./entities/AppEditor";
import GUIEditor from "./entities/GUIEditor";
import GeomEditor from "./entities/GeomEditor";
import FontEditor from "./entities/FontEditor";
import MaterialEditor from "./entities/MaterialEditor";
import EntityMetaSection from "./entities/EntityMetaSection";
import RenderParamsToolbar from "./entities/RenderParamsToolbar";
import {
  GroupFont,
  GroupGeom,
  groupHasMetadataSection,
  GroupImage,
  GroupMaterial,
  GroupScript,
  GroupUI
} from "../../utils/entityUtils";
import {createPlaceHolder, getFullEntity} from "../../actions/entities";
import {Redirect} from "react-router-dom";
import {useGlobal} from "reactn";
// import WasmCanvas, {ReactWasm} from "react-wasm-canvas";
import WasmCanvas, {ReactWasm} from "../../futuremodules/reactwasmcanvas/localreacwasmcanvas";

const containerClassFromGroup = (currEntity, group) => {
  switch (group) {
    case GroupGeom:
      return {
        mainContainerClass: "AppEditorRenderGrid",
        mainContainerDiv: <GeomEditor/>
      };
    case GroupMaterial:
      return {
        mainContainerClass: "AppEditorRenderGrid",
        mainContainerDiv: <MaterialEditor/>
      };
    case GroupImage:
      return {
        mainContainerClass: "AppEditorRenderGrid",
        mainContainerDiv: <ImageEditor/>
      };
    case GroupScript:
      return {
        mainContainerClass: "AppEditorRenderGrid",
        mainContainerDiv: <AppEditor/>
      };
    case GroupFont:
      return {
        mainContainerClass: "AppEditorRenderGrid",
        mainContainerDiv: <FontEditor/>
      };
    case GroupUI:
      return {
        mainContainerClass: "AppEditorRenderGrid",
        mainContainerDiv: <GUIEditor/>
      };
    default:
      return {
        mainContainerClass: "AppEditorRenderGrid",
        mainContainerDiv: <AppEditor/>
      };
  }
};

const DashboardProject = () => {
  let canvasContainer = React.useRef(null);
  const [auth,] = useGlobal('auth');
  const [entities,entitiesStore] = useGlobal('entities');
  const wasmDispatcher = useGlobal(ReactWasm);

  const currentEntity = entities ? entities.currentEntity : null;
  const group = entities ? entities.groupSelected : null;
  const wwwPrefixToAvoidSSLMadness = process.env.REACT_APP_EH_CLOUD_HOST === 'localhost' ? "" : "www.";
  let wasmArgumentList = [`hostname=${wwwPrefixToAvoidSSLMadness}${process.env.REACT_APP_EH_CLOUD_HOST}`];

  if (auth === null) {
    return <Redirect to="/"/>
  }

  if (auth && auth.project === null) {
    return <Redirect to="/dashboarduser"/>
  }

  if (group === GroupScript) {
    if (entities.length >= 1 && !currentEntity) {
      entitiesStore(getFullEntity(entities[0]));
    } else if (!currentEntity) {
      entitiesStore(createPlaceHolder(group));
    }
  }

  const {mainContainerClass, mainContainerDiv} = containerClassFromGroup(
    currentEntity,
    group
  );

  const bShowMetaSection = groupHasMetadataSection(currentEntity, group);

  const entityName = (
    <div className="source_tabs-a">
      <div className="source_tabs-internal">
        {currentEntity && currentEntity.entity.name}
      </div>
    </div>
  );

  const mainEditorDiv = (
    <div className={mainContainerClass}>
      {entityName}
      <RenderParamsToolbar/>
      <div className="EntryEditorRender" ref={canvasContainer}>
        <WasmCanvas
          wasmName="editor"
          dispatcher={wasmDispatcher}
          canvasContainer={canvasContainer.current}
          initialRect={{top: 0, left: 0, width: 0, height: 0}}
          initialVisibility={false}
          argumentList={wasmArgumentList}
          padding="1px"
          borderRadius="5px"
          mandatoryWebGLVersionSupporNumber="webgl2"
        />
      </div>
      {currentEntity && mainContainerDiv}
      {bShowMetaSection && <EntityMetaSection/>}
    </div>
  );

  return (
    <div className="dashboardContainer">
      <Entries cname="thumbs-a thumbsEntityArea"/>
      <div className="editor-a">{mainEditorDiv}</div>
    </div>
  );
};

export default DashboardProject;
