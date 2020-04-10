import React, {withGlobal} from "reactn";
import {getAuthUserName, getAuthWithGlobal} from "../../../futuremodules/auth/authAccessors";
import {
  LightColorTextSpan,
  SecondaryAltColorTextSpan
} from "../../../futuremodules/reactComponentStyles/reactCommon.styled";

const WelcomeToTheJungle = (props) => {

  const name = getAuthUserName(props.auth);

  return (
    <div>
      <LightColorTextSpan fontSize={"var(--font-size-medium)"}>Hello, </LightColorTextSpan>{" "}
      <SecondaryAltColorTextSpan fontSize={"var(--font-size-very-large)"}>
        {name}
      </SecondaryAltColorTextSpan>
    </div>
  )
}

export default withGlobal(
  global => getAuthWithGlobal(global),
)(WelcomeToTheJungle);
