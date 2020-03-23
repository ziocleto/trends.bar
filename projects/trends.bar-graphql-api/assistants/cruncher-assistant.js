import {trendGraphsModel, trendsModel} from "../models/models";
import moment from "moment";
import {
  parseIntWithSpaces,
  Parser,
  regExResolver,
  regExResolverAccumulator,
  regExResolverPostTransform,
  regExResolverSingle,
  sanitizeNewLines
} from "./parser-assistant";
import * as countryAssistant from "./country-assistant";
import {testvaluesModel} from "../routes/crawlerRoute";

const graphAssistant = require("./graph-assistant");
const crawler = require('crawler-request');
const mongoose = require("mongoose");
const db = require("../db");

const findTrendByStringId = async (trendId) => {
  const trend = await db.findOne(trendsModel, {trendId: trendId});
  return trend._id;
}

const findParseURLForTrendId = (timestamp, timestampURL) => {
  const beginningOfReportstimetamp = moment('20200120', 'YYYYMMDD');
  const reportIndex = timestamp.diff(beginningOfReportstimetamp, 'days');
  if (reportIndex < 1 || isNaN(reportIndex)) {
    throw "Invalid date selected for report";
  }
  let mainURL = 'https://www.who.int/docs/default-source/coronaviruse/situation-reports/';

  // Well this is a weird case WHO... They've totally got the wrong URL :O
  if (timestampURL === "20200312") {
    mainURL = 'https://www.who.int/docs/default-source/wrindia/situation-report/';
  }

  return `${mainURL}${timestampURL}-sitrep-${reportIndex}-covid-19.pdf`;
}

