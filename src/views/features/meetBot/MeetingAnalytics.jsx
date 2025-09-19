import React, { useState, useEffect, useContext } from 'react';
import a from './MeetingAnalytics.module.scss';
import DownSvg from '../../../assets/svg/activity/DownSvg';
import ClockSvg from './clock.svg';
import Context from '../../../context/context';
import { ReactComponent as MessageSvg } from './message.svg';
import { ReactComponent as IndicatorSvg } from './indicator.svg';
import Spinner from '../../components/loaders/Spinner';
const MeetingAnalytics = ({ meetingId }) => {
	const {
		notes: { getMeetingAnalytics },
	} = useContext(Context);
	const [expandedSections, setExpandedSections] = useState({
		participants: true,
		highlights: true,
		meetingScore: true,
		openQuestions: true,
		analyticsChart: true,
	});
	const [analyticsData, setAnalyticsData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const toggleSection = (section) => {
		setExpandedSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
	};

	// Fetch meeting analytics data
	const fetchMeetingAnalytics = async () => {
		if (!meetingId) {
			setError('No meeting ID provided');
			return;
		}

		setLoading(true);
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
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMeetingAnalytics();
	}, [meetingId]);

	// Transform API participants data
	const participants = analyticsData?.participants
		? analyticsData.participants.map((participant, index) => {
				const colors = [
					'#F59E0B',
					'#EF4444',
					'#10B981',
					'#8B5CF6',
					'#06B6D4',
					'#F97316',
					'#84CC16',
				];

				// Calculate meeting duration from timeline_analysis or utterance_stats
				const meetingDurationSeconds =
					analyticsData.timeline_analysis?.length > 0
						? analyticsData.timeline_analysis[
								analyticsData.timeline_analysis.length - 1
						  ].end_ts
						: analyticsData.utterance_stats?.length > 0
						? Math.max(...analyticsData.utterance_stats.map((u) => u.end_s))
						: 3600; // Default to 60 minutes if no data

				const meetingDurationMinutes = Math.round(meetingDurationSeconds / 60);
				const talkTimeMinutes = Math.round(
					(participant.talk_time_percentage / 100) * meetingDurationMinutes,
				);

				return {
					name: participant.name,
					talkTime: `${talkTimeMinutes} min`,
					talkPercentage: `${participant.talk_time_percentage}%`,
					participantScore: participant.scores.participant_score,
					engagement: participant.scores.engagement,
					sentiment: participant.scores.sentiment,
					charisma: participant.scores.charisma,
					bias: participant.scores.bias,
					avatar: participant.name.charAt(0).toUpperCase(),
					color: colors[index % colors.length],
				};
		  })
		: [];

	// Transform API highlights data
	const highlights = analyticsData?.highlights
		? analyticsData.highlights.map((highlight) => {
				const timeMinutes = Math.floor(highlight.start_ts / 60);
				const timeSeconds = highlight.start_ts % 60;
				const timeFormatted = `${timeMinutes}:${timeSeconds.toString().padStart(2, '0')}`;

				return {
					type: highlight.type,
					time: timeFormatted,
					engagement: highlight.engagement,
					description: highlight.text,
					icon: <MessageSvg />,
				};
		  })
		: [];

	// Transform API open questions data - only if it exists and has items
	const openQuestions =
		analyticsData?.open_questions && Array.isArray(analyticsData.open_questions)
			? analyticsData.open_questions
			: [];

	// Transform API metrics data - only calculate if we have the required data
	const metrics =
		analyticsData && analyticsData.meeting_metadata
			? {
					engagement: analyticsData.meeting_metadata.overall_engagement_score || 0,
					sentiment: analyticsData.meeting_metadata.overall_sentiment_score || 0,
					totalParticipants:
						analyticsData.participants && Array.isArray(analyticsData.participants)
							? analyticsData.participants.length
							: 0,
					bestScore: analyticsData.meeting_metadata.overall_read_score || 0,
					averageEngagement:
						analyticsData.participants &&
						Array.isArray(analyticsData.participants) &&
						analyticsData.participants.length > 0
							? (
									analyticsData.participants.reduce(
										(sum, p) => sum + (p.scores?.engagement || 0),
										0,
									) / analyticsData.participants.length
							  ).toFixed(1)
							: 0,
					averageSentiment:
						analyticsData.participants &&
						Array.isArray(analyticsData.participants) &&
						analyticsData.participants.length > 0
							? (
									analyticsData.participants.reduce(
										(sum, p) => sum + (p.scores?.sentiment || 0),
										0,
									) / analyticsData.participants.length
							  ).toFixed(1)
							: 0,
					averageReadScore:
						analyticsData.participants &&
						Array.isArray(analyticsData.participants) &&
						analyticsData.participants.length > 0
							? (
									analyticsData.participants.reduce(
										(sum, p) => sum + (p.scores?.participant_score || 0),
										0,
									) / analyticsData.participants.length
							  ).toFixed(1)
							: 0,
					averageBias:
						analyticsData.participants &&
						Array.isArray(analyticsData.participants) &&
						analyticsData.participants.length > 0
							? (
									analyticsData.participants.reduce(
										(sum, p) => sum + (p.scores?.bias || 0),
										0,
									) / analyticsData.participants.length
							  ).toFixed(1)
							: 0,
					averageCharisma:
						analyticsData.participants &&
						Array.isArray(analyticsData.participants) &&
						analyticsData.participants.length > 0
							? (
									analyticsData.participants.reduce(
										(sum, p) => sum + (p.scores?.charisma || 0),
										0,
									) / analyticsData.participants.length
							  ).toFixed(1)
							: 0,
			  }
			: null;

	const WaveGraph = ({ className }) => (
		<svg
			className={className}
			xmlns="http://www.w3.org/2000/svg"
			width="409"
			height="91"
			viewBox="0 0 409 91"
			fill="none"
			style={{
				height: '48px',
				alignSelf: 'stretch',
				strokeWidth: '3px',
				stroke: 'var(--primary-button, #79ECC9)',
			}}
		>
			<g filter="url(#filter0_dddddd_5081_4747)">
				<path
					d="M30 48C30 48 32.9741 34 34.3828 30.6718C35.7916 27.3435 45.6374 26.6735 52.8533 24.987C64.1578 22.345 81.8113 21.5761 81.8113 21.5761C81.8113 21.5761 96.9971 23.85 106.7 21.5761C116.402 19.3022 127.672 21.5761 134.092 21.5761C140.512 21.5761 137.69 20.4392 150.684 18.1653C163.679 15.8914 171.031 17.0288 184.025 18.1653C197.02 19.3018 193.469 20.6074 199.522 21.5761C215.656 24.1582 234.425 19.3027 240.845 21.5761C247.266 23.8496 245.417 25.6585 248.359 27.2609C253.603 30.1172 256.97 28.3974 261.82 29.5348C266.67 30.6722 265.423 31.8083 267.768 32.9457C270.114 34.0831 270.584 30.6722 272.464 29.5348C274.345 28.3974 285.615 34.0822 293.909 31.8087C302.203 29.5353 299.533 27.3225 303.144 24.987C309.552 20.8428 313.152 18.7927 319.58 17.0283C328.01 14.7146 341.181 17.0283 341.181 17.0283L358.712 19.3022C358.712 19.3022 365.753 20.4394 369.669 21.5761C373.585 22.7129 375.966 21.5761 380 21.5761"
					stroke="#79ECC9"
					strokeWidth="3"
				/>
			</g>
			<defs>
				<filter
					id="filter0_dddddd_5081_4747"
					x="0.849838"
					y="0.826401"
					width="407.324"
					height="89.5552"
					filterUnits="userSpaceOnUse"
					colorInterpolationFilters="sRGB"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset />
					<feGaussianBlur stdDeviation="0.3354" />
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 0.192157 0 0 0 0 0.541176 0 0 0 0 0.945098 0 0 0 1 0"
					/>
					<feBlend
						mode="normal"
						in2="BackgroundImageFix"
						result="effect1_dropShadow_5081_4747"
					/>
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset />
					<feGaussianBlur stdDeviation="0.6708" />
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 0.192157 0 0 0 0 0.541176 0 0 0 0 0.945098 0 0 0 1 0"
					/>
					<feBlend
						mode="normal"
						in2="effect1_dropShadow_5081_4747"
						result="effect2_dropShadow_5081_4747"
					/>
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset />
					<feGaussianBlur stdDeviation="2.3478" />
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 0.192157 0 0 0 0 0.541176 0 0 0 0 0.945098 0 0 0 1 0"
					/>
					<feBlend
						mode="normal"
						in2="effect2_dropShadow_5081_4747"
						result="effect3_dropShadow_5081_4747"
					/>
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset dy="5" />
					<feGaussianBlur stdDeviation="4.6956" />
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 0.192157 0 0 0 0 0.541176 0 0 0 0 0.945098 0 0 0 1 0"
					/>
					<feBlend
						mode="normal"
						in2="effect3_dropShadow_5081_4747"
						result="effect4_dropShadow_5081_4747"
					/>
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset dy="9" />
					<feGaussianBlur stdDeviation="8.0496" />
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 0.192157 0 0 0 0 0.541176 0 0 0 0 0.945098 0 0 0 1 0"
					/>
					<feBlend
						mode="normal"
						in2="effect4_dropShadow_5081_4747"
						result="effect5_dropShadow_5081_4747"
					/>
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset dy="14" />
					<feGaussianBlur stdDeviation="14.0868" />
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 0.192157 0 0 0 0 0.541176 0 0 0 0 0.945098 0 0 0 1 0"
					/>
					<feBlend
						mode="normal"
						in2="effect5_dropShadow_5081_4747"
						result="effect6_dropShadow_5081_4747"
					/>
					<feBlend
						mode="normal"
						in="SourceGraphic"
						in2="effect6_dropShadow_5081_4747"
						result="shape"
					/>
				</filter>
			</defs>
		</svg>
	);

	const AnalyticsChart = () => {
		// Generate x-axis labels based on timeline data
		const timelineData = analyticsData?.timeline_analysis || [];
		const maxTime =
			timelineData.length > 0 ? timelineData[timelineData.length - 1].end_ts : 3600;
		const timeLabels = [];
		const numLabels = 6;
		for (let i = 0; i < numLabels; i++) {
			const timeSeconds = (maxTime / (numLabels - 1)) * i;
			const minutes = Math.floor(timeSeconds / 60);
			const seconds = Math.floor(timeSeconds % 60);
			timeLabels.push(`${minutes}:${seconds.toString().padStart(2, '0')}`);
		}

		// Generate participant lines based on actual data
		const participantLines = participants.slice(0, 3).map((participant, participantIndex) => {
			if (timelineData.length > 0) {
				// Use actual timeline data if available
				return timelineData
					.map((point, index) => {
						const x = 50 + (index / (timelineData.length - 1)) * 500;
						// Use participant's engagement score or generate based on their overall score
						const score =
							participant.engagement + Math.sin(index * 0.5 + participantIndex) * 10;
						const y = 200 - (Math.max(50, Math.min(90, score)) / 100) * 150;
						return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
					})
					.join(' ');
			} else {
				// Generate smooth curves for each participant
				const points = [];
				for (let i = 0; i <= 10; i++) {
					const x = 50 + (i / 10) * 500;
					const baseScore = participant.engagement;
					const variation = Math.sin(i * 0.8 + participantIndex * 2) * 8;
					const score = Math.max(50, Math.min(90, baseScore + variation));
					const y = 200 - (score / 100) * 150;
					points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
				}
				return points.join(' ');
			}
		});

		return (
			<div className={a.mainChart}>
				<div className={a.chartHeader}>
					<div className={a.chartStats}>
						<div className={a.statItemOne}>
							<span className={a.statLabel}>Total Participants Count</span>
							<span className={a.statValue}>{metrics?.totalParticipants || 0}</span>
						</div>
						<div className={a.statItemWrapper}>
							<div className={a.statItem}>
								<span className={a.statLabel}>Read Score</span>
								<div className={a.statValueWithIndicator}>
									<IndicatorSvg fill=" #EDA145" className={a.statIndicator} />
									<span className={a.statValue}>{metrics?.bestScore || 0}</span>
								</div>
							</div>
							<div className={a.statItem}>
								<span className={a.statLabel}>Engagement</span>
								<div className={a.statValueWithIndicator}>
									<IndicatorSvg fill=" #5089F9" className={a.statIndicator} />
									<span className={a.statValue}>{metrics?.engagement || 0}</span>
								</div>
							</div>
							<div className={a.statItem}>
								<span className={a.statLabel}>Sentiment</span>
								<div className={a.statValueWithIndicator}>
									<IndicatorSvg fill=" #E03F4F" className={a.statIndicator} />
									<span className={a.statValue}>{metrics?.sentiment || 0}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className={a.chartContainer}>
					<div className={a.yAxis}>
						<span>90</span>
						<span>80</span>
						<span>70</span>
						<span>60</span>
						<span>50</span>
					</div>
					<div className={a.chartArea}>
						<svg viewBox="0 0 600 200" className={a.chartSvg}>
							{/* Grid lines */}
							<defs>
								<pattern
									id="grid"
									width="60"
									height="40"
									patternUnits="userSpaceOnUse"
								>
									<path
										d="M 60 0 L 0 0 0 40"
										fill="none"
										stroke="rgba(255, 255, 255, 0.1)"
										strokeWidth="1"
									/>
								</pattern>
								{/* Gradient fills for area charts */}
								<linearGradient
									id="engagementGradient"
									x1="0%"
									y1="0%"
									x2="0%"
									y2="100%"
								>
									<stop offset="0%" stopColor="#4F9EF8" stopOpacity="0.3" />
									<stop offset="100%" stopColor="#4F9EF8" stopOpacity="0.05" />
								</linearGradient>
								<linearGradient
									id="sentimentGradient"
									x1="0%"
									y1="0%"
									x2="0%"
									y2="100%"
								>
									<stop offset="0%" stopColor="#EF4444" stopOpacity="0.3" />
									<stop offset="100%" stopColor="#EF4444" stopOpacity="0.05" />
								</linearGradient>
							</defs>
							<rect width="100%" height="100%" fill="url(#grid)" />

							{/* Area fills */}
							{timelineData.length > 0 ? (
								<>
									{/* Engagement area */}
									<path
										d={`${timelineData
											.map((point, index) => {
												const x =
													50 + (index / (timelineData.length - 1)) * 500;
												const y =
													200 - (point.engagement_score / 100) * 150;
												return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
											})
											.join(' ')} L 550 200 L 50 200 Z`}
										fill="url(#engagementGradient)"
									/>
									{/* Sentiment area */}
									<path
										d={`${timelineData
											.map((point, index) => {
												const x =
													50 + (index / (timelineData.length - 1)) * 500;
												const y = 200 - (point.sentiment_score / 100) * 150;
												return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
											})
											.join(' ')} L 550 200 L 50 200 Z`}
										fill="url(#sentimentGradient)"
									/>
								</>
							) : null}

							{/* Chart lines */}
							{participantLines.map((pathData, index) => (
								<path
									key={index}
									d={pathData}
									stroke={participants[index]?.color || '#4F9EF8'}
									strokeWidth="3"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							))}

							{/* Sentiment line */}
							{timelineData.length > 0 ? (
								<path
									d={timelineData
										.map((point, index) => {
											const x =
												50 + (index / (timelineData.length - 1)) * 500;
											const y = 200 - (point.sentiment_score / 100) * 150;
											return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
										})
										.join(' ')}
									stroke="#EF4444"
									strokeWidth="3"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							) : (
								<path
									d="M50 100 Q100 80 150 90 T250 85 Q300 70 350 75 T450 80 Q500 65 550 70"
									stroke="#EF4444"
									strokeWidth="3"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							)}
						</svg>
						<div className={a.xAxis}>
							{timeLabels.map((label, index) => (
								<span key={index}>{label}</span>
							))}
						</div>
					</div>
				</div>
				<div className={a.chartLegend}>
					{participants.slice(0, 3).map((participant, index) => (
						<div key={index} className={a.legendItem}>
							<div
								className={a.legendColor}
								style={{ backgroundColor: participant.color }}
							></div>
							<span>{participant.name}</span>
						</div>
					))}
					<div className={a.legendItem}>
						<div className={a.legendColor} style={{ backgroundColor: '#EF4444' }}></div>
						<span>Sentiment</span>
					</div>
				</div>
			</div>
		);
	};

	// Loading state
	if (loading) {
		return (
			<div className={a.analyticsMainContainer}>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						textAlign: 'center',
						padding: '2rem',
						gap: '1rem',
					}}
				>
					<Spinner />
					<p style={{ color: '#94989e' }}>Loading meeting analytics...</p>
				</div>
			</div>
		);
	}

	// Show error banner or no data message
	const showErrorBanner = error && !loading;
	const hasNoData =
		!loading &&
		!error &&
		(!analyticsData ||
			(!analyticsData.participants &&
				!analyticsData.highlights &&
				!analyticsData.open_questions &&
				!analyticsData.meeting_metadata &&
				!analyticsData.timeline_analysis));

	if (showErrorBanner) {
		return (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					color: 'var(--secondary-font, #94989e)',
					fontSize: '14px',
					fontWeight: '500',
					height: '100%',
					justifyContent: 'center',
					lineHeight: '22px',
					width: '100%',
				}}
			>
				No Analytics Data
			</div>
		);
	}
	return (
		<div className={a.analyticsMainContainer}>
			{/* Error Banner */}
			{/* {showErrorBanner && (
				<div
					style={{
						backgroundColor: '#fef2f2',
						border: '1px solid #fecaca',
						borderRadius: '6px',
						padding: '1rem',
						margin: '1rem 0',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
					}}
				>
					<div>
						<p style={{ color: '#dc2626', margin: '0', fontSize: '14px' }}>
							⚠️ {error}
						</p>
					</div>
					<button
						onClick={fetchMeetingAnalytics}
						style={{
							padding: '0.5rem 1rem',
							backgroundColor: '#4f9ef8',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
							fontSize: '12px',
						}}
					>
						Retry
					</button>
				</div>
			)} */}

			{/* No Data Message */}
			{/* {hasNoData && (
				<div
					style={{
						backgroundColor: '#f9fafb',
						border: '1px solid #e5e7eb',
						borderRadius: '6px',
						padding: '2rem',
						margin: '1rem 0',
						textAlign: 'center',
					}}
				>
					<p style={{ color: '#6b7280', margin: '0', fontSize: '16px' }}>
						📊 No analytics data available for this meeting yet.
					</p>
					<p style={{ color: '#9ca3af', margin: '0.5rem 0 0 0', fontSize: '14px' }}>
						Analytics will be generated once the meeting is processed.
					</p>
				</div>
			)} */}

			{/* Show partial data message if we have some but not all data */}
			{!hasNoData &&
				!showErrorBanner &&
				analyticsData &&
				(!analyticsData.participants ||
					!analyticsData.highlights ||
					!analyticsData.meeting_metadata) && (
					<div
						style={{
							backgroundColor: '#fef3c7',
							border: '1px solid #f59e0b',
							borderRadius: '6px',
							padding: '1rem',
							margin: '1rem 0',
							textAlign: 'center',
						}}
					>
						<p style={{ color: '#92400e', margin: '0', fontSize: '14px' }}>
							⚠️ Some analytics data is still being processed. More sections will
							appear as data becomes available.
						</p>
					</div>
				)}

			{/* Metric Cards - Only show if we have meeting metadata */}
			{analyticsData?.meeting_metadata && (
				<div className={a.analyticsContainerOne}>
					<div className={a.analyticsContainerOneItem}>
						<div className={a.conditionContainer}>
							<p className={a.metricLabel}>Engagement</p>
							<div className={a.conditionValueContainer}>
								<p className={a.conditionValue}>{metrics?.engagement || 0}</p>
								<p className={a.conditionValueText}>Good</p>
							</div>
						</div>
						<div className={a.conditionGraph}>
							<WaveGraph className={a.waveGraph} />
						</div>
					</div>
					<div className={a.analyticsContainerOneItem}>
						<div className={a.conditionContainer}>
							<p className={a.metricLabel}>Sentimental</p>
							<div className={a.conditionValueContainer}>
								<p className={a.conditionValue}>{metrics?.sentiment || 0}</p>
								<p className={a.conditionValueText}>Good</p>
							</div>
						</div>
						<div className={a.conditionGraph}>
							<WaveGraph className={a.waveGraph} />
						</div>
					</div>
				</div>
			)}

			{/* Participants Section - Only show if we have participants data with items */}
			{analyticsData?.participants &&
				Array.isArray(analyticsData.participants) &&
				analyticsData.participants.length > 0 && (
					<div className={a.section}>
						<div
							className={a.sectionHeader}
							onClick={() => toggleSection('participants')}
						>
							<h2 className={a.sectionTitle}>Participants</h2>
							<span
								className={`${a.expandIcon} ${
									expandedSections.participants ? a.expanded : ''
								}`}
							>
								<DownSvg />
							</span>
						</div>
						{expandedSections.participants && (
							<>
								<div className={a.participantsContent}>
									<div className={a.participantsGrid}>
										{participants.map((participant, index) => (
											<div key={index} className={a.participantCard}>
												<div className={a.participantHeader}>
													<div
														className={a.participantAvatar}
														style={{
															backgroundColor: participant.color,
														}}
													>
														{participant.avatar}
													</div>
													<div className={a.participantInfo}>
														<div className={a.nameTimeRow}>
															<h3 className={a.participantName}>
																{participant.name}
															</h3>
															<div className={a.timeWithIcon}>
																<span className={a.talkTime}>
																	{participant.talkTime}
																</span>
																<span className={a.clockIcon}>
																	<img
																		src={ClockSvg}
																		alt="clock"
																	/>
																</span>
															</div>
														</div>
														<div className={a.percentageRow}>
															<span className={a.percentageLabel}>
																Talk time percentage
															</span>
															<div className={a.percentageValue}>
																<span className={a.percentageText}>
																	{participant.talkPercentage}
																</span>
																<div
																	className={
																		a.percentageIndicator
																	}
																>
																	<svg
																		className={
																			a.percentageCircle
																		}
																		viewBox="0 0 36 36"
																	>
																		<path
																			className={
																				a.percentageCircleBackground
																			}
																			d="M18 2.0845
																				a 15.9155 15.9155 0 0 1 0 31.831
																				a 15.9155 15.9155 0 0 1 0 -31.831"
																		/>
																		<path
																			className={
																				a.percentageCircleProgress
																			}
																			strokeDasharray={`${parseInt(
																				participant.talkPercentage,
																			)} 100`}
																			d="M18 2.0845
																				a 15.9155 15.9155 0 0 1 0 31.831
																				a 15.9155 15.9155 0 0 1 0 -31.831"
																		/>
																	</svg>
																</div>
															</div>
														</div>
													</div>
												</div>
												<div className={a.participantMetrics}>
													<div className={a.metric}>
														<span className={a.metricName}>
															Participant Score
														</span>
														<div className={a.metricValueWithDot}>
															<span className={a.greenDot}>●</span>
															<span className={a.metricValue}>
																{participant.participantScore}
															</span>
														</div>
													</div>
													<div className={a.metric}>
														<span className={a.metricName}>
															Engagement
														</span>
														<div className={a.metricValueWithDot}>
															<span className={a.greenDot}>●</span>
															<span className={a.metricValue}>
																{participant.engagement}
															</span>
														</div>
													</div>
													<div className={a.metric}>
														<span className={a.metricName}>
															Sentiment
														</span>
														<div className={a.metricValueWithDot}>
															<span className={a.greenDot}>●</span>
															<span className={a.metricValue}>
																{participant.sentiment}
															</span>
														</div>
													</div>
													<div className={a.metric}>
														<span className={a.metricName}>
															Charisma
														</span>
														<div className={a.metricValueWithDot}>
															<span className={a.greenDot}>●</span>
															<span className={a.metricValue}>
																{participant.charisma}
															</span>
														</div>
													</div>
													<div className={a.metric}>
														<span className={a.metricName}>Bias</span>
														<div className={a.metricValueWithDot}>
															<span className={a.greenDot}>●</span>
															<span className={a.metricValue}>
																{participant.bias}
															</span>
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
								{/* {expandedSections.participants && <AnalyticsChart />} */}
							</>
						)}
					</div>
				)}

			{/* Highlights Section - Only show if we have highlights data with items */}
			{analyticsData?.highlights &&
				Array.isArray(analyticsData.highlights) &&
				analyticsData.highlights.length > 0 && (
					<div className={a.section}>
						<div
							className={a.sectionHeader}
							onClick={() => toggleSection('highlights')}
						>
							<h2 className={a.sectionTitle}>HIGHLIGHTS</h2>
							<span
								className={`${a.expandIcon} ${
									expandedSections.highlights ? a.expanded : ''
								}`}
							>
								<DownSvg />
							</span>
						</div>
						{expandedSections.highlights && (
							<div className={a.highlightsContent}>
								{highlights.map((highlight, index) => (
									<div key={index} className={a.highlightItem}>
										<div className={a.highlightHeader}>
											<div
												className={a.highlightType}
												data-type={highlight.type
													.toLowerCase()
													.replace(' ', '-')}
											>
												<span className={a.highlightIcon}>
													{highlight.icon}
												</span>
												{highlight.type}
											</div>
											<span className={a.highlightTime}>
												{highlight.time}
											</span>
											<div className={a.engagementBadge}>
												<span>Engagement:</span>
												<span className={a.engagementValue}>
													{highlight.engagement}
												</span>
											</div>
										</div>
										<p className={a.highlightDescription}>
											{highlight.description}
										</p>
									</div>
								))}
							</div>
						)}
					</div>
				)}

			{/* Meeting Score Section - Only show if we have participants data with items */}
			{analyticsData?.participants &&
				Array.isArray(analyticsData.participants) &&
				analyticsData.participants.length > 0 && (
					<div className={a.section}>
						<div
							className={a.sectionHeader}
							onClick={() => toggleSection('meetingScore')}
						>
							<h2 className={a.sectionTitle}>Meeting Score</h2>
							<span
								className={`${a.expandIcon} ${
									expandedSections.meetingScore ? a.expanded : ''
								}`}
							>
								<DownSvg />
							</span>
						</div>
						{expandedSections.meetingScore && (
							<div className={a.meetingScoreContent}>
								<div className={a.scoreCard}>
									<div className={a.scoreHeader}>
										<div className={a.participantAvatars}>
											{participants.map((p, i) => (
												<div
													key={i}
													className={a.smallAvatar}
													style={{ backgroundColor: p.color }}
												>
													{p.avatar}
												</div>
											))}
										</div>
										<span className={a.totalParticipants}>
											Total Participants Count{' '}
											{metrics?.totalParticipants || 0}
										</span>
									</div>
									<div className={a.averageMetrics}>
										<div className={a.avgMetric}>
											<div className={a.avgMetricContent}>
												<span className={a.avgLabel}>
													Average engagement
												</span>
												<span className={a.avgValue}>
													<span className={a.statIndicator}>●</span>
													{metrics?.averageEngagement || 0}
												</span>
											</div>
										</div>
										<div className={a.avgMetric}>
											<div className={a.avgMetricContent}>
												<span className={a.avgLabel}>
													Average sentiment
												</span>
												<span className={a.avgValue}>
													<span className={a.statIndicator}>●</span>
													{metrics?.averageSentiment || 0}
												</span>
											</div>
										</div>

										<div className={a.avgMetric}>
											<div className={a.avgMetricContent}>
												<span className={a.avgLabel}>
													Average read score
												</span>
												<span className={a.avgValue}>
													<span className={a.statIndicator}>●</span>
													{metrics?.averageReadScore || 0}
												</span>
											</div>
										</div>
										<div className={a.avgMetric}>
											<div className={a.avgMetricContent}>
												<span className={a.avgLabel}>Average bias</span>
												<span className={a.avgValue}>
													<span className={a.statIndicator}>●</span>
													{metrics?.averageBias || 0}
												</span>
											</div>
										</div>
										<div className={a.avgMetric}>
											<div className={a.avgMetricContent}>
												<span className={a.avgLabel}>Average charisma</span>
												<span className={a.avgValue}>
													<span className={a.statIndicator}>●</span>
													{metrics?.averageCharisma || 0}
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				)}

			{/* Open Questions Section - Only show if we have open questions data with items */}
			{analyticsData?.open_questions &&
				Array.isArray(analyticsData.open_questions) &&
				analyticsData.open_questions.length > 0 && (
					<div className={a.section}>
						<div
							className={a.sectionHeader}
							onClick={() => toggleSection('openQuestions')}
						>
							<h2 className={a.sectionTitle}>Open Questions</h2>
							<span
								className={`${a.expandIcon} ${
									expandedSections.openQuestions ? a.expanded : ''
								}`}
							>
								<DownSvg />
							</span>
						</div>
						{expandedSections.openQuestions && (
							<div className={a.openQuestionsContent}>
								{openQuestions.map((question, index) => (
									<div key={index} className={a.questionItem}>
										<div className={a.questionHeader}>
											<div className={a.questionAvatar}>
												{question.participant
													? question.participant.charAt(0)
													: '?'}
											</div>
											<div className={a.questionMeta}>
												<span className={a.questionParticipant}>
													{question.participant || 'Unknown'}
												</span>
												<span className={a.questionTime}>
													{question.time || ''}
												</span>
											</div>
										</div>
										<p className={a.questionText}>
											{question.question ||
												question.text ||
												'No question text available'}
										</p>
									</div>
								))}
							</div>
						)}
					</div>
				)}
		</div>
	);
};

export default MeetingAnalytics;
