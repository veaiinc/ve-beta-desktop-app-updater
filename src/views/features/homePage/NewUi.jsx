import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import '../../../assets/scss/home_page/newUi.scss';
import Context from '../../../context/context';
import ChatMessages from './ChatMessages';
import ChatBox from '../../components/chat/ChatBox';
import { useNavigate } from 'react-router-dom';
import ObjectID from 'bson-objectid';
import {
	handleDeepResearchChainOfThought,
	handleDeepSearchChainOfThought,
} from '../../../helpers/chatHelpers';
import { ReactComponent as ArrowUpRightSvg } from '../../../assets/svg/sidebar/arrowupright.svg';
import { getGreeting } from '../../../helpers';
import jwtDecode from 'jwt-decode';
import { Tooltip } from 'antd';
import PageLoader from '../../features/app/PageLoader';

const tooltipStyle = {
	padding: 8,
	borderRadius: 8,
	color: 'var(--primary-font)',
	background: 'var(--navbar)',
	border: '1px solid var(--dividers)',
};

const customStyles = { position: 'absolute', top: '0', left: '0', zIndex: '1' };

const getCardStyles = (index, activeIndex, dataLength) => {
	const prev1 = (activeIndex - 1 + dataLength) % dataLength;
	const prev2 = (activeIndex - 2 + dataLength) % dataLength;
	const prev3 = (activeIndex - 3 + dataLength) % dataLength;
	const next = (activeIndex + 1) % dataLength;
	if (index === activeIndex) {
		return {
			top: '15%',
			bottom: '0%',
			width: '100%',
			opacity: 1,
		};
	} else if (index === prev1) {
		return {
			top: '7%',
			bottom: '85%',
			width: '88%',
			opacity: 1,
		};
	} else if (index === prev2 && dataLength > 4) {
		return {
			top: 0,
			bottom: '93%',
			width: '75%',
			opacity: 1,
		};
	} else if (index === prev3) {
		return {
			top: 0,
			bottom: '100%',
			width: '50%',
			opacity: 0.25,
		};
	} else if (index === next) {
		return {
			top: '100%',
			bottom: '0%',
			width: '100%',
			opacity: 0.25,
		};
	} else {
		return {
			top: 0,
			bottom: '100%',
			width: '50%',
			opacity: 0.25,
		};
	}
};

const getClassName = (index, activeIndex, dataLength, scrollDirection) => {
	if (scrollDirection === 'down') {
		if (index === activeIndex) {
			return 'card3__from__bottom';
		} else if (index === activeIndex - 1) {
			return 'card2__from__bottom';
		} else if (index === activeIndex + 1) {
			return 'card4__from__bottom';
		} else if (dataLength === 4) {
			if (index === activeIndex - 2) {
				return 'card0__from__bottom';
			} else if (index <= activeIndex - 2) {
				return 'card__top';
			} else if (index >= activeIndex + 2) {
				return 'card__bottom';
			}
		} else {
			if (index === activeIndex - 2) {
				return 'card1__from__bottom';
			} else if (index === activeIndex - 3) {
				return 'card0__from__bottom';
			} else if (index < activeIndex - 3) {
				return 'card__top';
			} else if (index >= activeIndex + 2) {
				return 'card__bottom';
			}
		}
	} else if (scrollDirection === 'up') {
		if (index === activeIndex) {
			return 'card3__from__top';
		} else if (index === activeIndex - 1) {
			return 'card2__from__top';
		} else if (index === activeIndex + 1) {
			return 'card4__from__top';
		} else if (dataLength === 4) {
			if (index <= activeIndex - 2) {
				return 'card__top';
			} else if (index >= activeIndex + 2) {
				return 'card__bottom';
			}
		} else {
			if (index === activeIndex - 2) {
				return 'card1__from__top';
			} else if (index === activeIndex - 3) {
				return 'card0__from__top';
			} else if (index < activeIndex - 3) {
				return 'card__top';
			} else if (index >= activeIndex + 2) {
				return 'card__bottom';
			}
		}
	} else {
		return '';
	}
};

