import {api} from "../../../futuremodules/api/apiEntryPoint";
import {
  acceptInvitationToJoinProject,
  declineInvitationToJoinProject
} from "../../../futuremodules/auth/projectApiCalls";
import React, {Fragment} from "reactn";
import {Dropdown, SplitButton} from "react-bootstrap";
import {DashboardUserInnerMargins} from "../DashboardUser.styled";
import {getUserEmail, getUserInvitations} from "../../../futuremodules/auth/authAccessors";

export const AssetInvitations = ({auth}) => {
  const email = getUserEmail(auth);
  const invitations = getUserInvitations(auth);

  const onAcceptInvitation = project => {
    api(auth, acceptInvitationToJoinProject, project, email);
  };

  const onDeclineInvitation = project => {
    api(auth, declineInvitationToJoinProject, project, email);
  };

  const invitationsCode =
    invitations ? (
      <span className="normal text-secondary-alt">No invitations yet.</span>
    ) : (
      <div className="project-login">
        {invitations.map(elem => (
          <Fragment key={`fragment-${elem}`}>
            <SplitButton
              title={elem}
              variant="info"
              id={`dropdown-split-variants-${elem}`}
              key={elem}
            >
              <Dropdown.Item
                eventKey="1"
                onClick={e => onAcceptInvitation(elem)}
              >
                Accept
              </Dropdown.Item>
              <Dropdown.Item
                eventKey="2"
                onClick={e => onDeclineInvitation(elem)}
              >
                Decline
              </Dropdown.Item>
            </SplitButton>
            <div
              key={`dropdown-split-spacer-${elem}`}
              className="inliner mx-1"
            />
          </Fragment>
        ))}
      </div>
    );

  return (
    <div>
      <DashboardUserInnerMargins>
        <i className="far fa-envelope-open"> </i> Pending Project invitations
      </DashboardUserInnerMargins>
      {invitationsCode}
    </div>
  );
}
