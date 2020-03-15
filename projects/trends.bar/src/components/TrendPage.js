import React, {Fragment, useEffect} from "react";
import CanvasJSReact from '../assets/canvasjs.react';
import {FlexContainer, TrendGrid} from "./TrendPageStyle";
import {Button} from "react-bootstrap";
import axios from "axios";
import {useQueryData} from "../futuremodules/graphqlclient/query";
import {elaborateDataGraphs, getTrendGraphs, isEmptyGraph,} from "../modules/trends/dataGraphs";
import {sanitizePathRoot} from "../futuremodules/utils/utils";
import {useMutation} from "@apollo/react-hooks";
import {CREATE_TREND} from "../modules/trends/trendMutations";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const TrendPage = props => {

  const trendId = sanitizePathRoot(props.match.url);
  const [createTrend] = useMutation(CREATE_TREND);

  useEffect(() => {
    createTrend({variables: {trendId: trendId}}).then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = useQueryData(getTrendGraphs(trendId));

  if (isEmptyGraph(data)) {
    return <Fragment/>
  }

  const chartOptions = elaborateDataGraphs(data);

  const updateTrend = async () => {
    await axios.post("/gapi/crawler", {
        "trendId": "coronavirus",
        "source": "World Health Organization",
        "sourceName": "situation-report",
        "graphType": ["Date", "Int"],
        "timestamp": "20200313",
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
                    "validRange": {
                      "from": "20200309",
                      "to": "99991231"
                    },
                    "regex": {
                      "body": "Globally[\\n\\r\\s]+\\d+\\s*\\d*\\sconfirmed[\\n*\\s\\/\\)\\(\\D&-]+\\d+[\\n*\\s\\/\\)\\(\\D&-]+(\\d+\\s*\\d*)",
                      "flags": "mi"
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
                "title": "Rest of the World Deaths",
                "actions": [
                  {
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
    )
  };

  return (
    <div className="trend-layout">
      <TrendGrid>
        <Button onClick={updateTrend}>Update</Button>
        <FlexContainer>
          <CanvasJSChart options={chartOptions}/>
        </FlexContainer>
        <FlexContainer>
        </FlexContainer>
      </TrendGrid>
    </div>
  );
}

export default TrendPage;
