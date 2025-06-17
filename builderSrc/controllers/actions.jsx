import * as API from './actionTypes';
import service from '../services/index';
import _, { sortBy } from 'lodash';

/*

	-------------------------------------
				Proposal Actions
	-------------------------------------
    
*/

export const getTemplate = async (workspaceId, templateId, token) => {
	return await service.fetchGet(
		'/' + workspaceId + API.Templates.url + '/' + templateId,

		token,
		'proposal',
	);
};
export const getTenantsData = async (workspaceId, token) => {
	return await service.fetchGet('/' + workspaceId, token, 'tenant', null);
};
export const putTenantsData = async (workspaceId, json, token) => {
	return await service.fetchPut(
		'/' + workspaceId + '/social-media-profile',
		json,
		token,
		'tenant',
		null,
	);
};
export const getAITextGeneration = async (workspaceId, type, json, token) => {
	return await service.fetchPost('/' + type, json, null, 'aiAssistant');
};
export const getAIImageGeneration = async (workspaceId, type, json, token) => {
	return await service.fetchPost('', json, null, 'aiAssistantImage');
};
export const generateTemplate = async (workspaceId, type, json, token) => {
	return await service.fetchPost('', json, null, 'generateTemplate');
};
export const getLayoutTextContent = async (workspaceId, templateID, json, token) => {
	return await service.fetchPost(
		'/' + workspaceId + '/' + templateID + '/update-content',
		json,
		null,
		'generateTemplate',
	);
};
export const getVariables = async (workspaceId, templateId, token) => {
	return await service.fetchGet(
		'/' + workspaceId + '/variables' + `?template_id=${templateId}`,

		token,
		'proposal',
	);
};
export const getSmartFileVariables = async (workspaceId, workflowId, token) => {
	return await service.fetchGet(
		'/' + workspaceId + '/variables/smart-file-variables' + `?workflow_id=${workflowId}`,

		token,
		'proposal',
	);
};
export const addServiceVariable = async (json, workspaceId, templateId, token) => {
	return await service.fetchPost('/' + workspaceId + '/variables', json, token, 'proposal');
};
export const postVariables = async (json, workspaceId, templateId, token) => {
	return await service.fetchPost('/' + workspaceId + '/variables', json, token, 'proposal');
};

export const updateVariables = async (json, workspaceId, token, variableId) => {
	return await service.fetchPut(
		'/' + workspaceId + '/variables/' + variableId,
		json,
		token,
		'proposal',
	);
};
export const deleteVariable = async (workspaceId, token, variableId) => {
	return await service.fetchDelete(
		'/' + workspaceId + '/variables/' + variableId,

		token,
		null,
		'proposal',
	);
};

export const getFonts = async (workspaceId, token) => {
	return await service.fetchGet('/' + workspaceId + '/getFontsList', token, 'tenant');
};
export const putTemplate = async (json, workspaceId, templateId, token) => {
	return await service.fetchPut(
		'/' + workspaceId + API.Templates.url + '/' + templateId,
		json,
		token,
		'proposal',
	);
};
export const putWorkflowTemplate = async (
	json,
	workspaceId,
	moduleType,
	moduleId,
	versionId,
	token,
) => {
	return await service.fetchPut(
		'/' +
			workspaceId +
			API.Templates.modules +
			'/' +
			moduleType +
			'/' +
			moduleId +
			'/versions/' +
			versionId,
		json,
		token,
		'proposal',
	);
};

export const duplicateTemplate = async (json, workspaceId, templateId, token) => {
	return await service.fetchPost(
		'/' + workspaceId + API.Templates.url + '/' + templateId + API.Templates.duplicateTemplate,
		json,
		token,
		'proposal',
	);
};

export const duplicateBlock = async (json, sectionID, templateID, token, workspaceId) => {
	return await service.fetchPost(
		'/' +
			workspaceId +
			API.Templates.url +
			'/' +
			templateID +
			API.Templates.sections +
			'/' +
			sectionID +
			API.Templates.duplicateTemplate,
		json,
		token,
		'proposal',
	);
};

