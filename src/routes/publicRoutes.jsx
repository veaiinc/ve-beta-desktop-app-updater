import { Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// layouts
import Public from '../views/layouts/Public';

// pages
import LandingPage from '../views/features/landingScreen/LandingPage';

// lazy loaded pages
const LoginPage = lazy(() => import('../views/features/loginPage/LoginPage'));
const Onboarding = lazy(() => import('../views/features/onboarding/Onboarding'));
const TermsOfService = lazy(() => import('../views/features/signin/TermsOfService'));
const CookiePolicy = lazy(() => import('../views/features/signin/CookiePolicy'));
const PrivacyPolicy = lazy(() => import('../views/features/signin/PrivacyPolicy'));
const ChangeLog = lazy(() => import('../views/features/signin/ChangeLog'));
const OauthVerify = lazy(() => import('../views/features/signin/oauth/OauthVerify'));
const PricingPageWebsite = lazy(() => import('../views/features/pricingPlans/PricingPageWebsite'));
const DownloadDesktopApp = lazy(() => import('../views/features/desktopApp/DesktopApp'));

// components
import SuspenseFallback from '../views/components/globalComponents/SuspenseFallback';

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
				<Suspense fallback={<SuspenseFallback />}>
					<Onboarding />
				</Suspense>
			</Public>
		),
	},
	{
		path: '/verify-user',
		element: (
			<Public>
				<Suspense fallback={<SuspenseFallback />}>
					<LoginPage />
				</Suspense>
			</Public>
		),
	},
	{
		path: '/download-app',
		element: (
			<Public>
				<Suspense fallback={<SuspenseFallback />}>
					<DownloadDesktopApp />
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
				<Suspense fallback={<SuspenseFallback />}>
					<LoginPage />
				</Suspense>
			</Public>
		),
	},
	{
		path: '/privacy-policy',
		element: (
			<Public>
				<Suspense fallback={<SuspenseFallback />}>
					<PrivacyPolicy />
				</Suspense>
			</Public>
		),
	},
	{
		path: '/terms-of-service',
		element: (
			<Public>
				<Suspense fallback={<SuspenseFallback />}>
					<TermsOfService />
				</Suspense>
			</Public>
		),
	},
	{
		path: '/cookie-policy',
		element: (
			<Public>
				<Suspense fallback={<SuspenseFallback />}>
					<CookiePolicy />
				</Suspense>
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
				<Suspense fallback={<SuspenseFallback />}>
					<OauthVerify />
				</Suspense>
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
