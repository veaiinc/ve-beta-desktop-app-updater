import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import Cookies from 'universal-cookie';

const ProjectsAPI = require('./config').projects_api_server;
const FormsAPI = require('./config').forms_graphql_server;
const VendorsAPI = require('./config').vendors_api_server;
const ve_conversations = require('./config').ve_conversations;

const defaultOptions = {
	watchQuery: {
		fetchPolicy: 'no-cache',
	},
	query: {
		fetchPolicy: 'no-cache',
	},
};
const cookies = new Cookies();
const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors) {
		if (graphQLErrors[0].code === 401) {
			onUserKickedOut();
		}
	}
});

const Service = {
	query: async (query, variables, workspaceID, usertoken, type = null) => {
		const httpLink = new HttpLink({
			uri: `${
				type && type == true
					? FormsAPI
					: type == 'vendors'
					? VendorsAPI
					: type === 'veChat'
					? ve_conversations
					: ProjectsAPI
			}/${workspaceID}/graphql`,
		});
		const apolloClient = new ApolloClient({
			cache: new InMemoryCache({
				resultCaching: true,
			}),
			defaultOptions,
			connectToDevTools: true,
			link: from([errorLink, httpLink]),
		});

		return await apolloClient
			.query({
				query,
				variables,
				context: {
					headers: {
						authorization: usertoken ? `Bearer ${usertoken}` : '',
					},
				},
			})
			.then((res) => {
				return [true, res];
			})
			.catch((err) => {
				return [false, err];
			});
	},
	mutation: async (mutation, variables, workspaceID, usertoken, type = null) => {
		const httpLink = new HttpLink({
			uri: `${
				type && type == true ? FormsAPI : type == 'vendors' ? VendorsAPI : ProjectsAPI
			}/${workspaceID}/graphql`,
		});
		const apolloClient = new ApolloClient({
			//uri: `${type && type == true ? FormsAPI : ProjectsAPI}/${workspaceID}/graphql`,
			cache: new InMemoryCache(),
			defaultOptions,
			connectToDevTools: true,
			link: from([errorLink, httpLink]),
		});

		return await apolloClient
			.mutate({
				mutation,
				variables,
				context: {
					headers: {
						authorization: usertoken ? `Bearer ${usertoken}` : '',
					},
				},
			})
			.then((res) => {
				return [true, res];
			})
			.catch((err) => {
				return [false, err];
			});
	},
};

const onUserKickedOut = async (res, url) => {
	localStorage.removeItem('usertoken');
	cookies.remove('usertoken', {
		domain:
			window.location.host.split('.')[1] === 'huemn'
				? '.huemn.com'
				: window.location.hostname,
		path: '/',
	});

	window.location.reload();
};

export default Service;
