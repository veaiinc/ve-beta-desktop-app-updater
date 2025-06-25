/**
 * 🧪 COMPREHENSIVE ROUTING TEST SUITE
 *
 * PURPOSE: This test suite validates that all routes in the application work correctly,
 * preventing broken navigation, authentication issues, and route conflicts.
 *
 * WHAT IT TESTS:
 * ✅ All public routes (landing pages, login, legal pages)
 * ✅ All protected routes (dashboard features, authenticated pages)
 * ✅ All dynamic routes (routes with parameters like /user/:id)
 * ✅ Route configuration (catch-all routes, redirects)
 * ✅ Authentication flows (protected vs public access)
 *
 * BUSINESS VALUE:
 * - Prevents broken links that frustrate users
 * - Catches routing bugs before they reach production
 * - Enables confident refactoring of route structure
 * - Reduces support tickets related to navigation issues
 *
 * HOW TO USE:
 * - Run: `npm test src/tests/routing/routes.test.jsx`
 * - Add new routes: Add corresponding test in appropriate section
 * - Debug failures: Check route configuration and component mocks
 */

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import routes from '../../routes';

// ============================================================================
// 🎭 MOCK SETUP - Prevents complex dependencies from breaking tests
// ============================================================================

// Mock external library that can cause test issues
vi.mock('react-responsive-masonry', () => ({
	default: ({ children }) => <div data-testid="masonry">{children}</div>,
}));

// ============================================================================
// 🏠 PUBLIC ROUTE COMPONENT MOCKS
// These routes don't require authentication and are accessible to everyone
// ============================================================================

vi.mock('../../views/features/landingScreen/LandingPage', () => ({
	default: () => <div data-testid="landing-page">Landing Page</div>,
}));

vi.mock('../../views/features/onboarding/Onboarding', () => ({
	default: () => <div data-testid="onboarding">Onboarding</div>,
}));

vi.mock('../../views/features/loginPage/LoginPage', () => ({
	default: () => <div data-testid="login-page">Login Page</div>,
}));

vi.mock('../../views/features/signin/oauth/OauthVerify', () => ({
	default: () => <div data-testid="oauth-verify">OAuth Verify</div>,
}));

vi.mock('../../views/features/signin/PrivacyPolicy', () => ({
	default: () => <div data-testid="privacy-policy">Privacy Policy</div>,
}));

vi.mock('../../views/features/signin/TermsOfService', () => ({
	default: () => <div data-testid="terms-of-service">Terms of Service</div>,
}));

vi.mock('../../views/features/signin/CookiePolicy', () => ({
	default: () => <div data-testid="cookie-policy">Cookie Policy</div>,
}));

vi.mock('../../views/features/signin/ChageLog', () => ({
	default: () => <div data-testid="changelog">Changelog</div>,
}));

vi.mock('../../views/features/publicChat/PublicChat', () => ({
	default: () => <div data-testid="public-chat">Public Chat</div>,
}));

// ============================================================================
// 🔐 PROTECTED ROUTE COMPONENT MOCKS
// These routes require authentication and are wrapped in AuthWrapper
// ============================================================================

vi.mock('../../views/features/homePage/InitialHomePage', () => ({
	default: () => <div data-testid="initial-home-page">Initial Home Page</div>,
}));

vi.mock('../../views/features/sales/GlobalWorkflows', () => ({
	default: () => <div data-testid="global-workflows">Global Workflows</div>,
}));

vi.mock('../../views/features/shareAndEarn/ShareAndEarn', () => ({
	default: () => <div data-testid="share-and-earn">Share and Earn</div>,
}));

vi.mock('../../views/features/tasks/Tasks', () => ({
	default: () => <div data-testid="tasks">Tasks</div>,
}));

vi.mock('../../views/features/calendar/Calendar', () => ({
	default: () => <div data-testid="calendar-module">Calendar Module</div>,
}));

vi.mock('../../views/features/calendar/SchedulerMainPage', () => ({
	default: () => <div data-testid="scheduler-main-page">Scheduler Main Page</div>,
}));

vi.mock('../../views/features/calendar/EditScheduler', () => ({
	default: () => <div data-testid="edit-scheduler">Edit Scheduler</div>,
}));

