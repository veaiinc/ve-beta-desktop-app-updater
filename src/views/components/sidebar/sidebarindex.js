import { ReactComponent as NotificationSvg } from '../../../assets/svg/sidebar/notification.svg';
import { ReactComponent as SearchIcon } from '../../../assets/svg/sidebar/searchIcon.svg';
import GiftSvg from '../../../assets/svg/sidebar/GiftSvg.jsx';
import { ReactComponent as FilesSvg } from '../../../assets/svg/sidebar/filesIcon.svg';
import { ReactComponent as AgentsSvg } from '../../../assets/svg/sidebar/agentsIcon.svg';
import HomeSvg from '../../../assets/svg/sidebar/HomeSvg.jsx';
import ChatSvg from '../../../assets/svg/sidebar/NewChat.jsx';
import TemplatesSvg from '../../../assets/svg/sidebar/TemplatesSvg.jsx';
import { ReactComponent as HelpSvg } from '../../../assets/svg/sidebar/help.svg';
import { ReactComponent as ProfileIcon } from '../../../assets/svg/sidebar/profileIcon.svg';
import { ReactComponent as WorkspaceIcon } from '../../../assets/svg/sidebar/workspaceIcon.svg';
import { ReactComponent as TeamIcon } from '../../../assets/svg/sidebar/teamMembersIcon.svg';
import { ReactComponent as IntegrationsIcon } from '../../../assets/svg/sidebar/integrationsIcon.svg';
import { ReactComponent as PlanBillingIcon } from '../../../assets/svg/sidebar/planBilling.svg';
import { ReactComponent as NotesIcon } from '../../../assets/svg/sidebar/notes-icon.svg';
import { ReactComponent as PricingIcon } from '../../../assets/svg/sidebar/planBilling.svg';

export const veAiModulesItemsList = [
	{
		id: 0,
		name: 'New Chat',
		moduleRoute: null,
		route: 'New Chat',
		icon: ChatSvg,
	},
	{
		id: 1,
		name: 'Home',
		moduleRoute: '/home',
		route: '/home',
		icon: HomeSvg,
	},
	{ id: 2, name: 'Agents', route: '/agents', icon: AgentsSvg },
	{
		id: 3,
		name: 'Notes',
		route: '/notes',
		icon: NotesIcon,
	},
	{ id: 4, name: 'Files', route: '/files', icon: FilesSvg },
];

export const veAiModules = [
	{ id: 1, icon: TemplatesSvg, name: 'Templates', route: '/playbook' },
	{ id: 2, icon: NotificationSvg, name: 'Notifications', route: null },
	{ id: 3, icon: GiftSvg, name: 'Share and Earn', route: '/share-and-earn' },
	{ id: 4, icon: HelpSvg, name: 'Help' },
];

export const SETTINGS_OPTIONS = {
	admin: [
		{ name: 'My Profile', route: '/settings/my-profile', icon: FilesSvg },
		{ name: 'Workspace', route: '/settings/workspace', icon: WorkspaceIcon },
		{ name: 'Team Members', route: '/settings/team-members', icon: TeamIcon },
		{ name: 'Integrations', route: '/settings/integrations', icon: IntegrationsIcon },
		{ name: 'Plan Billing', route: '/settings/plan-billing', icon: PlanBillingIcon },
		// { name: 'Pricing', route: '/settings/pricing', icon: PricingIcon },
		{ name: 'AI Setup', route: '/settings/ai-setup', icon: AgentsSvg },
	],
	user: [
		{ name: 'My Profile', route: '/settings/my-profile', icon: ProfileIcon },
		{ name: 'Integration', route: '/settings/integrations', icon: IntegrationsIcon },
		{ name: 'AI Setup', route: '/settings/ai-setup', icon: AgentsSvg },
	],
};
