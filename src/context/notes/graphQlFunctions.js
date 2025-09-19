import { gql } from '@apollo/client';
export const getNotesListQuery = gql`
	query ListPages($input: ListPageInput!) {
		listPages(input: $input) {
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
				title
				coverImage
				iconImage
				permissions {
					private
					sharedWith {
						access
						userId
					}
				}
				favorites
				isDeleted
				tenantId
				createdAt
				updatedAt
				createdBy
			}
		}
	}
`;

export const createNotesMutation = gql`
	mutation CreatePage($input: CreatePageInput!) {
		createPage(input: $input) {
			_id
		}
	}
`;

export const getPageQuery = gql`
	query Query($pageId: ID!) {
		getPage(pageId: $pageId) {
			_id
			title
			coverImage
			iconImage
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
			updatedBy
			createdBy
			isFavorite
			isPublished
			slug
			expiresAt
			globalNoteAccess
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

export const changeNotesAccessMutationDatabase = gql`
	mutation ChangePageAccess($pageId: ID!, $userPermissionInput: UserPermissionInput!) {
		changePageAccess(pageId: $pageId, userPermissionInput: $userPermissionInput) {
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
			# blocks
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

//database
export const updateGlobalNotesAccessMutation = gql`
	mutation Mutation($pageId: ID!, $input: TenantAccessInput!) {
		updateTenantAccess(pageId: $pageId, input: $input) {
			success
			message
		}
	}
`;

export const notesImageBlockUploadMutation = gql`
	mutation UploadPageBlockImage(
		$pageId: ID!
		$blockId: ID!
		$uploadPageBlockImageInput: UploadPageBlockImageInput!
	) {
		uploadPageBlockImage(
			pageId: $pageId
			blockId: $blockId
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

export const getNotesListDatabaseQuery = gql`
	query ListPages($input: PageFilterInput!) {
		listPages(input: $input) {
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
				updatedBy
				isDeleted
			}
		}
	}
`;

export const createNotesDatabaseMutation = gql`
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

export const getPageQueryDatabase = gql`
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
				tenantAccess
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
				parentId
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
			parentId
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
			parentId
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
	mutation CreateDatabaseView($pageId: ID!, $input: CreateDatabaseViewInput!) {
		createDatabaseView(pageId: $pageId, input: $input) {
			_id
			databaseId
			pageId
			blockId
			label
			cardSize
			sortBy {
				_id
				fieldId
				direction
			}
			filterBy {
				_id
				fieldId
				fieldType
				operator
				value
				filter
			}
			groupBy {
				fieldId
				visibleGroups
				fieldType
				defaultGroups
				config {
					statusBy
					numberBy {
						groupRange
						groupInterval
					}
					dateBy
					textBy
				}
			}
			# visibleFields
			type
			columnWidths
			aggregations
			order
			createdAt
			updatedAt
			createdBy
			updatedBy
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

// export const getDatabaseRowsQuery = gql`
// 	query ListDatabaseRows(
// 		$pageId: ID!
// 		$databaseId: ID!
// 		$input: DatabaseRowsInput!
// 		$databaseViewId: ID
// 	) {
// 		listDatabaseRows(
// 			pageId: $pageId
// 			databaseId: $databaseId
// 			input: $input
// 			databaseViewId: $databaseViewId
// 		) {
// 			totalPages
// 			totalDocs
// 			limit
// 			currentPage
// 			hasNextPage
// 			data {
// 				_id
// 				values
// 				databaseId
// 				serialNumber
// 				createdAt
// 				updatedAt
// 				createdBy {
// 					_id
// 					name
// 					email
// 				}
// 				updatedBy {
// 					_id
// 					name
// 					email
// 				}
// 			}
// 		}
// 	}
// `;

export const getDatabaseRowsQuery = gql`
	query listDatabaseRowsWithGroup(
		$pageId: ID!
		$databaseId: ID!
		$input: DatabaseRowsInputWithGroup!
		$databaseViewId: ID
	) {
		listDatabaseRowsWithGroup(
			pageId: $pageId
			databaseId: $databaseId
			input: $input
			databaseViewId: $databaseViewId
		) {
			metaInfo {
				fieldId
				fieldType
				totalPages
				totalGroups
				limit
				currentPage
				hasPrevPage
				hasNextPage
				prevPage
				nextPage
			}
			data {
				_id
				totalDocs
				limit
				currentPage
				totalPages
				hasPrevPage
				hasNextPage
				prevPage
				nextPage
				docs {
					_id
					values
					databaseId
					serialNumber
					createdAt
					updatedAt
					createdBy {
						_id
						name
						email
					}
					updatedBy {
						_id
						name
						email
					}
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

export const deleteDatabaseRowMutation = gql`
	mutation DeleteDatabaseRow($deleteDatabaseRowId: ID!, $pageId: ID!) {
		deleteDatabaseRow(id: $deleteDatabaseRowId, pageId: $pageId)
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
			selectionLimit
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
			selectionLimit
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

export const getDatabaseViewsQuery = gql`
	query DatabaseViews($pageId: ID!, $blockId: ID!) {
		databaseViews(pageId: $pageId, blockId: $blockId) {
			_id
			databaseId
			pageId
			label
			blockId
			cardSize
			sortBy {
				fieldId
				direction
				_id
			}
			filterBy {
				_id
				fieldId
				fieldType
				operator
				value
				filter
			}
			groupBy {
				fieldId
				fieldType
				visibleGroups
				defaultGroups
				config {
					statusBy
					numberBy {
						groupRange
						groupInterval
					}
					dateBy
					textBy
				}
			}
			# visibleFields
			type
			columnWidths
			aggregations
			order
			createdAt
			updatedAt
			createdBy
			updatedBy
		}
	}
`;

export const deleteDatabaseViewMutation = gql`
	mutation DeleteDatabaseView($pageId: ID!, $deleteDatabaseViewId: ID!) {
		deleteDatabaseView(pageId: $pageId, id: $deleteDatabaseViewId) {
			success
			message
		}
	}
`;

export const addFilterMutation = gql`
	mutation AddFilter(
		$pageId: ID!
		$databaseViewId: ID!
		$databaseId: ID!
		$input: DatabaseFilterInput!
	) {
		addFilter(
			pageId: $pageId
			databaseViewId: $databaseViewId
			databaseId: $databaseId
			input: $input
		) {
			fieldId
			operator
			value
			_id
			filter
			fieldType
		}
	}
`;

export const removeFilterMutation = gql`
	mutation DeleteFilter($pageId: ID!, $databaseViewId: ID!, $databaseId: ID!, $filterId: ID!) {
		deleteFilter(
			pageId: $pageId
			databaseViewId: $databaseViewId
			databaseId: $databaseId
			filterId: $filterId
		) {
			success
			message
		}
	}
`;

export const updateFilterMutation = gql`
	mutation UpdateFilter(
		$pageId: ID!
		$databaseViewId: ID!
		$databaseId: ID!
		$filterId: ID!
		$input: DatabaseFilterInput!
	) {
		updateFilter(
			pageId: $pageId
			databaseViewId: $databaseViewId
			databaseId: $databaseId
			filterId: $filterId
			input: $input
		) {
			fieldId
			operator
			value
			_id
			filter
			fieldType
		}
	}
`;

export const addSortMutation = gql`
	mutation AddSort(
		$pageId: ID!
		$databaseViewId: ID!
		$databaseId: ID!
		$input: ViewSortConfigInput!
	) {
		addSort(
			pageId: $pageId
			databaseViewId: $databaseViewId
			databaseId: $databaseId
			input: $input
		) {
			_id
			fieldId
			direction
		}
	}
`;

export const updateSortMutation = gql`
	mutation UpdateSort(
		$pageId: ID!
		$databaseViewId: ID!
		$databaseId: ID!
		$sortId: ID!
		$input: ViewSortConfigInput!
	) {
		updateSort(
			pageId: $pageId
			databaseViewId: $databaseViewId
			databaseId: $databaseId
			sortId: $sortId
			input: $input
		) {
			_id
			fieldId
			direction
		}
	}
`;

export const removeSortMutation = gql`
	mutation DeleteSort($pageId: ID!, $databaseViewId: ID!, $databaseId: ID!, $sortId: ID!) {
		deleteSort(
			pageId: $pageId
			databaseViewId: $databaseViewId
			databaseId: $databaseId
			sortId: $sortId
		) {
			success
			message
		}
	}
`;

export const updateViewGroupMutation = gql`
	mutation UpdateGroup(
		$pageId: ID!
		$databaseViewId: ID!
		$databaseId: ID!
		$input: ViewGroupConfigInput!
	) {
		updateGroup(
			pageId: $pageId
			databaseViewId: $databaseViewId
			databaseId: $databaseId
			input: $input
		) {
			fieldId
			visibleGroups
			fieldType
			defaultGroups
			config {
				statusBy
				numberBy {
					groupRange
					groupInterval
				}
				dateBy
				textBy
			}
		}
	}
`;

export const getLiveKitTokenQuery = gql`
	query Query($input: LiveKitTokenInput!) {
		getLiveKitToken(input: $input) {
			accessToken
		}
	}
`;

export const getMeetBotDataQuery = gql`
	query ListMeetings($limit: Int!, $page: Int!) {
		listMeetings(limit: $limit, page: $page) {
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
				title
				tenantId
				transcriptionSource
				meetingMode
				agenda
				isAiIntelligenceEnabled
				status
				meetingPreference {
					threshold
					askUser
					needHelp
					actions
					similarFiles
				}
				createdBy {
					_id
					name
					email
				}
				updatedBy {
					_id
					name
					email
				}
				createdAt
				updatedAt
			}
		}
	}
`;

export const getMeetBotByIdQuery = gql`
	query GetMeeting($meetingId: ID!) {
		getMeeting(meetingId: $meetingId) {
			_id
			title
			tenantId
			transcriptionSource
			meetingMode
			agenda
			isAiIntelligenceEnabled
			status
			botJoinedAt
			meetingPlatform
			meetingPreference {
				threshold
				askUser
				needHelp
				actions
				similarFiles
			}
			createdBy {
				_id
				name
				email
			}
			updatedBy {
				_id
				name
				email
			}
			createdAt
			updatedAt
		}
	}
`;

export const getMeetSummaryQuery = gql`
	query GetMeetingSummaryAndRevampedPrompt($meetingId: ID!) {
		getMeetingSummaryAndRevampedPrompt(meetingId: $meetingId) {
			transcriptionSummary
			revampedPrompt
		}
	}
`;

export const meetBotCreateMutation = gql`
	mutation Mutation($input: MeetingInput) {
		startMeeting(input: $input) {
			_id
			title
			tenantId
			transcriptionSource
			meetingMode
			agenda
			isAiIntelligenceEnabled
			status
			meetingPlatform
			meetingPreference {
				threshold
				askUser
				needHelp
				actions
				similarFiles
			}
			createdBy {
				_id
				name
				email
			}
			updatedBy {
				_id
				name
				email
			}
			createdAt
			updatedAt
		}
	}
`;

export const deleteLiveKitRoomMutation = gql`
	mutation Mutation($meetingId: ID!) {
		deleteLiveKitRoom(meetingId: $meetingId) {
			success
			message
		}
	}
`;

export const getMeetTranscriptHistoryQuery = gql`
	query ListTranscriptions($meetingId: ID!, $limit: Int!, $page: Int!) {
		listTranscriptions(meetingId: $meetingId, limit: $limit, page: $page) {
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
				tenantId
				meetingId
				speakerName
				transcript
				transcriptionSource
				createdAt
				updatedAt
			}
		}
	}
`;

export const deleteMeetingMutation = gql`
	mutation DeleteMeeting($meetingId: ID!) {
		deleteMeeting(meetingId: $meetingId) {
			success
			message
		}
	}
`;

export const updateDatabaseViewMutation = gql`
	mutation UpdateDatabaseView(
		$pageId: ID!
		$updateDatabaseViewId: ID!
		$input: UpdateDatabaseViewInput!
	) {
		updateDatabaseView(pageId: $pageId, id: $updateDatabaseViewId, input: $input) {
			_id
			databaseId
			pageId
			blockId
			label
			cardSize
			sortBy {
				_id
				fieldId
				direction
			}
			filterBy {
				_id
				fieldId
				fieldType
				operator
				value
				filter
			}
			groupBy {
				fieldId
				visibleGroups
				fieldType
				defaultGroups
				config {
					statusBy
					numberBy {
						groupRange
						groupInterval
					}
					dateBy
					textBy
				}
			}
			# visibleFields
			type
			columnWidths
			aggregations
			order
			createdAt
			updatedAt
			createdBy
			updatedBy
		}
	}
`;

export const getAiLiveIntelligenceHistoryQuery = gql`
	query ListAiIntelligence($meetingId: ID!, $limit: Int!, $page: Int!) {
		listAiIntelligence(meetingId: $meetingId, limit: $limit, page: $page) {
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
				tenantId
				meetingId
				response
				createdAt
				updatedAt
			}
		}
	}
`;
