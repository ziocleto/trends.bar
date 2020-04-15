import "./react-grid-styles.css"
import "./react-resizable-styles.css"

import React, {Fragment, useState} from "reactn";
import {Container, Subtitle, Title} from "./ContentWidgetText.styled";
import {ModalDatasetPixel} from "./Layout/ModalDatasetPicker";

export const ContentWidgetText = ({config, onSave}) => {

  // const [showDatasetPicker, setShowDatasetPicker] = useGlobal("aaa");
  const [showDatasetPicker, setShowDatasetPicker] = useState(false);

  return (
    <Fragment>
      <Container onClick={ () => setShowDatasetPicker(true)}>
        <Title>
          {config.title}
        </Title>
        <Subtitle>{config.subtitle}</Subtitle>
      </Container>
      {showDatasetPicker && <ModalDatasetPixel onClose={() => setShowDatasetPicker(false)}
                                               defaultValue={config.title}
                                               updater={(newValue) => onSave({
                                                 ...config,
                                                 title: newValue
                                               })}/>}
    </Fragment>
  )
};
