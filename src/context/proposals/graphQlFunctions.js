import { gql } from '@apollo/client';
export const getProposalDataQuery = gql`
	query Query($id: ID!, $workflowId: ID!) {
		getProposal(_id: $id, workflowId: $workflowId)
	}
`;

export const updateProposalContentQuery = gql`
	mutation UpdateProposal($proposalId: ID!, $proposalInput: UpdateProposal!, $versionId: ID) {
		updateProposal(
			proposalId: $proposalId
			proposalInput: $proposalInput
			versionId: $versionId
		)
	}
`;

export const sendProposalQuery = gql`
	query Query($clientEmail: String!, $workflowId: ID!) {
		workflowLink(clientEmail: $clientEmail, workflowId: $workflowId)
	}
`;
