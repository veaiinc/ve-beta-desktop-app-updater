import Cookies from 'js-cookie';

const environment = import.meta.env.VITE_APP_DEV_ENVIRONMENT ?? 'development';
const region = Cookies.get('region') ?? localStorage.getItem('region') ?? 'us-east-1';

const globalBaseUrls = {
	auth_Api: 'https://auth.ve.ai',
	chat_ws_api_US: 'wss://ai.us-east-1.ve.ai',
	guest_chat_ws_api_US: 'wss://guestsearch.us-east-1.ve.ai',
	meeting_ws_api_US: 'wss://recall.us-east-1.ve.ai',
	voice_agent_api_US: 'wss://ve-voice-agent-g4ptyv6v.livekit.cloud',
	browser_ws_api_US: 'wss://browser.us-east-1.ve.ai',
};

const regionBaseUrls = {
	'ap-south-1': {
		tenant_api:
			environment === 'production'
				? 'https://ap.api.ve.ai/tenants/1.0'
				: 'https://ap.api.ve.ai/tenants/1.0',
	},
	'us-east-1': {
		tenant_api:
			environment === 'production'
				? 'https://us.api.ve.ai/tenants/1.0'
				: 'https://us.api.ve.ai/tenants/1.0',
	},
};

const baseUrls = { ...globalBaseUrls, ...regionBaseUrls[region] };

export default baseUrls;
