import * as API from './actionTypes';
import service from '../services/index';
import _, { sortBy } from 'lodash';

/*

	-------------------------------------
				Proposal Actions
	-------------------------------------
    
*/

export const getTemplate = async (workspaceID, templateId, token) => {
	return await service.fetchGet(
		'/' + workspaceID + API.Templates.url + '/' + templateId,

		token,
		'proposal',
	);
};
export const getTenantsData = async (workspaceID, token) => {
	return await service.fetchGet('/' + workspaceID, token, 'tenant', null);
};
export const putTenantsData = async (workspaceID, json, token) => {
	return await service.fetchPut(
		'/' + workspaceID + '/social-media-profile',
		json,
		token,
		'tenant',
		null,
	);
};
export const getAITextGeneration = async (workspaceID, type, json, token) => {
	return await service.fetchPost('/' + type, json, null, 'aiAssistant');
};
export const getAIImageGeneration = async (workspaceID, type, json, token) => {
	return await service.fetchPost('', json, null, 'aiAssistantImage');
};
export const generateTemplate = async (workspaceID, type, json, token) => {
	return await service.fetchPost('', json, null, 'generateTemplate');
};
export const getLayoutTextContent = async (workspaceID, templateID, json, token) => {
	return await service.fetchPost(
		'/' + workspaceID + '/' + templateID + '/update-content',
		json,
		null,
		'generateTemplate',
	);
};
export const getVariables = async (workspaceID, templateId, token) => {
	return await service.fetchGet(
		'/' + workspaceID + '/variables' + `?template_id=${templateId}`,

		token,
		'proposal',
	);
};
export const getSmartFileVariables = async (workspaceID, workflowId, token) => {
	return await service.fetchGet(
		'/' + workspaceID + '/variables/smart-file-variables' + `?workflow_id=${workflowId}`,

		token,
		'proposal',
	);
};
export const addServiceVariable = async (json, workspaceID, templateId, token) => {
	return await service.fetchPost('/' + workspaceID + '/variables', json, token, 'proposal');
};
export const postVariables = async (json, workspaceID, templateId, token) => {
	return await service.fetchPost('/' + workspaceID + '/variables', json, token, 'proposal');
};

export const updateVariables = async (json, workspaceID, token, variableId) => {
	return await service.fetchPut(
		'/' + workspaceID + '/variables/' + variableId,
		json,
		token,
		'proposal',
	);
};
export const deleteVariable = async (workspaceID, token, variableId) => {
	return await service.fetchDelete(
		'/' + workspaceID + '/variables/' + variableId,

		token,
		null,
		'proposal',
	);
};

