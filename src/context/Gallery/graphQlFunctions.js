import { gql } from '@apollo/client';

export const getMostUsedEntitiesQuery = gql`
	query MostUsedEntities($filters: MostUsedEntitiesFilterInput) {
		mostUsedEntities(filters: $filters) {
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
				entity
				entityType
				title
			}
		}
	}
`;
