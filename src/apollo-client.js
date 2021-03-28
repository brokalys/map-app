import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { RestLink } from 'apollo-link-rest';

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_API_ENDPOINT,
});
const restLink = new RestLink({
  uri: 'https://static-api.brokalys.com/stats/monthly',
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([restLink, httpLink]),
});

export default client;
