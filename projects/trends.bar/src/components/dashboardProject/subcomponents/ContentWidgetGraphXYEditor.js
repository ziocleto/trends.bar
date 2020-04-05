import "./react-grid-styles.css"
import "./react-resizable-styles.css"

import React, {Fragment, useState} from "react";
import {Col, Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {getDefaultWidgetGraphXYSerieContent} from "../../../modules/trends/layout";

export const ContentWidgetGraphXYEditor = ({config,onUpdate}) => {

    console.log(config);
    const [content,setContent] = useState(config);
    const [currentSerieIndex,setCurrentSerieIndex] = useState(config.series.length>0?0:-1);

    const onChange = (property, value) => {
        const newContent = {...content};
        newContent[property]=value;
        setContent(newContent);
        onUpdate(newContent);
    }

    const onChangeSerieField = (property, value) => {
        const newContent = {...content};
        newContent.series[currentSerieIndex][property]=value;
        setContent(newContent);
        onUpdate(newContent);
    }

    const selectSerie = (event) => {
        const newIndex=event.target.value;
        setCurrentSerieIndex(newIndex);
    }

    const removeSerie = () => {
        if (currentSerieIndex>-1) {
            const newContent = {...content};
            newContent.series.splice(currentSerieIndex,1);
            setCurrentSerieIndex(newContent.series.length>0?0:-1);
            setContent(newContent);
            onUpdate(newContent);
        }
    }

    const addSerie = () => {
        const newContent = {...content};
        newContent.series.push(getDefaultWidgetGraphXYSerieContent());
        setCurrentSerieIndex(newContent.series.length-1);
        setContent(newContent);
        onUpdate(newContent);
    }

    return (
        <Fragment>
            <Form.Group>
                <Form.Row>
                    <Form.Label column="sm" lg={2}>
                        Title
                    </Form.Label>
                    <Col>
                        <Form.Control size="sm" type="text" value={content.title} onChange={(e) => onChange("title", e.target.value)}/>
                    </Col>
                </Form.Row>
            </Form.Group>
            <Form.Group>
                <Form.Row>
                    <Form.Label column="sm" lg={2}>
                        Series
                    </Form.Label>
                    <Col>
                        <Form.Control as="select" size="sm" value={currentSerieIndex} onChange={selectSerie} {...(currentSerieIndex===-1 && { disabled: "disabled" })} >
                            { content.series.length===0 && <option value={-1}>No series defined...</option>}
                            {
                                content.series.length>0 && content.series.map((c,i) => (
                                    <option key={ "col" + i.toString()} value={i}>{ "# "+i.toString()+" "+c.title}</option>
                                ))
                            }
                        </Form.Control>
                    </Col>
                    <Col lg={2}>
                        <Button size="sm" variant="danger" {...(currentSerieIndex===-1 && { disabled: "disabled" })} block onClick={removeSerie}>Remove serie</Button>
                    </Col>
                    <Col lg={2}>
                        <Button size="sm" block onClick={addSerie}>Add new serie</Button>
                    </Col>
                </Form.Row>
            </Form.Group>
            {(currentSerieIndex>-1) && <Form.Group>
                <Form.Row>
                    <Form.Label column="sm" lg={2}>
                        Title
                    </Form.Label>
                    <Col>
                        <Form.Control size="sm" type="text" value={config.series[currentSerieIndex].title} onChange={(e) => onChangeSerieField("title", e.target.value)}/>
                    </Col>
                    <Form.Label column="sm" lg={2}>
                        Query
                    </Form.Label>
                    <Col>
                        <Form.Control size="sm" type="text" value={config.series[currentSerieIndex].query} onChange={(e) => onChangeSerieField("query", e.target.value)}/>
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Form.Label column="sm" lg={2}>
                        Field
                    </Form.Label>
                    <Col>
                        <Form.Control size="sm" type="text" value={config.series[currentSerieIndex].fieldX} onChange={(e) => onChangeSerieField("fieldX", e.target.value)}/>
                    </Col>
                    <Form.Label column="sm" lg={2}>
                        Transform
                    </Form.Label>
                    <Col>
                        <Form.Control size="sm" type="text" value={config.series[currentSerieIndex].transformX} onChange={(e) => onChangeSerieField("transformX", e.target.value)}/>
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Form.Label column="sm" lg={2}>
                        Field
                    </Form.Label>
                    <Col>
                        <Form.Control size="sm" type="text" value={config.series[currentSerieIndex].fieldY} onChange={(e) => onChangeSerieField("fieldY", e.target.value)}/>
                    </Col>
                    <Form.Label column="sm" lg={2}>
                        Transform
                    </Form.Label>
                    <Col>
                        <Form.Control size="sm" type="text" value={config.series[currentSerieIndex].transformY} onChange={(e) => onChangeSerieField("transformY", e.target.value)}/>
                    </Col>
                </Form.Row>
            </Form.Group>}
        </Fragment>
    )
}
