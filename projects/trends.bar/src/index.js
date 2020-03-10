import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import {ApolloProvider} from 'react-apollo'
import {ApolloClient} from 'apollo-client'
import {createHttpLink} from 'apollo-link-http'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {BrowserRouter} from "react-router-dom";

const httpLink = createHttpLink({
  uri: `http://${process.env.REACT_APP_EH_CLOUD_HOST}:4500/graphql`
})

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById("root")
);
