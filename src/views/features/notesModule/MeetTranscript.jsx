import React, { useEffect, useRef, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import '../../../assets/scss/notes/meetTranscript.scss';
import Context from '../../../context/context';
import { useParams, useSearchParams } from 'react-router-dom';
import InfiniteScroll from '../../components/globalComponents/InfiniteScroll';
import { FetchMoreLoaderComp } from '../../../helpers';
import Spinner from '../../components/loaders/Spinner';

const MeetTranscript = ({ transcriptList = [] }) => {
	const listRef = useRef(null);
	const lastItemRef = useRef(null);
	const { meetingId, noteId } = useParams();
	const [searchParams] = useSearchParams();
	const type = searchParams.get('type');
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
		if (type === 'meeting_bot') {
			loadTranscripts(1, false);
		}
	}, [type]);

	// Function to load more transcripts when scrolling
	const loadMoreTranscripts = () => {
		if (info.transcriptLoading || !info.transcriptHasMore || !info.initialLoadDone) return;
		const nextPage = info.transcriptPage + 1;
		setInfo((prev) => ({ ...prev, transcriptPage: nextPage }));
		loadTranscripts(nextPage, true);
	};

	useEffect(() => {
		if (transcriptList.length > 0) {
			setHighlightIdx(transcriptList.length - 1);
			if (lastItemRef.current) {
				lastItemRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
			}
			const timeout = setTimeout(() => setHighlightIdx(null), 1200);
			return () => clearTimeout(timeout);
		}
	}, [transcriptList.length]);

	// Get API data from transcript history
	const apiData = transcriptHistory?.data || [];

	// Combine API data with live socket data
	const combinedData = [...apiData, ...transcriptList];

	// Show loading spinner only on initial load
	if (info.transcriptLoading && info.transcriptPage === 1) {
		return (
			<div className="loading-container">
				<Spinner
					width="32px"
					height="32px"
					color="var(--primary-button)"
					borderTopColor="var(--background-color)"
				/>
			</div>
		);
	}

	// Show empty state if no data available
	if (!combinedData.length) {
		return <div className="meet-transcript-empty">No transcript yet.</div>;
	}

	// Render with infinite scroll for API data and socket data
	return (
		<InfiniteScroll
			dataLength={combinedData.length}
			next={loadMoreTranscripts}
			hasMore={info.transcriptHasMore}
			height={'800px'}
			loader={<FetchMoreLoaderComp />}
			style={{ width: '100%' }}
		>
			<div className="meet-transcript-list" ref={listRef}>
				{combinedData.map((item, idx) => (
					<div
						className={`meet-transcript-item`}
						key={item._id || idx}
						ref={idx === combinedData.length - 1 ? lastItemRef : null}
					>
						<div className="meet-transcript-meta">
							<span className="meet-transcript-participant">{item.speakerName}</span>
							<span className="meet-transcript-time">
								{apiData.includes(item)
									? moment(Number(item.createdAt) * 1000).format('HH:mm:ss')
									: moment(item.timestamp).format('HH:mm:ss')}
							</span>
						</div>
						<div className="meet-transcript-text">{item.transcript}</div>
					</div>
				))}
			</div>
		</InfiniteScroll>
	);
};

MeetTranscript.propTypes = {
	transcriptList: PropTypes.array,
};

export default MeetTranscript;
