import gql from "graphql-tag";
import {getQueryLoadedWithValue, getQueryLoadedWithValueArrayNotEmpty} from "../../futuremodules/graphqlclient/query";
import {useGlobal} from "reactn";
import {currentUserTrends, EditingUserTrend} from "./globals";
import {useMutation} from "@apollo/react-hooks";
import {alertWarning, NotificationAlert, useConfirmAlertWithWriteCheckShort} from "../../futuremodules/alerts/alerts";

export const CREATE_TREND = gql`
    mutation CreateTrend($trendId: String!, $username: String!) {
        createTrend(trendId: $trendId, username: $username) {
            trendId
            username
        }
    }`;

export const REMOVE_TREND = gql`
    mutation RemoveTrend($trendId: String!, $username: String!) {
        removeTrend(trendId: $trendId, username: $username) {
            trendId
            username
        }
    }`;

export const CRAWL_TREND_GRAPH = gql`
    mutation CrawlTrendGraph($scriptName: String!, $script: CrawlingScript!) {
        crawlTrendGraph(scriptName: $scriptName, script: $script) {
            crawledText
            traces
            graphQueries {
                trendId
                username
                title
                yValueSubGroup
                yValueGroup
                type
                cumulative
                values {
                    x
                    y
                }
            }
            error
            dataset {
                source
                sourceDocument
                sourceName
            }
        }
    }`;

export const UPSERT_TREND_GRAPH = gql`
    mutation UpsertTrendGraph($graphQueries: [GraphQueryInput]) {
        upsertTrendGraph(graphQueries: $graphQueries)
    }`;

export const DELETE_TREND_GRAPH = gql`
    mutation DeleteTrendGraph($trendId: String!, $username: String!) {
        deleteTrendGraph(trendId: $trendId, username: $username)
    }`;

export const SAVE_SCRIPT = gql`
    mutation saveScript($script: CrawlingScript!) {
        saveScript(script: $script)
    }`;

export const REMOVE_SCRIPT = gql`
    mutation ScriptRemove($scriptName: String!, $trendId: String!, $username:String!) {
        scriptRemove(scriptName: $scriptName, trendId: $trendId, username: $username ) {
            filename
            text
        }
    }`;

export const RENAME_SCRIPT = gql`
    mutation ScriptRename($scriptName: String!, $trendId: String!, $username:String!, $newName:String!) {
        scriptRename(scriptName: $scriptName, trendId: $trendId, username: $username, newName: $newName ) {
            filename
            text
        }
    }`;

export const upsertTrendLayout = gql`
    mutation UpsertTrendLayout($trendLayout: TrendLayoutInput) {
        upsertTrendLayout(trendLayout: $trendLayout) {
            _id
        }
    }`;


const removeTrend = async (trendId, username, removeTrendMutation, setUserTrends) => {
  await removeTrendMutation({
    variables: {
      trendId,
      username
    }
  }).then(r => {
      const res = getQueryLoadedWithValueArrayNotEmpty(r);
      setUserTrends(res);
    }
  );
};

export const useCreateTrend = () => {

  const [, alertStore] = useGlobal(NotificationAlert);
  const [createTrendM] = useMutation(CREATE_TREND);
  const [userTrends, setUserTrends] = useGlobal(currentUserTrends);
  const [, setEditingUserTrend] = useGlobal(EditingUserTrend);

  const updater = (trendId, username) => {
    createTrendM({
      variables: {
        trendId: trendId,
        username: username
      }
    }).then(r => {
        const newValue = getQueryLoadedWithValue(r);
        setUserTrends([newValue, ...userTrends]).then(
          () => setEditingUserTrend(newValue.trendId)
        );
      }
    ).catch((e) => {
      alertWarning(alertStore, e.message.slice("GraqhQL error: ".length));
    });
  }

  return updater;
};

export const useRemoveTrend = () => {
  const [, setUserTrends] = useGlobal(currentUserTrends);
  const [removeTrendMutation] = useMutation(REMOVE_TREND);
  const confirmDeleteAlert = useConfirmAlertWithWriteCheckShort();

  const updater = (trendId, username) => {
    confirmDeleteAlert(trendId, () => removeTrend(trendId, username, removeTrendMutation, setUserTrends)).then();
  };

  return updater;
};
