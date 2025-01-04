import { gql } from '@apollo/client';
export const getListItemsQuery = gql`
	query Query($taskFilterInput: TaskFilterInput) {
		listTasks(taskFilterInput: $taskFilterInput) {
			data {
				_id
				taskSlNo
				title
				parentTask {
					_id
					title
				}
				childTasks {
					_id
					title
					status
				}
				description
				assignedTo {
					_id
					name
				}
				status
				dueDate
				priority
				workflow {
					_id
					title
				}
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
			taskSlNo
			title
			description
			status
			priority
			workflowId
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
			taskSlNo
			title
			parentTask {
				_id
				title
			}
			childTasks {
				_id
				title
				status
			}
			description
			assignedTo {
				_id
				name
			}
			dueDate
			status
			priority
			workflow {
				_id
				title
			}
			client {
				_id
				name
			}
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
export const getSubTasksQuery = gql`
	query Query($taskId: ID!) {
		listChildTasks(taskId: $taskId) {
			_id
			taskSlNo
			title
			description
			status
			parentTask {
				_id
				title
			}
			childTasks {
				_id
				title
				status
			}
			priority
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
			workflow {
				_id
				title
			}
		}
	}
`;

export const getTaskStatusLabelQuery = gql`
	query Query {
		listTaskLabels {
			_id
			label
			group
			color
			order
		}
	}
`;

export const getTaskStatusDefaultLabelQuery = gql`
	query GetDefaultTaskLabel {
		getDefaultTaskLabel {
			_id
			tenantId
			userId
			label
			groupId
			group
			color
			order
		}
	}
`;

export const createTaskStatusLabelMutation = gql`
	mutation Mutation($input: TaskLabelInput!) {
		createTaskLabel(input: $input) {
			_id
			tenantId
			userId
			label
			groupId
			group
			color
			order
		}
	}
`;

export const updateTaskStatusLabelMutation = gql`
	mutation UpdateTaskLabel($labelId: ID!, $input: UpdateTaskLabelInput!) {
		updateTaskLabel(labelId: $labelId, input: $input) {
			_id
			tenantId
			userId
			label
			groupId
			group
			color
			order
		}
	}
`;

export const deleteTaskStatusLabelMutation = gql`
	mutation DeleteTaskLabel($labelId: ID!) {
		deleteTaskLabel(labelId: $labelId) {
			message
		}
	}
`;
