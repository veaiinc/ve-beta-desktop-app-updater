import { Navigate } from 'react-router-dom';

// layout
import Public from '../views/layouts/Public';

// pages
import LandingPage from '../views/features/landingScreen/LandingPage';

import { lazy, Suspense } from 'react';

// lazy loaded pages
const LoginPage = lazy(() => import('../views/features/loginPage/LoginPage'));
const Onboarding = lazy(() => import('../views/features/onboarding/Onboarding'));
const TermsOfService = lazy(() => import('../views/features/signin/TermsOfService'));
const CookiePolicy = lazy(() => import('../views/features/signin/CookiePolicy'));
const PrivacyPolicy = lazy(() => import('../views/features/signin/PrivacyPolicy'));
const ChangeLog = lazy(() => import('../views/features/signin/ChangeLog'));
const OauthVerify = lazy(() => import('../views/features/signin/oauth/OauthVerify'));
const PricingPageWebsite = lazy(() => import('../views/features/pricingPlans/PricingPageWebsite'));

// components
import SuspenseFallback from '../views/components/globalComponents/SuspenseFallback';
import LiveIntelligence from '../views/features/onboarding/LiveIntelligence';

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
		path: '/pricing',
		element: (
			<Public>
				<Suspense fallback={<SuspenseFallback />}>
					<LoginPage />
				</Suspense>
			</Public>
		),
	},
	{
		path: '/pricing',
		element: (
			<Public>
				<Suspense fallback={<SuspenseFallback />}>
					<PricingPageWebsite />
				</Suspense>
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
				<Suspense fallback={<SuspenseFallback />}>
					<ChangeLog />
				</Suspense>
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
