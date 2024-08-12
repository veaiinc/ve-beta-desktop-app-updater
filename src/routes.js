import AuthWrapper from './views/layouts/authWrapper';
import LoginScreen from './views/features/signin';
import ChatScreen from './views/features/meta_Integ/index';
import OauthVerify from './views/features/signin/oauth';
import MySettings from './views/features/profile_settings/MySettings';
import CompanySettingsWrapper from './views/features/workspace_settings/CompanySettingsWrapper';
import Workflow_builder from './views/features/workflow_builder';
import Sales from './views/features/sales/Sales';
import GlobalWorkflows from './views/features/sales/GlobalWorkflows';
import SmartFile from './views/features/sales/smartFiles/SmartFile';

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
				<Sales />
			</AuthWrapper>
		),
		exact: true,
	},

	{
		path: '/sales/workflows',
		component: (
			<AuthWrapper title={'Sales'}>
				<GlobalWorkflows />
			</AuthWrapper>
		),
		exact: true,
	},

	{
		path: '/workspace-settings/:type',
		component: (
			<AuthWrapper title={'Workspace Settings'}>
				<CompanySettingsWrapper />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/my-profile',
		component: (
			<AuthWrapper title={'Profile Settings'}>
				<MySettings />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/workflow_builder',
		component: (
			<AuthWrapper title={'Workflow Builder'}>
				<Workflow_builder />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/smart-file',
		component: (
			<AuthWrapper title={'Smart File'}>
				<SmartFile />
			</AuthWrapper>
		),
		exact: true,
	},
];

export default routes;
