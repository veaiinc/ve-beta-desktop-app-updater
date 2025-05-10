import { memo, useCallback, useState, useEffect, useRef, useMemo } from 'react';
import '../../../../assets/scss/home_page/modals/aiSuggestionsModal.scss';
import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as ArrowRightSvg } from '../../../../assets/svg/home_page/arrow-right.svg';
import { ReactComponent as ShareSvg } from '../../../../assets/svg/files/share.svg';
import { ReactComponent as DownloadSvg } from '../../../../assets/svg/download.svg';
import { ReactComponent as DeleteSvg } from '../../../../assets/svg/delete.svg';
import { ReactComponent as ThumbsUpSvg } from '../../../../assets/svg/thumbsUp.svg';
import { ReactComponent as ThumbsDownSvg } from '../../../../assets/svg/thumbsDown.svg';
import { ReactComponent as CoinSvg } from '../../../../assets/svg/ai_agents/coin.svg';
import { handleCombinedChainOfThought } from '../../../../helpers/chatHelpers';
import { Markdown } from '../../../../helpers/markdownHelper';
import { useNavigate } from 'react-router-dom';
import ObjectID from 'bson-objectid';
import { Drawer, Tooltip } from 'antd';
import Context from '../../../../context/context';
import { useContext } from 'react';
import { message } from '../../globalComponents/CustomToast';
import CombinedChainOfThought from '../../chat/chatComponents/CombinedChainOfThought';
import {
	getFaviconUrl,
	getWebsiteName,
	fileTypeIcons,
	redirectTo,
	redirectTypeMapper,
} from '../../../../helpers';
import { ReactComponent as ArrowRightIcon } from '../../../../assets/svg/ai_agents/ArrowLineUpRight.svg';

