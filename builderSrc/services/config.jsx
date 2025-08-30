import getBaseUrl from '../../src/services/baseUrls.js';

// Helper function to get base URL for AP South region
const getApSouthUrl = (type) => getBaseUrl({ type, region: 'ap-south-1' });

// Helper function to get base URL for US East region
const getUsEastUrl = (type) => getBaseUrl({ type, region: 'us-east-1' });

// Helper function to get global URL
const getGlobalUrl = (type) => getBaseUrl({ type });

//live config
export const proposal_api_server = getApSouthUrl('proposals_api');
export const images_api_server = getApSouthUrl('workspace_images_api');
export const graphql_server = getApSouthUrl('workflows_Api');
export const tenant_api_server = getApSouthUrl('tenant');
export const ai_assistant_api_server = getApSouthUrl('ai_predictions');
export const activity_api = getApSouthUrl('activity_api');
export const image_generation_api_server = getApSouthUrl('ai_predictions');
export const design_builder_api_server = getApSouthUrl('ai_predictions');
export const calendar_api = getApSouthUrl('calendar_api');
export const auth_Api = getGlobalUrl('auth');
export const generate_template_api_server = getApSouthUrl('ai_predictions');
export const ai_assistant_api = getApSouthUrl('ai_assistant_api');
export const chat_ws_api = getApSouthUrl('chat_ws_api');
export const guest_chat_ws_api = getApSouthUrl('guest_chat_ws_api');

// Outside IN (US)
export const proposal_api_server_US = getUsEastUrl('proposals_api');
export const images_api_server_US = getUsEastUrl('workspace_images_api');
export const graphql_server_US = getUsEastUrl('workflows_Api');
export const tenant_api_server_US = getUsEastUrl('tenant');
export const ai_assistant_api_server_US = getUsEastUrl('ai_predictions');
export const image_generation_api_server_US = getUsEastUrl('ai_predictions');
export const design_builder_api_server_US = getUsEastUrl('ai_predictions');
export const generate_template_api_server_US = getUsEastUrl('ai_predictions');
export const calendar_api_US = getUsEastUrl('calendar_api');
export const ai_assistant_api_US = getUsEastUrl('ai_assistant_api');
export const activity_api_US = getUsEastUrl('activity_api');
export const chat_ws_api_US = getUsEastUrl('chat_ws_api');
export const guest_chat_ws_api_US = getUsEastUrl('guest_chat_ws_api');