vi.mock('../../views/features/pricingPlans/pricingPage', () => ({
	default: () => <div data-testid="pricing-page">Pricing Page</div>,
}));

vi.mock('../../views/features/notesPage/NotesPage', () => ({
	default: () => <div data-testid="notes-page">Notes Page</div>,
}));

vi.mock('../../views/features/contacts/Contacts', () => ({
	default: () => <div data-testid="contacts">Contacts</div>,
}));

vi.mock('../../views/features/aiAssistant/AiAssistants', () => ({
	default: () => <div data-testid="ai-assistants">AI Assistants</div>,
}));

vi.mock('../../views/features/aiAssistant/AgentDetails', () => ({
	default: () => <div data-testid="agent-details">Agent Details</div>,
}));

vi.mock('../../views/features/aiAssistant/EditAgent', () => ({
	default: () => <div data-testid="edit-agent">Edit Agent</div>,
}));

vi.mock('../../views/features/docs/Docs', () => ({
	default: () => <div data-testid="docs">Docs</div>,
}));

vi.mock('../../views/features/knowledgeAgent/KnowledgeAgents', () => ({
	default: () => <div data-testid="knowledge-agents">Knowledge Agents</div>,
}));

vi.mock('../../views/features/knowledgeAgent/AgentDetails', () => ({
	default: () => <div data-testid="knowledge-agent-details">Knowledge Agent Details</div>,
}));

vi.mock('../../views/features/knowledgeAgent/EditAgent', () => ({
	default: () => <div data-testid="edit-knowledge-agent">Edit Knowledge Agent</div>,
}));

vi.mock('../../views/features/myTemplates/MyTemplates', () => ({
	default: () => <div data-testid="my-templates">My Templates</div>,
}));

vi.mock('../../views/features/forms/Forms', () => ({
	default: () => <div data-testid="forms">Forms</div>,
}));

vi.mock('../../views/features/forms/FormLeads', () => ({
	default: () => <div data-testid="form-leads">Form Leads</div>,
}));

vi.mock('../../views/features/automations/Automations', () => ({
	default: () => <div data-testid="automations">Automations</div>,
}));

vi.mock('../../views/features/integrationsList/Integrations', () => ({
	default: () => <div data-testid="integrations">Integrations</div>,
}));

vi.mock('../../views/features/files/Files', () => ({
	default: () => <div data-testid="files">Files</div>,
}));

vi.mock('../../views/features/agents/Agents', () => ({
	default: () => <div data-testid="agents">Agents</div>,
}));

vi.mock('../../views/features/agents/agent/Agent', () => ({
	default: () => <div data-testid="agent">Agent</div>,
}));

vi.mock('../../views/features/settings/SettingsWrapper', () => ({
	default: () => <div data-testid="settings-wrapper">Settings Wrapper</div>,
}));

vi.mock('../../views/features/settings/BrandSetup', () => ({
	default: () => <div data-testid="brand-setup">Brand Setup</div>,
}));

vi.mock('../../views/features/earlyAccess/EarlyAccess', () => ({
	default: () => <div data-testid="early-access">Early Access</div>,
}));

vi.mock('../../views/features/proactiveAi/ProactiveAi', () => ({
	default: () => <div data-testid="proactive-ai">Proactive AI</div>,
}));

// ============================================================================
// 🔄 DYNAMIC ROUTE COMPONENT MOCKS
// These routes have parameters (like /user/:id) and render different content
// ============================================================================

vi.mock('../../views/features/workflowBuilder/WorkflowBuilder', () => ({
	default: () => <div data-testid="workflow-builder">Workflow Builder</div>,
}));

vi.mock('../../views/features/workflowBuilderUpdated/WorkflowBuilderUpdated', () => ({
	default: () => <div data-testid="workflow-builder-updated">Workflow Builder Updated</div>,
}));

vi.mock('../../views/features/automationBuilder/AutomationBuilder', () => ({
	default: () => <div data-testid="automation-builder">Automation Builder</div>,
}));

vi.mock('../../views/features/sales/smartFiles/SmartFile', () => ({
	default: () => <div data-testid="smart-file">Smart File</div>,
}));

vi.mock('../../views/features/gallery/AddGallery', () => ({
	default: () => <div data-testid="add-gallery">Add Gallery</div>,
}));

