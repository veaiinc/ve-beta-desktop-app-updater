import { ApolloClient, ApolloLink, HttpLink, from, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

const { ve_conversations_api, workflows_Api } = require('./config');

const graphQLAPICall = { ve_conversations_api, workflows_Api };

const defaultOptions = {
	watchQuery: {
		fetchPolicy: 'no-cache',
	},
	query: {
		fetchPolicy: 'no-cache',
	},
};
const errorLink = onError(({ graphQLErrors, networkError, forward, operation }) => {
	try {
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
	} catch (error) {
		throw error;
	}
});

const Service = {
	query: async (query, variables, workspaceID, usertoken, type = null) => {
		const httpLink = new HttpLink({
			uri: `${graphQLAPICall[type]}/${workspaceID}/graphql`,
		});

		const apolloClient = new ApolloClient({
			cache: new InMemoryCache({
				resultCaching: true,
			}),
			defaultOptions,
			connectToDevTools: true,
			link: from([errorLink, httpLink]),
		});

		try {
			const response = await apolloClient.query({
				query,
				variables,
				context: {
					headers: {
						authorization: usertoken ? `Bearer ${usertoken}` : '',
					},
				},
				errorPolicy: 'all', // This will include errors in the response, allowing partial data
			});

			if (response.errors && response.errors.length > 0) {
				return [false, response.errors];
			}

			return [true, response];
		} catch (err) {
			console.error('Network or other error:', err);
			return [false, err];
		}
	},

	mutation: async (mutation, variables, workspaceID, usertoken, type = null) => {
		const httpLink = new HttpLink({
			uri: `${graphQLAPICall[type]}/${workspaceID}/graphql`,
		});

		const link = ApolloLink.from([errorLink, httpLink]);
		const apolloClient = new ApolloClient({
			cache: new InMemoryCache(),
			defaultOptions,
			connectToDevTools: true,
			link: link,
		});

		try {
			const response = await apolloClient.mutate({
				mutation,
				variables,
				context: {
					headers: {
						authorization: usertoken ? `Bearer ${usertoken}` : '',
					},
				},
				errorPolicy: 'all', // Include this line to get partial data along with errors
			});

			if (response.errors && response.errors.length > 0) {
				return [false, response.errors];
			}

			return [true, response];
		} catch (err) {
			return [false, err];
		}
	},
};

export default Service;
