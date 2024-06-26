import * as API from './actionTypes';
import Service from '../../services/index';

export const UserLoginState = (props) => {
	const getTemplates = async () => {
		let response = await Service.fetchGet(
			`${API.TEMPLATES.TEMPLATES}`,
			null,
			'tenant_users_api',
		);

		if (response[0]) {
			return [true, response[1]];
		} else {
			return [false, response?.[1]?.message];
		}
	};
};