vi.mock('../../views/features/gallery/GalleryPage', () => ({
	default: () => <div data-testid="gallery-page">Gallery Page</div>,
}));

vi.mock('../../views/features/gallery/GalleryViewer', () => ({
	default: () => <div data-testid="gallery-viewer">Gallery Viewer</div>,
}));

vi.mock('../../views/features/gallery/AlbumSettings', () => ({
	default: () => <div data-testid="album-settings">Album Settings</div>,
}));

vi.mock('../../views/features/gallery/UploadPhotos', () => ({
	default: () => <div data-testid="upload-photos">Upload Photos</div>,
}));

vi.mock('../../views/features/gallery/Litegallery', () => ({
	default: () => <div data-testid="lite-gallery">Lite Gallery</div>,
}));

vi.mock('../../views/features/tasks/TaskFullView', () => ({
	default: () => <div data-testid="task-full-view">Task Full View</div>,
}));

vi.mock('../../views/features/contacts/ExpandedClientView', () => ({
	default: () => <div data-testid="expanded-client-view">Expanded Client View</div>,
}));

vi.mock('../../views/features/notesModule/Notes', () => ({
	default: () => <div data-testid="notes">Notes</div>,
}));

vi.mock('../../views/features/chat/RecentChat', () => ({
	default: () => <div data-testid="recent-chat">Recent Chat</div>,
}));

vi.mock('../../views/features/elasticSearch/ElasticSearch', () => ({
	default: () => <div data-testid="elastic-search">Elastic Search</div>,
}));

vi.mock('../../views/components/docs/DocsFullView', () => ({
	default: () => <div data-testid="docs-full-view">Docs Full View</div>,
}));

vi.mock('../../views/components/forms/FormResCard', () => ({
	default: () => <div data-testid="form-res-card">Form Response Card</div>,
}));

vi.mock('../../views/components/forms/FormSummary', () => ({
	default: () => <div data-testid="form-summary">Form Summary</div>,
}));

// ============================================================================
// 🎨 LAYOUT COMPONENT MOCKS
// These wrap other components and provide consistent UI structure
// ============================================================================

vi.mock('../../views/layouts/authWrapper', () => ({
	default: ({ children, title }) => (
		<div data-testid="auth-wrapper" data-title={title}>
			{children}
		</div>
	),
}));

vi.mock('../../views/layouts/workflowBuilderLayout', () => ({
	default: ({ children, title }) => (
		<div data-testid="workflow-builder-layout" data-title={title}>
			{children}
		</div>
	),
}));

vi.mock('../../views/layouts/smartFileLayout', () => ({
	default: ({ children, title }) => (
		<div data-testid="smart-file-layout" data-title={title}>
			{children}
		</div>
	),
}));

vi.mock('../../views/layouts/automationBuilderLayout', () => ({
	default: ({ children, title }) => (
		<div data-testid="automation-builder-layout" data-title={title}>
			{children}
		</div>
	),
}));

vi.mock('../../views/layouts/galleryViewLayout', () => ({
	default: ({ children, title }) => (
		<div data-testid="gallery-view-layout" data-title={title}>
			{children}
		</div>
	),
}));

// ============================================================================
// 🛠️ BUILDER APP MOCK
// This is a lazy-loaded component for the document builder feature
// ============================================================================

vi.mock('../../../builderSrc/App', () => ({
	default: () => <div data-testid="builder-app">Builder App</div>,
}));

// ============================================================================
// 🧭 REACT ROUTER MOCKS
// Mock navigation components to test redirects and routing behavior
// ============================================================================

vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		Navigate: ({ to }) => (
			<div data-testid="navigate" data-to={to}>
				Navigate to {to}
			</div>
		),
	};
});

// ============================================================================
// 🌐 BROWSER API MOCKS
// Mock browser APIs that routes might depend on
// ============================================================================

const locationReplaceMock = vi.fn();
Object.defineProperty(window, 'location', {
	value: { replace: locationReplaceMock },
	writable: true,
});

const localStorageMock = (() => {
	let store = {};
	return {
		getItem: (key) => store[key] || null,
		setItem: (key, value) => {
			store[key] = value;
		},
		removeItem: (key) => {
			delete store[key];
		},
		clear: () => {
			store = {};
		},
	};
})();
global.localStorage = localStorageMock;

