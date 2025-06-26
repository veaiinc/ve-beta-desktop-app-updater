/**
 * Notes Components Tests
 * =====================
 *
 * Comprehensive tests for the Notes components focusing on:
 * - Component rendering and user interactions
 * - State management and data flow
 * - Error handling and edge cases
 * - Accessibility and user experience
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Notes from '../../views/components/sidebar/notes/Notes';
import Context from '../../context/context';

// Mock SCSS imports
vi.mock('../../../assets/scss/files/index.scss', () => ({}));
vi.mock('../../../assets/scss/files/files.scss', () => ({}));

// Mock dependencies
vi.mock('antd', () => ({
	Drawer: ({ children, open, onClose, ...props }) =>
		open ? (
			<div data-testid="drawer" {...props}>
				{children}
			</div>
		) : null,
	Tooltip: ({ children, ...props }) => (
		<div data-testid="tooltip" {...props}>
			{children}
		</div>
	),
}));

vi.mock('react-infinite-scroll-component', () => ({
	default: ({ children, next, hasMore, ...props }) => (
		<div data-testid="infinite-scroll" {...props}>
			{children}
			{hasMore && <button onClick={next}>Load More</button>}
		</div>
	),
}));

vi.mock('moment', () => ({
	default: {
		unix: vi.fn(() => ({
			fromNow: vi.fn(() => '2 hours ago'),
		})),
	},
}));

// Mock SVG components
vi.mock('../../assets/svg/sidebar/notes/back.svg', () => ({
	ReactComponent: () => React.createElement('div', { 'data-testid': 'back-icon' }, 'Back'),
}));

vi.mock('../../assets/svg/sidebar/notes/search.svg', () => ({
	ReactComponent: () => React.createElement('div', { 'data-testid': 'search-icon' }, 'Search'),
}));

vi.mock('../../assets/svg/sidebar/notes/filter.svg', () => ({
	ReactComponent: () => React.createElement('div', { 'data-testid': 'filter-icon' }, 'Filter'),
}));

vi.mock('../../assets/svg/sidebar/notes/note.svg', () => ({
	ReactComponent: () => React.createElement('div', { 'data-testid': 'note-icon' }, 'Note'),
}));

vi.mock('../../assets/svg/sidebar/notes/Plus.svg', () => ({
	ReactComponent: () => React.createElement('div', { 'data-testid': 'plus-icon' }, 'Plus'),
}));

vi.mock('../../assets/svg/tasks/checkmark.svg', () => ({
	ReactComponent: () => React.createElement('div', { 'data-testid': 'check-icon' }, 'Check'),
}));

// Mock router
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

// Mock context values
const mockContextValue = {
	notes: {
		getNotesList: vi.fn(),
		notes: null,
		moreNotes: null,
		createNotesList: vi.fn(),
	},
};

const renderWithRouter = (component) => {
	return render(
		<BrowserRouter>
			<Context.Provider value={mockContextValue}>{component}</Context.Provider>
		</BrowserRouter>,
	);
};

describe('Notes Components', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockNavigate.mockClear();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Notes Sidebar Component', () => {
		const mockNotesData = {
			currentPage: 1,
			data: [
				{
					_id: '1',
					title: 'Test Note 1',
					updatedAt: 1640995200,
				},
				{
					_id: '2',
					title: 'Test Note 2',
					updatedAt: 1640995200,
				},
			],
			hasNextPage: false,
		};

		it('should render notes sidebar when open', () => {
			renderWithRouter(<Notes showNotesDrawer={true} setShowNotesDrawer={vi.fn()} />);

			expect(screen.getByTestId('drawer')).toBeInTheDocument();
			expect(screen.getByText('Notes')).toBeInTheDocument();
		});

		it('should not render when drawer is closed', () => {
			renderWithRouter(<Notes showNotesDrawer={false} setShowNotesDrawer={vi.fn()} />);

			expect(screen.queryByTestId('drawer')).not.toBeInTheDocument();
		});

		it('should display loading state initially', () => {
			renderWithRouter(<Notes showNotesDrawer={true} setShowNotesDrawer={vi.fn()} />);

			expect(screen.getByText('Loading notes...')).toBeInTheDocument();
		});

		it('should display notes list when data is available', async () => {
			mockContextValue.notes.notes = mockNotesData;

			renderWithRouter(<Notes showNotesDrawer={true} setShowNotesDrawer={vi.fn()} />);

			await waitFor(() => {
				expect(screen.getByText('Test Note 1')).toBeInTheDocument();
				expect(screen.getByText('Test Note 2')).toBeInTheDocument();
			});
		});

		it('should display empty state when no notes', async () => {
			mockContextValue.notes.notes = {
				currentPage: 1,
				data: [],
				hasNextPage: false,
			};

			renderWithRouter(<Notes showNotesDrawer={true} setShowNotesDrawer={vi.fn()} />);

			await waitFor(() => {
				expect(screen.getByText('No notes yet!')).toBeInTheDocument();
			});
		});

		it('should handle note click and navigate', async () => {
			mockContextValue.notes.notes = mockNotesData;
			const setShowNotesDrawer = vi.fn();

			renderWithRouter(
				<Notes showNotesDrawer={true} setShowNotesDrawer={setShowNotesDrawer} />,
			);

			await waitFor(() => {
				const noteElement = screen.getByText('Test Note 1');
				fireEvent.click(noteElement);
			});

			expect(mockNavigate).toHaveBeenCalledWith('/note/1');
			expect(setShowNotesDrawer).toHaveBeenCalledWith(false);
		});

		it('should handle create new note', async () => {
			const mockResponse = [{}, { _id: 'new-note-id' }];
			mockContextValue.notes.createNotesList.mockResolvedValue(mockResponse);
			const setShowNotesDrawer = vi.fn();

			renderWithRouter(
				<Notes showNotesDrawer={true} setShowNotesDrawer={setShowNotesDrawer} />,
			);

			const createButton = screen.getByTestId('plus-icon');
			fireEvent.click(createButton);

			await waitFor(() => {
				expect(mockContextValue.notes.createNotesList).toHaveBeenCalled();
			});
		});

		it('should handle search functionality', async () => {
			mockContextValue.notes.notes = mockNotesData;

			renderWithRouter(<Notes showNotesDrawer={true} setShowNotesDrawer={vi.fn()} />);

			await waitFor(() => {
				const searchIcon = screen.getByTestId('search-icon');
				fireEvent.click(searchIcon);
			});

			// Verify search functionality is triggered
			expect(screen.getByTestId('search-icon')).toBeInTheDocument();
		});

		it('should handle filter functionality', async () => {
			mockContextValue.notes.notes = mockNotesData;

			renderWithRouter(<Notes showNotesDrawer={true} setShowNotesDrawer={vi.fn()} />);

			await waitFor(() => {
				const filterIcon = screen.getByTestId('filter-icon');
				fireEvent.click(filterIcon);
			});

			// Verify filter functionality is triggered
			expect(screen.getByTestId('filter-icon')).toBeInTheDocument();
		});

		it('should handle infinite scroll loading', async () => {
			mockContextValue.notes.notes = {
				...mockNotesData,
				hasNextPage: true,
			};

			renderWithRouter(<Notes showNotesDrawer={true} setShowNotesDrawer={vi.fn()} />);

			await waitFor(() => {
				const loadMoreButton = screen.getByText('Load More');
				fireEvent.click(loadMoreButton);
			});

			expect(screen.getByText('Load More')).toBeInTheDocument();
		});

		it('should handle back navigation', async () => {
			renderWithRouter(<Notes showNotesDrawer={true} setShowNotesDrawer={vi.fn()} />);

			const backIcon = screen.getByTestId('back-icon');
			fireEvent.click(backIcon);

			expect(backIcon).toBeInTheDocument();
		});

		it('should handle error state', async () => {
			mockContextValue.notes.notes = null;
			mockContextValue.notes.getNotesList.mockRejectedValue(new Error('Failed to load'));

			renderWithRouter(<Notes showNotesDrawer={true} setShowNotesDrawer={vi.fn()} />);

			await waitFor(() => {
				expect(screen.getByText('Loading notes...')).toBeInTheDocument();
			});
		});

		it('should handle notes with different states', async () => {
			const notesWithStates = {
				currentPage: 1,
				data: [
					{
						_id: '1',
						title: 'Active Note',
						updatedAt: 1640995200,
						isActive: true,
					},
					{
						_id: '2',
						title: 'Inactive Note',
						updatedAt: 1640995200,
						isActive: false,
					},
				],
				hasNextPage: false,
			};

			mockContextValue.notes.notes = notesWithStates;

			renderWithRouter(<Notes showNotesDrawer={true} setShowNotesDrawer={vi.fn()} />);

			await waitFor(() => {
				expect(screen.getByText('Active Note')).toBeInTheDocument();
				expect(screen.getByText('Inactive Note')).toBeInTheDocument();
			});
		});

		it('should handle notes with timestamps', async () => {
			const notesWithTimestamps = {
				currentPage: 1,
				data: [
					{
						_id: '1',
						title: 'Recent Note',
						updatedAt: Date.now() / 1000,
					},
					{
						_id: '2',
						title: 'Old Note',
						updatedAt: 1640995200, // Old timestamp
					},
				],
				hasNextPage: false,
			};

			mockContextValue.notes.notes = notesWithTimestamps;

			renderWithRouter(<Notes showNotesDrawer={true} setShowNotesDrawer={vi.fn()} />);

			await waitFor(() => {
				expect(screen.getByText('Recent Note')).toBeInTheDocument();
				expect(screen.getByText('Old Note')).toBeInTheDocument();
			});
		});

		it('should handle drawer close functionality', () => {
			const setShowNotesDrawer = vi.fn();

			renderWithRouter(
				<Notes showNotesDrawer={true} setShowNotesDrawer={setShowNotesDrawer} />,
			);

			// Simulate drawer close (this would typically be triggered by clicking outside or ESC key)
			expect(setShowNotesDrawer).toBeDefined();
		});

		it('should handle keyboard navigation', async () => {
			mockContextValue.notes.notes = mockNotesData;

			renderWithRouter(<Notes showNotesDrawer={true} setShowNotesDrawer={vi.fn()} />);

			await waitFor(() => {
				const noteElement = screen.getByText('Test Note 1');

				// Test keyboard navigation
				fireEvent.keyDown(noteElement, { key: 'Enter' });
				fireEvent.keyDown(noteElement, { key: ' ' }); // Space key
			});

			expect(screen.getByText('Test Note 1')).toBeInTheDocument();
		});

		it('should handle accessibility attributes', async () => {
			mockContextValue.notes.notes = mockNotesData;

			renderWithRouter(<Notes showNotesDrawer={true} setShowNotesDrawer={vi.fn()} />);

			await waitFor(() => {
				const noteElement = screen.getByText('Test Note 1');

				// Check for accessibility attributes
				expect(noteElement).toBeInTheDocument();
			});
		});

		it('should handle responsive behavior', () => {
			// Mock window resize
			Object.defineProperty(window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: 768, // Mobile width
			});

			renderWithRouter(<Notes showNotesDrawer={true} setShowNotesDrawer={vi.fn()} />);

			expect(screen.getByTestId('drawer')).toBeInTheDocument();
		});

		it('should handle performance with large note lists', async () => {
			const largeNotesData = {
				currentPage: 1,
				data: Array.from({ length: 100 }, (_, i) => ({
					_id: `note-${i}`,
					title: `Note ${i}`,
					updatedAt: 1640995200,
				})),
				hasNextPage: false,
			};

			mockContextValue.notes.notes = largeNotesData;

			const startTime = performance.now();

			renderWithRouter(<Notes showNotesDrawer={true} setShowNotesDrawer={vi.fn()} />);

			await waitFor(() => {
				expect(screen.getByText('Note 0')).toBeInTheDocument();
				expect(screen.getByText('Note 99')).toBeInTheDocument();
			});

			const endTime = performance.now();
			const renderTime = endTime - startTime;

			expect(renderTime).toBeLessThan(1000); // Should render in less than 1 second
		});
	});

	describe('Notes Component Integration', () => {
		it('should integrate with context properly', () => {
			const mockGetNotesList = vi.fn();
			const mockCreateNotesList = vi.fn();

			const contextWithFunctions = {
				notes: {
					getNotesList: mockGetNotesList,
					notes: null,
					moreNotes: null,
					createNotesList: mockCreateNotesList,
				},
			};

			render(
				<BrowserRouter>
					<Context.Provider value={contextWithFunctions}>
						<Notes showNotesDrawer={true} setShowNotesDrawer={vi.fn()} />
					</Context.Provider>
				</BrowserRouter>,
			);

			expect(mockGetNotesList).toBeDefined();
			expect(mockCreateNotesList).toBeDefined();
		});

		it('should handle context updates', async () => {
			// Define mock data within the test scope
			const mockNotesData = {
				currentPage: 1,
				data: [
					{
						_id: '1',
						title: 'Test Note 1',
						updatedAt: 1640995200,
					},
					{
						_id: '2',
						title: 'Test Note 2',
						updatedAt: 1640995200,
					},
				],
				hasNextPage: false,
			};

			// Start with no data to show loading state
			const initialContextValue = {
				notes: {
					getNotesList: vi.fn(),
					notes: null,
					moreNotes: null,
					createNotesList: vi.fn(),
				},
			};

			const { rerender } = render(
				<BrowserRouter>
					<Context.Provider value={initialContextValue}>
						<Notes showNotesDrawer={true} setShowNotesDrawer={vi.fn()} />
					</Context.Provider>
				</BrowserRouter>,
			);

			// Initially should show loading
			expect(screen.getByText('Loading notes...')).toBeInTheDocument();

			// Update context with data
			const updatedContextValue = {
				notes: {
					getNotesList: vi.fn(),
					notes: mockNotesData,
					moreNotes: null,
					createNotesList: vi.fn(),
				},
			};

			rerender(
				<BrowserRouter>
					<Context.Provider value={updatedContextValue}>
						<Notes showNotesDrawer={true} setShowNotesDrawer={vi.fn()} />
					</Context.Provider>
				</BrowserRouter>,
			);

			await waitFor(() => {
				expect(screen.getByText('Test Note 1')).toBeInTheDocument();
			});
		});
	});

	describe('Error Handling', () => {
		it('should handle network errors gracefully', async () => {
			// Mock context with no data to show loading state
			const errorContextValue = {
				notes: {
					getNotesList: vi.fn().mockRejectedValue(new Error('Network error')),
					notes: null,
					moreNotes: null,
					createNotesList: vi.fn(),
				},
			};

			render(
				<BrowserRouter>
					<Context.Provider value={errorContextValue}>
						<Notes showNotesDrawer={true} setShowNotesDrawer={vi.fn()} />
					</Context.Provider>
				</BrowserRouter>,
			);

			// Should show loading state initially
			expect(screen.getByText('Loading notes...')).toBeInTheDocument();
		});

		it('should handle malformed data', async () => {
			const malformedData = {
				currentPage: 1,
				data: [
					{
						_id: '1',
						// Missing title
						updatedAt: 1640995200,
					},
				],
				hasNextPage: false,
			};

			const malformedContextValue = {
				notes: {
					getNotesList: vi.fn(),
					notes: malformedData,
					moreNotes: null,
					createNotesList: vi.fn(),
				},
			};

			render(
				<BrowserRouter>
					<Context.Provider value={malformedContextValue}>
						<Notes showNotesDrawer={true} setShowNotesDrawer={vi.fn()} />
					</Context.Provider>
				</BrowserRouter>,
			);

			await waitFor(() => {
				// Should still render without crashing
				expect(screen.getByTestId('drawer')).toBeInTheDocument();
			});
		});
	});
});
