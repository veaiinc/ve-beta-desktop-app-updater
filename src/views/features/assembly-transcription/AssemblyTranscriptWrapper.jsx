import React, { useState, useCallback, useRef, useEffect, useContext } from 'react';
import AssemblyTranscription from './AssemblyTranscription';
import { useParams } from 'react-router-dom';
import Context from '../../../context/context';

const AssemblyTranscriptWrapper = ({
	sendMessage,
	tenantId,
	sessionId,
	onTranscriptionUpdate,
	jwtToken,
	isAiIntelligenceEnabled,
}) => {
	const meetingId = useParams()?.meetingId;
	const [transcriptions, setTranscriptions] = useState([]);
	const scrollRef = useRef(null);
	const lastItemRef = useRef(null);
	const [highlightIdx, setHighlightIdx] = useState(null);

	const {
		notes: { getMeetTranscriptHistory, transcriptHistory },
	} = useContext(Context);

	const [info, setInfo] = useState({
		transcriptPage: 1,
		transcriptHasMore: true,
		transcriptLoading: false,
		initialLoadDone: false,
	});

	// Function to load transcript history
	const loadTranscripts = async (page = 1, append = false) => {
		try {
			setInfo((prev) => ({ ...prev, transcriptLoading: true }));
			const response = await getMeetTranscriptHistory({ meetingId, limit: 10, page }, append);
			if (response?.[1]?.data?.listTranscriptions) {
				const { hasNextPage, currentPage, totalPages } =
					response[1].data.listTranscriptions;
				setInfo((prev) => ({
					...prev,
					transcriptLoading: false,
					transcriptHasMore: hasNextPage,
					transcriptPage: currentPage,
					transcriptTotalPages: totalPages,
					initialLoadDone: true,
				}));
			} else {
				setInfo((prev) => ({ ...prev, transcriptLoading: false, initialLoadDone: true }));
			}
		} catch (error) {
			setInfo((prev) => ({ ...prev, transcriptLoading: false, initialLoadDone: true }));
		}
	};

	useEffect(() => {
		// Only load history once when component mounts or page refreshes
		loadTranscripts(1, false);
	}, []); // Empty dependency array - only runs once on mount

	const handleLiveIntelligenceResponse = useCallback(
		(data) => {
			// Handle live intelligence responses

			// You can process live intelligence data here and send to parent if needed
			if (sendMessage) {
				sendMessage({
					type: 'live_intelligence_response',
					data: data,
					timestamp: Date.now(),
				});
			}
		},
		[sendMessage],
	);

	useEffect(() => {
		if (transcriptions.length > 0) {
			setHighlightIdx(transcriptions.length - 1);
			if (lastItemRef.current) {
				lastItemRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
			}
			const timeout = setTimeout(() => setHighlightIdx(null), 1200);
			return () => clearTimeout(timeout);
		}
	}, [transcriptions.length]);

	// Only render the mic bar always at the root
	return (
		<div
			style={{
				position: 'fixed',
				left: 0,
				right: 0,
				bottom: 0,
				zIndex: 100,
				pointerEvents: 'auto',
			}}
		>
			<AssemblyTranscription
				onTranscriptionUpdate={onTranscriptionUpdate}
				onLiveIntelligenceResponse={handleLiveIntelligenceResponse}
				tenantId={tenantId}
				sessionId={sessionId}
				meetingId={meetingId}
				jwtToken={jwtToken}
				isAiIntelligenceEnabled={isAiIntelligenceEnabled}
			/>
		</div>
	);
};

export default AssemblyTranscriptWrapper;