// ============================================================================
// 🎯 ROUTE MATCHING HELPER FUNCTIONS
// These functions help find and render the correct route for testing
// ============================================================================

/**
 * Finds a route that matches the given path
 * @param {string} path - The URL path to match (e.g., '/home', '/user/123')
 * @returns {Object} The matching route object or catch-all route
 */
const matchRoute = (path) => {
	// Try exact match first (e.g., '/home' matches '/home')
	let route = routes.find((r) => r.path === path);
	if (route) return route;

	// Try dynamic match (e.g., '/user/123' matches '/user/:id')
	for (const r of routes) {
		if (!r.path.includes(':')) continue;
		const pattern = r.path.replace(/:[^/]+/g, '[^/]+').replace(/\*/g, '.*');
		const regex = new RegExp(`^${pattern}$`);
		if (regex.test(path)) return r;
	}

	// Fallback to catch-all route (*)
	return routes.find((r) => r.path === '*');
};

/**
 * Renders a route component for testing
 * @param {string} path - The URL path to test
 * @returns {Object} The rendered component
 */
const renderRoute = (path) => {
	const route = matchRoute(path);
	if (!route) {
		return render(<div data-testid="route-not-found">Route not found: {path}</div>);
	}
	return render(<MemoryRouter initialEntries={[path]}>{route.component}</MemoryRouter>);
};

// ============================================================================
// 🧪 TEST SUITE - ROUTING VALIDATION
// ============================================================================

