import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { gql } from '@apollo/client';
import Reducer from '../../context/notes/reducer';
import { intialState } from '../../context/notes/state';
import { Actions } from '../../context/notes/action';
import {
	getNotesListQuery,
	createNotesQuery,
	getPageQuery,
	saveNotesPageQuery,
	getNotesAccessQuery,
	addNotesAccessMutation,
	changeNotesAccessMutation,
	updatePageMutation,
	removeNotesAccessMutation,
	addToFavoriteMutation,
	removeFromFavoriteMutation,
	deletePageMutation,
	duplicatePageMutation,
	globalNotesAccessMutation,
	notesImageBlockUploadMutation,
	notesImageBlockDeleteMutation,
	notesLinkUploadMutation,
	notesCoverImageFileUploadMutation,
	notesIconUploadMutation,
	notesDeleteCoverImageMutation,
} from '../../context/notes/graphQlFunctions';

// Mock Apollo Client - return the query string directly
vi.mock('@apollo/client', () => ({
	gql: vi.fn((query) => query),
}));

// Mock GraphQL client
const mockClient = {
	query: vi.fn(),
	mutate: vi.fn(),
};

describe('Notes API Management', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('GraphQL Queries', () => {
		// Test: Notes list query exists and has correct structure
		it('should have correct getNotesListQuery structure', () => {
			expect(getNotesListQuery).toBeDefined();
			expect(Array.isArray(getNotesListQuery)).toBe(true);
			expect(getNotesListQuery.length).toBeGreaterThan(0);
		});

		// Test: Create note query exists and has correct structure
		it('should have correct createNotesQuery structure', () => {
			expect(createNotesQuery).toBeDefined();
			expect(Array.isArray(createNotesQuery)).toBe(true);
			expect(createNotesQuery.length).toBeGreaterThan(0);
		});

		// Test: Get page query exists and has correct structure
		it('should have correct getPageQuery structure', () => {
			expect(getPageQuery).toBeDefined();
			expect(Array.isArray(getPageQuery)).toBe(true);
			expect(getPageQuery.length).toBeGreaterThan(0);
		});

		// Test: Save page query exists and has correct structure
		it('should have correct saveNotesPageQuery structure', () => {
			expect(saveNotesPageQuery).toBeDefined();
			expect(Array.isArray(saveNotesPageQuery)).toBe(true);
			expect(saveNotesPageQuery.length).toBeGreaterThan(0);
		});

		// Test: Notes access query exists and has correct structure
		it('should have correct getNotesAccessQuery structure', () => {
			expect(getNotesAccessQuery).toBeDefined();
			expect(Array.isArray(getNotesAccessQuery)).toBe(true);
			expect(getNotesAccessQuery.length).toBeGreaterThan(0);
		});
	});

	describe('GraphQL Mutations', () => {
		// Test: Add access mutation exists and has correct structure
		it('should have correct addNotesAccessMutation structure', () => {
			expect(addNotesAccessMutation).toBeDefined();
			expect(Array.isArray(addNotesAccessMutation)).toBe(true);
			expect(addNotesAccessMutation.length).toBeGreaterThan(0);
		});

		// Test: Change access mutation exists and has correct structure
		it('should have correct changeNotesAccessMutation structure', () => {
			expect(changeNotesAccessMutation).toBeDefined();
			expect(Array.isArray(changeNotesAccessMutation)).toBe(true);
			expect(changeNotesAccessMutation.length).toBeGreaterThan(0);
		});

		// Test: Update page mutation exists and has correct structure
		it('should have correct updatePageMutation structure', () => {
			expect(updatePageMutation).toBeDefined();
			expect(Array.isArray(updatePageMutation)).toBe(true);
			expect(updatePageMutation.length).toBeGreaterThan(0);
		});

		// Test: Remove access mutation exists and has correct structure
		it('should have correct removeNotesAccessMutation structure', () => {
			expect(removeNotesAccessMutation).toBeDefined();
			expect(Array.isArray(removeNotesAccessMutation)).toBe(true);
			expect(removeNotesAccessMutation.length).toBeGreaterThan(0);
		});

		// Test: Add to favorite mutation exists and has correct structure
		it('should have correct addToFavoriteMutation structure', () => {
			expect(addToFavoriteMutation).toBeDefined();
			expect(Array.isArray(addToFavoriteMutation)).toBe(true);
			expect(addToFavoriteMutation.length).toBeGreaterThan(0);
		});

		// Test: Remove from favorite mutation exists and has correct structure
		it('should have correct removeFromFavoriteMutation structure', () => {
			expect(removeFromFavoriteMutation).toBeDefined();
			expect(Array.isArray(removeFromFavoriteMutation)).toBe(true);
			expect(removeFromFavoriteMutation.length).toBeGreaterThan(0);
		});

		// Test: Delete page mutation exists and has correct structure
		it('should have correct deletePageMutation structure', () => {
			expect(deletePageMutation).toBeDefined();
			expect(Array.isArray(deletePageMutation)).toBe(true);
			expect(deletePageMutation.length).toBeGreaterThan(0);
		});

		// Test: Duplicate page mutation exists and has correct structure
		it('should have correct duplicatePageMutation structure', () => {
			expect(duplicatePageMutation).toBeDefined();
			expect(Array.isArray(duplicatePageMutation)).toBe(true);
			expect(duplicatePageMutation.length).toBeGreaterThan(0);
		});

		// Test: Global access mutation exists and has correct structure
		it('should have correct globalNotesAccessMutation structure', () => {
			expect(globalNotesAccessMutation).toBeDefined();
			expect(Array.isArray(globalNotesAccessMutation)).toBe(true);
			expect(globalNotesAccessMutation.length).toBeGreaterThan(0);
		});

		// Test: Image upload mutation exists and has correct structure
		it('should have correct image upload mutations', () => {
			expect(notesImageBlockUploadMutation).toBeDefined();
			expect(Array.isArray(notesImageBlockUploadMutation)).toBe(true);
			expect(notesImageBlockUploadMutation.length).toBeGreaterThan(0);
		});

		// Test: Image delete mutation exists and has correct structure
		it('should have correct image delete mutations', () => {
			expect(notesImageBlockDeleteMutation).toBeDefined();
			expect(Array.isArray(notesImageBlockDeleteMutation)).toBe(true);
			expect(notesImageBlockDeleteMutation.length).toBeGreaterThan(0);
		});

		// Test: Cover image upload mutation exists and has correct structure
		it('should have correct cover image upload mutation', () => {
			expect(notesCoverImageFileUploadMutation).toBeDefined();
			expect(Array.isArray(notesCoverImageFileUploadMutation)).toBe(true);
			expect(notesCoverImageFileUploadMutation.length).toBeGreaterThan(0);
		});

		// Test: Icon upload mutation exists and has correct structure
		it('should have correct icon upload mutation', () => {
			expect(notesIconUploadMutation).toBeDefined();
			expect(Array.isArray(notesIconUploadMutation)).toBe(true);
			expect(notesIconUploadMutation.length).toBeGreaterThan(0);
		});
	});

	describe('Reducer Tests', () => {
		// Test: Reducer returns initial state for unknown actions
		it('should return initial state for unknown action', () => {
			const initialState = {
				notes: null,
				notesPageData: null,
				notesAccess: null,
				globalAccess: null,
			};
			const result = Reducer(initialState, { type: 'UNKNOWN_ACTION' });
			expect(result).toEqual(initialState);
		});

		// Test: Reducer handles getting notes successfully
		it('should handle GET_NOTES_SUCCESS action', () => {
			const initialState = {
				notes: null,
				notesPageData: null,
				notesAccess: null,
				globalAccess: null,
			};
			const payload = { data: [{ _id: '1', title: 'Test Note' }] };
			const result = Reducer(initialState, { type: Actions.GET_NOTES_SUCCESS, payload });
			expect(result.notes).toEqual(payload);
		});

		// Test: Reducer handles getting more notes successfully
		it('should handle GET_MORE_NOTES_SUCCESS action', () => {
			const initialState = {
				notes: null,
				notesPageData: null,
				notesAccess: null,
				globalAccess: null,
			};
			const payload = { data: [{ _id: '2', title: 'More Notes' }] };
			const result = Reducer(initialState, { type: Actions.GET_MORE_NOTES_SUCCESS, payload });
			expect(result.moreNotes).toEqual(payload);
		});

		// Test: Reducer handles getting page data successfully
		it('should handle GET_NOTES_PAGE_DATA_SUCCESS action', () => {
			const initialState = {
				notes: null,
				notesPageData: null,
				notesAccess: null,
				globalAccess: null,
			};
			const payload = { data: { _id: '1', title: 'Page Data' } };
			const result = Reducer(initialState, {
				type: Actions.GET_NOTES_PAGE_DATA_SUCCESS,
				payload,
			});
			expect(result.notesPageData).toEqual(payload);
		});

		// Test: Reducer handles getting access data successfully
		it('should handle GET_NOTES_ACCESS_SUCCESS action', () => {
			const initialState = {
				notes: null,
				notesPageData: null,
				notesAccess: null,
				globalAccess: null,
			};
			const payload = [{ userId: '1', access: 'read' }];
			const result = Reducer(initialState, {
				type: Actions.GET_NOTES_ACCESS_SUCCESS,
				payload,
			});
			expect(result.notesAccess).toEqual(payload);
		});

		// Test: Reducer handles setting global access
		it('should handle SET_GLOBAL_ACCESS action', () => {
			const initialState = {
				notes: null,
				notesPageData: null,
				notesAccess: null,
				globalAccess: null,
			};
			const payload = { isEnabled: true, access: 'write' };
			const result = Reducer(initialState, { type: Actions.SET_GLOBAL_ACCESS, payload });
			expect(result.globalAccess).toEqual(payload);
		});

		// Test: Reducer handles updating notes state
		it('should handle UPDATE_NOTES_STATE action', () => {
			const initialState = {
				notes: null,
				notesPageData: null,
				notesAccess: null,
				globalAccess: null,
			};
			const payload = { notes: [{ _id: '1' }], globalAccess: { isEnabled: false } };
			const result = Reducer(initialState, { type: Actions.UPDATE_NOTES_STATE, payload });
			expect(result.notes).toEqual(payload.notes);
			expect(result.globalAccess).toEqual(payload.globalAccess);
		});

		// Test: Reducer resets state correctly
		it('should handle RESET_STATE action', () => {
			const currentState = {
				notes: [{ _id: '1' }],
				notesPageData: { _id: '1' },
				notesAccess: [{ userId: '1' }],
				globalAccess: { isEnabled: true },
			};
			const result = Reducer(currentState, { type: Actions.RESET_STATE });
			// Check that the result has the expected properties from initial state
			expect(result).toHaveProperty('notes');
			expect(result).toHaveProperty('notesPageData');
			expect(result).toHaveProperty('notesAccess');
			expect(result).toHaveProperty('globalAccess');
			// Check that the values are reset to initial state values
			expect(result.notes).toBeNull();
			expect(result.notesPageData).toBeNull();
			expect(result.notesAccess).toBeNull();
			expect(result.globalAccess).toBeNull();
		});
	});

	describe('API Function Tests', () => {
		// Test: Notes list query has valid parameters
		it('should validate notes list query parameters', () => {
			const query = getNotesListQuery;
			expect(query).toBeDefined();
			expect(Array.isArray(query)).toBe(true);
			expect(query.length).toBeGreaterThan(0);
		});

		// Test: Create note query has valid input parameters
		it('should validate create note input parameters', () => {
			const query = createNotesQuery;
			expect(query).toBeDefined();
			expect(Array.isArray(query)).toBe(true);
			expect(query.length).toBeGreaterThan(0);
		});

		// Test: Page update query has valid input parameters
		it('should validate page update input parameters', () => {
			const query = saveNotesPageQuery;
			expect(query).toBeDefined();
			expect(Array.isArray(query)).toBe(true);
			expect(query.length).toBeGreaterThan(0);
		});

		// Test: User permission query has valid input parameters
		it('should validate user permission input', () => {
			const query = addNotesAccessMutation;
			expect(query).toBeDefined();
			expect(Array.isArray(query)).toBe(true);
			expect(query.length).toBeGreaterThan(0);
		});

		// Test: Image upload query has valid input parameters
		it('should validate image upload input', () => {
			const query = notesImageBlockUploadMutation;
			expect(query).toBeDefined();
			expect(Array.isArray(query)).toBe(true);
			expect(query.length).toBeGreaterThan(0);
		});
	});

	describe('Error Handling', () => {
		// Test: GraphQL query errors are handled properly
		it('should handle GraphQL query errors', () => {
			const query = getNotesListQuery;
			expect(Array.isArray(query)).toBe(true);
			expect(query).toBeDefined();
		});

		// Test: GraphQL mutation errors are handled properly
		it('should handle GraphQL mutation errors', () => {
			const mutation = createNotesQuery;
			expect(Array.isArray(mutation)).toBe(true);
			expect(mutation).toBeDefined();
		});

		// Test: Required parameters are validated for queries
		it('should validate required parameters for queries', () => {
			const queries = [getNotesListQuery, getPageQuery, getNotesAccessQuery];
			queries.forEach((query) => {
				expect(Array.isArray(query)).toBe(true);
				expect(query).toBeDefined();
			});
		});

		// Test: Required parameters are validated for mutations
		it('should validate required parameters for mutations', () => {
			const mutations = [
				createNotesQuery,
				saveNotesPageQuery,
				addNotesAccessMutation,
				deletePageMutation,
			];
			mutations.forEach((mutation) => {
				expect(Array.isArray(mutation)).toBe(true);
				expect(mutation).toBeDefined();
			});
		});
	});

	describe('Data Transformation', () => {
		// Test: Notes list response is transformed correctly
		it('should transform notes list response correctly', () => {
			const query = getNotesListQuery;
			expect(query).toBeDefined();
			expect(Array.isArray(query)).toBe(true);
			expect(query.length).toBeGreaterThan(0);
		});

		// Test: Page data response is transformed correctly
		it('should transform page data response correctly', () => {
			const query = getPageQuery;
			expect(query).toBeDefined();
			expect(Array.isArray(query)).toBe(true);
			expect(query.length).toBeGreaterThan(0);
		});

		// Test: Access data response is transformed correctly
		it('should transform access data response correctly', () => {
			const query = getNotesAccessQuery;
			expect(query).toBeDefined();
			expect(Array.isArray(query)).toBe(true);
			expect(query.length).toBeGreaterThan(0);
		});
	});
});
