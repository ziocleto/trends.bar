import React from "reactn";
import "./DataSources.css"
import {Fragment, useEffect, useState} from "react";
import {api, useApi} from "../../../../futuremodules/api/apiEntryPoint";
import {getScripts} from "../../../../futuremodules/fetch/fetchApiCalls";
import {useTrendIdGetter} from "../../../../modules/trends/globals";
import {
  FlexWithBorder,
  InfoTextSpan,
  SecondaryAltColorTextSpanBold
} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {arrayExistsNotEmpty} from "../../../../futuremodules/utils/utils";
import {Button, Container, Row} from "react-bootstrap";
import {RocketTitle, RowSeparator} from "../../../../futuremodules/reactComponentStyles/reactCommon";

export const UserDataSources = () => {

  const fetchApi = useApi('fetch');
  const [fetchResult] = fetchApi;
  const [userScripts, setUserScripts] = useState([]);
  const trendId = useTrendIdGetter();

  useEffect(() => {
    if (fetchResult && fetchResult.api === trendId) {
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

  return (
    <Fragment>
      <RowSeparator/>
      <Row>
        <RocketTitle text={"Your own Data Sources:"}/>
      </Row>
      <RowSeparator/>
      <Container fluid>
        {userScripts.map(elem => {
            return (
              <Row>
                <FlexWithBorder width={"50%"}>
                  <div>
                    <SecondaryAltColorTextSpanBold>
                      {elem.name}
                    </SecondaryAltColorTextSpanBold>
                  </div>
                  <div>
                    <Button variant={"info"}>Run</Button>
                  </div>
                </FlexWithBorder>
              </Row>
            )
          }
        )}
      </Container>
      {!arrayExistsNotEmpty(userScripts) && (
        <InfoTextSpan>It feels quite lonely in here!</InfoTextSpan>
      )}
    </Fragment>
  )
};
