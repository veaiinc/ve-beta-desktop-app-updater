import { ReactComponent as VELogo } from '../../../assets/svg/ve.svg';
// import { ReactComponent as ProfileCircleSVG } from '../../assets/svg/linkin_bio/profile_circle.svg';
// import { ReactComponent as CloseArrowSVG } from '../../assets/svg/linkin_bio/ArrowBackClose.svg';
// import { ReactComponent as ArrowUpSVG } from '../../assets/svg/linkin_bio/Arrow_up.svg';
// import { ReactComponent as TickSVG } from '../../assets/svg/linkin_bio/Correct_tick.svg';
// import { ReactComponent as LeftArrowSVG } from '../../assets/svg/linkin_bio/left_arrow.svg';
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
import { ReactComponent as LogoutRedSvg } from '../../../assets/svg/sidebar/logout_red.svg';
import { ReactComponent as DownArrowSmallSvg } from '../../../assets/svg/sidebar/downarrowsmall.svg';
import { ReactComponent as CircletickwhiteSvg } from '../../../assets/svg/sidebar/circletickwhite.svg';
import { ReactComponent as ArrowLeftSvg } from '../../../assets/svg/sidebar/leftarrowwhite.svg';
import { useNavigate, useLocation } from 'react-router-dom';

export const veAiModulesItemsList = [
	{ name: 'Workflow', moduleRoute: '/workflows', route: '/sales/workflows', icon: FlowArrowSvg },
	{
		name: 'Linkin Bio',
		moduleRoute: '/linkin-bio',
		route: null,
		icon: InsertLinkSvg,
		initialColor: '#7D7D7D',
	},
	{ name: 'Calendar', moduleRoute: '/calendar', route: null, icon: CalendarSvg },
	{ name: 'Playbook', moduleRoute: '/sales', route: '/sales', icon: BookSvg },
	{ name: 'Inbox', moduleRoute: '/inbox', route: null, icon: MailOutlineSvg },
	{ name: 'Clients', moduleRoute: '/clients', route: null, icon: LayoutSvg },
	{ name: 'Finance', moduleRoute: '/finance', route: null, icon: AttachMoneySvg },
	{ name: 'Email', moduleRoute: '/email', route: null, icon: AtSignSvg },
	{ name: 'HR', moduleRoute: '/hr', route: null, icon: FinanceSvg },
	{ name: 'Inventory', moduleRoute: '/inventory', route: null, icon: LayoutSvg },
	{ name: 'Team', moduleRoute: '/team', route: null, icon: LayoutSvg },
];

export const bottomOptionsList = [
	{ name: 'Upgrade', moduleRoute: '/upgrade', route: null, icon: CrownSvg },
	{
		name: 'App store',
		moduleRoute: '/app-store',
		route: null,
		icon: SquareFour,
		initialColor: '#7D7D7D',
	},
	{ name: 'Share and Earn', moduleRoute: '/share-and-earn', route: null, icon: GiftSvg },
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
		marginTop: 'calc(100vh - 95vh)',
	},
};

export const newBtnActions = [
	{ label: 'Lead' },
	// { label: 'Smart File' },
	{ label: 'Workflow' },
];

// const veSubModules = {
// 	'linkin-bio': [
// 		{ icon: ProfileCircleSVG, link: 'profile' },
// 		{ icon: RadixstackSVG, link: 'mysection' },
// 		{ icon: DropSVG, link: 'stylessection' },
// 		{ icon: GraphSVG, link: 'analytics' },
// 		{ icon: WalletSVG, link: 'payments' },
// 		{ icon: UsersSVG, link: 'audience' },
// 	],
// };
