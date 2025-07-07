import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import '../../../assets/scss/notes/meetTranscript.scss';

const MeetTranscript = ({ transcriptList = [] }) => {
	const listRef = useRef(null);
	const lastItemRef = useRef(null);
	const [highlightIdx, setHighlightIdx] = useState(null);

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
						<span className="meet-transcript-participant">{item.participant}</span>
						<span className="meet-transcript-time">
							{moment(item.timestamp).format('HH:mm:ss')}
						</span>
					</div>
					<div className="meet-transcript-text">{item.text}</div>
				</div>
			))}
		</div>
	);
};



export default MeetTranscript;