export const crawlTrendId = async (timestamp, timestampURL) => {
  return `











Data as reported by national authorities by 10AM CET 08 March 2020
Coronavirus disease 2019 (COVID-19)
Situation Report – 48

SITUATION IN NUMBERS
total and new cases in last 24
hours

Globally
105 586 confirmed (3656 new)

China
80 859 confirmed (46 new)
  3100 deaths (27 new)



Outside of China
24 727 confirmed (3610 new)
  484 deaths (71 new)
    101 Countries/territories/
    areas (8 new)

WHO RISK ASSESSMENT

China Very High
Regional Level Very High
Global Level Very High
























HIGHLIGHTS

• 8 new countries/territories/areas (Bulgaria, Costa Rica, Faroe Islands, French
Guiana, Maldives, Malta, Martinique, and Republic of Moldova) have reported
cases of COVID-19 in the past 24 hours.

• Over 100 countries have now reported laboratory-confirmed cases of COVID-
19.

• WHO has issued   a consolidated   package   of   existing   preparedness   and
response  guidance for countries  to  enable them  to  slow  and  stop  COVID-19
transmission  and  save lives. WHO  is  urging  all  countries  to  prepare  for  the
potential  arrival  of  COVID-19  by  readying  emergency  response  systems;
increasing capacity to detect and care for patients; ensuring hospitals have the
space,  supplies  and  necessary  personnel;  and  developing  life-saving medical
interventions.





Figure 1. Countries, territories or areas with reported confirmed cases of COVID-19, 08 March 2020






SURVEILLANCE

Table 1. Confirmed and suspected cases of COVID-19 acute respiratory disease reported by provinces, regions and
cities in China, Data as of 08 March 2020
Province/
Region/
City
Population
(10,000s)
In last 24 hours Cumulative
Confirmed
cases

Suspected
cases
Deaths
Confirmed
cases
Deaths
Hubei 5917 41 42 27 67707 2986
Guangdong 11346 0 0 0 1352 7
Henan 9605 0 0 0 1272 22
Zhejiang 5737 0 0 0 1215 1
Hunan 6899 0 0 0 1018 4
Anhui 6324 0 0 0 990 6
Jiangxi 4648 0 0 0 935 1
Shandong 10047 0 0 0 758 6
Jiangsu 8051 0 0 0 631 0
Chongqing 3102 0 0 0 576 6
Sichuan 8341 0 1 0 539 3
Heilongjiang 3773 0 0 0 481 13
Beijing 2154 2 3 0 428 8
Shanghai 2424 0 25 0 342 3
Hebei 7556 0 0 0 318 6
Fujian 3941 0 0 0 296 1
Guangxi 4926 0 0 0 252 2
Shaanxi 3864 0 0 0 245 1
Yunnan 4830 0 1 0 174 2
Hainan 934 0 0 0 168 6
Guizhou 3600 0 0 0 146 2
Tianjin 1560 0 9 0 136 3
Shanxi 3718 0 0 0 133 0
Liaoning 4359 0 3 0 125 1
Gansu 2637 1 0 0 120 2
Hong Kong SAR 745 2 0 0 109 2
Jilin 2704 0 0 0 93 1
Xinjiang 2487 0 0 0 76 3
Inner Mongolia 2534 0 0 0 75 1
Ningxia 688 0 0 0 75 0
Taipei and environs 2359 0 0 0 45 1
Qinghai 603 0 0 0 18 0
Macao SAR 66 0 0 0 10 0
Xizang 344 0 0 0 1 0
Total 142823 46 84 27 80859 3100







Table 2. Countries, territories or areas outside China with reported laboratory-confirmed COVID-19 cases and
deaths. Data as of 08 March 2020
*

Reporting Country/
Territory/Area
†

Total
confirmed
‡

cases
Total
confirmed
new cases
Total
deaths
Total
new
deaths
Transmission
classification
§

Days since
last reported
case

Western Pacific Region
Republic of Korea 7134 367 50 6 Local transmission 0
Japan 455 48 6 0 Local transmission 0
Singapore 138 8 0 0 Local transmission 0
Malaysia 93 10 0 0 Local transmission 0
Australia 74 12 3 1 Local transmission 0
Viet Nam 21 4 0 0 Local transmission 0
Philippines 6 1 1 0 Local transmission 0
New Zealand 5 0 0 0 Local transmission 1
Cambodia 2 1 0 0 Local transmission 0
European Region
Italy 5883 1247 234 37 Local transmission 0
Germany 795 156 0 0 Local transmission 0
France 706 93 10 1 Local transmission 0
Spain 430 56 5 0 Local transmission 0
Switzerland

264 55 2 1 Local transmission 0
The United Kingdom 210 43 2 1 Local transmission 0
Netherlands 188 60 1 0 Local transmission 0
Belgium 169 60 0 0 Local transmission 0
Sweden 161 24 0 0 Local transmission 0
Norway 147 34 0 0 Local transmission 0
Austria 104 38 0 0 Local transmission 0
Greece 66 34 0 0 Local transmission 0
Iceland 45 0 0 0 Local transmission 1
Denmark 31 8 0 0 Local transmission 0
San Marino 27 3 1 1 Local transmission 0
Czechia 26 14 0 0 Local transmission 0
Israel 25 6 0 0 Local transmission 0
Portugal 21 8 0 0 Local transmission 0
Finland 19 0 0 0 Local transmission 1
Ireland 19 1 0 0 Local transmission 0
Romania 13 6 0 0 Local transmission 0
Georgia 12 3 0 0 Imported cases only 0
Slovenia 12 3 0 0 Local transmission 0
Croatia 11 0 0 0 Local transmission 1
Estonia 10 0 0 0 Imported cases only 1
Azerbaijan 9 0 0 0 Imported cases only 1
Hungary 7 3 0 0 Local transmission 0
Russian Federation 7 0 0 0 Imported cases only 1
Belarus 6 0 0 0 Local transmission 3
Poland 6 1 0 0 Imported cases only 0
Malta 3 3 0 0 Imported cases only 0
North Macedonia 3 0 0 0 Imported cases only 1
Slovakia 3 2 0 0 Local transmission 0
Bosnia and
Herzegovina
2 0 0 0 Local transmission 3
Bulgaria 2 2 0 0 Local transmission 0
Luxembourg 2 0 0 0 Imported cases only 1


Andorra 1 0 0 0 Imported cases only 5
Armenia 1 0 0 0 Imported cases only 6
Holy See 1 0 0 0 Under investigation 2
Latvia 1 0 0 0 Imported cases only 5
Liechtenstein 1 0 0 0 Imported cases only 2
Lithuania 1 0 0 0 Imported cases only 9
Monaco 1 0 0 0 Under investigation 7
Republic of Moldova 1 1 0 0 Imported cases only 0
Serbia 1 0 0 0 Under investigation 2
Ukraine 1 0 0 0 Imported cases only 4
Territories
**

Faroe Islands 1 0 0 0 Imported cases only 2
Gibraltar 1 0 0 0 Under investigation 4
South-East Asia Region
Thailand 50 2 1 0 Local transmission 0
India 34 3 0 0 Local transmission 0
Indonesia 4 0 0 0 Local transmission 1
Maldives 2 2 0 0 Local transmission 0
Bhutan 1 0 0 0 Imported cases only 2
Nepal 1 0 0 0 Imported cases only 44
Sri Lanka 1 0 0 0 Imported cases only 41
Eastern Mediterranean Region
Iran (Islamic
Republic of)
5823 1076 145 21 Local transmission 0
Kuwait 62 4 0 0 Imported cases only 0
Bahrain 56 7 0 0 Imported cases only 0
Iraq 54 10 4 0 Imported cases only 0
Egypt 48 45 0 0 Local transmission
††
 0
United Arab
Emirates
45 0 0 0 Local transmission 1
Lebanon 28 6 0 0 Local transmission 0
Oman 16 0 0 0 Imported cases only 2
Qatar 12 1 0 0 Imported cases only 0
Saudi Arabia 7 2 0 0 Imported cases only 0
Pakistan 5 0 0 0 Imported cases only 5
Afghanistan 4 3 0 0 Imported cases only 0
Morocco 2 0 0 0 Imported cases only 3
Jordan 1 0 0 0 Imported cases only 5
Tunisia 1 0 0 0 Imported cases only 5
Territories
**

Occupied
Palestinian Territory
16 0 0 0 Local transmission 1
Region of the Americas
United States of
America
213 0 11 0 Local transmission 1
Canada 57 6 0 0 Local transmission 0
Brazil 19 6 0 0 Local transmission 0
Ecuador 14 0 0 0 Local transmission 1
Argentina 9 7 1 1 Imported cases only 0
Mexico 7 2 0 0 Imported cases only 0
Peru 6 0 0 0 Local transmission 1
Chile 5 0 0 0 Imported cases only 1
Costa Rica 5 5 0 0 Imported cases only 0


Colombia 1 0 0 0 Imported cases only 1
Dominican Republic 1 0 0 0 Imported cases only 6
Territories
**

French Guiana 5 5 0 0 Imported cases only 0
Martinique 2 2 0 0 Imported cases only 0
Saint Martin 2 0 0 0 Under investigation 5
Saint Barthélemy 1 0 0 0 Under investigation 5
African Region
Algeria 17 0 0 0 Local transmission 1
Senegal 4 0 0 0 Imported cases only 3
Cameroon 2 0 0 0 Local transmission 1
South Africa 2 1 0 0 Imported cases only 0
Nigeria 1 0 0 0 Imported cases only 9
Togo 1 0 0 0 Imported cases only 1
Subtotal for all
regions
24031 3610 477 70
International
conveyance
(Diamond Princess)
696 0 7 1 Local transmission 0
Grand total 24727 3610 484 71
*
Numbers include both domestic and repatriated cases
†
The designations employed and the presentation of the material in this publication do not imply the expression of any opinion whatsoever on
the part of WHO concerning the legal status of any country, territory, city or area or of its authorities, or concerning the delimitation of its
frontiers or boundaries. Dotted and dashed lines on maps represent approximate border lines for which there may not yet be full agreement.

‡
Case classifications are based on WHO case definitions for COVID-19.
§
Transmission classification is based on WHO analysis of available official data and may be subject to reclassification as additional data become
available.  Countries/territories/areas  experiencing  multiple  types  of transmission  are  classified  in  the  highest  category  for  which  there  is
evidence; they may be removed from a given category if interruption of transmission can be demonstrated. It should be noted that even within
categories, different countries/territories/areas may have differing degrees of transmission as indicated by the differing numbers of cases and
other factors. Not all locations within a given country/territory/area are equally affected.
Terms:
- Community transmission is evidenced by the inability to relate confirmed cases through chains of transmission for a large number of cases, or by
increasing positive tests through sentinel samples (routine systematic testing of respiratory samples from established laboratories).
- Local transmission indicates locations where the source of infection is within the reporting location.
- Imported cases only indicates locations where all cases have been acquired outside the location of reporting.
- Under investigation indicates locations where type of transmission has not been determined for any cases.
- Interrupted transmission indicates locations where interruption of transmission has been demonstrated (details to be determined)
** “Territories” include territories, areas, overseas dependencies and other jurisdictions of similar status
††
Egypt is classified as “Imported cases only” with the exception of a Nile Cruise ship currently in Egyptian international waters that is
experiencing local transmission.





Figure 2. Epidemic curve of confirmed COVID-19 cases reported outside of China (n=24,727), by date of report and
WHO region through 08 March 2020











STRATEGIC OBJECTIVES

WHO’s strategic objectives for this response are to:

• Interrupt human-to-human transmission including reducing secondary infections among close contacts
and health care workers, preventing transmission amplification events, and preventing further
international spread*;
• Identify, isolate and care for patients early, including providing optimized care for infected patients;
• Identify and reduce transmission from the animal source;
• Address crucial unknowns regarding clinical severity, extent of transmission and infection, treatment
options, and accelerate the development of diagnostics, therapeutics and vaccines;
• Communicate critical risk and event information to all communities and counter misinformation;
• Minimize social and economic impact through multisectoral partnerships.

*This can be achieved through a combination of public health measures, such as rapid identification, diagnosis
and management of the cases, identification and follow up of the contacts, infection prevention and control in
health care settings, implementation of health measures for travelers, awareness-raising in the population and
risk communication.


PREPAREDNESS AND RESPONSE

• To view all technical guidance documents regarding COVID-19, please go to this webpage.
• WHO has developed interim guidance for laboratory diagnosis, advice on the use of masks during home care and
in health care settings in the context of the novel coronavirus (2019-nCoV) outbreak, clinical management,
infection prevention and control in health care settings, home care for patients with suspected novel
coronavirus, risk communication and community engagement and Global Surveillance for human infection with
novel coronavirus (2019-nCoV).
• WHO is working closely with International Air Transport Association (IATA) and have jointly developed a
guidance document to provide advice to cabin crew and airport workers, based on country queries. The
guidance can be found on the IATA webpage.
• WHO has been in regular and direct contact with Member States where cases have been reported. WHO is also
informing other countries about the situation and providing support as requested.
• WHO is working with its networks of researchers and other experts to coordinate global work on surveillance,
epidemiology, mathematical modelling, diagnostics and virology, clinical care and treatment, infection
prevention and control, and risk communication. WHO has issued interim guidance for countries, which are
updated regularly.
• WHO has prepared a disease commodity package that includes an essential list of biomedical equipment,
medicines and supplies necessary to care for patients with 2019-nCoV.
• WHO has provided recommendations to reduce risk of transmission from animals to humans.
• WHO has published an updated advice for international traffic in relation to the outbreak of the novel
coronavirus 2019-nCoV.
• WHO has activated the R&D blueprint to accelerate diagnostics, vaccines, and therapeutics.
• OpenWHO is an interactive, web-based, knowledge-transfer platform offering online courses to improve the
response to health emergencies. COVID-19 courses can be found here. Specifically, WHO has developed online
courses on the following topics:  A general introduction to emerging respiratory viruses, including novel
coronaviruses (available in Arabic, English, French, Chinese, Spanish, Portuguese, and Russian);  Critical Care of
Severe Acute Respiratory Infections (available in English and French); Health and safety briefing for respiratory
diseases - ePROTECT (available in English, French, and Russian); Infection Prevention and Control for Novel
Coronavirus (COVID-19) (available in English and Russian);  and COVID-19 Operational Planning Guidelines and
COVID-19 Partners Platform to support country preparedness and response.
• WHO is providing guidance on early investigations, which are critical in an outbreak of a new virus. The data
collected from the protocols can be used to refine recommendations for surveillance and case definitions, to
characterize the key epidemiological transmission features of COVID-19, help understand spread, severity,
spectrum of disease, impact on the community and to inform operational models for implementation of
countermeasures such as case isolation, contact tracing and isolation. Several protocols are available here. One
such protocol is for the investigation of early COVID-19 cases and contacts (the “First Few X (FFX) Cases and
contact investigation protocol for 2019-novel coronavirus (2019-nCoV) infection”). The protocol is designed to
gain an early understanding of the key clinical, epidemiological and virological characteristics of the first cases of
COVID-19 infection detected in any individual country, to inform the development and updating of public health
guidance to manage cases and reduce the potential spread and impact of infection.


RECOMMENDATIONS AND ADVICE FOR THE PUBLIC

If you are not in an area where COVID-19 is spreading or have not travelled from an area where COVID-19 is
spreading or have not been in contact with an infected patient, your risk of infection is low. It is understandable that
you may feel anxious about the outbreak. Get the facts from reliable sources to help you accurately determine your
risks so that you can take reasonable precautions (see Frequently Asked Questions). Seek guidance from WHO, your


healthcare provider, your national public health authority or your employer for accurate information on COVID-19
and whether COVID-19 is circulating where you live. It is important to be informed of the situation and take
appropriate measures to protect yourself and your family (see Protection measures for everyone).

If you are in an area where there are cases of COVID-19 you need to take the risk of infection seriously. Follow the
advice of WHO and guidance issued by national and local health authorities. For most people, COVID-19 infection
will cause mild illness however, it can make some people very ill and, in some people, it can be fatal. Older people,
and those with pre-existing medical conditions (such as cardiovascular disease, chronic respiratory disease or
diabetes) are at risk for severe disease (See Protection measures for persons who are in or have recently visited (past
14 days) areas where COVID-19 is spreading).


CASE DEFINITIONS

WHO periodically updates the  Global Surveillance for human infection with coronavirus disease (COVID-19)
document which includes case definitions.

For easy reference, case definitions are included below.

Suspect case
A. A patient with acute respiratory illness (fever and at least one sign/symptom of respiratory disease (e.g.,
cough, shortness of breath), AND with no other etiology that fully explains the clinical presentation AND a
history of travel to or residence in a country/area or territory reporting local transmission (See situation
report) of COVID-19 disease during the 14 days prior to symptom onset.
OR
B. A patient with any acute respiratory illness AND having been in contact with a confirmed or probable COVID-
19 case (see definition of contact) in the last 14 days prior to onset of symptoms;
OR
C. A patient with severe acute respiratory infection (fever and at least one sign/symptom of respiratory disease
(e.g., cough, shortness breath) AND requiring hospitalization AND with no other etiology that fully explains
the clinical presentation.

Probable case
A suspect case for whom testing for COVID-19 is inconclusive.
• Inconclusive being the result of the test reported by the laboratory

Confirmed case
A person with laboratory confirmation of COVID-19 infection, irrespective of clinical signs and symptoms.
• Information regarding laboratory guidance can be found here.



 `;

  // const finalURL = findParseURLForTrendId(timestamp, timestampURL);
  // const response = await crawler(finalURL);
  // return response.text;
}