export const duplicateWorkflowBlock = async (
	json,
	sectionID,
	workspaceId,
	moduleType,
	moduleId,
	versionId,
	token,
) => {
	return await service.fetchPost(
		'/' +
			workspaceId +
			API.Templates.modules +
			'/' +
			moduleType +
			'/' +
			moduleId +
			API.Templates.versions +
			'/' +
			versionId +
			API.Templates.sections +
			'/' +
			sectionID +
			API.Templates.duplicateTemplate,
		json,
		token,
		'proposal',
	);
};

export const duplicateServiceBlock = async (
	json,
	blockId,
	sectionID,
	templateID,
	token,
	workspaceId,
) => {
	return await service.fetchPost(
		'/' +
			workspaceId +
			API.Templates.url +
			'/' +
			templateID +
			API.Templates.sections +
			'/' +
			sectionID +
			'/blocks/' +
			blockId +
			'/duplicateSectionBlock',
		json,
		token,
		'proposal',
	);
};
export const generateWorkflow = async (json, workspaceId, workflowID) => {
	return await service.fetchPost(
		`/${workspaceId}/${workflowID}/generate-page-outline`,
		json,
		null,
		'generateTemplate',
	);
};
export const duplicateWorkflowServiceBlock = async (
	json,
	blockId,
	sectionID,
	workspaceId,
	moduleType,
	moduleId,
	versionId,
	token,
) => {
	return await service.fetchPost(
		'/' +
			workspaceId +
			API.Templates.modules +
			'/' +
			moduleType +
			'/' +
			moduleId +
			'/versions/' +
			versionId +
			API.Templates.sections +
			'/' +
			sectionID +
			'/blocks/' +
			blockId +
			'/duplicateSectionBlock',
		json,
		token,
		'proposal',
	);
};

export const createLayout = async (workspaceId, json, token) => {
	return await service.fetchPost(
		'/' + workspaceId + API.Templates.layouts + '/',
		json,
		token,
		'proposal',
	);
};
export const addSubBlock = async (workspaceId, json, templateId, sectionID, blockID, token) => {
	return await service.fetchPost(
		'/' +
			workspaceId +
			API.Templates.url +
			'/' +
			templateId +
			API.Templates.sections +
			'/' +
			sectionID +
			API.Templates.blocks +
			'/' +
			blockID +
			API.Templates.subBlocks,
		json,
		token,
		'proposal',
	);
};
export const addWorkflowSubBlock = async (
	workspaceId,
	json,
	templateId,
	sectionID,
	blockID,
	token,
	moduleType,
	moduleId,
	activeVersionId,
) => {
	return await service.fetchPost(
		'/' +
			workspaceId +
			API.Templates.modules +
			'/' +
			moduleType +
			'/' +
			moduleId +
			API.Templates.versions +
			'/' +
			activeVersionId +
			API.Templates.sections +
			'/' +
			sectionID +
			API.Templates.blocks +
			'/' +
			blockID +
			API.Templates.subBlocks,
		json,
		token,
		'proposal',
	);
};
export const addLayout = async (workspaceId, json, templateId, token) => {
	return await service.fetchPost(
		'/' + workspaceId + API.Templates.url + '/' + templateId + API.Templates.layouts,
		json,
		token,
		'proposal',
	);
};
export const addSection = async (workspaceId, json, templateId, token) => {
	return await service.fetchPost(
		'/' + workspaceId + API.Templates.url + '/' + templateId + API.Templates.sections,
		json,
		token,
		'proposal',
	);
};

export const singleSectionEdit = async (workspaceId, json, templateId, sectionId, token) => {
	return await service.fetchPut(
		'/' +
			workspaceId +
			API.Templates.url +
			'/' +
			templateId +
			API.Templates.sections +
			'/' +
			sectionId,
		json,
		token,
		'proposal',
	);
};
export const singleWorkflowSectionEdit = async (
	json,
	workspaceId,
	moduleType,
	moduleId,
	versionId,
	sectionId,
	token,
) => {
	return await service.fetchPut(
		'/' +
			workspaceId +
			API.Templates.modules +
			'/' +
			moduleType +
			'/' +
			moduleId +
			API.Templates.versions +
			'/' +
			versionId +
			API.Templates.sections +
			'/' +
			sectionId,
		json,
		token,
		'proposal',
	);
};

