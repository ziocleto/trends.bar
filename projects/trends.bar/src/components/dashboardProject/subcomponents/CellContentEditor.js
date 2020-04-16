import "./Layout/react-grid-styles.css"
import "./Layout/react-resizable-styles.css"

import React, {Fragment, useState} from "react";
import {Button, ButtonGroup, ButtonToolbar, Dropdown, DropdownButton} from "react-bootstrap";
import {ContentWidget} from "./ContentWidget";
import {Content} from "./CellContentEditor.styled";
import {ContentWidgetEditor} from "./ContentWidgetEditor";
import {getDefaultWidgetContent} from "../../../modules/trends/layout";

export const CellContentEditor = ({data,content,onSave,onCancel}) => {

    const [cellContent,setCellContent]=useState(content);

    const resetContext = () => {
        setCellContent({
            ...content
        })
    }
    const setType = (type) => {
        if (cellContent.type!==type) {
            console.log("Set type: ",type);
            const newContent = getDefaultWidgetContent(type, content.i);
            setCellContent(newContent);
        }
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
                        <Dropdown.Item onClick={() => setType('table')}>Table</Dropdown.Item>
                        <Dropdown.Item onClick={() => setType('graphxy')}>Graph XY</Dropdown.Item>
                        {/*<Dropdown.Item onClick={() => setType('graph')}>Graph</Dropdown.Item>*/}
                    </DropdownButton>
                </ButtonGroup>
                <ButtonGroup className="mr-2">
                    <Button onClick={resetContext}>Reset</Button>{' '}
                </ButtonGroup>
            </ButtonToolbar>
            <br/>
            <ContentWidgetEditor config={cellContent} onUpdate={onUpdateWidget}/>
            <Content>
                <ContentWidget data={data} config={cellContent}/>
            </Content>
        </Fragment>
    )
}
