import NotificationSvg from '../../../assets/svg/sidebar/notification.svg?react';
import SearchIcon from '../../../assets/svg/sidebar/searchIcon.svg?react';
import GiftSvg from '../../../assets/svg/sidebar/GiftSvg.jsx';
import FilesSvg from '../../../assets/svg/sidebar/filesIcon.svg?react';
import AgentsSvg from '../../../assets/svg/sidebar/agentsIcon.svg?react';
import HomeSvg from '../../../assets/svg/sidebar/HomeSvg.jsx';
import TemplatesSvg from '../../../assets/svg/sidebar/TemplatesSvg.jsx';
import HelpSvg from '../../../assets/svg/sidebar/help.svg?react';
import ProfileIcon from '../../../assets/svg/sidebar/profileIcon.svg?react';
import WorkspaceIcon from '../../../assets/svg/sidebar/workspaceIcon.svg?react';
import TeamIcon from '../../../assets/svg/sidebar/teamMembersIcon.svg?react';
import IntegrationsIcon from '../../../assets/svg/sidebar/integrationsIcon.svg?react';
import PlanBillingIcon from '../../../assets/svg/sidebar/planBilling.svg?react';
import NotesIcon from '../../../assets/svg/sidebar/notes-icon.svg?react';

export const photographerModules = [
	{
		id: 0,
		name: 'Home',
		moduleRoute: '/home',
		route: '/home',
		icon: '',
	},
	// {
	// 	id: 3,
	// 	name: 'Search',
	// 	moduleRoute: '/search',
	// 	route: '/search',
	// 	icon: '',
	// },
	// {
	// 	id: 2,
	// 	name: 'Conversational Agent',
	// 	moduleRoute: '/ai-assistant',
	// 	route: '/ai-assistant',
	// 	icon: '',
	// },
	{ id: 1, name: 'Files', route: '/files' },
	{
		id: 2,
		name: 'Notes',
		moduleRoute: '/notes',
		route: '/notes',
		icon: '',
	},
	{
		id: 3,
		name: 'Agents',
		moduleRoute: '/knowledge-agent',
		route: '/knowledge-agent',
		icon: '',
	},
	{
		id: 4,
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
	// { id: 4, name: 'Tasks', moduleRoute: '/tasks', route: '/tasks', icon: '' },
	// { id: 5, name: 'Contacts', moduleRoute: '/contacts', route: '/contacts', icon: '' },
	// {
	// 	id: 6,
	// 	name: 'Calendar',
	// 	moduleRoute: '/calendar',
	// 	route: '/calendar',
	// 	icon: '',
	// },
	// {
	// 	id: 7,
	// 	name: 'Automations',
	// 	moduleRoute: '/automations',
	// 	route: '/automations',
	// 	icon: '',
	// },
	// {
	// 	id: 9,
	// 	name: 'Storage',
	// 	moduleRoute: '',
	// 	route: '',
	// 	icon: '',
	// 	subModules: [
	// 		{
	// 			id: 0,
	// 			name: 'Classic Gallery',
	// 			moduleRoute: '/galleries',
	// 			route: '/galleries',
	// 			icon: '',
	// 		},
	// 		{
	// 			id: 1,
	// 			name: 'Lite Gallery',
	// 			moduleRoute: '/lite-gallery',
	// 			route: '/lite-gallery',
	// 			icon: '',
	// 		},
	// 	],
	// },
];

export const veAiModulesItemsList = [
	{ id: 0, name: 'Home', route: '/home', icon: HomeSvg },
	{ id: 1, name: 'Files', route: '/files', icon: FilesSvg },
	// { id: 2, name: 'Search', route: '/search', icon: SearchIcon },
	{ id: 2, name: 'Agents', route: '/knowledge-agent', icon: AgentsSvg },
	{
		id: 3,
		name: 'Notes',
		route: '/notes',
		icon: NotesIcon,
	},
];

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
	},
	workspace: {
		width: '230px',
		borderRadius: '14px',
		minHeight: '20vh',
		height: 'fit-content',
	},
};

export const SETTINGS_OPTIONS = {
	admin: [
		{ name: 'My Profile', route: '/settings/my-profile', icon: FilesSvg },
		{ name: 'Workspace', route: '/settings/workspace', icon: WorkspaceIcon },
		{ name: 'Team Members', route: '/settings/team-members', icon: TeamIcon },
		{ name: 'Integrations', route: '/settings/integrations', icon: IntegrationsIcon },
		{ name: 'Plan Billing', route: '/settings/plan-billing', icon: PlanBillingIcon },
		{ name: 'AI Setup', route: '/settings/ai-setup', icon: AgentsSvg },
	],
	user: [
		{ name: 'My Profile', route: '/settings/my-profile', icon: ProfileIcon },
		{ name: 'Integration', route: '/settings/integrations', icon: IntegrationsIcon },
		{ name: 'AI Setup', route: '/settings/ai-setup', icon: AgentsSvg },
	],
};
