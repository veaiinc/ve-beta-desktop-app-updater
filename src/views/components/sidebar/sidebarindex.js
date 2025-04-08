// import { ReactComponent as VELogo } from '../../../assets/svg/ve.svg';

import CalendarSvg from '../../../assets/svg/sidebar/CalendarSvg.jsx';
import { ReactComponent as NotificationSvg } from '../../../assets/svg/sidebar/notification.svg';
import GiftSvg from '../../../assets/svg/sidebar/GiftSvg.jsx';
import SettingsSvg from '../../../assets/svg/sidebar/SettingsSvg.jsx';
import { ReactComponent as FilesSvg } from '../../../assets/svg/sidebar/filesIcon.svg';
import { ReactComponent as SearchSvg } from '../../../assets/svg/sidebar/searchIcon.svg';
import { ReactComponent as AgentsSvg } from '../../../assets/svg/sidebar/agentsIcon.svg';
import HomeSvg from '../../../assets/svg/sidebar/HomeSvg.jsx';
import { ReactComponent as OrchestratorSvg } from '../../../assets/svg/sidebar/Orchestrator.svg';
import TemplatesSvg from '../../../assets/svg/sidebar/TemplatesSvg.jsx';
import { ReactComponent as HelpSvg } from '../../../assets/svg/sidebar/help.svg';

export const veAiModulesItemsList = [
	{
		id: 0,
		name: 'Home',
		moduleRoute: '/home',
		route: '/home',
		icon: '',
	},
	{
		id: 1,
		name: 'Conversational Agent',
		moduleRoute: '/ai-assistant',
		route: '/ai-assistant',
		icon: '',
	},
	{
		id: 2,
		name: 'Design Builder',
		moduleRoute: '/',
		route: null,
		icon: '',
		subModules: [
			{ id: 0, icon: '', name: 'Documents', route: '/docs' },
			{ id: 1, icon: '', name: 'My Templates', route: '/my-templates' },
			{ id: 2, icon: '', name: 'Forms', route: '/form' },
		],
	},
	{ id: 3, name: 'Tasks', moduleRoute: '/tasks', route: '/tasks', icon: '' },
	{ id: 4, name: 'Contacts', moduleRoute: '/contacts', route: '/contacts', icon: '' },
	{
		id: 5,
		name: 'Calendar',
		moduleRoute: '/calendar',
		route: '/calendar',
		icon: '',
	},
	{
		id: 6,
		name: 'Automations',
		moduleRoute: '/automations',
		route: '/automations',
		icon: '',
	},
	{
		id: 7,
		name: 'Notes',
		moduleRoute: '/notes',
		route: null,
		icon: '',
	},
	{
		id: 8,
		name: 'Storage',
		moduleRoute: '',
		route: '',
		icon: '',
		subModules: [
			{
				id: 0,
				name: 'Classic Gallery',
				moduleRoute: '/galleries',
				route: '/galleries',
				icon: '',
			},
			{
				id: 1,
				name: 'Lite Gallery',
				moduleRoute: '/lite-gallery',
				route: '/lite-gallery',
				icon: '',
			},
		],
	},
];

export const veAiNewModules = [
	{ id: 0, name: 'Home', route: '/home', icon: HomeSvg },
	{ id: 1, name: 'Files', route: '/files', icon: FilesSvg },
	{ id: 2, name: 'Search', route: '/search', icon: SearchSvg },
	{ id: 3, name: 'Agents', route: '/agents', icon: AgentsSvg },
];

//

export const veAiModules = [
	// { icon: OrchestratorSvg, name: 'Chats', route: null },
	// { icon: NotificationSvg, name: 'Trash', route: '/trash' },
	{ id: 1, icon: TemplatesSvg, name: 'Templates', route: '/playbook' },
	{ id: 2, icon: NotificationSvg, name: 'Notifications', route: null },
	{ id: 3, icon: GiftSvg, name: 'Share and Earn', route: '/share-and-earn' },
	{ id: 4, icon: HelpSvg, name: 'Help' },
];

export const styles = {
	open: {
		width: '230px',
		borderRadius: '14px',
	},
	close: {
		width: '56px',
		borderRadius: '100px',
	},
	workspace: {
		width: '230px',
		borderRadius: '14px',
		minHeight: '20vh',
		height: 'fit-content',
	},
};