const makeRegExpFromJSON = json => {
  return RegExp(json.body, json.flags);
}

export class Cruncher {
  constructor(trendId, username, text, datasetElem, graphType, defaultXValue) {
    this.trendId = trendId;
    this.username = username;
    this.parser = new Parser(text);
    this.datasetElem = datasetElem;
    this.graphType = graphType;
    this.defaultXValue = defaultXValue;
  }

  async upsertUniqueXValue(model, value, query) {
    const data = {
      ...query,
      $push: {
        values: {
          $each: [value],
          $sort: {x: 1}
        }
      }
    };
    const ret = await db.upsert(model, data, query);

    let setValues = [];
    for (let index = 0; index < ret.values.length - 1; index++) {
      if (ret.values[index].x !== ret.values[index + 1].x) {
        setValues.push(ret.values[index]);
      }
    }
    setValues.push(ret.values[ret.values.length - 1]);

    return await testvaluesModel.updateOne(query,
      {$set: {values: setValues}});
  }

  async dataEntry(graph, value) {
    console.log("Graph: ", graph);
    console.log("value: ", value.toString());
    console.log("trendId: ", this.trendId);

    const graphElem = await this.upsertUniqueXValue(trendGraphsModel, value, {
      dataset: mongoose.Types.ObjectId(this.datasetElem._id),
      trendId: this.trendId,
      username: this.username,
      title: graph.title,
      label: graph.label,
      subLabel: graph.subLabel,
      type: this.graphType
    });
    return await db.upsert(trendsModel, {
      '$addToSet': {trendGraphs: graphElem._id}
    }, {trendId: this.trendId});
  }