export const getFonts = async (workspaceID, token) => {
	return await service.fetchGet('/' + workspaceID + '/getFontsList', token, 'tenant');
};
export const putTemplate = async (json, workspaceID, templateId, token) => {
	return await service.fetchPut(
		'/' + workspaceID + API.Templates.url + '/' + templateId,
		json,
		token,
		'proposal',
	);
};
export const putWorkflowTemplate = async (
	json,
	workspaceID,
	moduleType,
	moduleId,
	versionId,
	token,
) => {
	return await service.fetchPut(
		'/' +
			workspaceID +
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

export const duplicateTemplate = async (json, workspaceID, templateId, token) => {
	return await service.fetchPost(
		'/' + workspaceID + API.Templates.url + '/' + templateId + API.Templates.duplicateTemplate,
		json,
		token,
		'proposal',
	);
};

export const duplicateBlock = async (json, sectionID, templateID, token, workspaceID) => {
	return await service.fetchPost(
		'/' +
			workspaceID +
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
	workspaceID,
	moduleType,
	moduleId,
	versionId,
	token,
) => {
	return await service.fetchPost(
		'/' +
			workspaceID +
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
	workspaceID,
) => {
	return await service.fetchPost(
		'/' +
			workspaceID +
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
export const generateWorkflow = async (json, workspaceID, workflowID) => {
	return await service.fetchPost(
		`/${workspaceID}/${workflowID}/generate-page-outline`,
		json,
		null,
		'generateTemplate',
	);
};
export const duplicateWorkflowServiceBlock = async (
	json,
	blockId,
	sectionID,
	workspaceID,
	moduleType,
	moduleId,
	versionId,
	token,
) => {
	return await service.fetchPost(
		'/' +
			workspaceID +
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

export const createLayout = async (workspaceID, json, token) => {
	return await service.fetchPost(
		'/' + workspaceID + API.Templates.layouts + '/',
		json,
		token,
		'proposal',
	);
};
export const addSubBlock = async (workspaceID, json, templateId, sectionID, blockID, token) => {
	return await service.fetchPost(
		'/' +
			workspaceID +
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
	workspaceID,
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
			workspaceID +
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
export const addLayout = async (workspaceID, json, templateId, token) => {
	return await service.fetchPost(
		'/' + workspaceID + API.Templates.url + '/' + templateId + API.Templates.layouts,
		json,
		token,
		'proposal',
	);
};
export const addSection = async (workspaceID, json, templateId, token) => {
	return await service.fetchPost(
		'/' + workspaceID + API.Templates.url + '/' + templateId + API.Templates.sections,
		json,
		token,
		'proposal',
	);
};

export const singleSectionEdit = async (workspaceID, json, templateId, sectionId, token) => {
	return await service.fetchPut(
		'/' +
			workspaceID +
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
	workspaceID,
	moduleType,
	moduleId,
	versionId,
	sectionId,
	token,
) => {
	return await service.fetchPut(
		'/' +
			workspaceID +
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
	workspaceID,
	moduleType,
	moduleId,
	versionId,
	token,
	isFluid,
) => {
	return await service.fetchPost(
		'/' +
			workspaceID +
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

export const addServiceTableBlock = async (workspaceID, json, sectionID, templateID, token) => {
	return await service.fetchPost(
		'/' +
			workspaceID +
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
	workspaceID,
	json,
	templateID,
	sectionID,
	blockID,
	token,
) => {
	return await service.fetchPost(
		'/' +
			workspaceID +
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
	workspaceID,
	moduleType,
	moduleId,
	versionId,
	sectionID,
	blockId,
	token,
) => {
	return await service.fetchPost(
		'/' +
			workspaceID +
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
	workspaceID,
	json,
	sectionID,
	moduleType,
	moduleId,
	versionId,
	token,
) => {
	return await service.fetchPost(
		'/' +
			workspaceID +
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
	workspaceID,
	moduleType,
	moduleId,
	versionId,
	sectionId,
	blockId,
	token,
) => {
	return await service.fetchPost(
		'/' +
			workspaceID +
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

export const deleteSection = async (templateID, sectionID, workspaceID, userToken) => {
	return await service.fetchDelete(
		'/' +
			workspaceID +
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
	workspaceID,
	moduleType,
	moduleId,
	versionId,
	token,
) => {
	return await service.fetchDelete(
		'/' +
			workspaceID +
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

export const deleteBlock = async (templateID, blockID, sectionID, workspaceID, userToken) => {
	return await service.fetchDelete(
		'/' +
			workspaceID +
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
	workspaceID,
	moduleType,
	moduleId,
	versionId,
	token,
) => {
	return await service.fetchDelete(
		'/' +
			workspaceID +
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
	workspaceID,
	userToken,
) => {
	return await service.fetchPut(
		'/' +
			workspaceID +
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

export const uploadImage = async (json, token, workspaceID, templateID) => {
	return await service.fetchPost(
		`/${workspaceID}/workspaceAssets/templates/${templateID}/images`,
		json,
		token,
		'images',
	);
};

export const uploadImageWorkflow = async (json, token, workspaceID, moduleType, moduleId) => {
	return await service.fetchPost(
		`/${workspaceID}/workspaceAssets-images${API.Templates.modules}/${moduleType}/${moduleId}/images`,
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

export const getInvoiceNumber = async (workspaceID, token) => {
	return await service.fetchGet(
		'/' + workspaceID + '/' + 'invoice-preferences',

		token,
		'tenant',
	);
};

export const putInvoiceNumber = async (invoiceNumber, workspaceID, token) => {
	return await service.fetchPut(
		'/' + workspaceID + '/' + 'invoice-preferences',
		{ invoicePreferences: invoiceNumber },
		token,
		'tenant',
	);
};
// actions for color picker

export const getBrandColors = async (workspaceID, token) => {
	return await service.fetchGet('/' + workspaceID + '/preferences', token, 'tenant');
};

export const putBrandColors = async (json, workspaceID, token) => {
	return await service.fetchPut(
		'/' + workspaceID + '/preferences',
		{ brandingThemes: json },
		token,
		'tenant',
	);
};
export const getWorkflowWithModules = async (workspaceID, token) => {
	// return await service.fetchGet(`/${workspaceID}/workflows/modules`, token, 'tenant');
	return await service.fetchGet(`/${workspaceID}/graphql`, token, 'tenant');
};

// Schedule Services

export const getAllSchedules = async (workspaceID, token) => {
	return await service.fetchGet(`/${workspaceID}/scheduler/all-sessions`, token, 'calendar');
};

export const getSessionDetails = async (workspaceID, token, sessionId) => {
	return await service.fetchGet(
		`/${workspaceID}/scheduler/session/${sessionId}`,
		token,
		'calendar',
	);
};
