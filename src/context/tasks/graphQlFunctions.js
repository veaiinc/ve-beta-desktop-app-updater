import { gql } from '@apollo/client';
export const getListItemsQuery = gql`
	query Lists($filters: TaskFilterInput) {
		listTasks(filters: $filters) {
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
				description
				status
				priority
				workflowTemplateId
				workflowId
				client
				assignedTo {
					_id
					name
				}
				dueDate
				assignedBy {
					_id
					name
				}
				assignedAt
				completedAt
				createdAt
				updatedAt
				createdBy
				updatedBy
			}
		}
	}
`;
