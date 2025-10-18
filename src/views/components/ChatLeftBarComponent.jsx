import { memo, useEffect, useState, useCallback } from 'react';
import '../../assets/scss/chatLeftBarComponent.scss';
import ObjectID from 'bson-objectid';
import RecentChat from '../features/chat/RecentChat';
import { ReactComponent as SparkleSvg } from '../../assets/svg/ai_agents/sparkle.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as DoubleRightArrowSvg } from '../../assets/svg/tasks/doubleRightArrow.svg';

const ChatLeftBarComponent = ({ children }) => {
	const [info, setInfo] = useState(() => {
		let isClosed = false;
		try {
			const stored = localStorage.getItem('chatSidebarClosed');
			if (stored !== null && stored !== 'undefined') {
				isClosed = JSON.parse(stored);
			}
		} catch (e) {
			isClosed = false;
		}

		return {
			chatActive: false,
			sessionId: null,
			sessionIdChanged: false,
			mobileActive: false,
			isMobile: false,
			isClosed,
		};
	});

	// Save isClosed to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem('chatSidebarClosed', info.isClosed);
	}, [info.isClosed]);

	const [animationClass, setAnimationClass] = useState('');

	useEffect(() => {
		setAnimationClass((prevClass) => {
			if (info.isClosed === false) {
				return 'slide-in';
			} else if (info.isClosed === true) {
				return 'slide-out';
			}
			return prevClass;
		});
	}, [info.isClosed]);

	const handleAnimationEnd = () => {
		setAnimationClass('');
	};

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
					info.isClosed && !info?.isMobile ? ' closed' : ''
				}${animationClass ? ` ${animationClass}` : ''}`}
				onAnimationEnd={handleAnimationEnd}
			>
				{(!info.isMobile || info.mobileActive) && (
					<div
						className={`chat-left-bar-toggle-btn${
							info.isClosed && !info.isMobile ? ' closed' : ''
						}${info.isMobile ? ' mobile' : ''}`}
						onClick={() => {
							if (info.isMobile) {
								setInfo((prev) => ({ ...prev, mobileActive: false }));
							} else {
								setInfo((prev) => ({ ...prev, isClosed: !prev.isClosed }));
							}
						}}
					>
						<DoubleRightArrowSvg
							className="chat-left-bar-toggle-btn__icon"
							style={{
								transform: info.isMobile
									? 'rotate(180deg)'
									: info.isClosed
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
						isPreview={true}
						autoFocus={false}
						customChatBoxClick={handleChatActive}
						sId={info?.sessionId}
						showCitationsButton={false}
					/>
				</div>
			</div>
		</>
	);
};

export default memo(ChatLeftBarComponent);
