import { ApolloClient, InMemoryCache } from '@apollo/client';

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
		const region = localStorage.getItem('region') || 'ap-south-1';

		url =
			region === 'ap-south-1'
				? `${apiEndPointMapper?.[url] || `${graphql_server}`}/${workspaceId}/graphql`
				: `${apiEndPointMapperUS?.[url] || `${graphql_server_US}`}/${workspaceId}/graphql`;

		const apolloClient = new ApolloClient({
			uri: url,

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
		const region = localStorage.getItem('region') || 'ap-south-1';
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
		const apolloClient = new ApolloClient({
			uri: URL,

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
