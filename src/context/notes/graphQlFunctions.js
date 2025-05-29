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
				isReadOnly
				selectionLimit
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

export const getDatabaseQuery = gql`
	query GetDatabase($databaseId: ID!, $pageId: ID!) {
		database(id: $databaseId, pageId: $pageId) {
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
				isReadOnly
				selectionLimit
			}
			sourceBlockId
			createdAt
			updatedAt
			createdBy
			updatedBy
		}
	}
`;

export const getDatabaseRowsQuery = gql`
	query ListDatabaseRow($pageId: ID!, $input: DatabaseRowsInput!) {
		databaseRows(pageId: $pageId, input: $input) {
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
				values
				createdAt
				databaseId
				updatedAt
				serialNumber
				createdBy {
					_id
					name
				}
				updatedBy {
					_id
					name
				}
			}
		}
	}
`;

export const addDatabaseRowMutation = gql`
	mutation CreateDatabaseRow($pageId: ID!, $input: CreateDatabaseRowInput!) {
		createDatabaseRow(pageId: $pageId, input: $input) {
			_id
			values
			createdAt
			updatedAt
			databaseId
			serialNumber
			createdBy {
				_id
				name
			}
			updatedBy {
				_id
				name
			}
		}
	}
`;

export const updateDatabaseRowMutation = gql`
	mutation UpdateDatabaseRow(
		$updateDatabaseRowId: ID!
		$input: UpdateDatabaseRowInput!
		$pageId: ID!
	) {
		updateDatabaseRow(id: $updateDatabaseRowId, input: $input, pageId: $pageId)
	}
`;

export const addDatabaseFieldMutation = gql`
	mutation AddDatabaseField($pageId: ID!, $databaseId: ID!, $input: DatabaseFieldInput!) {
		addDatabaseField(pageId: $pageId, databaseId: $databaseId, input: $input) {
			_id
			name
			type
			config
			isRequired
			isUnique
			isReadOnly
			createdAt
			updatedAt
			createdBy
			updatedBy
		}
	}
`;

export const updateDatabaseFieldMutation = gql`
	mutation UpdateDatabaseField(
		$pageId: ID!
		$databaseId: ID!
		$fieldId: ID!
		$input: UpdateDatabaseFieldInput!
	) {
		updateDatabaseField(
			pageId: $pageId
			databaseId: $databaseId
			fieldId: $fieldId
			input: $input
		) {
			_id
			name
			type
			config
			isRequired
			isUnique
			isReadOnly
			createdAt
			updatedAt
			createdBy
			updatedBy
		}
	}
`;

export const deleteDatabaseFieldMutation = gql`
	mutation Mutation($pageId: ID!, $databaseId: ID!, $fieldId: ID!) {
		deleteDatabaseField(pageId: $pageId, databaseId: $databaseId, fieldId: $fieldId) {
			success
			message
		}
	}
`;

export const updateDatabaseMutation = gql`
	mutation UpdateDatabase($updateDatabaseId: ID!, $pageId: ID!, $input: UpdateDatabaseInput!) {
		updateDatabase(id: $updateDatabaseId, pageId: $pageId, input: $input) {
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
				selectionLimit
			}
			createdAt
			updatedAt
			createdBy
			updatedBy
		}
	}
`;

export const listAvailableDatabasesQuery = gql`
	query Query($pageId: ID!) {
		listDatabases(pageId: $pageId) {
			_id
			name
			sourceBlockId
		}
	}
`;
