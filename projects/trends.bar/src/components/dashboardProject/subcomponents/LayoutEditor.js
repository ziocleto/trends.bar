import "./react-grid-styles.css"
import "./react-resizable-styles.css"

import React from "react";
import GridLayout from 'react-grid-layout';
import {DivLayout} from "./LayoutEditor.styled";

export const LayoutEditor = () => {
  const granularity = 3;
  const cols = 3;
  const width = 936;

  let layout = [];
  let i = 0;
  for ( let y = 0; y < 3; y++ ) {
    for ( let x = 0; x < 3; x++ ) {
      layout.push( {
        i: i.toString(), x: x*granularity, y: y*granularity, w: granularity, h: granularity
      });
      i++;
    }
  }
  return (
    <GridLayout className="layout" layout={layout} cols={cols*granularity} rowHeight={width/(cols*granularity)} width={width}>
      { layout.map( elem => {
        return (<DivLayout key={elem.i}></DivLayout>);
      })}
    </GridLayout>
  )
};
