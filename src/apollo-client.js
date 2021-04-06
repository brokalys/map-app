import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import DebounceLink from 'apollo-link-debounce';
import { RestLink } from 'apollo-link-rest';

const debounceLink = new DebounceLink(3000);
const httpLink = new HttpLink({
  uri: process.env.REACT_APP_API_ENDPOINT,
});
const restLink = new RestLink({
  uri: process.env.REACT_APP_STATIC_API_ENDPOINT,
});

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    'x-api-key': process.env.REACT_APP_BROKALYS_API_KEY,
  },
}));

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([debounceLink, restLink, authLink, httpLink]),
});

export default client;
