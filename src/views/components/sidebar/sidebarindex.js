// import { ReactComponent as VELogo } from '../../../assets/svg/ve.svg';

import CalendarSvg from '../../../assets/svg/sidebar/CalendarSvg.jsx';
import { ReactComponent as NotificationSvg } from '../../../assets/svg/sidebar/notification.svg';
import { ReactComponent as SearchIcon } from '../../../assets/svg/sidebar/elastic_search/search-icon.svg';

// import LayoutSvg from '../../../assets/svg/sidebar/LayoutSvg.jsx';
// import AtSignSvg from '../../../assets/svg/sidebar/AtSignSvg.jsx';
// import AttachMoneySvg from '../../../assets/svg/sidebar/AttachMoneySvg.jsx';
// import FinanceSvg from '../../../assets/svg/sidebar/FinanceSvg.jsx';
// import MailOutlineSvg from '../../../assets/svg/sidebar/MailOutlineSvg.jsx';
// import InsertLinkSvg from '../../../assets/svg/sidebar/InsertLinkSvg.jsx';
// import BookSvg from '../../../assets/svg/sidebar/BookSvg.jsx';
// import FlowArrowSvg from '../../../assets/svg/sidebar/FlowArrowSvg.jsx';
// import PlusSvg from '../../../assets/svg/sidebar/PlusSvg.jsx';
// import AppartmentHomeSvg from '../../../assets/svg/sidebar/AppartmentHomeSvg.jsx';
// import { ReactComponent as CrownSvg } from '../../../assets/svg/sidebar/Crown.svg';
// import SquareFour from '../../../assets/svg/sidebar/SquareFour.jsx';
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
		name: 'Agents',
		moduleRoute: '/knowledge-agent',
		route: '/knowledge-agent',
		icon: '',
	},
	{
		id: 3,
		name: 'Search',
		moduleRoute: '/search',
		route: '/search',
		icon: SearchIcon,
	},
	{
		id: 2,
		name: 'Conversational Agent',
		moduleRoute: '/ai-assistant',
		route: '/ai-assistant',
		icon: '',
	},
	{
		id: 3,
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
	{ id: 4, name: 'Tasks', moduleRoute: '/tasks', route: '/tasks', icon: '' },
	{ id: 5, name: 'Contacts', moduleRoute: '/contacts', route: '/contacts', icon: '' },
	{
		id: 6,
		name: 'Calendar',
		moduleRoute: '/calendar',
		route: '/calendar',
		icon: '',
	},
	{
		id: 7,
		name: 'Automations',
		moduleRoute: '/automations',
		route: '/automations',
		icon: '',
	},
	{
		id: 8,
		name: 'Notes',
		moduleRoute: '/notes',
		route: null,
		icon: '',
	},
	{
		id: 9,
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
