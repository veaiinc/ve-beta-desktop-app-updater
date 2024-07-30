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
				proposalsCreated
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
				# proposalsCreated
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

export const duplicateTemplateQuery = gql`
	mutation Mutation($templateId: ID!, $title: String!) {
		duplicateWorkflowTemplate(templateId: $templateId, title: $title) {
			_id
			moduleTemplates {
				module
				order
				_id
			}
			proposalsCreated
			status
			templates
			tenantId
			title
			workflows
		}
	}
`;

export const getClientListQuery = gql`
	query ClientsList($filters: ClientListFiltersInput!) {
		clientsList(filters: $filters) {
			currentPage
			hasNextPage
			data {
				email
				name
			}
		}
	}
`;

export const getTemplateInfoQuery = gql`
	query TemplateInfo($templateInfoId: ID!) {
		templateInfo(id: $templateInfoId) {
			steps {
				_id
				criteria
				module
				nextStepId
				nextStepType
				order
				type
				emailTemplateTitle
				emailTemplateId
				sendAt
				emailTemplateSubject
			}
			status
		}
	}
`;

export const getAllEmailTemplatesQuery = gql`
	query EmailTemplatesList($filters: EmailTemplateListFiltersInput!) {
		emailTemplatesList(filters: $filters) {
			currentPage
			data {
				subject
				htmlBody
				_id
				title
			}
			hasNextPage
		}
	}
`;

export const addEmailTriggersInWorkflowQuery = gql`
	mutation UpdateWorkflowTemplate($templateId: ID!, $updateObj: TemplateUpdateObj!) {
		updateWorkflowTemplate(templateId: $templateId, updateObj: $updateObj) {
			_id
			steps {
				_id
				criteria
				module
				nextStepId
				nextStepType
				emailTemplateTitle
				emailTemplateSubject
				emailTemplateId
				sendAt
				order
				type
			}
		}
	}
`;

export const getSpecificWorkflowTemplateDetailsQuery = gql`
	query GetEmailTemplate($getEmailTemplateId: ID!) {
		getEmailTemplate(id: $getEmailTemplateId) {
			htmlBody
			subject
			title
			sendAt
			approvalRequired
		}
	}
`;
