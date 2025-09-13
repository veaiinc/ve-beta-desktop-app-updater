import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './actions';

export const initialMeetingState = {
	ongoingMeetingInfo: {
		meetingId: null,
		transcriptions: [],
		liveIntelligenceData: {
			askUser: [],
			needHelp: [],
			actions: [],
			files: [],
			allThreads: [],
		},
		meetingStatus: null,
		timer: 0,
		isMuted: false,
	},
};

export const MeetingState = () => {
	const [state, dispatch] = useReducer(Reducer, initialMeetingState);

	const updateOngoingMeetingInfo = async (meetingInfo) => {
		console.log('meetingInfo', meetingInfo);
		dispatch({
			type: Actions?.UPDATE_ONGOING_MEETING_INFO,
			payload: { ...state.ongoingMeetingInfo, ...meetingInfo },
		});
	};

	return {
		...state,
		updateOngoingMeetingInfo,
	};
};
