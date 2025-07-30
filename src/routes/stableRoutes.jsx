import { Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// layouts
import Public from '../views/layouts/Public';
import AuthWrapper from '../views/layouts/authWrapper';

// pages
// import InitialHomePage from '../views/features/homePage/InitialHomePage';
// import MeetBot from '../views/features/meetBot/meetBot';
// import NotesWrapper from '../views/features/notesModule/NotesWrapper';

// lazy loaded pages
const ShareAndEarn = lazy(() => import('../views/features/shareAndEarn/ShareAndEarn'));
const SettingsWrapper = lazy(() => import('../views/features/settings/SettingsWrapper'));
const RecentChat = lazy(() => import('../views/features/chat/RecentChat'));
const Onboarding = lazy(() => import('../views/features/onboarding/Onboarding'));
const ChatPage = lazy(() => import('../views/components/homePage/ChatPage'));
const NotesWrapper = lazy(() => import('../views/features/notesModule/NotesWrapper'));

// components
import SuspenseFallback from '../views/components/globalComponents/SuspenseFallback';
import AmbientAi from '../views/features/ambientAi/AmbientAi';
import CardMeetBot from '../views/features/meetBot/CardMeetBot';
import Agents from '../views/features/agents/Agents';
import Agent from '../views/features/agents/agent/Agent';
import GlobalWorkflows from '../views/features/sales/GlobalWorkflows';

const stableRoutes = [
	// {
	// 	path: '/home',
	// 	element: (
	// 		<AuthWrapper
	// 			title={'Home'}
	// 			outerContainerStyle={{ overflow: 'hidden' }}
	// 			childrenContainerStyles={{ overflow: 'auto' }}
	// 			showBottomToolbar={false}
	// 		>
	// 			<InitialHomePage />
	// 		</AuthWrapper>
	// 	),
	// },
	{
		path: '/playbook',
		element: (
			<AuthWrapper title={'Sales'}>
				<GlobalWorkflows />
			</AuthWrapper>
		),
	},
	{
		path: '/home',
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
		path: '/chats',
		element: (
			<AuthWrapper title={'Chats'}>
				<Suspense fallback={<SuspenseFallback />}>
					<ChatPage />
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
					<RecentChat showChatHistory={true} showDeleteChat={true} />
				</Suspense>
			</AuthWrapper>
		),
	},
	{
		path: '/agents',
		element: (
			<AuthWrapper
				title="Agents"
				outerContainerStyle={{ padding: '0' }}
				sidebarContainerStyles={{ padding: '32px 0 0 32px' }}
			>
				<Suspense fallback={<SuspenseFallback />}>
					<Agents />
				</Suspense>
			</AuthWrapper>
		),
	},
	{
		path: '/agent/:agentId',
		element: (
			<AuthWrapper title="Agent">
				<Suspense fallback={<SuspenseFallback />}>
					<Agent />
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
				<Suspense fallback={<SuspenseFallback />}>
					<NotesWrapper />
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
