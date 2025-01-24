import React, { memo, useCallback, useState, useRef, useEffect, useContext } from 'react';
import '../../../assets/scss/ai_agents/bottomToolbar.scss';
// import { ReactComponent as Plus } from '../../../assets/svg/ai_agents/Plus.svg';
// import { ReactComponent as Home } from '../../../assets/svg/ai_agents/home.svg';
// import { ReactComponent as Settings } from '../../../assets/svg/ai_agents/settings.svg';
import { ReactComponent as Filter } from '../../../assets/svg/ai_agents/filter.svg';
import { ReactComponent as Arroba } from '../../../assets/svg/ai_agents/arroba.svg';
import { ReactComponent as PaperClip } from '../../../assets/svg/ai_agents/paper-clip.svg';
import { ReactComponent as Mic } from '../../../assets/svg/ai_agents/mic.svg';
import { ReactComponent as ExpandChatIcon } from '../../../assets/svg/ai_agents/expand-chat-icon.svg';
import { ReactComponent as Close } from '../../../assets/svg/close.svg';
import { ReactComponent as Expand } from '../../../assets/svg/bottomToolbar/expand.svg';
import ToolBarChatContainerModal from '../modalsV2/ToolBarChatContainerModal';
import { message, Tooltip } from 'antd';
import ReactMarkdown from 'react-markdown';
import { UploadOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import Context from '../../../context/context';
import ObjectID from 'bson-objectid';
import { useLocation } from 'react-router-dom';

const moduleHelper = {
	'/tasks': 'tasks',
};

const chatIcons = [
	{ icon: <Filter />, type: 'filter' },
	{ icon: <Arroba />, type: 'arroba' },
	{ icon: <PaperClip />, type: 'fileUpload' },
	{ icon: <Mic />, type: 'mic' },
];

const BottomToolbar = ({
	outerContainerStyle = {},
	chatList = [],
	onSend,
	aiChatLoading,
	handleAiUploadImage,
	customChatActions = false,
}) => {
	const {
		templates: { handleGlobalChatMessages, globalChatMessages, updateStateValues },
	} = useContext(Context);

	const location = useLocation();
	// console.log(globalChatMessages);
	// console.log(chatList);
	const [info, setInfo] = useState({
		expanded: false,
		inputExpanded: false,
		chatModalIsOpen: false,
		chatQuery: '',
		position: { x: -325, y: 0 },
		addQuickAction: false,
		chatSessionId: ObjectID()?.toString(),
		uploadedFiles: [],
	});

	const toolbarRef = useRef(null);
	const isDraggingRef = useRef(false);
	const startPosRef = useRef({ x: 0, y: 0 });
	const chatContentRef = useRef(null);

	// Add and remove event listeners
	// useEffect(() => {
	// 	document.addEventListener('mousemove', handleMouseMove);
	// 	document.addEventListener('mouseup', handleMouseUp);

	// 	return () => {
	// 		document.removeEventListener('mousemove', handleMouseMove);
	// 		document.removeEventListener('mouseup', handleMouseUp);
	// 	};
	// }, []);
	// Add this useEffect for auto-scrolling
	useEffect(() => {
		if (chatContentRef.current) {
			chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
		}
	}, [chatList]); // Scroll whenever chatList changes

	const handleMouseDown = useCallback(
		(e) => {
			if (e.target?.closest('.quickActionsButtons, input, button')) return;

			isDraggingRef.current = true;
			startPosRef.current = {
				x: e.clientX - info?.position?.x,
				y: e.clientY - info?.position?.y,
			};
		},
		[info?.position],
	);

	// const handleMouseMove = useCallback((e) => {
	// 	if (!isDraggingRef?.current) return;

	// 	const newX = e.clientX - startPosRef?.current?.x;
	// 	const newY = e.clientY - startPosRef?.current?.y;

	// 	setInfo((prev) => ({
	// 		...prev,
	// 		position: { x: newX, y: newY },
	// 	}));
	// }, []);

	const handleMouseUp = useCallback(() => {
		isDraggingRef.current = false;
	}, []);

	//function definitions

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

	const handleInputFocus = useCallback(() => {
		if (globalChatMessages?.length > 1 || chatList?.length > 0) {
			setInfo((prev) => ({
				...prev,
				expanded: true,
				inputExpanded: true,
			}));
		}
	}, [globalChatMessages, chatList]);
	const handleSendMessageFunc = useCallback(
		(e) => {
			if (e.key === 'Enter') {
				// If Shift+Enter, allow new line
				if (e.shiftKey) {
					return;
				}

				if (info?.expanded === false) {
					setInfo((prev) => ({
						...prev,
						expanded: true,
						inputExpanded: true,
					}));
				}

				// Prevent default to avoid unwanted new line
				e.preventDefault();

				if (aiChatLoading && info?.chatQuery?.length) {
					return message.error('Please wait for the AI response');
				}

				if (info?.chatQuery?.trim()?.length) {
					if (customChatActions) {
						onSend(info?.chatQuery);
					} else {
						const payload = {
							query: info?.chatQuery,
							timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
						};

						if (moduleHelper?.[location?.pathname]) {
							payload.module = moduleHelper?.[location?.pathname];
						}
						handleGlobalChatMessages(payload, info?.chatSessionId);
					}

					setInfo((prev) => ({ ...prev, chatQuery: '' }));
				}
			}
		},
		[info?.chatQuery, aiChatLoading, onSend, customChatActions, info?.chatSessionId],
	);

	const handleChange = useCallback(
		({ file }) => {
			handleAiUploadImage(file);
			setInfo((prev) => ({
				...prev,
				addQuickAction: false,
				expanded: true,
				inputExpanded: true,
				uploadedFiles: [...prev?.uploadedFiles, file],
			}));
		},
		[handleAiUploadImage],
	);

	const handleChatIconClick = (e, type) => {
		console.log('reached here 1');

		if (type === 'fileUpload') {
			console.log('reached here');
			const file = e?.target?.files[0] ?? false;
			if (file) {
				handleChange({ file });
			}
		}
	};

	return (
		<div
			ref={toolbarRef}
			className={`bottomToolbarParentWrapper ${info.inputExpanded ? 'expanded' : ''}`}
			style={{
				...outerContainerStyle,
				position: 'fixed',
				transform: `translate(${info?.position?.x}px, ${info?.position?.y}px)`,
				cursor: isDraggingRef?.current ? 'grabbing' : 'grab',
			}}
			onMouseDown={handleMouseDown}
		>
			<div
				className={`${
					info?.expanded ? 'expandedChatContainer' : ''
				} bottomToolbarChatContainer`}
			>
				<div className="bottomToolBarChatHeader">
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<button className="closeButton" onClick={handleChatExpand}>
							<Expand />
						</button>
						<button className="closeButton">
							<ExpandChatIcon />
						</button>
						<button className="closeButton" onClick={handleClose}>
							<Close />
						</button>
					</div>
				</div>
				<div className="chatContent" ref={chatContentRef}>
					{(!customChatActions ? globalChatMessages : chatList).map((chat, index) =>
						chat?.content ? (
							<div
								className={`chat-message ${chat?.type?.toLowerCase()}-message`}
								key={index}
							>
								{chat?.content}
							</div>
						) : (
							<div
								key={index}
								className={`chat-message ${chat?.type?.toLowerCase()}-message`}
							>
								<div className="message-content">
									<ReactMarkdown>{chat?.message}</ReactMarkdown>
								</div>
							</div>
						),
					)}
				</div>
			</div>

			{/* bottom toolBarContent */}
			{!info?.chatModalIsOpen ? (
				<div className={`bottomToolbar ${info?.expanded ? 'update-border-radius' : ''}`}>
					{info?.uploadedFiles?.length > 0 && (
						<div className="uploaded-files-container">
							{info?.uploadedFiles?.map((file) => (
								<div key={file?.id} className="uploaded-file-item">
									<img
										src={URL.createObjectURL(file)}
										alt={file?.name}
										className="uploaded-file-preview"
										onLoad={(e) => URL.revokeObjectURL(e.target.src)} // Clean up object URL after loading
									/>
									<div className="uploaded-file-name">{file?.name}</div>
								</div>
							))}
						</div>
					)}
					<textarea
						className={`bottomToolbarInputs ${info?.inputExpanded ? 'expanded' : ''}`}
						placeholder="Hey! Need help? Ask me anything."
						value={info?.chatQuery}
						onChange={(e) =>
							setInfo((prev) => ({ ...prev, chatQuery: e?.target?.value }))
						}
						onFocus={handleInputFocus}
						onKeyDown={handleSendMessageFunc}
					/>
					<div className="chat-icons-container">
						{chatIcons?.map((chatIcon, idx) => (
							<span
								className="icon-container"
								{...(chatIcon?.type !== 'fileUpload' && {
									onClick: (e) => handleChatIconClick(e, chatIcon?.type),
								})}
								key={idx}
							>
								{chatIcon?.type === 'fileUpload' && (
									<span className="file-upload-container">
										<input
											type="file"
											accept=".pdf,.docx,.md,.txt,.jpg,.jpeg,.png,.json"
											className="file-upload"
											onChange={(e) => handleChatIconClick(e, chatIcon?.type)}
										/>
									</span>
								)}
								{chatIcon?.icon}
							</span>
						))}
					</div>
					{/* <div className="quickActionsButtons">
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
							open={info?.addQuickAction}
							onOpenChange={(open) => {
								// if (!open) {
								setInfo((prev) => ({ ...prev, addQuickAction: open }));
								// }
							}}
						>
							<Plus />
						</Tooltip>
					</div>
					<div className="quickActionsButtons">
						<Settings />
					</div> */}
				</div>
			) : (
				''
			)}
			<ToolBarChatContainerModal
				onClose={handleCloseChatModal}
				modalIsOpen={info?.chatModalIsOpen}
				chatList={!customChatActions ? globalChatMessages : chatList}
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
				onChange={handleChange}
				showUploadList={false}
				beforeUpload={() => false} // Prevent default upload behavior
				maxCount={1} // Allow only one file at a time
				accept="image/*" // Accept only images
			>
				<button className="quick-action-upload-button">
					<UploadOutlined /> Upload Images
				</button>
			</Upload>
		</div>
	);
};
