import { Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// layouts
const AuthWrapper = lazy(() => import('../views/layouts/authWrapper'));
const Public = lazy(() => import('../views/layouts/Public'));

// lazy loaded pages
const ShareAndEarn = lazy(() => import('../views/features/shareAndEarn/ShareAndEarn'));
const SettingsWrapper = lazy(() => import('../views/features/settings/SettingsWrapper'));
const RecentChat = lazy(() => import('../views/features/chat/RecentChat'));
const Onboarding = lazy(() => import('../views/features/onboarding/Onboarding'));
const ChatPage = lazy(() => import('../views/components/homePage/ChatPage'));
const Agents = lazy(() => import('../views/features/agents/Agents'));
const Agent = lazy(() => import('../views/features/agents/agent/Agent'));
const GlobalWorkflows = lazy(() => import('../views/features/sales/GlobalWorkflows'));
const CardMeetBot = lazy(() => import('../views/features/meetBot/CardMeetBot'));
const MeetBotWrapper = lazy(() => import('../views/features/meetBot/meetBotWrapper'));
const ProactiveSuggestions = lazy(() => import('../views/features/homePage/ProactiveSuggestions'));

// components
import SuspenseFallback from '../views/components/globalComponents/SuspenseFallback';

const stableRoutes = [
	// ========================================
	// AI & ASSISTANT FEATURES
	// ========================================
	{
		path: '/home',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title={'Ambient AI'}>
					<ProactiveSuggestions />
				</AuthWrapper>
			</Suspense>
		),
	},
	{
		path: '/agents',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper
					title="Agents"
					outerContainerStyle={{ padding: '0' }}
					sidebarContainerStyles={{ padding: '32px 0 0 32px' }}
				>
					<Agents />
				</AuthWrapper>
			</Suspense>
		),
	},
	{
		path: '/agent/:agentId',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title="Agent">
					<Agent />
				</AuthWrapper>
			</Suspense>
		),
	},

	// ========================================
	// CHAT & COMMUNICATION
	// ========================================
	{
		path: '/chats',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title={'Chats'}>
					<ChatPage />
				</AuthWrapper>
			</Suspense>
		),
	},
	{
		path: '/chat/:sessionId',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
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
			</Suspense>
		),
	},
	{
		path: '/meet',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title={'Meet'}>
					<CardMeetBot />
				</AuthWrapper>
			</Suspense>
		),
	},
	{
		path: '/meet/:meetingId',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title={'Meet'}>
					<MeetBotWrapper />
				</AuthWrapper>
			</Suspense>
		),
	},

	// ========================================
	// Playbook
	// ========================================
	{
		path: '/playbook',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title={'Playbook'}>
					<GlobalWorkflows />
				</AuthWrapper>
			</Suspense>
		),
	},

	// ========================================
	// SETTINGS & ADMINISTRATION
	// ========================================
	{
		path: '/settings/:type',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title={'Workspace Settings'}>
					<SettingsWrapper />
				</AuthWrapper>
			</Suspense>
		),
	},

	// ========================================
	// ONBOARDING & FEATURES
	// ========================================
	{
		path: '/create-workspace',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title={'Onboarding'}>
					<Onboarding />
				</AuthWrapper>
			</Suspense>
		),
	},
	// {
	// 	path: '/share-and-earn',
	// 	element: (
	// 		<Suspense fallback={<SuspenseFallback />}>
	// 			<AuthWrapper title={'Share and Earn'}>
	// 				<ShareAndEarn />
	// 			</AuthWrapper>
	// 		</Suspense>
	// 	),
	// },

	// ========================================
	// FALLBACK ROUTE
	// ========================================
	{
		path: '*',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<Public>
					<Navigate to="/home" />
				</Public>
			</Suspense>
		),
	},
];

export default stableRoutes;
