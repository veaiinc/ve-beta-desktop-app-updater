import { gql } from '@apollo/client';
export const getNotesListQuery = gql`
	query ListPrivatePages($input: PageFilterInput!) {
		listPrivatePages(input: $input) {
			totalPages
			totalDocs
			hasNextPage
			hasPrevPage
			data {
				id
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
