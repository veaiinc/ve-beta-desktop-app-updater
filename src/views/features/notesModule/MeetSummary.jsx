import { memo, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import s from '../../../assets/scss/notes/meetSummary.module.scss';
import { Markdown } from '../../../helpers/markdownHelper';
import Context from '../../../context/context';
import Spinner from '../../components/loaders/Spinner';

const MeetSummary = ({ meetingId }) => {
	const {
		notes: { getMeetSummary, meetSummary, getMeetingAnalytics },
		templates: { updateStateValues },
	} = useContext(Context);

	const [searchParams, setSearchParams] = useSearchParams();
	const [analyticsLoading, setAnalyticsLoading] = useState(false);
	const [textSelection, setTextSelection] = useState({
		popover: null,
		selectedText: '',
	});
	const [summaryData, setSummaryData] = useState({
		summary: '',
		analyticsData: null,
	});

	const isSummaryLoading = !meetSummary;

	// Fetch meeting analytics
	const fetchMeetingAnalytics = async () => {
		if (!meetingId) {
			console.log('No meeting ID provided');
			return;
		}

		setAnalyticsLoading(true);
		try {
			console.log('Fetching analytics for meetingId:', meetingId);
			const [success, data] = await getMeetingAnalytics(meetingId);

			if (success) {
				setSummaryData((prev) => ({ ...prev, analyticsData: data }));
			} else {
				console.log('Error fetching analytics:', data);
			}
		} catch (err) {
			console.log('Error fetching meeting analytics:', err);
		} finally {
			setAnalyticsLoading(false);
		}
	};

	// Handle text selection for "Ask VE" feature
	const handleTextSelection = () => {
		setTimeout(() => {
			const selection = window.getSelection();

			if (selection && !selection.isCollapsed) {
				const range = selection.getRangeAt(0);
				const rect = range.getBoundingClientRect();

				setTextSelection({
					popover: {
						x: rect.left + rect.width / 2,
						y: rect.top - 10 + window.scrollY,
					},
					selectedText: selection.toString(),
				});
			} else {
				setTextSelection({ popover: null, selectedText: '' });
			}
		}, 0);
	};

	// Handle Ask AI functionality
	const handleAskAI = () => {
		const newParams = new URLSearchParams(searchParams);
		newParams.set('chat', 'true');
		setSearchParams(newParams, { replace: true });
		updateStateValues({
			chatReplyData: textSelection.selectedText,
		});
	};

	// Fetch analytics on mount or when meetingId changes
	useEffect(() => {
		fetchMeetingAnalytics();
	}, [meetingId]);

	// Set up text selection listener
	useEffect(() => {
		document.addEventListener('mouseup', handleTextSelection);
		return () => document.removeEventListener('mouseup', handleTextSelection);
	}, []);

	// Handle summary data updates
	useEffect(() => {
		if (meetSummary) {
			setSummaryData((prev) => ({
				...prev,
				summary: meetSummary.summary,
			}));
		} else if (meetingId) {
			getMeetSummary(meetingId);
		}
	}, [meetSummary, meetingId, getMeetSummary]);

	// Render loading state
	const renderLoadingState = () => (
		<div className={s.loadingContainer}>
			<Spinner />
		</div>
	);

	// Render summary content
	const renderSummaryContent = () => {
		if (summaryData.summary) {
			return <Markdown>{summaryData.summary}</Markdown>;
		}
		return <div className={s.loadingContainer}>No summary.</div>;
	};

	// Render Ask VE popover
	const renderAskVEPopover = () => {
		if (!textSelection.popover) return null;

		return (
			<div
				className={s.popover}
				style={{
					top: textSelection.popover.y,
					left: textSelection.popover.x,
				}}
				onClick={handleAskAI}
			>
				Ask VE
			</div>
		);
	};

	return (
		<div className={s.meetSummaryContainer}>
			{isSummaryLoading ? renderLoadingState() : renderSummaryContent()}
			{renderAskVEPopover()}
		</div>
	);
};

export default memo(MeetSummary);
