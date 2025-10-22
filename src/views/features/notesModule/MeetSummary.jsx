import { memo, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import s from '../../../assets/scss/notes/meetSummary.module.scss';
import { Markdown } from '../../../helpers/markdownHelper';
import Context from '../../../context/context';
import Spinner from '../../components/loaders/Spinner';
import ClockSvg from '../meetBot/clock.svg';
import DownSvg from '../../../assets/svg/activity/DownSvg';

const MeetSummary = ({ meetingId, handleActionClick, onErrorStateChange }) => {
	const {
		notes: { getMeetingAnalytics },
		templates: { updateStateValues },
	} = useContext(Context);

	const [searchParams, setSearchParams] = useSearchParams();
	const [analyticsLoading, setAnalyticsLoading] = useState(false);
	const [analyticsData, setAnalyticsData] = useState(null);
	const [error, setError] = useState(null);
	const [textSelection, setTextSelection] = useState({
		popover: null,
		selectedText: '',
	});
	const [activeTab, setActiveTab] = useState('summary');
	const [expandedSections, setExpandedSections] = useState({
		chapters: true,
		decisions: true,
	});

	// Fetch meeting analytics data
	const fetchMeetingAnalytics = async () => {
		if (!meetingId) {
			setError('No meeting ID provided');
			return;
		}

		setAnalyticsLoading(true);
		setError(null);

		try {
			console.log('Fetching analytics for meetingId:', meetingId);

			const [success, data] = await getMeetingAnalytics(meetingId);

			if (success) {
				setAnalyticsData(data);
			} else {
				setError(data); // data contains the error message
				console.error('Error fetching analytics:', data);
			}
		} catch (err) {
			setError('Error fetching meeting analytics');
			console.error('Error:', err);
		} finally {
			setAnalyticsLoading(false);
		}
	};

	useEffect(() => {
		fetchMeetingAnalytics();
	}, [meetingId]);

	// Notify parent about error state changes
	useEffect(() => {
		if (onErrorStateChange) {
			onErrorStateChange(!!error);
		}
	}, [error, onErrorStateChange]);

	// Process analytics data for display
	const processAnalyticsData = () => {
		if (!analyticsData) return null;

		// Extract data from API response - adjust field names based on actual API structure
		const summary = analyticsData.summary || analyticsData.transcriptionSummary || '';
		const chapters = analyticsData.chapters || analyticsData.topics || [];
		const decisions = analyticsData.decisions || analyticsData.keyDecisions || [];
		const actionItems = analyticsData.action_items || analyticsData.actionItems || [];
		const keyStrengths = analyticsData.keyStrengths || analyticsData.strengths || [];
		const growthAreas =
			analyticsData.growthAreas ||
			analyticsData.growth_areas ||
			analyticsData.improvements ||
			[];

		// Process chapters data
		const processedChapters = Array.isArray(chapters)
			? chapters.map((chapter) => ({
					title: chapter.title || chapter.topic || 'Untitled Chapter',
					description: chapter.description || chapter.summary || '',
					points: chapter.sub_topics || chapter.points || chapter.keyPoints || [],
			  }))
			: [];

		// Process decisions data
		const processedDecisions = Array.isArray(decisions)
			? decisions.map((decision) => ({
					text: decision.text || decision.decision || decision.description || '',
					time: decision.time || decision.timestamp || decision.startTime || '',
					priority: decision.priority || decision.importance || 'Medium',
			  }))
			: [];

		// Process action items data
		const processedActionItems = Array.isArray(actionItems)
			? actionItems.map((action) => ({
					text: action.text || action.description || action.task || '',
					assignee: action.assignee || action.assignedTo || action.owner || 'Unassigned',
					status: action.status || action.state || 'Pending',
					dueDate: action.dueDate || action.due_date || action.deadline || null,
			  }))
			: [];

		// Process key strengths data
		const processedKeyStrengths = Array.isArray(keyStrengths) ? keyStrengths : [];

		// Process growth areas data
		const processedGrowthAreas = Array.isArray(growthAreas) ? growthAreas : [];

		return {
			summary,
			chapters: processedChapters,
			decisions: processedDecisions,
			actionItems: processedActionItems,
			keyStrengths: processedKeyStrengths,
			growthAreas: processedGrowthAreas,
		};
	};

	const meetingData = processAnalyticsData();

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

	// Toggle section expansion
	const toggleSection = (section) => {
		setExpandedSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
	};

	// Get priority color
	const getPriorityColor = (priority) => {
		switch (priority) {
			case 'High':
				return '#E03F4F';
			case 'Medium':
				return '#EDA145';
			case 'Low':
				return '#66bb6a';
			default:
				return '#94989e';
		}
	};

	// Get status color
	const getStatusColor = (status) => {
		switch (status) {
			case 'Completed':
				return '#1C993E1A';
			case 'In Progress':
				return '#ffa726';
			case 'Pending':
				return '#EDA145';
			default:
				return '#94989e';
		}
	};

	useEffect(() => {
		document.addEventListener('mouseup', handleTextSelection);
		return () => document.removeEventListener('mouseup', handleTextSelection);
	}, []);

	// Render summary section
	const renderSummarySection = () => {
		if (!meetingData?.summary) return null;

		return (
			<div className={s.summarySection}>
				<p className={s.summaryText}>{meetingData.summary}</p>
			</div>
		);
	};

	// Render key strengths section
	const renderKeyStrengthsSection = () => {
		if (!meetingData?.keyStrengths || meetingData.keyStrengths.length === 0) return null;

		return (
			<div className={s.strengthsSection}>
				<div className={s.sectionHeader}>
					<div className={s.greenBullet}></div>
					<h3>Key Strengths:</h3>
				</div>
				<ul className={s.bulletList}>
					{meetingData.keyStrengths.map((strength, index) => (
						<li key={index} className={s.bulletItem}>
							<div className={s.greenBullet}></div>
							<span>{strength}</span>
						</li>
					))}
				</ul>
			</div>
		);
	};

	// Render growth areas section
	const renderGrowthAreasSection = () => {
		if (!meetingData?.growthAreas || meetingData.growthAreas.length === 0) return null;

		return (
			<div className={s.growthSection}>
				<div className={s.sectionHeader}>
					<div className={s.orangeBullet}></div>
					<h3>Growth Areas:</h3>
				</div>
				<ul className={s.bulletList}>
					{meetingData.growthAreas.map((area, index) => (
						<li key={index} className={s.bulletItem}>
							<div className={s.orangeBullet}></div>
							<span>{area}</span>
						</li>
					))}
				</ul>
			</div>
		);
	};

	// Render chapters section
	const renderChaptersSection = () => {
		if (!meetingData?.chapters || meetingData.chapters.length === 0) return null;

		return (
			<div className={s.chaptersSection}>
				<div className={s.sectionHeader} onClick={() => toggleSection('chapters')}>
					<h3>Chapters & Topics:</h3>
					<span className={`${s.chevron} ${expandedSections.chapters ? s.expanded : ''}`}>
						<DownSvg />
					</span>
				</div>

				{expandedSections.chapters && (
					<div className={s.chaptersContent}>
						{meetingData.chapters.map((chapter, index) => (
							<div key={index} className={s.chapter}>
								<h4 className={s.chapterTitle}>{chapter.title}</h4>
								{chapter.description && (
									<p className={s.chapterDescription}>{chapter.description}</p>
								)}
								{chapter.points && chapter.points.length > 0 && (
									<ul className={s.bulletList}>
										{chapter.points.map((point, pointIndex) => (
											<li key={pointIndex} className={s.bulletItem}>
												<div className={s.greenBullet}></div>
												<span>{point}</span>
											</li>
										))}
									</ul>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		);
	};

	// Render decisions and actions section
	const renderDecisionsSection = () => {
		const hasDecisions = meetingData?.decisions && meetingData.decisions.length > 0;
		const hasActionItems = meetingData?.actionItems && meetingData.actionItems.length > 0;

		if (!hasDecisions && !hasActionItems) return null;

		return (
			<div className={s.decisionsSection}>
				<div className={s.sectionHeader} onClick={() => toggleSection('decisions')}>
					<h3>Decisions & Actions</h3>
					<span
						className={`${s.chevron} ${expandedSections.decisions ? s.expanded : ''}`}
					>
						<DownSvg />
					</span>
				</div>

				{expandedSections.decisions && (
					<div className={s.decisionsContent}>
						{hasDecisions && (
							<div className={s.keyDecisions}>
								<div className={s.sectionHead}>
									<div className={s.checkIcon}>✓</div>
									<h4>Key Decisions Made:</h4>
								</div>
								<div className={s.decisionsList}>
									{meetingData.decisions.map((decision, index) => (
										<div key={index} className={s.decisionItem}>
											<div className={s.decisionText}>{decision.text}</div>
											<div className={s.decisionMeta}>
												{decision.time && (
													<div className={s.timeContainer}>
														<img
															src={ClockSvg}
															alt="clock"
															className={s.clockIcon}
														/>
														<span className={s.decisionTime}>
															{decision.time}
														</span>
													</div>
												)}

												<span
													className={s.decisionPriority}
													style={{
														color: getPriorityColor(decision.priority),
													}}
												>
													{decision.priority}
												</span>
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{hasActionItems && (
							<div className={s.actionItems}>
								<div className={s.sectionHead}>
									<div className={s.gearIcon}>⚙</div>
									<h4>Action Items:</h4>
								</div>
								<div className={s.actionList}>
									{meetingData.actionItems.map((action, index) => (
										<div
											key={index}
											className={s.actionItem}
											onClick={() => handleActionClick(action.text)}
										>
											<div className={s.actionText}>
												<span className={s.actionDescription}>
													{action.text}
												</span>
												<span
													className={s.actionStatus}
													style={{
														backgroundcolor: getStatusColor(
															action.status,
														),
													}}
												>
													{action.status}
												</span>
											</div>

											<div className={s.actionMeta}>
												<span className={s.actionAssignee}>
													<div className={s.actionAssigneeIcon}>
														{action.assignee.charAt(0).toUpperCase()}
													</div>
													{action.assignee}
												</span>

												{action.dueDate && (
													<span className={s.actionDueDate}>
														Due date: {action.dueDate}
													</span>
												)}
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		);
	};

	// Render bottom input bar

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

	// Render loading state
	if (analyticsLoading) {
		return (
			<div className={s.meetSummaryContainer}>
				<div className={s.loadingContainer}>
					<Spinner />
					<p>Loading meeting summary...</p>
				</div>
			</div>
		);
	}

	// Render error state
	// if (error) {
	// 	return (
	// 		<div className={s.meetSummaryContainer}>
	// 			<div className={s.loadingContainer}>
	// 				<p style={{ color: '#ff6b6b' }}>Error: {error}</p>
	// 			</div>
	// 		</div>
	// 	);
	// }
	if (error) {
		return (
			<div className={s.meetSummaryContainer}>
				<div className={s.loadingContainer}>
					<p>No Summary</p>
				</div>
			</div>
		);
	}
	// Render no data state
	if (!analyticsData || !meetingData) {
		return (
			<div className={s.meetSummaryContainer}>
				<div className={s.loadingContainer}>
					<p>No meeting data available</p>
				</div>
			</div>
		);
	}

	return (
		<div className={s.meetSummaryContainer}>
			{/* Content Section */}
			{activeTab === 'summary' && (
				<div className={s.content}>
					{renderSummarySection()}
					{renderKeyStrengthsSection()}
					{renderGrowthAreasSection()}
					{renderChaptersSection()}
					{renderDecisionsSection()}
				</div>
			)}
			{activeTab === 'analytics' && (
				<div className={s.content}>
					<div className={s.loadingContainer}>
						<Spinner />
						<p>Analytics coming soon...</p>
					</div>
				</div>
			)}
			{renderAskVEPopover()}
		</div>
	);
};

export default memo(MeetSummary);
