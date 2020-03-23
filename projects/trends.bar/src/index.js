import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import {ApolloProvider} from 'react-apollo'
import { ApolloLink } from 'apollo-link';
import {ApolloClient} from 'apollo-client'
import { onError } from 'apollo-link-error'
import {createHttpLink} from 'apollo-link-http'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {BrowserRouter} from "react-router-dom";
import {WebSocketLink} from 'apollo-link-ws';
import {split} from "apollo-link";
import {getMainDefinition} from "apollo-utilities";
import addReactNDevTools from 'reactn-devtools';

addReactNDevTools();

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const wsLink = new WebSocketLink({
  uri: `wss://${process.env.REACT_APP_EH_CLOUD_HOST}/gapi/graphql`,
  options: {
    reconnect: true
  }
});

const httpLink = createHttpLink({
  uri: `https://${process.env.REACT_APP_EH_CLOUD_HOST}/gapi/graphql/`,
})

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, link]),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById("root")
);
