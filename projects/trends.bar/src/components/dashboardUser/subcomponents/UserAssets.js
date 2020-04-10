import React, {Fragment, useGlobal, useState, withGlobal} from "reactn";
import {DashboardUserInnerMargins} from "../DashboardUser.styled";
import {useQuery} from "@apollo/react-hooks";
import {getUserTrends} from "../../../modules/trends/queries";
import {LinkContainer} from "react-router-bootstrap";
import {Button, Dropdown, FormControl, InputGroup, SplitButton} from "react-bootstrap";
import {alertIfSuccessful, api, useApi} from "../../../futuremodules/api/apiEntryPoint";
import {sendInvitationToProject} from "../../../futuremodules/auth/projectApiCalls";
import {getAuthUserName, getAuthWithGlobal} from "../../../futuremodules/auth/authAccessors";
import {EditingUserTrend} from "../../../modules/trends/globals";
import {Flex, InfoTextSpan} from "../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {Mx1} from "../../Navbar.styled";
import {DangerColorSpan} from "../../dashboardProject/subcomponents/GatherEditor-styled";
import {useEffect} from "react";
import {checkQueryHasLoadedWithData, getQueryLoadedWithValue} from "../../../futuremodules/graphqlclient/query";
import {arrayExistsNotEmpty} from "../../../futuremodules/utils/utils";

const YourAssetsTitle = () => {
  return (
    <DashboardUserInnerMargins>
      <i className="fas fa-rocket"/> Your Trends:
    </DashboardUserInnerMargins>
  );
}

const ProjectManagement = ({name}) => {

  const projectApi = useApi('project');
  const [, , , alertStore] = projectApi;
  let inviteNameRef = React.useRef(null);
  const [currentManagedProject, setCurrentManagedProject] = useState(null);

  if (!currentManagedProject) return <Fragment/>

  const invite = async () => {
    const invited = inviteNameRef.current.value;
    const res = await api(projectApi, sendInvitationToProject, name, currentManagedProject, invited);
    alertIfSuccessful(res, alertStore, "Great stuff!", invited + " has been invited, give them a shout!");
  }

  const closeProjectManagement = () => {
    setCurrentManagedProject(null);
  };

  return (
    <div className="projectManagementContainer">
      <div className="projectInvitationGrid">
        <div className="lead text-secondary-alt">{currentManagedProject}</div>
        <div className="closeButton-a">
          <Button
            variant="outline-dark"
            onClick={e => closeProjectManagement()}
          >
            <i className="fas fa-times-circle"/>
          </Button>
        </div>
      </div>
      <div className="width100">Send invitation to join:</div>
      <InputGroup className="mb-3" onKeyPress={(target) => {
        if (target.charCode === 13) {
          invite()
        }
      }}
      >
        <InputGroup.Prepend>
          <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          placeholder="Username or email address"
          aria-label="Username"
          aria-describedby="basic-addon1"
          ref={inviteNameRef}
        />
        <InputGroup.Append>
          <Button variant="info" onClick={() => invite()}>
            Invite
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </div>
  );
};

const UserAssets = (props) => {

  const name = getAuthUserName(props.auth);
  const [, setEditingUserTrend] = useGlobal(EditingUserTrend);
  const userTrendsQuery = useQuery(getUserTrends(), {variables: {name}});
  const [trends, setUserTrends] = useState(null);

  useEffect(() => {
    if (checkQueryHasLoadedWithData(userTrendsQuery)) {
      setUserTrends(getQueryLoadedWithValue(userTrendsQuery).trends);
    }
  }, [userTrendsQuery]);

  const onManageProject = name => {
    // setCurrentManagedProject(name);
  };

  const onRemoveProject = name => {
  };

  const userProjects = arrayExistsNotEmpty(trends) ? (
    <Flex>
      {trends.map(elem => {
          const trendId = elem.trendId;
          const projectLink = "/dashboardproject/" + trendId;
          return (
            <div key={`fragment-${trendId}`}>
              <LinkContainer to={projectLink} onClick={() => setEditingUserTrend(trendId)}>
                <SplitButton
                  title={<b>{trendId}</b>}
                  variant="primary"
                  id={`dropdown-split-variants-${trendId}`}
                  key={trendId}
                >
                  <LinkContainer to={projectLink}>
                    <Dropdown.Item
                      eventKey="1"
                    >
                      Open
                    </Dropdown.Item>
                  </LinkContainer>
                  <Dropdown.Item
                    eventKey="2"
                    onClick={e => onManageProject(trendId)}
                  >
                    Invite People
                  </Dropdown.Item>
                  <Dropdown.Divider/>
                  <Dropdown.Item
                    eventKey="3"
                    variant="danger"
                    onClick={e => onRemoveProject(trendId)}
                  >
                    <DangerColorSpan>Delete</DangerColorSpan>
                  </Dropdown.Item>
                </SplitButton>
              </LinkContainer>
              <Mx1/>
            </div>)
        }
      )}
    </Flex>
  ) : (
    <InfoTextSpan>
      It feels quite lonely in here!
    </InfoTextSpan>
  );

  return (
    <Fragment>
      <YourAssetsTitle/>
      {userProjects}
      <ProjectManagement name={name}/>
    </Fragment>
  )
};

export default withGlobal(
  global => getAuthWithGlobal(global)
)(UserAssets);
