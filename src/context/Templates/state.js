import * as API from './actionTypes';
import Service from '../../services/index';

export const TemplatesState = (props) => {
	const getTemplates = async (templateId = null) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		let response = await Service.fetchGet(
			`/${workspaceId}${API.TEMPLATES.TEMPLATES}${
				templateId ? `?templateId=${templateId}` : ''
			}`,
			usertoken,
			'proposals_api',
		);

		if (response[0]) {
			return [true, response[1]];
		} else {
			return [false, response?.[1]?.message];
		}
	};

	const getTemplatesStatus = async (templateId = null) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		let response = await Service.fetchGet(
			`/${workspaceId}${API.TEMPLATES.PROPOSALS}${API.TEMPLATES.TEMPLATE_INSIGHTS}${
				templateId ? `?templateId=${templateId}` : ''
			}`,
			usertoken,
			'proposals_api',
		);

		if (response[0]) {
			return [true, response[1]];
		} else {
			return [false, response?.[1]?.message];
		}
	};

	const getProposals = async (salesId, page, search) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		let response = await Service.fetchGet(
			`/${workspaceId}${
				API.TEMPLATES.PROPOSALS
			}?templateId=${salesId}&page=${page}&limit=10&sortBy=createdAt&sortType=-1${
				search != '' ? `&title=${search}` : ''
			}`,
			usertoken,
			'proposals_api',
		);

		if (response[0]) {
			return [true, response[1]];
		} else {
			return [false, response?.[1]?.message];
		}
	};

	return {
		getProposals,
		getTemplates,
		getTemplatesStatus,
	};
};
