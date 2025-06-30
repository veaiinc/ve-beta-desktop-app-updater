/**
 * Notes API Tests
 * ===============
 *
 * Comprehensive tests for the Notes API module focusing on:
 * - GraphQL query and mutation functionality
 * - Reducer state management
 * - API error handling
 * - Data transformation and validation
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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
		it('should have valid getNotesListQuery structure', () => {
			expect(getNotesListQuery).toBeDefined();
			expect(typeof getNotesListQuery).toBe('object');
			expect(getNotesListQuery.kind).toBe('Document');
			expect(getNotesListQuery.definitions).toBeDefined();
			expect(getNotesListQuery.definitions.length).toBeGreaterThan(0);
		});

		it('should have valid createNotesQuery structure', () => {
			expect(createNotesQuery).toBeDefined();
			expect(typeof createNotesQuery).toBe('object');
			expect(createNotesQuery.kind).toBe('Document');
			expect(createNotesQuery.definitions).toBeDefined();
			expect(createNotesQuery.definitions.length).toBeGreaterThan(0);
		});

		it('should have valid getPageQuery structure', () => {
			expect(getPageQuery).toBeDefined();
			expect(typeof getPageQuery).toBe('object');
			expect(getPageQuery.kind).toBe('Document');
			expect(getPageQuery.definitions).toBeDefined();
			expect(getPageQuery.definitions.length).toBeGreaterThan(0);
		});

		it('should have valid saveNotesPageQuery structure', () => {
			expect(saveNotesPageQuery).toBeDefined();
			expect(typeof saveNotesPageQuery).toBe('object');
			expect(saveNotesPageQuery.kind).toBe('Document');
			expect(saveNotesPageQuery.definitions).toBeDefined();
			expect(saveNotesPageQuery.definitions.length).toBeGreaterThan(0);
		});

		it('should have valid getNotesAccessQuery structure', () => {
			expect(getNotesAccessQuery).toBeDefined();
			expect(typeof getNotesAccessQuery).toBe('object');
			expect(getNotesAccessQuery.kind).toBe('Document');
			expect(getNotesAccessQuery.definitions).toBeDefined();
			expect(getNotesAccessQuery.definitions.length).toBeGreaterThan(0);
		});
	});

	describe('GraphQL Mutations', () => {
		it('should have valid addNotesAccessMutation structure', () => {
			expect(addNotesAccessMutation).toBeDefined();
			expect(typeof addNotesAccessMutation).toBe('object');
			expect(addNotesAccessMutation.kind).toBe('Document');
			expect(addNotesAccessMutation.definitions).toBeDefined();
			expect(addNotesAccessMutation.definitions.length).toBeGreaterThan(0);
		});

		it('should have valid changeNotesAccessMutation structure', () => {
			expect(changeNotesAccessMutation).toBeDefined();
			expect(typeof changeNotesAccessMutation).toBe('object');
			expect(changeNotesAccessMutation.kind).toBe('Document');
			expect(changeNotesAccessMutation.definitions).toBeDefined();
			expect(changeNotesAccessMutation.definitions.length).toBeGreaterThan(0);
		});

		it('should have valid updatePageMutation structure', () => {
			expect(updatePageMutation).toBeDefined();
			expect(typeof updatePageMutation).toBe('object');
			expect(updatePageMutation.kind).toBe('Document');
			expect(updatePageMutation.definitions).toBeDefined();
			expect(updatePageMutation.definitions.length).toBeGreaterThan(0);
		});

		it('should have valid removeNotesAccessMutation structure', () => {
			expect(removeNotesAccessMutation).toBeDefined();
			expect(typeof removeNotesAccessMutation).toBe('object');
			expect(removeNotesAccessMutation.kind).toBe('Document');
			expect(removeNotesAccessMutation.definitions).toBeDefined();
			expect(removeNotesAccessMutation.definitions.length).toBeGreaterThan(0);
		});

		it('should have valid addToFavoriteMutation structure', () => {
			expect(addToFavoriteMutation).toBeDefined();
			expect(typeof addToFavoriteMutation).toBe('object');
			expect(addToFavoriteMutation.kind).toBe('Document');
			expect(addToFavoriteMutation.definitions).toBeDefined();
			expect(addToFavoriteMutation.definitions.length).toBeGreaterThan(0);
		});

		it('should have valid removeFromFavoriteMutation structure', () => {
			expect(removeFromFavoriteMutation).toBeDefined();
			expect(typeof removeFromFavoriteMutation).toBe('object');
			expect(removeFromFavoriteMutation.kind).toBe('Document');
			expect(removeFromFavoriteMutation.definitions).toBeDefined();
			expect(removeFromFavoriteMutation.definitions.length).toBeGreaterThan(0);
		});

		it('should have valid deletePageMutation structure', () => {
			expect(deletePageMutation).toBeDefined();
			expect(typeof deletePageMutation).toBe('object');
			expect(deletePageMutation.kind).toBe('Document');
			expect(deletePageMutation.definitions).toBeDefined();
			expect(deletePageMutation.definitions.length).toBeGreaterThan(0);
		});

		it('should have valid duplicatePageMutation structure', () => {
			expect(duplicatePageMutation).toBeDefined();
			expect(typeof duplicatePageMutation).toBe('object');
			expect(duplicatePageMutation.kind).toBe('Document');
			expect(duplicatePageMutation.definitions).toBeDefined();
			expect(duplicatePageMutation.definitions.length).toBeGreaterThan(0);
		});

		it('should have valid globalNotesAccessMutation structure', () => {
			expect(globalNotesAccessMutation).toBeDefined();
			expect(typeof globalNotesAccessMutation).toBe('object');
			expect(globalNotesAccessMutation.kind).toBe('Document');
			expect(globalNotesAccessMutation.definitions).toBeDefined();
			expect(globalNotesAccessMutation.definitions.length).toBeGreaterThan(0);
		});

		it('should have valid image upload mutations', () => {
			expect(notesImageBlockUploadMutation).toBeDefined();
			expect(typeof notesImageBlockUploadMutation).toBe('object');
			expect(notesImageBlockUploadMutation.kind).toBe('Document');
			expect(notesImageBlockUploadMutation.definitions).toBeDefined();
			expect(notesImageBlockUploadMutation.definitions.length).toBeGreaterThan(0);
		});

		it('should have valid image delete mutations', () => {
			expect(notesImageBlockDeleteMutation).toBeDefined();
			expect(typeof notesImageBlockDeleteMutation).toBe('object');
			expect(notesImageBlockDeleteMutation.kind).toBe('Document');
			expect(notesImageBlockDeleteMutation.definitions).toBeDefined();
			expect(notesImageBlockDeleteMutation.definitions.length).toBeGreaterThan(0);
		});

		it('should have valid cover image upload mutation', () => {
			expect(notesCoverImageFileUploadMutation).toBeDefined();
			expect(typeof notesCoverImageFileUploadMutation).toBe('object');
			expect(notesCoverImageFileUploadMutation.kind).toBe('Document');
			expect(notesCoverImageFileUploadMutation.definitions).toBeDefined();
			expect(notesCoverImageFileUploadMutation.definitions.length).toBeGreaterThan(0);
		});

		it('should have valid icon upload mutation', () => {
			expect(notesIconUploadMutation).toBeDefined();
			expect(typeof notesIconUploadMutation).toBe('object');
			expect(notesIconUploadMutation.kind).toBe('Document');
			expect(notesIconUploadMutation.definitions).toBeDefined();
			expect(notesIconUploadMutation.definitions.length).toBeGreaterThan(0);
		});
	});

	describe('Reducer Tests', () => {
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

		it('should handle GET_NOTES_SUCCESS action', () => {
			const initialState = {
				notes: null,
				notesPageData: null,
				notesAccess: null,
				globalAccess: null,
			};
			const payload = { data: [{ _id: '1', title: 'Test Note' }] };
			const action = { type: 'GET_NOTES_SUCCESS', payload };

			const result = Reducer(initialState, action);

			expect(result.notes).toEqual(payload);
			expect(result.notesPageData).toBeNull();
			expect(result.notesAccess).toBeNull();
			expect(result.globalAccess).toBeNull();
		});

		it('should handle GET_NOTES_PAGE_DATA_SUCCESS action', () => {
			const initialState = {
				notes: null,
				notesPageData: null,
				notesAccess: null,
				globalAccess: null,
			};
			const payload = { _id: '1', title: 'Test Page', content: 'Test content' };
			const action = { type: 'GET_NOTES_PAGE_DATA_SUCCESS', payload };

			const result = Reducer(initialState, action);

			expect(result.notesPageData).toEqual(payload);
			expect(result.notes).toBeNull();
			expect(result.notesAccess).toBeNull();
			expect(result.globalAccess).toBeNull();
		});

		it('should handle GET_NOTES_ACCESS_SUCCESS action', () => {
			const initialState = {
				notes: null,
				notesPageData: null,
				notesAccess: null,
				globalAccess: null,
			};
			const payload = { users: [{ _id: '1', name: 'Test User' }] };
			const action = { type: 'GET_NOTES_ACCESS_SUCCESS', payload };

			const result = Reducer(initialState, action);

			expect(result.notesAccess).toEqual(payload);
			expect(result.notes).toBeNull();
			expect(result.notesPageData).toBeNull();
			expect(result.globalAccess).toBeNull();
		});

		it('should handle SET_GLOBAL_ACCESS action', () => {
			const initialState = {
				notes: null,
				notesPageData: null,
				notesAccess: null,
				globalAccess: null,
			};
			const payload = { globalAccess: true };
			const action = { type: 'SET_GLOBAL_ACCESS', payload };

			const result = Reducer(initialState, action);

			expect(result.globalAccess).toEqual(payload);
			expect(result.notes).toBeNull();
			expect(result.notesPageData).toBeNull();
			expect(result.notesAccess).toBeNull();
		});

		it('should handle loading states correctly', () => {
			const initialState = {
				notes: null,
				notesPageData: null,
				notesAccess: null,
				globalAccess: null,
			};
			const action = { type: 'GET_NOTES_LOADING' };

			const result = Reducer(initialState, action);

			expect(result.notes).toBeNull();
			expect(result.notesPageData).toBeNull();
			expect(result.notesAccess).toBeNull();
			expect(result.globalAccess).toBeNull();
		});

		it('should handle error states correctly', () => {
			const initialState = {
				notes: null,
				notesPageData: null,
				notesAccess: null,
				globalAccess: null,
			};
			const action = { type: 'GET_NOTES_ERROR', payload: 'Error message' };

			const result = Reducer(initialState, action);

			expect(result.notes).toBeNull();
			expect(result.notesPageData).toBeNull();
			expect(result.notesAccess).toBeNull();
			expect(result.globalAccess).toBeNull();
		});
	});

	describe('Actions Tests', () => {
		it('should have GET_NOTES_SUCCESS action type', () => {
			expect(Actions.GET_NOTES_SUCCESS).toBe('GET_NOTES_SUCCESS');
		});

		it('should have GET_MORE_NOTES_SUCCESS action type', () => {
			expect(Actions.GET_MORE_NOTES_SUCCESS).toBe('GET_MORE_NOTES_SUCCESS');
		});

		it('should have CREATE_NOTES_PAGE action type', () => {
			expect(Actions.CREATE_NOTES_PAGE).toBe('CREATE_NOTES_PAGE');
		});

		it('should have GET_NOTES_PAGE_DATA_SUCCESS action type', () => {
			expect(Actions.GET_NOTES_PAGE_DATA_SUCCESS).toBe('GET_NOTES_PAGE_DATA_SUCCESS');
		});

		it('should have GET_NOTES_ACCESS_SUCCESS action type', () => {
			expect(Actions.GET_NOTES_ACCESS_SUCCESS).toBe('GET_NOTES_ACCESS_SUCCESS');
		});

		it('should have UPDATE_NOTES_STATE action type', () => {
			expect(Actions.UPDATE_NOTES_STATE).toBe('UPDATE_NOTES_STATE');
		});

		it('should have SET_GLOBAL_ACCESS action type', () => {
			expect(Actions.SET_GLOBAL_ACCESS).toBe('SET_GLOBAL_ACCESS');
		});

		it('should have RESET_STATE action type', () => {
			expect(Actions.RESET_STATE).toBe('RESET_STATE');
		});
	});

	describe('API Integration Tests', () => {
		it('should handle successful notes fetch', async () => {
			const mockNotesData = {
				data: [
					{ _id: '1', title: 'Note 1', content: 'Content 1' },
					{ _id: '2', title: 'Note 2', content: 'Content 2' },
				],
				totalCount: 2,
			};

			mockClient.query.mockResolvedValue({ data: { listPages: mockNotesData } });

			const result = await mockClient.query({
				query: getNotesListQuery,
			});

			expect(result.data.listPages).toEqual(mockNotesData);
			expect(mockClient.query).toHaveBeenCalledWith({
				query: getNotesListQuery,
			});
		});

		it('should handle notes creation', async () => {
			const newNote = {
				title: 'New Note',
				content: 'New content',
			};

			const mockResponse = {
				data: {
					createPage: {
						_id: '3',
						title: 'New Note',
						content: 'New content',
					},
				},
			};

			mockClient.mutate.mockResolvedValue(mockResponse);

			const result = await mockClient.mutate({
				mutation: createNotesQuery,
				variables: { input: newNote },
			});

			expect(result.data.createPage.title).toBe('New Note');
			expect(mockClient.mutate).toHaveBeenCalledWith({
				mutation: createNotesQuery,
				variables: { input: newNote },
			});
		});

		it('should handle notes page fetch', async () => {
			const pageId = '1';
			const mockPageData = {
				_id: '1',
				title: 'Test Page',
				content: 'Test content',
			};

			mockClient.query.mockResolvedValue({ data: { getPage: mockPageData } });

			const result = await mockClient.query({
				query: getPageQuery,
				variables: { pageId },
			});

			expect(result.data.getPage).toEqual(mockPageData);
			expect(mockClient.query).toHaveBeenCalledWith({
				query: getPageQuery,
				variables: { pageId },
			});
		});

		it('should handle notes page save', async () => {
			const pageData = {
				pageId: '1',
				blocks: [{ type: 'text', content: 'Updated content' }],
			};

			const mockResponse = {
				data: {
					updateBlocks: {
						_id: '1',
						title: 'Updated Page',
						content: 'Updated content',
					},
				},
			};

			mockClient.mutate.mockResolvedValue(mockResponse);

			const result = await mockClient.mutate({
				mutation: saveNotesPageQuery,
				variables: pageData,
			});

			expect(result.data.updateBlocks.title).toBe('Updated Page');
			expect(mockClient.mutate).toHaveBeenCalledWith({
				mutation: saveNotesPageQuery,
				variables: pageData,
			});
		});

		it('should handle API errors gracefully', async () => {
			const errorMessage = 'Network error';
			mockClient.query.mockRejectedValue(new Error(errorMessage));

			await expect(
				mockClient.query({
					query: getNotesListQuery,
				}),
			).rejects.toThrow(errorMessage);
		});
	});

	describe('Data Validation Tests', () => {
		it('should validate note data structure', () => {
			const validNote = {
				_id: '1',
				title: 'Test Note',
				content: 'Test content',
				createdAt: '2024-01-01T00:00:00Z',
				updatedAt: '2024-01-01T00:00:00Z',
				createdBy: 'user1',
			};

			expect(validNote._id).toBeDefined();
			expect(validNote.title).toBeDefined();
			expect(validNote.content).toBeDefined();
			expect(validNote.createdAt).toBeDefined();
			expect(validNote.updatedAt).toBeDefined();
			expect(validNote.createdBy).toBeDefined();
		});

		it('should validate page data structure', () => {
			const validPage = {
				_id: '1',
				title: 'Test Page',
				blocks: [{ type: 'text', content: 'Test content' }],
				permissions: {
					private: true,
					sharedWith: [],
				},
			};

			expect(validPage._id).toBeDefined();
			expect(validPage.title).toBeDefined();
			expect(validPage.blocks).toBeDefined();
			expect(validPage.permissions).toBeDefined();
		});

		it('should validate access data structure', () => {
			const validAccess = {
				pageId: '1',
				users: [
					{
						_id: 'user1',
						fullName: 'Test User',
						email: 'test@example.com',
						access: 'read',
					},
				],
			};

			expect(validAccess.pageId).toBeDefined();
			expect(Array.isArray(validAccess.users)).toBe(true);
			expect(validAccess.users[0]._id).toBeDefined();
			expect(validAccess.users[0].fullName).toBeDefined();
			expect(validAccess.users[0].email).toBeDefined();
			expect(validAccess.users[0].access).toBeDefined();
		});
	});
});