const AISuggestionsModal = ({
	open,
	onClose,
	data,
	onNextCardClick,
	onPrevCardClick,
	totalDocs,
	selectedCardNumber,
}) => {
	const {
		templates: { updateStateValues, pendingActionsUpdate },
	} = useContext(Context);

	const [info, setInfo] = useState({
		isExpanded: false,
		isSolutionsExpanded: false,
		isActionsExpanded: false,
		isPromptsExpanded: false,
		isReportExpanded: false,
		selectedFeedback: data?.feedback,
		isQuestionsExpanded: false,
		questionsAnswers: {},
		activeTab: 'situation',
	});

	const resizableContainerRef = useRef(null);
	const mouseXPosition = useRef(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (!data) return;

		const { chain_of_thought } = data;
		const chainOfThoughtData = handleCombinedChainOfThought(chain_of_thought || []);
		setInfo((prev) => ({
			...prev,
			selectedFeedback: data?.feedback,
			chainOfThoughtData,
		}));
	}, [data]);

	const handleClickRun = useCallback((prompt) => {
		if (typeof updateStateValues === 'function') {
			updateStateValues({ activePromptForChat: prompt });
		}
		onClose();
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

	const handleIgnoreClick = async () => {
		const res = await pendingActionsUpdate(data?._id, { isIgnored: true });
		if (res?.[0] === true) {
			onClose();
		} else {
			message.error('Failed to ignore pending action');
		}
	};
	const handleThumbClick = async (type) => {
		if (info?.selectedFeedback === type) return;
		setInfo((prev) => ({ ...prev, selectedFeedback: type }));
		const res = await pendingActionsUpdate(data?._id, { feedback: type });
		if (res?.[0] === false) {
			message.error('Failed to update feedback');
		}
	};

	const handleRunBtnClick = () => {
		const questions = data?.informationRequests;
		const answers = info?.questionsAnswers || {};

		// Check if there's at least one non-empty answer
		const hasAnswer = Object.values(answers).some((a) => a?.trim().length > 0);
		if (!hasAnswer) return;

		let prompt = '';
		if (questions?.length > 0) {
			const answersText = questions
				.map((q, idx) => {
					const answer = answers[idx]?.trim();
					if (!answer) return null;
					return `Q${idx + 1}: ${q.question}\nA${idx + 1}: ${answer}`;
				})
				.filter(Boolean)
				.join('\n\n');

			prompt = `\n\nThese are answers of your questions:\n${answersText}\n`;
		}

		updateStateValues({ activePromptForChat: prompt });
		navigate(`/chat/${ObjectID()?.toString()}`);
	};

	const handleMouseDown = (e) => {
		mouseXPosition.current = e.clientX;
		document?.addEventListener('mousemove', handleMouseMove);
		document?.addEventListener('mouseup', handleMouseUp);
	};

	const handleMouseMove = (e) => {
		if (!resizableContainerRef.current) return;
		const deltaX = mouseXPosition.current - e.clientX;

		resizableContainerRef.current.style.width = `${
			resizableContainerRef.current.offsetWidth + deltaX
		}px`;
		mouseXPosition.current = e.clientX;
	};

	const handleMouseUp = () => {
		document?.removeEventListener('mousemove', handleMouseMove);
		document?.removeEventListener('mouseup', handleMouseUp);
	};

	const handleTabClick = (tab) => {
		if (info?.activeTab !== tab) {
			setInfo((prev) => ({
				...prev,
				activeTab: tab,
			}));
		}
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
		web_sources,
		knowledge_base_sources,
	} = data || {};

	const creditUsed = usages?.[0]?.credit?.toFixed(2);
	const reportCitations = useMemo(() => {
		return [...(web_sources || []), ...(knowledge_base_sources || [])];
	}, [web_sources, knowledge_base_sources]);

	if (!data) return null;

	return (
		<Drawer
			open={open}
			onClose={onClose}
			placement="right"
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
			style={{ padding: '0px' }}
			rootClassName="ai-suggestions-drawer"
		>
			<div className="ai-suggestions-wrapper" ref={resizableContainerRef}>
				<div className="drag-handler" onMouseDown={handleMouseDown} />

				<div className="ai-suggestions-container">
					<div className="drawer-header">
						<div className="header-content">
							<div className="left-container">
								<div className="prev-btn" onClick={onPrevCardClick}>
									<ChevronRightThinSvg />
								</div>
								<div className="total-docs">
									<div className="current-doc">{selectedCardNumber}</div>
									<div className="doc-divider">/</div>
									<div className="total">{totalDocs}</div>
								</div>
								<div className="next-btn" onClick={onNextCardClick}>
									<ChevronRightThinSvg />
								</div>
							</div>

							<div className="right-container">
								<div className="btn share-btn">
									<ShareSvg />
								</div>
								<div className="btn download-btn">
									<DownloadSvg />
								</div>
								<div className="btn delete-btn">
									<DeleteSvg />
								</div>
							</div>
						</div>
					</div>

					<div className="body">
						<div className="body-header-wrapper">
							<div className="body-header">
								<div className="title-text">{title || ''}</div>
								<div className="description">{description || ''}</div>
							</div>

							<div className="suggestions-info">
								<div className="info">
									{priority && (
										<Tooltip title={`Priority: ${priority}`}>
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
										<Tooltip title={`Credit Used: ${creditUsed}`}>
											<div className="priority">
												<div className="icon">
													<CoinSvg />
												</div>
												<div className="priority-text">{`${creditUsed} C`}</div>
											</div>
										</Tooltip>
									)}
									{confidence_score && (
										<Tooltip
											title={`Confidence Score: ${confidence_score * 100}%`}
											trigger="hover"
											arrow={false}
											placement="bottom"
										>
											<div className="confidence">
												<div className="value">{`${
													confidence_score * 100
												}%`}</div>
											</div>
										</Tooltip>
									)}
								</div>

								<div className="more-info">
									{data?.knowledgeBase?.[0]?.metadata?.connectedEmail && (
										<Tooltip
											title="Triggered Source"
											arrow={false}
											placement="bottom"
										>
											<div className="triggered-source-container">
												<span
													className="triggered-source-value"
													onClick={() =>
														redirectTo(
															data?.moduleType,
															data?.knowledgeBase?.[0]?.metadata
																?.identifier,
														)
													}
												>
													{fileTypeIcons[data?.moduleType]}
													{
														data?.knowledgeBase?.[0]?.metadata
															?.connectedEmail
													}
												</span>
												<div className="categories">
													{data?.categories?.map((category, idx) => (
														<div key={idx} className="category">
															{category}
														</div>
													))}
												</div>
											</div>
										</Tooltip>
									)}
								</div>
							</div>
						</div>
						<div className="tabs-container">
							<div className="tab-buttons">
								<div
									className={`tab-btn ${
										info?.activeTab === 'situation' ? 'active' : ''
									}`}
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

								{reportCitations?.length > 0 && (
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
										<div className="cot-header">
											<div className="cot-text">
												<div className="title-text">Report</div>
												<div className="description-text">
													Summary of key insights and outcomes.
												</div>
											</div>
											<div className="report-icon-container">
												<div
													className="cot-expand-btn"
													style={{
														transform: info?.isReportExpanded
															? 'rotate(-90deg)'
															: 'rotate(90deg)',
													}}
												>
													<ChevronRightThinSvg />
												</div>
											</div>
										</div>

										{info?.isReportExpanded && (
											<div
												className="report-description"
												onClick={(e) => e.stopPropagation()}
											>
												<Markdown citations={reportCitations}>
													{research_report || ''}
												</Markdown>
											</div>
										)}
									</div>
								)}

								{solutions?.length > 0 && (
									<div
										className={`solutions-container ${
											info?.isSolutionsExpanded ? 'active' : ''
										}`}
										onClick={() =>
											setInfo((prev) => ({
												...prev,
												isSolutionsExpanded: !prev?.isSolutionsExpanded,
											}))
										}
									>
										<div className="cot-header">
											<div className="cot-text">
												<div className="title-text">
													Suggested Solutions
												</div>
												<div className="description-text">
													Quick questions to dig deeper or explore.
												</div>
											</div>
											<div
												className="cot-expand-btn"
												style={{
													transform: info?.isSolutionsExpanded
														? 'rotate(-90deg)'
														: 'rotate(90deg)',
												}}
											>
												<ChevronRightThinSvg />
											</div>
										</div>

										{info?.isSolutionsExpanded && (
											<div
												className="solutions"
												onClick={(e) => e.stopPropagation()}
											>
												{Array?.isArray(solutions)
													? solutions?.map((item, index) => (
															<div
																className="solution-item"
																key={index}
																onClick={() => handleClickRun(item)}
															>
																{/* <div className="logo">
																	<ArrowRightSvg />
																</div> */}
																<div className="item-text">
																	{item}
																</div>
															</div>
													  ))
													: solutions}
											</div>
										)}
									</div>
								)}

								{suggested_actions?.length > 0 && (
									<div
										className={`suggested-actions-container ${
											info?.isActionsExpanded ? 'active' : ''
										}`}
										onClick={() =>
											setInfo((prev) => ({
												...prev,
												isActionsExpanded: !prev?.isActionsExpanded,
											}))
										}
									>
										<div className="cot-header">
											<div className="cot-text">
												<div className="title-text">
													Recommended Actions
												</div>
												<div className="description-text">
													AI-curated next steps to resolve issues.
												</div>
											</div>
											<div
												className="cot-expand-btn"
												style={{
													transform: info?.isActionsExpanded
														? 'rotate(-90deg)'
														: 'rotate(90deg)',
												}}
											>
												<ChevronRightThinSvg />
											</div>
										</div>

										{info?.isActionsExpanded && (
											<div
												className="suggested-actions"
												onClick={(e) => e.stopPropagation()}
											>
												{Array?.isArray(suggested_actions)
													? suggested_actions?.map((item, index) => (
															<div
																className="action-item"
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
													: suggested_actions}
											</div>
										)}
									</div>
								)}

								{suggested_prompts?.length > 0 && (
									<div
										className={`suggested-prompts-container ${
											info?.isPromptsExpanded ? 'active' : ''
										}`}
										onClick={() =>
											setInfo((prev) => ({
												...prev,
												isPromptsExpanded: !prev?.isPromptsExpanded,
											}))
										}
									>
										<div className="cot-header">
											<div className="cot-text">
												<div className="title-text">Ask Me</div>
												<div className="description-text">
													Explore more with these prompts.
												</div>
											</div>
											<div
												className="cot-expand-btn"
												style={{
													transform: info?.isPromptsExpanded
														? 'rotate(-90deg)'
														: 'rotate(90deg)',
												}}
											>
												<ChevronRightThinSvg />
											</div>
										</div>

										{info?.isPromptsExpanded && (
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
										)}
									</div>
								)}
							</div>
						)}

						{info?.activeTab === 'chainOfThought' && (
							<div className="cot">
								<div
									className="chain-of-thought-container"
									onClick={() =>
										setInfo((prev) => ({
											...prev,
											isExpanded: !prev?.isExpanded,
										}))
									}
								>
									<div
										className="chain-of-thought-content"
										onClick={(e) => e.stopPropagation()}
									>
										<CombinedChainOfThought data={info?.chainOfThoughtData} />
									</div>
								</div>
							</div>
						)}

						{info?.activeTab === 'sources' && (
							<div className="source-content">
								{(reportCitations || [])?.map((citation, idx) => (
									<>
										<div
											key={citation?.id || idx}
											className="citation-item"
											onClick={() =>
												redirectTo?.(
													citation?.type,
													citation?.[
														redirectTypeMapper?.[citation?.type]
													],
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
																{getWebsiteName(
																	citation?.name,
																)?.charAt(0)}
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
														<div className="citation-url">
															{citation?.name}
														</div>
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
									</>
								))}
							</div>
						)}

						{/* {data?.informationRequests?.length > 0 && (
							<div
								className="solutions-container"
								onClick={() =>
									setInfo((prev) => ({
										...prev,
										isQuestionsExpanded: !prev?.isQuestionsExpanded,
									}))
								}
							>
								<div className="cot-header">
									<div className="cot-text">
										Questions I have
									</div>
									<div
										className="cot-expand-btn"
										style={{
											transform: info?.isQuestionsExpanded
												? 'rotate(-90deg)'
												: 'rotate(90deg)',
										}}
									>
										<ChevronRightThinSvg />
									</div>
								</div>

								{info?.isQuestionsExpanded && (
									<div className="cot">
										<div
											className="chain-of-thought-container"
											onClick={(e) => e.stopPropagation()}
										>
											{data.informationRequests.map((questionData, index) => (
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
											</button>
										</div>
									</div>
								)}
							</div>
						)}{' '} */}
					</div>

					<div className="footer">
						<div className="footer-content">
							<div className="footer-left">
								<div
									className={`thumbs-up-container ${
										info?.selectedFeedback === 'thumbsup'
											? 'selected-thumb'
											: ''
									}`}
									onClick={() => handleThumbClick('thumbsup')}
								>
									<ThumbsUpSvg />
								</div>
								<div
									className={`thumbs-up-container ${
										info?.selectedFeedback === 'thumbsdown'
											? 'selected-thumb'
											: ''
									}`}
									onClick={() => handleThumbClick('thumbsdown')}
								>
									<ThumbsDownSvg />
								</div>
							</div>
							<div className="btns-container">
								<button className="ignore-btn" onClick={handleIgnoreClick}>
									Ignore
								</button>
								<button
									className="report-btn"
									onClick={() => handleViewReportClick(data)}
								>
									View report
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Drawer>
	);
};

export default memo(AISuggestionsModal);
