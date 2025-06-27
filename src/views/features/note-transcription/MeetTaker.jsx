import React, { useCallback, useState } from 'react';
import useRecallStream from '../../hooks/useRecallStream';
import useLiveIntelligenceStream from '../../hooks/useLiveIntelligenceStream';
import ObjectID from 'bson-objectid';

const MeetTaker = () => {
	const { createWebSocketConnection: createRecallStream } = useRecallStream();
	const { createWebSocketConnection: createLiveIntelligenceStream, updateCurrentContext } =
		useLiveIntelligenceStream();

	const [info, setInfo] = useState({ sessionID: ObjectID()?.toString() });

	const handleRecallStream = useCallback((event) => {
		const e = JSON.parse(event?.data || {});
		const data = e?.data;
		if (data?.participant?.length > 0 || data?.text?.length > 0) {
			updateCurrentContext((data?.participant || '') + ' : ' + (data?.text || ''));
		}
	}, []);

	const handleStartMeet = () => {
		createRecallStream(handleRecallStream);
		createLiveIntelligenceStream(info?.sessionID);
	};

	return (
		<div>
			<button onClick={handleStartMeet}>Start Meet</button>
		</div>
	);
};

export default MeetTaker;
