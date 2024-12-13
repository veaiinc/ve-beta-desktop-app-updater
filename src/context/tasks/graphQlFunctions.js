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
				serialNumber
				title
				description
				status
				priority
				workflowTemplateId
				workflowId
				client {
					_id
					name
				}
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

export const addListItemMutation = gql`
	mutation Mutation($input: TaskInput!) {
		createTask(input: $input) {
			_id
			serialNumber
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
`;

export const updateListItemMutation = gql`
	mutation UpdateTask($taskId: ID!, $updateInput: UpdateInput!) {
		updateTask(taskId: $taskId, updateInput: $updateInput) {
			_id
			workflowId
			dueDate
		}
	}
`;

export const deleteListItemMutation = gql`
	mutation DeleteTask($taskId: ID!) {
		deleteTask(taskId: $taskId) {
			message
		}
	}
`;

export const getTaskQuery = gql`
	query GetTask($taskId: ID!) {
		getTask(taskId: $taskId) {
			_id
			serialNumber
			title
			description
			status
			priority
			workflowTemplateId
			workflowId
			client {
				_id
				name
			}
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
