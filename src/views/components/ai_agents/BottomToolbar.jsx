import React, { memo, useCallback, useState, useRef, useEffect, useContext, useMemo } from 'react';
import '../../../assets/scss/ai_agents/bottomToolbar.scss';
import { ReactComponent as Plus } from '../../../assets/svg/ai_agents/Plus.svg';
import { ReactComponent as Home } from '../../../assets/svg/ai_agents/home.svg';
import { ReactComponent as Settings } from '../../../assets/svg/ai_agents/settings.svg';
import { ReactComponent as Close } from '../../../assets/svg/close.svg';
import { ReactComponent as Expand } from '../../../assets/svg/bottomToolbar/expand.svg';
import ToolBarChatContainerModal from '../modalsV2/ToolBarChatContainerModal';
import { Alert, Image, message, Spin, Tooltip } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import Context from '../../../context/context';
import ObjectID from 'bson-objectid';
import { useLocation } from 'react-router-dom';
import Markdown from 'react-markdown';
import { TypingEffect } from '../../../helpers/markdownHelper';
import { ReactComponent as AiStarInChat } from '../../../assets/svg/ai_agents/ai-star-in-chat.svg';
import { ReactComponent as Filter } from '../../../assets/svg/ai_agents/filter.svg';
import { ReactComponent as Arroba } from '../../../assets/svg/ai_agents/arroba.svg';
import { ReactComponent as PaperClip } from '../../../assets/svg/ai_agents/paper-clip.svg';
import { ReactComponent as Mic } from '../../../assets/svg/ai_agents/mic.svg';
import { getBase64 } from '../../../helpers';
import WorkflowSlugSelector from '../calendar/WorkflowSlugSelector';
import { ReactComponent as AiSparkel } from '../../../assets/svg/calendar/aiSparkel.svg';

