import { Navigate } from 'react-router-dom';

import LandingPage from '../views/features/landingScreen/LandingPage';
import LoginPage from '../views/features/loginPage/LoginPage';
import Onboarding from '../views/features/onboarding/Onboarding';
import TermsOfService from '../views/features/signin/TermsOfService';
import CookiePolicy from '../views/features/signin/CookiePolicy';
import PrivacyPolicy from '../views/features/signin/PrivacyPolicy';
import ChageLog from '../views/features/signin/ChageLog';
import PublicChat from '../views/features/publicChat/PublicChat';
import useWorkspaceMode from '../views/hooks/useWorkspaceMode';
import OauthVerify from '../views/features/signin/oauth/OauthVerify';
import PageLoader from '../views/components/app/PageLoader';
import useTheme from '../views/hooks/useTheme';

export const Public = ({ children }) => {
	useTheme();
	const { loading } = useWorkspaceMode();
	return loading ? <PageLoader /> : <>{children}</>;
};

const publicRoutes = [
	{
		path: '/',
		element: (
			<Public>
				<LandingPage />
			</Public>
		),
	},
	{
		path: '/thebridge',
		element: (
			<Public>
				<LandingPage />
			</Public>
		),
	},
	{
		path: '/contact-us',
		element: (
			<Public>
				<LandingPage />
			</Public>
		),
	},
	{
		path: '/pricing',
		element: (
			<Public>
				<LandingPage />
			</Public>
		),
	},
	{
		path: '/api',
		element: (
			<Public>
				<LandingPage />
			</Public>
		),
	},
	{
		path: '/thebridge',
		element: (
			<Public>
				<LandingPage />
			</Public>
		),
	},
	{
		path: '/careers',
		element: (
			<Public>
				<LandingPage />
			</Public>
		),
	},
	{
		path: '/forefront',
		element: <Public><LandingPage /></Public>,
	},
	{
		path: '/thebridge',
		element: <Public><LandingPage /></Public>,
	},
	{
		path: '/careers',
		element: <Public><LandingPage /></Public>,
	},
	{
		path: '/forefront',
		element: <LandingPage />,
	},
	{
		path: '/onboarding',
		element: (
			<Public>
				<Onboarding />
			</Public>
		),
	},
	{
		path: '/verify-user',
		element: (
			<Public>
				<LoginPage />
			</Public>
		),
	},
	{
		path: '/referral/:referralCode',
		element: (
			<Public>
				<LoginPage />
			</Public>
		),
	},
	{
		path: '/privacy-policy',
		element: (
			<Public>
				<PrivacyPolicy />
			</Public>
		),
	},
	{
		path: '/terms-of-service',
		element: (
			<Public>
				<TermsOfService />
			</Public>
		),
	},
	{
		path: '/cookie-policy',
		element: (
			<Public>
				<CookiePolicy />
			</Public>
		),
	},
	{
		path: '/changelog',
		element: (
			<Public>
				<ChageLog />
			</Public>
		),
	},
	{
		path: '/c/:sessionId',
		element: (
			<Public>
				<PublicChat />
			</Public>
		),
	},
	{
		path: '/user/verify-oauth-user',
		element: (
			<Public>
				<OauthVerify />
			</Public>
		),
	},
	{
		path: '*',
		element: (
			<Public>
				<Navigate to="/" />
			</Public>
		),
	},
];

export const publicRoutesList = publicRoutes
	.map((route) => route.path)
	.filter((path) => path !== '*');
export default publicRoutes;
