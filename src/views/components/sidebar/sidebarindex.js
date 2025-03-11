// import { ReactComponent as VELogo } from '../../../assets/svg/ve.svg';

import CalendarSvg from '../../../assets/svg/sidebar/CalendarSvg.jsx';
import { ReactComponent as NotificationSvg } from '../../../assets/svg/sidebar/notification.svg';

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
import { ReactComponent as GallerySvg } from '../../../assets/svg/sidebar/Gallery.svg';
import TaskSvg from '../../../assets/svg/sidebar/TaskSvg.jsx';
import { ReactComponent as AIAssistantSvg } from '../../../assets/svg/sidebar/AiAssistant.svg';
import { ReactComponent as PlaybookSvg } from '../../../assets/svg/sidebar/Playbook.svg';
import SchedulerSvg from '../../../assets/svg/sidebar/SchedulerSvg.jsx';
import TranscriptSvg from '../../../assets/svg/sidebar/TranscriptSvg.jsx';
import AddCalenderSvg from '../../../assets/svg/sidebar/AddCalenderSvg';
import HomeSvg from '../../../assets/svg/sidebar/HomeSvg.jsx';
import { ReactComponent as OrchestratorSvg } from '../../../assets/svg/sidebar/Orchestrator.svg';
import TemplatesSvg from '../../../assets/svg/sidebar/TemplatesSvg.jsx';
import DaVinci from '../../../assets/images/Da Vinci.jpeg';
import Jarvis from '../../../assets/images/Jarvis.jpeg';
import Ari from '../../../assets/images/Ari.jpeg';
import DaVinciJobsSvg from '../../../assets/svg/sidebar/DaVinciJobsSvg.jsx';
import DaVinciSetupSvg from '../../../assets/svg/sidebar/DaVinciSetupSvg.jsx';
// import { subDays } from 'react-datepicker/dist/date_utils.js';

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
			{ id: 2, icon: '', name: 'Forms', route: '/forms' },
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
	// {
	// 	id: 8,
	// 	name: 'Notes',
	// 	moduleRoute: '/notes',
	// 	route: null,
	// 	icon: '',
	// },
];

//

export const veAiModules = [
	{ icon: OrchestratorSvg, name: 'Chats', route: null },
	{ icon: NotificationSvg, name: 'Notifications', route: null },
	// { icon: NotificationSvg, name: 'Trash', route: '/trash' },
	{ id: 1, icon: GiftSvg, name: 'Share and Earn', route: '/share-and-earn' },
	{ id: 2, icon: TemplatesSvg, name: 'Templates', route: '/playbook' },
	{
		id: 3,
		icon: SettingsSvg,
		name: 'Settings',
		route: '/settings/my-profile',
		// subModules: [
		// 	{ icon: '', name: 'MyProfile', route: '/settings/my-profile' },
		// 	{ icon: '', name: 'Workspace', route: '/settings/workspace' },
		// 	{ icon: '', name: 'Public Information', route: '/settings/public-information' },
		// 	{
		// 		icon: '',
		// 		name: 'Brand Setup',
		// 		route: '/settings/brand-setup',
		// 	},
		// 	{ icon: '', name: 'Team Settings', route: '/settings/team-settings' },
		// 	{ icon: '', name: 'Integration', route: '/settings/integrations' },
		// 	{ icon: '', name: 'Plan Billing', route: '/settings/plan-billing' },
		// ],
	},
];

export const bottomOptionsList = [
	// {
	// 	name: 'Share and Earn',
	// 	moduleRoute: '',
	// 	route: '/share-and-earn',
	// 	icon: GiftSvg,
	// },
	// {
	// 	name: 'Settings',
	// 	moduleRoute: '/settings',
	// 	route: '/settings/my-profile',
	// 	icon: SettingsSvg,
	// },
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

export const newBtnActions = [
	{ label: 'Lead', action: 'functionCall', funcName: 'openLeadPopup', redirect: null },
	{ label: 'Workflow', action: 'redirect', funcName: null, redirect: '/playbook' },
];

export const closedSidebarIcons = [
	{ icon: CalendarSvg, route: '', name: 'Calendar' },
	{ icon: AddCalenderSvg, route: '', name: 'Scheduler' },
	{ icon: TranscriptSvg, route: '', name: 'Transcript' },
	{
		icon: SettingsSvg,
		route: '/settings/my-profile',
		fill: 'white',
		name: 'Settings',
	},
];

export const AiOptions = [
	{
		icon: '',
		name: 'Da Vinci',
		route: '/ai-agents/home/da-vinci',
		image: DaVinci,
		subModules: [
			{
				icon: TaskSvg,
				route: '/ai-agents/home/da-vinici',
				name: 'Home',
				description: 'Da Vinci',
			},
			{
				icon: DaVinciJobsSvg,
				route: '/ai-agents/jobs/:agent-name',
				name: 'Jobs',
				description: 'Da Vinci',
			},
			{
				icon: DaVinciSetupSvg,
				route: '/ai-agents/setup/da-vinici',
				name: 'Setup',
				description: 'Da Vinci',
			},
		],
	},
	{ icon: '', name: 'Jarvis', route: '/jarvis', image: Jarvis },
	{ icon: '', name: 'Ari', route: '/ari', image: Ari },
];