const getUpdatedActiveCardIndex = (activeIndex, dataLength) => {
	let newIndex = 0;
	if (dataLength === 4) {
		if (activeIndex === 0) {
			newIndex = dataLength - 2;
		} else if (activeIndex === 3) {
			newIndex = 1;
		} else {
			newIndex = activeIndex;
		}
	} else {
		if (activeIndex === 0) {
			newIndex = dataLength - 3;
		} else if (activeIndex === 1) {
			newIndex = dataLength - 2;
		} else if (activeIndex === dataLength - 1) {
			newIndex = 2;
		} else if (activeIndex === dataLength - 2) {
			newIndex = 1;
		} else {
			newIndex = activeIndex;
		}
	}
	return newIndex;
};

const getNewActiveCardIndex = (scrollDirection, prevActiveIndex, dataLength) => {
	let newIndex = 0;
	//dataLength will be minimum 4 always

	if (scrollDirection === 'down') {
		if (dataLength === 4) {
			if (prevActiveIndex === dataLength - 2) {
				newIndex = 1;
			} else {
				newIndex = prevActiveIndex + 1;
			}
		} else {
			if (prevActiveIndex === dataLength - 2) {
				newIndex = 2;
			} else {
				newIndex = prevActiveIndex + 1;
			}
		}
	} else {
		if (dataLength === 4) {
			if (prevActiveIndex === 1) {
				newIndex = dataLength - 2;
			} else {
				newIndex = prevActiveIndex - 1;
			}
		} else {
			if (prevActiveIndex === 2) {
				newIndex = dataLength - 2;
			} else {
				newIndex = prevActiveIndex - 1;
			}
		}
	}
	return newIndex;
};

const SCROLL_THRESHOLD = 10;
const SCROLL_STOP_DELAY = 40; // time between wheel events to detect gesture end

let scrollTimeout = null;
let scrollLocked = false;