export const addWorkflowLayout = async (
	json,
	workspaceId,
	moduleType,
	moduleId,
	versionId,
	token,
	isFluid,
) => {
	return await service.fetchPost(
		'/' +
			workspaceId +
			API.Templates.modules +
			'/' +
			moduleType +
			'/' +
			moduleId +
			API.Templates.versions +
			'/' +
			versionId +
			`${isFluid ? API.Templates.sections : API.Templates.layouts}`,
		json,
		token,
		'proposal',
	);
};

export const addServiceTableBlock = async (workspaceId, json, sectionID, templateID, token) => {
	return await service.fetchPost(
		'/' +
			workspaceId +
			API.Templates.url +
			'/' +
			templateID +
			API.Templates.sections +
			'/' +
			sectionID +
			'/blocks',
		json,
		token,
		'proposal',
	);
};

// /:module_type/:module_id/versions/:version_id/sections/:section_id/blocks

// /:template_id/sections/:section_id/blocks/:block_id/sub-blocks
export const duplicateSubBlock = async (
	workspaceId,
	json,
	templateID,
	sectionID,
	blockID,
	token,
) => {
	return await service.fetchPost(
		'/' +
			workspaceId +
			API.Templates.url +
			'/' +
			templateID +
			API.Templates.sections +
			'/' +
			sectionID +
			'/blocks/' +
			blockID +
			'/sub-blocks',
		json,
		token,
		'proposal',
	);
};

export const duplicateWorkflowSubBlock = async (
	json,
	workspaceId,
	moduleType,
	moduleId,
	versionId,
	sectionID,
	blockId,
	token,
) => {
	return await service.fetchPost(
		'/' +
			workspaceId +
			API.Templates.modules +
			'/' +
			moduleType +
			'/' +
			moduleId +
			API.Templates.versions +
			'/' +
			versionId +
			API.Templates.sections +
			'/' +
			sectionID +
			API.Templates.blocks +
			'/' +
			blockId +
			API.Templates.subBlocks,
		json,
		token,
		'proposal',
	);
};

export const addWorkflowServiceTableBlock = async (
	workspaceId,
	json,
	sectionID,
	moduleType,
	moduleId,
	versionId,
	token,
) => {
	return await service.fetchPost(
		'/' +
			workspaceId +
			API.Templates.modules +
			'/' +
			moduleType +
			'/' +
			moduleId +
			API.Templates.versions +
			'/' +
			versionId +
			API.Templates.sections +
			'/' +
			sectionID +
			'/blocks',
		json,
		token,
		'proposal',
	);
};

// /:module_type/:module_id/versions/:version_id/sections/:section_id/blocks/:block_id/duplicateSectionBlock
export const duplicateWorkflowEventBlock = async (
	json,
	workspaceId,
	moduleType,
	moduleId,
	versionId,
	sectionId,
	blockId,
	token,
) => {
	return await service.fetchPost(
		'/' +
			workspaceId +
			API.Templates.modules +
			'/' +
			moduleType +
			'/' +
			moduleId +
			API.Templates.versions +
			'/' +
			versionId +
			API.Templates.sections +
			'/' +
			sectionId +
			API.Templates.blocks +
			'/' +
			blockId +
			'/duplicateSectionBlock',
		json,
		token,
		'proposal',
	);
};

export const deleteSection = async (templateID, sectionID, workspaceId, userToken) => {
	return await service.fetchDelete(
		'/' +
			workspaceId +
			API.Templates.url +
			'/' +
			templateID +
			API.Templates.sections +
			'/' +
			sectionID,
		userToken,
		null,
		'proposal',
	);
};

export const deleteWorkflowSection = async (
	sectionID,
	workspaceId,
	moduleType,
	moduleId,
	versionId,
	token,
) => {
	return await service.fetchDelete(
		'/' +
			workspaceId +
			API.Templates.modules +
			'/' +
			moduleType +
			'/' +
			moduleId +
			API.Templates.versions +
			'/' +
			versionId +
			API.Templates.sections +
			'/' +
			sectionID,
		token,
		null,
		'proposal',
	);
};

