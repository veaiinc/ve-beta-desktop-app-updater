import { memo, useCallback, useContext, useEffect, useState } from 'react';
import useRecallStream from '../../hooks/useRecallStream';
import useLiveIntelligenceStream from '../../hooks/useLiveIntelligenceStream';
import ObjectID from 'bson-objectid';
import Context from '../../../context/context';

const MeetTaker = () => {
	const { createWebSocketConnection: createRecallStream } = useRecallStream();
	const { createWebSocketConnection: createLiveIntelligenceStream, updateCurrentContext } =
		useLiveIntelligenceStream();

	const {
		templates: { handleTranscriptionSuggestions, updateStateValues },
	} = useContext(Context);
	const [info] = useState({ sessionID: ObjectID()?.toString() });

	useEffect(() => {
		return () => {
			updateStateValues({
				aiTranscriptionSuggestions: null,
			});
		};
	}, []);

	const handleRecallStream = useCallback((event) => {
		const e = JSON.parse(event?.data || null);
		const data = e?.data;
		if (data?.participant?.length > 0 || data?.text?.length > 0) {
			updateCurrentContext((data?.participant || '') + ' : ' + (data?.text || ''));
		}
	}, []);

	const handleStartMeet = useCallback(() => {
		createRecallStream(handleRecallStream);
		createLiveIntelligenceStream(info?.sessionID, handleLiveIntelligenceMessageFunc);
	}, [createRecallStream, createLiveIntelligenceStream, handleRecallStream, info?.sessionID]);

	const handleLiveIntelligenceMessageFunc = useCallback(
		(event) => {
			const data = JSON.parse(event?.data || null);
			handleTranscriptionSuggestions(data);
		},
		[handleTranscriptionSuggestions],
	);

	return (
		<div>
			<button onClick={handleStartMeet}>Start Meet</button>
		</div>
	);
};

export default memo(MeetTaker);
