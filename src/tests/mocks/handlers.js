import { http, HttpResponse } from 'msw';
import { graphql } from 'msw';

// Mock data for your APIs
const mockKnowledgeAgents = [
	{
		id: 'test-agent-123',
		name: 'Test Agent',
		description: 'A test knowledge agent',
		instructions: [],
		knowledgeBase: [],
		actions: [],
		triggers: [],
	},
];

const mockTemplates = [
	{
		id: 'template-1',
		name: 'Test Template',
		content: 'Test content',
	},
];

const mockContacts = [
	{
		id: 'contact-1',
		name: 'John Doe',
		email: 'john@example.com',
	},
];

// REST API Handlers
export const restHandlers = [
	// Knowledge Agent APIs
	http.get('*/:workspaceId/knowledge-agents', () => {
		return HttpResponse.json({
			data: mockKnowledgeAgents,
			currentPage: 1,
			hasNextPage: false,
		});
	}),

	http.get('*/:workspaceId/knowledge-agents/:agentId', ({ params }) => {
		const agent = mockKnowledgeAgents.find((a) => a.id === params.agentId);
		return HttpResponse.json(agent || { error: 'Agent not found' });
	}),

	http.post('*/:workspaceId/knowledge-agents', async ({ request }) => {
		const body = await request.json();
		const newAgent = {
			id: 'new-agent-' + Date.now(),
			...body,
			instructions: [],
			knowledgeBase: [],
			actions: [],
			triggers: [],
		};
		return HttpResponse.json({ insertData: newAgent });
	}),

	http.put('*/:workspaceId/knowledge-agents/:agentId', async ({ request }) => {
		const body = await request.json();
		return HttpResponse.json({ ...body, updated: true });
	}),

	// Templates APIs
	http.get('*/:workspaceId/templates', () => {
		return HttpResponse.json({
			data: mockTemplates,
		});
	}),

	// Contacts APIs
	http.get('*/:workspaceId/contacts', () => {
		return HttpResponse.json({
			data: mockContacts,
		});
	}),
];

// GraphQL Handlers
export const graphqlHandlers = [
	// Templates GraphQL
	graphql.query('GetTemplates', () => {
		return HttpResponse.json({
			data: {
				templates: mockTemplates,
			},
		});
	}),

	graphql.mutation('CreateTemplate', async ({ variables }) => {
		const newTemplate = {
			id: 'template-' + Date.now(),
			...variables.input,
		};
		return HttpResponse.json({
			data: {
				createTemplate: newTemplate,
			},
		});
	}),

	// Notes GraphQL
	graphql.query('GetNotes', () => {
		return HttpResponse.json({
			data: {
				notes: [],
			},
		});
	}),

	// Activity GraphQL
	graphql.query('GetActivities', () => {
		return HttpResponse.json({
			data: {
				activities: [],
			},
		});
	}),

	// Chat GraphQL
	graphql.query('GetChats', () => {
		return HttpResponse.json({
			data: {
				chats: [],
			},
		});
	}),

	// Tasks GraphQL
	graphql.query('GetTasks', () => {
		return HttpResponse.json({
			data: {
				tasks: [],
			},
		});
	}),
];

// Combine all handlers
export const handlers = [...restHandlers, ...graphqlHandlers];
