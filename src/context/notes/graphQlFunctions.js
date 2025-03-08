import { gql } from '@apollo/client';
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
				tenantId
				createdAt
				updatedAt
				createdBy
			}
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
			coverImage
		}
	}
`;
