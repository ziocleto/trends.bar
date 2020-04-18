import React from "reactn";
import "./DataSources.css"
import {Fragment, useEffect, useState} from "react";
import {api, useApi} from "../../../../futuremodules/api/apiEntryPoint";
import {deleteScript, getScripts, patchScript} from "../../../../futuremodules/fetch/fetchApiCalls";
import {useTrendIdGetter} from "../../../../modules/trends/globals";
import {
  DangerColorSpan,
  FlexWithBorder,
  InfoTextSpan,
  SecondaryAltColorTextSpanBold
} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {arrayExistsNotEmpty} from "../../../../futuremodules/utils/utils";
import {Container, Dropdown, Row, SplitButton} from "react-bootstrap";
import {RocketTitle, RowSeparator} from "../../../../futuremodules/reactComponentStyles/reactCommon";

export const UserDataSources = () => {

  const fetchApi = useApi('fetch');
  const [fetchResult] = fetchApi;
  const [userScripts, setUserScripts] = useState([]);
  const trendId = useTrendIdGetter();

  useEffect(() => {
    if (fetchResult &&
      ((fetchResult.api === trendId) ||
        (fetchResult.api === "script" && fetchResult.method === "delete"))) {
      setUserScripts(fetchResult.ret);
    }
  }, [fetchResult, trendId]);

  useEffect(() => {
    if (trendId) {
      api(fetchApi, getScripts, trendId).then(() => {
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trendId]);

  const updateScript = name => {
    api(fetchApi, patchScript, trendId, name).then();
  };

  const removeScript = name => {
    api(fetchApi, deleteScript, trendId, name).then();
  };

  return (
    <Fragment>
      <RowSeparator/>
      <Row>
        <RocketTitle text={"Curating:"}/>
      </Row>
      <RowSeparator/>
      <Container fluid>
        {userScripts.map(elem => {
            return (
              <Row key={elem.name}>
                <FlexWithBorder width={"50%"}>
                  <div>
                    <SecondaryAltColorTextSpanBold>
                      {elem.name}
                    </SecondaryAltColorTextSpanBold>
                  </div>
                  <div>
                    <SplitButton
                      title={<b>Update</b>}
                      variant="info"
                      onClick={() => updateScript(elem.name)}>
                      <Dropdown.Item>Set to repeat</Dropdown.Item>
                      <Dropdown.Divider/>
                      <Dropdown.Item onClick={() => removeScript(elem.name)}>
                        <DangerColorSpan>Delete</DangerColorSpan>
                      </Dropdown.Item>
                    </SplitButton>
                  </div>
                  {/*<div>*/}
                  {/*  <Button variant={"info"} onClick={ ()=> updateScript(elem.name)}>Update</Button>*/}
                  {/*</div>*/}
                </FlexWithBorder>
              </Row>
            )
          }
        )}
      </Container>
      {!arrayExistsNotEmpty(userScripts) && (
        <InfoTextSpan>Nothing yet! Grab or create a new one.</InfoTextSpan>
      )}
    </Fragment>
  )
};
