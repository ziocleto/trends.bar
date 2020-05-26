import "./Layout/react-grid-styles.css"
import "./Layout/react-resizable-styles.css"

import React, {Fragment, useState} from "react";
import {Form,Col,Tabs,Tab} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {getDefaultWidgetTableColumnContent} from "../../../modules/trends/layout";

export const ContentWidgetTableEditor = ({config,onUpdate}) => {

    const [content,setContent] = useState(config);
    const [currentColumnIndex,setCurrentColumnIndex] = useState(config.tableColumns.length>0?0:-1);

    const onChange = (property, value) => {
        const newContent = {...content};
        newContent[property]=value;
        setContent(newContent);
        onUpdate(newContent);
    }

    const onChangeColumnField = (property, value) => {
        const newContent = {...content};
        newContent.tableColumns[currentColumnIndex][property]=value;
        setContent(newContent);
        onUpdate(newContent);
    }

    const selectColumn = (event) => {
        const newIndex=event.target.value;
        setCurrentColumnIndex(newIndex);
    }

    const removeColumn = () => {
        if (currentColumnIndex>-1) {
            const newContent = {...content};
            newContent.tableColumns.splice(currentColumnIndex,1);
            setCurrentColumnIndex(newContent.tableColumns.length>0?0:-1);
            setContent(newContent);
            onUpdate(newContent);
        }
    }

    const addColumn = () => {
        const newContent = {...content};
        newContent.tableColumns.push(getDefaultWidgetTableColumnContent());
        setCurrentColumnIndex(newContent.tableColumns.length-1);
        setContent(newContent);
        onUpdate(newContent);
    }

    return (
        <Fragment>
            <Tabs>
                <Tab eventKey="home" title="General">
                    <br/>
                    <Form.Group>
                        <Form.Row>
                            <Form.Label column="sm" lg={2}>
                                Key Title
                            </Form.Label>
                            <Col>
                                <Form.Control size="sm" type="text" value={content.tableKeyTitle} onChange={(e) => onChange("tableKeyTitle", e.target.value)}/>
                            </Col>
                            <Form.Label column="sm" lg={2}>
                                Key Query
                            </Form.Label>
                            <Col>
                                <Form.Control size="sm" type="text" value={content.tableKeyQuery} onChange={(e) => onChange("tableKeyQuery", e.target.value)}/>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label column="sm" lg={2}>
                                Key Field
                            </Form.Label>
                            <Col>
                                <Form.Control size="sm" type="text" value={content.tableKeyField} onChange={(e) => onChange("tableKeyField", e.target.value)}/>
                            </Col>
                            <Form.Label column="sm" lg={2}>
                                Key Transform
                            </Form.Label>
                            <Col>
                                <Form.Control size="sm" type="text" value={content.tableKeyTransform} onChange={(e) => onChange("tableKeyTransform", e.target.value)}/>
                            </Col>
                        </Form.Row>
                    </Form.Group>
                </Tab>
                <Tab eventKey="profile" title="Columns">
                    <br/>
                    <Form.Group>
                        <Form.Row>
                            <Form.Label column="sm" lg={2}>
                                Column
                            </Form.Label>
                            <Col>
                                <Form.Control as="select" size="sm" value={currentColumnIndex} onChange={selectColumn} {...(currentColumnIndex===-1 && { disabled: "disabled" })} >
                                    { content.tableColumns.length===0 && <option value={-1}>No columns defined...</option>}
                                    {
                                        content.tableColumns.length>0 && content.tableColumns.map((c,i) => (
                                            <option key={ "col" + i.toString()} value={i}>{ "# "+i.toString()+" "+c.title}</option>
                                        ))
                                    }
                                </Form.Control>
                            </Col>
                            <Col lg={2}>
                                <Button size="sm" variant="danger" {...(currentColumnIndex===-1 && { disabled: "disabled" })} block onClick={removeColumn}>Remove column</Button>
                            </Col>
                            <Col lg={2}>
                                <Button size="sm" block onClick={addColumn}>Add new column</Button>
                            </Col>
                        </Form.Row>
                    </Form.Group>
                    {(currentColumnIndex>-1) && <Form.Group>
                        <Form.Row>
                            <Form.Label column="sm" lg={2}>
                                Title
                            </Form.Label>
                            <Col>
                                <Form.Control size="sm" type="text" value={config.tableColumns[currentColumnIndex].title} onChange={(e) => onChangeColumnField("title", e.target.value)}/>
                            </Col>
                            <Form.Label column="sm" lg={2}>
                                Query
                            </Form.Label>
                            <Col>
                                <Form.Control size="sm" type="text" value={config.tableColumns[currentColumnIndex].query} onChange={(e) => onChangeColumnField("query", e.target.value)}/>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label column="sm" lg={2}>
                                Field
                            </Form.Label>
                            <Col>
                                <Form.Control size="sm" type="text" value={config.tableColumns[currentColumnIndex].field} onChange={(e) => onChangeColumnField("field", e.target.value)}/>
                            </Col>
                            <Form.Label column="sm" lg={2}>
                                Transform
                            </Form.Label>
                            <Col>
                                <Form.Control size="sm" type="text" value={config.tableColumns[currentColumnIndex].transform} onChange={(e) => onChangeColumnField("transform", e.target.value)}/>
                            </Col>
                        </Form.Row>
                    </Form.Group>}
                </Tab>
            </Tabs>
        </Fragment>
    );
}