  checkTimeStampValid(validRange, currTime) {
    if (validRange === undefined) return true;
    const from = moment(validRange.from, "YYYYMMDD");
    const to = moment(validRange.to, "YYYYMMDD");
    return currTime.isBetween(from, to, null, '[]');
  }

  applyCountryPostTransformRule(source) {
    return countryAssistant.findSimple(sanitizeNewLines(source));
  }

  applyPostTransformRule(pbt, match) {
    if (pbt.algo === "matchCountryName") {
      return this.applyCountryPostTransformRule(match);
    }
    return match;
  }

  async finaliseCrunch(key, title, wc) {
    const graphElem = await graphAssistant.declare(this.graphType, key, title);
    const value = graphAssistant.prepareSingleValue(graphElem.type, this.defaultXValue, wc);
    console.log(key, title + ", " + wc);
    return await this.dataEntry(graphElem, value);
  }

  getParserStartIndex(regex) {
    if (regex) {
      const pbr = makeRegExpFromJSON(regex);
      return this.parser.findIndex(pbr);
    }
    return 0;
  }

  getParserEndIndex(regex) {
    if (regex) {
      const pbr = makeRegExpFromJSON(regex);
      return this.parser.findIndex(pbr);
    }
    return this.parser.text.length;
  }

  async applyPost(match, pbt, title) {
    let r1 = title;
    let r2 = match[1];
    if (pbt) {
      const elem = this.applyPostTransformRule(pbt, match[pbt.sourceIndex]);
      const titleFinal = title.replace(pbt.dest, elem);
      r1 = titleFinal;
      r2 = match[pbt.valueIndex];
    }
    return {title: r1, y: parseIntWithSpaces(r2)}
  }

