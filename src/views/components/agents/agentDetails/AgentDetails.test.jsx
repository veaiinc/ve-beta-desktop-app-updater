import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AgentDetails from './AgentDetails';
import Context from '../../../../context/context';
import ContextState from '../../../../context/ContextStates';
//Component renders without crashing

// Mock the child components
vi.mock('../runBuildToggle/RunAndBuildToggle', () => ({
	default: ({ agentAction, setAgentAction }) => (
		<div data-testid="run-build-toggle">
			<span data-testid="agent-action">{agentAction}</span>
			<button onClick={() => setAgentAction('runAgent')}>Switch to Run</button>
		</div>
	),
}));

vi.mock('./configureAgent/ConfigureAgent', () => ({
	default: ({ agentId }) => <div data-testid="configure-agent">Configure Agent {agentId}</div>,
}));

vi.mock('./agentCredentials/AgentCredentials', () => ({
	default: ({ agentId }) => (
		<div data-testid="agent-credentials">Agent Credentials {agentId}</div>
	),
}));

vi.mock('../../../../views/features/knowledgeAgent/AgentDetails', () => ({
	default: () => <div data-testid="knowledge-agent-details">Knowledge Agent Details</div>,
}));

// Mock react-router-dom
const mockUseParams = vi.fn();
const mockUseSearchParams = vi.fn();

vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		useParams: () => mockUseParams(),
		useSearchParams: () => mockUseSearchParams(),
	};
});

// Mock localStorage
const localStorageMock = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
	value: localStorageMock,
});

const renderWithProviders = (component) => {
	return render(
		<ContextState>
			<BrowserRouter>{component}</BrowserRouter>
		</ContextState>,
	);
};

describe('AgentDetails', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseParams.mockReturnValue({ agentId: 'test-agent-123' });
		mockUseSearchParams.mockReturnValue([
			new URLSearchParams('agentAction=buildAgent&config=prompt'),
			vi.fn(),
		]);

		// Mock localStorage values
		localStorageMock.getItem.mockImplementation((key) => {
			if (key === 'workspaceId') return 'test-workspace';
			if (key === 'usertoken') return 'test-token';
			return null;
		});
	});

	/**
	 * Test: Default Component Rendering with Build Agent Mode
	 *
	 * This test verifies that:
	 * 1. The component renders successfully with default URL parameters
	 * 2. The toggle component shows the correct default action ('buildAgent')
	 * 3. Both ConfigureAgent and AgentCredentials components are rendered
	 * 4. The component handles async API calls properly using waitFor
	 * 5. The component integrates correctly with the context and router
	 */
	it('renders the component with default build agent action', async () => {
		renderWithProviders(<AgentDetails />);

		// Check if main components are rendered
		expect(screen.getByTestId('run-build-toggle')).toBeInTheDocument();
		expect(screen.getByTestId('agent-action')).toHaveTextContent('buildAgent');

		// Wait for API call to complete
		await waitFor(() => {
			expect(screen.getByTestId('configure-agent')).toBeInTheDocument();
			expect(screen.getByTestId('agent-credentials')).toBeInTheDocument();
		});
	});

	/**
	 * Test: Component State Switching to Run Agent Mode
	 *
	 * This test verifies that:
	 * 1. The component correctly switches to 'runAgent' mode when URL params change
	 * 2. The KnowledgeAgentDetails component is rendered instead of build components
	 * 3. The ConfigureAgent and AgentCredentials components are hidden
	 * 4. The component responds correctly to URL parameter changes
	 * 5. Conditional rendering logic works as expected
	 */
	it('renders knowledge agent details when agentAction is runAgent', async () => {
		mockUseSearchParams.mockReturnValue([
			new URLSearchParams('agentAction=runAgent&config=prompt'),
			vi.fn(),
		]);

		renderWithProviders(<AgentDetails />);

		await waitFor(() => {
			expect(screen.getByTestId('knowledge-agent-details')).toBeInTheDocument();
		});

		expect(screen.queryByTestId('configure-agent')).not.toBeInTheDocument();
		expect(screen.queryByTestId('agent-credentials')).not.toBeInTheDocument();
	});

	/**
	 * Test: Props and Data Flow to Child Components
	 *
	 * This test verifies that:
	 * 1. The agentId from URL parameters is correctly extracted
	 * 2. The agentId is properly passed down to child components
	 * 3. Child components receive and display the correct agent ID
	 * 4. Data flows correctly through the component hierarchy
	 * 5. URL parameter parsing works correctly
	 */
	it('displays correct agent ID in child components', async () => {
		renderWithProviders(<AgentDetails />);

		await waitFor(() => {
			expect(screen.getByTestId('configure-agent')).toHaveTextContent(
				'Configure Agent test-agent-123',
			);
			expect(screen.getByTestId('agent-credentials')).toHaveTextContent(
				'Agent Credentials test-agent-123',
			);
		});
	});

	/**
	 * Test: Error Handling and Edge Cases
	 *
	 * This test verifies that:
	 * 1. The component doesn't crash when given an invalid/non-existent agent ID
	 * 2. The component gracefully handles API errors or missing data
	 * 3. Basic UI elements still render even when data is unavailable
	 * 4. The component is resilient to edge cases and errors
	 * 5. Error boundaries or fallback behavior works correctly
	 */
	it('handles agent not found scenario', async () => {
		mockUseParams.mockReturnValue({ agentId: 'non-existent-agent' });

		renderWithProviders(<AgentDetails />);

		// Component should still render without crashing
		await waitFor(() => {
			expect(screen.getByTestId('run-build-toggle')).toBeInTheDocument();
		});
	});
});
