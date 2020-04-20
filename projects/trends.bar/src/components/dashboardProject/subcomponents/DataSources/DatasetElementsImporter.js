import {Col, Dropdown} from "react-bootstrap";
import {ScriptElementsContainer, ScriptKeyContainer, ScriptKeyContainerTitle} from "./DataSources-styled";
import {
  DangerColorSpan,
  Flex,
  FlexVertical,
  Mx1
} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {LabelWithRename} from "../../../../futuremodules/labelWithRename/LabelWithRename";
import React from "reactn";
import {Fragment} from "react";
import {
  getLabelTransformOfGroup,
  onDeleteEntity,
  onDeleteGroup,
  onDeleteSubGroup,
  renameGroup,
  renameSubGroup,
  renameYValueName,
  setGroupKey,
  setLabelTransformOfGroup,
  setSubGroupKey
} from "./DatasetElementsImporterLogic";

const DeleteItem = (props) => {
  return (
    <DangerColorSpan onClick={(e) => props.callback(e, props.elem, props.graphTree, props.setGraphTree)}>
      <i className="fas fa-minus-circle"/>
    </DangerColorSpan>
  )
};

export const DatasetElementsImporter = ({graphTree, setGraphTree}) => {

  return (
    <Fragment>
      <Col>
        <ScriptKeyContainerTitle>
          Groups
        </ScriptKeyContainerTitle>
        <ScriptElementsContainer>
          <FlexVertical>
            {Object.keys(graphTree.tree).map(elem =>
              (<ScriptKeyContainer key={elem}
                                   selected={elem === graphTree.groupTabKey}
                                   onClick={e => setGroupKey(e, elem, graphTree, setGraphTree)}>
                <Flex>
                  <div>
                    <Flex>
                      <div>
                        <Dropdown>
                          <Dropdown.Toggle variant="success" size={"sm"}>
                            {getLabelTransformOfGroup(elem, graphTree)}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item key={"a"} onClick={() => setLabelTransformOfGroup(elem, "None", graphTree, setGraphTree)}>Not
                              specified</Dropdown.Item>
                            <Dropdown.Item key={"b"} onClick={() => setLabelTransformOfGroup(elem, "Country", graphTree, setGraphTree)}>Country</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                      <Mx1/>
                      <div><b>
                        <LabelWithRename
                          defaultValue={elem}
                          updater={(newValue) => renameGroup(elem, newValue, graphTree, setGraphTree)}
                        /></b>
                      </div>
                    </Flex>
                  </div>
                  <div>
                    <DeleteItem elem={elem} graphTree={graphTree} setGraphTree={setGraphTree} callback={onDeleteGroup}/>
                  </div>
                </Flex>
              </ScriptKeyContainer>)
            )}
          </FlexVertical>
        </ScriptElementsContainer>
      </Col>
      <Col>
        <ScriptKeyContainerTitle>
          Sub Groups
        </ScriptKeyContainerTitle>
        <ScriptElementsContainer>
          <FlexVertical>
            {Object.keys(graphTree.tree[graphTree.groupTabKey]).map(elem =>
              (<ScriptKeyContainer key={elem}
                                   selected={elem === graphTree.subGroupTabKey}
                                   onClick={(e) => setSubGroupKey(e, elem, graphTree, setGraphTree)}>
                <Flex>
                  <div>
                    <b>
                      <LabelWithRename
                        defaultValue={elem}
                        updater={(newValue) => renameSubGroup(elem, newValue)}
                      />
                    </b>
                  </div>
                  <DeleteItem elem={elem} graphTree={graphTree} setGraphTree={setGraphTree} callback={onDeleteSubGroup}/>
                </Flex>
              </ScriptKeyContainer>)
            )}
          </FlexVertical>
        </ScriptElementsContainer>
      </Col>
      <Col>
        <ScriptKeyContainerTitle>
          Elements
        </ScriptKeyContainerTitle>
        <ScriptElementsContainer>
          <FlexVertical>
            {Object.keys(graphTree.tree[graphTree.groupTabKey][graphTree.subGroupTabKey]).map(elem =>
              (<ScriptKeyContainer key={elem} variant={"light"}>
                <Flex>
                  <div>
                    <b>
                      <LabelWithRename
                        defaultValue={elem}
                        updater={(newValue) => renameYValueName(elem, newValue)}
                      />
                    </b>
                  </div>
                  <DeleteItem elem={elem} graphTree={graphTree} setGraphTree={setGraphTree} callback={onDeleteEntity}/>
                </Flex>
              </ScriptKeyContainer>)
            )}
          </FlexVertical>
        </ScriptElementsContainer>
      </Col>
    </Fragment>
  )
};
