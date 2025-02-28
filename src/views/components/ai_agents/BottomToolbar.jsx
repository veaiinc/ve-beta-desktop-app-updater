import React, { memo, useCallback, useState, useRef, useEffect, useContext, useMemo } from 'react';
import '../../../assets/scss/ai_agents/bottomToolbar.scss';
import { ReactComponent as Close } from '../../../assets/svg/close.svg';
import Context from '../../../context/context';
import ObjectID from 'bson-objectid';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as PaperClip } from '../../../assets/svg/ai_agents/paper-clip.svg';
import { ReactComponent as Mic } from '../../../assets/svg/ai_agents/mic.svg';
import useVoiceIntegration from '../../hooks/useVoiceIntegration';
import ChatBox from '../homePage/ChatBox';

const BottomToolbar = ({
	outerContainerStyle = {},
	chatList = [],
	onSend,
	aiChatLoading,
	handleAiUploadImage,
	customChatActions = false,
}) => {
	const {
		templates: {
			handleGlobalChatMessages,
			globalChatMessages,
			updateStateValues,
			handleGlobalUploadImage,
			checkIndividualImageUploadedStatus,
			deleteUploadedImageThroughChat,
			activeWorkflowSlugForSmartFile,
			updateApplicationChat,
			activePromptForChat,
			currentSessionId,
		},
		calendarInfo: { updateCalendarState },
		tasks: { updateTaskState },
	} = useContext(Context);
	const {
		isConnected,
		isMuted,
		audioLevel,
		connectToRoom,
		disconnect,
		toggleMute,
		toggleKrispNoiseFilter,
	} = useVoiceIntegration();

	const location = useLocation();
	const navigate = useNavigate();

	const [info, setInfo] = useState({
		expanded: false,
		inputExpanded: false,
		chatModalIsOpen: false,
		bigToolbarIsOpen: false,
		chatQuery: '',
		position: { x: window.innerWidth / 2 - 900, y: 0 },
		addQuickAction: false,
		chatSessionId: null,
		uploadedImages: [],
		chatLoading: false,
		showFullPage: true,
		voiceIntegration: false,
	});

	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const toolbarRef = useRef(null);
	const isDraggingRef = useRef(false);
	const startPosRef = useRef({ x: 0, y: 0 });
	const chatContentRef = useRef(null);

	// Add and remove event listeners
	useEffect(() => {
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, []);
	// Add this useEffect for auto-scrolling
	// useEffect(() => {
	// 	if (chatContentRef.current) {
	// 		chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
	// 	}
	// }, [chatList]); // Scroll whenever chatList changes

	// useEffect(() => {
	// 	if (currentSessionId) {
	// 		setInfo((prev) => ({ ...prev, chatSessionId: currentSessionId }));
	// 	} else {
	// 		updateStateValues({ currentSessionId: ObjectID().toString() });
	// 	}
	// }, [currentSessionId]);

	// useEffect(() => {
	// 	if (activePromptForChat) {
	// 		setInfo((prev) => ({
	// 			...prev,
	// 			// chatQuery: activePromptForChat,
	// 			chatModalIsOpen: true,
	// 			showFullPage: true,
	// 		}));
	// 		handleSendMessageFunc(null, true, activePromptForChat);
	// 		updateStateValues({ activePromptForChat: null });
	// 	}
	// }, [activePromptForChat]);

	const handleMouseDown = useCallback(
		(e) => {
			if (e.target.closest('.quickActionsButtons, input, button')) return;

			isDraggingRef.current = true;
			startPosRef.current = {
				x: e.clientX - info.position.x,
				y: e.clientY - info.position.y,
			};
		},
		[info.position],
	);

	const handleMouseMove = useCallback((e) => {
		if (!isDraggingRef.current) return;

		const newX = e.clientX - startPosRef.current.x;
		const newY = e.clientY - startPosRef.current.y;

		setInfo((prev) => ({
			...prev,
			position: { x: newX, y: newY },
		}));
	}, []);

	const handleMouseUp = useCallback(() => {
		isDraggingRef.current = false;
	}, []);

	const handleMicIconClick = useCallback(
		(event) => {
			if (!info?.voiceIntegration) {
				connectToRoom();
				setInfo((prev) => ({ ...prev, voiceIntegration: true, bigToolbarIsOpen: false }));
			} else {
				toggleMute();
			}
			event.stopPropagation();
		},

		[info, connectToRoom],
	);

	const handleDisConnect = useCallback(
		(event) => {
			disconnect();
			setInfo((prev) => ({ ...prev, voiceIntegration: false }));
			event.stopPropagation();
		},
		[info],
	);

	const handleSmallToolbarClick = () => {
		setInfo((prev) => ({
			...prev,
			bigToolbarIsOpen: true,
		}));
	};

	const handleCustomOnSendFunction = useCallback((data) => {
		updateStateValues({ activePromptForChat: data });
		navigate(`/chat/${ObjectID().toString()}`);
	}, []);

	return (
		<div
			ref={toolbarRef}
			className={`bottomToolbarParentWrapper ${info.inputExpanded ? 'expanded' : ''}`}
			style={{
				...outerContainerStyle,
				position: 'fixed',
				transform: `translate(${info.position.x}px, ${info.position.y}px)`,
				cursor: isDraggingRef.current ? 'grabbing' : 'grab',
			}}
			onMouseDown={handleMouseDown}
		>
			{info?.voiceIntegration ? (
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<img
						src={'https://ap.assets.ve.ai/logo/speaking%20final.gif'}
						width={'40px'}
						height={'40px'}
						style={{ marginBottom: '12px' }}
					/>
				</div>
			) : (
				''
			)}
			{/* bottom toolBarContent */}
			{!info?.chatModalIsOpen ? (
				info?.bigToolbarIsOpen ? (
					<div className="chatBoxContainer">
						<ChatBox onSend={handleCustomOnSendFunction} customChatActions={true} />
					</div>
				) : (
					<div className="bottomToolbarSmall" onClick={handleSmallToolbarClick}>
						<div className="toolbarText">Hey, need help ask me anything !</div>
						<div className="chat-icons-container">
							<div className="upload-icon">
								<PaperClip />
							</div>

							<div className="mic-icon" onClick={handleMicIconClick}>
								<Mic />
							</div>
							{info?.voiceIntegration ? (
								<div className="mic-icon" onClick={handleDisConnect}>
									<Close style={{ width: '20px', height: '20px' }} />
								</div>
							) : (
								''
							)}
						</div>
					</div>
				)
			) : (
				''
			)}
		</div>
	);
};

export default memo(BottomToolbar);
