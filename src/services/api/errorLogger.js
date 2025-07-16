import jwtDecode from 'jwt-decode';
import { getUserBrowser, getUserDevice } from '../../helpers';

const endpoint =
	'https://us.api.ve.ai/workflows/1.0/betaworkspace/687747411528c2f07a8b1cd4/687747411528c2f07a8b1cd5/687747411528c2f07a8b1cc9 ';

const getFormattedTimestamp = () => {
	const now = new Date();

	const dd = String(now.getDate()).padStart(2, '0');
	const mm = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
	const yyyy = now.getFullYear();
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');

	return `${dd}-${mm}-${yyyy} ${hours}:${minutes}`;
};

const createBody = (errorInfo) => {
	const { errorType, errorMessage, errorPath, errorComponent, errorComponentStack } = errorInfo;

	const browser = getUserBrowser();
	const device = getUserDevice();
	const usertoken = localStorage.getItem('usertoken');
	const username = usertoken ? jwtDecode(usertoken)?.userName ?? 'Unknown' : 'Public User';
	const timestamp = getFormattedTimestamp();
	const workspaceId = localStorage.getItem('workspaceId');
	const workspaceMode = localStorage.getItem('workspaceMode');
	const resolutionStatus = 'Unresolved';

	const body = JSON.stringify({
		responseInput: {
			response: [
				{
					_id: '687747411528c2f07a8b1cca',
					type: 'shortanswer',
					question: 'Error Type',
					required: true,
					order: 1,
					isEditing: false,
					placeholder: 'Error Type',
					answer: errorType,
					variableId: '619f75683f381fd66dac4b65',
					validation: {
						pattern: {},
						operators: [],
					},
					conditions: [],
					actions: [],
				},
				{
					_id: '687747411528c2f07a8b1ccb',
					type: 'longanswer',
					question: 'Error Message',
					required: true,
					order: 2,
					isEditing: false,
					placeholder: 'Error Message',
					answer: errorMessage,
					validation: {
						pattern: {},
						operators: [],
					},
					conditions: [],
					actions: [],
				},
				{
					_id: '687747411528c2f07a8b1ccc',
					type: 'shortanswer',
					question: 'Error Path',
					required: true,
					order: 3,
					isEditing: false,
					placeholder: 'Error Path',
					answer: errorPath,
					variableId: '619f75683f381fd66dac4b65',
					validation: {
						pattern: {},
						operators: [],
					},
					conditions: [],
					actions: [],
				},
				{
					_id: '687747411528c2f07a8b1ccd',
					type: 'shortanswer',
					question: 'Component',
					required: true,
					order: 4,
					isEditing: false,
					placeholder: 'Component',
					answer: errorComponent,
					variableId: '619f75683f381fd66dac4b65',
					validation: {
						pattern: {},
						operators: [],
					},
					conditions: [],
					actions: [],
				},
				{
					_id: '687747411528c2f07a8b1cce',
					type: 'longanswer',
					question: 'Component Stack',
					required: true,
					order: 5,
					isEditing: false,
					placeholder: 'Component Stack',
					answer: errorComponentStack,
					validation: {
						pattern: {},
						operators: [],
					},
					conditions: [],
					actions: [],
				},
				{
					_id: '687766c4987d9c3ac86a9e78',
					type: 'shortanswer',
					question: "<p style='font-size:;'>Username</p>",
					required: false,
					order: 7,
					isEditing: false,
					placeholder: 'Enter your username',
					answer: username,
					variableId: '619f75683f381fd66dac4b65',
					validation: {
						pattern: {},
						operators: [],
					},
					conditions: [],
					actions: [],
				},
				{
					_id: '687747411528c2f07a8b1ccf',
					type: 'shortanswer',
					question: "<p style='font-size:;'>Time Stamp</p>",
					required: true,
					order: 6,
					isEditing: false,
					placeholder: 'Enter your time stamp',
					answer: timestamp,
					variableId: '619f75683f381fd66dac4b65',
					validation: {
						pattern: {},
						operators: [],
					},
					conditions: [],
					actions: [],
				},
				{
					_id: '6877a4fa8f164d43386a31cc',
					type: 'shortanswer',
					question: "<p style='font-size:;'>Workspace Mode</p>",
					required: false,
					order: 9,
					isEditing: false,
					placeholder: 'Enter your workspace mode',
					answer: workspaceMode,
					variableId: '619f75683f381fd66dac4b65',
					validation: {
						pattern: {},
						operators: [],
					},
					conditions: [],
					actions: [],
				},
				{
					_id: '687747411528c2f07a8b1cd0',
					type: 'shortanswer',
					question: 'Workspace ID',
					required: true,
					order: 8,
					isEditing: false,
					placeholder: 'Workspace ID',
					answer: workspaceId,
					variableId: '619f75683f381fd66dac4b65',
					validation: {
						pattern: {},
						operators: [],
					},
					conditions: [],
					actions: [],
				},
				{
					_id: '687747411528c2f07a8b1cd1',
					type: 'singlechoice',
					question: 'Resolution Status',
					required: true,
					order: 10,
					isEditing: false,
					placeholder: 'Resolution Status',
					answer: resolutionStatus,
					validation: {
						pattern: {},
						operators: [],
					},
					conditions: [],
					actions: [],
				},
				{
					_id: '687747411528c2f07a8b1cd2',
					type: 'shortanswer',
					question: 'Browser',
					required: true,
					order: 11,
					isEditing: false,
					placeholder: 'Browser',
					answer: browser,
					variableId: '619f75683f381fd66dac4b65',
					validation: {
						pattern: {},
						operators: [],
					},
					conditions: [],
					actions: [],
				},
				{
					_id: '687747411528c2f07a8b1cd3',
					type: 'shortanswer',
					question: 'Device',
					required: true,
					order: 12,
					isEditing: false,
					placeholder: 'Enter your device',
					answer: device,
					variableId: '619f75683f381fd66dac4b65',
					validation: {
						pattern: {},
						operators: [],
					},
					conditions: [],
					actions: [],
				},
			],
		},
	});

	return body;
};

const logError = async (errorInfo) => {
	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 5000);
		const body = createBody(errorInfo);

		const response = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body,
			signal: controller.signal,
		});

		clearTimeout(timeoutId);

		if (!response.ok) {
			if (response.status >= 400 && response.status < 500) {
				console.warn('Client error:', response.status);
			} else if (response.status >= 500) {
				console.error('Server error:', response.status);
			}
			return false;
		}

		const { message } = await response.json();
		if (message === 'Form Submitted Successfully!') {
			return true;
		}
		return false;
	} catch (err) {
		if (err.name === 'AbortError') {
			console.error('Request timed out after 5 seconds', err);
		} else {
			console.error('Network error while logging error:', err);
		}
		return false;
	}
};

export default logError;
