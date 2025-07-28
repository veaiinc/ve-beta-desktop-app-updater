import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import '../../../assets/scss/home_page/newUi.scss';
import Context from '../../../context/context';
import ChatMessages from './ChatMessages';
import ChatBox from '../../components/chat/ChatBox';
import { useNavigate } from 'react-router-dom';
import ObjectID from 'bson-objectid';
import Suggestions from './Suggestions';
import {
	handleDeepResearchChainOfThought,
	handleDeepSearchChainOfThought,
} from '../../../helpers/chatHelpers';
import { ReactComponent as ArrowUpRightSvg } from '../../../assets/svg/sidebar/arrowupright.svg';
import { getGreeting } from '../../../helpers';
import jwtDecode from 'jwt-decode';

const getCardStyles = (index, activeIndex, dataLength) => {
	const prev1 = (activeIndex - 1 + dataLength) % dataLength;
	const prev2 = (activeIndex - 2 + dataLength) % dataLength;
	const prev3 = (activeIndex - 3 + dataLength) % dataLength;
	const next = (activeIndex + 1) % dataLength;
	if (index === activeIndex) {
		return {
			top: '18%',
			bottom: '0%',
			width: '100%',
			opacity: 1,
		};
	} else if (index === prev1) {
		return {
			top: '6%',
			bottom: '82%',
			width: '88%',
			opacity: 1,
		};
	} else if (index === prev2 && dataLength > 4) {
		return {
			top: 0,
			bottom: '94%',
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

const SCROLL_THRESHOLD = 10;
const SCROLL_STOP_DELAY = 40; // time between wheel events to detect gesture end

let scrollTimeout = null;
let scrollLocked = false;

const NewUi = ({ handleActiveChatIndex }) => {
	const {
		aiSetup: { aiChatSessions },
		templates: { updateStateValues, handleGlobalChatMessages },
		profileInfo: { userDetailsData },
	} = useContext(Context);
	const [info, setInfo] = useState({
		activeIndex: 0,
		dataLength: 1,
		data: [{ type: 'chatbox' }],
		sessionId: ObjectID()?.toString(),
		chatQuery: '',
		scrollDirection: null,
	});
	const navigate = useNavigate();
	const containerRef = useRef(null);

	useEffect(() => {
		if (aiChatSessions?.data?.length) {
			let sessions = [...(aiChatSessions?.data || [])];
			sessions =
				sessions?.length === 1
					? [{ type: 'chatbox' }, ...sessions]
					: [sessions?.[0], { type: 'chatbox' }, ...sessions?.slice(1)];
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
							follow_up_query: followUpQuery || [],
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
				activeIndex: dataLength - 2,
				dataLength,
				data: sessions,
				scrollDirection: null,
			}));
		}
	}, [aiChatSessions]);

	useEffect(() => {
		containerRef?.current?.addEventListener('wheel', handleWheel, { passive: false });
		return () => containerRef?.current?.removeEventListener('wheel', handleWheel);
	}, []);

	useEffect(() => {
		handleActiveChatIndex(info.activeIndex);
	}, [info.activeIndex]);

	const handleWheel = useCallback((e) => {
		const delta = e.deltaY;

		// Ignore tiny scrolls
		if (Math.abs(delta) < SCROLL_THRESHOLD) return;

		// If not locked, this is a new scroll gesture
		if (!scrollLocked) {
			scrollLocked = true;

			setInfo((prev) => {
				let { activeIndex: prevActiveIndex = 0, dataLength } = prev;
				const scrollDirection = delta > 0 ? 'down' : 'up';
				let newIndex = 0;
				//dataLength will be minimum 4 always

				if (scrollDirection === 'up') {
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

				return {
					...prev,
					activeIndex: newIndex,
					scrollDirection,
				};
			});
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

	const handleChatQueryChange = useCallback((query) => {
		setInfo((prev) => ({
			...prev,
			chatQuery: query,
		}));

		if (query?.length === 0) {
			updateStateValues({ chatBoxSuggestions: null });
		}
	}, []);

	const userName =
		jwtDecode(localStorage.getItem('usertoken'))?.userName ||
		userDetailsData?.firstName + ' ' + (userDetailsData?.lastName ?? '') ||
		'User';
	const greeting = getGreeting();

	return (
		<div className="new-ui-container" ref={containerRef}>
			<div
				className="new-ui-wrapper"
				style={{
					height: info?.data?.length === 1 ? '60vh' : '80vh',
				}}
			>
				{info?.data?.map((session, index) => (
					<div
						key={index}
						className={`new-ui-item ${
							info?.data?.length === 1 ? 'single-card' : ''
						} ${getClassName(
							index,
							info?.activeIndex,
							info?.dataLength,
							info?.scrollDirection,
						)}`}
						style={
							!info?.scrollDirection
								? getCardStyles(index, info?.activeIndex, info?.dataLength)
								: {}
						}
					>
						<div className="item-wrapper">
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
									}),
								}}
							>
								{session?.type === 'chatbox' ? (
									<div className="chatboxWrapper">
										<div className={`title-container `}>
											<div className="title-text">
												<h2 className="title-one">{greeting}!</h2>
												<span className="title-two">{userName}</span>
											</div>
										</div>
										<ChatBox
											sessionId={info?.sessionId}
											onSend={(data) =>
												handleCustomOnSendFunction(info?.sessionId, data)
											}
											customChatActions={true}
											autoFocus={false}
											animatePlaceholder={false}
											showUpgradeSubscriptionBtn={false}
											onChatQueryChange={handleChatQueryChange}
											animateChatBox={true}
										/>
										<Suggestions
											chatQuery={info?.chatQuery}
											styles={{ backgroundColor: 'var(--card)' }}
										/>
									</div>
								) : (
									<>
										<div
											className="fullChat"
											onClick={() => {
												navigate(`/chat/${session?._id}`);
											}}
										>
											<ArrowUpRightSvg />
										</div>
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
												animateChatBox={false}
											/>
										</div>
									</>
								)}
							</div>
						</div>
					</div>
				))}
			</div>
			<div className="active-card-title">
				{info?.data?.[info?.activeIndex]?.title
					? info?.data?.[info?.activeIndex]?.title
					: ''}
			</div>
		</div>
	);
};

export default memo(NewUi);
