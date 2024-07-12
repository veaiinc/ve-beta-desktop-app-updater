import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './action';
import Service from '../../services/graphQlServices';
import service from '../../services/index';
import { getProposalDataQuery, updateProposalContentQuery } from './graphQlFunctions';
export const intialState = {
	proposalInfo: null,
};

export const ProposalState = (props) => {
	const [state, dispatch] = useReducer(Reducer, intialState);

	const getAllProposalContentInfo = async (payload) => {
		try {
			const usertoken = localStorage.getItem('usertoken');
			const workspaceId = localStorage.getItem('workspaceId');
			const response = await Service.query(
				getProposalDataQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);

			if (response?.[0] === true) {
				let proposalData = await proposalDataHandler(response, 'get');

				dispatch({
					type: Actions.GET_PROPOSAL_INFO_SUCCESS,
					payload: proposalData,
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

	const updateProposal = async (payload) => {
		try {
			const usertoken = localStorage.getItem('usertoken');
			const workspaceId = localStorage.getItem('workspaceId');
			const response = await Service.query(
				updateProposalContentQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);

			if (response?.[0]) {
				let proposalData = await proposalDataHandler(response, 'update');

				dispatch({
					type: Actions.GET_PROPOSAL_INFO_SUCCESS,
					payload: proposalData,
				});
				return [true];
			} else {
				console.log('api failed==>updateProposal', response);
				return [false];
			}
		} catch (error) {
			console.log('error==>resetPropsalState', error);
		}
	};

	const proposalDataHandler = async (response, type) => {
		try {
			let proposalData;
			if (type === 'get') {
				proposalData = response?.[1]?.data?.getProposal;
			} else {
				proposalData = response?.[1]?.data?.updateProposal;
			}

			let { activeVersion, versions } = proposalData;
			for (let i = 0; i < versions?.length; i++) {
				if (versions?.[i]?._id === activeVersion) {
					let {
						deliverables,
						financeSummary,
						paymentDetails,
						paymentSchedule,
						sections,
						status,
						tables,
						variables,
						conditionals,
						expiryInDays,
					} = versions?.[i] || {};
					proposalData = {
						...proposalData,
						deliverables,
						financeSummary,
						paymentDetails,
						paymentSchedule,
						sections,
						status,
						tables,
						variables,
						conditionals,
						expiryInDays,
					};
					break;
				}
			}
			return proposalData;
		} catch (error) {
			console.log('error==>proposalDataHandler', error);
		}
	};

	const resetProposalState = async () => {
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
		updateProposal,
		resetProposalState,
	};
};
