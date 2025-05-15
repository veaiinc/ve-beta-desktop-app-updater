import { memo, useCallback, useState, useEffect, useRef, useMemo } from 'react';
import '../../../../assets/scss/home_page/modals/aiSuggestionsModal.scss';
import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as ArrowRightSvg } from '../../../../assets/svg/home_page/arrow-right.svg';
import { ReactComponent as ShareSvg } from '../../../../assets/svg/files/share.svg';
import { ReactComponent as DownloadSvg } from '../../../../assets/svg/download.svg';
import { ReactComponent as DeleteSvg } from '../../../../assets/svg/delete.svg';
import { ReactComponent as CalendarSvg } from '../../../../assets/svg/tasks/calendar.svg';
import { ReactComponent as ThumbsUpSvg } from '../../../../assets/svg/thumbsUp.svg';
import { ReactComponent as ThumbsDownSvg } from '../../../../assets/svg/thumbsDown.svg';
import { ReactComponent as CoinSvg } from '../../../../assets/svg/ai_agents/coin.svg';
import { ReactComponent as ArrowUpRightSvg } from '../../../../assets/svg/sidebar/arrowupright.svg';
import { handleCombinedChainOfThought } from '../../../../helpers/chatHelpers';
import { Markdown } from '../../../../helpers/markdownHelper';
import { useNavigate } from 'react-router-dom';
import ObjectID from 'bson-objectid';
import { Collapse, Drawer, Tooltip } from 'antd';
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
import PromptPopup from '../../homePage/PromptPopup';
const { Panel } = Collapse;

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
		templates: { updateStateValues, pendingActionsUpdate, getAISuggestedPendingActions },
	} = useContext(Context);

	const [info, setInfo] = useState({
		isExpanded: false,
		isSolutionsExpanded: true,
		isActionsExpanded: false,
		isPromptsExpanded: false,
		isReportExpanded: true,
		isQuestionsExpanded: false,
		questionsAnswers: {},
		activeTab: 'situation',
		chainOfThoughtData: {
			hasChainOfThought: false,
		},
		feedbackPopupOpen: false,
	});

	const resizableContainerRef = useRef(null);
	const mouseXPosition = useRef(null);
	const navigate = useNavigate();
	const bodyRef = useRef(null);

	useEffect(() => {
		if (!data) return;

		const { chain_of_thought } = data;
		const chainOfThoughtData = handleCombinedChainOfThought(chain_of_thought || []);
		setInfo((prev) => ({
			...prev,
			selectedFeedback: data?.rating,
			chainOfThoughtData,
		}));
		if (bodyRef?.current) {
			bodyRef?.current?.scrollTo({
				top: 0,
				behavior: 'smooth',
			});
		}
	}, [data]);

	const handleClickRun = useCallback((prompt) => {
		if (typeof updateStateValues === 'function') {
			updateStateValues({ activePromptForChat: prompt });
		}
		onClose?.();
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
		const questions = data?.informationRequests;
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

	const handlePrevCardClick = () => {
		onPrevCardClick?.();
	};

	const handleNextCardClick = () => {
		onNextCardClick?.();
	};

	const handleMouseDown = (e) => {
		mouseXPosition.current = e?.clientX;
		document?.addEventListener('mousemove', handleMouseMove);
		document?.addEventListener('mouseup', handleMouseUp);
	};

	const handleMouseMove = (e) => {
		if (!resizableContainerRef?.current) return;

		const deltaX = mouseXPosition?.current - e?.clientX;
		const currentWidth = resizableContainerRef?.current?.offsetWidth;
		const newWidth = currentWidth + deltaX;

		const minWidth = 600;
		const maxWidth = window?.innerWidth * 0.8 || 1000; // 80vw

		// Clamp the new width within min and max bounds
		const clampedWidth = Math?.min(Math?.max(newWidth, minWidth), maxWidth);

		resizableContainerRef.current.style.width = `${clampedWidth}px`;
		mouseXPosition.current = e?.clientX;
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

	const handleThumbsClick = (thumbs) => {
		setInfo((prev) => ({ ...prev, selectedFeedback: thumbs, feedbackPopupOpen: true }));
	};

	const handleDeleteCard = useCallback(async () => {
		if (!data?._id) return;

		const res = await pendingActionsUpdate(data?._id, { isDeleted: true });
		if (res?.[0] === true) {
			getAISuggestedPendingActions(null, false, 'delete', data?._id);
			onClose?.();
		} else {
			message.error('Failed to delete pending action');
		}
	}, [data?._id, getAISuggestedPendingActions, onClose, pendingActionsUpdate]);

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
		category,
		crux,
		createdAt,
	} = data || {};

	const creditUsed = usages?.[0]?.credit?.toFixed(2);
	const createdDate = new Date(createdAt * 1000)?.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
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
			rootClassName="ai-suggestions-drawer"
		>
			{info?.feedbackPopupOpen && (
				<PromptPopup
					messageId={data?._id}
					liked={info?.selectedFeedback}
					open={info?.feedbackPopupOpen}
					feedbackPopupOpen={info?.feedbackPopupOpen}
					closeModal={() => setInfo((prev) => ({ ...prev, feedbackPopupOpen: false }))}
					feedbackType="pendingActionFeedback"
					setLiked={(liked) => setInfo((prev) => ({ ...prev, selectedFeedback: liked }))}
				/>
			)}
			<div className="ai-suggestions-wrapper" ref={resizableContainerRef}>
				<div className="drag-handler" onMouseDown={handleMouseDown} />

				<div className="ai-suggestions-container">
					<div className="drawer-header">
						<div className="header-content">
							<div className="left-container">
								<div className="total-docs">
									<div className="current-doc">{selectedCardNumber}</div>
									<div className="doc-divider">/</div>
									<div className="total">{totalDocs}</div>
								</div>
								<div className="prev-btn" onClick={handlePrevCardClick}>
									<ChevronRightThinSvg />
								</div>
								<div className="next-btn" onClick={handleNextCardClick}>
									<ChevronRightThinSvg />
								</div>
							</div>

							<div className="right-container">
								{/* <div className="btn share-btn">
									<ShareSvg />
								</div> */}
								{/* <div className="btn download-btn">
									<DownloadSvg />
								</div> */}
								{/* <div className="btn delete-btn" onClick={handleDeleteCard}>
									<DeleteSvg />
								</div> */}
							</div>
						</div>
					</div>

					<div className="body" ref={bodyRef}>
						<div className="header-title-text">{title || ''}</div>

						<div className="body-header-wrapper">
							<div className="body-header">
								{/* <div className="title-text">{title || ''}</div> */}
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
												<div className="value">{`${
													confidence_score * 100
												}%`}</div>
											</div>
										</Tooltip>
									)}
									{priority && (
										<Tooltip
											title={
												<div className="tooltipOption">
													Priority: {priority}
												</div>
											}
											color="transparent"
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
										>
											<div className="priority">
												<div className="icon">
													<CoinSvg />
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
									{data?.knowledgeBase?.[0]?.metadata?.connectedEmail && (
										<Tooltip
											title={
												<div className="tooltipOption">
													Triggered Source
												</div>
											}
											color="transparent"
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
						{solutions?.length > 0 && (
							<div
								className={`solutions-container`}
								onClick={() =>
									setInfo((prev) => ({
										...prev,
										isSolutionsExpanded: !prev?.isSolutionsExpanded,
									}))
								}
							>
								<Collapse
									activeKey={info?.isSolutionsExpanded ? ['1'] : []}
									onChange={(key) =>
										setInfo((prev) => ({
											...prev,
											isSolutionsExpanded: key.length > 0,
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
														Suggested Solutions
													</div>
													<div className="description-text">
														Quick questions to dig deeper or explore.
													</div>
												</div>
											</div>
										}
										key="1"
									>
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
															<div className="item-text">{item}</div>
														</div>
												  ))
												: solutions}
										</div>
									</Panel>
								</Collapse>
							</div>
						)}
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
																{crux || ''}
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
													<Markdown citations={reportCitations}>
														{research_report || ''}
													</Markdown>
												</div>
											</Panel>
										</Collapse>
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
										<Collapse
											activeKey={info?.isActionsExpanded ? ['1'] : []}
											onChange={(key) =>
												setInfo((prev) => ({
													...prev,
													isActionsExpanded: key.length > 0,
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
																Recommended Actions
															</div>
															<div className="description-text">
																AI-curated next steps to resolve
																issues.
															</div>
														</div>
													</div>
												}
												key="1"
											>
												<div
													className="suggested-actions"
													onClick={(e) => e.stopPropagation()}
												>
													{Array.isArray(suggested_actions)
														? suggested_actions.map((item, index) => (
																<div
																	className="action-item"
																	key={index}
																	onClick={() =>
																		handleClickRun(item)
																	}
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
											</Panel>
										</Collapse>
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
										<Collapse
											activeKey={info?.isPromptsExpanded ? ['1'] : []}
											onChange={(key) =>
												setInfo((prev) => ({
													...prev,
													isPromptsExpanded: key.length > 0,
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
																Suggested Prompts
															</div>
															<div className="description-text">
																Explore more with these prompts.
															</div>
														</div>
													</div>
												}
												key="1"
											>
												<div
													className="suggested-prompts"
													onClick={(e) => e.stopPropagation()}
												>
													{Array?.isArray(suggested_prompts)
														? suggested_prompts?.map((item, index) => (
																<div
																	className="prompt-item"
																	key={index}
																	onClick={() =>
																		handleClickRun(item)
																	}
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
																Unanswered queries needing follow-up
																or clarity.
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
													{informationRequests.map(
														(questionData, index) => (
															<div
																className="question-container"
																key={index}
															>
																<div className="question">
																	{questionData?.question || ''}
																</div>
																<input
																	type="text"
																	className="answers-input"
																	placeholder="Enter your answer..."
																	value={
																		info?.questionsAnswers?.[
																			index
																		] || ''
																	}
																	onChange={(e) => {
																		setInfo({
																			...info,
																			questionsAnswers: {
																				...info.questionsAnswers,
																				[index]:
																					e.target.value,
																			},
																		});
																	}}
																/>
															</div>
														),
													)}
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
									onClick={() => handleViewReportClick(data)}
								>
									Ask AI
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