const NewUi = ({ handleActiveChatChange }) => {
	const {
		aiSetup: { aiChatSessions },
		templates: { updateStateValues, handleGlobalChatMessages },
		profileInfo: { userDetailsData },
		aiSetup: { proactiveHeadings, getProactiveHeadings },
	} = useContext(Context);

	const [info, setInfo] = useState({
		activeIndex: 0,
		dataLength: 1,
		data: [{ type: 'chatbox', _id: 'chatbox' }],
		sessionId: ObjectID()?.toString(),
		chatQuery: '',
		scrollDirection: null,
		isProcessingSessions: true,
	});
	const navigate = useNavigate();
	const containerRef = useRef(null);

	useEffect(() => {
		setInfo((prev) => ({ ...prev, isProcessingSessions: true }));
		if (aiChatSessions?.data?.length) {
			let sessions = [...(aiChatSessions?.data || [])];
			sessions =
				sessions?.length === 1
					? [{ type: 'chatbox', _id: 'chatbox' }, ...sessions]
					: [sessions?.[0], { type: 'chatbox', _id: 'chatbox' }, ...sessions?.slice(1)];
			sessions = [...sessions, ...sessions?.slice(0, 3)];
			sessions = sessions?.filter(
				(session) =>
					session?.recentConversations?.length > 0 || session?.type === 'chatbox',
			);
			sessions = sessions?.map((session) => {
				if (session?.type === 'chatbox') {
					return session;
				}

				if (session?.agentType === 'knowledge_agent' && session?.assistantId) {
					handleGlobalChatMessages({
						sessionId: session?._id,
						chatInfo: {
							agentType: 'knowledge_agent',
							assistantId: session?.assistantId,
						},
						updateExtraInfo: true,
					});
				}

				const { recentConversations: data } = session;

				let messages = [];

				for (let i = 0; i < data?.length; i++) {
					const {
						originalQuery = '',
						response,
						_id: messageId,
						citations,
						workflowTemplateId,
						moduleTemplateId,
						followUpQuery,
						chainOfThought,
						rating,
						designAgentsUsed,
						toolInvocations,
					} = data?.[i] || {};

					let processing = null,
						memoryThinking = null;
					let deepSearch = {},
						deepResearch = {},
						normalSearch = {};

					if (chainOfThought?.length > 0) {
						for (let i = 0; i < chainOfThought?.length; i++) {
							const { deep_search, deep_research, memory_thinking, normal_search } =
								chainOfThought?.[i] || {};
							if (deep_search) {
								processing = 'Deep Search';
								break;
							} else if (deep_research) {
								processing = 'Deep Research';
								break;
							} else if (normal_search) {
								processing = 'Normal Search';
								break;
							} else if (memory_thinking) {
								memoryThinking = memory_thinking;
							}
						}

						if (processing === 'Deep Search') {
							deepSearch = handleDeepSearchChainOfThought(chainOfThought);
						} else if (processing === 'Deep Research') {
							deepResearch = handleDeepResearchChainOfThought(chainOfThought);
						} else if (processing === 'Normal Search') {
							normalSearch = handleDeepSearchChainOfThought(chainOfThought);
						}
					}

					messages = [
						{
							message: originalQuery,
							type: 'user',
						},
						{
							message: response,
							type: 'AI',
							messageId,
							rating: rating || null,
							citations,
							follow_up_query:
								typeof followUpQuery === 'string' ? [] : followUpQuery ?? [],
							workflow_template_id: workflowTemplateId || null,
							module_template_id: moduleTemplateId || null,
							isOldMessage: true,
							stream_end: true,
							processing,
							used_agents: designAgentsUsed || [],
							tool_invocations: toolInvocations || [],
							...(processing === 'Deep Search' && { deepSearch }),
							...(processing === 'Deep Research' && { deepResearch }),
							...(processing === 'Normal Search' && { normalSearch }),
							...(memoryThinking && { memory_thinking: memoryThinking }),
						},
					]?.concat(messages);
				}

				return {
					...session,
					messages,
				};
			});

			const dataLength = sessions?.length;
			setInfo((prev) => ({
				...prev,
				activeIndex:
					prev?.data?.[prev?.activeIndex]?.type === 'chatbox'
						? dataLength - 2
						: prev?.activeIndex,
				dataLength,
				data: sessions,
				scrollDirection: null,
				isProcessingSessions: false,
			}));
		} else if (aiChatSessions?.data?.length === 0) {
			setInfo((prev) => ({
				...prev,
				isProcessingSessions: false,
			}));
		}
	}, [aiChatSessions]);

	useEffect(() => {
		containerRef?.current?.addEventListener('wheel', handleWheel, { passive: false });
		return () => containerRef?.current?.removeEventListener('wheel', handleWheel);
	}, []);
	useEffect(() => {
		getProactiveHeadings();
	}, []);

	useEffect(() => {
		handleActiveChatChange(info.data?.[info.activeIndex]);
	}, [info.activeIndex]);

	const handleWheel = useCallback((e) => {
		const delta = e.deltaY;

		// Ignore tiny scrolls
		if (Math.abs(delta) < SCROLL_THRESHOLD) return;

		// If not locked, this is a new scroll gesture
		if (!scrollLocked) {
			scrollLocked = true;

			setInfo((prev) => {
				if (prev?.dataLength === 1) {
					return prev;
				}
				let { activeIndex: prevActiveIndex = 0, dataLength } = prev;
				const scrollDirection = delta > 0 ? 'down' : 'up';
				let newIndex = getNewActiveCardIndex(scrollDirection, prevActiveIndex, dataLength);

				return {
					...prev,
					activeIndex: newIndex,
					scrollDirection,
				};
			});

			// let { activeIndex = 0, dataLength } = prev;
			// const newIndex =
			// 	delta > 0
			// 		? (activeIndex + 1) % dataLength
			// 		: activeIndex - 1 < 0
			// 		? dataLength - 1
			// 		: activeIndex - 1;

			// return { ...prev, activeIndex: newIndex };
		}

		// Reset the timeout on every wheel event
		clearTimeout(scrollTimeout);
		scrollTimeout = setTimeout(() => {
			scrollLocked = false; // Allow next gesture
		}, SCROLL_STOP_DELAY);
	}, []);

	const handleCustomOnSendFunction = useCallback((sessionId, data, agentType, assistantId) => {
		updateStateValues({ activePayloadForChat: data });

		if (agentType === 'knowledge_agent' && assistantId) {
			navigate(`/chat/${sessionId}?agentType=${agentType}&assistantId=${assistantId}`);
		} else {
			navigate(`/chat/${sessionId}`);
		}
	}, []);

	const handleExpandChat = useCallback((session) => {
		const { agentType, assistantId, _id: sessionId } = session || {};
		if (agentType === 'knowledge_agent' && assistantId) {
			navigate(`/chat/${sessionId}?agentType=${agentType}&assistantId=${assistantId}`);
		} else {
			navigate(`/chat/${sessionId}`);
		}
	}, []);

	const handleChatQueryChange = useCallback((query) => {
		setInfo((prev) => ({
			...prev,
			chatQuery: query,
		}));

		if (query?.length === 0) {
			updateStateValues({ chatBoxSuggestions: null });
		}
	}, []);

	const handleActiveIndexChange = useCallback((index) => {
		setInfo((prev) => {
			if (
				index === prev?.activeIndex - 1 ||
				(prev?.dataLength > 4 && index === prev?.activeIndex - 2)
			) {
				return {
					...prev,
					activeIndex: getUpdatedActiveCardIndex(index, prev?.dataLength),
					scrollDirection: 'up',
				};
			}
			return prev;
		});
	}, []);

	const handleNewChat = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			activeIndex: prev?.dataLength === 1 ? 0 : prev?.dataLength - 2,
			scrollDirection: 'down',
		}));
	}, []);

	const userName =
		jwtDecode(localStorage.getItem('usertoken'))?.userName ||
		userDetailsData?.firstName + ' ' + (userDetailsData?.lastName ?? '') ||
		'User';
	const greeting = getGreeting();

	return (
		<div className="new-ui-container" ref={containerRef}>
			{!aiChatSessions || info?.isProcessingSessions ? (
				<PageLoader customStyles={customStyles} />
			) : (
				<>
					<div
						className="new-ui-wrapper"
						style={{
							height: info?.data?.length === 1 ? '60vh' : '80vh',
						}}
					>
						{info?.data?.map((session, index) => {
							const animationClass = getClassName(
								index,
								info?.activeIndex,
								info?.dataLength,
								info?.scrollDirection,
							);
							const key =
								session?.type === 'chatbox'
									? index === 0 || index === info?.dataLength - 2
										? 'chatbox1'
										: 'chatbox2'
									: index;
							return (
								<div
									key={key}
									className={`new-ui-item ${
										info?.data?.length === 1 ? 'single-card' : ''
									} ${animationClass}`}
									style={
										!info?.scrollDirection
											? getCardStyles(
													index,
													info?.activeIndex,
													info?.dataLength,
											  )
											: {}
									}
								>
									<div
										className="item-wrapper"
										style={{
											cursor:
												index === info?.activeIndex - 1 ||
												(info?.dataLength > 4 &&
													index === info?.activeIndex - 2)
													? 'pointer'
													: 'default',
										}}
										onClick={() => handleActiveIndexChange(index)}
									>
										{(index === info?.activeIndex - 1 ||
											(info?.dataLength > 4 &&
												index === info?.activeIndex - 2)) && (
											<div
												className={`item-title ${
													index === info?.activeIndex - 2
														? 'low-visibility'
														: ''
												}`}
											>
												{session?.title || 'New Chat'}
											</div>
										)}

										<div
											className="item"
											ref={(el) => {
												if (el) {
													el.addEventListener(
														'wheel',
														(e) => {
															e.stopPropagation();
														},
														{ passive: false },
													);
												}
											}}
											style={{
												...(index === info?.activeIndex && {
													opacity: 1,
													pointerEvents: 'auto',
												}),
												height:
													session?.type === 'chatbox'
														? 'fit-content'
														: '100%',
											}}
										>
											{session?.type === 'chatbox' ? (
												<div className="chatboxWrapper">
													<div className="backdrop1 backdrop" />
													<div className="backdrop2 backdrop" />
													<div className="backdrop3 backdrop" />
													<div className="backdrop4 backdrop" />
													<div className={`title-container `}>
														<div className="title-text">
															{proactiveHeadings?.chat_headlines ? (
																<h2 className="title-one">
																	{
																		proactiveHeadings?.chat_headlines
																	}
																</h2>
															) : (
																<>
																	<h2 className="title-one">
																		{greeting}!
																	</h2>
																	<span className="title-two">
																		{userName}
																	</span>
																</>
															)}
														</div>
													</div>
													<ChatBox
														sessionId={info?.sessionId}
														onSend={(data) =>
															handleCustomOnSendFunction(
																info?.sessionId,
																data,
															)
														}
														customChatActions={true}
														autoFocus={false}
														animatePlaceholder={false}
														showUpgradeSubscriptionBtn={false}
														onChatQueryChange={handleChatQueryChange}
														animateChatBox={true}
													/>
													{/* <Suggestions
												chatQuery={info?.chatQuery}
												styles={{
													backgroundColor: 'var(--card)',
													position: 'relative',
												}}
											/> */}
												</div>
											) : (
												<>
													<Tooltip
														title={
															<div style={tooltipStyle}>
																<span>Expand Chat</span>
															</div>
														}
														placement="bottom"
														arrow={false}
														color={'transparent'}
													>
														<div
															className="fullChat"
															onClick={() =>
																handleExpandChat(session)
															}
														>
															<ArrowUpRightSvg />
														</div>
													</Tooltip>

													<ChatMessages
														sessionId={session?._id}
														messages={session?.messages}
													/>
													<div className="chatBoxContainer">
														<ChatBox
															sessionId={session?._id}
															onSend={(data) =>
																handleCustomOnSendFunction(
																	session?._id,
																	data,
																	session?.agentType,
																	session?.assistantId,
																)
															}
															customChatActions={true}
															autoFocus={false}
															animatePlaceholder={false}
															showUpgradeSubscriptionBtn={false}
															animateChatBox={true}
														/>
													</div>
												</>
											)}
										</div>
									</div>
								</div>
							);
						})}
					</div>
					<div className="new-ui-footer">
						<div className="footer-left-container">
							<div className="active-card-title">
								<Tooltip title="Chat Title">
									{info?.data?.[info?.activeIndex]?.title
										? info?.data?.[info?.activeIndex]?.title
										: 'New Chat'}
								</Tooltip>
							</div>
							<div className="chat-created-at">
								{info?.data?.[info?.activeIndex]?.createdAt
									? new Date(
											info?.data?.[info?.activeIndex]?.createdAt * 1000,
									  ).toLocaleTimeString('en-US', {
											hour: 'numeric',
											minute: '2-digit',
											hour12: true,
									  })
									: ''}
							</div>
						</div>

						<div
							className={`new-btn ${
								!(
									info?.activeIndex === 0 ||
									info?.activeIndex === info?.dataLength - 2
								)
									? 'active'
									: ''
							}`}
							onClick={handleNewChat}
						>
							New
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default memo(NewUi);
