import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import Landing_screen from './views/features/landingScreen/LandingPage';

// Lazy load components
const AuthWrapper = lazy(() => import('./views/layouts/authWrapper'));
const Onboarding = lazy(() => import('./views/features/onboarding/Onboarding'));

// Lazy load components
const CalendarModule = lazy(() => import('./views/features/calendar/Calendar'));
const OauthVerify = lazy(() => import('./views/features/signin/oauth/OauthVerify'));
const GlobalWorkflows = lazy(() => import('./views/features/sales/GlobalWorkflows'));
const SmartFile = lazy(() => import('./views/features/sales/smartFiles/SmartFile'));
const WorkflowBuilderLayout = lazy(() => import('./views/layouts/workflowBuilderLayout'));
const SmartFileLayout = lazy(() => import('./views/layouts/smartFileLayout'));
const EarlyAccess = lazy(() => import('./views/features/earlyAccess/EarlyAccess'));
const PrivacyPolicy = lazy(() => import('./views/features/signin/PrivacyPolicy'));
const ChageLog = lazy(() => import('./views/features/signin/ChageLog'));

const AddGallery = lazy(() => import('./views/features/gallery/AddGallery'));
const GalleryPage = lazy(() => import('./views/features/gallery/GalleryPage'));
const GalleryViewer = lazy(() => import('./views/features/gallery/GalleryViewer'));
const AlbumSettings = lazy(() => import('./views/features/gallery/AlbumSettings'));
const UploadPhotos = lazy(() => import('./views/features/gallery/UploadPhotos'));
const GalleryViewLayout = lazy(() => import('./views/layouts/galleryViewLayout'));
const TermsOfService = lazy(() => import('./views/features/signin/TermsOfService'));
const CookiePolicy = lazy(() => import('./views/features/signin/CookiePolicy'));
const WorkflowBuilder = lazy(() => import('./views/features/workflowBuilder/WorkflowBuilder'));
const Tasks = lazy(() => import('./views/features/tasks/Tasks'));
const Notes = lazy(() => import('./views/features/notesModule/Notes'));
const Docs = lazy(() => import('./views/features/docs/Docs'));
const LiteGallery = lazy(() => import('./views/features/gallery/Litegallery'));
const MyTemplates = lazy(() => import('./views/features/myTemplates/MyTemplates'));
const Forms = lazy(() => import('./views/features/forms/Forms'));
const FormLeads = lazy(() => import('./views/features/forms/FormLeads'));
const EditAgent = lazy(() => import('./views/features/aiAssistant/EditAgent'));
const AgentDetails = lazy(() => import('./views/features/aiAssistant/AgentDetails'));
const InitialHomePage = lazy(() => import('./views/features/homePage/InitialHomePage'));
const RecentChat = lazy(() => import('./views/features/chat/RecentChat'));
const AutomationBuilder = lazy(() =>
	import('./views/features/automationBuilder/AutomationBuilder'),
);
const AutomationBuilderLayout = lazy(() => import('./views/layouts/automationBuilderLayout'));
const Automations = lazy(() => import('./views/features/automations/Automations'));
const BrandSetup = lazy(() => import('./views/features/settings/BrandSetup'));
const DocsFullView = lazy(() => import('./views/components/docs/DocsFullView'));
const TaskFullView = lazy(() => import('./views/features/tasks/TaskFullView'));
const ExpandedClientView = lazy(() => import('./views/features/contacts/ExpandedClientView'));
const ElasticSearch = lazy(() => import('./views/features/elasticSearch/ElasticSearch'));
const PublicChat = lazy(() => import('./views/features/publicChat/PublicChat'));
const EditKnowledgeAgent = lazy(() => import('./views/features/knowledgeAgent/EditAgent'));
const FormResCard = lazy(() => import('./views/components/forms/FormResCard'));
const FormSummary = lazy(() => import('./views/components/forms/FormSummary'));
const Integrations = lazy(() => import('./views/features/integrationsList/Integrations'));
const SchedulerMainPage = lazy(() => import('./views/features/calendar/SchedulerMainPage'));
const EditScheduler = lazy(() => import('./views/features/calendar/EditScheduler'));
const Contacts = lazy(() => import('./views/features/contacts/Contacts'));
const PricingPage = lazy(() => import('./views/features/pricingPlans/pricingPage'));
const ProactiveAi = lazy(() => import('./views/features/proactiveAi/ProactiveAi'));
const ShareAndEarn = lazy(() => import('./views/features/shareAndEarn/ShareAndEarn'));
const NotesPage = lazy(() => import('./views/features/notesPage/NotesPage'));
const BuilderApp = lazy(() => import('../builderSrc/App'));
const KnowledgeAgents = lazy(() => import('./views/features/knowledgeAgent/KnowledgeAgents'));
const SettingsWrapper = lazy(() => import('./views/features/settings/SettingsWrapper'));
const Files = lazy(() => import('./views/features/files/Files'));
const Workflow_builder_updated = lazy(() =>
	import('./views/features/workflowBuilderUpdated/WorkflowBuilderUpdated'),
);
const AiAssistants = lazy(() => import('./views/features/aiAssistant/AiAssistants'));
const KnowledgeAgentDetails = lazy(() => import('./views/features/knowledgeAgent/AgentDetails'));
const LoginPage = lazy(() => import('./views/features/loginPage/LoginPage'));

