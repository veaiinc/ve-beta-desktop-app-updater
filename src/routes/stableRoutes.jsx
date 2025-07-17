import { Navigate } from 'react-router-dom';

// layouts
import Public from '../views/layouts/Public';
import AuthWrapper from '../views/layouts/authWrapper';

// pages
import InitialHomePage from '../views/features/homePage/InitialHomePage';
import MeetBot from '../views/features/meetBot/meetBot';
import NotesWrapper from '../views/features/notesModule/NotesWrapper';
import ShareAndEarn from '../views/features/shareAndEarn/ShareAndEarn';
import SettingsWrapper from '../views/features/settings/SettingsWrapper';
import RecentChat from '../views/features/chat/RecentChat';
import Onboarding from '../views/features/onboarding/Onboarding';

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
		)
	},
	{
		path: '/create-workspace',
		element: (
			<Public>
				<Onboarding />
			</Public>
		)
	},
	{
		path: '/share-and-earn',
		element: (
			<AuthWrapper title={'Share and Earn'}>
				<ShareAndEarn />
			</AuthWrapper>
		)
	},
	{
		path: '/settings/:type',
		element: (
			<AuthWrapper title={'Workspace Settings'}>
				<SettingsWrapper />
			</AuthWrapper>
		)
	},
	{
		path: '/chat/:sessionId',
		element: (
			<AuthWrapper
				title={'Chat'}
				showBottomToolbar={false}
				outerContainerStyle={{
					paddingRight: '0px',
					backgroundColor: 'var(--chat-background-color)'
				}}
				authParentContainerStyle={{ backgroundColor: 'var(--background-color)' }}
				maxWidth="100%"
			>
				<RecentChat />
			</AuthWrapper>
		)
	},
	{
		path: '/meet',
		element: (
			<AuthWrapper title={'Meet'}>
				<MeetBot />
			</AuthWrapper>
		)
	},
	{
		path: '/meet/:noteId',
		element: (
			<AuthWrapper title={'Meet'}>
				<NotesWrapper />
			</AuthWrapper>
		)
	},
	{
		path: '/meet',
		element: (
			<AuthWrapper title={'Meet'}>
				<MeetBot />
			</AuthWrapper>
		)
	},
	{
		path: '/meet/:noteId',
		element: (
			<AuthWrapper title={'Meet'}>
				<NotesWrapper />
			</AuthWrapper>
		)
	},
	{
		path: '*',
		element: (
			<Public>
				<Navigate to="/home" />
			</Public>
		)
	}
];

export default stableRoutes;
