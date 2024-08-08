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
				workflows
				templates
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
				workflowStats
				formResponses
				filesSent
				slug
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
	mutation DuplicateWorkflowTemplate($templateId: ID!, $title: String!) {
		duplicateWorkflowTemplate(templateId: $templateId, title: $title) {
			_id
			tenantId
			slug
			moduleTemplates {
				module
				order
				_id
				isPublic
			}
			templates
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
			status
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

//new Queries

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
			slug
			status
			moduleTemplates {
				module
				isPublic
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

export const deleteWorkflowStepQuery = gql`
	mutation DeleteStep($templateId: ID!, $stepId: ID!) {
		deleteStep(templateId: $templateId, stepId: $stepId) {
			message
		}
	}
`;

export const updateWorkflowStepsQuery = gql`
	mutation UpdateEmailTemplate(
		$updateEmailTemplateId: ID!
		$updateTemplateInput: UpdateTemplateInput!
	) {
		updateEmailTemplate(id: $updateEmailTemplateId, updateTemplateInput: $updateTemplateInput) {
			_id
		}
	}
`;

export const getSmartFileDataQuery = gql`
	query Query($getWorkflowWithModulesId: ID!) {
		getWorkflowWithModules(id: $getWorkflowWithModulesId)
	}
`;

export const updateProposalQuery = gql`
	mutation UpdateProposal(
		$workflowId: ID!
		$proposalId: ID!
		$proposalInput: UpdateProposal!
		$versionId: ID
	) {
		updateProposal(
			workflowId: $workflowId
			proposalId: $proposalId
			proposalInput: $proposalInput
			versionId: $versionId
		)
	}
`;
export const updateFormQuery = gql`
	mutation UpdateForm($formId: ID!, $formInput: UpdateForm!, $versionId: ID, $workflowId: ID!) {
		updateForm(
			formId: $formId
			formInput: $formInput
			versionId: $versionId
			workflowId: $workflowId
		)
	}
`;
export const updateContractQuery = gql`
	mutation UpdateContract(
		$contractId: ID!
		$contractInput: UpdateContract!
		$versionId: ID
		$workflowId: ID!
	) {
		updateContract(
			contractId: $contractId
			contractInput: $contractInput
			versionId: $versionId
			workflowId: $workflowId
		)
	}
`;
export const updateInvoiceQuery = gql`
	mutation UpdateInvoice(
		$invoiceId: ID!
		$invoiceInput: UpdateInvoice!
		$versionId: ID
		$workflowId: ID!
	) {
		updateInvoice(
			invoiceId: $invoiceId
			invoiceInput: $invoiceInput
			versionId: $versionId
			workflowId: $workflowId
		)
	}
`;
export const updateThankYouQuery = gql`
	mutation UpdateThankyou(
		$thankyouId: ID!
		$thankyouInput: UpdateThankyou!
		$versionId: ID
		$workflowId: ID!
	) {
		updateThankyou(
			thankyouId: $thankyouId
			thankyouInput: $thankyouInput
			versionId: $versionId
			workflowId: $workflowId
		)
	}
`;

export const getWorkflowListQuery = gql`
	query Workflows($filters: WorkflowsListFiltersInput) {
		workflows(filters: $filters) {
			currentPage
			hasNextPage
			data {
				_id
				clientDetails {
					_id
					email
					name
				}
				status
				slug
				modules
				formResponse
			}
		}
	}
`;

export const getTemplatesListForCreateLeadQuery = gql`
	query Templates($filters: TemplateListFiltersInput) {
		templates(filters: $filters) {
			currentPage
			hasNextPage
			data {
				_id
				title
			}
		}
	}
`;

export const createLeadfromTemplatesQuery = gql`
	mutation CreateWorkflowFromTemplate($workflowInput: WorkflowInput) {
		createWorkflowFromTemplate(workflowInput: $workflowInput) {
			_id
			status
			clientDetails {
				_id
				name
				email
			}
		}
	}
`;

export const workflowsLinkQuery = gql`
	mutation WorkflowLink($clientEmail: String!, $workflowId: ID!) {
		workflowLink(clientEmail: $clientEmail, workflowId: $workflowId)
	}
`;

export const formResponsesQuery = gql`
	query Query($formId: ID!) {
		formResponse(formId: $formId)
	}
`;
