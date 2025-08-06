import React, { useState, useCallback, useRef, useEffect, useContext } from 'react';
import moment from 'moment';
import NoteTranscription from '../note-transcription/NoteTranscription';
import { useParams, useSearchParams } from 'react-router-dom';
import Context from '../../../context/context';
import InfiniteScroll from '../../components/globalComponents/InfiniteScroll';
import { FetchMoreLoaderComp } from '../../../helpers';
import Spinner from '../../components/loaders/Spinner';

const NoteTakerTranscript = ({
	sendMessage,
	tenantId,
	sessionId,
	pageId,
	visible = true,
	onTranscriptionUpdate,
}) => {
	const [searchParams] = useSearchParams();
	const meetingId = useParams()?.meetingId;
	const type = searchParams.get('type');
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

	// Function to load more transcripts when scrolling (for history pagination)
	const loadMoreTranscripts = () => {
		if (info.transcriptLoading || !info.transcriptHasMore || !info.initialLoadDone) return;
		const nextPage = info.transcriptPage + 1;
		setInfo((prev) => ({ ...prev, transcriptPage: nextPage }));
		loadTranscripts(nextPage, true);
	};

	const handleUpdateTranscription = useCallback(
		(transcription = null, prevTranscriptionId = null) => {
			if (!transcription) return;

			const formatted = {
				type: 'text',
				text: transcription.displayedText || '',
				styles: transcription.isFinal
					? { italic: false, textColor: 'var(--primary-font)' }
					: { italic: true, textColor: 'var(--secondary-font)' },
				time: new Date().toLocaleTimeString(),
				id: transcription.id,
			};

			setTranscriptions((prev) => {
				// Check if this transcript already exists to avoid duplicates
				const existingTranscript = prev.find((t) => t.id === transcription.id);
				if (existingTranscript) {
					return prev; // Don't update if already exists
				}

				// Replace or add the transcription by id
				const filtered = prev.filter((t) => t.id !== transcription.id);
				const updated = [...filtered, formatted];
				// Only send the new transcript to parent, not the entire array
				if (onTranscriptionUpdate) onTranscriptionUpdate(formatted);
				return updated;
			});

			try {
				if (scrollRef.current) {
					scrollRef.current.scrollIntoView({ behavior: 'smooth' });
				}
			} catch (error) {
				console.error('Error updating transcription blocks:', error);
			}
		},
		[onTranscriptionUpdate],
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

	// Get API data from transcript history
	const apiData = transcriptHistory?.data || [];

	// Combine API data with live socket data
	const combinedData = [...apiData, ...transcriptions];

	// Show loading spinner only on initial load
	// if (info.transcriptLoading && info.transcriptPage === 1) {
	// 	return (
	// 		<div className="loading-container">
	// 			<Spinner
	// 				width="32px"
	// 				height="32px"
	// 				color="var(--primary-button)"
	// 				borderTopColor="var(--background-color)"
	// 			/>
	// 		</div>
	// 	);
	// }

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
			<NoteTranscription
				pageId={pageId} // for getliVEkITOken
				updateTranscription={handleUpdateTranscription}
				sendMessage={sendMessage}
				tenantId={tenantId}
				sessionId={sessionId}
				recallPageId={pageId}
				meetingId={meetingId}
			/>
		</div>
	);
};

export default NoteTakerTranscript;
