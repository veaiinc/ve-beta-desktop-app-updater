import { ReactComponent as VELogo } from '../../../assets/svg/ve.svg';

import CalendarSvg from '../../../assets/svg/sidebar/CalendarSvg.jsx';
import LayoutSvg from '../../../assets/svg/sidebar/LayoutSvg.jsx';
import AtSignSvg from '../../../assets/svg/sidebar/AtSignSvg.jsx';
import AttachMoneySvg from '../../../assets/svg/sidebar/AttachMoneySvg.jsx';
import FinanceSvg from '../../../assets/svg/sidebar/FinanceSvg.jsx';
import MailOutlineSvg from '../../../assets/svg/sidebar/MailOutlineSvg.jsx';
import InsertLinkSvg from '../../../assets/svg/sidebar/InsertLinkSvg.jsx';
import BookSvg from '../../../assets/svg/sidebar/BookSvg.jsx';
import FlowArrowSvg from '../../../assets/svg/sidebar/FlowArrowSvg.jsx';
import PlusSvg from '../../../assets/svg/sidebar/PlusSvg.jsx';
import AppartmentHomeSvg from '../../../assets/svg/sidebar/AppartmentHomeSvg.jsx';
import { ReactComponent as CrownSvg } from '../../../assets/svg/sidebar/Crown.svg';
import SquareFour from '../../../assets/svg/sidebar/SquareFour.jsx';
import GiftSvg from '../../../assets/svg/sidebar/GiftSvg.jsx';
import SettingsSvg from '../../../assets/svg/sidebar/SettingsSvg.jsx';
import { ReactComponent as GallerySvg } from '../../../assets/svg/sidebar/Gallery.svg';
import { ReactComponent as TaskSvg } from '../../../assets/svg/sidebar/Task.svg';
import { ReactComponent as AIAssistantSvg } from '../../../assets/svg/sidebar/AiAssistant.svg';
import { ReactComponent as PlaybookSvg } from '../../../assets/svg/sidebar/Playbook.svg';
import SchedulerSvg from '../../../assets/svg/sidebar/SchedulerSvg.jsx';
import { ReactComponent as LogoutRedSvg } from '../../../assets/svg/sidebar/logout_red.svg';
import { ReactComponent as DownArrowSmallSvg } from '../../../assets/svg/sidebar/downarrowsmall.svg';
import { ReactComponent as CircletickwhiteSvg } from '../../../assets/svg/sidebar/circletickwhite.svg';
import { ReactComponent as ArrowLeftSvg } from '../../../assets/svg/sidebar/leftarrowwhite.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import TranscriptSvg from '../../../assets/svg/sidebar/TranscriptSvg.jsx';
import AddCalenderSvg from '../../../assets/svg/sidebar/AddCalenderSvg';
import { fill } from 'lodash';

export const veAiModulesItemsList = [
	{ name: 'Calendar', moduleRoute: '/calendar', route: null, icon: CalendarSvg },
	{ name: 'Gallery', moduleRoute: '/galleries', route: '/galleries', icon: GallerySvg },
	{ name: 'Tasks', moduleRoute: '/tasks', route: '/tasks', icon: TaskSvg },
	{
		name: 'AI Assistant',
		moduleRoute: '/ai-assistant',
		route: '/ai-assistant',
		icon: AIAssistantSvg,
	},
	{
		name: 'Playbook',
		moduleRoute: '/playbook',
		route: '/playbook',
		icon: PlaybookSvg,
	},
	// { name: 'Workflow', moduleRoute: '/workflows', route: '/sales/workflows', icon: FlowArrowSvg },
	// {
	//  name: 'Linkin Bio',
	//  moduleRoute: '/linkin-bio',
	//  route: null,
	//  icon: InsertLinkSvg,
	//  initialColor: '#7D7D7D',
	// },

	// { name: 'Inbox', moduleRoute: '/inbox', route: null, icon: MailOutlineSvg },
	// { name: 'Clients', moduleRoute: '/clients', route: null, icon: LayoutSvg },
	// { name: 'Finance', moduleRoute: '/finance', route: null, icon: AttachMoneySvg },
	// { name: 'Email', moduleRoute: '/email', route: null, icon: AtSignSvg },
	// { name: 'HR', moduleRoute: '/hr', route: null, icon: FinanceSvg },
	// { name: 'Inventory', moduleRoute: '/inventory', route: null, icon: LayoutSvg },
	// { name: 'Team', moduleRoute: '/team', route: null, icon: LayoutSvg },
];

export const veAiSubModulesItemsList = [
	{ name: 'Scheduler', moduleRoute: '', route: null, icon: SchedulerSvg },
	{ name: 'Transcript', moduleRoute: '', route: null, icon: TranscriptSvg },
	{ name: 'Settings', moduleRoute: '', route: null, icon: SettingsSvg },
];

export const bottomOptionsList = [
	// { name: 'Upgrade', moduleRoute: '/upgrade', route: null, icon: CrownSvg },
	// { name: 'Playbook', moduleRoute: '/playbook', route: '/playbook', icon: BookSvg },
	// {
	//  name: 'App store',
	//  moduleRoute: '/app-store',
	//  route: null,
	//  icon: SquareFour,
	//  initialColor: '#7D7D7D',
	// },
	{
		name: 'Share and Earn',
		moduleRoute: '',
		route: '/share-and-earn',
		icon: GiftSvg,
	},
	{
		name: 'Settings',
		moduleRoute: '/settings',
		route: '/settings/my-profile',
		icon: SettingsSvg,
	},
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
	// { label: 'Smart File' },
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
