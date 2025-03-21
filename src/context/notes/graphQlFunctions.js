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

export const addNotesAccessMutation = gql`
	mutation SharePage($pageId: ID!, $usersPermissionInput: [UserPermissionInput]!) {
		sharePage(pageId: $pageId, usersPermissionInput: $usersPermissionInput) {
			success
			message
		}
	}
`;

export const changeNotesAccessMutation = gql`
	mutation Mutation($pageId: ID!, $userPermissionInput: UserPermissionInput!) {
		changePageAccess(pageId: $pageId, UserPermissionInput: $userPermissionInput) {
			success
			message
		}
	}
`;

export const updatePageMutation = gql`
	mutation Mutation($pageId: ID!, $input: UpdatePageInput!) {
		updatePage(pageId: $pageId, input: $input) {
			_id
			title
			icon
			coverImage
			permissions {
				private
				sharedWith {
					userId
					access
				}
			}
			blocks
			isDeleted
			tenantId
			createdAt
			updatedAt
			createdBy
		}
	}
`;

export const removeNotesAccessMutation = gql`
	mutation Mutation($pageId: ID!, $userId: ID!) {
		unsharePage(pageId: $pageId, userId: $userId) {
			message
			success
		}
	}
`;

export const addToFavoriteMutation = gql`
	mutation AddToFavorite($pageId: ID!) {
		addToFavorite(pageId: $pageId) {
			success
			message
		}
	}
`;

export const removeFromFavoriteMutation = gql`
	mutation RemoveFromFavorite($pageId: ID!) {
		removeFromFavorite(pageId: $pageId) {
			success
			message
		}
	}
`;
