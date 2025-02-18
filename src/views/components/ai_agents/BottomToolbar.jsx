import React, { memo, useCallback, useState, useRef, useEffect, useContext, useMemo } from 'react';
import '../../../assets/scss/ai_agents/bottomToolbar.scss';
import { ReactComponent as Plus } from '../../../assets/svg/ai_agents/Plus.svg';
import { ReactComponent as Home } from '../../../assets/svg/ai_agents/home.svg';
import { ReactComponent as Settings } from '../../../assets/svg/ai_agents/settings.svg';
import { ReactComponent as Close } from '../../../assets/svg/close.svg';
import { ReactComponent as Expand } from '../../../assets/svg/bottomToolbar/expand.svg';

import { ReactComponent as ArrowUp } from '../../../assets/svg/ai_agents/arrow-up.svg';
import { Alert, Image, message, Spin, Tooltip } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import Context from '../../../context/context';
import ObjectID from 'bson-objectid';
import { useLocation, useNavigate } from 'react-router-dom';
// import Markdown from 'react-markdown';
// import { TypingEffect } from '../../../helpers/markdownHelper';
// import { ReactComponent as AiStarInChat } from '../../../assets/svg/ai_agents/ai-star-in-chat.svg';
import { ReactComponent as Filter } from '../../../assets/svg/ai_agents/filter.svg';
import { ReactComponent as Arroba } from '../../../assets/svg/ai_agents/arroba.svg';
import { ReactComponent as PaperClip } from '../../../assets/svg/ai_agents/paper-clip.svg';
import { ReactComponent as Mic } from '../../../assets/svg/ai_agents/mic.svg';
import { getBase64 } from '../../../helpers';
import WorkflowSlugSelector from '../calendar/WorkflowSlugSelector';
import { ReactComponent as AiSparkel } from '../../../assets/svg/calendar/aiSparkel.svg';
import useVoiceIntegration from '../../hooks/useVoiceIntegration';
import ChatBox from '../homePage/ChatBox';

const moduleHelper = {
	tasks: 'tasks',
	'smart-file': 'form_filling',
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
	useEffect(() => {
		if (chatContentRef.current) {
			chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
		}
	}, [chatList]); // Scroll whenever chatList changes

	useEffect(() => {
		if (currentSessionId) {
			setInfo((prev) => ({ ...prev, chatSessionId: currentSessionId }));
		} else {
			updateStateValues({ currentSessionId: ObjectID().toString() });
		}
	}, [currentSessionId]);

	useEffect(() => {
		if (activePromptForChat) {
			setInfo((prev) => ({
				...prev,
				// chatQuery: activePromptForChat,
				chatModalIsOpen: true,
				showFullPage: true,
			}));
			handleSendMessageFunc(null, true, activePromptForChat);
			updateStateValues({ activePromptForChat: null });
		}
	}, [activePromptForChat]);
	const toggleFullPage = useCallback(() => {
		setInfo((prev) => ({ ...prev, showFullPage: !prev.showFullPage }));
	}, [info]);

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

	// const handleClose = useCallback(() => {
	// 	setInfo((prev) => ({
	// 		...prev,
	// 		expanded: false,
	// 		inputExpanded: false,
	// 	}));
	// }, [info]);

	// const handleChatExpand = useCallback(() => {
	// 	setInfo((prev) => ({
	// 		...prev,
	// 		chatModalIsOpen: true,
	// 		expanded: false,
	// 		inputExpanded: false,
	// 	}));
	// }, []);

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
		async (e, click = null, query = null) => {
			if (e?.key === 'Enter' || click) {
				// If Shift+Enter, allow new line
				if (e?.shiftKey) {
					return;
				}
				// Prevent default to avoid unwanted new line
				e?.preventDefault();
				navigate('/chat');

				if (
					(aiChatLoading || info?.chatLoading) &&
					(info?.chatQuery?.length || info?.uploadedImages?.length)
				) {
					return message.error('Please wait for the AI response');
				}

				if (!checkAllUploadLoadingStatus()) {
					return message.error('Please wait for the images to upload');
				}

				if (
					info?.chatQuery?.trim().length ||
					info?.uploadedImages?.length ||
					query?.trim()?.length
				) {
					if (customChatActions) {
						onSend(info?.chatQuery);
					} else {
						setInfo((prev) => ({ ...prev, chatLoading: true }));
						let currentQuery = info?.chatQuery?.trim() || query?.trim();
						const payload = {
							query: currentQuery,
							timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
							knowledge_base_search: true,
							web_search: true,
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
							payload.modules = [moduleHelper?.[location?.pathname?.split('/')?.[1]]];
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
								handleVariablesRequired(variables_required, currentQuery);
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
		async (data, query) => {
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
				query: query,
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
					handleVariablesRequired(variables_required, data);
				}
			}
		},
		[info],
	);

	const handleVariablesRequired = useCallback(
		(requiredVariables, query) => {
			if (requiredVariables?.[0] === 'workflow_slug') {
				let workflowSlug = [
					{
						type: 'AI',
						message: 'Please select a workflow to continue',
						content: (
							<WorkflowSlugSelector
								handleWorkflowSlugSelection={handleWorkflowSlugSelection}
								query={query}
							/>
						),
					},
				];

				updateApplicationChat(workflowSlug);
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
				return message.error(response?.[1] || 'failed to upload image');
			}
			const { _id } = response?.[1] || {};
			file.fileId = _id;
			uploadedImages.splice(file?.uniqueId, 1, file);
			setInfo((prev) => ({ ...prev, uploadedImages }));
			checkIndividualImageUploadedStatusFunc(file, uploadBatchId);
		},
		[info],
	);

	const checkIndividualImageUploadedStatusFunc = useCallback(
		async (fileData, uploadBatchId) => {
			let uploadedImages = [...info?.uploadedImages];
			let uploadedCount = 0,
				maxAttempts = 15,
				errorCount = 0,
				successCount = 0;
			while (!(uploadedCount && successCount) && maxAttempts) {
				const response = await checkIndividualImageUploadedStatus(uploadBatchId);
				if (response?.[0]) {
					uploadedCount = response?.[1]?.uploadedCount;
					errorCount = response?.[1]?.errorCount;
					successCount = response?.[1]?.successCount;
					if (uploadedCount && successCount) {
						break;
					}
					if (errorCount) {
						break;
					}
				}
				//dealying the check
				await new Promise((resolve) => setTimeout(resolve, 1000));
				maxAttempts--;
			}
			if (errorCount) {
				uploadedImages.splice(fileData?.uniqueId, 1);
				setInfo((prev) => ({ ...prev, uploadedImages }));
				return message.error('Something went wrong while processing the image');
			}
			if (uploadedCount && uploadedCount > 0) {
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
			deleteUploadedImageThroughChat(ele?.fileId);
		},
		[info],
	);

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
			<Mic onClick={handleMicIconClick} />,
		],
		[info, handleChange],
	);

	const handleSmallToolbarClick = () => {
		setInfo((prev) => ({
			...prev,
			bigToolbarIsOpen: true,
		}));
	};

	const handleSendBtnClick = (e) => {
		if (info?.chatQuery?.trim()?.length > 0) {
			handleSendMessageFunc(e, true);
			navigate('/chat');
		}
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
			{!info?.chatModalIsOpen && info?.uploadedImages?.length ? (
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
					<ChatBox />
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
