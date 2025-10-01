import { ApolloClient, ApolloLink, HttpLink, from, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { Observable } from '@apollo/client/utilities';
import Cookies from 'js-cookie';
import refreshAccessToken from './utils/refreshAccessToken.js';
import { fetchDomainName } from '../../src/helpers';
import logout from '../../src/helpers/logout.js';

const refreshTokenForGraphQL = async () => {
	const response = await refreshAccessToken();
	const status = response.status;
	const refreshTokenResponse = await response.json();

	if (status === 200) {
		const { tokens } = refreshTokenResponse;
		const { accessToken, accessTokenExpiry } = tokens;
		const host = fetchDomainName();
		Cookies.set('usertoken', accessToken, { sameSite: 'lax', domain: host });
		Cookies.set('accessTokenExpiry', accessTokenExpiry, { sameSite: 'lax', domain: host });
		localStorage.setItem('usertoken', accessToken);
		localStorage.setItem('accessTokenExpiry', accessTokenExpiry);
		return [true, accessToken, status];
	} else if (status === 401 || status === 403) {
		if (
			refreshTokenResponse.message === 'jwt expired' ||
			refreshTokenResponse.message === 'Invalid refresh token, please login again'
		) {
			logout();
			return [false, refreshTokenResponse, status];
		} else {
			return [false, refreshTokenResponse, status];
		}
	} else {
		return [false, refreshTokenResponse, status];
	}
};

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
		if (
			networkError.statusCode === 401 ||
			(networkError.message && networkError.message.includes('401')) ||
			(networkError.message && networkError.message.includes('jwt expired'))
		) {
			return new Observable((observer) => {
				refreshTokenForGraphQL()
					.then(([success, accessToken, status]) => {
						if (success) {
							operation.setContext({
								...operation.getContext(),
								headers: {
									...operation.getContext().headers,
									authorization: accessToken ? `Bearer ${accessToken}` : '',
								},
							});

							const retryObservable = forward(operation);
							retryObservable.subscribe({
								next: observer.next.bind(observer),
								error: observer.error.bind(observer),
								complete: observer.complete.bind(observer),
							});
						} else {
							console.error('Token refresh failed:', status);
							observer.error(networkError);
						}
					})
					.catch((error) => {
						console.error('Token refresh error:', error);
						observer.error(networkError);
					});
			});
		}
	}

	return forward(operation);
});

import {
	graphql_server,
	graphql_server_US,
	calendar_api_US,
	calendar_api,
	activity_api,
	activity_api_US,
} from './config';

const defaultOptions = {
	watchQuery: {
		fetchPolicy: 'no-cache',
	},
	query: {
		fetchPolicy: 'no-cache',
	},
};

const apiEndPointMapper = {
	graphql_server,
	activity_api,
	calendar_api,
};
const apiEndPointMapperUS = {
	graphql_server: graphql_server_US,
	activity_api: activity_api_US,
	calendar_api: calendar_api_US,
};

const Service = {
	query: async (
		query,
		variables,
		workspaceId,
		workflowID,
		usertoken,
		url = null,
		isEndUser = null,
	) => {
		const region = localStorage.getItem('region') || 'us-east-1';

		url =
			region === 'ap-south-1'
				? `${apiEndPointMapper?.[url] || `${graphql_server}`}/${workspaceId}/graphql`
				: `${apiEndPointMapperUS?.[url] || `${graphql_server_US}`}/${workspaceId}/graphql`;

		const httpLink = new HttpLink({ uri: url });
		const link = from([errorLink, httpLink]);

		const apolloClient = new ApolloClient({
			link,
			cache: new InMemoryCache({
				resultCaching: true,
			}),
			defaultOptions,
			connectToDevTools: true,
		});
		try {
			const res = await apolloClient.query({
				query,
				variables,
				context: {
					headers: {
						authorization: usertoken ? `Bearer ${usertoken}` : '',
					},
				},
			});

			if (res) {
				return [true, res];
			}
		} catch (err) {
			return [false, err];
		}
	},
	mutation: async (
		mutation,
		variables,
		workspaceId,
		usertoken,
		url = null,
		trackerData = null,
		trackingToken = null,
		isEndUser = null,
	) => {
		const region = localStorage.getItem('region') || 'us-east-1';
		let subUrl = '';
		if (url) {
			subUrl =
				region === 'ap-south-1'
					? apiEndPointMapper?.[url] || `${graphql_server}`
					: apiEndPointMapperUS?.[url] || `${graphql_server_US}`;
		} else {
			subUrl = region === 'ap-south-1' ? `${graphql_server}` : `${graphql_server_US}`;
		}
		let URL = `${subUrl}/${workspaceId}/graphql`;
		const httpLink = new HttpLink({ uri: URL });
		const link = from([errorLink, httpLink]);

		const apolloClient = new ApolloClient({
			link,
			cache: new InMemoryCache(),
			defaultOptions,
			connectToDevTools: true,
		});
		try {
			const res = await apolloClient.mutate({
				mutation,
				variables,
				context: {
					headers: {
						authorization: usertoken ? `Bearer ${usertoken}` : '',
						//'tracking-token': trackingToken ? trackingToken : '',
						// 'x-ga-client-id': trackerData.gaClientId,
						// 'x-ga-session-id': trackerData.gaSessionId,
						// 'x-referrer-id': trackerData.referrer,
					},
				},
			});
			if (res) {
				return [true, res];
			}
		} catch (err) {
			return [false, err];
		}
	},
};
export default Service;
