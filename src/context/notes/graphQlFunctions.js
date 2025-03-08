import { gql } from '@apollo/client';
export const getNotesListQuery = gql`
	query ListPrivatePages($input: PageFilterInput) {
		listPrivatePages(input: $input) {
			totalPages
			totalDocs
			prevPage
			nextPage
			limit
			hasPrevPage
			hasNextPage
			data {
				coverImage
				createdAt
				createdBy
				icon
				id
				permissions {
					private
					sharedWith {
						access
						userId
					}
				}
				tenantId
				title
				updatedAt
			}
			currentPage
		}
	}
`;
export const createNotesQuery = gql`
	mutation Mutation($input: CreatePageInput!) {
		createPage(input: $input) {
			id
			icon
			createdBy
			createdAt
			tenantId
			title
			updatedAt
			permissions {
				private
				sharedWith {
					access
					userId
				}
			}
			coverImage
		}
	}
`;
