import {ScriptElementsContainer, ScriptKeyContainer, ScriptKeyContainerTitle} from "./DataSources-styled";
import {Div, Flex, FlexVertical} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {modalGraphTreeHeight} from "../Layout/LayoutCellEditor-styled";
import React from "reactn";
import {useState} from "react";
import {mapEntries} from "../../../../futuremodules/utils/utils";
import {CustomColorTitle} from "../../../../futuremodules/reactComponentStyles/reactCommon";

export const DatasetElements = ({layout, setLayout, config}) => {

  const datasets = layout.dataSources;
  const [datasetIndex, setDatasetIndex] = useState(0);
  const [sourceDataIndex, setSourceDataIndex] = useState(0);
  const [sourceDataValueIndex, setSourceDataValueIndex] = useState(0);

  const datasetIndexFromKeyName = (layout, setLayout, config, k) => {
    let gc = {...layout.gridContent};
    gc[config.i].groupKey = k;
    setLayout( prevState => {
      return {
        ...prevState,
        gridContent: gc
      }
    });
    return k;
  }

  const datasetSourceIndexFromKeyName = (key) => {
    for (let i = 0; i < datasets[datasetIndex].headers.length; i++) {
      if (datasets[datasetIndex].headers[i].name === key ) {
        const isYGroup = datasets[datasetIndex].headers[i].key === "y";
        const isZGroup = datasets[datasetIndex].headers[i].key === "z";
        if ( isYGroup || isZGroup ) {
          let gc = {...layout.gridContent};
          gc[config.i].groupKey = datasetIndex;
          if (isYGroup) gc[config.i].subGroupKey = i;
          if (isZGroup) gc[config.i].zGroupIndex = i;
          setLayout( prevState => {
            return {
              ...prevState,
              gridContent: gc
            }
          });
        }
        return i;
      }
    }
    return -1;
  }

  const datasetSourceZIndex = (key) => {
    let gc = {...layout.gridContent};
    gc[config.i].zGroupRow = key;
    setLayout( prevState => {
      return {
        ...prevState,
        gridContent: gc
      }
    });

    setSourceDataValueIndex(key);
    return -1;
  }

  const getDatasetKeyIcon = key => {
    if ( key === "x" ) return "clock";
    if ( key === "y" ) return "sort-amount-down";
    if ( key === "z" ) return "layer-group";
    return "none";
  }

  const getDatasetKeyColor = key => {
    if ( key === "x" ) return "var(--light)";
    if ( key === "y" ) return "var(--info)";
    if ( key === "z" ) return "var(--logo-color-1)";
    return "var(--logo-color-1)";
  }


  return (
    <Flex width={"100%"}>
      <Div padding={"2px"} width={"33%"}>
        <ScriptKeyContainerTitle>
          Sources
        </ScriptKeyContainerTitle>
        <ScriptElementsContainer>
          <FlexVertical
            padding={"2px"}
            justifyContent={"start"}
            height={modalGraphTreeHeight}
          >
            {mapEntries(datasets, (k,elem) =>
              (<ScriptKeyContainer key={k}
                                   selected={datasetIndex === parseInt(k)}
                                   onClick={() => setDatasetIndex(datasetIndexFromKeyName(layout, setLayout, config, k))}>
                {elem.name}
              </ScriptKeyContainer>)
            )}
          </FlexVertical>
        </ScriptElementsContainer>
      </Div>

      <Div margin={"0 10px"} padding={"2px"} width={"34%"}>
        <ScriptKeyContainerTitle>
          Elements
        </ScriptKeyContainerTitle>
        <ScriptElementsContainer>
          <FlexVertical
            padding={"2px"}
            justifyContent={"start"}
            height={modalGraphTreeHeight}
          >
            {mapEntries(datasets[datasetIndex].headers, (k, elem) =>
              (<ScriptKeyContainer key={elem.name}
                                   selected={sourceDataIndex === parseInt(k)}
                                   onClick={() => setSourceDataIndex(datasetSourceIndexFromKeyName(elem.name))}
              >
                <CustomColorTitle icon={getDatasetKeyIcon(elem.key)} text={elem.name} color={getDatasetKeyColor(elem.key)}/>
              </ScriptKeyContainer>)
            )}
          </FlexVertical>
        </ScriptElementsContainer>
      </Div>

      <Div margin={"0 10px"} padding={"2px"} width={"33%"}>
        <ScriptKeyContainerTitle>
          Values
        </ScriptKeyContainerTitle>
        <ScriptElementsContainer>
          <FlexVertical
            padding={"2px"}
            justifyContent={"start"}
            height={modalGraphTreeHeight}
          >
            {mapEntries(datasets[datasetIndex].sourceData, (k,elem) =>
                (<ScriptKeyContainer key={k}
                                     selected={sourceDataValueIndex === parseInt(k)}
                                     onClick={() => datasetSourceZIndex(parseInt(k))}
                >
                  {elem[sourceDataIndex]}
                </ScriptKeyContainer>)
              )}
          </FlexVertical>
        </ScriptElementsContainer>
      </Div>
    </Flex>
  )
};