const moduleHelper = {
	tasks: 'tasks',
	'smart-file': 'proposal_form_filling',
	calendar: 'calendar',
};

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
		},
		calendarInfo: { updateCalendarState },
		tasks: { updateTaskState },
	} = useContext(Context);

	const location = useLocation();

	const [info, setInfo] = useState({
		expanded: false,
		inputExpanded: false,
		chatModalIsOpen: false,
		chatQuery: '',
		position: { x: -325, y: 0 },
		addQuickAction: false,
		chatSessionId: ObjectID().toString(),
		uploadedImages: [],
		chatLoading: false,
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
			inputExpanded: false,
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

	const handlePreview = async (file) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		setPreviewImage(file.url || file.preview);
		setPreviewOpen(true);
	};

	const handleSendMessageFunc = useCallback(
		async (e) => {
			if (e.key === 'Enter') {
				// If Shift+Enter, allow new line
				if (e.shiftKey) {
					return;
				}
				// Prevent default to avoid unwanted new line
				e.preventDefault();

				if (
					(aiChatLoading || info?.chatLoading) &&
					(info?.chatQuery?.length || info?.uploadedImages?.length)
				) {
					return message.error('Please wait for the AI response');
				}

				if (!checkAllUploadLoadingStatus()) {
					return message.error('Please wait for the images to upload');
				}

				if (info?.chatQuery?.trim().length || info?.uploadedImages?.length) {
					if (customChatActions) {
						onSend(info?.chatQuery);
					} else {
						setInfo((prev) => ({ ...prev, chatLoading: true }));
						const payload = {
							query: info?.chatQuery,
							timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
						};
						let localPayload = {};
						if (info?.uploadedImages?.length) {
							payload.files = info?.uploadedImages?.map(
								(ele) => ele?.name || 'Untitled Image',
							);

							localPayload = {
								files: info?.uploadedImages || [],
								handlePreview,
							};
						}
						if (activeWorkflowSlugForSmartFile) {
							payload.workflow_slug = activeWorkflowSlugForSmartFile;
						}

						if (moduleHelper?.[location?.pathname?.split('/')?.[1]]) {
							payload.module = moduleHelper?.[location?.pathname?.split('/')?.[1]];
						}
						setInfo((prev) => ({ ...prev, uploadedImages: [], chatQuery: '' }));

						const response = await handleGlobalChatMessages(
							payload,
							info?.chatSessionId,
							localPayload,
						);
						setInfo((prev) => ({ ...prev, chatLoading: false }));
						if (response?.[0]) {
							const { db_updates, variables_required } = response?.[1];
							if (db_updates?.calendar_db_update) {
								updateCalendarState({ refetchCalendarState: true });
							}
							if (db_updates?.task_db_update) {
								updateTaskState({ refetchTasks: true });
							}
							if (db_updates?.proposal_db_update) {
								updateStateValues({ smartFileRefetch: true });
							}
							if (variables_required) {
								handleVariablesRequired(variables_required);
							}
						}
					}

					// setInfo((prev) => ({ ...prev, chatQuery: '', uploadedImages: [] }));
				}
			}
		},
		[aiChatLoading, onSend, customChatActions, info, activeWorkflowSlugForSmartFile],
	);

	const handleWorkflowSlugSelection = useCallback(
		async (data) => {
			setInfo((prev) => ({ ...prev, chatLoading: true }));
			const showCustomChatOptions = [
				{
					type: 'AI',
					message: 'loading....',
					content: (
						<div className="aiMessageWrapper">
							<AiSparkel />
							<div className="aiMessage">
								<span>Thinking...</span>
							</div>
						</div>
					),
					contentType: 'loading',
				},
			];

			const payload = {
				query: `the workflow slug is ${data}`,
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
				workflow_slug: data,
			};
			const localPayload = {
				showCustomChatOptions,
			};
			if (moduleHelper?.[location?.pathname?.split('/')?.[1]]) {
				payload.module = moduleHelper?.[location?.pathname?.split('/')?.[1]];
			}
			const response = await handleGlobalChatMessages(
				payload,
				info?.chatSessionId,
				localPayload,
			);
			setInfo((prev) => ({ ...prev, chatLoading: false }));
			if (response?.[0]) {
				const { db_updates, variables_required } = response?.[1];
				if (db_updates?.calendar_db_update) {
					updateCalendarState({ refetchCalendarState: true });
				}
				if (db_updates?.task_db_update) {
					updateTaskState({ refetchTasks: true });
				}
				if (variables_required) {
					handleVariablesRequired(variables_required);
				}
			}
		},
		[info],
	);

	const handleVariablesRequired = useCallback(
		(requiredVariables) => {
			if (requiredVariables?.[0] === 'workflow_slug') {
				let workflowSlug = [
					{
						type: 'AI',
						message: 'Please select a workflow to continue',
						content: (
							<WorkflowSlugSelector
								handleWorkflowSlugSelection={handleWorkflowSlugSelection}
							/>
						),
					},
				];
				updateStateValues({ globalChatMessages: [...globalChatMessages, ...workflowSlug] });
			}
		},
		[info, handleWorkflowSlugSelection, globalChatMessages],
	);

	const handleGlobalImageProcessing = useCallback(
		async (file) => {
			const uploadBatchId = ObjectID().toString();
			const payload = {
				sessionId: info?.chatSessionId,
				originalFileName: file?.name || 'Untitled file',
				uploadBatchId,
			};
			const response = await handleGlobalUploadImage(file, payload);
			let uploadedImages = [...info?.uploadedImages];
			if (!response?.[0]) {
				uploadedImages.splice(file?.uniqueId, 1);
				setInfo((prev) => ({ ...prev, uploadedImages }));
				return message.error(response?.[1]);
			}
			checkIndividualImageUploadedStatusFunc(file, uploadBatchId);
		},
		[info],
	);

	const checkIndividualImageUploadedStatusFunc = useCallback(
		async (fileData, uploadBatchId) => {
			let uploadedCount = 0,
				maxAttempts = 15;
			while (!uploadedCount && maxAttempts) {
				const response = await checkIndividualImageUploadedStatus(uploadBatchId);
				if (response?.[0]) {
					uploadedCount = response?.[1]?.uploadedCount;
					if (uploadedCount) {
						break;
					}
				}
				//dealying the check
				await new Promise((resolve) => setTimeout(resolve, 1000));
				maxAttempts--;
			}
			if (uploadedCount && uploadedCount > 0) {
				let uploadedImages = [...info?.uploadedImages];
				fileData.loading = false;
				uploadedImages.splice(fileData?.uniqueId, 1, fileData);
				setInfo((prev) => ({ ...prev, uploadedImages }));
			}
		},
		[info],
	);

	const handleChange = useCallback(
		async ({ file }) => {
			let uploadedImages = [...(info?.uploadedImages || [])];
			file.preview = await getBase64(file);
			file.loading = true;
			file.uniqueId = uploadedImages?.length;
			uploadedImages.push(file);
			if (customChatActions) {
				handleAiUploadImage(file);
			} else {
				handleGlobalImageProcessing(file);
			}

			setInfo((prev) => ({
				...prev,
				// addQuickAction: false,
				expanded: true,
				inputExpanded: true,
				uploadedImages,
			}));
		},
		[handleAiUploadImage, info],
	);

	const checkAllUploadLoadingStatus = useCallback(() => {
		const uploadedImages = [...(info?.uploadedImages || [])];
		for (let i = 0; i < uploadedImages?.length; i++) {
			if (uploadedImages[i]?.loading) {
				return false;
			}
		}
		return true;
	}, [info]);

	const handleRemoveImage = useCallback(
		(ele) => {
			const uploadedImages = [...(info?.uploadedImages || [])];
			uploadedImages.splice(ele?.uniqueId, 1);
			setInfo((prev) => ({ ...prev, uploadedImages }));
		},
		[info],
	);

	const chatIcons = useMemo(
		() => [
			<Filter />,
			<Arroba />,
			<Upload
				onChange={handleChange}
				showUploadList={false}
				beforeUpload={() => false} // Prevent default upload behavior
				maxCount={1} // Allow only one file at a time
				// accept="image/*" // Accept only images
				accept=".pdf,.docx,.txt,.md,.json,.png,.jpg,.jpeg"
			>
				<PaperClip />
			</Upload>,
			<Mic />,
		],
		[info, handleChange],
	);

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
					{(!customChatActions ? globalChatMessages : chatList).map((chat, index) =>
						chat?.content ? (
							<div
								className={`chat-message ${chat.type.toLowerCase()}-message`}
								key={index}
							>
								{chat?.content}
							</div>
						) : (
							<div
								key={index}
								className={`chat-message ${chat.type.toLowerCase()}-message`}
							>
								{chat?.type?.toLowerCase() === 'ai' && <AiStarInChat />}
								<div className="message-content">
									{chat?.type?.toLowerCase() === 'ai' ? (
										<TypingEffect text={chat?.message} />
									) : (
										<Markdown>{chat?.message}</Markdown>
									)}
								</div>
							</div>
						),
					)}
				</div>
				{info?.uploadedImages?.length ? (
					<div className="imagePreviewBar">
						{info?.uploadedImages?.map((ele, index) => (
							<div className="previewOfUploadedImage" key={index}>
								<img
									src={ele?.preview}
									alt="uploaded"
									width={'100%'}
									height={'100%'}
									style={{ objectFit: 'cover', borderRadius: '12px' }}
									onClick={() => handlePreview(ele)}
								/>

								{ele?.loading ? (
									<div className="spinContainerLoaderForPreview">
										<Spin />
									</div>
								) : (
									<span
										className="removeImageIcon"
										onClick={() => handleRemoveImage(ele)}
									>
										<Close />
									</span>
								)}
							</div>
						))}
					</div>
				) : (
					''
				)}
			</div>

			{/* bottom toolBarContent */}
			{!info?.chatModalIsOpen ? (
				<div className={`bottomToolbar ${info.inputExpanded ? 'expandedBtnToolbar' : ''}`}>
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
					{/* <div className="bottomToolbarButtons">
						<div className="quickActionsButtons">
							<Home />
						</div>
						<div className="quickActionsButtons">
							<Tooltip
								placement="top"
								title={
									<QuickActionsPlusParentContainer handleChange={handleChange} />
								}
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
						</div>
					</div> */}

					<div className="chat-icons-container">
						{chatIcons?.map((icon, idx) => (
							<span key={idx} className="chat-icon">
								{icon}
							</span>
						))}
					</div>
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
			{previewImage && (
				<Image
					wrapperStyle={{
						display: 'none',
					}}
					preview={{
						visible: previewOpen,
						onVisibleChange: (visible) => setPreviewOpen(visible),
						afterOpenChange: (visible) => !visible && setPreviewImage(''),
					}}
					src={previewImage}
				/>
			)}
		</div>
	);
};

export default memo(BottomToolbar);

// const QuickActionsPlusParentContainer = ({ handleChange }) => {
// 	return (
// 		<div className="QuickActionsPlusParentContainer">
// 			<Upload
// 				onChange={handleChange}
// 				showUploadList={false}
// 				beforeUpload={() => false} // Prevent default upload behavior
// 				maxCount={1} // Allow only one file at a time
// 				accept="image/*" // Accept only images
// 			>
// 				<button className="quick-action-upload-button">
// 					<UploadOutlined /> Upload Images
// 				</button>
// 			</Upload>
// 		</div>
// 	);
// };
