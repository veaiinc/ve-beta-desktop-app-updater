import { gql } from '@apollo/client';
export const getNotesListQuery = gql`
	query ListPrivatePages($input: PageFilterInput!) {
		listPrivatePages(input: $input) {
			hasNextPage
			currentPage
			data {
				_id
				title
				icon
				tenantId
				createdAt
				updatedAt
				createdBy
			}
		}
	}
`;
export const createNotesQuery = gql`
	mutation CreatePage($input: CreatePageInput!) {
		createPage(input: $input) {
			_id
		}
	}
`;

export const getPageQuery = gql`
	query GetPage($pageId: ID!) {
		getPage(pageId: $pageId) {
			blocks
			title
			updatedAt
			tenantId
			createdBy
			createdAt
			coverImage
		}
	}
`;

export const saveNotesPageQuery = gql`
	mutation UpdateBlocks($pageId: ID!, $blocks: [JSON]) {
		updateBlocks(pageId: $pageId, blocks: $blocks) {
			_id
		}
	}
`;

export const getNotesAccessQuery = gql`
	query Query($pageId: ID!) {
		listSharedUsers(pageId: $pageId) {
			_id
			userId
			access
			fullName
			email
		}
	}
`;

export const addNotesAccessQuery = gql`
	mutation SharePage($pageId: ID!, $usersPermissionInput: [UserPermissionInput]!) {
		sharePage(pageId: $pageId, usersPermissionInput: $usersPermissionInput) {
			success
			message
		}
	}
`;
