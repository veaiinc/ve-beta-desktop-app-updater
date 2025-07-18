import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import '../../../assets/scss/home_page/newUi.scss';
import Context from '../../../context/context';
import ChatMessages from './ChatMessages';
import ChatBox from '../../components/chat/ChatBox';
import { useNavigate } from 'react-router-dom';
import ObjectID from 'bson-objectid';
import Suggestions from './Suggestions';

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
	} else if (index === prev2) {
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

const SCROLL_THRESHOLD = 10;
const SCROLL_STOP_DELAY = 40; // time between wheel events to detect gesture end

let scrollTimeout = null;
let scrollLocked = false;

const NewUi = () => {
	const {
		aiSetup: { aiChatSessions },
		templates: { updateStateValues },
	} = useContext(Context);
	const [info, setInfo] = useState({
		activeIndex: 0,
		dataLength: 1,
		data: [{ type: 'chatbox' }],
		sessionId: ObjectID().toString(),
		chatQuery: '',
	});
	const navigate = useNavigate();
	const containerRef = useRef(null);

	useEffect(() => {
		if (aiChatSessions?.data?.length > 4) {
			const sessions = [
				...(aiChatSessions?.data || [])?.slice(0, aiChatSessions?.data?.length - 2),
				{
					type: 'chatbox',
				},
				aiChatSessions?.data?.[aiChatSessions?.data?.length - 1],
			];
			const dataLength = sessions?.length;
			setInfo((prev) => ({
				...prev,
				activeIndex: dataLength - 2,
				dataLength,
				data: sessions,
			}));
		}
	}, [aiChatSessions]);

	useEffect(() => {
		containerRef?.current?.addEventListener('wheel', handleWheel, { passive: false });
		return () => containerRef?.current?.removeEventListener('wheel', handleWheel);
	}, []);

	const handleWheel = useCallback((e) => {
		const delta = e.deltaY;

		// Ignore tiny scrolls
		if (Math.abs(delta) < SCROLL_THRESHOLD) return;

		// If not locked, this is a new scroll gesture
		if (!scrollLocked) {
			scrollLocked = true;

			setInfo((prev) => {
				let { activeIndex = 0, dataLength } = prev;
				const newIndex =
					delta > 0
						? (activeIndex + 1) % dataLength
						: activeIndex - 1 < 0
						? dataLength - 1
						: activeIndex - 1;

				return { ...prev, activeIndex: newIndex };
			});
		}

		// Reset the timeout on every wheel event
		clearTimeout(scrollTimeout);
		scrollTimeout = setTimeout(() => {
			scrollLocked = false; // Allow next gesture
		}, SCROLL_STOP_DELAY);
	}, []);

	const handleCustomOnSendFunction = useCallback((sessionId, data) => {
		updateStateValues({ activePayloadForChat: data });
		navigate(`/chat/${sessionId}`);
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

	return (
		<div className="new-ui-container" ref={containerRef}>
			<div className="new-ui-wrapper">
				{info?.data?.map((session, index) => (
					<div
						key={index}
						className="new-ui-item"
						style={getCardStyles(index, info?.activeIndex, info?.dataLength)}
					>
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
										animateChatBox={false}
									/>
									<Suggestions
										chatQuery={info?.chatQuery}
										styles={{ backgroundColor: 'var(--card)' }}
									/>
								</div>
							) : (
								<>
									<ChatMessages sessionId={session?._id} />
									<div className="chatBoxContainer">
										<ChatBox
											sessionId={session?.id}
											onSend={(data) =>
												handleCustomOnSendFunction(session?._id, data)
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
				))}
			</div>
		</div>
	);
};

export default memo(NewUi);
