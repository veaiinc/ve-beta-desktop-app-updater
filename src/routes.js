import AuthWrapper from './views/layouts/authWrapper';
import LoginPage from './views/features/login_page/LoginPage';
import Onboarding from './views/features/onboarding/Onboarding';
import Calendar from './views/features/calendar/index';
// import ChatScreen from './views/features/meta_Integ/index';
import OauthVerify from './views/features/signin/oauth';
import Sales from './views/features/sales/Sales';
import GlobalWorkflows from './views/features/sales/GlobalWorkflows';
import SmartFile from './views/features/sales/smartFiles/SmartFile';
import WorkflowBuilderLayout from './views/layouts/workflowBuilderLayout';
import SmartFileLayout from './views/layouts/smartFileLayout';
import EarlyAccess from './views/features/early_access';
import SettingsWrapper from './views/features/settings/SettingsWrapper';
import AiSetupPage from './views/features/settings/ai_settings/AiSetupPage';
import PrivacyPolicy from './views/features/signin/PrivacyPolicy';
import Landing_screen from './views/features/landing_screen';
import AddGallery from './views/features/gallery/AddGallery';
import GalleryPage from './views/features/gallery/GalleryPage';
import GalleryViewer from './views/features/gallery/GalleryViewer';
import AlbumSettings from './views/features/gallery/AlbumSettings';
import UploadPhotos from './views/features/gallery/UploadPhotos';
import GalleryViewLayout from './views/layouts/galleryViewLayout';
import { Navigate } from 'react-router-dom';
import Subscription from './views/features/subscription';
import TermsOfService from './views/features/signin/TermsOfService';
import CookiePolicy from './views/features/signin/CookiePolicy';
import WorkflowBuilder from './views/features/workflow_builder';
import Tasks from './views/features/tasks';
import ShareAndEarn from './views/features/ShareAndEarn';
import Notes from './views/features/Notes';
import Contacts from './views/features/contacts';
import Ai_agent from './views/features/ai_agent';
import AgentsJobs from './views/features/ai_agent/AgentsJobs';
import AgentsSetup from './views/features/ai_agent/AgentsSetup';
import Docs from './views/features/docs';
import LiteGallery from './views/features/gallery/Litegallery';
import MyTemplates from './views/features/my_templates/MyTemplates';
import Workflow_builder_updated from './views/features/workflow_builder_updated';
import Forms from './views/features/forms';
import FormLeads from './views/features/forms/FormLeads';
import HomePage from './views/features/home_page/HomePage';
import AiAssistants from './views/features/ai_assistant/index';
import EditAgent from './views/features/ai_assistant/EditAgent';
import AgentDetails from './views/features/ai_assistant/AgentDetails';
import InitialHomePage from './views/features/home_page/InitialHomePage';
import Chat from './views/features/chat/Chat';
import RecentChat from './views/features/chat/RecentChat';
import AutomationBuilder from './views/features/automation_builder';
import AutomationBuilderLayout from './views/layouts/automationBuilderLayout';
import Integrations from './views/features/Integrations/Integrations';

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
				outerContainerStyle={{ padding: '0 32px' }}
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
	{
		path: '/settings/ai-setup-page/:aiAssistantId',
		component: (
			<AuthWrapper title={'AI Setup'}>
				<AiSetupPage />
			</AuthWrapper>
		),
		exact: true,
	},
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
		path: '/subscription',
		component: <Subscription />,
		exact: true,
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

	//ai agents
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
		path: '/forms',
		component: (
			<AuthWrapper title={'Forms'}>
				<Forms />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/form-leads',
		component: (
			<AuthWrapper title={'Form Leads'}>
				<FormLeads />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/chat',
		component: (
			<AuthWrapper title={'Chat'} showBottomToolbar={false}>
				<Chat />
			</AuthWrapper>
		),
	},
	{
		path: '/chat/:sessionId',
		component: (
			<AuthWrapper
				title={'Chat'}
				showBottomToolbar={false}
				outerContainerStyle={{ paddingRight: '0px' }}
				maxWidth="100%"
			>
				<RecentChat />
			</AuthWrapper>
		),
	},
];

export default routes;
