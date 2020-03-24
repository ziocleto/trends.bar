const urca =
{
  "trendId": "coronavirus",
  "username": "Dado",
  "source": "World Health Organization",
  "sourceName": "situation-report",
  "graphType": ["Date", "Int"],
  "timestamp": "20200315",
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
