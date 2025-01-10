import { gql } from '@apollo/client';

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
