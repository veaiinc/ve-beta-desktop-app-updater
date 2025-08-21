import { memo, useCallback, useState, useEffect, useRef } from 'react';
import '../../../../assets/scss/home_page/ambientAi/ambientAiInfo.scss';
import { useNavigate } from 'react-router-dom';
// import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as ArrowRightSvg } from '../../../../assets/svg/home_page/arrow-right.svg';
import { ReactComponent as DeleteSvg } from '../../../../assets/svg/delete.svg';
import { ReactComponent as AgentsSvg } from '../../../../assets/svg/sidebar/agentsIcon.svg';
import { ReactComponent as MobileCloseSvg } from '../../../../assets/svg/mobile/close.svg';
import { ReactComponent as StarSvg } from '../../../../assets/svg/smartFiles/formResponse/star.svg';

import {
	handleCombinedChainOfThought,
	updateCitationIdsWithCitations,
} from '../../../../helpers/chatHelpers';
import { Markdown } from '../../../../helpers/markdownHelper';
import ObjectID from 'bson-objectid';
import { Tooltip } from 'antd';
import Context from '../../../../context/context';
import { useContext } from 'react';
import {
	getFaviconUrl,
	getWebsiteName,
	fileTypeIcons,
	redirectTo,
	redirectTypeMapper,
} from '../../../../helpers';
import { ReactComponent as ArrowRightIcon } from '../../../../assets/svg/ai_agents/ArrowLineUpRight.svg';
import ProactiveAIShare from '../../../features/homePage/ambientAi/ProactiveAIShare';
import jwtDecode from 'jwt-decode';
import PromptPopup from '../../../components/homePage/PromptPopup';
import { message } from '../../../components/globalComponents/CustomToast';
import ChainOfThoughtInterpreter from '../../../components/homePage/ChainOfThoughtInterpreter';
import GmailWidget from '../../../components/globalComponents/widgets/GmailWidget';
import CalendarWidget from '../../../components/globalComponents/widgets/calendar/CalendarWidget';
import TaskWidget from '../../../components/globalComponents/widgets/TaskWidget';

const tabOptions = [
	{ label: 'Actions', value: 'actions' },
	{ label: 'Report', value: 'report' },
	{ label: 'Sources', value: 'sources' },
];

