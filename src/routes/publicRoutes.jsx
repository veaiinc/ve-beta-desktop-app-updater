import { Navigate } from 'react-router-dom';

// layout
import Public from '../views/layouts/Public';

// pages
import LandingPage from '../views/features/landingScreen/LandingPage';
import LoginPage from '../views/features/loginPage/LoginPage';
import Onboarding from '../views/features/onboarding/Onboarding';
import LiveIntelligence from '../views/features/onboarding/LiveIntelligence';
import TermsOfService from '../views/features/signin/TermsOfService';
import CookiePolicy from '../views/features/signin/CookiePolicy';
import PrivacyPolicy from '../views/features/signin/PrivacyPolicy';
import ChageLog from '../views/features/signin/ChageLog';
import OauthVerify from '../views/features/signin/oauth/OauthVerify';

const publicRoutes = [
	{
		path: '/',
		element: (
			// <Public>
			// 	<LandingPage />
			// </Public>
			<Navigate to="/verify-user" replace />
			
		),
	},
	{
		path: '/manifesto',
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
		path: '/api',
		element: (
			<Public>
				<LandingPage />
			</Public>
		),
	},
	{
		path: '/about-us',
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
		element: (
			<Public>
				<LandingPage />
			</Public>
		),
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
		path: '/live-intelligence',
		element: (
			<Public>
				<LiveIntelligence />
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

export default publicRoutes;
