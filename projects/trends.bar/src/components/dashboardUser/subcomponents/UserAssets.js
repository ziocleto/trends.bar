import React, {Fragment, useState, useGlobal} from "reactn";
import {DashboardUserInnerMargins} from "../DashboardUser.styled";
import {useQuery} from "@apollo/react-hooks";
import {getUserTrends} from "../../../modules/trends/queries";
import {LinkContainer} from "react-router-bootstrap";
import {Button, Dropdown, FormControl, InputGroup, SplitButton} from "react-bootstrap";
import {alertIfSuccessful, api, useApi} from "../../../futuremodules/api/apiEntryPoint";
import {sendInvitationToProject} from "../../../futuremodules/auth/projectApiCalls";
import {getUserName} from "../../../futuremodules/auth/authAccessors";
import {EditingUserTrend} from "../../../modules/trends/globals";

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

export const UserAssets = ({auth}) => {

  const name = getUserName(auth);
  const [, setEditingUserTrend] = useGlobal(EditingUserTrend);
  const {data, loading} = useQuery(getUserTrends(), {variables: {name}});

  const onManageProject = name => {
    // setCurrentManagedProject(name);
  };

  const onRemoveProject = name => {
  };

  let userProjects = (
    <span className="normal text-primary">
      It feels quite lonely in here!
    </span>
  );

  if (data && loading === false) {
    const trends = data.user.trends;
    userProjects = (
      <div className="project-login">
        {trends.map(elem => {
            const trendId = elem.trendId;
            const projectLink = "/dashboardproject/" + trendId;
            return (
              <div key={`fragment-${trendId}`} className="inliner-block my-1">
                <LinkContainer to={projectLink} onClick={ () => setEditingUserTrend(trendId)}>
                  <SplitButton
                    title={trendId}
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
                      Delete
                    </Dropdown.Item>
                  </SplitButton>
                </LinkContainer>
                <div
                  key={`dropdown-split-spacer-${trendId}`}
                  className="inliner mx-1"
                />
              </div>)
          }
        )}
      </div>
    );
  }

  return (
    <Fragment>
      <YourAssetsTitle/>
      {userProjects}
      <ProjectManagement name={name}/>
    </Fragment>
  )
};
