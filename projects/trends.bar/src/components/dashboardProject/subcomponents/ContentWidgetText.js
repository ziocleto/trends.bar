import "./react-grid-styles.css"
import "./react-resizable-styles.css"

import React, {Fragment, useState} from "react";
import {Container, Subtitle, Title} from "./ContentWidgetText.styled";
import {ModalDatasetPixel} from "./Layout/ModalDatasetPicker";

export const ContentWidgetText = ({data, config, onSave}) => {

  const [showDatasetPicker, setShowDatasetPicker] = useState(false);

  return (
    <Fragment>
      <Container>
        <Title
          onClick={ () => setShowDatasetPicker(true)}>
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
