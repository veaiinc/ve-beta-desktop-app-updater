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
	const { noteId } = useParams();
	const [searchParams] = useSearchParams();
	const type = searchParams.get('type');
	const history = searchParams.get('history');

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
			const response = await getMeetTranscriptHistory(
				{ pageId: noteId, limit: 10, page },
				append,
			);
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

	// Initial load on mount (empty dependency array)
	useEffect(() => {
		if (type === 'meeting_bot' && history) {
			loadTranscripts(1, false);
		}
	}, []);

	// Function to load more transcripts when scrolling
	const loadMoreTranscripts = () => {
		if (info.transcriptLoading || !info.transcriptHasMore || !info.initialLoadDone) return;
		const nextPage = info.transcriptPage + 1;
		setInfo((prev) => ({ ...prev, transcriptPage: nextPage }));
		loadTranscripts(nextPage, true);
	};

	// useEffect(() => {
	// 	if (transcriptList.length > 0) {
	// 		setHighlightIdx(transcriptList.length - 1);
	// 		if (lastItemRef.current) {
	// 			lastItemRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
	// 		}
	// 		const timeout = setTimeout(() => setHighlightIdx(null), 1200);
	// 		return () => clearTimeout(timeout);
	// 	}
	// }, [transcriptList.length]);

	// For live transcript (not history)
	if (!history) {
		if (!transcriptList.length) {
			return <div className="meet-transcript-empty">No transcript yet.</div>;
		}
		return (
			<div className="meet-transcript-list" ref={listRef}>
				{transcriptList.map((item, idx) => (
					<div
						className={`meet-transcript-item`}
						key={idx}
						ref={idx === transcriptList.length - 1 ? lastItemRef : null}
					>
						<div className="meet-transcript-meta">
							<span className="meet-transcript-participant">{item.speakerName}</span>
							<span className="meet-transcript-time">
								{moment(item.timestamp).format('HH:mm:ss')}
							</span>
						</div>
						<div className="meet-transcript-text">{item.transcript}</div>
					</div>
				))}
			</div>
		);
	}

	// For history transcript with infinite scroll
	const historyData = transcriptHistory?.data || [];

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

	if (!historyData.length) {
		return <div className="meet-transcript-empty">No transcript history found.</div>;
	}

	return (
		<InfiniteScroll
			dataLength={historyData.length}
			next={loadMoreTranscripts}
			hasMore={info.transcriptHasMore}
			height={'800px'}
			loader={<FetchMoreLoaderComp />}
		>
			<div className="meet-transcript-list" ref={listRef}>
				{historyData.map((item, idx) => (
					<div
						className={`meet-transcript-item`}
						key={item._id || idx}
						ref={idx === historyData.length - 1 ? lastItemRef : null}
					>
						<div className="meet-transcript-meta">
							<span className="meet-transcript-participant">{item.speakerName}</span>
							<span className="meet-transcript-time">
								{moment(Number(item.createdAt) * 1000).format('HH:mm:ss')}
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
