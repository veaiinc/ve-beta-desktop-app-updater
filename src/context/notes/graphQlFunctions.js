import { gql } from '@apollo/client';
// export const getNotesListQuery = gql`
// 	query ListPages($input: ListPageInput!) {
// 		listPages(input: $input) {
// 			totalPages
// 			totalDocs
// 			limit
// 			currentPage
// 			hasNextPage
// 			hasPrevPage
// 			prevPage
// 			nextPage
// 			data {
// 				_id
// 				title
// 				coverImage
// 				permissions {
// 					private
// 					sharedWith {
// 						access
// 						userId
// 					}
// 				}
// 				isDeleted
// 				tenantId
// 				createdAt
// 				updatedAt
// 				createdBy
// 			}
// 		}
// 	}
// `;
// export const createNotesQuery = gql`
// 	mutation CreatePage($input: CreatePageInput!) {
// 		createPage(input: $input) {
// 			_id
// 		}
// 	}
// `;

// export const getPageQuery = gql`
// 	query Query($pageId: ID!) {
// 		getPage(pageId: $pageId) {
// 			_id
// 			title
// 			coverImage
// 			iconImage
// 			permissions {
// 				private
// 				sharedWith {
// 					userId
// 					access
// 				}
// 			}
// 			blocks
// 			isDeleted
// 			tenantId
// 			createdAt
// 			updatedAt
// 			updatedBy
// 			createdBy
// 			isFavorite
// 			isPublished
// 			slug
// 			expiresAt
// 			globalNoteAccess
// 		}
// 	}
// `;

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

export const deletePageMutation = gql`
	mutation DeletePage($pageId: ID!, $isPermanent: Boolean) {
		deletePage(pageId: $pageId, isPermanent: $isPermanent) {
			success
			message
		}
	}
`;

export const duplicatePageMutation = gql`
	mutation DuplicatePage($pageId: ID!) {
		duplicatePage(pageId: $pageId) {
			_id
			title
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
			isFavorite
			viewedBy {
				userId
				lastSeenAt
				fullName
				email
			}
		}
	}
`;

export const globalNotesAccessMutation = gql`
	mutation GlobalNoteAccess($pageId: ID!, $input: GlobalNoteAccessInput!) {
		globalNoteAccess(pageId: $pageId, input: $input) {
			message
			success
		}
	}
`;

export const notesImageBlockUploadMutation = gql`
	mutation UploadPageBlockImage(
		$pageId: ID!
		$uploadPageBlockImageInput: UploadPageBlockImageInput!
	) {
		uploadPageBlockImage(
			pageId: $pageId
			uploadPageBlockImageInput: $uploadPageBlockImageInput
		) {
			signedUrl
			imageUrl
		}
	}
`;

export const notesImageBlockDeleteMutation = gql`
	mutation Mutation($pageId: ID!, $imageInput: ImageInput!) {
		deletePageImage(pageId: $pageId, imageInput: $imageInput) {
			success
			message
		}
	}
`;

export const notesLinkUploadMutation = gql`
	mutation Mutation($pageId: ID!, $input: UpdatePageInput!) {
		updatePage(pageId: $pageId, input: $input) {
			coverImage
		}
	}
`;

export const notesCoverImageFileUploadMutation = gql`
	mutation Mutation($pageId: ID!, $imageType: ImageTypeInput!) {
		uploadPageImage(pageId: $pageId, imageType: $imageType) {
			imageUrl
			signedUrl
		}
	}
`;

export const notesIconUploadMutation = gql`
	mutation UpdatePage($pageId: ID!, $input: UpdatePageInput!) {
		updatePage(pageId: $pageId, input: $input) {
			iconImage
		}
	}
`;

export const notesDeleteCoverImageMutation = gql`
	mutation DeletePageImage($pageId: ID!, $imageInput: ImageInput!) {
		deletePageImage(pageId: $pageId, imageInput: $imageInput) {
			success
			message
		}
	}
`;

export const getNotesListQuery = gql`
	query ListPrivatePages($input: PageFilterInput!) {
		listPrivatePages(input: $input) {
			totalPages
			totalDocs
			limit
			currentPage
			hasNextPage
			hasPrevPage
			prevPage
			nextPage
			data {
				id
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
				tenantId
				createdAt
				updatedAt
				createdBy
			}
		}
	}
`;

export const createNotesMutation = gql`
	mutation Mutation($input: CreatePageInput!) {
		createPage(input: $input) {
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
			tenantId
			createdAt
			updatedAt
			createdBy
		}
	}
`;

export const getPageQuery = gql`
	query Query($pageId: ID!) {
		getPage(pageId: $pageId) {
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
			tenantId
			createdAt
			updatedAt
			createdBy
		}
	}
`;

export const getBlocksQuery = gql`
	query Query($pageId: ID!, $listBlockInput: ListBlockInput!) {
		blocks(pageId: $pageId, listBlockInput: $listBlockInput) {
			totalPages
			totalDocs
			limit
			currentPage
			hasNextPage
			hasPrevPage
			prevPage
			nextPage
			data {
				_id
				id
				type
				pageId
				parentBlockId
				position
				props
				content
				children
				comments
				createdAt
				updatedAt
				tenantId
			}
		}
	}
`;

export const createBlockMutation = gql`
	mutation CreateBlock($pageId: ID!, $input: CreateBlockInput!) {
		createBlock(pageId: $pageId, input: $input) {
			_id
			id
			type
			pageId
			parentBlockId
			position
			props
			content
			children
			comments
			createdAt
			updatedAt
			tenantId
		}
	}
`;

export const updateBlockMutation = gql`
	mutation UpdateBlock($updateBlockId: ID!, $pageId: ID!, $input: UpdateBlockInput!) {
		updateBlock(id: $updateBlockId, pageId: $pageId, input: $input) {
			_id
			id
			type
			pageId
			parentBlockId
			position
			props
			content
			children
			comments
			createdAt
			updatedAt
			tenantId
		}
	}
`;

export const deleteBlockMutation = gql`
	mutation DeleteBlock($pageId: ID!, $deleteBlockId: ID!) {
		deleteBlock(pageId: $pageId, id: $deleteBlockId)
	}
`;

export const createDatabaseMutation = gql`
	mutation CreateDatabase($pageId: ID!, $input: CreateDatabaseInput!) {
		createDatabase(pageId: $pageId, input: $input) {
			_id
			name
			description
			icon
			fields {
				_id
				name
				type
				config
				isRequired
				isUnique
			}
			createdAt
			updatedAt
			sourceBlockId
			createdBy
			updatedBy
		}
	}
`;

export const createDatabaseViewMutation = gql`
	mutation Mutation($pageId: ID!, $input: CreateDatabaseViewInput!) {
		createDatabaseView(pageId: $pageId, input: $input) {
			_id
			databaseId
			createdAt
			updatedAt
			createdBy
			updatedBy
			blockId
			pageId
			viewConfig
		}
	}
`;
