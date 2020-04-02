import "./react-grid-styles.css"
import "./react-resizable-styles.css"

import React, {Fragment, useState} from "react";
import {Form,Col} from "react-bootstrap";

export const ContentWidgetTableEditor = ({config,onUpdate}) => {

    const [content,setContent] = useState(config);

    const onChange = (property, value) => {
        const newContent = {...content};
        newContent[property]=value;
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
                        <Form.Control size="sm" type="text" defaultValue={content.keyTitle} onChange={(e) => onChange("keyTitle", e.target.value)}/>
                    </Col>
                    <Form.Label column="sm" lg={2}>
                        Key Query
                    </Form.Label>
                    <Col>
                        <Form.Control size="sm" type="text" defaultValue={content.keyQuery} onChange={(e) => onChange("keyQuery", e.target.value)}/>
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Form.Label column="sm" lg={2}>
                        Key Field
                    </Form.Label>
                    <Col>
                        <Form.Control size="sm" type="text" defaultValue={content.keyField} onChange={(e) => onChange("keyField", e.target.value)}/>
                    </Col>
                    <Form.Label column="sm" lg={2}>
                        Key Transform
                    </Form.Label>
                    <Col>
                        <Form.Control size="sm" type="text" defaultValue={content.keyTransform} onChange={(e) => onChange("keyTransform", e.target.value)}/>
                    </Col>
                </Form.Row>
            </Form.Group>
        </Fragment>
    );
}
