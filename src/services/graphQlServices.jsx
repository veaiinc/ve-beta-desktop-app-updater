import { ApolloClient, ApolloLink, HttpLink, from, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { Observable } from '@apollo/client/utilities';
import Cookies from 'js-cookie';
import getBaseUrl from './baseUrls.js';
import refreshAccessToken from './utils/refreshAccessToken.js';
import { fetchDomainName } from '../helpers';
import logout from '../helpers/logout.js';

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
								next: (result) => observer.next(result),
								error: (err) => observer.error(err),
								complete: () => observer.complete(),
							});
						} else {
							console.error('Token refresh failed:', status);
							observer.error(networkError);
						}
					})
					.catch((error) => {
						console.error('Token refresh failed:', error);
						observer.error(networkError);
					});
			});
		}
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
