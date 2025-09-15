import React, { useEffect } from 'react';
import useAssemblyTranscription from '../hooks/useAssemblyTranscription';

// {
//     "_id": "68b6fdd0484a0e133babab0c",
//     "title": "02 Sep 2025 19:53",
//     "tenantId": "685bfe8d66be41f40b4aa5c7",
//     "transcriptionSource": "desktop",
//     "meetingMode": "meeting",
//     "agenda": "",
//     "isAiIntelligenceEnabled": true,
//     "status": "not_started",
//     "meetingPlatform": null,
//     "meetingPreference": {
//         "threshold": 4,
//         "askUser": true,
//         "needHelp": true,
//         "actions": true,
//         "similarFiles": true,
//         "__typename": "MeetingPreference"
//     },
//     "createdBy": {
//         "_id": "6752ac9a59f8fa1a473520d1",
//         "name": "Sabith Muhammed",
//         "email": "sabith@ve.ai",
//         "__typename": "TenantUserType"
//     },
//     "updatedBy": {
//         "_id": "6752ac9a59f8fa1a473520d1",
//         "name": "Sabith Muhammed",
//         "email": "sabith@ve.ai",
//         "__typename": "TenantUserType"
//     },
//     "createdAt": "1756822992",
//     "updatedAt": "1756822992",
//     "__typename": "ListMeetingType"
// }

const MeetingBody = ({ meetingData }) => {
	const jwtToken = localStorage.getItem('usertoken');

	const {
		isConnected,
		isRecording,
		isMuted,
		timer,
		connectionStatus,
		startAudioCapture,
		stopRecording,
		toggleMute,
		formatTime,
		startRecording,
	} = useAssemblyTranscription({
		onTranscriptionUpdate: (data) => {
			console.log('transcription update', data);
		},
		onLiveIntelligenceResponse: () => {},
		tenantId: meetingData.tenantId,
		sessionId: meetingData._id,
		meetingId: meetingData._id,
		jwtToken,
		isAiIntelligenceEnabled: meetingData.isAiIntelligenceEnabled,
	});

	return (
		<div style={{ width: '300px', height: '300px', backgroundColor: 'red' }}>
			<div>
				<h1>Meeting Body</h1>
			</div>
		</div>
	);
};

export default MeetingBody;
