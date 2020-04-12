import React, {Fragment, useGlobal, withGlobal} from "reactn";
import {DashboardUserInnerMargins} from "../DashboardUser.styled";
import {useQuery} from "@apollo/react-hooks";
import {getUserTrends} from "../../../modules/trends/queries";
import {LinkContainer} from "react-router-bootstrap";
import {Dropdown, SplitButton} from "react-bootstrap";
import {getAuthUserName, getAuthWithGlobal} from "../../../futuremodules/auth/authAccessors";
import {currentUserTrends, EditingUserTrend} from "../../../modules/trends/globals";
import {DangerColorSpan, Flex, InfoTextSpan, Mx1} from "../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {useEffect} from "react";
import {checkQueryHasLoadedWithData, getQueryLoadedWithValue} from "../../../futuremodules/graphqlclient/query";
import {arrayExistsNotEmpty} from "../../../futuremodules/utils/utils";
import {useRemoveTrend} from "../../../modules/trends/mutations";

const UserAssets = (props) => {

  const name = getAuthUserName(props.auth);
  const [, setEditingUserTrend] = useGlobal(EditingUserTrend);
  const userTrendsQuery = useQuery(getUserTrends(), {variables: {name}});
  const [trends, setUserTrends] = useGlobal(currentUserTrends);
  const removeTrendMutation = useRemoveTrend();

  useEffect(() => {
    userTrendsQuery.refetch().then(() => {
      if (checkQueryHasLoadedWithData(userTrendsQuery)) {
        setUserTrends(getQueryLoadedWithValue(userTrendsQuery).trends).then();
      }
    });
  }, [userTrendsQuery, setUserTrends]);

  // I like the && double declaration approach now more then the ternary operator ? :, you'll see what I mean
  // in the return function ;)
  const hasTrends = arrayExistsNotEmpty(trends);

  return (
    <Fragment>
      <DashboardUserInnerMargins>
        <i className="fas fa-rocket"/> Your Trends:
      </DashboardUserInnerMargins>
      {hasTrends && (
        <Flex justifyContent={"start"}>
          {trends.map(elem => {
              const trendId = elem.trendId;
              const projectLink = "/dashboardproject/" + trendId;
              return (
                <div key={`fragment-${trendId}`}>
                  <LinkContainer to={projectLink} onClick={() => setEditingUserTrend(trendId)}>
                    <SplitButton
                      title={<b>{trendId}</b>}
                      variant="primary"
                      key={trendId}>
                      <LinkContainer to={projectLink}>
                        <Dropdown.Item>Open</Dropdown.Item>
                      </LinkContainer>
                      <Dropdown.Divider/>
                      <Dropdown.Item onClick={() => removeTrendMutation(trendId, name)}>
                        <DangerColorSpan>Delete</DangerColorSpan>
                      </Dropdown.Item>
                    </SplitButton>
                  </LinkContainer>
                  <Mx1/>
                </div>
              )
            }
          )}
        </Flex>
      )}
      {!hasTrends && (
        <InfoTextSpan>It feels quite lonely in here!</InfoTextSpan>
      )}
    </Fragment>
  )
};

export default withGlobal(
  global => getAuthWithGlobal(global)
)(UserAssets);
