import React, {Fragment, useEffect, useState} from "react";
import {Div50, My1} from "../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {Col, Container, ListGroup, Row} from "react-bootstrap";
import {DashboardUserFragment} from "../../dashboardUser/DashboardUser.styled";
import {useQuery} from "@apollo/react-hooks";
import {getSimilarTrends, getTrendGraphsByUserTrendIdNoValues} from "../../../modules/trends/queries";
import {Redirect} from "react-router-dom";
import {SearchBarResultContainer, SearchBarResultTrendId, SearchBarResultUser} from "../../Landing/Landing.styled";
import {useTrendIdGetter} from "../../../modules/trends/globals";
import {getQueryLoadedWithValueArrayNotEmpty} from "../../../futuremodules/graphqlclient/query";

const SearchResults = ({trendIdPartial}) => {
  const {data, loading} = useQuery(getSimilarTrends(trendIdPartial));
  const [results, setResults] = useState([]);
  const [finalized, setfinalized] = useState({
    clicked: false,
    username: "",
    trendId: ""
  });

  if (data && data.trend_similar && loading === false) {
    if (results !== data.trend_similar) {
      setResults(data.trend_similar);
    }
  }

  if (finalized.clicked) {
    return <Redirect push={true} to={`/${finalized.username}/${finalized.trendId}`}/>
  }

  return (
    <Fragment>
      {results.map(e => {
        const key = e.trendId + e.user.name;
        return (
          <SearchBarResultContainer
            key={key}
            onClick={() => setfinalized({
              clicked: true,
              username: e.user.name,
              trendId: e.trendId
            })}
          >
            <SearchBarResultTrendId>
              {e.trendId}
            </SearchBarResultTrendId>
            <SearchBarResultUser>
              <i className="fas fa-user"/>{" "}{e.user.name}
            </SearchBarResultUser>
          </SearchBarResultContainer>
        )
      })
      }
    </Fragment>
  )
};

export const OverviewEditor = ({username}) => {
  const [trendIdPartial, onTrendSelector] = useState(null);
  const trendId = useTrendIdGetter();

  const [values, setValues] = useState(new Set());
  const [groups, setGroups] = useState(new Set());
  const [groupElements, setGroupElements] = useState(new Set());

  const trendDataQuery = useQuery(getTrendGraphsByUserTrendIdNoValues(), {
    variables: {
      name: username,
      trendId: trendId
    }
  });

  useEffect(() => {
    trendDataQuery.refetch().then(() => {
        const queryData = getQueryLoadedWithValueArrayNotEmpty(trendDataQuery);
        if (queryData) {
          const tValues = new Set();
          const tGroups = new Set();
          const tGroupElements = new Set();
          queryData.map(elem => {
            tValues.add(elem.title);
            tGroups.add(elem.label);
            tGroupElements.add(elem.subLabel);
          });
          setValues(tValues);
          setGroups(tGroups);
          setGroupElements(tGroupElements);
          console.log("values", tValues);
          console.log("groups", tGroups);
          console.log("groupElements", tGroupElements);
        }
      }
    );
  }, [trendDataQuery]);

  return (
    <DashboardUserFragment>
      <Div50>
        <div>
          <i className="fas fa-plus-circle"/> What trend are you interested in?
        </div>
        <My1>{" "}</My1>
        {/*<InputGroup className="mb-1">*/}
        {/*  <Form.Control name="trendName" placeholder="Trend Name"*/}
        {/*                onChange={e => onTrendSelector(e)}/>*/}
        {/*</InputGroup>*/}
        {/*<SearchResults trendIdPartial={trendIdPartial}/>*/}
        <Container>
          <Row>
            <Col>
              <ListGroup>
                {Array.from(groupElements).map(elem =>
                  (<ListGroup.Item>{elem}</ListGroup.Item>)
                )}
              </ListGroup>
            </Col>
            <Col>
              <ListGroup>
                {Array.from(groups).map(elem =>
                  (<ListGroup.Item>{elem}</ListGroup.Item>)
                )}
              </ListGroup>
            </Col>
            <Col>
              <ListGroup>
                {Array.from(values).map(elem =>
                  (<ListGroup.Item>{elem}</ListGroup.Item>)
                )}
              </ListGroup>
            </Col>
          </Row>
        </Container>
      </Div50>

    </DashboardUserFragment>
  )
};
