import React from "reactn";
import {TrendGrid, TrendLayout} from "../common.styled";
import {getUserName, isUserAuthenticated} from "../../futuremodules/auth/authAccessors";
import {getFileNameOnlyNoExt, sanitizeURLParams} from "../../futuremodules/utils/utils";
import {Redirect, useLocation} from "react-router-dom";
import {ScriptCodeEditor} from "./subcomponents/TextEditor";

export const DashboardProject = ({auth}) => {

  // const initialState = {
  //   startDate: null,
  //   endDate: null,
  //   focusedInput: null,
  //   chosenDate: null
  // };

  const trendId = sanitizeURLParams(getFileNameOnlyNoExt(useLocation().pathname));
  // const [state, dispatch] = useReducer(reducer, initialState);
  // const [deleteTrendGraph] = useMutation(DELETE_TREND_GRAPH);

  if (!isUserAuthenticated(auth) || trendId === null) {
    return (<Redirect to={"/"}/>)
  }

  const username = getUserName(auth);

  // const deleteTrend = () => {
  //   deleteTrendGraph({
  //     variables: {
  //       trendId: trendId,
  //       username: auth.username
  //     }
  //   });
  // }
  //
  // function reducer(state, action) {
  //   switch (action.type) {
  //     case 'focusChange':
  //       let cd = null;
  //       if (state.startDate && state.endDate && action.payload === null) {
  //         cd = moment(state.endDate);
  //       }
  //       return {...state, focusedInput: action.payload, chosenDate: cd};
  //     case 'dateChange':
  //       return action.payload;
  //     default:
  //       throw new Error()
  //   }
  // }

  return (
    <TrendLayout>
      <TrendGrid>
          <ScriptCodeEditor trendId={trendId} username={username}/>
        {/*<FlexContainer>*/}
        {/*  <DateRangeInput*/}
        {/*    onDatesChange={data => dispatch({type: 'dateChange', payload: data})}*/}
        {/*    onFocusChange={focusedInput => dispatch({type: 'focusChange', payload: focusedInput})}*/}
        {/*    startDate={state.startDate} // Date or null*/}
        {/*    endDate={state.endDate} // Date or null*/}
        {/*    focusedInput={state.focusedInput} // START_DATE, END_DATE or null*/}
        {/*  />*/}
        {/*</FlexContainer>*/}
        {/*<FlexContainer>*/}
        {/*  <Button variant="danger" onClick={() => deleteTrend()}>Reset Data</Button>*/}
        {/*</FlexContainer>*/}
      </TrendGrid>
    </TrendLayout>
  );
};
