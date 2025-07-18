import { Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// layouts
import Public from '../views/layouts/Public';
import AuthWrapper from '../views/layouts/authWrapper';

// pages
import InitialHomePage from '../views/features/homePage/InitialHomePage';
import MeetBot from '../views/features/meetBot/meetBot';
import NotesWrapper from '../views/features/notesModule/NotesWrapper';

// lazy loaded pages
const ShareAndEarn = lazy(() => import('../views/features/shareAndEarn/ShareAndEarn'));
const SettingsWrapper = lazy(() => import('../views/features/settings/SettingsWrapper'));
const RecentChat = lazy(() => import('../views/features/chat/RecentChat'));
const Onboarding = lazy(() => import('../views/features/onboarding/Onboarding'));

// components
import SuspenseFallback from '../views/components/globalComponents/SuspenseFallback';
import AmbientAi from '../views/features/ambientAi/AmbientAi';
import CardMeetBot from '../views/features/meetBot/CardMeetBot';

const stableRoutes = [
	{
		path: '/home',
		element: (
			<AuthWrapper
				title={'Home'}
				outerContainerStyle={{ overflow: 'hidden' }}
				childrenContainerStyles={{ overflow: 'auto' }}
				showBottomToolbar={false}
			>
				<InitialHomePage />
			</AuthWrapper>
		),
	},
	{
		path: '/ambient-ai',
		element: (
			<AuthWrapper title={'Ambient AI'}>
				<AmbientAi />
			</AuthWrapper>
		),
	},
	{
		path: '/create-workspace',
		element: (
			<Public>
				<Suspense fallback={<SuspenseFallback />}>
					<Onboarding />
				</Suspense>
			</Public>
		),
	},
	{
		path: '/share-and-earn',
		element: (
			<AuthWrapper title={'Share and Earn'}>
				<Suspense fallback={<SuspenseFallback />}>
					<ShareAndEarn />
				</Suspense>
			</AuthWrapper>
		),
	},
	{
		path: '/settings/:type',
		element: (
			<AuthWrapper title={'Workspace Settings'}>
				<Suspense fallback={<SuspenseFallback />}>
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
				<Suspense fallback={<SuspenseFallback />}>
					<RecentChat />
				</Suspense>
			</AuthWrapper>
		),
	},
	{
		path: '/meet',
		element: (
			<AuthWrapper title={'Meet'}>
				<CardMeetBot />
			</AuthWrapper>
		),
	},
	{
		path: '/meet/:noteId',
		element: (
			<AuthWrapper title={'Meet'}>
				<NotesWrapper />
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
];

export default stableRoutes;
