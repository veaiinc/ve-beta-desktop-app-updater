import { gql } from '@apollo/client';
export const getListItemsQuery = gql`
	query Query($taskFilterInput: TaskFilterInput) {
		listTasks(taskFilterInput: $taskFilterInput) {
			hasNextPage
			currentPage
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
				clients {
					_id
					name
					email
				}
			}
		}
	}
`;

export const getListItemsByTenantUserQuery = gql`
	query ListTasksByTenantUser($filters: ListTaskInput) {
		listTasksByTenantUser(filters: $filters) {
			hasNextPage
			currentPage
			totalDocs
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

export const getTasksCountQuery = gql`
	query ListTasksByTenantUser($filters: ListTaskInput) {
		listTasksByTenantUser(filters: $filters) {
			totalDocs
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

export const deleteTaskStatusLabelMutation = gql`
	mutation DeleteTaskLabel($taskMetadataId: ID!, $labelId: ID!, $group: groupEnum!) {
		deleteTaskLabel(taskMetadataId: $taskMetadataId, labelId: $labelId, group: $group) {
			message
		}
	}
`;

export const taskMetadataQuery = gql`
	query GetTaskMetadata {
		getTaskMetadata {
			_id
			tenantId
			createdBy
			updatedBy
			todoGroupLabels {
				_id
				label
				group
				color
				isDefault
			}
			inProgressGroupLabels {
				_id
				label
				group
				color
				isDefault
			}
			completedGroupLabels {
				_id
				label
				group
				color
				isDefault
			}
			prefix
			views {
				_id
				label
				filters
				sort {
					sortBy
					sortType
				}
				viewType
				icon
				group
			}
			createdAt
			updatedAt
		}
	}
`;

export const createTaskStatusLabelMutation = gql`
	mutation Mutation($input: TaskLabelInput!, $taskMetadataId: ID!) {
		createTaskLabel(input: $input, taskMetadataId: $taskMetadataId) {
			_id
			label
			group
			color
			isDefault
		}
	}
`;

export const updateTaskStatusLabelMutation = gql`
	mutation UpdateTaskLabel(
		$taskMetadataId: ID!
		$labelId: ID!
		$group: groupEnum!
		$input: UpdateTaskLabelInput!
	) {
		updateTaskLabel(
			taskMetadataId: $taskMetadataId
			labelId: $labelId
			group: $group
			input: $input
		) {
			_id
			label
			group
			color
			isDefault
		}
	}
`;

export const updateTaskViewMutation = gql`
	mutation UpdateTaskView($taskMetadataId: ID!, $input: UpdateTaskViewInput!, $viewId: ID) {
		updateTaskView(taskMetadataId: $taskMetadataId, input: $input, viewId: $viewId) {
			views {
				_id
				label
				filters
				sort {
					sortBy
					sortType
				}
				viewType
				group
				icon
			}
		}
	}
`;

export const deleteTaskViewMutation = gql`
	mutation DeleteTaskView($taskMetadataId: ID!, $viewId: ID!) {
		deleteTaskView(taskMetadataId: $taskMetadataId, viewId: $viewId) {
			message
		}
	}
`;

export const listTaskWithGroupQuery = gql`
	query ListTasksWithGroup($taskFilterInput: TaskGroupFilterInput) {
		listTasksWithGroup(taskFilterInput: $taskFilterInput) {
			groups {
				group
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
					workflowTemplate {
						_id
						title
					}
					workflow {
						_id
						title
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
					taskSlNo
					createdBy {
						_id
						name
					}
					updatedBy {
						_id
						name
					}
					childTasks {
						_id
						title
						status
					}
					parentTask {
						_id
						title
					}
				}
				groupName
			}
			groupBy
		}
	}
`;
