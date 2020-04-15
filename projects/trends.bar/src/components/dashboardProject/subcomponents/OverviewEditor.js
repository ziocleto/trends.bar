import React, {useEffect, useGlobal, useState} from "reactn";
import {My1} from "../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {Col, Container, ListGroup, Row} from "react-bootstrap";
import {DashboardUserFragment} from "../../dashboardUser/DashboardUser.styled";
import {useQuery} from "@apollo/react-hooks";
import {getTrendGraphsByUserTrendId} from "../../../modules/trends/queries";
import {EditingLayoutDataSource, useTrendIdGetter} from "../../../modules/trends/globals";
import {getQueryLoadedWithValueArrayNotEmpty} from "../../../futuremodules/graphqlclient/query";
import {graphArrayToGraphTree2} from "../../../modules/trends/dataGraphs";

export const OverviewEditor = ({username}) => {
  const trendId = useTrendIdGetter();

  const [values, setValues] = useState(new Set());
  const [groups, setGroups] = useState(new Set());
  const [groupElements, setGroupElements] = useState(new Set());
  const [layoutDataSource, setLayoutDataSource] = useGlobal(EditingLayoutDataSource);

  const trendDataQuery = useQuery(getTrendGraphsByUserTrendId(), {
    variables: {
      name: username,
      trendId: trendId
    }
  });

  useEffect(() => {
    trendDataQuery.refetch().then(() => {
        const queryData = getQueryLoadedWithValueArrayNotEmpty(trendDataQuery);
        if (queryData) {
          const gt = graphArrayToGraphTree2(queryData, "yValueGroup", "yValueSubGroup", "yValueName", "values");
          setLayoutDataSource( {
            ...layoutDataSource,
            ...gt
          }).then();
          console.log(gt);
          const tValues = new Set();
          const tGroups = new Set();
          const tGroupElements = new Set();
          queryData.map(elem => {
            tValues.add(elem.yValueName);
            tGroups.add(elem.yValueSubGroup);
            tGroupElements.add(elem.yValueGroup);
            return elem;
          });
          setValues(tValues);
          setGroups(tGroups);
          setGroupElements(tGroupElements);
          // console.log("values", tValues);
          // console.log("groups", tGroups);
          // console.log("groupElements", tGroupElements);

          let groupsSet = new Set();
          queryData.map(elem => groupsSet.add(elem.yValueGroup));
          let groupSetArray = Array.from(groupsSet);

          let groupQuerySet = {};
          let groupQuerySetOfSet = {};

          for (const group of groupSetArray) {
            groupQuerySet[group] = [];
            groupQuerySetOfSet[group] = {};
            queryData.map(elem => {
              if (elem.yValueGroup === group) {
                groupQuerySet[group].push(elem);
                // groupQuerySetOfSet[group] = .push(elem);
                groupQuerySetOfSet[group][elem.yValueSubGroup] ? groupQuerySetOfSet[group][elem.yValueSubGroup].push(elem) : groupQuerySetOfSet[group][elem.yValueSubGroup] = [elem];
              }
              return elem;
            });
          }
          // console.log("Set of sets", groupQuerySetOfSet);
        }
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trendDataQuery]);

  return (
    <DashboardUserFragment>
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
                (<ListGroup.Item key={elem}>{elem}</ListGroup.Item>)
              )}
            </ListGroup>
          </Col>
          <Col>
            <ListGroup>
              {Array.from(groups).map(elem =>
                (<ListGroup.Item key={elem}>{elem}</ListGroup.Item>)
              )}
            </ListGroup>
          </Col>
          <Col>
            <ListGroup>
              {Array.from(values).map(elem =>
                (<ListGroup.Item key={elem}>{elem}</ListGroup.Item>)
              )}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </DashboardUserFragment>
  )
};
