import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './action';
import Service from '../../services/graphQlServices';
import service from '../../services/index';
export const intialState = {
	proposalInfo: null,
};

export const ProposalState = (props) => {
	const [state, dispatch] = useReducer(Reducer, intialState);

	const getAllProposalContentInfo = async (proposalId, versionId) => {
		try {
			const usertoken = localStorage.getItem('usertoken');
			const workspaceId = localStorage.getItem('workspaceId');
			const url = `/${workspaceId}/proposals/${proposalId}/versions/${versionId}`;
			const response = await service.fetchGet(url, usertoken, 'proposals_api');
			if (response?.[0] === true) {
				const {
					conditionals,
					deliverables,
					financeSummary,
					paymentSchedule,
					tables,
					variables,
				} = response?.[1] || {};

				dispatch({
					type: Actions.GET_PROPOSAL_INFO_SUCCESS,
					payload: {
						conditionals,
						deliverables,
						financeSummary,
						paymentSchedule,
						tables,
						variables,
					},
				});
			} else {
				console.log('api failed==>getAllProposalContentInfo', response);
			}
		} catch (error) {
			console.log('error ==> getAllProposalContentInfo', error);
		}
	};

	const updateProposalContent = async (data) => {
		try {
			dispatch({ type: Actions.UPDATE_PROPOSAL_INFO_DATA_SUCESS, payload: data });
		} catch (error) {
			console.log('error==>updateProposalContent', error);
		}
	};

	const resetPropsalState = async () => {
		try {
			dispatch({ type: Actions.RESET_STATE });
		} catch (error) {
			console.log('error==>resetPropsalState', error);
		}
	};
	return {
		...state,
		resetPropsalState,
		getAllProposalContentInfo,
		updateProposalContent,
	};
};