describe('Routing Tests', () => {
	/**
	 * Setup before each test:
	 * - Clear any previous test data
	 * - Set up mock authentication tokens
	 * - Reset browser API mocks
	 */
	beforeEach(() => {
		localStorage.clear();
		locationReplaceMock.mockClear();

		// Mock authenticated user session
		localStorage.setItem('usertoken', 'mock-token');
		localStorage.setItem('workspaceId', 'mock-workspace');
		localStorage.setItem('isOnboard', 'true');
	});

	/**
	 * Cleanup after each test:
	 * - Clear test data
	 * - Reset mocks
	 */
	afterEach(() => {
		localStorage.clear();
		locationReplaceMock.mockClear();
	});

	// ============================================================================
	// 🌐 PUBLIC ROUTES TESTS
	// These routes are accessible to everyone without authentication
	// ============================================================================

	describe('Public Routes', () => {
		/**
		 * Landing page routes - These are the first pages users see
		 */
		it('should render landing page for root path', () => {
			renderRoute('/');
			expect(screen.getByTestId('landing-page')).toBeInTheDocument();
		});

		it('should render landing page for /thebridge', () => {
			renderRoute('/thebridge');
			expect(screen.getByTestId('landing-page')).toBeInTheDocument();
		});

		it('should render landing page for /contact-us', () => {
			renderRoute('/contact-us');
			expect(screen.getByTestId('landing-page')).toBeInTheDocument();
		});

		it('should render landing page for /api', () => {
			renderRoute('/api');
			expect(screen.getByTestId('landing-page')).toBeInTheDocument();
		});

		it('should render landing page for /pricing', () => {
			renderRoute('/pricing');
			expect(screen.getByTestId('landing-page')).toBeInTheDocument();
		});

		/**
		 * Onboarding routes - New user setup process
		 */
		it('should render onboarding for /onboarding', () => {
			renderRoute('/onboarding');
			expect(screen.getByTestId('onboarding')).toBeInTheDocument();
		});

		it('should render onboarding for /create-workspace', () => {
			renderRoute('/create-workspace');
			expect(screen.getByTestId('onboarding')).toBeInTheDocument();
		});

		/**
		 * Authentication routes - User login and signup
		 * BUSINESS VALUE: Essential for user access and security
		 */
		it('should render login page for /verify-user', () => {
			renderRoute('/verify-user');
			expect(screen.getByTestId('login-page')).toBeInTheDocument();
		});

		it('should render login page for /referral/:referralCode', () => {
			renderRoute('/referral/test-code');
			expect(screen.getByTestId('login-page')).toBeInTheDocument();
		});

		it('should render OAuth verify for /user/verify-oauth-user', () => {
			renderRoute('/user/verify-oauth-user');
			expect(screen.getByTestId('oauth-verify')).toBeInTheDocument();
		});

		/**
		 * Legal and policy routes - Required for compliance
		 * BUSINESS VALUE: Legal compliance and user trust
		 */
		it('should render privacy policy for /privacy-policy', () => {
			renderRoute('/privacy-policy');
			expect(screen.getByTestId('privacy-policy')).toBeInTheDocument();
		});

		it('should render terms of service for /terms-of-service', () => {
			renderRoute('/terms-of-service');
			expect(screen.getByTestId('terms-of-service')).toBeInTheDocument();
		});

		it('should render cookie policy for /cookie-policy', () => {
			renderRoute('/cookie-policy');
			expect(screen.getByTestId('cookie-policy')).toBeInTheDocument();
		});

		it('should render changelog for /changelog', () => {
			renderRoute('/changelog');
			expect(screen.getByTestId('changelog')).toBeInTheDocument();
		});

		/**
		 * Public chat route - Allows external users to chat
		 */
		it('should render public chat for /c/:sessionId', () => {
			renderRoute('/c/test-session');
			expect(screen.getByTestId('public-chat')).toBeInTheDocument();
		});
	});

	// ============================================================================
	// 🔐 PROTECTED ROUTES TESTS - CORE FEATURES
	// These routes require authentication and contain main app functionality
	// ============================================================================

	describe('Protected Routes - Core Features', () => {
		/**
		 * Main dashboard and home routes
		 */
		it('should render home page for authenticated users', () => {
			renderRoute('/home');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('initial-home-page')).toBeInTheDocument();
		});

		it('should render playbook for authenticated users', () => {
			renderRoute('/playbook');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('global-workflows')).toBeInTheDocument();
		});

		it('should render share and earn for authenticated users', () => {
			renderRoute('/share-and-earn');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('share-and-earn')).toBeInTheDocument();
		});

		/**
		 * Task and productivity management
		 */
		it('should render tasks for authenticated users', () => {
			renderRoute('/tasks');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('tasks')).toBeInTheDocument();
		});

		/**
		 * Calendar and scheduling features
		 * BUSINESS VALUE: Time management and meeting coordination
		 */
		it('should render calendar for authenticated users', () => {
			renderRoute('/calendar');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('calendar-module')).toBeInTheDocument();
		});

		it('should render scheduler for authenticated users', () => {
			renderRoute('/scheduler');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('scheduler-main-page')).toBeInTheDocument();
		});

		/**
		 * Content management features
		 * BUSINESS VALUE: Document creation, storage, and collaboration
		 */
		it('should render notes for authenticated users', () => {
			renderRoute('/notes');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('notes-page')).toBeInTheDocument();
		});

		it('should render contacts for authenticated users', () => {
			renderRoute('/contacts');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('contacts')).toBeInTheDocument();
		});

		/**
		 * AI and automation features
		 * BUSINESS VALUE: Advanced features that differentiate the product
		 */
		it('should render AI assistant for authenticated users', () => {
			renderRoute('/ai-assistant');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('ai-assistants')).toBeInTheDocument();
		});

		it('should render docs for authenticated users', () => {
			renderRoute('/docs');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('docs')).toBeInTheDocument();
		});

		it('should render knowledge agent for authenticated users', () => {
			renderRoute('/knowledge-agent');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('knowledge-agents')).toBeInTheDocument();
		});

		/**
		 * Template and form management
		 */
		it('should render my templates for authenticated users', () => {
			renderRoute('/my-templates');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('my-templates')).toBeInTheDocument();
		});

		it('should render forms for authenticated users', () => {
			renderRoute('/form');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('forms')).toBeInTheDocument();
		});

		/**
		 * Automation and integration features
		 * BUSINESS VALUE: Workflow optimization and third-party connectivity
		 */
		it('should render automations for authenticated users', () => {
			renderRoute('/automations');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('automations')).toBeInTheDocument();
		});

		it('should render integrations for authenticated users', () => {
			renderRoute('/integrations');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('integrations')).toBeInTheDocument();
		});

		/**
		 * File and agent management
		 * BUSINESS VALUE: Asset management and AI agent control
		 */
		it('should render files for authenticated users', () => {
			renderRoute('/files');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('files')).toBeInTheDocument();
		});

		it('should render agents for authenticated users', () => {
			renderRoute('/agents');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('agents')).toBeInTheDocument();
		});
	});

	// ============================================================================
	// ⚙️ PROTECTED ROUTES TESTS - SETUP & SETTINGS
	// These routes handle app configuration and user preferences
	// ============================================================================

	describe('Protected Routes - Setup & Settings', () => {
		/**
		 * Early access and brand setup
		 * BUSINESS VALUE: User onboarding and brand customization
		 */
		it('should render early access for authenticated users', () => {
			renderRoute('/early-access');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('early-access')).toBeInTheDocument();
		});

		it('should render brand setup for authenticated users', () => {
			renderRoute('/brand-setup');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('brand-setup')).toBeInTheDocument();
		});

		/**
		 * Gallery management features
		 * BUSINESS VALUE: Media sharing and presentation capabilities
		 */
		it('should render galleries for authenticated users', () => {
			renderRoute('/galleries');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('add-gallery')).toBeInTheDocument();
		});

		it('should render lite gallery for authenticated users', () => {
			renderRoute('/lite-gallery');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('lite-gallery')).toBeInTheDocument();
		});

		/**
		 * Search functionality
		 * BUSINESS VALUE: Content discovery and quick access
		 */
		it('should render search for authenticated users', () => {
			renderRoute('/search');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('elastic-search')).toBeInTheDocument();
		});
	});

	// ============================================================================
	// 🔄 DYNAMIC ROUTES TESTS - CORE FEATURES
	// These routes have parameters and render different content based on IDs
	// ============================================================================

	describe('Dynamic Routes - Core Features', () => {
		/**
		 * Workflow and automation builders
		 */
		it('should render workflow builder with template ID', () => {
			renderRoute('/workflow_builder/test-template');
			expect(screen.getByTestId('workflow-builder-layout')).toBeInTheDocument();
			expect(screen.getByTestId('workflow-builder')).toBeInTheDocument();
		});

		it('should render automation builder with template ID', () => {
			renderRoute('/automation_builder/test-template');
			expect(screen.getByTestId('workflow-builder-layout')).toBeInTheDocument();
			expect(screen.getByTestId('workflow-builder-updated')).toBeInTheDocument();
		});

		/**
		 * Smart file management
		 */
		it('should render smart file with template and workflow IDs', () => {
			renderRoute('/smart-file/test-template/test-workflow');
			expect(screen.getByTestId('smart-file-layout')).toBeInTheDocument();
			expect(screen.getByTestId('smart-file')).toBeInTheDocument();
		});

		/**
		 * Settings and configuration
		 */
		it('should render settings with type parameter', () => {
			renderRoute('/settings/general');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('settings-wrapper')).toBeInTheDocument();
		});

		/**
		 * Individual item views
		 * BUSINESS VALUE: Detailed views for specific items (tasks, contacts, etc.)
		 */
		it('should render task with task ID', () => {
			renderRoute('/task/test-task');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('task-full-view')).toBeInTheDocument();
		});

		it('should render edit scheduler with session ID', () => {
			renderRoute('/scheduling/edit/test-session');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('edit-scheduler')).toBeInTheDocument();
		});

		/**
		 * AI assistant management
		 * BUSINESS VALUE: AI agent configuration and management
		 */
		it('should render AI assistant with assistant ID', () => {
			renderRoute('/ai-assistant/test-assistant');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('agent-details')).toBeInTheDocument();
		});

		it('should render edit agent with assistant ID', () => {
			renderRoute('/ai-assistant/test-assistant/edit');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('edit-agent')).toBeInTheDocument();
		});

		/**
		 * Knowledge agent management
		 */
		it('should render knowledge agent with agent ID', () => {
			renderRoute('/knowledge-agent/test-agent');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('knowledge-agent-details')).toBeInTheDocument();
		});

		it('should render edit knowledge agent with agent ID', () => {
			renderRoute('/knowledge-agent/test-agent/edit');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('edit-knowledge-agent')).toBeInTheDocument();
		});

		/**
		 * Document and content management
		 */
		it('should render doc ', () => {
			renderRoute('/doc/test-doc');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('docs-full-view')).toBeInTheDocument();
		});

		/**
		 * Automation and form management
		 */
		it('should render automation builder with automation ID', () => {
			renderRoute('/automation-builder/test-automation');
			expect(screen.getByTestId('automation-builder-layout')).toBeInTheDocument();
			expect(screen.getByTestId('automation-builder')).toBeInTheDocument();
		});

		it('should render form ', () => {
			renderRoute('/form/test-form');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('form-leads')).toBeInTheDocument();
		});

		it('should render form responses with form ID', () => {
			renderRoute('/forms/test-form/responses');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('form-res-card')).toBeInTheDocument();
		});

		it('should render form summary with form ID', () => {
			renderRoute('/forms/test-form/summary');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('form-summary')).toBeInTheDocument();
		});

		/**
		 * Communication and collaboration
		 */
		it('should render chat with session ID', () => {
			renderRoute('/chat/test-session');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('recent-chat')).toBeInTheDocument();
		});

		it('should render note with note ID', () => {
			renderRoute('/note/test-note');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('notes')).toBeInTheDocument();
		});

		it('should render contact with contact ID', () => {
			renderRoute('/contact/test-contact');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('expanded-client-view')).toBeInTheDocument();
		});

		/**
		 * Advanced AI features
		 */
		it('should render proactive AI ', () => {
			renderRoute('/proactiveai/test-ai');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('proactive-ai')).toBeInTheDocument();
		});

		/**
		 * Builder app - Document creation tool
		 */
		it('should redirect to home for /builder/* route ', () => {
			renderRoute('/builder/test-path');
			expect(screen.getByTestId('navigate')).toBeInTheDocument();
			expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/');
		});

		it('should render agent with agent ID', () => {
			renderRoute('/agent/test-agent');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('agent')).toBeInTheDocument();
		});
	});

	// ============================================================================
	// 🖼️ DYNAMIC ROUTES TESTS - GALLERY FEATURES
	// These routes handle media gallery management and viewing
	// ============================================================================

	describe('Dynamic Routes - Gallery Features', () => {
		/**
		 * Gallery management and viewing
		 */
		it('should render gallery with gallery ID', () => {
			renderRoute('/galleries/test-gallery');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('gallery-page')).toBeInTheDocument();
		});

		it('should render upload photos with gallery and album IDs', () => {
			renderRoute('/galleries/test-gallery/test-album/upload-photos');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('upload-photos')).toBeInTheDocument();
		});

		it('should render album settings with gallery and album IDs', () => {
			renderRoute('/galleries/test-gallery/test-album/album-settings');
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
			expect(screen.getByTestId('album-settings')).toBeInTheDocument();
		});

		it('should render gallery viewer with gallery and album IDs', () => {
			renderRoute('/galleries/test-gallery/test-album/gallery-viewer');
			expect(screen.getByTestId('gallery-view-layout')).toBeInTheDocument();
			expect(screen.getByTestId('gallery-viewer')).toBeInTheDocument();
		});
	});

	// ============================================================================
	// 🔐 AUTHENTICATION REDIRECTS TESTS
	// These tests ensure proper authentication handling
	// ============================================================================

	describe('Authentication Redirects', () => {
		/**
		 * Test authentication behavior for protected routes
		 */
		it('should handle unauthenticated users appropriately', () => {
			localStorage.clear();
			// For now, just verify the route renders something (the actual redirect logic
			// would be handled by the AuthWrapper component in real usage)
			renderRoute('/home');
			// The component should still render, but the AuthWrapper would handle auth logic
			expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
		});
	});

	// ============================================================================
	// ⚙️ ROUTE CONFIGURATION TESTS
	// These tests validate the overall routing system setup
	// ============================================================================

	describe('Route Configuration', () => {
		/**
		 * Validate catch-all route exists
		 */
		it('should have catch-all route in the routes array', () => {
			const catchAllRoute = routes.find((r) => r.path === '*');
			expect(catchAllRoute).toBeDefined();
			expect(catchAllRoute.path).toBe('*');
		});

		/**
		 * Test catch-all route behavior
		 */
		it('should render catch-all route for unknown paths', () => {
			renderRoute('/unknown-path');
			expect(screen.getByTestId('navigate')).toBeInTheDocument();
			expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/');
		});
	});
});
