import { Navigate } from 'react-router-dom';

import LandingPage from '../views/features/landingScreen/LandingPage';
import LoginPage from '../views/features/loginPage/LoginPage';
import Onboarding from '../views/features/onboarding/Onboarding';
import TermsOfService from '../views/features/signin/TermsOfService';
import CookiePolicy from '../views/features/signin/CookiePolicy';
import WorkflowBuilder from '../views/features/workflowBuilder/WorkflowBuilder';
import SmartFile from '../views/features/sales/smartFiles/SmartFile';
import WorkflowBuilderLayout from '../views/layouts/workflowBuilderLayout';
import SmartFileLayout from '../views/layouts/smartFileLayout';
import PrivacyPolicy from '../views/features/signin/PrivacyPolicy';
import ChageLog from '../views/features/signin/ChageLog';
import PublicChat from '../views/features/publicChat/PublicChat';
import Workflow_builder_updated from '../views/features/workflowBuilderUpdated/WorkflowBuilderUpdated';

const publicRoutes = [
	{
		path: '/',
		element: <LandingPage />,
	},
	{
		path: '/thebridge',
		element: <LandingPage />,
	},
	{
		path: '/contact-us',
		element: <LandingPage />,
	},
	{
		path: '/pricing',
		element: <LandingPage />,
	},
	{
		path: '/api',
		element: <LandingPage />,
	},
	{
		path: '/onboarding',
		element: <Onboarding />,
	},
	{
		path: '/create-workspace',
		element: <Onboarding />,
	},
	{
		path: '/verify-user',
		element: <LoginPage />,
	},
	{
		path: '/referral/:referralCode',
		element: <LoginPage />,
	},
	{
		path: '/privacy-policy',
		element: <PrivacyPolicy />,
	},
	{
		path: '/terms-of-service',
		element: <TermsOfService />,
	},
	{
		path: '/cookie-policy',
		element: <CookiePolicy />,
	},
	{
		path: '/changelog',
		element: <ChageLog />,
	},
	{
		path: '/smart-file/:templateId/:workflowId',
		element: (
			<SmartFileLayout title={'Smart File'}>
				<SmartFile />
			</SmartFileLayout>
		),
	},
	{
		path: '/workflow_builder/:templateId',
		element: (
			<WorkflowBuilderLayout title={'Workflow Builder'}>
				<WorkflowBuilder />
			</WorkflowBuilderLayout>
		),
	},
	{
		path: '/automation_builder/:templateId',
		element: (
			<WorkflowBuilderLayout title={'Workflow Builder'}>
				<Workflow_builder_updated />
			</WorkflowBuilderLayout>
		),
	},
	{
		path: '/c/:sessionId',
		element: <PublicChat />,
	},
	{
		path: '*',
		element: <Navigate to="/" />,
	},
];

export const publicRoutesList = publicRoutes
	.map((route) => route.path)
	.filter((path) => path !== '*');
export default publicRoutes;
