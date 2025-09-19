import { memo, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import s from '../../../assets/scss/notes/meetSummary.module.scss';
import { Markdown } from '../../../helpers/markdownHelper';
import Context from '../../../context/context';
import Spinner from '../../components/loaders/Spinner';
import ClockSvg from '../meetBot/clock.svg';

const MeetSummary = ({ meetingId }) => {
	const {
		notes: { meetSummary, getMeetingAnalytics },
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
	const [activeTab, setActiveTab] = useState('summary');
	const [expandedSections, setExpandedSections] = useState({
		chapters: true,
		decisions: true,
	});

	const isSummaryLoading = !meetSummary;

	// Mock data structure matching the image
	const mockMeetingData = {
		title: 'Product interview',
		date: 'Wednesday, March 13, 2024',
		summary:
			'A recent UX feedback session highlighted user praise for improved navigation and onboarding, but also noted friction in mobile checkout, inconsistent component styling, and accessibility gaps. Three key areas of focus for the next sprint: clarity, consistency, and accessibility.',
		keyStrengths: [
			"Onboarding felt 'quick and guided' by most users",
			'New navigation menu reduced drop-offs in key flows',
		],
		growthAreas: [
			'Mobile checkout UI unclear on step 2 (confused 4/6 testers)',
			'Font contrast issues flagged by users with low vision',
			'Inconsistent button placement across product pages',
		],
		chapters: [
			{
				title: "Read's Meeting Analytics Platform Enhances Efficiency and Effectiveness",
				description:
					'Reed as a meeting analytics platform that provides real-time analytics, transcripts, summaries, key topics, questions, and action items. It also mentions a Smart Scheduler Chrome extension and the ability to catch up on key moments.',
				points: [
					'Measuring the call as a participants',
					'Real time analytics',
					'Summaries, key questions, and action items',
				],
			},
			{
				title: 'Using Read to Improve Meeting Efficiency and Effectiveness',
				description:
					'Read as a tool for making meetings more efficient by providing real-time metrics, user preferences, and integration with platforms like Zoom and Google Teams. It highlights features like transcript/summary recording, video playback, and AI-driven metrics for identifying trends and taking action.',
				points: ['Coaching metrics'],
			},
		],
		decisions: [
			{
				text: 'Adopt simplified AI-powered workflow focusing on Gmail-based personalized outreach',
				time: '22:30',
				priority: 'Medium',
			},
			{
				text: 'Start with CEO-level targeting for initial implementation',
				time: '25:40',
				priority: 'High',
			},
			{
				text: 'Use AI for account research, contact verification, and personalized messaging',
				time: '27:00',
				priority: 'Medium',
			},
			{
				text: 'Eliminate dependency on multiple tools in favor of direct Gmail integration',
				time: '28:00',
				priority: 'High',
			},
		],
		actionItems: [
			{
				text: "Provide customer list and ICP details to Gautam's team",
				assignee: 'Madhuri',
				status: 'In Progress',
				dueDate: 'Sep 13, 2025',
			},
			{
				text: 'Send offer details for email integration',
				assignee: 'Madhuri',
				status: 'Completed',
				dueDate: null,
			},
			{
				text: 'Set up initial email agent workflow',
				assignee: 'Gautam',
				status: 'Pending',
				dueDate: 'Sep 04, 2025',
			},
			{
				text: 'Test workflow using ramya@b2bcb.in email',
				assignee: 'Gautam',
				status: 'Completed',
				dueDate: null,
			},
		],
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
				return '#ff6b6b';
			case 'Medium':
				return '#ffa726';
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
				return '#66bb6a';
			case 'In Progress':
				return '#ffa726';
			case 'Pending':
				return '#94989e';
			default:
				return '#94989e';
		}
	};

	useEffect(() => {
		document.addEventListener('mouseup', handleTextSelection);
		return () => document.removeEventListener('mouseup', handleTextSelection);
	}, []);

	// Render summary section
	const renderSummarySection = () => (
		<div className={s.summarySection}>
			<p className={s.summaryText}>{mockMeetingData.summary}</p>
			<br />

			<div className={s.strengthsSection}>
				<div className={s.sectionHeader}>
					<div className={s.greenBullet}></div>
					<h3>Key Strengths:</h3>
				</div>
				<ul className={s.bulletList}>
					{mockMeetingData.keyStrengths.map((strength, index) => (
						<li key={index} className={s.bulletItem}>
							<div className={s.greenBullet}></div>
							<span>{strength}</span>
						</li>
					))}
				</ul>
			</div>

			<div className={s.growthSection}>
				<div className={s.sectionHeader}>
					<div className={s.greenBullet}></div>
					<h3>Growth Areas:</h3>
				</div>
				<ul className={s.bulletList}>
					{mockMeetingData.growthAreas.map((area, index) => (
						<li key={index} className={s.bulletItem}>
							<div className={s.greenBullet}></div>
							<span>{area}</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);

	// Render chapters section
	const renderChaptersSection = () => (
		<div className={s.chaptersSection}>
			<div className={s.sectionHeader} onClick={() => toggleSection('chapters')}>
				<h3>Chapters & Topics:</h3>
				<span className={`${s.chevron} ${expandedSections.chapters ? s.expanded : ''}`}>
					▼
				</span>
			</div>

			{expandedSections.chapters && (
				<div className={s.chaptersContent}>
					{mockMeetingData.chapters.map((chapter, index) => (
						<div key={index} className={s.chapter}>
							<h4 className={s.chapterTitle}>{chapter.title}</h4>
							<p className={s.chapterDescription}>{chapter.description}</p>
							<ul className={s.bulletList}>
								{chapter.points.map((point, pointIndex) => (
									<li key={pointIndex} className={s.bulletItem}>
										<div className={s.greenBullet}></div>
										<span>{point}</span>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			)}
		</div>
	);

	// Render decisions and actions section
	const renderDecisionsSection = () => (
		<div className={s.decisionsSection}>
			<div className={s.sectionHeader} onClick={() => toggleSection('decisions')}>
				<h3>Decisions & Actions</h3>
				<span className={`${s.chevron} ${expandedSections.decisions ? s.expanded : ''}`}>
					▼
				</span>
			</div>

			{expandedSections.decisions && (
				<div className={s.decisionsContent}>
					<div className={s.keyDecisions}>
						<div className={s.sectionHead}>
							<div className={s.checkIcon}>✓</div>
							<h4>Key Decisions Made:</h4>
						</div>
						<div className={s.decisionsList}>
							{mockMeetingData.decisions.map((decision, index) => (
								<div key={index} className={s.decisionItem}>
									<div className={s.decisionText}>{decision.text}</div>
									<div className={s.decisionMeta}>
										<div>
											<img
												src={ClockSvg}
												alt="clock"
												className={s.clockIcon}
											/>
											<span className={s.decisionTime}>{decision.time}</span>
										</div>

										<span
											className={s.decisionPriority}
											style={{ color: getPriorityColor(decision.priority) }}
										>
											{decision.priority}
										</span>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className={s.actionItems}>
						<div className={s.sectionHead}>
							<div className={s.gearIcon}>⚙</div>
							<h4>Action Items:</h4>
						</div>
						<div className={s.actionList}>
							{mockMeetingData.actionItems.map((action, index) => (
								<div key={index} className={s.actionItem}>
									<div className={s.actionText}>
										{action.text}
										<span
											className={s.actionStatus}
											style={{ color: getStatusColor(action.status) }}
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
				</div>
			)}
		</div>
	);

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

	return (
		<div className={s.meetSummaryContainer}>
			{activeTab === 'summary' && (
				<div className={s.content}>
					{renderSummarySection()}
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
