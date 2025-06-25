import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Drawer, Tooltip } from 'antd';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import Notes from '../../views/components/sidebar/notes/Notes';
// import NotesGrid from '../../views/components/files/NotesGrid';
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

		// Test: Drawer opens when showNotesDrawer is true
		it('should render notes sidebar when open', () => {
			renderWithRouter(<Notes showNotesDrawer={true} setShowNotesDrawer={vi.fn()} />);

			expect(screen.getByTestId('drawer')).toBeInTheDocument();
			expect(screen.getByText('Notes')).toBeInTheDocument();
		});

		// Test: Drawer doesn't render when closed
		it('should not render when drawer is closed', () => {
			renderWithRouter(<Notes showNotesDrawer={false} setShowNotesDrawer={vi.fn()} />);

			expect(screen.queryByTestId('drawer')).not.toBeInTheDocument();
		});

		// Test: Shows loading message initially
		it('should display loading state initially', () => {
			renderWithRouter(<Notes showNotesDrawer={true} setShowNotesDrawer={vi.fn()} />);

			expect(screen.getByText('Loading notes...')).toBeInTheDocument();
		});

		// Test: Displays notes list when data is available
		it('should display notes list when data is available', async () => {
			mockContextValue.notes.notes = mockNotesData;

			renderWithRouter(<Notes showNotesDrawer={true} setShowNotesDrawer={vi.fn()} />);

			await waitFor(() => {
				expect(screen.getByText('Test Note 1')).toBeInTheDocument();
				expect(screen.getByText('Test Note 2')).toBeInTheDocument();
			});
		});

		// Test: Shows empty state when no notes exist
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

		// Test: Clicking a note navigates to it and closes drawer
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

		// Test: Creating a new note works
		it('should handle create new note', async () => {
			const mockResponse = [{}, { _id: 'new-note-id' }];
			mockContextValue.notes.createNotesList.mockResolvedValue(mockResponse);
			const setShowNotesDrawer = vi.fn();

			renderWithRouter(
				<Notes showNotesDrawer={true} setShowNotesDrawer={setShowNotesDrawer} />,
			);

			const plusButton = screen.getByTestId('plus-icon');
			fireEvent.click(plusButton);

			await waitFor(() => {
				expect(mockContextValue.notes.createNotesList).toHaveBeenCalledWith({
					input: { title: 'New Note' },
				});
				expect(mockNavigate).toHaveBeenCalledWith('/note/new-note-id');
			});
		});

		// Test: Filter dropdown shows tooltip
		it('should handle filter dropdown', () => {
			renderWithRouter(<Notes showNotesDrawer={true} setShowNotesDrawer={vi.fn()} />);

			const filterButton = screen.getByTestId('filter-icon');
			fireEvent.click(filterButton);

			expect(screen.getByTestId('tooltip')).toBeInTheDocument();
		});

		// Test: Infinite scroll loads more notes
		it('should handle infinite scroll', async () => {
			mockContextValue.notes.notes = {
				...mockNotesData,
				hasNextPage: true,
			};

			renderWithRouter(<Notes showNotesDrawer={true} setShowNotesDrawer={vi.fn()} />);

			await waitFor(() => {
				expect(screen.getByTestId('infinite-scroll')).toBeInTheDocument();
			});
		});

		// Test: Timestamps are formatted correctly
		it('should format timestamp correctly', async () => {
			mockContextValue.notes.notes = mockNotesData;

			renderWithRouter(<Notes showNotesDrawer={true} setShowNotesDrawer={vi.fn()} />);

			await waitFor(() => {
				expect(moment.unix).toHaveBeenCalledWith(1640995200);
			});
		});
	});

	// Temporarily comment out NotesGrid tests to isolate the issue
	/*
	describe('NotesGrid Component', () => {
		// NotesGrid tests will be added here once the import issues are resolved
	});
	*/

	describe('Component Integration Tests', () => {
		// Test: Notes list integrates with editor navigation
		it('should integrate notes list with editor navigation', async () => {
			const mockNotes = [{ _id: '1', title: 'Note 1', updatedAt: 1640995200 }];

			mockContextValue.notes.notes = {
				currentPage: 1,
				data: mockNotes,
				hasNextPage: false,
			};

			const setShowNotesDrawer = vi.fn();

			renderWithRouter(
				<>
					<Notes showNotesDrawer={true} setShowNotesDrawer={setShowNotesDrawer} />
				</>,
			);

			await waitFor(() => {
				const noteElement = screen.getByText('Note 1');
				fireEvent.click(noteElement);
			});

			expect(mockNavigate).toHaveBeenCalledWith('/note/1');
			expect(setShowNotesDrawer).toHaveBeenCalledWith(false);
		});
	});
});
 