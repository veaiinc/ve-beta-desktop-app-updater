import { Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import { safeLazy } from '../utils/safeLazy';

// layouts
import Public from '../views/layouts/Public';

// pages
import LandingPage from '../views/features/landingScreen/LandingPage';
import SuspenseFallback from '../views/components/globalComponents/SuspenseFallback';
const LoginPage = safeLazy(() => import('../views/features/loginPage/LoginPage'), 'LoginPage');
const Onboarding = safeLazy(() => import('../views/features/onboarding/Onboarding'), 'Onboarding');
const TermsOfService = safeLazy(
	() => import('../views/features/signin/TermsOfService'),
	'TermsOfService',
);
const CookiePolicy = safeLazy(
	() => import('../views/features/signin/CookiePolicy'),
	'CookiePolicy',
);
const PrivacyPolicy = safeLazy(
	() => import('../views/features/signin/PrivacyPolicy'),
	'PrivacyPolicy',
);
const ChageLog = safeLazy(() => import('../views/features/signin/ChageLog'), 'Changelog');
const OauthVerify = safeLazy(
	() => import('../views/features/signin/oauth/OauthVerify'),
	'OauthVerify',
);

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
					<ChageLog />
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
