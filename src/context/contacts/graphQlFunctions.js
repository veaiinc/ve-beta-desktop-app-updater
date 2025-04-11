import { gql } from '@apollo/client';

export const getClientsQuery = gql`
	query Clients($clientFilterInput: ClientFilterInput) {
		clients(clientFilterInput: $clientFilterInput) {
			data {
				_id
				name
				email
				phoneNumber
				updatedAt
				createdAt
				workflows
			}
			hasNextPage
			currentPage
		}
	}
`;

export const getClientQuery = gql`
	query GetClient($getClientId: ID!) {
		getClient(id: $getClientId) {
			_id
			name
			email
			phoneNumber
			tenantId
			workflows
			templateDetails
			createdBy
			updatedBy
			createdAt
			updatedAt
		}
	}
`;

export const createClientMutation = gql`
	mutation CreateClient($clientInput: ClientInput!) {
		createClient(clientInput: $clientInput) {
			email
			name
			phoneNumber
		}
	}
`;

export const deleteClientMutation = gql`
	mutation DeleteClient($deleteClientId: ID!) {
		deleteClient(id: $deleteClientId)
	}
`;

export const updateClientMutation = gql`
	mutation UpdateClient($updateClientId: ID!, $updateClientInput: UpdateClientInput!) {
		updateClient(id: $updateClientId, updateClientInput: $updateClientInput) {
			_id
		}
	}
`;

export const contactMetadataQuery = gql`
	query GetClientMetadata {
		getClientMetadata {
			_id
			tenantId
			createdBy
			updatedBy
			views {
				_id
				filters
				label
				viewType
				sort {
					sortBy
					sortType
				}
				icon
			}
			createdAt
			updatedAt
		}
	}
`;

export const updateContactViewMutation = gql`
	mutation UpdateClientView($input: UpdateClientViewInput!, $viewId: ID, $clientMetadataId: ID!) {
		updateClientView(input: $input, viewId: $viewId, clientMetadataId: $clientMetadataId) {
			_id
			tenantId
			views {
				_id
				filters
				label
				viewType
				sort {
					sortBy
					sortType
				}
				icon
			}
			createdAt
			createdBy
			updatedAt
			updatedBy
		}
	}
`;

export const deleteContactViewMutation = gql`
	mutation DeleteClientView($clientMetadataId: ID!, $viewId: ID!) {
		deleteClientView(clientMetadataId: $clientMetadataId, viewId: $viewId) {
			message
		}
	}
`;
