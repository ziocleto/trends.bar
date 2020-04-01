import "./react-grid-styles.css"
import "./react-resizable-styles.css"

import React, {Fragment, useState} from "react";
import {SubTitle, Title} from "./ContentWidget.styled";
import {Form,Col} from "react-bootstrap";

export const ContentWidgetEditor = ({data,config,onUpdate}) => {

    const [content,setContent] = useState(config);

    const onChange = (property, value) => {
        const newContent = {...content};
        newContent[property]=value;
        setContent(newContent);
        onUpdate(newContent);
    }

    if (config.type==="text") {
        return (
            <Fragment>
                <Form.Group>
                    <Form.Row>
                        <Form.Label column="sm" lg={2}>
                            Title
                        </Form.Label>
                        <Col>
                            <Form.Control size="sm" type="text" defaultValue={content.title} onChange={(e) => onChange("title", e.target.value)}/>
                        </Col>
                    </Form.Row>
                    <Form.Row>
                        <Form.Label column="sm" lg={2}>
                            Subtitle
                        </Form.Label>
                        <Col>
                            <Form.Control size="sm" type="text" defaultValue={content.subTitle} onChange={(e) => onChange("subTitle", e.target.value)}/>
                        </Col>
                    </Form.Row>
                </Form.Group>
            </Fragment>
        )
    }

    return (
        <Fragment></Fragment>
    )
}
