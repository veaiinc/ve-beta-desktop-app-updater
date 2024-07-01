import AuthWrapper from './views/layouts/authWrapper';
import LoginScreen from './views/features/signin';
import ChatScreen from './views/features/meta_Integ/index';
import SalesScreen from './views/features/sales/index';
import MyWorkFlowDetails from './views/features/sales/myWorkFlowDetails';
import ProposalCRUD from './views/features/modules/proposalCRUD';
import MainContentWrapper from './views/features/workspace_settings/MainContentWrapper';
import MySettingsWrapper from './views/features/profile_settings/MySettingsWrapper';
import OauthVerify from './views/features/auth/oauth';
import MySettings from './views/features/profile_settings_update/MySettings';

const routes = [
	{
		path: '/',
		component: <LoginScreen stage={'verify-user'} />,
	},
	{
		path: '/verify-user',
		component: <LoginScreen stage={'verify-user'} />,
	},
	{
		path: '/login-with-password',
		component: <LoginScreen stage={'login-with-password'} />,
	},
	{
		path: '/signup-user',
		component: <LoginScreen stage={'signup-user'} />,
	},
	{
		path: '/verify-email-code',
		component: <LoginScreen stage={'verify-email-code'} />,
	},
	{
		path: '/create-workspace',
		component: <LoginScreen stage={'create-workspace'} />,
	},
	{
		path: '/forgot-password',
		component: <LoginScreen stage={'forgot-password'} />,
	},
	{
		path: '/user/verify-oauth-user',
		component: <OauthVerify />,
	},

	{
		path: '/inbox',
		component: (
			<AuthWrapper title={'Inbox'}>
				<ChatScreen />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/sales',
		component: (
			<AuthWrapper title={'Sales'}>
				<SalesScreen />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/sales/:salesId',
		component: (
			<AuthWrapper title={'Sales'}>
				<MyWorkFlowDetails />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/sales/workflows',
		component: (
			<AuthWrapper title={'Sales'}>
				<SalesScreen type={'workflows'} />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/sales/:salesId/:proposalId',
		component: (
			<AuthWrapper title={'Sales'} hideQuickNav={true}>
				<ProposalCRUD type={'workflows'} />
			</AuthWrapper>
		),
		exact: true,
	},

	{
		path: '/workspace-settings/:type',
		component: (
			<AuthWrapper title={'Workspace Settings'}>
				<MainContentWrapper />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/my-profile',
		component: (
			<AuthWrapper title={'Profile Settings'}>
				<MySettingsWrapper />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/my-profile-update',
		component: (
			<AuthWrapper title={'Profile Setting'}>
				<MySettings />
			</AuthWrapper>
		),
		exact: true,
	},
];

export default routes;
