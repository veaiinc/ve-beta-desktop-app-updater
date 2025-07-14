import { memo, useContext, useEffect, useRef, useState, useCallback } from 'react';
import '../../assets/scss/chatLeftBarComponent.scss';
import Context from '../../context/context';
import ObjectID from 'bson-objectid';
import RecentChat from '../features/chat/RecentChat';
import { ReactComponent as SparkleSvg } from '../../assets/svg/ai_agents/sparkle.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as DoubleRightArrowSvg } from '../../assets/svg/tasks/doubleRightArrow.svg';

const SIDEBAR_STATE_KEY = 'chatSidebarClosed';

const ChatLeftBarComponent = ({ children, suggestions = [] }) => {
	const {
		// subscriptionInfo: { renewBanner },
		templates: { updateStateValues },
	} = useContext(Context);

	const [info, setInfo] = useState({
		chatActive: false,
		sessionId: null,
		sessionIdChanged: false,
		mobileActive: false,
		isMobile: false,
	});

	const [isClosed, setIsClosed] = useState(() => {
		const saved = localStorage.getItem(SIDEBAR_STATE_KEY);
		return saved === null ? false : saved === 'true';
	});

	// Save isClosed to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem(SIDEBAR_STATE_KEY, isClosed);
	}, [isClosed]);

	const isFirstTimeChatActiveRef = useRef(true);
	const isFirstTimeSuggestionsRenderRef = useRef(true);

	useEffect(() => {
		const sessionId = ObjectID()?.toString();
		setInfo((prev) => ({
			...prev,
			sessionId,
			sessionIdChanged: true,
		}));

		// Check if mobile on mount
		const checkMobile = () => {
			const isMobile = window.innerWidth <= 768;
			setInfo((prev) => ({ ...prev, isMobile }));
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);

		return () => {
			window.removeEventListener('resize', checkMobile);
		};
	}, []);

	const handleChatActive = () => {
		if (info?.chatActive) return;
		isFirstTimeChatActiveRef.current = false;

		setInfo((prev) => ({
			...prev,
			chatActive: !prev?.chatActive,
			mobileActive: info?.isMobile ? true : prev?.mobileActive,
		}));
	};

	const goBack = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			chatActive: false,
		}));
	}, []);

	const handleNewChat = () => {
		const sessionId = ObjectID()?.toString();
		isFirstTimeSuggestionsRenderRef.current = false;
		setInfo((prev) => ({
			...prev,
			sessionId,
			sessionIdChanged: true,
		}));
	};

	const handleSuggestionClick = (suggestion) => {
		updateStateValues({ activePromptForChat: suggestion });
		// On mobile, close the chat panel after suggestion click
		if (info?.isMobile) {
			setInfo((prev) => ({
				...prev,
				mobileActive: false,
			}));
		}
	};

	const handleSessionIdChange = () => {
		setInfo((prev) => ({
			...prev,
			sessionIdChanged: false,
		}));
	};

	const handleGoBackClick = () => {
		setInfo((prev) => ({
			...prev,
			chatActive: false,
			mobileActive: false,
		}));
	};

	const toggleMobileChat = () => {
		setInfo((prev) => ({
			...prev,
			mobileActive: !prev?.mobileActive,
			// Keep chatActive false by default on mobile to hide overlay
			chatActive: prev?.mobileActive ? false : false,
		}));
	};

	return (
		<>
			{info?.isMobile && !info?.mobileActive && (
				<div className="mobile-chat-toggle" onClick={toggleMobileChat}>
					<SparkleSvg className="mobile-chat-toggle__icon" />
				</div>
			)}
			<div
				className={`chat-left-bar-component${info?.mobileActive ? ' mobile-active' : ''}${
					isClosed && !info?.isMobile ? ' closed' : ''
				}`}
			>
				{(!info.isMobile || info.mobileActive) && (
					<div
						className={`chat-left-bar-toggle-btn${
							isClosed && !info.isMobile ? ' closed' : ''
						}${info.isMobile ? ' mobile' : ''}`}
						onClick={() => {
							if (info.isMobile) {
								setInfo((prev) => ({ ...prev, mobileActive: false }));
							} else {
								setIsClosed((prev) => !prev);
							}
						}}
					>
						<DoubleRightArrowSvg
							className="chat-left-bar-toggle-btn__icon"
							style={{
								transform: info.isMobile
									? 'rotate(180deg)'
									: isClosed
									? 'none'
									: 'rotate(180deg)',
							}}
						/>
					</div>
				)}

				<div
					className={`chat-left-bar-component-overlay ${
						info?.chatActive ? 'inactive' : ''
					} ${info?.isMobile && !info?.chatActive ? 'mobile-hidden' : ''}`}
				>
					<div className="wrapper">{children}</div>
				</div>

				<div className="chatWrapper">
					<div className="chatWrapperHeader">
						<ChevronRightThinSvg className="chatWrapperHeader__icon" onClick={goBack} />
					</div>
					<RecentChat
						showIconText={false}
						isPreview={true}
						autoFocus={true}
						customChatBoxClick={handleChatActive}
						chatActive={info?.chatActive}
						sessionIdChanged={info?.sessionIdChanged}
						onChangeSessionId={handleSessionIdChange}
						onNewChatBtnClick={handleNewChat}
						{...(!isFirstTimeChatActiveRef?.current && {
							sId: info?.sessionId,
						})}
						showCitationsButton={false}
						onNavigateBack={handleGoBackClick}
					/>
				</div>
			</div>
		</>
	);
};

export default memo(ChatLeftBarComponent);
