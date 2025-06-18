import { Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import Landing_screen from './views/features/landingScreen/LandingPage';

import AuthWrapper from './views/layouts/authWrapper';
import Onboarding from './views/features/onboarding/Onboarding';
import CalendarModule from './views/features/calendar/Calendar';
import OauthVerify from './views/features/signin/oauth/OauthVerify';
import GlobalWorkflows from './views/features/sales/GlobalWorkflows';
import SmartFile from './views/features/sales/smartFiles/SmartFile';
import WorkflowBuilderLayout from './views/layouts/workflowBuilderLayout';
import SmartFileLayout from './views/layouts/smartFileLayout';
import EarlyAccess from './views/features/earlyAccess/EarlyAccess';
import PrivacyPolicy from './views/features/signin/PrivacyPolicy';
import ChageLog from './views/features/signin/ChageLog';
import AddGallery from './views/features/gallery/AddGallery';
import GalleryPage from './views/features/gallery/GalleryPage';
import GalleryViewer from './views/features/gallery/GalleryViewer';
import AlbumSettings from './views/features/gallery/AlbumSettings';
import UploadPhotos from './views/features/gallery/UploadPhotos';
import GalleryViewLayout from './views/layouts/galleryViewLayout';
import TermsOfService from './views/features/signin/TermsOfService';
import CookiePolicy from './views/features/signin/CookiePolicy';
import WorkflowBuilder from './views/features/workflowBuilder/WorkflowBuilder';
import Tasks from './views/features/tasks/Tasks';
import Notes from './views/features/notesModule/Notes';
import Docs from './views/features/docs/Docs';
import LiteGallery from './views/features/gallery/Litegallery';
import MyTemplates from './views/features/myTemplates/MyTemplates';
import Forms from './views/features/forms/Forms';
import FormLeads from './views/features/forms/FormLeads';
import EditAgent from './views/features/aiAssistant/EditAgent';
import AgentDetails from './views/features/aiAssistant/AgentDetails';
import InitialHomePage from './views/features/homePage/InitialHomePage';
import RecentChat from './views/features/chat/RecentChat';
import AutomationBuilder from './views/features/automationBuilder/AutomationBuilder';
import AutomationBuilderLayout from './views/layouts/automationBuilderLayout';
import Automations from './views/features/automations/Automations';
import BrandSetup from './views/features/settings/BrandSetup';
import DocsFullView from './views/components/docs/DocsFullView';
import TaskFullView from './views/features/tasks/TaskFullView';
import ExpandedClientView from './views/features/contacts/ExpandedClientView';
import ElasticSearch from './views/features/elasticSearch/ElasticSearch';
import PublicChat from './views/features/publicChat/PublicChat';
import EditKnowledgeAgent from './views/features/knowledgeAgent/EditAgent';
import FormResCard from './views/components/forms/FormResCard';
import FormSummary from './views/components/forms/FormSummary';
import Integrations from './views/features/integrationsList/Integrations';
import SchedulerMainPage from './views/features/calendar/SchedulerMainPage';
import EditScheduler from './views/features/calendar/EditScheduler';
import Contacts from './views/features/contacts/Contacts';
import PricingPage from './views/features/pricingPlans/pricingPage';
import ProactiveAi from './views/features/proactiveAi/ProactiveAi';
import ShareAndEarn from './views/features/shareAndEarn/ShareAndEarn';
import NotesPage from './views/features/notesPage/NotesPage';
import KnowledgeAgents from './views/features/knowledgeAgent/KnowledgeAgents';
import SettingsWrapper from './views/features/settings/SettingsWrapper';
import Files from './views/features/files/Files';
import Workflow_builder_updated from './views/features/workflowBuilderUpdated/WorkflowBuilderUpdated';
import AiAssistants from './views/features/aiAssistant/AiAssistants';
import KnowledgeAgentDetails from './views/features/knowledgeAgent/AgentDetails';
import LoginPage from './views/features/loginPage/LoginPage';

const BuilderApp = lazy(() => import('../builderSrc/App'));

import Agents from './views/features/agents/Agents';
import Agent from './views/features/agents/agent/Agent';

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
		component: <Onboarding />,
		routeType: 'public',
	},
	{
		path: '/create-workspace',
		component: <Onboarding />,
		routeType: 'public',
	},
	{
		path: '/verify-user',
		component: <LoginPage />,
		routeType: 'public',
	},
	{
		path: '/referral/:referralCode',
		component: <LoginPage />,
		routeType: 'public',
	},
	{
		path: '/user/verify-oauth-user',
		component: <OauthVerify />,
		routeType: 'public',
	},
	{
		path: '/privacy-policy',
		component: <PrivacyPolicy />,
		routeType: 'public',
	},
	{
		path: '/terms-of-service',
		component: <TermsOfService />,
		routeType: 'public',
	},
	{
		path: '/cookie-policy',
		component: <CookiePolicy />,
		routeType: 'public',
	},
	{
		path: '/changelog',
		component: <ChageLog />,
		routeType: 'public',
	},
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
		routeType: 'protected',
	},
	{
		path: '/playbook',
		component: (
			<AuthWrapper title={'Sales'}>
				<GlobalWorkflows />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/share-and-earn',
		component: (
			<AuthWrapper title={'Share and Earn'}>
				<ShareAndEarn />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/workflow_builder/:templateId',
		component: (
			<WorkflowBuilderLayout title={'Workflow Builder'}>
				<WorkflowBuilder />
			</WorkflowBuilderLayout>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/automation_builder/:templateId',
		component: (
			<WorkflowBuilderLayout title={'Workflow Builder'}>
				<Workflow_builder_updated />
			</WorkflowBuilderLayout>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/smart-file/:templateId/:workflowId',
		component: (
			<SmartFileLayout title={'Smart File'}>
				<SmartFile />
			</SmartFileLayout>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/early-access',
		component: (
			<AuthWrapper title={'Early Access'}>
				<EarlyAccess />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/settings/:type',
		component: (
			<AuthWrapper title={'Workspace Settings'}>
				<SettingsWrapper />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/brand-setup',
		component: (
			<AuthWrapper title={'Brand Setup'}>
				<BrandSetup />
			</AuthWrapper>
		),
		routeType: 'protected',
	},
	{
		path: '/galleries',
		component: (
			<AuthWrapper title={'Galleries'} showBottomToolbar={false}>
				<AddGallery />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/lite-gallery',
		component: (
			<AuthWrapper title={'Lite Gallery'} showBottomToolbar={false}>
				<LiteGallery />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/galleries/:galleryId',
		component: (
			<AuthWrapper title={'Gallery'} showBottomToolbar={false}>
				<GalleryPage />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/galleries/:galleryId/:albumId/upload-photos',
		component: (
			<AuthWrapper title={'Upload Photos'} showBottomToolbar={false}>
				<UploadPhotos />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/galleries/:galleryId/:albumId/album-settings',
		component: (
			<AuthWrapper title={'Album Settings'} showBottomToolbar={false}>
				<AlbumSettings />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/galleries/:galleryId/:albumId/gallery-viewer',
		component: (
			<GalleryViewLayout title={'Gallery Viewer'}>
				<GalleryViewer />
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
				<Tasks />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/task/:taskId',
		component: (
			<AuthWrapper title={'Tasks'}>
				<TaskFullView />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/integrations',
		component: (
			<AuthWrapper title={'Integrations'}>
				<Integrations />
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
				<CalendarModule />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/scheduler',
		component: (
			<AuthWrapper title={'Scheduler'} maxWidth={'95%'}>
				<SchedulerMainPage />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/scheduling/edit/:sessionId',
		component: (
			<AuthWrapper title={'Scheduling'} maxWidth={'95%'}>
				<EditScheduler />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/pricing',
		component: (
			<AuthWrapper title={'Pricing'}>
				<PricingPage />
			</AuthWrapper>
		),
		routeType: 'protected',
	},
	{
		path: '/notes',
		component: (
			<AuthWrapper title={'Notes'} outerContainerStyle={{ padding: '0' }}>
				<NotesPage />
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
				<Contacts />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/ai-assistant',
		component: (
			<AuthWrapper title={'AI Assistant'}>
				<AiAssistants />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/ai-assistant/:aiAssistantId',
		component: (
			<AuthWrapper title={'AI Assistant'}>
				<AgentDetails />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/ai-assistant/:aiAssistantId/edit',
		component: (
			<AuthWrapper title={'AI Assistant'}>
				<EditAgent />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/docs',
		component: (
			<AuthWrapper title={'Docs'}>
				<Docs />
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
				<KnowledgeAgents />
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
				<KnowledgeAgentDetails />
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
				<EditKnowledgeAgent />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/doc/:id',
		component: (
			<AuthWrapper title={'Docs'}>
				<DocsFullView />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/my-templates',
		component: (
			<AuthWrapper title={'My Templates'}>
				<MyTemplates />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/automation-builder/:automationId',
		component: (
			<AutomationBuilderLayout title={'Automation Builder'}>
				<AutomationBuilder />
			</AutomationBuilderLayout>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/form',
		component: (
			<AuthWrapper title={'Forms'}>
				<Forms />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/form/:id',
		component: (
			<AuthWrapper title={'Form Leads'}>
				<FormLeads />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/forms/:id/responses',
		component: (
			<AuthWrapper title={'Form Responses'}>
				<FormResCard view="responses" />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/forms/:id/summary',
		component: (
			<AuthWrapper title={'Form Summary'}>
				<FormSummary view="summary" />
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
				<RecentChat />
			</AuthWrapper>
		),
		routeType: 'protected',
	},
	{
		path: '/c/:sessionId',
		component: <PublicChat />,
		routeType: 'public',
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
				<Notes />
			</AuthWrapper>
		),
		exact: true,
		routeType: 'protected',
	},
	{
		path: '/automations',
		component: (
			<AuthWrapper title={'Automations'}>
				<Automations />
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
				<ExpandedClientView />
			</AuthWrapper>
		),
		routeType: 'protected',
	},
	{
		path: '/search',
		component: (
			<AuthWrapper title="Search">
				<ElasticSearch />
			</AuthWrapper>
		),
		routeType: 'protected',
	},
	{
		path: '/files',
		component: (
			<AuthWrapper title="Files" maxWidth={'100%'}>
				<Files />
			</AuthWrapper>
		),
		routeType: 'protected',
	},
	{
		path: '/proactiveai/:proactiveAiId',
		component: (
			<AuthWrapper title="Proactive AI" childrenContainerStyles={{ maxWidth: '100%' }}>
				<ProactiveAi />
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
				<Agents />
			</AuthWrapper>
		),
		routeType: 'protected',
	},
	{
		path: '/agent/:agentId',
		component: (
			<AuthWrapper title="Agent">
				<Agent />
			</AuthWrapper>
		),
		routeType: 'protected',
	},
];

export default routes;
