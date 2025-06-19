import { Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Lazy load all route components for better performance
import Landing_screen from './views/features/landingScreen/LandingPage';
import InitialHomePage from './views/features/homePage/InitialHomePage';
import AuthWrapper from './views/layouts/authWrapper';

const Onboarding = lazy(() => import('./views/features/onboarding/Onboarding'));
//
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
const KnowledgeAgents = lazy(() => import('./views/features/knowledgeAgent/KnowledgeAgents'));
const SettingsWrapper = lazy(() => import('./views/features/settings/SettingsWrapper'));
const Files = lazy(() => import('./views/features/files/Files'));
const Workflow_builder_updated = lazy(() =>
	import('./views/features/workflowBuilderUpdated/WorkflowBuilderUpdated'),
);
const AiAssistants = lazy(() => import('./views/features/aiAssistant/AiAssistants'));
const KnowledgeAgentDetails = lazy(() => import('./views/features/knowledgeAgent/AgentDetails'));
const LoginPage = lazy(() => import('./views/features/loginPage/LoginPage'));
const Agents = lazy(() => import('./views/features/agents/Agents'));
const Agent = lazy(() => import('./views/features/agents/agent/Agent'));

const BuilderApp = lazy(() => import('../builderSrc/App'));

// Loading component for Suspense fallback
const LoadingFallback = () => (
	<div
		style={{
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			height: '100vh',
			fontSize: '16px',
			color: '#666',
		}}
	>
		Please Wait While We are Preparing Your Workspace...
	</div>
);

// Wrapper component to handle lazy loading with Suspense
const LazyComponent = ({ component: Component, ...props }) => (
	<Suspense fallback={<LoadingFallback />}>
		<Component {...props} />
	</Suspense>
);

const routes = [
	{
		path: '/',
		component: <Landing_screen />,
		routeType: 'public',
	},
	{
		path: '/thebridge',
		component: <Landing_screen />,
		routeType: 'public',
	},
	{
		path: '/contact-us',
		component: <Landing_screen />,
		routeType: 'public',
	},
	{
		path: '/pricing',
		component: <Landing_screen />,
		routeType: 'public',
	},
	{
		path: '/api',
		component: <Landing_screen />,
		routeType: 'public',
	},
	{
		path: '/onboarding',
		component: <LazyComponent component={Onboarding} />,
	},
	{
		path: '/create-workspace',
		component: <LazyComponent component={Onboarding} />,
	},
	{
		path: '/verify-user',
		component: <LazyComponent component={LoginPage} />,
	},
	{
		path: '/referral/:referralCode',
		component: <LazyComponent component={LoginPage} />,
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
		component: <LazyComponent component={OauthVerify} />,
	},
	{
		path: '/privacy-policy',
		component: <LazyComponent component={PrivacyPolicy} />,
	},
	{
		path: '/terms-of-service',
		component: <LazyComponent component={TermsOfService} />,
	},
	{
		path: '/cookie-policy',
		component: <LazyComponent component={CookiePolicy} />,
	},
	{
		path: '/changelog',
		component: <LazyComponent component={ChageLog} />,
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
				childrenContainerStyles={{ overflow: 'scroll' }}
				showBottomToolbar={false}
			>
				<InitialHomePage />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/playbook',
		component: (
			<AuthWrapper title={'Sales'}>
				<LazyComponent component={GlobalWorkflows} />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/share-and-earn',
		component: (
			<AuthWrapper title={'Share and Earn'}>
				<LazyComponent component={ShareAndEarn} />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/workflow_builder/:templateId',
		component: (
			<WorkflowBuilderLayout title={'Workflow Builder'}>
				<LazyComponent component={WorkflowBuilder} />
			</WorkflowBuilderLayout>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/automation_builder/:templateId',
		component: (
			<WorkflowBuilderLayout title={'Workflow Builder'}>
				<LazyComponent component={Workflow_builder_updated} />
			</WorkflowBuilderLayout>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/smart-file/:templateId/:workflowId',
		component: (
			<SmartFileLayout title={'Smart File'}>
				<LazyComponent component={SmartFile} />
			</SmartFileLayout>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/early-access',
		component: (
			<AuthWrapper title={'Early Access'}>
				<LazyComponent component={EarlyAccess} />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/settings/:type',
		component: (
			<AuthWrapper title={'Workspace Settings'}>
				<LazyComponent component={SettingsWrapper} />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/brand-setup',
		component: (
			<AuthWrapper title={'Brand Setup'}>
				<LazyComponent component={BrandSetup} />
			</AuthWrapper>
		),
		routeType: 'protected',
	},
	{
		path: '/galleries',
		component: (
			<AuthWrapper title={'Galleries'} showBottomToolbar={false}>
				<LazyComponent component={AddGallery} />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/lite-gallery',
		component: (
			<AuthWrapper title={'Lite Gallery'} showBottomToolbar={false}>
				<LazyComponent component={LiteGallery} />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/galleries/:galleryId',
		component: (
			<AuthWrapper title={'Gallery'} showBottomToolbar={false}>
				<LazyComponent component={GalleryPage} />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/galleries/:galleryId/:albumId/upload-photos',
		component: (
			<AuthWrapper title={'Upload Photos'} showBottomToolbar={false}>
				<LazyComponent component={UploadPhotos} />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/galleries/:galleryId/:albumId/album-settings',
		component: (
			<AuthWrapper title={'Album Settings'} showBottomToolbar={false}>
				<LazyComponent component={AlbumSettings} />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/galleries/:galleryId/:albumId/gallery-viewer',
		component: (
			<GalleryViewLayout title={'Gallery Viewer'}>
				<LazyComponent component={GalleryViewer} />
			</GalleryViewLayout>
		),
		exact: true,
		routeType: 'public',
	},
	{
		path: '/tasks',
		component: (
			<AuthWrapper
				title={'Tasks'}
				outerContainerStyle={{ padding: '0 32px 0 0' }}
				childrenContainerStyles={{ maxWidth: '100%' }}
			>
				<LazyComponent component={Tasks} />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/task/:taskId',
		component: (
			<AuthWrapper title={'Tasks'}>
				<LazyComponent component={TaskFullView} />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/integrations',
		component: (
			<AuthWrapper title={'Integrations'}>
				<LazyComponent component={Integrations} />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '*',
		component: <Navigate to="/" />,
		routeType: 'public',
	},
	{
		path: '/calendar',
		component: (
			<AuthWrapper
				title={'Calendar'}
				outerContainerStyle={{ overflow: 'hidden', padding: '0 32px 0 0 ' }}
				childrenContainerStyles={{ maxWidth: '100%' }}
			>
				<LazyComponent component={CalendarModule} />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/scheduler',
		component: (
			<AuthWrapper title={'Scheduler'} maxWidth={'95%'}>
				<LazyComponent component={SchedulerMainPage} />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/scheduling/edit/:sessionId',
		component: (
			<AuthWrapper title={'Scheduling'} maxWidth={'95%'}>
				<LazyComponent component={EditScheduler} />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/pricing',
		component: (
			<AuthWrapper title={'Pricing'}>
				<LazyComponent component={PricingPage} />
			</AuthWrapper>
		),
		routeType: 'protected',
	},
	{
		path: '/notes',
		component: (
			<AuthWrapper title={'Notes'} outerContainerStyle={{ padding: '0' }}>
				<LazyComponent component={NotesPage} />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/contacts',
		component: (
			<AuthWrapper
				title={'Contacts'}
				outerContainerStyle={{ padding: '0 32px 0 0' }}
				childrenContainerStyles={{ maxWidth: '100%' }}
			>
				<LazyComponent component={Contacts} />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/ai-assistant',
		component: (
			<AuthWrapper title={'AI Assistant'}>
				<LazyComponent component={AiAssistants} />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/ai-assistant/:aiAssistantId',
		component: (
			<AuthWrapper title={'AI Assistant'}>
				<LazyComponent component={AgentDetails} />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/ai-assistant/:aiAssistantId/edit',
		component: (
			<AuthWrapper title={'AI Assistant'}>
				<LazyComponent component={EditAgent} />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/docs',
		component: (
			<AuthWrapper title={'Docs'}>
				<LazyComponent component={Docs} />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/knowledge-agent',
		component: (
			<AuthWrapper
				title={'Knowledge Agent'}
				innerContainerStyle={{ paddingBottom: '0px' }}
				showBottomToolbar={false}
			>
				<LazyComponent component={KnowledgeAgents} />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/knowledge-agent/:agentId',
		component: (
			<AuthWrapper
				title={'Knowledge Agent'}
				showBottomToolbar={false}
				innerContainerStyle={{ paddingBottom: '0px' }}
			>
				<LazyComponent component={KnowledgeAgentDetails} />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/knowledge-agent/:agentId/edit',
		component: (
			<AuthWrapper
				title={'Knowledge Agent'}
				showBottomToolbar={false}
				outerContainerStyle={{ paddingRight: '0px' }}
			>
				<LazyComponent component={EditKnowledgeAgent} />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/doc/:id',
		component: (
			<AuthWrapper title={'Docs'}>
				<LazyComponent component={DocsFullView} />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/my-templates',
		component: (
			<AuthWrapper title={'My Templates'}>
				<LazyComponent component={MyTemplates} />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/automation-builder/:automationId',
		component: (
			<AutomationBuilderLayout title={'Automation Builder'}>
				<LazyComponent component={AutomationBuilder} />
			</AutomationBuilderLayout>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/form',
		component: (
			<AuthWrapper title={'Forms'}>
				<LazyComponent component={Forms} />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/form/:id',
		component: (
			<AuthWrapper title={'Form Leads'}>
				<LazyComponent component={FormLeads} />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/forms/:id/responses',
		component: (
			<AuthWrapper title={'Form Responses'}>
				<LazyComponent component={FormResCard} view="responses" />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/forms/:id/summary',
		component: (
			<AuthWrapper title={'Form Summary'}>
				<LazyComponent component={FormSummary} view="summary" />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
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
				<LazyComponent component={RecentChat} />
			</AuthWrapper>
		),
		routeType: 'protected',
	},
	{
		path: '/c/:sessionId',
		component: <LazyComponent component={PublicChat} />,
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
				sidebarContainerStyles={{ padding: '0px' }}
				maxWidth={'100%'}
				sidebarContainerClassName={'auth-sidebar-container'}
			>
				<LazyComponent component={Notes} />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/automations',
		component: (
			<AuthWrapper title={'Automations'}>
				<LazyComponent component={Automations} />
			</AuthWrapper>
		),
		routeType: 'protected',
	},
	{
		path: '/contact/:contactId',
		component: (
			<AuthWrapper
				title="Contact Details"
				outerContainerStyle={{ padding: '0 32px 0 0' }}
				childrenContainerStyles={{ maxWidth: '100%' }}
			>
				<LazyComponent component={ExpandedClientView} />
			</AuthWrapper>
		),
		routeType: 'protected',
	},
	{
		path: '/search',
		component: (
			<AuthWrapper title="Search">
				<LazyComponent component={ElasticSearch} />
			</AuthWrapper>
		),
		routeType: 'protected',
	},
	{
		path: '/files',
		component: (
			<AuthWrapper title="Files" maxWidth={'100%'}>
				<LazyComponent component={Files} />
			</AuthWrapper>
		),
		routeType: 'protected',
	},
	{
		path: '/proactiveai/:proactiveAiId',
		component: (
			<AuthWrapper title="Proactive AI" childrenContainerStyles={{ maxWidth: '100%' }}>
				<LazyComponent component={ProactiveAi} />
			</AuthWrapper>
		),
		routeType: 'protected',
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
				<Suspense fallback={'loading builder...'}>
					<BuilderApp />
				</Suspense>
			</AuthWrapper>
		),
		routeType: 'protected',
	},
	{
		path: '/agents',
		component: (
			<AuthWrapper
				title="Agents"
				outerContainerStyle={{ padding: '0' }}
				sidebarContainerStyles={{ padding: '32px 0 0 32px' }}
			>
				<LazyComponent component={Agents} />
			</AuthWrapper>
		),
		routeType: 'protected',
	},
	{
		path: '/agent/:agentId',
		component: (
			<AuthWrapper title="Agent">
				<LazyComponent component={Agent} />
			</AuthWrapper>
		),
		routeType: 'protected',
	},
];

export default routes;
