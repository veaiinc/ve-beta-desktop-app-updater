import { Navigate } from 'react-router-dom';

// layouts
import Public from '../views/layouts/Public';
import AuthWrapper from '../views/layouts/authWrapper';

// pages
// import InitialHomePage from '../views/features/homePage/InitialHomePage';
// import MeetBot from '../views/features/meetBot/meetBot';
// import NotesWrapper from '../views/features/notesModule/NotesWrapper';

// lazy loaded pages
import ShareAndEarn from '../views/features/shareAndEarn/ShareAndEarn';
import SettingsWrapper from '../views/features/settings/SettingsWrapper';
import RecentChat from '../views/features/chat/RecentChat';
import Onboarding from '../views/features/onboarding/Onboarding';
import ChatPage from '../views/components/homePage/ChatPage';

// components
import AmbientAi from '../views/features/ambientAi/AmbientAi';
import CardMeetBot from '../views/features/meetBot/CardMeetBot';
import Agents from '../views/features/agents/Agents';
import Agent from '../views/features/agents/agent/Agent';
import GlobalWorkflows from '../views/features/sales/GlobalWorkflows';
import NotesWrapper from '../views/features/notesModule/NotesWrapper';

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
				<Onboarding />
			</Public>
		),
	},
	{
		path: '/share-and-earn',
		element: (
			<AuthWrapper title={'Share and Earn'}>
				<ShareAndEarn />
			</AuthWrapper>
		),
	},
	{
		path: '/chats',
		element: (
			<AuthWrapper title={'Chats'}>
				<ChatPage />
			</AuthWrapper>
		),
	},
	{
		path: '/settings/:type',
		element: (
			<AuthWrapper title={'Workspace Settings'}>
				<SettingsWrapper />
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
				<RecentChat showChatHistory={true} showDeleteChat={true} showChats={true} />
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
				<Agents />
			</AuthWrapper>
		),
	},
	{
		path: '/agent/:agentId',
		element: (
			<AuthWrapper title="Agent">
				<Agent />
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
		path: '/meet/:noteId/:meetingId',
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
