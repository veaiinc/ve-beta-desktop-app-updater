import React, { memo, useCallback, useState, useRef, useEffect } from 'react';
import '../../../assets/scss/ai_agents/bottomToolbar.scss';
import { ReactComponent as Plus } from '../../../assets/svg/ai_agents/Plus.svg';
import { ReactComponent as Home } from '../../../assets/svg/ai_agents/home.svg';
import { ReactComponent as Settings } from '../../../assets/svg/ai_agents/settings.svg';
import { ReactComponent as Close } from '../../../assets/svg/close.svg';
import { ReactComponent as Expand } from '../../../assets/svg/bottomToolbar/expand.svg';
import ToolBarChatContainerModal from '../modalsV2/ToolBarChatContainerModal';
import { message } from 'antd';
import ReactMarkdown from 'react-markdown';

const BottomToolbar = ({ outerContainerStyle = {}, chatList = [], onSend, aiChatLoading }) => {
	const [info, setInfo] = useState({
		expanded: false,
		inputExpanded: false,
		chatModalIsOpen: false,
		chatQuery: '',
		position: { x: 0, y: 0 },
	});

	const toolbarRef = useRef(null);
	const isDraggingRef = useRef(false);
	const startPosRef = useRef({ x: 0, y: 0 });
	const chatContentRef = useRef(null);

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

	// Add and remove event listeners
	React.useEffect(() => {
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, [handleMouseMove, handleMouseUp]);

	//function definitions
	const handleInputFocus = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			expanded: true,
			inputExpanded: true,
		}));
	}, [info]);

	const handleClose = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			expanded: false,
		}));
	}, [info]);

	const handleChatExpand = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			chatModalIsOpen: true,
			expanded: false,
			inputExpanded: false,
		}));
	}, []);

	const handleCloseChatModal = useCallback(() => {
		setInfo((prev) => ({ ...prev, chatModalIsOpen: false }));
	}, [info]);

	const handleSendMessageFunc = useCallback(
		(e) => {
			if (e.key === 'Enter') {
				// If Shift+Enter, allow new line
				if (e.shiftKey) {
					return;
				}

				// Prevent default to avoid unwanted new line
				e.preventDefault();

				if (aiChatLoading && info?.chatQuery?.length) {
					return message.error('Please wait for the AI response');
				}

				if (info?.chatQuery?.trim().length) {
					onSend(info?.chatQuery);
					setInfo((prev) => ({ ...prev, chatQuery: '' }));
				}
			}
		},
		[info?.chatQuery, aiChatLoading, onSend],
	);

	// Add this useEffect for auto-scrolling
	useEffect(() => {
		if (chatContentRef.current) {
			chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
		}
	}, [chatList]); // Scroll whenever chatList changes

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
			<div
				className={`${
					info?.expanded ? 'expandedChatContainer' : ''
				} bottomToolbarChatContainer`}
			>
				<div className="bottomToolBarChatHeader">
					<span>AI Assistant</span>
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<button className="closeButton" onClick={handleChatExpand}>
							<Expand />
						</button>
						<button className="closeButton" onClick={handleClose}>
							<Close />
						</button>
					</div>
				</div>
				<div className="chatContent" ref={chatContentRef}>
					{chatList.map((chat, index) =>
						chat?.content ? (
							chat?.content
						) : (
							<div
								key={index}
								className={`chat-message ${chat.type.toLowerCase()}-message`}
							>
								<div className="message-content">
									<ReactMarkdown>{chat.message}</ReactMarkdown>
								</div>
							</div>
						),
					)}
				</div>
			</div>

			{/* bottom toolBarContent */}
			{!info?.chatModalIsOpen ? (
				<div className="bottomToolbar">
					<textarea
						className={`bottomToolbarInputs ${info.inputExpanded ? 'expanded' : ''}`}
						placeholder="Ask AI"
						onFocus={handleInputFocus}
						value={info?.chatQuery}
						onChange={(e) =>
							setInfo((prev) => ({ ...prev, chatQuery: e.target.value }))
						}
						onKeyDown={handleSendMessageFunc}
						style={{ resize: 'none' }}
						// rows={1}
					/>
					<div className="quickActionsButtons">
						<Home />
					</div>
					<div className="quickActionsButtons">
						<Plus />
					</div>
					<div className="quickActionsButtons">
						<Settings />
					</div>
				</div>
			) : (
				''
			)}
			<ToolBarChatContainerModal
				onClose={handleCloseChatModal}
				modalIsOpen={info?.chatModalIsOpen}
				chatList={chatList}
				onSend={onSend}
				chatQuery={info?.chatQuery}
				onChange={(e) => setInfo((prev) => ({ ...prev, chatQuery: e.target.value }))}
				onKeyDown={handleSendMessageFunc}
				aiChatLoading={aiChatLoading}
			/>
		</div>
	);
};

export default memo(BottomToolbar);
