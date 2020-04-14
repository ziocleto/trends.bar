import "./react-grid-styles.css"
import "./react-resizable-styles.css"

import React, {Fragment, useState} from "react";
import {Form,Col} from "react-bootstrap";

export const ContentWidgetTextEditor = ({config,onUpdate}) => {

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
                        Title
                    </Form.Label>
                    <Col>
                        <Form.Control size="sm" type="text" value={content.title} onChange={(e) => onChange("title", e.target.value)}/>
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Form.Label column="sm" lg={2}>
                        Subtitle
                    </Form.Label>
                    <Col>
                        <Form.Control size="sm" type="text" value={content.subtitle} onChange={(e) => onChange("subtitle", e.target.value)}/>
                    </Col>
                </Form.Row>
            </Form.Group>
        </Fragment>
    );
}