const AmbientAiInfo = ({
	data,
	trainedFeedbackIds,
	setTrainedFeedbackIds,
	totalDocs,
	selectedCardNumber,
	onNextCardClick,
	onPrevCardClick,
	onClose,
}) => {
	const {
		templates: {
			updateStateValues,
			pendingActionsUpdate,
			getAISuggestedPendingActions,
			handleGlobalChatMessages,
		},
		profileInfo: { getTenantUserAccessControls, tenantUserAccessControls },
	} = useContext(Context);
	const [info, setInfo] = useState({
		isAIResultsExpanded: true,
		isReportExpanded: false,
		isQuestionsExpanded: false,
		questionsAnswers: {},
		activeTab: 'actions',
		chainOfThoughtData: {
			hasChainOfThought: false,
		},
		feedbackPopupOpen: false,
		isDeleting: false,
		tabOptions: [],
		accessType: 'view',
		hasFullAccess: false,
		selectedFeedback: 'thumbsUp',
		isFavourite: false,
	});

	const isUpdatingCompletedRef = useRef(false);
	const isUpdatingReadRef = useRef(false);
	const navigate = useNavigate();
	const bodyRef = useRef(null);

	useEffect(() => {
		const token = localStorage.getItem('usertoken');
		const { user_id } = jwtDecode(token);
		setInfo((prev) => ({ ...prev, currentUserId: user_id }));

		if (!tenantUserAccessControls) {
			getTenantUserAccessControls();
		}
	}, []);

	useEffect(() => {
		if (info?.currentUserId && tenantUserAccessControls) {
			let hasFullAccess = false;
			if (tenantUserAccessControls?.role === 'admin') {
				hasFullAccess = true;
			} else if (tenantUserAccessControls?.accessControls) {
				tenantUserAccessControls?.accessControls?.forEach((access) => {
					if (access?.app === 'insights' && access?.hasFullAccess && access?.isEnabled) {
						hasFullAccess = true;
					}
				});
			}
			setInfo((prev) => ({ ...prev, hasFullAccess }));
		}
	}, [info?.currentUserId, tenantUserAccessControls]);

	useEffect(() => {
		if (!data) return;

		const { research_report, suggested_actions, suggested_prompts, thinker_sources, widgets } =
			data || {};

		const { chain_of_thought } = data;
		const chainOfThoughtData = handleCombinedChainOfThought(chain_of_thought || null);
		const accessType =
			(data?.permissions?.sharedWith || [])?.filter(
				(eachItem) => eachItem?.userId === info?.currentUserId,
			)?.[0]?.access || 'view';

		const visibilityMap = {
			actions: suggested_actions?.length || suggested_prompts?.length || widgets?.length,
			report: research_report?.length || chainOfThoughtData?.hasChainOfThought,
			sources: thinker_sources?.length,
		};

		const options = tabOptions?.filter((option) => visibilityMap[option?.value]);

		setInfo((prev) => ({
			...prev,
			selectedFeedback: data?.rating,
			chainOfThoughtData,
			accessType,
			tabOptions: options,
			activeTab: options?.[0]?.value,
			isFavourite: data?.isFavourite || false,
		}));
		if (bodyRef?.current) {
			bodyRef?.current?.scrollTo({
				top: 0,
				behavior: 'smooth',
			});
		}
	}, [data]);

	const handlePromptClick = useCallback(
		(prompt) => {
			let chatPrompt = 'Proactive AI\n\n';
			chatPrompt += `Title : ${data?.title}\n\n`;
			chatPrompt += `Description : ${data?.description}\n\n`;
			chatPrompt += `Prompt : ${prompt}`;
			const sessionId = ObjectID()?.toString();

			if (typeof updateStateValues === 'function') {
				updateStateValues({
					activePromptForChat: {
						prompt: chatPrompt,
						sessionId,
					},
				});
			}
			onClose?.();
			navigate(`/chat/${sessionId}`);
		},
		[data],
	);

	const handleActionClick = useCallback((prompt, proactiveSessionId) => {
		const sessionId = ObjectID()?.toString();
		updateStateValues({
			activePromptForChat: {
				prompt,
				sessionId,
			},
			proactiveInfoForChat: {
				isProactive: true,
				proactiveSessionId,
			},
		});
		navigate(`/chat/${sessionId}`);
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
			const sessionId = ObjectID()?.toString();
			handleGlobalChatMessages({
				updateExtraInfo: true,
				recentChatMessages: messages,
				sessionId,
			});
			navigate(`/chat/${sessionId}`);
		},
		[info?.chainOfThoughtData],
	);

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
		const sessionId = ObjectID()?.toString();

		updateStateValues({
			activePromptForChat: {
				prompt,
				sessionId,
			},
		});
		navigate(`/chat/${sessionId}`);
	};

	const handlePrevCardClick = () => {
		onPrevCardClick?.();
	};

	const handleNextCardClick = () => {
		onNextCardClick?.();
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
		if (info?.accessType === 'view' && !info?.hasFullAccess) {
			message.error('You do not have access to delete this insight');
			return;
		}
		if (!data?._id || info.isDeleting) return;
		const type = 'delete';
		setInfo((prev) => ({ ...prev, isDeleting: true }));
		const res = await pendingActionsUpdate(data?._id, { isDeleted: true }, type);
		if (res?.[0] === true) {
			getAISuggestedPendingActions(null, false, 'delete', data?._id);
			onClose?.();
		} else {
			message.error('Failed to delete pending action');
		}
		setInfo((prev) => ({ ...prev, isDeleting: false }));
	}, [
		data?._id,
		getAISuggestedPendingActions,
		onClose,
		pendingActionsUpdate,
		info.isDeleting,
		info?.accessType,
		info?.hasFullAccess,
	]);
	const handleCompleteBtnClick = useCallback(
		async (data) => {
			if (info?.accessType === 'view' && !info?.hasFullAccess) {
				message.error('You do not have access to update this insight');
				return;
			}
			if (!data?._id || data?.isCompleted || isUpdatingCompletedRef.current) return;
			const payload = {
				isCompleted: true,
			};
			isUpdatingCompletedRef.current = true;
			const res = await pendingActionsUpdate(data?._id, payload, 'update');
			if (res?.[0] === true) {
				getAISuggestedPendingActions({ isCompleted: true }, false, 'update', data?._id);
			} else {
				message.error('Failed to update');
			}
			isUpdatingCompletedRef.current = false;
		},
		[pendingActionsUpdate, info?.accessType, info?.hasFullAccess, getAISuggestedPendingActions],
	);

	const handleOpenFeedbackPopup = () => {
		if (info?.accessType == 'view' && !info?.hasFullAccess) {
			message.error('You do not have access to give feedback');
			return;
		}
		setInfo((prev) => ({
			...prev,
			feedbackPopupOpen: true,
		}));
	};

	const handleReadBtnClick = useCallback(
		async (data) => {
			if (data?.read || !data?._id || isUpdatingReadRef.current) return;

			isUpdatingReadRef.current = true;

			const res = await pendingActionsUpdate(data?._id, { read: true });
			if (res?.[0] === true) {
				getAISuggestedPendingActions({ read: true }, false, 'update', data?._id);
			} else {
				message.error('Failed to update');
			}
			isUpdatingReadRef.current = false;
		},
		[pendingActionsUpdate, getAISuggestedPendingActions],
	);

	const handleFavouriteClick = useCallback(
		async (id) => {
			if (info?.accessType === 'view' && !info?.hasFullAccess) {
				message.error('You do not have access to favourite this insight');
				return;
			}

			if (!id) return;

			setInfo((prev) => {
				const newFavouriteState = !prev.isFavourite;
				//ui update
				const checkedInfo = { ...prev, isFavourite: newFavouriteState };

				// API request after state update
				(async () => {
					try {
						const res = await pendingActionsUpdate(id, {
							isFavourite: newFavouriteState,
						});
						if (res?.[0] === true) {
							getAISuggestedPendingActions(
								{ isFavourite: newFavouriteState },
								false,
								'update',
								id,
							);
							message.success(
								newFavouriteState
									? 'Added to favourites'
									: 'Removed from favourites',
							);
						} else {
							throw new Error();
						}
					} catch {
						setInfo((p) => ({ ...p, isFavourite: !newFavouriteState }));
						message.error('Failed to update favourite status');
					}
				})();

				return checkedInfo;
			});
		},
		[info?.accessType, info?.hasFullAccess, pendingActionsUpdate, getAISuggestedPendingActions],
	);

	const handleWidgetDataUpdate = useCallback(
		async ({ updatedData = null, skip = false, widgetInfo }) => {
			let { _id, widgets = [] } = data || {};
			const { action, module_type } = widgetInfo;

			if (skip === true) {
				widgets = widgets?.filter(
					(widget) => widget?.action !== action && widget?.module_type !== module_type,
				);
				try {
					const res = await pendingActionsUpdate(_id, {
						widgets,
					});
					if (res?.[0] === true) {
						getAISuggestedPendingActions({ widgets }, false, 'update', _id);
						message.success('Skipped action');
					} else {
						throw new Error();
					}
				} catch (e) {
					message.error('Failed to skip action');
				}
			}
		},
		[data],
	);

	const getWidget = useCallback(
		(item) => {
			const widgetInfo = {
				action: item?.action,
				module_type: item?.module_type,
			};

			if (item?.module_type === 'gmail') {
				return (
					<GmailWidget
						widgetData={item?.metadata}
						widgetInfo={widgetInfo}
						onChange={handleWidgetDataUpdate}
					/>
				);
			}
			if (item?.module_type === 'calendar') {
				return (
					<CalendarWidget
						widgetData={item?.metadata}
						widgetInfo={widgetInfo}
						onChange={handleWidgetDataUpdate}
					/>
				);
			}
			if (item?.module_type === 'tasks' && item?.action === 'create_task') {
				return <TaskWidget widgetData={item?.metadata} />;
			}

			return null;
		},
		[handleWidgetDataUpdate],
	);

	const {
		title,
		description,
		confidence_score,
		priority,
		research_report,
		suggested_actions,
		suggested_prompts,
		usages,
		categories,
		createdAt,
		thinker_sources,
		sessionId,
		read,
		isCompleted,
		widgets,
	} = data || {};

	const creditUsed = usages?.[0]?.credit?.toFixed(2);
	const createdDate = new Date(createdAt * 1000)?.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
	return (
		<div className="ambient-ai-info-container">
			<div className="header">
				<div className="header-content">
					<div className="left-container">
						{priority && (
							<Tooltip
								title={
									<div className="ambient-ai-tooltip">Priority: {priority}</div>
								}
								color="transparent"
								arrow={false}
							>
								<div className="suggested-info">
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
									<div className="suggested-info-text">{`${priority}`}</div>
								</div>
							</Tooltip>
						)}

						{creditUsed && (
							<Tooltip
								title={
									<div className="ambient-ai-tooltip">
										Credits Used: {creditUsed}
									</div>
								}
								color="transparent"
								arrow={false}
							>
								<div className="suggested-info">
									<div className="suggested-info-text">{`${creditUsed} C`}</div>
								</div>
							</Tooltip>
						)}

						{/* <div className="btn download-btn">
									<DownloadSvg />
								</div> */}

						{confidence_score && (
							<Tooltip
								title={
									<div className="ambient-ai-tooltip">
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
						{createdAt && (
							<Tooltip
								title={
									<div className="ambient-ai-tooltip">
										Created At: {createdDate}
									</div>
								}
								color="transparent"
								arrow={false}
							>
								<div className="suggested-info">
									<div className="suggested-info-text">{`${createdDate}`}</div>
								</div>
							</Tooltip>
						)}

						{/* <>
										<div className="total-docs">
											<div className="current-doc">{selectedCardNumber}</div>
											<div className="doc-divider">/</div>
											<div className="total">{totalDocs}</div>
										</div>
										<div className="prev-btn" onClick={handlePrevCardClick}>
											<ChevronRightThinSvg
												style={{ transform: 'rotate(270deg)' }}
											/>
										</div>
										<div className="next-btn" onClick={handleNextCardClick}>
											<ChevronRightThinSvg
												style={{ transform: 'rotate(270deg)' }}
											/>
										</div>
									</> */}
					</div>

					<div className="right-container">
						<div
							className={`starLogoContainer ${
								info?.isFavourite === true ? 'active' : ''
							}`}
							onClick={(e) => {
								handleFavouriteClick(data?._id);
							}}
						>
							<StarSvg />
						</div>

						{(info?.accessType !== 'view' || info?.hasFullAccess) && (
							<ProactiveAIShare proactiveAiId={data?._id} proactiveAiData={data} />
						)}

						<Tooltip
							title={<div className="ambient-ai-tooltip">Delete</div>}
							placement="bottom"
							color="transparent"
							arrow={false}
						>
							<div className="btn delete-btn" onClick={handleDeleteCard}>
								<DeleteSvg />
							</div>
						</Tooltip>

						<div className="mobile-close-btn" onClick={onClose}>
							<MobileCloseSvg />
						</div>
					</div>
				</div>
			</div>

			<>
				<div className="body" ref={bodyRef}>
					<div className="title-text">{title || ''}</div>

					<div className="body-wrapper">
						<div className="description-wrapper">
							<div className="description">{description || ''}</div>
						</div>

						<div className="suggestions-info">
							<div className="more-info">
								{data?.knowledgeBase?.[0]?.metadata?.connectedEmail && (
									<Tooltip
										title={
											<div className="ambient-ai-tooltip">
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
												{data?.knowledgeBase?.[0]?.metadata?.connectedEmail}
											</span>
										</div>
									</Tooltip>
								)}
								{categories?.length > 0 &&
									categories?.map((category, idx) => (
										<div key={idx} className="category">
											{category}
										</div>
									))}
							</div>
						</div>
					</div>

					<div className="tabs-container">
						<div className="tab-buttons">
							{info?.tabOptions?.map((option, index) => (
								<div
									key={index}
									className={`tab-btn ${
										info?.activeTab === option?.value ? 'active' : ''
									}`}
									onClick={() => handleTabClick(option?.value)}
								>
									{option?.label}
								</div>
							))}
						</div>
					</div>
					{info?.activeTab === 'actions' && (
						<div className="situation-overview-container">
							{widgets?.length > 0 && (
								<div className="widgets-container">
									{widgets?.map((item, index) => (
										<div className="widget" key={index}>
											{getWidget(item)}
										</div>
									))}
								</div>
							)}

							{suggested_actions?.length > 0 && (
								<div className="suggested-actions-wrapper">
									<div className="suggested-action-text">Actions</div>
									<div className="suggested-actions-container">
										{Array?.isArray(suggested_actions)
											? suggested_actions?.map((item, index) => (
													<div
														className="suggested-action"
														key={index}
														onClick={() =>
															handleActionClick(item, sessionId)
														}
													>
														{updateCitationIdsWithCitations(
															item,
															thinker_sources || [],
														)}
													</div>
											  ))
											: suggested_actions}
									</div>
								</div>
							)}

							{suggested_prompts?.length > 0 && (
								<div className="suggested-prompts-container">
									<div className="suggested-prompts-title">Prompts</div>
									<div
										className="suggested-prompts"
										onClick={(e) => e.stopPropagation()}
									>
										{Array?.isArray(suggested_prompts)
											? suggested_prompts?.map((item, index) => (
													<div
														className="prompt-item"
														key={index}
														onClick={() => handlePromptClick(item)}
													>
														<div className="logo">
															<ArrowRightSvg />
														</div>
														<div className="item-text">
															{updateCitationIdsWithCitations(
																item,
																thinker_sources || [],
															)}
														</div>
													</div>
											  ))
											: suggested_prompts}
									</div>
								</div>
							)}
						</div>
					)}

					{info?.activeTab === 'report' && (
						<div className="cot">
							<div className="chain-of-thought-container">
								{info?.chainOfThoughtData?.hasChainOfThought && (
									<div className="chain-of-thought-wrapper">
										<div className="chain-of-thought-text">
											Chain of thought
										</div>
										<div className="chain-of-thought-content">
											<ChainOfThoughtInterpreter
												data={info?.chainOfThoughtData}
												citations={thinker_sources || null}
												confidenceScore={confidence_score}
											/>
										</div>
									</div>
								)}

								{research_report && (
									<div className={`report-container`}>
										<div
											className="report-description"
											onClick={(e) => e.stopPropagation()}
										>
											<Markdown citations={thinker_sources || null}>
												{research_report || ''}
											</Markdown>
										</div>
									</div>
								)}
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
															{getWebsiteName(citation?.name)?.charAt(
																0,
															)}
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
								</div>
							))}
						</div>
					)}
				</div>

				<div className="footer">
					<div className="footer-content">
						<div className="footer-left-container">
							<button
								className="footer-left-btn"
								style={{
									cursor: read ? 'not-allowed' : 'pointer',
								}}
								onClick={() => handleReadBtnClick(data)}
							>
								{read ? 'Read' : 'Unread'}
							</button>
							<button
								className="footer-left-btn"
								onClick={() => handleCompleteBtnClick(data)}
								style={{
									cursor: isCompleted ? 'not-allowed' : 'pointer',
								}}
							>
								{isCompleted ? 'Done' : 'Not Done'}
							</button>
						</div>
						<div className="btns-container">
							<button
								className="teach-me-btn"
								onClick={handleOpenFeedbackPopup}
								style={{
									cursor: trainedFeedbackIds?.includes(data?._id)
										? 'not-allowed'
										: 'pointer',
									opacity: trainedFeedbackIds?.includes(data?._id) ? 0.5 : 1,
								}}
								disabled={trainedFeedbackIds?.includes(data?._id)}
							>
								<AgentsSvg style={{ color: 'var(--primary-button)' }} />{' '}
								{trainedFeedbackIds?.includes(data?._id) ? 'Trained' : 'Teach AI'}
							</button>
							<button
								className="report-btn"
								onClick={() => handleViewReportClick(data)}
							>
								Ask AI
							</button>
						</div>
					</div>
				</div>
			</>
			<PromptPopup
				messageId={data?._id}
				liked={info?.selectedFeedback}
				open={info?.feedbackPopupOpen}
				feedbackPopupOpen={info?.feedbackPopupOpen}
				closeModal={() => setInfo((prev) => ({ ...prev, feedbackPopupOpen: false }))}
				feedbackType="pendingActionFeedback"
				setLiked={(liked) => setInfo((prev) => ({ ...prev, selectedFeedback: liked }))}
				trainedFeedbackIds={trainedFeedbackIds}
				setTrainedFeedbackIds={setTrainedFeedbackIds}
			/>
		</div>
	);
};

export default memo(AmbientAiInfo);
