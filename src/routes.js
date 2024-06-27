import AuthWrapper from './views/layouts/authWrapper';
import LoginScreen from './views/features/signin';
import ChatScreen from './views/features/meta_Integ/index';
import SalesScreen from './views/features/sales/index';
import MainContentWrapper from './views/features/workspace_settings/MainContentWrapper';

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
		path: '/reset-password',
		component: <LoginScreen stage={'reset-password'} />,
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
				<SalesScreen />
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
		path: '/workspace-settings/:type',
		component: (
			<AuthWrapper title={'Workspace Settings'}>
				<MainContentWrapper />
			</AuthWrapper>
		),
		exact: true,
	},
];

export default routes;
