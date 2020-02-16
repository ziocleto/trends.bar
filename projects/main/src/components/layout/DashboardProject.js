import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import Entries from "./entities/Entries";
import ImageEditor from "./entities/ImageEditor";
import AppEditor from "./entities/AppEditor";
import GUIEditor from "./entities/GUIEditor";
import GeomEditor from "./entities/GeomEditor";
import FontEditor from "./entities/FontEditor";
import MaterialEditor from "./entities/MaterialEditor";
import {wasmSetCanvasSize, wasmSetCanvasVisibility} from "react-wasm-canvas";
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
} from "../../utils/utils";
import {createPlaceHolder, getFullEntity} from "../../actions/entities";

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
    const dispatch = useDispatch();

    const currentEntity = useSelector(state => state.entities.currentEntity);
    const entities = useSelector(state => state.entities.entries);
    const group = useSelector(state => state.entities.groupSelected);
    const hasResized = useSelector(state => state.wasm.resize);

    useEffect(() => {
      if (canvasContainer.current) {
        const rect = canvasContainer.current.getBoundingClientRect();
        dispatch(wasmSetCanvasSize(rect));
      }
    }, [hasResized, dispatch]);
    dispatch(wasmSetCanvasVisibility('visible'));

    if (group === GroupScript) {
      if (entities.length >= 1 && !currentEntity) {
        dispatch(getFullEntity(entities[0]));
      } else if (!currentEntity) {
        dispatch(createPlaceHolder(group));
      }
    }

    const {mainContainerClass, mainContainerDiv} = containerClassFromGroup(
      currentEntity,
      group
    );

// const bUseEntityUpdate = groupHasUpdateFacility(currentEntity, group);
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
        <div className="EntryEditorRender" ref={canvasContainer}></div>
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
  }
;

export default DashboardProject;
