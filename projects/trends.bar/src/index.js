import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import {ApolloProvider} from 'react-apollo'
import {ApolloLink, split} from 'apollo-link';
import {ApolloClient} from 'apollo-client'
import {onError} from 'apollo-link-error'
import {createHttpLink} from 'apollo-link-http'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {BrowserRouter} from "react-router-dom";
import {WebSocketLink} from 'apollo-link-ws';
import {getMainDefinition} from "apollo-utilities";
import addReactNDevTools from 'reactn-devtools';
import {createAntiForgeryTokenHeaders} from './futuremodules/auth/authApiCalls';
const omitDeep = require("omit-deep-lodash");

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

const authLink = new ApolloLink((operation, forward) => {
    const headers = createAntiForgeryTokenHeaders();
    // console.log("AUTH:",headers);
    operation.setContext(headers);
    // Call the next link in the middleware chain.
    return forward(operation);
  });

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

const cleanTypenameLink = new ApolloLink((operation, forward) => {
  const keysToOmit = ['__typename'] // more keys like timestamps could be included here

  const def = getMainDefinition(operation.query)
  if (def && def.operation === 'mutation') {
    operation.variables = omitDeep(operation.variables, keysToOmit)
  }
  return forward ? forward(operation) : null
})

const client = new ApolloClient({
  link: ApolloLink.from([cleanTypenameLink, authLink, errorLink, link]),
  cache: new InMemoryCache({ addTypename: false }),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById("root")
);
