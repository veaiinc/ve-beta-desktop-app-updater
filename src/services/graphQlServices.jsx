import { ApolloClient, ApolloLink, HttpLink, from, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import Cookies from 'js-cookie';
import getBaseUrl from './baseUrls.js';

const errorLink = onError(({ graphQLErrors, networkError, forward, operation }) => {
	if (graphQLErrors) {
		graphQLErrors.forEach(({ message, locations, path }) => {
			console.log(
				`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
			);
		});
		return forward(operation);
	}

	if (networkError) {
		console.log(`[Network error]: ${networkError}`);
	}

	return forward(operation);
});

const defaultOptions = {
	watchQuery: { fetchPolicy: 'no-cache' },
	query: { fetchPolicy: 'no-cache' },
};

const Service = {
	query: async (query, variables, workspaceId, usertoken, type = null) => {
		const region = Cookies.get('region') || localStorage.getItem('region') || 'us-east-1';
		const baseUrl = getBaseUrl({ type, region });

		if (!baseUrl) {
			console.error(`No base URL found for type: ${type} and region: ${region}`);
			return [
				false,
				{ message: `No base URL found for type: ${type} and region: ${region}` },
			];
		}

		const httpLink = new HttpLink({ uri: `${baseUrl}/${workspaceId}/graphql` });

		const apolloClient = new ApolloClient({
			cache: new InMemoryCache({ resultCaching: true }),
			defaultOptions,
			connectToDevTools: true,
			link: from([errorLink, httpLink]),
		});

		try {
			const response = await apolloClient.query({
				query,
				variables,
				context: { headers: { authorization: usertoken ? `Bearer ${usertoken}` : '' } },
				errorPolicy: 'all',
			});

			if (response.errors?.length) {
				return [false, response.errors];
			}
			return [true, response];
		} catch (err) {
			console.error('Network or other error:', err);
			return [false, err];
		}
	},

	mutation: async (mutation, variables, workspaceId, usertoken, type = null) => {
		const region = Cookies.get('region') || localStorage.getItem('region') || 'us-east-1';
		const baseUrl = getBaseUrl({ type, region });

		if (!baseUrl) {
			console.error(`No base URL found for type: ${type} and region: ${region}`);
			return [
				false,
				{ message: `No base URL found for type: ${type} and region: ${region}` },
			];
		}

		const httpLink = new HttpLink({ uri: `${baseUrl}/${workspaceId}/graphql` });
		const link = ApolloLink.from([errorLink, httpLink]);

		const apolloClient = new ApolloClient({
			cache: new InMemoryCache(),
			defaultOptions,
			connectToDevTools: true,
			link,
		});

		try {
			const response = await apolloClient.mutate({
				mutation,
				variables,
				context: { headers: { authorization: usertoken ? `Bearer ${usertoken}` : '' } },
				errorPolicy: 'all',
			});

			if (response.errors?.length) {
				return [false, response.errors];
			}
			return [true, response];
		} catch (err) {
			return [false, err];
		}
	},
};

export default Service;
