import React, { memo, useCallback, useState, useRef, useEffect } from 'react';
import '../../../assets/scss/ai_agents/bottomToolbar.scss';
import { ReactComponent as Plus } from '../../../assets/svg/ai_agents/Plus.svg';
import { ReactComponent as Home } from '../../../assets/svg/ai_agents/home.svg';
import { ReactComponent as Settings } from '../../../assets/svg/ai_agents/settings.svg';
import { ReactComponent as Close } from '../../../assets/svg/close.svg';
import { ReactComponent as Expand } from '../../../assets/svg/bottomToolbar/expand.svg';
import ToolBarChatContainerModal from '../modalsV2/ToolBarChatContainerModal';
import { message, Tooltip } from 'antd';
import ReactMarkdown from 'react-markdown';
import { UploadOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';

const getBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
const BottomToolbar = ({
	outerContainerStyle = {},
	chatList = [],
	onSend,
	aiChatLoading,
	handleAiUploadImage,
}) => {
	const [info, setInfo] = useState({
		expanded: false,
		inputExpanded: false,
		chatModalIsOpen: false,
		chatQuery: '',
		position: { x: 0, y: 0 },
	});
	const [previewOpen, setPreviewOpen] = useState(false);
	const [fileList, setFileList] = useState([]);
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
	useEffect(() => {
		if (chatContentRef.current) {
			chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
		}
	}, [chatList]); // Scroll whenever chatList changes

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

	const handleChange = ({ fileList: newFileList }) => {
		handleAiUploadImage(newFileList?.[0]);
	};

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
							<div className={`chat-message ${chat.type.toLowerCase()}-message`}>
								{chat?.content}
							</div>
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
					/>
					<div className="quickActionsButtons">
						<Home />
					</div>
					<div className="quickActionsButtons">
						<Tooltip
							placement="top"
							title={<QuickActionsPlusParentContainer handleChange={handleChange} />}
							color={'#202020'}
							arrow={true}
							trigger="click"
							overlayClassName="quickActionsTooltipContainer"
							// open={info?.threeDotsPopUp?.[index]}
							// onOpenChange={(open) => {
							// 	if (!open) {
							// 		closeThreeDotsPopup(index);
							// 	}
							// }}
						>
							<Plus />
						</Tooltip>
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

const QuickActionsPlusParentContainer = ({ handleChange }) => {
	return (
		<div className="QuickActionsPlusParentContainer">
			<Upload
				// action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
				onChange={handleChange}
				showUploadList={false}
			>
				<button className="quick-action-upload-button">
					<UploadOutlined /> Upload Images
				</button>
			</Upload>
		</div>
	);
};
