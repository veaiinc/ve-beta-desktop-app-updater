import jwtDecode from 'jwt-decode';
import { getUserBrowser, getUserDevice } from './index.jsx';

const endpoint =
	'https://us.api.ve.ai/workflows/1.0/betaworkspace/6878ad87193e83b4b3397b3b/6878ad87193e83b4b3397b3c/6878ad87193e83b4b3397b2e';

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
					_id: '6878ad87193e83b4b3397b2f',
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
					_id: '6878ad87193e83b4b3397b30',
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
					_id: '6878ad87193e83b4b3397b31',
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
					_id: '6878ad87193e83b4b3397b32',
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
					_id: '6878ad87193e83b4b3397b33',
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
					_id: '6878ad87193e83b4b3397b34',
					type: 'shortanswer',
					question: 'Username',
					required: false,
					order: 6,
					isEditing: false,
					placeholder: 'Username',
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
					_id: '6878ad87193e83b4b3397b35',
					type: 'shortanswer',
					question: 'Time Stamp',
					required: true,
					order: 7,
					isEditing: false,
					placeholder: 'Time Stamp',
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
					_id: '6878ad87193e83b4b3397b36',
					type: 'shortanswer',
					question: 'Workspace Mode',
					required: false,
					order: 8,
					isEditing: false,
					placeholder: 'Workspace Mode',
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
					_id: '6878ad87193e83b4b3397b37',
					type: 'shortanswer',
					question: 'Workspace ID',
					required: true,
					order: 9,
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
					_id: '6878ad87193e83b4b3397b38',
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
					_id: '6878ad87193e83b4b3397b39',
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
					_id: '6878ad87193e83b4b3397b3a',
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
