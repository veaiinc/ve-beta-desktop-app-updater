import { lazy, Suspense } from 'react';

const AuthWrapper = lazy(() => import('../views/layouts/authWrapper'));
const CalendarModule = lazy(() => import('../views/features/calendar/Calendar'));
const GlobalWorkflows = lazy(() => import('../views/features/sales/GlobalWorkflows'));
const EarlyAccess = lazy(() => import('../views/features/earlyAccess/EarlyAccess'));
const AddGallery = lazy(() => import('../views/features/gallery/AddGallery'));
const GalleryPage = lazy(() => import('../views/features/gallery/GalleryPage'));
const GalleryViewer = lazy(() => import('../views/features/gallery/GalleryViewer'));
const AlbumSettings = lazy(() => import('../views/features/gallery/AlbumSettings'));
const UploadPhotos = lazy(() => import('../views/features/gallery/UploadPhotos'));
const GalleryViewLayout = lazy(() => import('../views/layouts/galleryViewLayout'));
const InitialHomePage = lazy(() => import('../views/features/homePage/InitialHomePage'));
const ShareAndEarn = lazy(() => import('../views/features/shareAndEarn/ShareAndEarn'));
const SettingsWrapper = lazy(() => import('../views/features/settings/SettingsWrapper'));
const Tasks = lazy(() => import('../views/features/tasks/Tasks'));
const Notes = lazy(() => import('../views/features/notesModule/Notes'));
const Docs = lazy(() => import('../views/features/docs/Docs'));
const LiteGallery = lazy(() => import('../views/features/gallery/Litegallery'));
const MyTemplates = lazy(() => import('../views/features/myTemplates/MyTemplates'));
const Forms = lazy(() => import('../views/features/forms/Forms'));
const FormLeads = lazy(() => import('../views/features/forms/FormLeads'));
const EditAgent = lazy(() => import('../views/features/aiAssistant/EditAgent'));
const AgentDetails = lazy(() => import('../views/features/aiAssistant/AgentDetails'));
const RecentChat = lazy(() => import('../views/features/chat/RecentChat'));
const AutomationBuilder = lazy(() => import('../views/features/automationBuilder/AutomationBuilder'));
const AutomationBuilderLayout = lazy(() => import('../views/layouts/automationBuilderLayout'));
const Automations = lazy(() => import('../views/features/automations/Automations'));
const BrandSetup = lazy(() => import('../views/features/settings/BrandSetup'));
const DocsFullView = lazy(() => import('../views/components/docs/DocsFullView'));
const TaskFullView = lazy(() => import('../views/features/tasks/TaskFullView'));
const ExpandedClientView = lazy(() => import('../views/features/contacts/ExpandedClientView'));
const ElasticSearch = lazy(() => import('../views/features/elasticSearch/ElasticSearch'));
const EditKnowledgeAgent = lazy(() => import('../views/features/knowledgeAgent/EditAgent'));
const FormResCard = lazy(() => import('../views/components/forms/FormResCard'));
const FormSummary = lazy(() => import('../views/components/forms/FormSummary'));
const Integrations = lazy(() => import('../views/features/integrationsList/Integrations'));
const SchedulerMainPage = lazy(() => import('../views/features/calendar/SchedulerMainPage'));
const EditScheduler = lazy(() => import('../views/features/calendar/EditScheduler'));
const Contacts = lazy(() => import('../views/features/contacts/Contacts'));
const PricingPage = lazy(() => import('../views/features/pricingPlans/pricingPage'));
const ProactiveAi = lazy(() => import('../views/features/proactiveAi/ProactiveAi'));
const NotesPage = lazy(() => import('../views/features/notesPage/NotesPage'));
const KnowledgeAgents = lazy(() => import('../views/features/knowledgeAgent/KnowledgeAgents'));
const Files = lazy(() => import('../views/features/files/Files'));
const AiAssistants = lazy(() => import('../views/features/aiAssistant/AiAssistants'));
const KnowledgeAgentDetails = lazy(() => import('../views/features/knowledgeAgent/AgentDetails'));

const BuilderApp = lazy(() => import('../../builderSrc/App'));

import Agents from '../views/features/agents/Agents';
import Agent from '../views/features/agents/agent/Agent';

const betaRoutes = [
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
				outerContainerStyle={{ paddingRight: '0px', backgroundColor: '' }}
				authParentContainerStyle={{ backgroundColor: 'var(--background-color)' }}
				maxWidth="100%"
				showDynamicWidget={false}
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
	{
		path: '/integrations',
		element: (
			<AuthWrapper title={'Integrations'}>
				<Integrations />
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
				<NotesPage />
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
				<ExpandedClientView />
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
				<Files />
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
				<Suspense fallback={'loading builder...'}>
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
];

export default betaRoutes;
