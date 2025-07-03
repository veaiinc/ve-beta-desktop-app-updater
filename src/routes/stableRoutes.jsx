import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';

// layouts
import Public from '../views/layouts/Public';
import AuthWrapper from '../views/layouts/authWrapper';

// pages
import InitialHomePage from '../views/features/homePage/InitialHomePage';
const ShareAndEarn = lazy(() => import('../views/features/shareAndEarn/ShareAndEarn'));
const SettingsWrapper = lazy(() => import('../views/features/settings/SettingsWrapper'));
const RecentChat = lazy(() => import('../views/features/chat/RecentChat'));
const Onboarding = lazy(() => import('../views/features/onboarding/Onboarding'));
import MeetBot from '../views/features/meetBot/meetBot';

const stableRoutes = [
	{
		path: '/home',
		element: (
			<AuthWrapper
				title={'Home'}
				outerContainerStyle={{ overflow: 'hidden' }}
				childrenContainerStyles={{ overflow: 'scroll' }}
				showBottomToolbar={false}
			>
				<InitialHomePage />
			</AuthWrapper>
		),
	},
	{
		path: '/create-workspace',
		element: (
			<Public>
				<Suspense fallback={<p>Loading onboarding...</p>}>
					<Onboarding />
				</Suspense>
			</Public>
		),
	},
	{
		path: '/share-and-earn',
		element: (
			<AuthWrapper title={'Share and Earn'}>
				<Suspense fallback={<p>Loading share and earn...</p>}>
					<ShareAndEarn />
				</Suspense>
			</AuthWrapper>
		),
	},
	{
		path: '/settings/:type',
		element: (
			<AuthWrapper title={'Workspace Settings'}>
				<Suspense fallback={<p>Loading settings...</p>}>
					<SettingsWrapper />
				</Suspense>
			</AuthWrapper>
		),
	},
	{
		path: '/chat/:sessionId',
		element: (
			<AuthWrapper
				title={'Chat'}
				showBottomToolbar={false}
				outerContainerStyle={{
					paddingRight: '0px',
					backgroundColor: 'var(--chat-background-color)',
				}}
				authParentContainerStyle={{ backgroundColor: 'var(--background-color)' }}
				maxWidth="100%"
			>
				<Suspense fallback={<p>Loading recent chat...</p>}>
					<RecentChat />
				</Suspense>
			</AuthWrapper>
		),
	},
	{
		path: '*',
		element: (
			<Public>
				<Navigate to="/home" />
			</Public>
		),
	},
	{
		path: '/meet',
		element: (
			<AuthWrapper title={'Meet'}>
				<MeetBot />
			</AuthWrapper>
		),
	},
];

export default stableRoutes;
