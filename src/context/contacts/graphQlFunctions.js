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
			}
			hasNextPage
			currentPage
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
