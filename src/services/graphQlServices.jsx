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

let cachedConfig = null;

async function getConfig() {
	if (!cachedConfig) {
		cachedConfig = await loadConfig();
	}
	return cachedConfig;
}

const Service = {
	query: async (query, variables, workspaceId, usertoken, type = null) => {
		const config = await getConfig();

		const {
			ve_conversations_api,
			workflows_Api,
			ve_conversations_api_US,
			workflows_Api_US,
			activity_api,
			activity_api_US,
			multi_agent_chat,
			multi_agent_chat_US,
			automation_builder_api,
			automation_builder_api_US,
			page_notes_api,
			page_notes_api_US,
			page_notes_api_database,
			page_notes_api_database_US,
			meeting_summary_api,
			meeting_summary_api_US,
			meeting_api,
			meeting_api_US,
		} = config;

		const graphQLAPICall = {
			ve_conversations_api,
			workflows_Api,
			activity_api,
			multi_agent_chat,
			automation_builder_api,
			page_notes_api,
			page_notes_api_database,
			meeting_summary_api,
			meeting_api,
		};

		const graphQLAPICallUS = {
			ve_conversations_api: ve_conversations_api_US,
			workflows_Api: workflows_Api_US,
			activity_api: activity_api_US,
			multi_agent_chat: multi_agent_chat_US,
			automation_builder_api: automation_builder_api_US,
			page_notes_api: page_notes_api_US,
			page_notes_api_database: page_notes_api_database_US,
			meeting_summary_api: meeting_summary_api_US,
			meeting_api: meeting_api_US,
		};

		// hotfix
		// const region = localStorage.getItem('region') || 'us-east-1';
		let region;
		if (workspaceId === 'framemax') {
			const region = 'us-north-1';
		} else {
			region = localStorage.getItem('region') || 'us-east-1';
		}
		const subUrl = region === 'ap-south-1' ? graphQLAPICall[type] : graphQLAPICallUS[type];
		const httpLink = new HttpLink({ uri: `${subUrl}/${workspaceId}/graphql` });

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
		const config = await getConfig();

		const {
			ve_conversations_api,
			workflows_Api,
			ve_conversations_api_US,
			workflows_Api_US,
			activity_api,
			activity_api_US,
			multi_agent_chat,
			multi_agent_chat_US,
			automation_builder_api,
			automation_builder_api_US,
			page_notes_api,
			page_notes_api_US,
			page_notes_api_database,
			page_notes_api_database_US,
			meeting_summary_api,
			meeting_summary_api_US,
			meeting_api,
			meeting_api_US,
		} = config;

		const graphQLAPICall = {
			ve_conversations_api,
			workflows_Api,
			activity_api,
			multi_agent_chat,
			automation_builder_api,
			page_notes_api,
			page_notes_api_database,
			meeting_summary_api,
			meeting_api,
		};

		const graphQLAPICallUS = {
			ve_conversations_api: ve_conversations_api_US,
			workflows_Api: workflows_Api_US,
			activity_api: activity_api_US,
			multi_agent_chat: multi_agent_chat_US,
			automation_builder_api: automation_builder_api_US,
			page_notes_api: page_notes_api_US,
			page_notes_api_database: page_notes_api_database_US,
			meeting_summary_api: meeting_summary_api_US,
			meeting_api: meeting_api_US,
		};

		const region = localStorage.getItem('region') || 'us-east-1';
		const subUrl = region === 'ap-south-1' ? graphQLAPICall[type] : graphQLAPICallUS[type];
		const httpLink = new HttpLink({ uri: `${subUrl}/${workspaceId}/graphql` });
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
