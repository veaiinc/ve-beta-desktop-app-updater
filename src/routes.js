import AuthWrapper from './views/layouts/authWrapper';
import LoginPage from './views/features/loginPage/LoginPage';
import Onboarding from './views/features/onboarding/Onboarding';
import Calendar from './views/features/calendar/Calendar';
// import ChatScreen from './views/features/meta_Integ/index';
import OauthVerify from './views/features/signin/oauth/OauthVerify';
import Sales from './views/features/sales/Sales';
import GlobalWorkflows from './views/features/sales/GlobalWorkflows';
import SmartFile from './views/features/sales/smartFiles/SmartFile';
import WorkflowBuilderLayout from './views/layouts/workflowBuilderLayout';
import SmartFileLayout from './views/layouts/smartFileLayout';
import EarlyAccess from './views/features/earlyAccess/EarlyAccess';
import SettingsWrapper from './views/features/settings/SettingsWrapper';
import AiSetupPage from './views/features/settings/aiSettings/AiSetupPage';
import PrivacyPolicy from './views/features/signin/PrivacyPolicy';
import Landing_screen from './views/features/landingScreen/LandingPage';
import AddGallery from './views/features/gallery/AddGallery';
import GalleryPage from './views/features/gallery/GalleryPage';
import GalleryViewer from './views/features/gallery/GalleryViewer';
import AlbumSettings from './views/features/gallery/AlbumSettings';
import UploadPhotos from './views/features/gallery/UploadPhotos';
import GalleryViewLayout from './views/layouts/galleryViewLayout';
import { Navigate } from 'react-router-dom';
import TermsOfService from './views/features/signin/TermsOfService';
import CookiePolicy from './views/features/signin/CookiePolicy';
import WorkflowBuilder from './views/features/workflowBuilder/WorkflowBuilder';
import Tasks from './views/features/tasks/Tasks';
import ShareAndEarn from './views/features/shareAndEarn/ShareAndEarn';
import Notes from './views/features/notesModule/Notes';
import Contacts from './views/features/contacts/Contacts';
import Ai_agent from './views/features/aiAgent/AiAgent';
import AgentsJobs from './views/features/aiAgent/AgentsJobs';
import AgentsSetup from './views/features/aiAgent/AgentsSetup';
import Docs from './views/features/docs/Docs';
import LiteGallery from './views/features/gallery/Litegallery';
import MyTemplates from './views/features/myTemplates/MyTemplates';
import Workflow_builder_updated from './views/features/workflowBuilderUpdated/WorkflowBuilderUpdated';
import Forms from './views/features/forms/Forms';
import FormLeads from './views/features/forms/FormLeads';
import HomePage from './views/features/homePage/HomePage';
import AiAssistants from './views/features/aiAssistant/AiAssistants';
import EditAgent from './views/features/aiAssistant/EditAgent';
import AgentDetails from './views/features/aiAssistant/AgentDetails';
import InitialHomePage from './views/features/homePage/InitialHomePage';
import RecentChat from './views/features/chat/RecentChat';
import AutomationBuilder from './views/features/automationBuilder/AutomationBuilder';
import AutomationBuilderLayout from './views/layouts/automationBuilderLayout';
import Automations from './views/features/automations/Automations';
import Integrations from './views/features/integrationsList/Integrations';
import BrandSetup from './views/features/settings/BrandSetup';
import DocsFullView from './views/components/docs/DocsFullView';
import FormFullView from './views/components/forms/FormFullView';
import TaskFullView from './views/features/tasks/TaskFullView';
import ExpandedClientView from './views/features/contacts/ExpandedClientView';
import ElasticSearch from './views/features/elasticSearch/ElasticSearch';
import PublicChat from './views/features/publicChat/PublicChat';
import Files from './views/features/files/Files';
import KnowledgeAgents from './views/features/knowledgeAgent/KnowledgeAgents';
import KnowledgeAgentDetails from './views/features/knowledgeAgent/AgentDetails';
import EditKnowledgeAgent from './views/features/knowledgeAgent/EditAgent';

const routes = [
	{
		path: '/',
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
				// outerContainerStyle={{ padding: '0 32px' }}
				showBottomToolbar={false}
			>
				<InitialHomePage />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/sales',
		component: (
			<AuthWrapper title={'Sales'}>
				<Sales />
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
			<AuthWrapper title={'Gallery'} maxWidth={'1200px'} showBottomToolbar={false}>
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
			<AuthWrapper title={'Tasks'}>
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
			<AuthWrapper title={'Calendar'} maxWidth={'95%'}>
				<Calendar />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/notes',
		component: (
			<AuthWrapper
				title={'Notes'}
				outerContainerStyle={{ padding: '0 0 0 32px', backgroundColor: '#1e1e1e' }}
				maxWidth={'100%'}
			>
				<Notes />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/contacts',
		component: (
			<AuthWrapper title={'Contacts'}>
				<Contacts />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/ai-agents/home/:agent-name',
		component: (
			<AuthWrapper title={'AI Agents'}>
				<Ai_agent />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/ai-agents/jobs/:agent-name',
		component: (
			<AuthWrapper title={'AI Agents'}>
				<AgentsJobs />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/ai-agents/setup/:agent-name',
		component: (
			<AuthWrapper title={'AI Agents'}>
				<AgentsSetup />
			</AuthWrapper>
		),
		exact: true,
	},
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
	{
		path: '/form-response/:id',
		component: (
			<AuthWrapper title={'Form Response'}>
				<FormFullView />
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
				outerContainerStyle={{ paddingRight: '0px' }}
				authParentContainerStyle={{ backgroundColor: 'var(--background-color)' }}
				maxWidth="100%"
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
				}}
				maxWidth={'100%'}
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
			<AuthWrapper title="Contact Details">
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
			<AuthWrapper title="Files">
				<Files />
			</AuthWrapper>
		),
	},
];

export default routes;
