import React from "reactn";
import {Fragment, useEffect, useRef, useState} from "react";
import {Button, Col, Container, Dropdown, Form, InputGroup, Row, Tab, Table, Tabs} from "react-bootstrap";
import {DangerColorSpan, DangerColorTd, FormGroupBorder, GroupTransform} from "./GatherEditor-styled";
import {api, useApi} from "../../../futuremodules/api/apiEntryPoint";
import {getCSVGraphKeys} from "../../../futuremodules/fetch/fetchApiCalls";
import {LightColorTextSpanBold} from "../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {useTrendIdGetter} from "../../../modules/trends/globals";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";
import {getArrayFromJsonPath} from "../../../modules/trends/jsonPath";
import {transformData} from "../../../modules/trends/dataTransformer";
import uniqueId from "lodash/uniqueId";
am4core.useTheme(am4themes_dark);

const getLabelTransformOfGroup = (scriptJson, groupName) => {
  if ( !scriptJson ) return "None";
  for ( const group of scriptJson.groups ) {
    if (group.label === groupName) {
      return group.labelTransform;
    }
  }
  return "None";
};

export const ScriptEditor = () => {

  const trendId = useTrendIdGetter();
  const [formData, setFromData] = useState({});
  const [scriptJson, setScriptJson] = useState(null);
  const fetchApi = useApi('fetch');
  const fetchResult = fetchApi[0];
  const graphId = "hdsajdhakas";// useState(uniqueId('graph-'));

  let chartRef = useRef();

  useEffect(() => {
    if (fetchResult) {
      setScriptJson(fetchResult.script);


      // const graphData=[];
      // for (let i=0;i<fetchResult.graphXYSeries.length;i++) {
      //   try {
      //     const serieData = getArrayFromJsonPath(data, config.graphXYSeries[i].query).map(e => {
      //       const serieRow = {
      //         label: transformData(e[config.graphXYSeries[i].fieldX], config.graphXYSeries[i].transformX),
      //         y: transformData(e[config.graphXYSeries[i].fieldY], config.graphXYSeries[i].transformY)
      //       }
      //       return serieRow;
      //     });
      //     graphData.push({
      //       name: config.graphXYSeries[i].title,
      //       data: serieData
      //     });
      //   } catch (ex) {
      //     console.log("Error building graphxy", ex)
      //   }
      // }

      const graphData=[];
      let visits = 10;
      for (let i = 1; i < 366; i++) {
        visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
        graphData.push({ date: new Date(2018, 0, i), name: "name" + i, value: visits });
      }

      let chart = am4core.create(graphId, am4charts.XYChart);

      chart.data = graphData;
      chart.paddingRight = 20;

      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.minWidth = 35;

      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = "date";
      series.dataFields.valueY = "value";

      series.tooltipText = "{valueY.value}";
      chart.cursor = new am4charts.XYCursor();

      let scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(series);
      chart.scrollbarX = scrollbarX;

      // var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      // dateAxis.renderer.minGridDistance = 50;
      // dateAxis.renderer.grid.template.location = 0.5;
      // dateAxis.startLocation = 0.5;
      // dateAxis.endLocation = 0.5;
      //
      // graphData.forEach((e,i) => {
      //   console.log(`Serie: ${e.name}`);
      //   console.log(`${JSON.stringify(e.data)}`);
      //   let series = chart.series.push(new am4charts.LineSeries());
      //   series.name=e.name;
      //   series.dataFields.valueY = "y";
      //   series.dataFields.dateX = "label";
      //   series.tooltipText = "{dateX.formatDate(dd/MM)} - {name} {valueY.value}";
      //   series.strokeWidth = 3;
      //   series.tensionX = 0.8;
      //   series.bullets.push(new am4charts.CircleBullet());
      //   series.data = e.data;
      // });

      chart.cursor = new am4charts.XYCursor();

      chartRef.current = chart;

      return () => {
        // console.log('will unmount');
        // if (grafo) {
        //   grafo.dispose();
        // }
      }
    }
  }, [fetchResult]);

  const onChange = e => {
    setFromData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onDeleteEntity = (elem) => {
    setScriptJson(s => {
        return {
          ...s,
          groups: scriptJson.groups.filter(e => e !== elem)
        }
      }
    );
  };

  const onDeleteGroup = (elem) => {
    setScriptJson(s => {
        return {
          ...s,
          groups: scriptJson.groups.filter(e => e.label !== elem)
        }
      }
    );
  };

  const gatherSource = () => {
    api(fetchApi, getCSVGraphKeys, { url: formData.sourceDocument, trendId}).then( r => console.log(r));
  };

  const formLabelInputSubmitEntry = (ls, vs, label, key, placeholder = "", required = false, defaultValue = null) => (
    <Fragment key={key}>
      <Form.Label column sm={ls} className={"text-white font-weight-bold"}>
        {label}
      </Form.Label>
      <Col sm={vs}>
        <InputGroup className="mb-1">
          <Form.Control name={key} placeholder={placeholder} defaultValue={defaultValue}
                        onChange={e => onChange(e)} required={required}/>
          <InputGroup.Append>
            <Button variant="info" onClick={() => gatherSource()}>Gather</Button>
          </InputGroup.Append>
        </InputGroup>
      </Col>
    </Fragment>
  );

  const DeleteCSVElem = (props) => {
    return (
      <DangerColorTd onClick={() => onDeleteEntity(props.elem)}>
        <i className="fas fa-minus-circle"/>
      </DangerColorTd>
    )
  };

  const DeleteCSVGroup = (props) => {
    return (
      <DangerColorSpan onClick={() => onDeleteGroup(props.elem)}>
        <i className="fas fa-minus-circle"/>
      </DangerColorSpan>
    )
  };

  const csvScriptHead = () => {
    return (
      <tr>
        <th>Name</th>
        <th>X Axis</th>
        <th>Y Axis</th>
        <th>Remove</th>
      </tr>
    )
  };

  const csvScriptTD = (e) => {
    let ret = [];
    for (const elem of scriptJson.groups) {
      if (elem.label === e) {
        ret.push((
          <tr key={elem.key}>
            <td><b>{elem.key}</b></td>
            <td><b>{elem.x}</b></td>
            <td><b>{elem.y}</b></td>
            <DeleteCSVElem elem={elem}/>
          </tr>
        ));
      }
    }
    return ret.map(re => re);
  };

  const scriptOutputTables = () => {
    let ret = (<Fragment/>);
    if (scriptJson && scriptJson.groups && scriptJson.groups.length > 0) {
      let tabSet = new Set();
      let tabArray = [];
      scriptJson.groups.map(elem => tabSet.add(elem.label));
      tabSet.forEach(e => tabArray.push(e));
      ret = (
        <Tabs id={"tid"} variant="pills">
          {tabArray.map(e => {
            return (
              <Tab key={e} eventKey={e} title={<LightColorTextSpanBold>{e}</LightColorTextSpanBold>}>
                <FormGroupBorder>
                  <br/>
                  <GroupTransform>
                    <div>Group:{" "}
                    <LightColorTextSpanBold>{e}</LightColorTextSpanBold>
                    </div>
                    <Dropdown>
                      Group Transform:{" "}
                      <Dropdown.Toggle variant="success" size={"sm"}>
                        {getLabelTransformOfGroup(scriptJson, e)}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item>None</Dropdown.Item>
                        <Dropdown.Item>Country</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    <div>Remove group <DeleteCSVGroup elem={e}/></div>
                  </GroupTransform>
                  <br/>
                  <Table striped bordered hover variant="dark" size="sm">
                    <thead>
                    {csvScriptHead()}
                    </thead>
                    <tbody>
                    {csvScriptTD(e)}
                    </tbody>
                  </Table>
                </FormGroupBorder>
                <FormGroupBorder>
                  {/*<div ref={chartRef} id={graphId} style={{width: "100%", height: "100%"}}/>*/}
                </FormGroupBorder>
              </Tab>
            )
          })}
        </Tabs>
      )
    }
    return ret;
  };

  return (
    <Container fluid>
      <Row>
        <Col sm={12}>
          <Form>
            <Form.Group as={Row}>
              {formLabelInputSubmitEntry(2, 10, "Source", "sourceDocument", "Url of your source here", true)}
            </Form.Group>
            {scriptOutputTables()}
            <br/>
          </Form>
        </Col>
      </Row>
      <div ref={chartRef} id={graphId} style={{width: "100%", height: "100%"}}/>
    </Container>
  );
};
