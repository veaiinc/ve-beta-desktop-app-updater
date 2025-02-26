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
					isPublic
					label
				}
				status

				tenantId
				title
				workflows
				templates
				steps
				version
				# steps {
				# 	_id
				# 	criteria
				# 	module
				# 	nextStepId
				# 	nextStepType
				# 	emailTemplateTitle
				# 	emailTemplateSubject
				# 	emailTemplateId
				# 	sendAt
				# 	order
				# 	type
				# }
				workflowStats
				formResponses
				filesSent
				slug
				actionRequired
				createdAt
			}
		}
	}
`;

export const duplicateTemplateQuery = gql`
	mutation DuplicateWorkflowTemplate($templateId: ID!, $title: String!) {
		duplicateWorkflowTemplate(templateId: $templateId, title: $title) {
			_id
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
				phoneNumber
				_id
				updatedBy
				updatedAt
				createdAt
				createdBy
			}
		}
	}
`;

//new Queries

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
			steps
			# steps {
			# 	_id
			# 	criteria
			# 	module
			# 	nextStepId
			# 	nextStepType
			# 	emailTemplateTitle
			# 	emailTemplateSubject
			# 	emailTemplateId
			# 	sendAt
			# 	order
			# 	type
			# }
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
			_id
		}
	}
`;

export const deleteWorkflowStepQuery = gql`
	mutation RemoveStep($removeStepInput: RemoveStepInput) {
		removeStep(removeStepInput: $removeStepInput) {
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
				title
				status
				clientDetails {
					_id
					email
					name
				}
				status
				slug
				modules
				formResponse
				requiredAction
				templateId
				version
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
				status
				slug
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

export const sendSmartFileMutation = gql`
	mutation ShareWorkflowLink(
		$clientEmail: String!
		$workflowId: ID!
		$mailContent: mailContentInput
		$expiresAt: Int
		$isPublic: Boolean
	) {
		shareWorkflowLink(
			clientEmail: $clientEmail
			workflowId: $workflowId
			mailContent: $mailContent
			expiresAt: $expiresAt
			isPublic: $isPublic
		)
	}
`;

export const formResponsesQuery = gql`
	query Query($formId: ID!) {
		formResponse(formId: $formId)
	}
`;

export const changeWorkflowStatusQuery = gql`
	mutation FileSentStatus($fileSentStatusId: ID!) {
		fileSentStatus(id: $fileSentStatusId) {
			message
		}
	}
`;

export const getSignedUrlForContractsQuery = gql`
	mutation UploadContractSignedUrl($uploadContractSignedUrlId: ID!) {
		uploadContractSignedUrl(id: $uploadContractSignedUrlId)
	}
`;

export const moveWorkflowStatusQuery = gql`
	mutation UpdateWorkflowStatus(
		$updateWorkflowStatusId: ID!
		$workflowInput: WorkflowStatusInput!
	) {
		updateWorkflowStatus(id: $updateWorkflowStatusId, workflowInput: $workflowInput) {
			message
		}
	}
`;

export const getSpecifiTemplatesInfoQuery = gql`
	query TemplateInfo($templateInfoId: ID!) {
		templateInfo(id: $templateInfoId) {
			_id
			moduleTemplates {
				module
				order
				_id
				isPublic
			}
			status

			tenantId
			title
			templates
			# steps {
			# 	_id
			# 	criteria
			# 	module
			# 	nextStepId
			# 	nextStepType
			# 	emailTemplateTitle
			# 	emailTemplateSubject
			# 	emailTemplateId
			# 	sendAt
			# 	order
			# 	type
			# }
			steps
			slug
		}
	}
`;

export const getSendSmartFileTemplateQuery = gql`
	query Query {
		getWorflowEmailTemplate
	}
`;

export const checkSmartFileSlugExistsQuery = gql`
	query Query($slug: String!, $moduleType: Modules!) {
		isSlugAvailable(slug: $slug, moduleType: $moduleType)
	}
`;

export const updateSmartFileSlugMutation = gql`
	mutation UpdateSlug($updateSlugId: ID!, $slug: String!, $moduleType: Modules!) {
		updateSlug(id: $updateSlugId, slug: $slug, moduleType: $moduleType)
	}
`;

export const deleteLeadMutation = gql`
	mutation DeleteWorkflow($deleteWorkflowId: ID!) {
		deleteWorkflow(id: $deleteWorkflowId)
	}
`;

export const deleteWorkflowTemplatesMutation = gql`
	mutation DeleteTemplate($deleteTemplateId: ID!) {
		deleteTemplate(id: $deleteTemplateId) {
			message
		}
	}
`;

export const getTabItemCountQuery = gql`
	query Query {
		getNumberOfRequiredActions {
			enquiry
			counterSign
			emailApproval
			expiresInThreeDays
			all
		}
	}
`;

export const getRequiredActionDetailsQuery = gql`
	query Query($filters: RequiredActionsFiltersInput) {
		listRequiredActions(filters: $filters) {
			data {
				_id
				title
				action
				clientName
				createdAt
				expiresAt
				approvalRequired
				status
				templateId
			}
			hasNextPage
			limit
			currentPage
		}
	}
`;

export const updateSendSmartFileSettingsMutation = gql`
	mutation UpdateWorkflow($updateWorkflowId: ID!, $updateWorkflowInput: UpdateWorkflowInput) {
		updateWorkflow(id: $updateWorkflowId, updateWorkflowInput: $updateWorkflowInput)
	}
`;

export const getLatestSendSmartFileSettingsQuery = gql`
	query Query {
		getLatestWorkflowSettings
	}
`;

export const getActivityLogsQuery = gql`
	query ActivityLogs($filters: ActivityLogsFilterInput) {
		activityLogs(filters: $filters) {
			currentPage
			data {
				_id
				timestamp
				summary
				action
			}
			hasNextPage
		}
	}
`;

export const addNewStepsQuery = gql`
	mutation AddStep($templateId: ID!, $stepInput: StepInput!) {
		addStep(templateId: $templateId, stepInput: $stepInput)
	}
`;

export const updateStepsQuery = gql`
	mutation UpdateStep($templateId: ID!, $updateStepInput: UpdateStepInput!) {
		updateStep(templateId: $templateId, updateStepInput: $updateStepInput) {
			message
		}
	}
`;

export const getFormResponsesListQuery = gql`
	query FormResponsesList($filters: FileFiltersInput) {
		formResponsesList(filters: $filters) {
			data
			totalPages
			totalDocs
			limit
			currentPage
			hasNextPage
			hasPrevPage
			prevPage
			nextPage
		}
	}
`;
