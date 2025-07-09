import { safeLazy } from '../utils/safeLazy';
import { Navigate } from 'react-router-dom';
import { Suspense } from 'react';

// layouts
import Public from '../views/layouts/Public';
import AuthWrapper from '../views/layouts/authWrapper';

// pages
import InitialHomePage from '../views/features/homePage/InitialHomePage';
import SuspenseFallback from '../views/components/globalComponents/SuspenseFallback';
const ShareAndEarn = safeLazy(
	() => import('../views/features/shareAndEarn/ShareAndEarn'),
	'ShareAndEarn',
);
const SettingsWrapper = safeLazy(
	() => import('../views/features/settings/SettingsWrapper'),
	'SettingsWrapper',
);
const RecentChat = safeLazy(() => import('../views/features/chat/RecentChat'), 'RecentChat');
const Onboarding = safeLazy(() => import('../views/features/onboarding/Onboarding'), 'Onboarding');

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
		path: '*',
		element: (
			<Public>
				<Navigate to="/home" />
			</Public>
		),
	},
];

export default stableRoutes;
