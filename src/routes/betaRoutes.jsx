import { Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

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
import GalleryPage from '../views/features/gallery/GalleryPage';
import GalleryViewer from '../views/features/gallery/GalleryViewer';
import AlbumSettings from '../views/features/gallery/AlbumSettings';
import UploadPhotos from '../views/features/gallery/UploadPhotos';
import InitialHomePage from '../views/features/homePage/InitialHomePage';
import ShareAndEarn from '../views/features/shareAndEarn/ShareAndEarn';
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
import BrandSetup from '../views/features/settings/BrandSetup';
import DocsFullView from '../views/components/docs/DocsFullView';
import ElasticSearch from '../views/features/elasticSearch/ElasticSearch';
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
import AmbientAi from '../views/features/ambientAi/AmbientAi';

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

// components
import SuspenseFallback from '../views/components/globalComponents/SuspenseFallback';
// import MeetBot from '../views/features/meetBot/meetBot';
import NotesWrapper from '../views/features/notesModule/NotesWrapper';
import CardMeetBot from '../views/features/meetBot/CardMeetBot';
import ChatPage from '../views/components/homePage/ChatPage';

const betaRoutes = [
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
				<Onboarding />
			</Public>
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
		path: '/share-and-earn',
		element: (
			<AuthWrapper title={'Share and Earn'}>
				<ShareAndEarn />
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
				<RecentChat />
			</AuthWrapper>
		),
	},
	{
		path: '/playbook',
		element: (
			<AuthWrapper title={'Sales'}>
				<GlobalWorkflows />
			</AuthWrapper>
		),
	},

	{
		path: '/early-access',
		element: (
			<AuthWrapper title={'Early Access'}>
				<EarlyAccess />
			</AuthWrapper>
		),
	},
	{
		path: '/brand-setup',
		element: (
			<AuthWrapper title={'Brand Setup'}>
				<BrandSetup />
			</AuthWrapper>
		),
	},
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
		path: '/tasks',
		element: (
			<AuthWrapper
				title={'Tasks'}
				outerContainerStyle={{ padding: '0 32px 0 0' }}
				childrenContainerStyles={{ maxWidth: '100%' }}
			>
				<Suspense fallback={<SuspenseFallback />}>
					<Tasks />
				</Suspense>
			</AuthWrapper>
		),
	},
	{
		path: '/task/:taskId',
		element: (
			<AuthWrapper title={'Tasks'}>
				<Suspense fallback={<SuspenseFallback />}>
					<TaskFullView />
				</Suspense>
			</AuthWrapper>
		),
	},
	{
		path: '/integrations',
		element: (
			<AuthWrapper title={'Integrations'}>
				<Suspense fallback={<SuspenseFallback />}>
					<Integrations />
				</Suspense>
			</AuthWrapper>
		),
	},

	{
		path: '/calendar',
		element: (
			<AuthWrapper
				title={'Calendar'}
				outerContainerStyle={{ overflow: 'hidden', padding: '0 32px 0 0 ' }}
				childrenContainerStyles={{ maxWidth: '100%' }}
			>
				<Suspense fallback={<SuspenseFallback />}>
					<CalendarModule />
				</Suspense>
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
	{
		path: '/pricing',
		element: (
			<AuthWrapper title={'Pricing'}>
				<PricingPage />
			</AuthWrapper>
		),
	},
	{
		path: '/notes',
		element: (
			<AuthWrapper title={'Notes'} outerContainerStyle={{ padding: '0' }}>
				<Suspense fallback={<SuspenseFallback />}>
					<NotesPage />
				</Suspense>
			</AuthWrapper>
		),
	},
	{
		path: '/database',
		element: (
			<AuthWrapper title={'Notes'} outerContainerStyle={{ padding: '0' }}>
				<Suspense fallback={<SuspenseFallback />}>
					<NotesPage isDatabase={true} />
				</Suspense>
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
				<Suspense fallback={<SuspenseFallback />}>
					<Contacts />
				</Suspense>
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
				<Suspense fallback={<SuspenseFallback />}>
					<Notes />
				</Suspense>
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
				<Suspense fallback={<SuspenseFallback />}>
					<Notes isDatabase={true} />
				</Suspense>
			</AuthWrapper>
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
	{
		path: '/contact/:contactId',
		element: (
			<AuthWrapper
				title="Contact Details"
				outerContainerStyle={{ padding: '0 32px 0 0' }}
				childrenContainerStyles={{ maxWidth: '100%' }}
			>
				<Suspense fallback={<SuspenseFallback />}>
					<ExpandedClientView />
				</Suspense>
			</AuthWrapper>
		),
	},
	{
		path: '/search',
		element: (
			<AuthWrapper title="Search">
				<ElasticSearch />
			</AuthWrapper>
		),
	},
	{
		path: '/files',
		element: (
			<AuthWrapper title="Files" maxWidth={'100%'}>
				<Suspense fallback={<SuspenseFallback />}>
					<Files />
				</Suspense>
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
	{
		path: '/builder/*',
		element: (
			<AuthWrapper
				title="Builder"
				outerContainerStyle={{ padding: '0px', backgroundColor: '#fff' }}
				childrenContainerStyles={{ maxWidth: '100%' }}
				showSidebar={false}
			>
				<Suspense fallback={<SuspenseFallback />}>
					<BuilderApp />
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
				{/* <MeetBot /> */}
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

export default betaRoutes;
