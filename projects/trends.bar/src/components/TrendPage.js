import React, {Fragment, useEffect, useReducer, useState} from "react";
import CanvasJSReact from '../assets/canvasjs.react';
import {FlexContainer, TrendGrid} from "./TrendPageStyle";
import {Button} from "react-bootstrap";
import {useQueryData} from "../futuremodules/graphqlclient/query";
import {elaborateDataGraphs, getTrendGraphs, isEmptyGraph,} from "../modules/trends/dataGraphs";
import {sanitizePathRoot} from "../futuremodules/utils/utils";
import {useMutation, useSubscription} from "@apollo/react-hooks";
import {CREATE_TREND, UPSERT_TREND_GRAPH} from "../modules/trends/mutations";
import {DateRangeInput} from '@datepicker-react/styled'
import {trendGraphSubcription, trendSubcription} from "../modules/trends/subscriptions";
import moment from "moment";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const TrendPage = props => {

  const initialState = {
    startDate: null,
    endDate: null,
    focusedInput: null,
    chosenDate: null
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const trendId = sanitizePathRoot(props.match.url);
  const [createTrend] = useMutation(CREATE_TREND);
  const [upserTrendGraph] = useMutation(UPSERT_TREND_GRAPH);
  const { data, loading } = useSubscription(trendGraphSubcription());

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

  useEffect(() => {
    createTrend({variables: {trendId: trendId}}).then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let graphData = useQueryData(getTrendGraphs(trendId));
  if ( data !== undefined && loading === false ) {
    graphData.trend = data.trendGraphMutated.node;
  }

  // if (isEmptyGraph(graphData)) {
  //   return <Fragment/>
  // }

  // console.log( "Trend mutation: ", data );
  // console.log( "Trend mutation loading: ", loading );
  // console.log( "ChoosenDate: ", state.chosenDate && state.chosenDate.format("YYYYMMDD") );

  const chartOptions = elaborateDataGraphs(graphData);

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
  }

  return (
    <div className="trend-layout">
      <TrendGrid>
        <FlexContainer>
          <CanvasJSChart options={chartOptions}/>
        </FlexContainer>
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
      </TrendGrid>
    </div>
  );
}

export default TrendPage;
