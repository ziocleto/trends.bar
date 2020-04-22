import React, {Fragment} from "reactn";
import {DashboardUserInnerMargins} from "../DashboardUser.styled";
import {useQuery} from "@apollo/react-hooks";
import {getUserTrends} from "../../../modules/trends/queries";
import {Dropdown, SplitButton} from "react-bootstrap";
import {DangerColorSpan, Flex, InfoTextSpan, Mx1} from "../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {useEffect} from "react";
import {checkQueryHasLoadedWithData, getQueryLoadedWithValue} from "../../../futuremodules/graphqlclient/query";
import {arrayExistsNotEmpty} from "../../../futuremodules/utils/utils";
import {PlusTitle} from "../../../futuremodules/reactComponentStyles/reactCommon";
import {
  editingTrendD,
  useRemoveTrend,
  userTrendsD
} from "../DashboardUserLogic";

export const UserAssets = ({state, dispatch}) => {

  const {username, currentUserTrends} = state;
  const userTrendsQuery = useQuery(getUserTrends(), {variables: {name:username}});
  const removeTrendMutation = useRemoveTrend(dispatch);

  useEffect(() => {
    // userTrendsQuery.refetch().then(() => {
      if (checkQueryHasLoadedWithData(userTrendsQuery)) {
        dispatch([userTrendsD, getQueryLoadedWithValue(userTrendsQuery).trends]);
        // setCurrentUserTrends(getQueryLoadedWithValue(userTrendsQuery).trends);
      }
    // });
  }, [userTrendsQuery, dispatch]);

  // I like the && double declaration approach now more then the ternary operator ? :, you'll see what I mean
  // in the return function ;)
  const hasTrends = arrayExistsNotEmpty(currentUserTrends);

  return (
    <Fragment>
      <DashboardUserInnerMargins>
        <PlusTitle text={"Your Trends:"}/>
      </DashboardUserInnerMargins>
      {hasTrends && (
        <Flex justifyContent={"start"}>
          {currentUserTrends.map(elem => {
              const trendId = elem.trendId;
              return (
                <div key={`fragment-${trendId}`}>
                    <SplitButton
                      title={<b>{trendId}</b>}
                      variant="primary"
                      onClick={() => dispatch([editingTrendD, trendId])}
                      key={trendId}>
                        <Dropdown.Item
                          onClick={() => dispatch([editingTrendD, trendId])}
                        >Open</Dropdown.Item>
                      <Dropdown.Divider/>
                      <Dropdown.Item onClick={() => removeTrendMutation(trendId, username)}>
                        <DangerColorSpan>Delete</DangerColorSpan>
                      </Dropdown.Item>
                    </SplitButton>
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
