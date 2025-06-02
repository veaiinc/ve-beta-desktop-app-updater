import { memo, useCallback, useEffect, useRef, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../assets/scss/proactiveAi/proactiveAi.scss';
import Context from '../../../context/context';
import { ReactComponent as DeleteSvg } from '../../../assets/svg/delete.svg';
import { ReactComponent as CalendarSvg } from '../../../assets/svg/home_page/calendar.svg';
import { ReactComponent as AgentsSvg } from '../../../assets/svg/sidebar/agentsIcon.svg';
import { ReactComponent as RocketSvg } from '../../../assets/svg/home_page/rocket.svg';
import { ReactComponent as BulbSvg } from '../../../assets/svg/home_page/bulb.svg';
import { ReactComponent as ArrowRightSvg } from '../../../assets/svg/home_page/arrow-right.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as ArrowUpRightSvg } from '../../../assets/svg/sidebar/arrowupright.svg';
import { Collapse, Tooltip } from 'antd';
import ShareWidget from '../../components/globalComponents/ShareWidget';
import { message } from '../../components/globalComponents/CustomToast';
import CreditCoinImage from '../../../assets/images/creditCoin.png';
import { handleCombinedChainOfThought } from '../../../helpers/chatHelpers';
import { Markdown } from '../../../helpers/markdownHelper';
import ObjectID from 'bson-objectid';
import { ReactComponent as ArrowRightIcon } from '../../../assets/svg/ai_agents/ArrowLineUpRight.svg';
import PromptPopup from '../../components/homePage/PromptPopup';
import {
	getFaviconUrl,
	getWebsiteName,
	fileTypeIcons,
	redirectTo,
	redirectTypeMapper,
} from '../../../helpers';
import CombinedChainOfThought from '../../components/chat/chatComponents/CombinedChainOfThought';
const { Panel } = Collapse;

const proactiveAiData = {
	_id: '680a7d0a070e45c6749f2627',
	itemId: '680a32e2f73d34a7e8881507',
	tenantId: '66ed1b6a18efa436e3ae3b70',
	userId: '66ed1b5c18efa436e3ae3b6f',
	moduleType: 'gmail',
	title: 'AI Integration Task Prioritization & Process Optimization',
	description:
		"I've analyzed your two high-priority tasks - Document Review for AI Agent Integration Patterns and Change Validation Checklist Implementation. These align with recurring themes in team communications about scaling AI tooling while maintaining compliance.",
	chain_of_thought: [
		'1. Identified recurring integration challenges in task context',
		'2. Cross-referenced with recent project management system patterns',
		'3. Verified alignment with Q2 engineering priorities from meeting notes',
		'4. Evaluated opportunity for automation using existing API infrastructure',
		'5. Structured phased rollout based on task dependencies',
	],
	solutions: [
		'Create cross-functional review team for integration patterns (include ML engineers + security)',
		'Map existing checklists to new AI validation requirements using knowledge graph relationships',
		'Implement ClickUp automation for task tracking with AI-driven deadline predictions',
		'Develop lightweight validation framework prototype using existing Slack/Drive APIs',
		'Schedule biweekly syncs between documentation and compliance teams',
	],
	suggested_actions: null,
	suggested_prompts: null,
	confidence_score: 0.7,
	priority: null,
	web_sources: [],
	informationRequests: [],
	research_report:
		'**AI Integration Task Analysis Report**\n\n**Key Findings**\n1. Task Synergy: Both tasks address complementary aspects of AI system reliability (design patterns + validation)\n2. Contextual Alignment: Matches Q2 priorities from 4/15/25 engineering summit notes (ref: KB::680892da46399e11f243b8a3::0)\n3. Resource Leverage: Existing API integrations with Slack/Drive can accelerate checklist automation\n\n**Recommendations**\n- Immediate: Prioritize document review to unblock 3 ongoing integration projects\n- 30-Day: Implement AI-powered task dependency mapping in ClickUp\n- 60-Day: Create validation dashboard showing checklist compliance metrics',
	read: true,
	createdAt: 1745517834,
	updatedAt: 1747210798,
	zepEpisodeIds: null,
	isFavourite: true,
	formResponse: [],
	task: [],
	calendarEvent: [],
	knowledgeBase: [
		{
			_id: '680a32e2f73d34a7e8881507',
			metadata: {
				identifier: '19667d50495326cb',
				connectedEmail: 'swaroop@ve.ai',
				tenantUserId: '66ed1b5c18efa436e3ae3b6f',
				messages: [
					{
						id: '19667d50495326cb',
						messagedAt: 1745498735,
						participants: {
							from: ['noreply@ve.co'],
							to: ['swaroop@ve.ai'],
							cc: [],
							bcc: [],
						},
					},
					{
						id: '19668f6b46a1fa6a',
						messagedAt: 1745517720,
						participants: {
							from: ['noreply@ve.co'],
							to: ['swaroop@ve.ai'],
							cc: [],
							bcc: [],
						},
					},
				],
			},
			tenant_id: '66ed1b6a18efa436e3ae3b70',
			createdAt: 1745498850,
			createdBy: null,
			description: null,
			isActive: true,
			isGmailWatch: true,
			name: 'For you in  swaroop : task',
			originalFileName: null,
			platform: 'gmail',
			relatedAssistants: [],
			s3_original: {
				key: null,
				eTag: null,
				size: null,
				bucket: null,
			},
			sessionId: null,
			sourceType: 'gmail',
			status: 'ready',
			tags: [],
			updatedAt: 1745517780,
			uploadBatchId: null,
			url: null,
			vectorDb_ids: ['680a32e2f73d34a7e8881507::0', '680a32e2f73d34a7e8881507::1'],
			workflowId: null,
			zep_episode_uuid: [
				'15fc97a5-1a90-4fe7-9699-52691f3749f8',
				'6650b470-191b-4bd3-b7a6-5d8713a77c64',
			],
			isGmailWatch2: true,
		},
	],
	position: 0,
};
const ProactiveAi = () => {
	const { proactiveAiId } = useParams();
	const {
		templates: {
			updateStateValues,
			pendingActionsUpdate,
			getAISuggestedPendingActions,
			// getProactiveAiData,
			// proactiveAiData,
		},
	} = useContext(Context);
	const [info, setInfo] = useState({
		isAIResultsExpanded: true,
		isReportExpanded: false,
		isQuestionsExpanded: false,
		questionsAnswers: {},
		activeTab: 'situation',
		chainOfThoughtData: {
			hasChainOfThought: false,
		},
		feedbackPopupOpen: false,
		sharePopupOpen: false,
	});

	const navigate = useNavigate();
	const bodyRef = useRef(null);

	// useEffect(() => {
	// 	if (!proactiveAiId) return;
	// 	getProactiveAiData(proactiveAiId);
	// }, [proactiveAiId]);

	useEffect(() => {
		if (!proactiveAiData) return;

		const { chain_of_thought } = proactiveAiData;
		const chainOfThoughtData = handleCombinedChainOfThought(chain_of_thought || []);
		setInfo((prev) => ({
			...prev,
			selectedFeedback: proactiveAiData?.rating,
			chainOfThoughtData,
		}));
		if (bodyRef?.current) {
			bodyRef?.current?.scrollTo({
				top: 0,
				behavior: 'smooth',
			});
		}
	}, [proactiveAiData]);

	const handleClickRun = useCallback((prompt) => {
		if (typeof updateStateValues === 'function') {
			updateStateValues({ activePromptForChat: prompt });
		}
		navigate(`/chat/${ObjectID()?.toString()}`);
	}, []);

	const handleViewReportClick = useCallback(
		(data) => {
			const report = info?.chainOfThoughtData;
			const messages = [
				{
					type: 'user',
					moduleType: 'ai_suggestion_report',
					data,
					message: data?.title,
				},
				{
					type: 'AI',
					moduleType: 'ai_suggestion_report',
					data: {
						research_report: data?.research_report,
					},
					processing: 'Report',
					report,
					follow_up_query: data?.suggested_prompts,
					stream_end: true,
				},
			];
			updateStateValues({ globalChatMessages: messages });
			navigate(`/chat/${ObjectID()?.toString()}`);
		},
		[info?.chainOfThoughtData],
	);

	// const handleThumbClick = async (type) => {
	// 	if (data?.feedback === type) return;
	// 	const res = await pendingActionsUpdate(data?._id, { feedback: type });
	// 	if (res?.[0] === true) {
	// 		getAISuggestedPendingActions(
	// 			{
	// 				feedback: type,
	// 			},
	// 			'update',
	// 			data?._id,
	// 		);
	// 	} else {
	// 		message.error('Failed to update feedback');
	// 	}
	// };

	const handleRunBtnClick = () => {
		const questions = proactiveAiData?.informationRequests;
		const answers = info?.questionsAnswers || {};

		// Check if there's at least one non-empty answer
		const hasAnswer = Object?.values(answers)?.some((a) => a?.trim()?.length > 0);
		if (!hasAnswer) return;

		let prompt = '';
		if (questions?.length > 0) {
			const answersText = questions
				?.map((q, idx) => {
					const answer = answers?.[idx]?.trim();
					if (!answer) return null;
					return `Q${idx + 1}: ${q?.question}\nA${idx + 1}: ${answer}`;
				})
				?.filter(Boolean)
				?.join('\n\n');

			prompt = `\n\nThese are answers of your questions:\n${answersText}\n`;
		}

		updateStateValues({ activePromptForChat: prompt });
		navigate(`/chat/${ObjectID()?.toString()}`);
	};

	const handleTabClick = (tab) => {
		if (info?.activeTab !== tab) {
			setInfo((prev) => ({
				...prev,
				activeTab: tab,
			}));
		}
	};

	const handleDeleteCard = useCallback(async () => {
		if (!proactiveAiData?._id) return;
		const type = 'delete';
		const res = await pendingActionsUpdate(proactiveAiData?._id, { isDeleted: true }, type);
		if (res?.[0] === true) {
			getAISuggestedPendingActions(null, false, 'delete', proactiveAiData?._id);
			navigate('/home');
		} else {
			message.error('Failed to delete pending action');
		}
	}, [proactiveAiData?._id, getAISuggestedPendingActions, pendingActionsUpdate]);

	const handleShareClick = () => {
		setInfo((prev) => ({
			...prev,
			sharePopupOpen: true,
		}));
	};

	const handleCloseSharePopup = () => {
		setInfo((prev) => ({
			...prev,
			sharePopupOpen: false,
		}));
	};

	const handleOpenFeedbackPopup = () => {
		setInfo((prev) => ({
			...prev,
			feedbackPopupOpen: true,
		}));
	};

	const {
		title,
		description,
		confidence_score,
		priority,
		research_report,
		suggested_actions,
		solutions,
		suggested_prompts,
		usages,
		informationRequests,
		category,
		crux,
		createdAt,
		thinker_sources,
	} = proactiveAiData || {};

	const creditUsed = usages?.[0]?.credit?.toFixed(2);
	const createdDate = new Date(createdAt * 1000)?.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});

	if (!proactiveAiData) return null;

	return (
		<div className="proactive-ai-container">
			<div className="drawer-header">
				<div className="header-content">
					<div className="left-container"></div>

					<div className="right-container">
						<div className="btn teach-me-btn" onClick={handleOpenFeedbackPopup}>
							<AgentsSvg style={{ color: 'var(--primary-button)' }} /> Teach me
						</div>
						{/* <Tooltip
                    title={<div className="tooltipOption">Share</div>}
                    placement="bottom"
                    color="transparent"
                    arrow={false}
                >
                    <div className="btn share-btn" onClick={handleShareClick}>
                        <ShareSvg />
                    </div>
                </Tooltip> */}

						{/* <div className="btn download-btn">
                    <DownloadSvg />
                </div> */}
						<Tooltip
							title={<div className="tooltipOption">Delete</div>}
							placement="bottom"
							color="transparent"
							arrow={false}
						>
							<div className="btn delete-btn" onClick={handleDeleteCard}>
								<DeleteSvg />
							</div>
						</Tooltip>
					</div>
				</div>
			</div>

			<div className="body" ref={bodyRef}>
				<div className="header-title-text">{title || ''}</div>

				<div className="body-header-wrapper">
					<div className="body-header">
						<div className="description">{description || ''}</div>
					</div>

					<div className="suggestions-info">
						<div className="info">
							{confidence_score && (
								<Tooltip
									title={
										<div className="tooltipOption">
											Confidence Score: {confidence_score * 100}%
										</div>
									}
									trigger="hover"
									arrow={false}
									placement="top"
									color="transparent"
								>
									<div className="confidence">
										<div className="value">{`${confidence_score * 100}%`}</div>
									</div>
								</Tooltip>
							)}
							{priority && (
								<Tooltip
									title={
										<div className="tooltipOption">Priority: {priority}</div>
									}
									color="transparent"
									arrow={false}
								>
									<div className="priority">
										<div
											className="indicator"
											style={{
												background:
													priority === 'High'
														? 'red'
														: priority === 'Medium'
														? 'orange'
														: 'green',
											}}
										></div>
										<div className="priority-text">{`${priority}`}</div>
									</div>
								</Tooltip>
							)}
							{creditUsed && (
								<Tooltip
									title={
										<div className="tooltipOption">
											Credits Used: {creditUsed}
										</div>
									}
									color="transparent"
									arrow={false}
								>
									<div className="priority">
										<div className="icon">
											<img
												src={CreditCoinImage}
												width={16}
												height={16}
												alt="credit-coin"
											/>
										</div>
										<div className="priority-text">{`${creditUsed} C`}</div>
									</div>
								</Tooltip>
							)}
							{createdAt && (
								<Tooltip
									title={
										<div className="tooltipOption">
											Created At: {createdDate}
										</div>
									}
									color="transparent"
									arrow={false}
								>
									<div className="priority">
										<div className="icon">
											<CalendarSvg />
										</div>
										<div className="priority-text">{`${createdDate}`}</div>
									</div>
								</Tooltip>
							)}
						</div>

						<div className="more-info">
							{proactiveAiData?.knowledgeBase?.[0]?.metadata?.connectedEmail && (
								<Tooltip
									title={<div className="tooltipOption">Triggered Source</div>}
									color="transparent"
									arrow={false}
									placement="bottom"
								>
									<div className="triggered-source-container">
										<span
											className="triggered-source-value"
											onClick={() =>
												redirectTo(
													proactiveAiData?.moduleType,
													proactiveAiData?.knowledgeBase?.[0]?.metadata
														?.identifier,
												)
											}
										>
											{fileTypeIcons[proactiveAiData?.moduleType]}
											{
												proactiveAiData?.knowledgeBase?.[0]?.metadata
													?.connectedEmail
											}
										</span>
									</div>
								</Tooltip>
							)}
							{category?.length > 0 &&
								category?.map((category, idx) => (
									<div key={idx} className="category">
										{category}
									</div>
								))}
						</div>
					</div>
				</div>
				{(solutions?.length > 0 ||
					suggested_prompts?.length > 0 ||
					suggested_actions?.length > 0) && (
					<div
						className={`ai-results-container`}
						onClick={() =>
							setInfo((prev) => ({
								...prev,
								isAIResultsExpanded: !prev?.isAIResultsExpanded,
							}))
						}
					>
						<Collapse
							activeKey={info?.isAIResultsExpanded ? ['1'] : []}
							onChange={(key) =>
								setInfo((prev) => ({
									...prev,
									isAIResultsExpanded: key.length > 0,
								}))
							}
							expandIcon={() => {
								return (
									<div className="expand-icon">
										<ChevronRightThinSvg />
									</div>
								);
							}}
						>
							<Panel
								header={
									<div className="cot-header">
										<div className="cot-text">
											<div className="title-text">What you can do now</div>
											<div className="description-text">
												AI-curated solutions and recommended actions and
												prompts based on the current context.
											</div>
										</div>
									</div>
								}
								key="1"
							>
								<div className="ai-results-wrapper">
									<div className="results-container">
										{Array?.isArray(solutions)
											? solutions?.map((item, index) => (
													<div
														className="result-item"
														key={index}
														onClick={() => handleClickRun(item)}
													>
														<div className="result-text">{item}</div>
														<div className="logo-container">
															<BulbSvg />
															<div className="logo-text">
																Solution
															</div>
														</div>
													</div>
											  ))
											: solutions}

										{Array?.isArray(suggested_actions)
											? suggested_actions?.map((item, index) => (
													<div
														className="result-item"
														key={index}
														onClick={() => handleClickRun(item)}
													>
														<div className="result-text">{item}</div>

														<div className="logo-container">
															<RocketSvg />
															<div className="logo-text">Action</div>
														</div>
													</div>
											  ))
											: suggested_actions}
									</div>

									{suggested_prompts?.length > 0 && (
										<div className="suggested-prompts-container">
											<div className="suggested-prompts-title">
												Recommended Prompts
											</div>
											<div
												className="suggested-prompts"
												onClick={(e) => e.stopPropagation()}
											>
												{Array?.isArray(suggested_prompts)
													? suggested_prompts?.map((item, index) => (
															<div
																className="prompt-item"
																key={index}
																onClick={() => handleClickRun(item)}
															>
																<div className="logo">
																	<ArrowRightSvg />
																</div>
																<div className="item-text">
																	{item}
																</div>
															</div>
													  ))
													: suggested_prompts}
											</div>
										</div>
									)}
								</div>
							</Panel>
						</Collapse>
					</div>
				)}
				<div className="tabs-container">
					<div className="tab-buttons">
						<div
							className={`tab-btn ${info?.activeTab === 'situation' ? 'active' : ''}`}
							onClick={() => handleTabClick('situation')}
						>
							Situation Overview
						</div>
						{info?.chainOfThoughtData?.hasChainOfThought && (
							<div
								className={`tab-btn ${
									info?.activeTab === 'chainOfThought' ? 'active' : ''
								}`}
								onClick={() => handleTabClick('chainOfThought')}
							>
								Chain of Thought
							</div>
						)}

						{thinker_sources?.length > 0 && (
							<div
								className={`tab-btn ${
									info?.activeTab === 'sources' ? 'active' : ''
								}`}
								onClick={() => handleTabClick('sources')}
							>
								Sources
							</div>
						)}
					</div>
				</div>
				{info?.activeTab === 'situation' && (
					<div className="situation-overview-container">
						{research_report && (
							<div
								className={`report-container ${
									info?.isReportExpanded ? 'active' : ''
								}`}
								onClick={() =>
									setInfo((prev) => ({
										...prev,
										isReportExpanded: !prev?.isReportExpanded,
									}))
								}
							>
								<Collapse
									activeKey={info?.isReportExpanded ? ['1'] : []}
									onChange={(key) =>
										setInfo((prev) => ({
											...prev,
											isReportExpanded: key.length > 0,
										}))
									}
									expandIcon={() => {
										return (
											<div className="expand-icon">
												<ChevronRightThinSvg />
											</div>
										);
									}}
								>
									<Panel
										header={
											<div className="cot-header">
												<div className="cot-text">
													<div className="title-text">Report</div>
													<div className="description-text">
														{crux ||
															'Summary of key insights and outcomes.'}
													</div>
												</div>
											</div>
										}
										key="1"
									>
										<div
											className="report-description"
											onClick={(e) => e.stopPropagation()}
										>
											<Markdown citations={thinker_sources || []}>
												{research_report || ''}
											</Markdown>
										</div>
									</Panel>
								</Collapse>
							</div>
						)}

						{informationRequests?.length > 0 && (
							<div
								className={`questions-wrapper ${
									info?.isQuestionsExpanded ? 'active' : ''
								}`}
								onClick={() =>
									setInfo((prev) => ({
										...prev,
										isQuestionsExpanded: !prev?.isQuestionsExpanded,
									}))
								}
							>
								<Collapse
									activeKey={info?.isQuestionsExpanded ? ['1'] : []}
									onChange={(key) =>
										setInfo((prev) => ({
											...prev,
											isQuestionsExpanded: key?.length > 0,
										}))
									}
									expandIcon={() => {
										return (
											<div className="expand-icon">
												<ChevronRightThinSvg />
											</div>
										);
									}}
								>
									<Panel
										header={
											<div className="cot-header">
												<div className="cot-text">
													<div className="title-text">
														Questions AI have
													</div>
													<div className="description-text">
														Unanswered queries needing follow-up or
														clarity.
													</div>
												</div>
											</div>
										}
										key="1"
									>
										<div
											className="questions-container"
											onClick={(e) => e.stopPropagation()}
										>
											{informationRequests.map((questionData, index) => (
												<div className="question-container" key={index}>
													<div className="question">
														{questionData?.question || ''}
													</div>
													<input
														type="text"
														className="answers-input"
														placeholder="Enter your answer..."
														value={
															info?.questionsAnswers?.[index] || ''
														}
														onChange={(e) => {
															setInfo({
																...info,
																questionsAnswers: {
																	...info.questionsAnswers,
																	[index]: e.target.value,
																},
															});
														}}
													/>
												</div>
											))}
											<button
												onClick={handleRunBtnClick}
												className="submit-btn"
											>
												Submit
												<div className="icon-container">
													<ArrowUpRightSvg />
												</div>
											</button>
										</div>
									</Panel>
								</Collapse>
							</div>
						)}
					</div>
				)}

				{info?.activeTab === 'chainOfThought' && (
					<div className="cot">
						<div className="chain-of-thought-container">
							<div className="chain-of-thought-content">
								<CombinedChainOfThought data={info?.chainOfThoughtData} />
							</div>
						</div>
					</div>
				)}

				{info?.activeTab === 'sources' && (
					<div className="source-content">
						{(thinker_sources || [])?.map((citation, idx) => (
							<div key={citation?.id || idx}>
								<div
									className="citation-item"
									onClick={() =>
										redirectTo?.(
											citation?.type,
											citation?.[redirectTypeMapper?.[citation?.type]],
										)
									}
								>
									<div className="citation-header">
										<div className="citation-icon">
											{citation?.type === 'url' ? (
												getFaviconUrl(citation?.name) ? (
													<img
														src={getFaviconUrl(citation?.name)}
														alt="favicon"
														className="favicon-image"
													/>
												) : (
													<div className="company-icon">
														{getWebsiteName(citation?.name)?.charAt(0)}
													</div>
												)
											) : (
												<div className="company-icon">
													{citation?.type === 's3_key'
														? fileTypeIcons[
																citation?.name?.match(
																	/\.(\w+)$/,
																)?.[1]
														  ]
														: fileTypeIcons[citation?.type]}
												</div>
											)}
										</div>
										<div className="citation-details">
											<div className="website-name">
												{citation?.type === 'url'
													? getWebsiteName(citation?.name)
													: citation?.name}
											</div>
											{citation?.type === 'url' && (
												<div className="citation-url">{citation?.name}</div>
											)}

											{citation?.snippet && (
												<div className="citation-title">
													{citation?.snippet}
												</div>
											)}
										</div>
									</div>
									<div className="arrow-icon">
										<ArrowRightIcon />
									</div>
								</div>
								<div className="citation-divider" />
							</div>
						))}
					</div>
				)}
			</div>

			<div className="footer">
				<div className="footer-content">
					{/* <div className="footer-left">
                <div
                    className={`thumbs-up-container ${
                        feedback === 'thumbsup' ? 'selected-thumb' : ''
                    }`}
                    onClick={() => handleThumbsClick('thumbsup')}
                >
                    <ThumbsUpSvg />
                </div>
                <div
                    className={`thumbs-up-container ${
                        feedback === 'thumbsdown' ? 'selected-thumb' : ''
                    }`}
                    onClick={() => handleThumbsClick('thumbsdown')}
                >
                    <ThumbsDownSvg />
                </div>
            </div> */}
					<div className="btns-container">
						<button
							className="report-btn"
							onClick={() => handleViewReportClick(proactiveAiData)}
						>
							Ask AI
						</button>
					</div>
				</div>
			</div>
			<ShareWidget isOpen={info?.sharePopupOpen} onClose={handleCloseSharePopup} />

			<PromptPopup
				messageId={proactiveAiData?._id}
				liked={info?.selectedFeedback}
				open={info?.feedbackPopupOpen}
				feedbackPopupOpen={info?.feedbackPopupOpen}
				closeModal={() => setInfo((prev) => ({ ...prev, feedbackPopupOpen: false }))}
				feedbackType="pendingActionFeedback"
				setLiked={(liked) => setInfo((prev) => ({ ...prev, selectedFeedback: liked }))}
			/>
		</div>
	);
};

export default memo(ProactiveAi);
