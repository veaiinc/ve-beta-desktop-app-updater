import { Navigate } from 'react-router-dom';
// layouts
import AuthWrapper from '../views/layouts/authWrapper';
import GalleryViewLayout from '../views/layouts/galleryViewLayout';
import AutomationBuilderLayout from '../views/layouts/automationBuilderLayout';
import SmartFileLayout from '../views/layouts/smartFileLayout';
import WorkflowBuilderLayout from '../views/layouts/workflowBuilderLayout';
import Public from '../views/layouts/Public';
// Protected Pages
import GlobalWorkflows from '../views/features/sales/GlobalWorkflows';
import EarlyAccess from '../views/features/earlyAccess/EarlyAccess';
import AddGallery from '../views/features/gallery/AddGallery';
import AlbumSettings from '../views/features/gallery/AlbumSettings';
import UploadPhotos from '../views/features/gallery/UploadPhotos';
import InitialHomePage from '../views/features/homePage/InitialHomePage';
// import ShareAndEarn from '../views/features/shareAndEarn/ShareAndEarn';
import SettingsWrapper from '../views/features/settings/SettingsWrapper';
import Docs from '../views/features/docs/Docs';
import LiteGallery from '../views/features/gallery/Litegallery';
import MyTemplates from '../views/features/myTemplates/MyTemplates';
import Forms from '../views/features/forms/Forms';
import FormLeads from '../views/features/forms/FormLeads';
import EditAgent from '../views/features/aiAssistant/EditAgent';
import AgentDetails from '../views/features/aiAssistant/AgentDetails';
import RecentChat from '../views/features/chat/RecentChat';
import AutomationBuilder from '../views/features/automationBuilder/AutomationBuilder';
import Automations from '../views/features/automations/Automations';
import DocsFullView from '../views/components/docs/DocsFullView';
import EditKnowledgeAgent from '../views/features/knowledgeAgent/EditAgent';
import FormResCard from '../views/components/forms/FormResCard';
import FormSummary from '../views/components/forms/FormSummary';
import SchedulerMainPage from '../views/features/calendar/SchedulerMainPage';
import EditScheduler from '../views/features/calendar/EditScheduler';
import PricingPage from '../views/features/pricingPlans/pricingPage';
import ProactiveAi from '../views/features/proactiveAi/ProactiveAi';
import KnowledgeAgents from '../views/features/knowledgeAgent/KnowledgeAgents';
import AiAssistants from '../views/features/aiAssistant/AiAssistants';
import KnowledgeAgentDetails from '../views/features/knowledgeAgent/AgentDetails';
import SmartFile from '../views/features/sales/smartFiles/SmartFile';
import WorkflowBuilder from '../views/features/workflowBuilder/WorkflowBuilder';
import Workflow_builder_updated from '../views/features/workflowBuilderUpdated/WorkflowBuilderUpdated';
import Onboarding from '../views/features/onboarding/Onboarding';
import Contacts from '../views/features/contacts/Contacts';
import Files from '../views/features/files/Files';
import ExpandedClientView from '../views/features/contacts/ExpandedClientView';
import BuilderApp from '../../builderSrc/App';
import Notes from '../views/features/notesModule/Notes';
import Agents from '../views/features/agents/Agents';
import Agent from '../views/features/agents/agent/Agent';
import CalendarModule from '../views/features/calendar/Calendar';
import Tasks from '../views/features/tasks/Tasks';
import TaskFullView from '../views/features/tasks/TaskFullView';
import Integrations from '../views/features/integrationsList/Integrations';
import NotesPage from '../views/features/notesPage/NotesPage';
import GalleryPage from '../views/features/gallery/GalleryPage';
import GalleryViewer from '../views/features/gallery/GalleryViewer';
import UploadPhotosDesktop from '../views/features/gallery/UploadPhotosDesktop';
// components
import MeetBotWrapper from '../views/features/meetBot/meetBotWrapper';
import ProactiveSuggestions from '../views/features/homePage/ProactiveSuggestions';
import CardMeetBot from '../views/features/meetBot/CardMeetBot';
import ChatPage from '../views/components/homePage/ChatPage';
import NotesWrapper from '../views/features/notesModule/NotesWrapper';
const betaRoutes = [
	// ========================================
	// ONBOARDING, HOME & FEATURES
	// ========================================
	{
		path: '/home',
		element: (
			<AuthWrapper title={'Tools'}>
				<InitialHomePage />
			</AuthWrapper>
		),
	},
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
	{
		path: '/early-access',
		element: (
			<AuthWrapper title={'Early Access'}>
				<EarlyAccess />
			</AuthWrapper>
		),
	},
	// ========================================
	// AI & ASSISTANT FEATURES
	// ========================================
	{
		path: '/ambient-ai',
		element: (
			<AuthWrapper
				title={'Ambient AI'}
				outerContainerStyle={{ overflow: 'hidden' }}
				childrenContainerStyles={{ overflow: 'auto' }}
				showBottomToolbar={false}
			>
				<ProactiveSuggestions />
			</AuthWrapper>
		),
	},
	{
		path: '/ai-assistant',
		element: (
			<AuthWrapper title={'AI Assistant'}>
				<AiAssistants />
			</AuthWrapper>
		),
	},
	{
		path: '/ai-assistant/:aiAssistantId',
		element: (
			<AuthWrapper title={'AI Assistant'}>
				<AgentDetails />
			</AuthWrapper>
		),
	},
	{
		path: '/ai-assistant/:aiAssistantId/edit',
		element: (
			<AuthWrapper title={'AI Assistant'}>
				<EditAgent />
			</AuthWrapper>
		),
	},
	{
		path: '/knowledge-agent',
		element: (
			<AuthWrapper
				title={'Knowledge Agent'}
				innerContainerStyle={{ paddingBottom: '0px' }}
				showBottomToolbar={false}
			>
				<KnowledgeAgents />
			</AuthWrapper>
		),
	},
	{
		path: '/knowledge-agent/:agentId',
		element: (
			<AuthWrapper
				title={'Knowledge Agent'}
				showBottomToolbar={false}
				innerContainerStyle={{ paddingBottom: '0px' }}
			>
				<KnowledgeAgentDetails />
			</AuthWrapper>
		),
	},
	{
		path: '/knowledge-agent/:agentId/edit',
		element: (
			<AuthWrapper
				title={'Knowledge Agent'}
				showBottomToolbar={false}
				outerContainerStyle={{ paddingRight: '0px' }}
			>
				<EditKnowledgeAgent />
			</AuthWrapper>
		),
	},
	{
		path: '/proactiveai/:proactiveAiId',
		element: (
			<AuthWrapper title="Proactive AI" childrenContainerStyles={{ maxWidth: '100%' }}>
				<ProactiveAi />
			</AuthWrapper>
		),
	},
	// {
	// 	path: '/agents',
	// 	element: (
	// 		<AuthWrapper title={'Share and Earn'}>
	// 			<ShareAndEarn />
	// 		</AuthWrapper>
	// 	),
	// },
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
	// ========================================
	// CHAT
	// ========================================
	{
		path: '/agent/:agentId',
		element: (
			<AuthWrapper title="Agent">
				<Agent />
			</AuthWrapper>
		),
	},
	// ========================================
	// CHAT
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
					backgroundColor: 'var(--chat-background-color)',
				}}
				authParentContainerStyle={{ backgroundColor: 'var(--background-color)' }}
				maxWidth="100%"
			>
				<RecentChat showChatHistory={true} showDeleteChat={true} showChats={true} />
			</AuthWrapper>
		),
	},
	// ========================================
	// MEET
	// ========================================
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
	// {
	// 	path: '/brand-setup',
	// 	element: (
	//
	// 			<AuthWrapper title={'Brand Setup'}>
	// 				<BrandSetup />
	// 			</AuthWrapper>
	//
	// 	),
	// },
	// ========================================
	// GALLERY
	// ========================================
	{
		path: '/galleries',
		element: (
			<AuthWrapper title={'Galleries'} showBottomToolbar={false}>
				<AddGallery />
			</AuthWrapper>
		),
	},
	{
		path: '/lite-gallery',
		element: (
			<AuthWrapper title={'Lite Gallery'} showBottomToolbar={false}>
				<LiteGallery />
			</AuthWrapper>
		),
	},
	{
		path: '/galleries/:galleryId',
		element: (
			<AuthWrapper title={'Gallery'} showBottomToolbar={false}>
				<GalleryPage />
			</AuthWrapper>
		),
	},
	{
		path: '/galleries/:galleryId/:albumId/upload-photos',
		element: (
			<AuthWrapper title={'Upload Photos'} showBottomToolbar={false}>
				<UploadPhotos />
			</AuthWrapper>
		),
	},
	{
		path: '/galleries/:galleryId/:albumId/upload-photos-desktop',
		element: (
			<AuthWrapper title={'Upload Photos'} showBottomToolbar={false}>
				<UploadPhotosDesktop />
			</AuthWrapper>
		),
	},
	{
		path: '/galleries/:galleryId/:albumId/album-settings',
		element: (
			<AuthWrapper title={'Album Settings'} showBottomToolbar={false}>
				<AlbumSettings />
			</AuthWrapper>
		),
	},
	{
		path: '/galleries/:galleryId/:albumId/gallery-viewer',
		element: (
			<GalleryViewLayout title={'Gallery Viewer'}>
				<GalleryViewer />
			</GalleryViewLayout>
		),
	},
	// ========================================
	// PLAYBOOK
	// ========================================
	{
		path: '/playbook',
		element: (
			<AuthWrapper title={'Sales'}>
				<GlobalWorkflows />
			</AuthWrapper>
		),
	},
	// ========================================
	// WORKFLOW & AUTOMATION
	// ========================================
	{
		path: '/smart-file/:templateId/:workflowId',
		element: (
			<SmartFileLayout title={'Smart File'}>
				<SmartFile />
			</SmartFileLayout>
		),
	},
	{
		path: '/workflow_builder/:templateId',
		element: (
			<WorkflowBuilderLayout title={'Workflow Builder'}>
				<WorkflowBuilder />
			</WorkflowBuilderLayout>
		),
	},
	{
		path: '/automation_builder/:templateId',
		element: (
			<WorkflowBuilderLayout title={'Workflow Builder'}>
				<Workflow_builder_updated />
			</WorkflowBuilderLayout>
		),
	},
	{
		path: '/automation-builder/:automationId',
		element: (
			<AutomationBuilderLayout title={'Automation Builder'}>
				<AutomationBuilder />
			</AutomationBuilderLayout>
		),
	},
	{
		path: '/automations',
		element: (
			<AuthWrapper title={'Automations'}>
				<Automations />
			</AuthWrapper>
		),
	},
	// ========================================
	// FORMS & TEMPLATES
	// ========================================
	{
		path: '/form',
		element: (
			<AuthWrapper title={'Forms'}>
				<Forms />
			</AuthWrapper>
		),
	},
	{
		path: '/form/:id',
		element: (
			<AuthWrapper title={'Form Leads'}>
				<FormLeads />
			</AuthWrapper>
		),
	},
	{
		path: '/forms/:id/responses',
		element: (
			<AuthWrapper title={'Form Responses'}>
				<FormResCard view="responses" />
			</AuthWrapper>
		),
	},
	{
		path: '/forms/:id/summary',
		element: (
			<AuthWrapper title={'Form Summary'}>
				<FormSummary view="summary" />
			</AuthWrapper>
		),
	},
	{
		path: '/my-templates',
		element: (
			<AuthWrapper title={'My Templates'}>
				<MyTemplates />
			</AuthWrapper>
		),
	},
	// ========================================
	// CALENDAR & SCHEDULING
	// ========================================
	{
		path: '/calendar',
		element: (
			<AuthWrapper
				title={'Calendar'}
				outerContainerStyle={{ overflow: 'hidden', padding: '0 32px 0 0 ' }}
				childrenContainerStyles={{ maxWidth: '100%' }}
			>
				<CalendarModule />
			</AuthWrapper>
		),
	},
	{
		path: '/scheduler',
		element: (
			<AuthWrapper title={'Scheduler'} maxWidth={'95%'}>
				<SchedulerMainPage />
			</AuthWrapper>
		),
	},
	{
		path: '/scheduling/edit/:sessionId',
		element: (
			<AuthWrapper title={'Scheduling'} maxWidth={'95%'}>
				<EditScheduler />
			</AuthWrapper>
		),
	},
	// ========================================
	// TASKS
	// ========================================
	{
		path: '/tasks',
		element: (
			<AuthWrapper
				title={'Tasks'}
				outerContainerStyle={{ padding: '0 32px 0 0' }}
				childrenContainerStyles={{ maxWidth: '100%' }}
			>
				<Tasks />
			</AuthWrapper>
		),
	},
	{
		path: '/task/:taskId',
		element: (
			<AuthWrapper title={'Tasks'}>
				<TaskFullView />
			</AuthWrapper>
		),
	},
	// ========================================
	// NOTES & DOCUMENTS
	// ========================================
	{
		path: '/notes',
		element: (
			<AuthWrapper title={'Notes'} outerContainerStyle={{ padding: '0' }}>
				<NotesPage />
			</AuthWrapper>
		),
	},
	{
		path: '/database',
		element: (
			<AuthWrapper title={'Notes'} outerContainerStyle={{ padding: '0' }}>
				<NotesPage isDatabase={true} />
			</AuthWrapper>
		),
	},
	{
		path: '/contacts',
		element: (
			<AuthWrapper
				title={'Contacts'}
				outerContainerStyle={{ padding: '0 32px 0 0' }}
				childrenContainerStyles={{ maxWidth: '100%' }}
			>
				<Contacts />
			</AuthWrapper>
		),
	},
	{
		path: '/ai-assistant',
		element: (
			<AuthWrapper title={'AI Assistant'}>
				<AiAssistants />
			</AuthWrapper>
		),
	},
	{
		path: '/ai-assistant/:aiAssistantId',
		element: (
			<AuthWrapper title={'AI Assistant'}>
				<AgentDetails />
			</AuthWrapper>
		),
	},
	{
		path: '/ai-assistant/:aiAssistantId/edit',
		element: (
			<AuthWrapper title={'AI Assistant'}>
				<EditAgent />
			</AuthWrapper>
		),
	},
	{
		path: '/docs',
		element: (
			<AuthWrapper title={'Docs'}>
				<Docs />
			</AuthWrapper>
		),
	},
	{
		path: '/knowledge-agent',
		element: (
			<AuthWrapper
				title={'Knowledge Agent'}
				innerContainerStyle={{ paddingBottom: '0px' }}
				showBottomToolbar={false}
			>
				<KnowledgeAgents />
			</AuthWrapper>
		),
	},
	{
		path: '/knowledge-agent/:agentId',
		element: (
			<AuthWrapper
				title={'Knowledge Agent'}
				showBottomToolbar={false}
				innerContainerStyle={{ paddingBottom: '0px' }}
			>
				<KnowledgeAgentDetails />
			</AuthWrapper>
		),
	},
	{
		path: '/knowledge-agent/:agentId/edit',
		element: (
			<AuthWrapper
				title={'Knowledge Agent'}
				showBottomToolbar={false}
				outerContainerStyle={{ paddingRight: '0px' }}
			>
				<EditKnowledgeAgent />
			</AuthWrapper>
		),
	},
	{
		path: '/doc/:id',
		element: (
			<AuthWrapper title={'Docs'}>
				<DocsFullView />
			</AuthWrapper>
		),
	},
	{
		path: '/my-templates',
		element: (
			<AuthWrapper title={'My Templates'}>
				<MyTemplates />
			</AuthWrapper>
		),
	},
	{
		path: '/automation-builder/:automationId',
		element: (
			<AutomationBuilderLayout title={'Automation Builder'}>
				<AutomationBuilder />
			</AutomationBuilderLayout>
		),
	},
	{
		path: '/form',
		element: (
			<AuthWrapper title={'Forms'}>
				<Forms />
			</AuthWrapper>
		),
	},
	{
		path: '/form/:id',
		element: (
			<AuthWrapper title={'Form Leads'}>
				<FormLeads />
			</AuthWrapper>
		),
	},
	{
		path: '/forms/:id/responses',
		element: (
			<AuthWrapper title={'Form Responses'}>
				<FormResCard view="responses" />
			</AuthWrapper>
		),
	},
	{
		path: '/forms/:id/summary',
		element: (
			<AuthWrapper title={'Form Summary'}>
				<FormSummary view="summary" />
			</AuthWrapper>
		),
	},
	{
		path: '/note/:noteId',
		element: (
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
				<Notes />
			</AuthWrapper>
		),
	},
	{
		path: '/note/:noteId/database',
		element: (
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
		),
	},
	{
		path: '/docs',
		element: (
			<AuthWrapper title={'Docs'}>
				<Docs />
			</AuthWrapper>
		),
	},
	{
		path: '/doc/:id',
		element: (
			<AuthWrapper title={'Docs'}>
				<DocsFullView />
			</AuthWrapper>
		),
	},
	// ========================================
	// CONTACTS
	// ========================================
	{
		path: '/contacts',
		element: (
			<AuthWrapper
				title={'Contacts'}
				outerContainerStyle={{ padding: '0 32px 0 0' }}
				childrenContainerStyles={{ maxWidth: '100%' }}
			>
				<Contacts />
			</AuthWrapper>
		),
	},
	{
		path: '/contact/:contactId',
		element: (
			<AuthWrapper
				title="Contact Details"
				outerContainerStyle={{ padding: '0 32px 0 0' }}
				childrenContainerStyles={{ maxWidth: '100%' }}
			>
				<ExpandedClientView />
			</AuthWrapper>
		),
	},
	// {
	// 	path: '/search',
	// 	element: (
	//
	// 			<AuthWrapper title="Search">
	// 				<ElasticSearch />
	// 			</AuthWrapper>
	//
	// 	),
	// },
	// ========================================
	// FILES
	// ========================================
	{
		path: '/files',
		element: (
			<AuthWrapper title="Files" maxWidth={'100%'}>
				<Files />
			</AuthWrapper>
		),
	},
	// ========================================
	// INTEGRATIONS
	// ========================================
	{
		path: '/integrations',
		element: (
			<AuthWrapper title={'Integrations'}>
				<Integrations />
			</AuthWrapper>
		),
	},
	// ========================================
	// BUILDER
	// ========================================
	{
		path: '/builder/*',
		element: (
			<AuthWrapper
				title="Builder"
				outerContainerStyle={{ padding: '0px', backgroundColor: '#fff' }}
				childrenContainerStyles={{ maxWidth: '100%' }}
				showSidebar={false}
			>
				<BuilderApp />
			</AuthWrapper>
		),
	},
	// ========================================
	// SETTINGS
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
	// PRICING
	// ========================================
	{
		path: '/pricing',
		element: (
			<AuthWrapper title={'Pricing'}>
				<PricingPage />
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
];
export default betaRoutes;