  async crunchAction(key, title, action) {
    const nparse = new Parser(this.parser.text.substring(this.getParserStartIndex(action.startRegex),
      this.getParserEndIndex(action.endRegex)));

    let results = [];
    const resolver = regExResolver(action.regex);
    const regex = makeRegExpFromJSON(action.regex);
    if (resolver === regExResolverSingle) {
      const parsedData = nparse.find(regex);
      if ( !parsedData || parsedData.length === 0 ) throw "Error parsing";
      results.push({y: parseIntWithSpaces(parsedData[1]), title});
    } else if (resolver === regExResolverAccumulator) {
      results.push({y: nparse.findAllAccumulate(regex), title});
    } else if (resolver === regExResolverPostTransform) {
      for (const r of nparse.findAll(regex)) {
        results.push(await this.applyPost(r, action.postTransform, title));
      }
    }

    for (const result of results) {
      await this.finaliseCrunch(key, result.title, result.y);
    }

  }

  async crunchFunctions(f, xValue) {
    for (const dataset of f.datasets) {
      const title = dataset.title;
      for (const action of dataset.actions) {
        if (this.checkTimeStampValid(action.validRange, xValue)) {
          this.crunchAction(f.key, title, action);
          break;
        }
      }
    }
  }

  async crunch(query) {
    for (const f of query.functions) {
      await this.crunchFunctions(f, this.defaultXValue);
    }
  }
}