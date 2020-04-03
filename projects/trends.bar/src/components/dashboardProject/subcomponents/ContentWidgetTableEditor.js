import "./react-grid-styles.css"
import "./react-resizable-styles.css"

import React, {Fragment, useState} from "react";
import {Form,Col} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {getDefaultWidgetTableColumnContent} from "../../../modules/trends/layout";

export const ContentWidgetTableEditor = ({config,onUpdate}) => {

    console.log(config);
    const [content,setContent] = useState(config);
    const [currentColumnIndex,setCurrentColumnIndex] = useState(config.columns.length>0?0:-1);

    const onChange = (property, value) => {
        const newContent = {...content};
        newContent[property]=value;
        setContent(newContent);
        onUpdate(newContent);
    }

    const onChangeColumnField = (property, value) => {
        const newContent = {...content};
        newContent.columns[currentColumnIndex][property]=value;
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
            newContent.columns.splice(currentColumnIndex,1);
            setCurrentColumnIndex(newContent.columns.length>0?0:-1);
            setContent(newContent);
            onUpdate(newContent);
        }
    }

    const addColumn = () => {
        const newContent = {...content};
        newContent.columns.push(getDefaultWidgetTableColumnContent());
        setCurrentColumnIndex(newContent.columns.length-1);
        setContent(newContent);
        onUpdate(newContent);
    }

    return (
        <Fragment>
            <Form.Group>
                <Form.Row>
                    <Form.Label column="sm" lg={2}>
                        Key Title
                    </Form.Label>
                    <Col>
                        <Form.Control size="sm" type="text" value={content.keyTitle} onChange={(e) => onChange("keyTitle", e.target.value)}/>
                    </Col>
                    <Form.Label column="sm" lg={2}>
                        Key Query
                    </Form.Label>
                    <Col>
                        <Form.Control size="sm" type="text" value={content.keyQuery} onChange={(e) => onChange("keyQuery", e.target.value)}/>
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Form.Label column="sm" lg={2}>
                        Key Field
                    </Form.Label>
                    <Col>
                        <Form.Control size="sm" type="text" value={content.keyField} onChange={(e) => onChange("keyField", e.target.value)}/>
                    </Col>
                    <Form.Label column="sm" lg={2}>
                        Key Transform
                    </Form.Label>
                    <Col>
                        <Form.Control size="sm" type="text" value={content.keyTransform} onChange={(e) => onChange("keyTransform", e.target.value)}/>
                    </Col>
                </Form.Row>
            </Form.Group>
            <Form.Group>
                <Form.Row>
                    <Form.Label column="sm" lg={2}>
                        Columns
                    </Form.Label>
                    <Col>
                        <Form.Control as="select" size="sm" value={currentColumnIndex} onChange={selectColumn} {...(currentColumnIndex===-1 && { disabled: "disabled" })} >
                            { content.columns.length===0 && <option value={-1}>No columns defined...</option>}
                            {
                                content.columns.length>0 && content.columns.map((c,i) => (
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
                        <Form.Control size="sm" type="text" value={config.columns[currentColumnIndex].title} onChange={(e) => onChangeColumnField("title", e.target.value)}/>
                    </Col>
                    <Form.Label column="sm" lg={2}>
                        Query
                    </Form.Label>
                    <Col>
                        <Form.Control size="sm" type="text" value={config.columns[currentColumnIndex].query} onChange={(e) => onChangeColumnField("query", e.target.value)}/>
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Form.Label column="sm" lg={2}>
                        Field
                    </Form.Label>
                    <Col>
                        <Form.Control size="sm" type="text" value={config.columns[currentColumnIndex].field} onChange={(e) => onChangeColumnField("field", e.target.value)}/>
                    </Col>
                    <Form.Label column="sm" lg={2}>
                        Transform
                    </Form.Label>
                    <Col>
                        <Form.Control size="sm" type="text" value={config.columns[currentColumnIndex].transform} onChange={(e) => onChangeColumnField("transform", e.target.value)}/>
                    </Col>
                </Form.Row>
            </Form.Group>}
        </Fragment>
    );
}
