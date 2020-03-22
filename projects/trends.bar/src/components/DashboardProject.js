import React, {useGlobal, useReducer} from "reactn";
import {FlexContainer} from "./TrendPageStyle";
import {DateRangeInput} from "@datepicker-react/styled";
import {Button} from "react-bootstrap";
import moment from "moment";
import {useMutation} from "@apollo/react-hooks";
import {DELETE_TREND_GRAPH, UPSERT_TREND_GRAPH} from "../modules/trends/mutations";
import {TrendGrid, TrendLayout} from "./common.styled";
import {Auth} from "../futuremodules/auth/authAccessors";
import {useLocation} from "react-router-dom";
import {getFileNameOnlyNoExt} from "../futuremodules/utils/utils";

export const DashboardProject = () => {

  const initialState = {
    startDate: null,
    endDate: null,
    focusedInput: null,
    chosenDate: null
  }

  const location = useLocation();
  const trendId = getFileNameOnlyNoExt(location.pathname);
  const [auth] = useGlobal(Auth);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [upserTrendGraph] = useMutation(UPSERT_TREND_GRAPH);
  const [deleteTrendGraph] = useMutation(DELETE_TREND_GRAPH);

  console.log(trendId);
// const [createTrend] = useMutation(CREATE_TREND);
// createTrend({variables: {trendId: trendId}}).then();

  const deleteTrend = () => {
    deleteTrendGraph({
      variables: {
        trendId: trendId,
        username: auth.username
      }
    });
  }

  const updateTrend = () => {
    upserTrendGraph({
      variables: {
        script: {
          "trendId": trendId,
          "source": "World Health Organization",
          "sourceName": "situation-report",
          "graphType": ["Date", "Int"],
          "timestamp": state.chosenDate.format("YYYYMMDD"),
          "timestampFormat": "YYYYMMDD",
          "functions": [
            {
              "type": "2d",
              "key": "Cases",
              "datasets": [
                {
                  "title": "Worldwide",
                  "actions": [
                    {
                      "regex": {
                        "body": "Globally[\\n\\r\\s]*(\\d+\\s*\\d*)\\sconfirmed",
                        "flags": "mi"
                      }
                    }
                  ]
                },
                {
                  "title": "China",
                  "actions": [
                    {
                      "regex": {
                        "body": "total\\s*\\n*\\d+\\s*\\n*\\d+ \\d+ \\d+ (\\d+) \\d+",
                        "flags": "mi"
                      }
                    }
                  ]
                },
                {
                  "title": "Rest of the World",
                  "actions": [
                    {
                      "validRange": {
                        "from": "00000101",
                        "to": "20200301"
                      },
                      "regex": {
                        "body": "grand total\\W*(\\d+\\s*\\d*)\\W*\\d+\\s*\\d*\\W*\\d+\\s*\\d*\\W*\\d+\\s*\\d*",
                        "flags": "mi"
                      }
                    },
                    {
                      "validRange": {
                        "from": "20200302",
                        "to": "99990301"
                      },
                      "regex": {
                        "body": "grand total\\n*\\S*\\n* (\\d+\\s*\\d*) \\d+ \\d+ \\d+",
                        "flags": "mi"
                      }
                    }
                  ]
                },
                {
                  "title": "$country",
                  "actions": [
                    {
                      "startRegex": {
                        "body": "table 2\\.",
                        "flags": "mi"
                      },
                      "endRegex": {
                        "body": "grand total",
                        "flags": "mi"
                      },
                      "regex": {
                        "body": "[\\s\\/\\)\\(\\D&-]+(\\d+) \\d+ \\d+ \\d+ \\D+ \\d+",
                        "flags": "gmi",
                        "resolver": "postTransform"
                      },
                      "postTransform": {
                        "transform": "replace",
                        "source": "regexp",
                        "sourceIndex": 0,
                        "valueIndex": 1,
                        "dest": "$country",
                        "algo": "matchCountryName"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "type": "2d",
              "key": "Deaths",
              "datasets": [
                {
                  "title": "Worldwide",
                  "actions": [
                    {
                      "startRegex": {
                        "body": "SITUATION IN NUMBERS",
                        "flags": "mi"
                      },
                      "endRegex": {
                        "body": "WHO RISK ASSESSMENT",
                        "flags": "mi"
                      },
                      "regex": {
                        "body": "(\\d+\\s*\\d*)\\sdeath|death",
                        "flags": "mi",
                      }
                    },
                    {
                      "validRange": {
                        "from": "00000101",
                        "to": "20200308"
                      },
                      "startRegex": {
                        "body": "SITUATION IN NUMBERS",
                        "flags": "mi"
                      },
                      "endRegex": {
                        "body": "WHO RISK ASSESSMENT",
                        "flags": "mi"
                      },
                      "regex": {
                        "body": "(\\d+\\s*\\d*)\\sdeath|death",
                        "flags": "gmi",
                        "resolver": "accumulator"
                      }
                    }
                  ]
                },
                {
                  "title": "China",
                  "actions": [
                    {
                      "regex": {
                        "body": "total\\s*\\n*\\d+\\s*\\n*\\d+ \\d+ \\d+ \\d+ (\\d+)",
                        "flags": "mi"
                      }
                    }
                  ]
                },
                {
                  "title": "Rest of the World",
                  "actions": [
                    {
                      "validRange": {
                        "from": "00000101",
                        "to": "20200301"
                      },
                      "regex": {
                        "body": "grand total\\W*\\d+\\s*\\d*\\d+\\s*\\d*\\W*\\d+\\s*\\d*\\W*(\\d+\\s*\\d*)\\W*\\d+\\s*\\d*",
                        "flags": "mi"
                      }
                    },
                    {
                      "validRange": {
                        "from": "20200302",
                        "to": "99990301"
                      },
                      "regex": {
                        "body": "grand total\\n*\\S*\\n* \\d+\\s*\\d* \\d+ (\\d+) \\d+",
                        "flags": "mi"
                      }
                    }
                  ]
                },
                {
                  "title": "$country",
                  "actions": [
                    {
                      "startRegex": {
                        "body": "table 2\\.",
                        "flags": "mi"
                      },
                      "endRegex": {
                        "body": "grand total",
                        "flags": "mi"
                      },
                      "regex": {
                        "body": "[\\s\\/\\)\\(\\D&-]+\\d+ \\d+ (\\d+) \\d+ \\D+ \\d+",
                        "flags": "gmi",
                        "resolver": "postTransform"
                      },
                      "postTransform": {
                        "transform": "replace",
                        "source": "regexp",
                        "sourceIndex": 0,
                        "valueIndex": 1,
                        "dest": "$country",
                        "algo": "matchCountryName"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    }).then();
  };

  function reducer(state, action) {
    switch (action.type) {
      case 'focusChange':
        let cd = null
        if ( state.startDate && state.endDate && action.payload === null ) {
          cd = moment(state.endDate);
        }
        return {...state, focusedInput: action.payload, chosenDate: cd}
      case 'dateChange':
        return action.payload
      default:
        throw new Error()
    }
  }

  return (
    <TrendLayout>
      <TrendGrid>
      <FlexContainer>
        <DateRangeInput
          onDatesChange={data => dispatch({type: 'dateChange', payload: data})}
          onFocusChange={focusedInput => dispatch({type: 'focusChange', payload: focusedInput})}
          startDate={state.startDate} // Date or null
          endDate={state.endDate} // Date or null
          focusedInput={state.focusedInput} // START_DATE, END_DATE or null
        />
        <Button disabled={!state.chosenDate} onClick={() => updateTrend()}>Update</Button>
      </FlexContainer>
        <FlexContainer>
          <Button variant="danger" onClick={() => deleteTrend()}>Reset Data</Button>
        </FlexContainer>
      </TrendGrid>
    </TrendLayout>
  );
};
