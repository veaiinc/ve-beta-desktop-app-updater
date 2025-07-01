import { Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Public from '../views/layouts/Public';

const LandingPage = lazy(() => import('../views/features/landingScreen/LandingPage'));
const LoginPage = lazy(() => import('../views/features/loginPage/LoginPage'));
const Onboarding = lazy(() => import('../views/features/onboarding/Onboarding'));
const TermsOfService = lazy(() => import('../views/features/signin/TermsOfService'));
const CookiePolicy = lazy(() => import('../views/features/signin/CookiePolicy'));
const PrivacyPolicy = lazy(() => import('../views/features/signin/PrivacyPolicy'));
const ChageLog = lazy(() => import('../views/features/signin/ChageLog'));
const OauthVerify = lazy(() => import('../views/features/signin/oauth/OauthVerify'));

const publicRoutes = [
	{
		path: '/',
		element: (
			<Public>
				<Suspense fallback={<div>Loading...</div>}>
					<LandingPage />
				</Suspense>
			</Public>
		),
	},
	{
		path: '/manifesto',
		element: (
			<Public>
				<Suspense fallback={<div>Loading...</div>}>
					<LandingPage />
				</Suspense>
			</Public>
		),
	},
	{
		path: '/contact-us',
		element: (
			<Public>
				<Suspense fallback={<div>Loading...</div>}>
					<LandingPage />
				</Suspense>
			</Public>
		),
	},
	{
		path: '/api',
		element: (
			<Public>
				<Suspense fallback={<div>Loading...</div>}>
					<LandingPage />
				</Suspense>
			</Public>
		),
	},
	{
		path: '/about-us',
		element: (
			<Public>
				<Suspense fallback={<div>Loading...</div>}>
					<LandingPage />
				</Suspense>
			</Public>
		),
	},
	{
		path: '/careers',
		element: (
			<Public>
				<Suspense fallback={<div>Loading...</div>}>
					<LandingPage />
				</Suspense>
			</Public>
		),
	},
	{
		path: '/forefront',
		element: (
			<Public>
				<Suspense fallback={<div>Loading...</div>}>
					<LandingPage />
				</Suspense>
			</Public>
		),
	},
	{
		path: '/onboarding',
		element: (
			<Public>
				<Suspense fallback={<div>Loading...</div>}>
					<Onboarding />
				</Suspense>
			</Public>
		),
	},
	{
		path: '/verify-user',
		element: (
			<Public>
				<Suspense fallback={<div>Loading...</div>}>
					<LoginPage />
				</Suspense>
			</Public>
		),
	},
	{
		path: '/referral/:referralCode',
		element: (
			<Public>
				<Suspense fallback={<div>Loading...</div>}>
					<LoginPage />
				</Suspense>
			</Public>
		),
	},
	{
		path: '/privacy-policy',
		element: (
			<Public>
				<Suspense fallback={<div>Loading...</div>}>
					<PrivacyPolicy />
				</Suspense>
			</Public>
		),
	},
	{
		path: '/terms-of-service',
		element: (
			<Public>
				<Suspense fallback={<div>Loading...</div>}>
					<TermsOfService />
				</Suspense>
			</Public>
		),
	},
	{
		path: '/cookie-policy',
		element: (
			<Public>
				<Suspense fallback={<div>Loading...</div>}>
					<CookiePolicy />
				</Suspense>
			</Public>
		),
	},
	{
		path: '/changelog',
		element: (
			<Public>
				<Suspense fallback={<div>Loading...</div>}>
					<ChageLog />
				</Suspense>
			</Public>
		),
	},
	{
		path: '/user/verify-oauth-user',
		element: (
			<Public>
				<Suspense fallback={<div>Loading...</div>}>
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