export const deleteBlock = async (templateID, blockID, sectionID, workspaceId, userToken) => {
	return await service.fetchDelete(
		'/' +
			workspaceId +
			API.Templates.url +
			'/' +
			templateID +
			API.Templates.sections +
			'/' +
			sectionID +
			API.Templates.blocks +
			'/' +
			blockID,
		userToken,
		null,
		'proposal',
	);
};

export const deleteWorkflowBlock = async (
	blockID,
	sectionID,
	workspaceId,
	moduleType,
	moduleId,
	versionId,
	token,
) => {
	return await service.fetchDelete(
		'/' +
			workspaceId +
			API.Templates.modules +
			'/' +
			moduleType +
			'/' +
			moduleId +
			API.Templates.versions +
			'/' +
			versionId +
			API.Templates.sections +
			'/' +
			sectionID +
			API.Templates.blocks +
			'/' +
			blockID,
		token,
		null,
		'proposal',
	);
};

export const saveSectionBlockSubBlockContent = async (
	proposalID,
	sectionID,
	blockID,
	subBlockID,
	json,
	workspaceId,
	userToken,
) => {
	return await service.fetchPut(
		'/' +
			workspaceId +
			'/' +
			'templates' +
			'/' +
			proposalID +
			API.Templates.sections +
			'/' +
			sectionID +
			API.Templates.blocks +
			'/' +
			blockID +
			API.Templates.subBlocks +
			'/' +
			subBlockID,
		json,
		userToken,
		'proposal',
	);
};

export const uploadImage = async (json, token, workspaceId, templateID) => {
	return await service.fetchPost(
		`/${workspaceId}/workspaceAssets/templates/${templateID}/images`,
		json,
		token,
		'images',
	);
};

export const uploadImageWorkflow = async (json, token, workspaceId, moduleType, moduleId) => {
	return await service.fetchPost(
		`/${workspaceId}/workspaceAssets-images${API.Templates.modules}/${moduleType}/${moduleId}/images`,
		json,
		token,
		'images',
	);
};

export const getUploadStatus = async (usertoken, batchID) => {
	return await service.fetchGet(
		API.Templates.imageUploadStatus + API.Templates.uploadBatchID + batchID,
		usertoken,
		'images',
	);
};

export const getAllImages = async (usertoken, workspaceId, query) => {
	return await service.fetchGet(
		`/${workspaceId}/workspaceAssets-images?${query}`,
		usertoken,
		'images',
	);
};

// actions for invoice

export const getInvoiceNumber = async (workspaceId, token) => {
	return await service.fetchGet(
		'/' + workspaceId + '/' + 'invoice-preferences',

		token,
		'tenant',
	);
};

export const putInvoiceNumber = async (invoiceNumber, workspaceId, token) => {
	return await service.fetchPut(
		'/' + workspaceId + '/' + 'invoice-preferences',
		{ invoicePreferences: invoiceNumber },
		token,
		'tenant',
	);
};
// actions for color picker

export const getBrandColors = async (workspaceId, token) => {
	return await service.fetchGet('/' + workspaceId + '/preferences', token, 'tenant');
};

export const putBrandColors = async (json, workspaceId, token) => {
	return await service.fetchPut(
		'/' + workspaceId + '/preferences',
		{ brandingThemes: json },
		token,
		'tenant',
	);
};
export const getWorkflowWithModules = async (workspaceId, token) => {
	// return await service.fetchGet(`/${workspaceId}/workflows/modules`, token, 'tenant');
	return await service.fetchGet(`/${workspaceId}/graphql`, token, 'tenant');
};

// Schedule Services

export const getAllSchedules = async (workspaceId, token) => {
	return await service.fetchGet(`/${workspaceId}/scheduler/all-sessions`, token, 'calendar');
};

export const getSessionDetails = async (workspaceId, token, sessionId) => {
	return await service.fetchGet(
		`/${workspaceId}/scheduler/session/${sessionId}`,
		token,
		'calendar',
	);
};
