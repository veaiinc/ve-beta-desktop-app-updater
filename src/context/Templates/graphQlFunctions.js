import { gql } from '@apollo/client';
export const getTemmplatesQuery = gql`
	query Templates($filters: TemplateListFiltersInput) {
		templates(filters: $filters) {
			currentPage
			hasNextPage
			data {
				_id
				moduleTemplates {
					module
					order
					_id
				}
				status

				tenantId
				title
				updatedAt
				workflows
				templates
			}
		}
	}
`;

export const createProposalQuery = gql`
	mutation CreateProposalUsingWorkflowTemplate(
		$proposalTemplateId: ID!
		$workflowTemplateId: ID!
		$proposalInput: ProposalInput!
	) {
		createProposalUsingWorkflowTemplate(
			proposalTemplateId: $proposalTemplateId
			workflowTemplateId: $workflowTemplateId
			proposalInput: $proposalInput
		)
	}
`;

export const getWorkflowDetailsListQuery = gql`
	query Workflows($filters: WorkflowsListFiltersInput) {
		workflows(filters: $filters) {
			currentPage
			hasNextPage
			data {
				_id
				createdBy
				createdAt
				modules
				proposalsCreated
				tenantId
				updatedAt
				updatedBy
				proposals
				clientDetails {
					_id
					email
					name
				}
			}
		}
	}
`;
