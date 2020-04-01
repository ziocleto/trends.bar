import "./react-grid-styles.css"
import "./react-resizable-styles.css"

import React, {Fragment, useEffect, useState} from "react";
import {Button, ButtonGroup, ButtonToolbar, Dropdown, DropdownButton} from "react-bootstrap";
import {ContentWidget} from "./ContentWidget";
import {Content} from "./CellContentEditor.styled";
import {ContentWidgetEditor} from "./ContentWidgetEditor";

export const CellContentEditor = ({data,content,onSave,onCancel}) => {

    const [cellContent,setCellContent]=useState(content);

    console.log(content);
    const resetContext = () => {
        setCellContent({
            ...content
        })
    }
    const setType = (type) => {
        console.log("Set type: ",type);
        setCellContent({
            ...content,
            type: type
        })
    }

    const onUpdateWidget = (content) => {
        setCellContent(content);
    }

    return (
        <Fragment>
            <br/>
            <ButtonToolbar>
                <ButtonGroup className="mr-2">
                    <Button onClick={() => onSave(cellContent)}>Save</Button>
                </ButtonGroup>
                <ButtonGroup className="mr-2">
                    <Button onClick={onCancel}>Cancel</Button>{' '}
                </ButtonGroup>
                <ButtonGroup className="mr-4">
                    <DropdownButton as={ButtonGroup} title={'Type: '+ cellContent.type.toUpperCase()} id="bg-nested-dropdown">
                        <Dropdown.Item onClick={() => setType('text')}>Text</Dropdown.Item>
                        <Dropdown.Item onClick={() => setType('graph')}>Graph</Dropdown.Item>
                        <Dropdown.Item onClick={() => setType('table')}>Table</Dropdown.Item>
                    </DropdownButton>
                </ButtonGroup>
                <ButtonGroup className="mr-2">
                    <Button onClick={resetContext}>Reset</Button>{' '}
                </ButtonGroup>
            </ButtonToolbar>
            <br/>
            <ContentWidgetEditor data={data} config={cellContent} onUpdate={onUpdateWidget}/>
            <Content>
                <ContentWidget data={data} config={cellContent}/>
            </Content>
        </Fragment>
    )
}