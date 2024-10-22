import AuthWrapper from './views/layouts/authWrapper';
import LoginScreen from './views/features/signin';
import ChatScreen from './views/features/meta_Integ/index';
import OauthVerify from './views/features/signin/oauth';
import Workflow_builder from './views/features/workflow_builder';
import Sales from './views/features/sales/Sales';
import GlobalWorkflows from './views/features/sales/GlobalWorkflows';
import SmartFile from './views/features/sales/smartFiles/SmartFile';
import WorkflowBuilderLayout from './views/layouts/workflowBuilderLayout';
import SmartFileLayout from './views/layouts/smartFileLayout';
import EarlyAccess from './views/features/early_access';
import SettingsWrapper from './views/features/settings/SettingsWrapper';
import AiSetupPage from './views/features/settings/AiSetupPage';
import PrivacyPolicy from './views/features/signin/PrivacyPolicy';
import Landing_screen from './views/features/landing_screen';

const routes = [
	{
		path: '/',
		component: <Landing_screen />,
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
		path: '/privacy-policy',
		component: <PrivacyPolicy />,
	},
	// {
	// 	path: '/inbox',
	// 	component: (
	// 		<AuthWrapper title={'Inbox'}>
	// 			<ChatScreen />
	// 		</AuthWrapper>
	// 	),
	// 	exact: true,
	// },

	{
		path: '/home',
		component: (
			<AuthWrapper title={'Home'}>
				<Sales />
			</AuthWrapper>
		),
		exact: true,
	},

	{
		path: '/playbook',
		component: (
			<AuthWrapper title={'Sales'}>
				<GlobalWorkflows />
			</AuthWrapper>
		),
		exact: true,
	},

	{
		path: '/workflow_builder/:templateId',
		component: (
			<WorkflowBuilderLayout title={'Workflow Builder'}>
				<Workflow_builder />
			</WorkflowBuilderLayout>
		),
		exact: true,
	},
	{
		path: '/smart-file/:templateId/:workflowId',
		component: (
			<SmartFileLayout title={'Smart File'}>
				<SmartFile />
			</SmartFileLayout>
		),
		exact: true,
	},
	{
		path: '/early-access',
		component: <EarlyAccess />,
		exact: true,
	},
	{
		path: '/settings/:type',
		component: (
			<AuthWrapper title={'Workspace Settings'}>
				<SettingsWrapper />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/settings/ai-setup-page',
		component: (
			<AuthWrapper title={'AI Setup'}>
				<AiSetupPage />
			</AuthWrapper>
		),
		exact: true,
	},
];

export default routes;