const routes = [
	{
		path: '/',
		component: <Landing_screen />,
	},
	{
		path: '/mission',
		component: <Landing_screen />,
	},
	{
		path: '/contact-us',
		component: <Landing_screen />,
	},
	{
		path: '/pricing',
		component: <Landing_screen />,
	},
	{
		path: '/api',
		component: <Landing_screen />,
	},
	{
		path: '/onboarding',
		component: <Onboarding />,
	},
	{
		path: '/create-workspace',
		component: <Onboarding />,
	},
	{
		path: '/verify-user',
		component: <LoginPage />,
	},
	{
		path: '/referral/:referralCode',
		component: <LoginPage />,
	},
	// {
	// 	path: '/login-with-password',
	// 	component: <LoginScreen stage={'login-with-password'} />,
	// },
	// {
	// 	path: '/signup-user',
	// 	component: <LoginScreen stage={'signup-user'} />,
	// },
	// {
	// 	path: '/verify-email-code',
	// 	component: <LoginScreen stage={'verify-email-code'} />,
	// },
	// {
	// 	path: '/create-workspace',
	// 	component: <LoginScreen stage={'create-workspace'} />,
	// },
	// {
	// 	path: '/forgot-password',
	// 	component: <LoginScreen stage={'forgot-password'} />,
	// },
	{
		path: '/user/verify-oauth-user',
		component: <OauthVerify />,
	},
	{
		path: '/privacy-policy',
		component: <PrivacyPolicy />,
	},
	{
		path: '/terms-of-service',
		component: <TermsOfService />,
	},
	{
		path: '/cookie-policy',
		component: <CookiePolicy />,
	},
	{
		path: '/changelog',
		component: <ChageLog />,
	},
	// {
	// 	path: '/inbox',
	// 	component: (
	// 		<AuthWrapper title={'Inbox'}>
	// 			<ChatScreen />
	// 		</AuthWrapper>
	// 	),
	// 	exact: true,
	// },

	{
		path: '/home',
		component: (
			<AuthWrapper
				title={'Home'}
				outerContainerStyle={{ overflow: 'hidden' }}
				showBottomToolbar={false}
			>
				<InitialHomePage />
			</AuthWrapper>
		),
		exact: true,
	},

	{
		path: '/playbook',
		component: (
			<AuthWrapper title={'Sales'}>
				<GlobalWorkflows />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/share-and-earn',
		component: (
			<AuthWrapper title={'Share and Earn'}>
				<ShareAndEarn />
			</AuthWrapper>
		),
		exact: true,
	},

	{
		path: '/workflow_builder/:templateId',
		component: (
			<WorkflowBuilderLayout title={'Workflow Builder'}>
				<WorkflowBuilder />
			</WorkflowBuilderLayout>
		),
		exact: true,
	},
	{
		path: '/automation_builder/:templateId',
		component: (
			<WorkflowBuilderLayout title={'Workflow Builder'}>
				<Workflow_builder_updated />
			</WorkflowBuilderLayout>
		),
		exact: true,
	},

	{
		path: '/smart-file/:templateId/:workflowId',
		component: (
			<SmartFileLayout title={'Smart File'}>
				<SmartFile />
			</SmartFileLayout>
		),
		exact: true,
	},
	{
		path: '/early-access',
		component: (
			<AuthWrapper title={'Early Access'}>
				<EarlyAccess />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/settings/:type',
		component: (
			<AuthWrapper title={'Workspace Settings'}>
				<SettingsWrapper />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/brand-setup',
		component: (
			<AuthWrapper title={'Brand Setup'}>
				<BrandSetup />
			</AuthWrapper>
		),
	},
	{
		path: '/galleries',
		component: (
			<AuthWrapper title={'Galleries'} showBottomToolbar={false}>
				<AddGallery />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/lite-gallery',
		component: (
			<AuthWrapper title={'Lite Gallery'} showBottomToolbar={false}>
				<LiteGallery />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/galleries/:galleryId',
		component: (
			<AuthWrapper title={'Gallery'} showBottomToolbar={false}>
				<GalleryPage />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/galleries/:galleryId/:albumId/upload-photos',
		component: (
			<AuthWrapper title={'Upload Photos'} showBottomToolbar={false}>
				<UploadPhotos />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/galleries/:galleryId/:albumId/album-settings',
		component: (
			<AuthWrapper title={'Album Settings'} showBottomToolbar={false}>
				<AlbumSettings />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/galleries/:galleryId/:albumId/gallery-viewer',
		component: (
			<GalleryViewLayout title={'Gallery Viewer'}>
				<GalleryViewer />
			</GalleryViewLayout>
		),
		exact: true,
	},
	// {
	// 	path: '/settings/ai-setup-page/:aiAssistantId',
	// 	component: (
	// 		<AuthWrapper title={'AI Setup'}>
	// 			<AiSetupPage />
	// 		</AuthWrapper>
	// 	),
	// 	exact: true,
	// },
	{
		path: '/tasks',
		component: (
			<AuthWrapper
				title={'Tasks'}
				outerContainerStyle={{ padding: '0 32px 0 0' }}
				childrenContainerStyles={{ maxWidth: '100%' }}
			>
				<Tasks />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/task/:taskId',
		component: (
			<AuthWrapper title={'Tasks'}>
				<TaskFullView />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/integrations',
		component: (
			<AuthWrapper title={'Integrations'}>
				<Integrations />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '*',
		component: <Navigate to="/" />,
	},
	{
		path: '/calendar',
		component: (
			<AuthWrapper
				title={'Calendar'}
				outerContainerStyle={{ overflow: 'hidden', padding: '0 32px 0 0 ' }}
				childrenContainerStyles={{ maxWidth: '100%' }}
			>
				<CalendarModule />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/scheduler',
		component: (
			<AuthWrapper title={'Scheduler'} maxWidth={'95%'}>
				<SchedulerMainPage />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/scheduling/edit/:sessionId',
		component: (
			<AuthWrapper title={'Scheduling'} maxWidth={'95%'}>
				<EditScheduler />
			</AuthWrapper>
		),
		exact: true,
	},
	// {
	// 	path: '/pricing',
	// 	component: (
	// 		<AuthWrapper title={'Pricing'}>
	// 			<PricingPage />
	// 		</AuthWrapper>
	// 	),
	// },
	{
		path: '/pricing',
		component: (
			<AuthWrapper title={'Pricing'}>
				<PricingPage />
			</AuthWrapper>
		),
	},
	{
		path: '/notes',
		component: (
			<AuthWrapper title={'Notes'} outerContainerStyle={{ padding: '32px 32px 0px' }}>
				<NotesPage />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/contacts',
		component: (
			<AuthWrapper
				title={'Contacts'}
				outerContainerStyle={{ padding: '0 32px 0 0' }}
				childrenContainerStyles={{ maxWidth: '100%' }}
			>
				<Contacts />
			</AuthWrapper>
		),
		exact: true,
	},
	// {
	// 	path: '/ai-agents/home/:agent-name',
	// 	component: (
	// 		<AuthWrapper title={'AI Agents'}>
	// 			<Ai_agent />
	// 		</AuthWrapper>
	// 	),
	// 	exact: true,
	// },
	// {
	// 	path: '/ai-agents/jobs/:agent-name',
	// 	component: (
	// 		<AuthWrapper title={'AI Agents'}>
	// 			<AgentsJobs />
	// 		</AuthWrapper>
	// 	),
	// 	exact: true,
	// },
	// {
	// 	path: '/ai-agents/setup/:agent-name',
	// 	component: (
	// 		<AuthWrapper title={'AI Agents'}>
	// 			<AgentsSetup />
	// 		</AuthWrapper>
	// 	),
	// 	exact: true,
	// },
	{
		path: '/ai-assistant',
		component: (
			<AuthWrapper title={'AI Assistant'}>
				<AiAssistants />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/ai-assistant/:aiAssistantId',
		component: (
			<AuthWrapper title={'AI Assistant'}>
				<AgentDetails />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		// path: '/ai-assistant/create-assistant',
		path: '/ai-assistant/:aiAssistantId/edit',
		component: (
			<AuthWrapper title={'AI Assistant'}>
				<EditAgent />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/docs',
		component: (
			<AuthWrapper title={'Docs'}>
				<Docs />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/knowledge-agent',
		component: (
			<AuthWrapper
				title={'Knowledge Agent'}
				innerContainerStyle={{ paddingBottom: '0px' }}
				showBottomToolbar={false}
			>
				<KnowledgeAgents />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/knowledge-agent/:agentId',
		component: (
			<AuthWrapper
				title={'Knowledge Agent'}
				showBottomToolbar={false}
				innerContainerStyle={{ paddingBottom: '0px' }}
			>
				<KnowledgeAgentDetails />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/knowledge-agent/:agentId/edit',
		component: (
			<AuthWrapper
				title={'Knowledge Agent'}
				showBottomToolbar={false}
				outerContainerStyle={{ paddingRight: '0px' }}
			>
				<EditKnowledgeAgent />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/doc/:id',
		component: (
			<AuthWrapper title={'Docs'}>
				<DocsFullView />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/my-templates',
		component: (
			<AuthWrapper title={'My Templates'}>
				<MyTemplates />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/automation-builder/:automationId',
		component: (
			<AutomationBuilderLayout title={'Automation Builder'}>
				<AutomationBuilder />
			</AutomationBuilderLayout>
		),
		exact: true,
	},
	{
		path: '/form',
		component: (
			<AuthWrapper title={'Forms'}>
				<Forms />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/form/:id',
		component: (
			<AuthWrapper title={'Form Leads'}>
				<FormLeads />
			</AuthWrapper>
		),
		exact: true,
	},
	// {
	// 	path: '/forms/:id/analytics',
	// 	component: (
	// 		<AuthWrapper title={'Form Analytics'}>
	// 			<FormAnalytics view="analytics" />
	// 		</AuthWrapper>
	// 	),
	// 	exact: true,
	// },
	{
		path: '/forms/:id/responses',
		component: (
			<AuthWrapper title={'Form Responses'}>
				<FormResCard view="responses" />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/forms/:id/summary',
		component: (
			<AuthWrapper title={'Form Summary'}>
				<FormSummary view="summary" />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/chat/:sessionId',
		component: (
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
		path: '/c/:sessionId',
		component: <PublicChat />,
	},
	{
		path: '/note/:noteId',
		component: (
			<AuthWrapper
				title={'Notes'}
				outerContainerStyle={{
					backgroundColor: 'var(--background-color)',
					padding: '0px',
				}}
				sidebarContainerStyles={{ paddingTop: '32px', paddingLeft: '32px' }}
				maxWidth={'100%'}
				sidebarContainerClassName={'auth-sidebar-container'}
			>
				<Notes />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/automations',
		component: (
			<AuthWrapper title={'Automations'}>
				<Automations />
			</AuthWrapper>
		),
	},
	{
		path: '/contact/:contactId',
		component: (
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
		component: (
			<AuthWrapper title="Search">
				<ElasticSearch />
			</AuthWrapper>
		),
	},
	{
		path: '/files',
		component: (
			<AuthWrapper title="Files" maxWidth={'100%'}>
				<Files />
			</AuthWrapper>
		),
	},
	{
		path: '/proactiveai/:proactiveAiId',
		component: (
			<AuthWrapper title="Proactive AI" childrenContainerStyles={{ maxWidth: '100%' }}>
				<ProactiveAi />
			</AuthWrapper>
		),
	},
	{
		path: '/builder/*',
		component: (
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
];

export default routes;
