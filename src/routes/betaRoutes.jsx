import { Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// layouts
const AuthWrapper = lazy(() => import('../views/layouts/authWrapper'));
const GalleryViewLayout = lazy(() => import('../views/layouts/galleryViewLayout'));
const AutomationBuilderLayout = lazy(() => import('../views/layouts/automationBuilderLayout'));
const SmartFileLayout = lazy(() => import('../views/layouts/smartFileLayout'));
const WorkflowBuilderLayout = lazy(() => import('../views/layouts/workflowBuilderLayout'));
const Public = lazy(() => import('../views/layouts/Public'));

// Protected Pages
const GlobalWorkflows = lazy(() => import('../views/features/sales/GlobalWorkflows'));
const EarlyAccess = lazy(() => import('../views/features/earlyAccess/EarlyAccess'));
const AddGallery = lazy(() => import('../views/features/gallery/AddGallery'));
const AlbumSettings = lazy(() => import('../views/features/gallery/AlbumSettings'));
const UploadPhotos = lazy(() => import('../views/features/gallery/UploadPhotos'));
const InitialHomePage = lazy(() => import('../views/features/homePage/InitialHomePage'));
// const ShareAndEarn = lazy(() => import('../views/features/shareAndEarn/ShareAndEarn'));
const SettingsWrapper = lazy(() => import('../views/features/settings/SettingsWrapper'));
const Docs = lazy(() => import('../views/features/docs/Docs'));
import LiteGallery from '../views/features/gallery/Litegallery';
const MyTemplates = lazy(() => import('../views/features/myTemplates/MyTemplates'));
const Forms = lazy(() => import('../views/features/forms/Forms'));
const FormLeads = lazy(() => import('../views/features/forms/FormLeads'));
const EditAgent = lazy(() => import('../views/features/aiAssistant/EditAgent'));
const AgentDetails = lazy(() => import('../views/features/aiAssistant/AgentDetails'));
const RecentChat = lazy(() => import('../views/features/chat/RecentChat'));
const AutomationBuilder = lazy(() =>
	import('../views/features/automationBuilder/AutomationBuilder'),
);
const Automations = lazy(() => import('../views/features/automations/Automations'));
const DocsFullView = lazy(() => import('../views/components/docs/DocsFullView'));
const EditKnowledgeAgent = lazy(() => import('../views/features/knowledgeAgent/EditAgent'));
const FormResCard = lazy(() => import('../views/components/forms/FormResCard'));
const FormSummary = lazy(() => import('../views/components/forms/FormSummary'));
const SchedulerMainPage = lazy(() => import('../views/features/calendar/SchedulerMainPage'));
const EditScheduler = lazy(() => import('../views/features/calendar/EditScheduler'));
const PricingPage = lazy(() => import('../views/features/pricingPlans/pricingPage'));
const ProactiveAi = lazy(() => import('../views/features/proactiveAi/ProactiveAi'));
const KnowledgeAgents = lazy(() => import('../views/features/knowledgeAgent/KnowledgeAgents'));
const AiAssistants = lazy(() => import('../views/features/aiAssistant/AiAssistants'));
const KnowledgeAgentDetails = lazy(() => import('../views/features/knowledgeAgent/AgentDetails'));
const SmartFile = lazy(() => import('../views/features/sales/smartFiles/SmartFile'));
const WorkflowBuilder = lazy(() => import('../views/features/workflowBuilder/WorkflowBuilder'));
const Workflow_builder_updated = lazy(() =>
	import('../views/features/workflowBuilderUpdated/WorkflowBuilderUpdated'),
);
const Onboarding = lazy(() => import('../views/features/onboarding/Onboarding'));
const Contacts = lazy(() => import('../views/features/contacts/Contacts'));

const Files = lazy(() => import('../views/features/files/Files'));
const ExpandedClientView = lazy(() => import('../views/features/contacts/ExpandedClientView'));
const BuilderApp = lazy(() => import('../../builderSrc/App'));
const Notes = lazy(() => import('../views/features/notesModule/Notes'));
const Agents = lazy(() => import('../views/features/agents/Agents'));
const Agent = lazy(() => import('../views/features/agents/agent/Agent'));
const CalendarModule = lazy(() => import('../views/features/calendar/Calendar'));
const Tasks = lazy(() => import('../views/features/tasks/Tasks'));
const TaskFullView = lazy(() => import('../views/features/tasks/TaskFullView'));
const Integrations = lazy(() => import('../views/features/integrationsList/Integrations'));
const NotesPage = lazy(() => import('../views/features/notesPage/NotesPage'));
const GalleryPage = lazy(() => import('../views/features/gallery/GalleryPage'));
const GalleryViewer = lazy(() => import('../views/features/gallery/GalleryViewer'));

// components
import SuspenseFallback from '../views/components/globalComponents/SuspenseFallback';
const MeetBotWrapper = lazy(() => import('../views/features/meetBot/meetBotWrapper'));
const ProactiveSuggestions = lazy(() =>
	import('../views/features/homePage/ambientAi/ProactiveSuggestions'),
);
const CardMeetBot = lazy(() => import('../views/features/meetBot/CardMeetBot'));
const ChatPage = lazy(() => import('../views/components/homePage/ChatPage'));

const betaRoutes = [
	// ========================================
	// ONBOARDING, HOME & FEATURES
	// ========================================
	{
		path: '/home',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title={'Tools'}>
					<InitialHomePage />
				</AuthWrapper>
			</Suspense>
		),
	},
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
	{
		path: '/early-access',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title={'Early Access'}>
					<EarlyAccess />
				</AuthWrapper>
			</Suspense>
		),
	},
	// ========================================
	// AI & ASSISTANT FEATURES
	// ========================================
	{
		path: '/priority',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper
					title={'Priority'}
					outerContainerStyle={{ overflow: 'hidden' }}
					childrenContainerStyles={{ overflow: 'auto' }}
					showBottomToolbar={false}
				>
					<ProactiveSuggestions />
				</AuthWrapper>
			</Suspense>
		),
	},
	{
		path: '/ai-assistant',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title={'AI Assistant'}>
					<AiAssistants />
				</AuthWrapper>
			</Suspense>
		),
	},
	{
		path: '/ai-assistant/:aiAssistantId',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title={'AI Assistant'}>
					<AgentDetails />
				</AuthWrapper>
			</Suspense>
		),
	},
	{
		path: '/ai-assistant/:aiAssistantId/edit',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title={'AI Assistant'}>
					<EditAgent />
				</AuthWrapper>
			</Suspense>
		),
	},
	{
		path: '/knowledge-agent',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper
					title={'Knowledge Agent'}
					innerContainerStyle={{ paddingBottom: '0px' }}
					showBottomToolbar={false}
				>
					<KnowledgeAgents />
				</AuthWrapper>
			</Suspense>
		),
	},
	{
		path: '/knowledge-agent/:agentId',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper
					title={'Knowledge Agent'}
					showBottomToolbar={false}
					innerContainerStyle={{ paddingBottom: '0px' }}
				>
					<KnowledgeAgentDetails />
				</AuthWrapper>
			</Suspense>
		),
	},
	{
		path: '/knowledge-agent/:agentId/edit',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper
					title={'Knowledge Agent'}
					showBottomToolbar={false}
					outerContainerStyle={{ paddingRight: '0px' }}
				>
					<EditKnowledgeAgent />
				</AuthWrapper>
			</Suspense>
		),
	},
	{
		path: '/proactiveai/:proactiveAiId',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title="Proactive AI" childrenContainerStyles={{ maxWidth: '100%' }}>
					<ProactiveAi />
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
	// CHAT
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
	// ========================================
	// MEET
	// ========================================
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
	// GALLERY
	// ========================================
	{
		path: '/galleries',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title={'Galleries'} showBottomToolbar={false}>
					<AddGallery />
				</AuthWrapper>
			</Suspense>
		),
	},
	{
		path: '/lite-gallery',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title={'Lite Gallery'} showBottomToolbar={false}>
					<LiteGallery />
				</AuthWrapper>
			</Suspense>
		),
	},
	{
		path: '/galleries/:galleryId',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title={'Gallery'} showBottomToolbar={false}>
					<GalleryPage />
				</AuthWrapper>
			</Suspense>
		),
	},
	{
		path: '/galleries/:galleryId/:albumId/upload-photos',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title={'Upload Photos'} showBottomToolbar={false}>
					<UploadPhotos />
				</AuthWrapper>
			</Suspense>
		),
	},
	{
		path: '/galleries/:galleryId/:albumId/album-settings',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title={'Album Settings'} showBottomToolbar={false}>
					<AlbumSettings />
				</AuthWrapper>
			</Suspense>
		),
	},
	{
		path: '/galleries/:galleryId/:albumId/gallery-viewer',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<GalleryViewLayout title={'Gallery Viewer'}>
					<GalleryViewer />
				</GalleryViewLayout>
			</Suspense>
		),
	},
	// ========================================
	// PLAYBOOK
	// ========================================
	{
		path: '/playbook',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title={'Sales'}>
					<GlobalWorkflows />
				</AuthWrapper>
			</Suspense>
		),
	},
	// ========================================
	// WORKFLOW & AUTOMATION
	// ========================================
	{
		path: '/smart-file/:templateId/:workflowId',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<SmartFileLayout title={'Smart File'}>
					<SmartFile />
				</SmartFileLayout>
			</Suspense>
		),
	},
	{
		path: '/workflow_builder/:templateId',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<WorkflowBuilderLayout title={'Workflow Builder'}>
					<WorkflowBuilder />
				</WorkflowBuilderLayout>
			</Suspense>
		),
	},
	{
		path: '/automation_builder/:templateId',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<WorkflowBuilderLayout title={'Workflow Builder'}>
					<Workflow_builder_updated />
				</WorkflowBuilderLayout>
			</Suspense>
		),
	},
	{
		path: '/automation-builder/:automationId',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AutomationBuilderLayout title={'Automation Builder'}>
					<AutomationBuilder />
				</AutomationBuilderLayout>
			</Suspense>
		),
	},
	{
		path: '/automations',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title={'Automations'}>
					<Automations />
				</AuthWrapper>
			</Suspense>
		),
	},
	// ========================================
	// FORMS & TEMPLATES
	// ========================================
	{
		path: '/form',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title={'Forms'}>
					<Forms />
				</AuthWrapper>
			</Suspense>
		),
	},
	{
		path: '/form/:id',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title={'Form Leads'}>
					<FormLeads />
				</AuthWrapper>
			</Suspense>
		),
	},
	{
		path: '/forms/:id/responses',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title={'Form Responses'}>
					<FormResCard view="responses" />
				</AuthWrapper>
			</Suspense>
		),
	},
	{
		path: '/forms/:id/summary',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title={'Form Summary'}>
					<FormSummary view="summary" />
				</AuthWrapper>
			</Suspense>
		),
	},
	{
		path: '/my-templates',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title={'My Templates'}>
					<MyTemplates />
				</AuthWrapper>
			</Suspense>
		),
	},

	// ========================================
	// CALENDAR & SCHEDULING
	// ========================================
	{
		path: '/calendar',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper
					title={'Calendar'}
					outerContainerStyle={{ overflow: 'hidden', padding: '0 32px 0 0 ' }}
					childrenContainerStyles={{ maxWidth: '100%' }}
				>
					<CalendarModule />
				</AuthWrapper>
			</Suspense>
		),
	},
	{
		path: '/scheduler',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title={'Scheduler'} maxWidth={'95%'}>
					<SchedulerMainPage />
				</AuthWrapper>
			</Suspense>
		),
	},
	{
		path: '/scheduling/edit/:sessionId',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title={'Scheduling'} maxWidth={'95%'}>
					<EditScheduler />
				</AuthWrapper>
			</Suspense>
		),
	},
	// ========================================
	// TASKS
	// ========================================
	{
		path: '/tasks',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper
					title={'Tasks'}
					outerContainerStyle={{ padding: '0 32px 0 0' }}
					childrenContainerStyles={{ maxWidth: '100%' }}
				>
					<Tasks />
				</AuthWrapper>
			</Suspense>
		),
	},
	{
		path: '/task/:taskId',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title={'Tasks'}>
					<TaskFullView />
				</AuthWrapper>
			</Suspense>
		),
	},
	// ========================================
	// NOTES & DOCUMENTS
	// ========================================
	{
		path: '/notes',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title={'Notes'} outerContainerStyle={{ padding: '0' }}>
					<NotesPage isDatabase={true} />
				</AuthWrapper>
			</Suspense>
		),
	},
	{
		path: '/note/:noteId',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper
					title={'Notes'}
					outerContainerStyle={{
						backgroundColor: 'var(--background-color)',
						padding: '0px',
					}}
					sidebarContainerStyles={{ padding: '0px' }}
					maxWidth={'100%'}
					sidebarContainerClassName={'auth-sidebar-container'}
				>
					<Notes isDatabase={true} />
				</AuthWrapper>
			</Suspense>
		),
	},
	{
		path: '/docs',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title={'Docs'}>
					<Docs />
				</AuthWrapper>
			</Suspense>
		),
	},
	{
		path: '/doc/:id',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title={'Docs'}>
					<DocsFullView />
				</AuthWrapper>
			</Suspense>
		),
	},
	// ========================================
	// CONTACTS
	// ========================================
	{
		path: '/contacts',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper
					title={'Contacts'}
					outerContainerStyle={{ padding: '0 32px 0 0' }}
					childrenContainerStyles={{ maxWidth: '100%' }}
				>
					<Contacts />
				</AuthWrapper>
			</Suspense>
		),
	},
	{
		path: '/contact/:contactId',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper
					title="Contact Details"
					outerContainerStyle={{ padding: '0 32px 0 0' }}
					childrenContainerStyles={{ maxWidth: '100%' }}
				>
					<ExpandedClientView />
				</AuthWrapper>
			</Suspense>
		),
	},
	// ========================================
	// FILES
	// ========================================
	{
		path: '/files',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title="Files" maxWidth={'100%'}>
					<Files />
				</AuthWrapper>
			</Suspense>
		),
	},
	// ========================================
	// INTEGRATIONS
	// ========================================
	{
		path: '/integrations',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title={'Integrations'}>
					<Integrations />
				</AuthWrapper>
			</Suspense>
		),
	},
	// ========================================
	// BUILDER
	// ========================================
	{
		path: '/builder/*',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper
					title="Builder"
					outerContainerStyle={{ padding: '0px', backgroundColor: '#fff' }}
					childrenContainerStyles={{ maxWidth: '100%' }}
					showSidebar={false}
				>
					<BuilderApp />
				</AuthWrapper>
			</Suspense>
		),
	},
	// ========================================
	// SETTINGS
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
	// PRICING
	// ========================================
	{
		path: '/pricing',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title={'Pricing'}>
					<PricingPage />
				</AuthWrapper>
			</Suspense>
		),
	},
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

export default betaRoutes;
