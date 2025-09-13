const environment = import.meta.env.VITE_APP_DEV_ENVIRONMENT ?? 'development';

const globalTypes = ['auth', 'slack_api'];

const globalBaseUrls = {
	// Auth
	auth: environment === 'production' ? 'https://auth.ve.ai' : 'https://us.api.ve.ai/auth/dev',

	// Slack
	slack_api: 'https://slack.com/api',
};

const regionBaseUrls = {
	'ap-south-1': {
		tenant:
			environment === 'production'
				? 'https://ap.api.ve.ai/tenants/1.0'
				: 'https://api.ve.co/tenants/dev',
		'tenant-users':
			environment === 'production'
				? 'https://ap.api.ve.ai/tenant-users/1.0'
				: 'https://ap.api.ve.ai/tenant-users/1.0',
		tenant_users_api:
			environment === 'production'
				? 'https://ap.api.ve.ai/tenant-users/1.0'
				: 'https://ap.api.ve.ai/tenant-users/1.0',
		ve_conversations_api:
			environment === 'production'
				? 'https://api.ve.co/ve-conversations/1.0'
				: 'https://api.ve.co/ve-conversations/1.0',
		proposals_api:
			environment === 'production'
				? 'https://ap.api.ve.ai/proposals/1.0'
				: 'https://ap.api.ve.ai/proposals/1.0',
		workflows_Api:
			environment === 'production'
				? 'https://ap.api.ve.ai/workflows/1.0'
				: 'https://ap.api.ve.ai/workflows/1.0',
		workflow:
			environment === 'production'
				? 'https://ap.api.ve.ai/workflows/1.0'
				: 'https://ap.api.ve.ai/workflows/1.0',
		activity_api:
			environment === 'production'
				? 'https://ap.api.ve.ai/workflow-user-analytics/1.0'
				: 'https://ap.api.ve.ai/workflow-user-analytics/1.0',
		galleries:
			environment === 'production'
				? 'https://ap.api.ve.ai/galleries/1.0'
				: 'https://ap.api.ve.ai/galleries/1.0',
		ai_assistant_api:
			environment === 'production'
				? 'https://ap.api.ve.ai/agents/1.0'
				: 'https://ap.api.ve.ai/agents/1.0',
		ai_predictions:
			environment === 'production'
				? 'https://ai.ap-south-1.ve.ai'
				: 'https://ai.ap-south-1.ve.ai',
		calendar_chat:
			environment === 'production'
				? 'https://ai.ap-south-1.ve.ai'
				: 'https://ai.ap-south-1.ve.ai',
		calendar_api:
			environment === 'production'
				? 'https://ap.api.ve.ai/google/1.0'
				: 'https://ap.api.ve.ai/google/1.0',
		third_party_integrations_api:
			environment === 'production'
				? 'https://ap.api.ve.ai/third-party-integrations/1.0'
				: 'https://ap.api.ve.ai/third-party-integrations/1.0',
		automation_builder_api:
			environment === 'production'
				? 'https://ap.api.ve.ai/automations/1.0/automation'
				: 'https://ap.api.ve.ai/automations/1.0/automation',
		page_notes_api:
			environment === 'production'
				? 'https://ap.api.ve.ai/block-notes/1.0'
				: 'https://ap.api.ve.ai/block-notes/1.0',
		page_notes_api_database:
			environment === 'production'
				? 'https://ap.api.ve.ai/page-notes/1.0'
				: 'https://ap.api.ve.ai/page-notes/1.0',
		meeting_api:
			environment === 'production'
				? 'https://ap.api.ve.ai/meeting/1.0'
				: 'https://ap.api.ve.ai/meeting/1.0',
		elastic_search_api:
			environment === 'production'
				? 'https://ap.api.ve.ai/elastic-search/1.0'
				: 'https://ap.api.ve.ai/elastic-search/1.0',
		workspace_images_api:
			environment === 'production'
				? 'https://ap.api.ve.ai/images/1.0/'
				: 'https://ap.api.ve.ai/images/1.0/',
		custom_domain_api:
			environment === 'production'
				? 'https://ap.api.ve.ai/custom-domain/1.0'
				: 'https://ap.api.ve.ai/custom-domain/1.0',
		browser_api:
			environment === 'production'
				? 'https://browser.ap-south-1.ve.ai'
				: 'https://browser.ap-south-1.ve.ai',
		microsoft_integration_api:
			environment === 'production'
				? 'https://ap.api.ve.ai/microsoft-integration/1.0'
				: 'https://ap.api.ve.ai/microsoft-integration/1.0',
		meeting_summary_api:
			environment === 'production'
				? 'https://live.ap-south-1.ve.ai'
				: 'https://live.ap-south-1.ve.ai',
		chat_ws_api:
			environment === 'production'
				? 'wss://ai.ap-south-1.ve.ai'
				: 'wss://ai.ap-south-1.ve.ai',
		guest_chat_ws_api:
			environment === 'production'
				? 'wss://guestsearch.ap-south-1.ve.ai'
				: 'wss://guestsearch.ap-south-1.ve.ai',
	},

	'us-east-1': {
		tenant:
			environment === 'production'
				? 'https://us.api.ve.ai/tenants/1.0'
				: 'https://api.ve.co/tenants/dev',
		'tenant-users':
			environment === 'production'
				? 'https://us.api.ve.ai/tenant-users/1.0'
				: 'https://us.api.ve.ai/tenant-users/1.0',
		tenant_users_api:
			environment === 'production'
				? 'https://us.api.ve.ai/tenant-users/1.0'
				: 'https://us.api.ve.ai/tenant-users/1.0',
		ve_conversations_api:
			environment === 'production'
				? 'https://us.api.ve.ai/ve-conversations/1.0'
				: 'https://us.api.ve.ai/ve-conversations/1.0',
		proposals_api:
			environment === 'production'
				? 'https://us.api.ve.ai/proposals/1.0'
				: 'https://us.api.ve.ai/proposals/1.0',
		workflows_Api:
			environment === 'production'
				? 'https://us.api.ve.ai/workflows/1.0'
				: 'https://us.api.ve.ai/workflows/1.0',
		workflow:
			environment === 'production'
				? 'https://us.api.ve.ai/workflows/1.0'
				: 'https://us.api.ve.ai/workflows/1.0',
		ai_assistant_api:
			environment === 'production'
				? 'https://us.api.ve.ai/agents/1.0'
				: 'https://us.api.ve.ai/agents/1.0',
		activity_api:
			environment === 'production'
				? 'https://us.api.ve.ai/workflow-user-analytics/1.0'
				: 'https://us.api.ve.ai/workflow-user-analytics/1.0',
		galleries:
			environment === 'production'
				? 'https://us.api.ve.ai/galleries/1.0'
				: 'https://us.api.ve.ai/galleries/1.0',
		ai_predictions:
			environment === 'production'
				? 'https://ai.us-east-1.ve.ai'
				: 'https://ai.us-east-1.ve.ai',
		calendar_chat:
			environment === 'production'
				? 'https://ai.us-east-1.ve.ai'
				: 'https://ai.us-east-1.ve.ai',
		calendar_api:
			environment === 'production'
				? 'https://us.api.ve.ai/google/1.0'
				: 'https://us.api.ve.ai/google/1.0',
		third_party_integrations_api:
			environment === 'production'
				? 'https://us.api.ve.ai/third-party-integrations/1.0'
				: 'https://us.api.ve.ai/third-party-integrations/1.0',
		automation_builder_api:
			environment === 'production'
				? 'https://us.api.ve.ai/automations/1.0/automation'
				: 'https://us.api.ve.ai/automations/1.0/automation',
		automations_api:
			environment === 'production'
				? 'https://us.api.ve.ai/automations/1.0/automation'
				: 'https://us.api.ve.ai/automations/1.0/automation',
		page_notes_api:
			environment === 'production'
				? 'https://us.api.ve.ai/block-notes/1.0'
				: 'https://us.api.ve.ai/block-notes/1.0',
		meeting_api:
			environment === 'production'
				? 'https://us.api.ve.ai/meeting/1.0'
				: 'https://us.api.ve.ai/meeting/1.0',
		page_notes_api_database:
			environment === 'production'
				? 'https://us.api.ve.ai/page-notes/1.0'
				: 'https://us.api.ve.ai/page-notes/1.0',
		elastic_search_api:
			environment === 'production'
				? 'https://ap.api.ve.ai/elastic-search/1.0'
				: 'https://ap.api.ve.ai/elastic-search/1.0',
		workspace_images_api:
			environment === 'production'
				? 'https://us.api.ve.ai/images/1.0/'
				: 'https://us.api.ve.ai/images/1.0/',
		custom_domain_api:
			environment === 'production'
				? 'https://us.api.ve.ai/custom-domain/1.0'
				: 'https://us.api.ve.ai/custom-domain/1.0',
		browser_api:
			environment === 'production'
				? 'https://browser.us-east-1.ve.ai'
				: 'https://browser.us-east-1.ve.ai',
		microsoft_integration_api:
			environment === 'production'
				? 'https://us.api.ve.ai/microsoft-integration/1.0'
				: 'https://us.api.ve.ai/microsoft-integration/1.0',
		meeting_summary_api:
			environment === 'production'
				? 'https://live.us-east-1.ve.ai'
				: 'https://live-dev.us-east-1.ve.ai',
		chat_ws_api:
			environment === 'production'
				? 'wss://ai.us-east-1.ve.ai'
				: 'wss://ai-dev.us-east-1.ve.ai',
		guest_chat_ws_api:
			environment === 'production'
				? 'wss://guestsearch.us-east-1.ve.ai'
				: 'wss://guestsearch.us-east-1.ve.ai',
		meeting_ws_api:
			environment === 'production'
				? 'wss://recall.us-east-1.ve.ai/frontend/ws'
				: 'wss://recall-dev.us-east-1.ve.ai/frontend/ws',
		voice_agent_api: 'wss://ve-ai-voice-agent-9yzwlzsg.livekit.cloud/',
		browser_ws_api: 'wss://browser.us-east-1.ve.ai', // Browser Agent
		generate_voice_agent_token_api: 'https://voice.us-east-1.ve.ai',
	},
};

// region is only mandatory for region based urls
const getBaseUrl = ({ type, region = 'us-east-1' }) => {
	const baseUrlMapper = {
		global: globalBaseUrls[type] ?? null,
		region: regionBaseUrls[region]?.[type] ?? null,
	};

	const baseUrlType = globalTypes.includes(type) ? 'global' : 'region';
	const baseUrl = baseUrlMapper[baseUrlType];

	return baseUrl;
};

export { globalBaseUrls, regionBaseUrls };
export default getBaseUrl;
