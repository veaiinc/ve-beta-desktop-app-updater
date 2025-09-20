import { Navigate } from 'react-router-dom';

// layouts
import AuthWrapper from '../views/layouts/authWrapper';
import Public from '../views/layouts/Public';

// lazy loaded pages
// import ShareAndEarn from '../views/features/shareAndEarn/ShareAndEarn';
import SettingsWrapper from '../views/features/settings/SettingsWrapper';
import RecentChat from '../views/features/chat/RecentChat';
import Onboarding from '../views/features/onboarding/Onboarding';
import ChatPage from '../views/components/homePage/ChatPage';
// import Agents from '../views/features/agents/Agents';
// import Agent from '../views/features/agents/agent/Agent';
import GlobalWorkflows from '../views/features/sales/GlobalWorkflows';
import CardMeetBot from '../views/features/meetBot/CardMeetBot';
import MeetBotWrapper from '../views/features/meetBot/meetBotWrapper';
import ProactiveSuggestions from '../views/features/homePage/ambientAi/ProactiveSuggestions';
import publicRoutes from './publicRoutes';

// components
const stableRoutes = [
	// ========================================
	// AI & ASSISTANT FEATURES
	// ========================================
	{
		path: '/home',
		element: (
			<AuthWrapper title={'Ambient AI'}>
				<ProactiveSuggestions />
			</AuthWrapper>
		),
	},
	// {
	// 	path: '/agents',
	// 	element: (
	// 			<AuthWrapper
	// 				title="Agents"
	// 				outerContainerStyle={{ padding: '0' }}
	// 				sidebarContainerStyles={{ padding: '32px 0 0 32px' }}
	// 			>
	// 				<Agents />
	// 			</AuthWrapper>
	// 	),
	// },
	// {
	// 	path: '/agent/:agentId',
	// 	element: (
	// 			<AuthWrapper title="Agent">
	// 				<Agent />
	// 			</AuthWrapper>
	// 	),
	// },

	// ========================================
	// CHAT & COMMUNICATION
	// ========================================
	{
		path: '/chats',
		element: (
			<AuthWrapper title={'Chats'}>
				<ChatPage />
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
					backgroundColor: 'var(--background-color)',
				}}
				authParentContainerStyle={{ backgroundColor: 'var(--background-color)' }}
				maxWidth="100%"
			>
				<RecentChat
					showChatHistory={true}
					showDeleteChat={true}
					showChats={true}
					showChatsButton={true}
					showBrowser={true}
				/>
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
		path: '/meet/:meetingId',
		element: (
			<AuthWrapper title={'Meet'}>
				<MeetBotWrapper />
			</AuthWrapper>
		),
	},

	// ========================================
	// Playbook
	// ========================================
	{
		path: '/playbook',
		element: (
			<AuthWrapper title={'Playbook'}>
				<GlobalWorkflows />
			</AuthWrapper>
		),
	},

	// ========================================
	// SETTINGS & ADMINISTRATION
	// ========================================
	{
		path: '/settings/:type',
		element: (
			<AuthWrapper title={'Workspace Settings'}>
				<SettingsWrapper />
			</AuthWrapper>
		),
	},

	// ========================================
	// ONBOARDING & FEATURES
	// ========================================
	{
		path: '/create-workspace',
		element: (
			<AuthWrapper title={'Onboarding'}>
				<Onboarding />
			</AuthWrapper>
		),
	},
	// {
	// 	path: '/share-and-earn',
	// 	element: (
	//
	// 			<AuthWrapper title={'Share and Earn'}>
	// 				<ShareAndEarn />
	// 			</AuthWrapper>
	//
	// 	),
	// },

	// ========================================
	// FALLBACK ROUTE
	// ========================================
	{
		path: '*',
		element: (
			<Public>
				<Navigate to="/home" />
			</Public>
		),
	},
	// ========================================
	// PUBLIC ROUTES
	// ========================================
	...publicRoutes,
];

export default stableRoutes;
