import React, { memo, useCallback, useState, useRef, useEffect, useContext, useMemo } from 'react';
import '../../../assets/scss/home_page/chatbox.scss';
import { ReactComponent as Close } from '../../../assets/svg/close.svg';
import { ReactComponent as ArrowUp } from '../../../assets/svg/ai_agents/arrow-up-dark.svg';
import { ReactComponent as ChevronSvg } from '../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as MicroscopeLightSvg } from '../../../assets/svg/ai_agents/microscope-light.svg';
import { ReactComponent as MicroscopeDarkSvg } from '../../../assets/svg/ai_agents/microscope-dark.svg';
import { ReactComponent as WebDarkSvg } from '../../../assets/svg/ai_agents/web-dark.svg';
import { ReactComponent as CloseSvg } from '../../../assets/svg/calendar/close.svg';
import { ReactComponent as BuildingDarkSvg } from '../../../assets/svg/ai_agents/building-dark.svg';
import { ReactComponent as TextSvg } from '../../../assets/svg/ai_agents/text.svg';
import { ReactComponent as DocxSvg } from '../../../assets/svg/ai_agents/docx.svg';
import { ReactComponent as JsonSvg } from '../../../assets/svg/ai_agents/json.svg';
import { ReactComponent as PdfSvg } from '../../../assets/svg/ai_agents/pdf.svg';
import { ReactComponent as JpgSvg } from '../../../assets/svg/ai_agents/jpg.svg';
import { ReactComponent as PngSvg } from '../../../assets/svg/ai_agents/png.svg';
import { ReactComponent as MdSvg } from '../../../assets/svg/ai_agents/md.svg';
import { ReactComponent as AudioSvg } from '../../../assets/svg/ai_agents/audio.svg';
import { ReactComponent as LLMSvg } from '../../../assets/svg/ai_agents/llm.svg';
import Context from '../../../context/context';
import ObjectID from 'bson-objectid';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as Filter } from '../../../assets/svg/my_templates/filter.svg';
import { ReactComponent as PaperClip } from '../../../assets/svg/ai_agents/paper-clip.svg';
import { getBase64 } from '../../../helpers';
import WorkflowSlugSelector from '../../components/calendar/WorkflowSlugSelector';
import useVoiceIntegration from '../../hooks/useVoiceIntegration';
import SearchDropdown from '../chat/SearchDropdown';
import UploadFileTooltip from '../chat/UploadFileTooltip';
import DateRangeDropdown from '../chat/DateRangeDropdown';
import moment from 'moment';
import Voice from '../chat/Voice';
import Skeleton from 'react-loading-skeleton';
import { message, Image, Spin, Tooltip } from 'antd';
import LLMTooltip from '../chat/LLMTooltip';

const moduleHelper = {
	tasks: 'tasks',
	'smart-file': 'form_filling',
	calendar: 'calendar',
};

const initialChatFilters = {
	modules: {},
	integrations: {},
	dateRange: null,
};

const integrationsOptions = {
	meeting: 'Meeting',
	notion: 'Notion',
	'q&a': 'Q & A',
	website: 'Website',
};

const modulesOptions = {
	calendar: 'Calendar',
	tasks: 'Tasks',
	// storage: 'Storage',
	// gallery: 'Gallery',
	clients: 'Clients',
};

const resetChatInfo = {
	webSearch: false,
	workspaceSearch: false,
};
const fileTypeIcons = {
	docx: <DocxSvg />,
	txt: <TextSvg />,
	png: <PngSvg />,
	pdf: <PdfSvg />,
	jpg: <JpgSvg />,
	json: <JsonSvg />,
	md: <MdSvg />,
	jpeg: <JpgSvg />,
};

const ChatBox = ({
	outerContainerStyle = {},
	chatList = [],
	onSend,
	aiChatLoading,
	handleAiUploadImage,
	customChatActions = false,
	showChatLabels = true,
	uploadedImages = [],
	handleSendWebsocketMessage,
	latestStreamMesage,
	lastQuery,
	toggleLatestStreamMessage,
	chatToNoteLoopOn = false,
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
			handleStreamSendMessage,
			activePayloadForChat,
			followUpQuery,
			chatInfo,
		},
		calendarInfo: { updateCalendarState },
		tasks: { updateTaskState },
		documentPreview: { noteContent, setNoteContent },
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

	const navigate = useNavigate();
	const location = useLocation();

	const [info, setInfo] = useState({
		expanded: false,
		inputExpanded: false,
		bigToolbarIsOpen: false,
		chatQuery: '',
		position: { x: window.innerWidth / 2 - 900, y: 0 },
		addQuickAction: false,
		chatSessionId: null,
		uploadedImages: uploadedImages,
		chatLoading: false,
		showFullPage: true,
		voiceIntegration: false,
		noteModalIsOpen: false,
		citationsModalIsOpen: false,
		filtersEnabled: false,
		isUploadFileOpen: false,
		showFilters: false,
		chatFilters: initialChatFilters,
		isIntegrationsDropdownOpen: false,
		isModulesDropdownOpen: false,
		recentFiles: [],
		isVoiceMuted: false,
		followUpQuery: null,
		isLLMModelOpen: false,
	});

	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const textAreaRef = useRef(null);

	useEffect(() => {
		if (activePromptForChat) {
			handleSendMessageFunc(null, true, activePromptForChat);
			updateStateValues({ activePromptForChat: null });
		}
	}, [activePromptForChat]);

	useEffect(() => {
		if (activePayloadForChat) {
			setInfo((prev) => ({ ...prev, chatLoading: true }));
			const { payload, localPayload, currentQuery } = activePayloadForChat;
			if (handleSendWebsocketMessage) {
				handleSendWebsocketMessage(payload, currentQuery);
			}

			handleStreamSendMessage(payload, localPayload, currentQuery);
			updateStateValues({ activePayloadForChat: null });
		}
	}, [activePayloadForChat]);

	useEffect(() => {
		if (currentSessionId) {
			setInfo((prev) => ({ ...prev, chatSessionId: currentSessionId }));
		} else {
			updateStateValues({ currentSessionId: ObjectID().toString() });
		}
	}, [currentSessionId]);

	useEffect(() => {
		if (followUpQuery) {
			setInfo((prev) => ({
				...prev,
				followUpQuery,
			}));
			updateStateValues({ followUpQuery: null });
		}
	}, [followUpQuery]);

	useEffect(() => {
		if (latestStreamMesage && lastQuery) {
			const { db_updates, variables_required, deep_research } = latestStreamMesage;
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
				handleVariablesRequired(variables_required, lastQuery);
			}
			if (deep_research) {
				updateStateValues({
					chatInfo: {
						...chatInfo,
						deepResearch: false,
					},
				});
			}

			if (toggleLatestStreamMessage) {
				toggleLatestStreamMessage();
			}
			setInfo((prev) => ({ ...prev, chatLoading: false }));
		}
	}, [latestStreamMesage]);

	const handlePreview = async (file) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		setPreviewImage(file.url || file.preview);
		setPreviewOpen(true);
	};

	const handleWebSearchClick = () => {
		if (chatInfo?.deepResearch) return;
		updateStateValues({
			chatInfo: {
				...chatInfo,
				webSearch: !chatInfo?.webSearch,
			},
		});
	};

	const handleDeepResearchClick = () => {
		if (!chatInfo?.deepResearch) {
			updateStateValues({
				chatInfo: {
					...chatInfo,
					...resetChatInfo,
					deepResearch: true,
				},
			});
			setInfo((prev) => ({
				...prev,
				isLLMModelOpen: false,
				isUploadFileOpen: false,
				showFilters: false,
				chatFilters: initialChatFilters,
				recentFiles: [],
			}));
		} else {
			updateStateValues({
				chatInfo: {
					...chatInfo,
					deepResearch: false,
				},
			});
		}
	};

	const handleShowFiltersClick = () => {
		if (chatInfo?.deepResearch) return;
		setInfo((prev) => ({
			...prev,
			showFilters: true,
		}));
	};

	const handleHideFiltersClick = () => {
		setInfo((prev) => ({
			...prev,
			showFilters: false,
		}));
	};

	const handleResetFiltersClick = () => {
		setInfo((prev) => ({
			...prev,
			chatFilters: initialChatFilters,
		}));
	};

	const handleRecentFileClick = (file) => {
		const isFileAlreadyPresent = info?.recentFiles?.some((ele) => ele?._id === file?._id);

		if (isFileAlreadyPresent) {
			setInfo((prev) => ({
				...prev,
				recentFiles: prev?.recentFiles?.filter((ele) => ele?._id !== file?._id),
			}));
		} else {
			setInfo((prev) => ({
				...prev,
				recentFiles: [...prev?.recentFiles, file],
			}));
		}
	};

	const handleRemoveFileFromRecentFileClick = (file) => {
		const updatedRecentFiles = info?.recentFiles?.filter((ele) => ele?._id !== file?._id);
		setInfo((prev) => ({
			...prev,
			recentFiles: updatedRecentFiles,
		}));
	};

	const handleIntegrationsOptionClick = (key) => {
		let currentIntegrations = { ...info?.chatFilters?.integrations };
		if (currentIntegrations[key]) {
			delete currentIntegrations[key];
		} else {
			currentIntegrations[key] = integrationsOptions[key];
		}
		setInfo((prev) => ({
			...prev,
			chatFilters: {
				...prev?.chatFilters,
				integrations: currentIntegrations,
			},
		}));
	};

	const handleSearchTypeChange = (type, value) => {
		setInfo((prev) => ({
			...prev,
			searchType: { ...prev?.searchType, [type]: value },
		}));
	};
	const handleModulesOptionClick = (key) => {
		let currentModules = { ...info?.chatFilters?.modules };
		if (currentModules[key]) {
			delete currentModules[key];
		} else {
			currentModules[key] = modulesOptions[key];
		}
		setInfo((prev) => ({
			...prev,
			chatFilters: {
				...prev?.chatFilters,
				modules: currentModules,
			},
		}));
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

				if (
					(aiChatLoading || info?.chatLoading) &&
					(info?.chatQuery?.length < 0 || info?.uploadedImages?.length)
				) {
					return message.error('Please wait for the AI response');
				}

				if (!checkAllUploadLoadingStatus()) {
					return message.error('Please wait for the images to upload');
				}

				if (info?.chatQuery?.trim()?.length > 0 || query?.trim()?.length > 0) {
					setInfo((prev) => ({ ...prev, chatLoading: true }));
					let currentQuery = info?.chatQuery?.trim() || query?.trim();

					const date =
						info?.chatFilters?.dateRange?.length > 0
							? [
									moment(info?.chatFilters?.dateRange[0])?.unix(),
									moment(info?.chatFilters?.dateRange[1])?.unix(),
							  ]
							: [];

					if (info?.recentFiles?.length > 0) {
						query =
							currentQuery +
							',' +
							info?.recentFiles?.map((ele) => ele?.originalFileName).join(',');
					} else {
						query = currentQuery;
					}

					const payload = {
						query,
						timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
						knowledge_base_search: chatInfo?.workspaceSearch,
						web_search: chatInfo?.webSearch,
						modules: Object?.keys(info?.chatFilters?.modules),
						date: date,
						deep_research: chatInfo?.deepResearch,
					};

					if (moduleHelper?.[location?.pathname?.split('/')?.[1]]) {
						payload.screen = moduleHelper[location?.pathname?.split('/')?.[1]];
					}
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

					if (!chatInfo?.webSearch && !chatInfo?.workspaceSearch) {
						payload.selected_model = chatInfo?.selectedLLMModel;
					}

					setInfo((prev) => ({
						...prev,
						uploadedImages: [],
						chatQuery: '',
						recentFiles: [],
						chatFilters: initialChatFilters,
					}));

					clearTextArea();

					if (customChatActions) {
						return onSend({ payload, localPayload, currentQuery });
					}
					handleStreamSendMessage(payload, localPayload, currentQuery);
					if (handleSendWebsocketMessage) {
						if (info?.recentFiles?.length > 0) {
							if (payload?.files && payload.files?.length > 0) {
								payload.files = [
									...payload.files,
									...info?.recentFiles?.map((ele) => ele?.originalFileName),
								];
							} else {
								payload.files = info?.recentFiles?.map(
									(ele) => ele?.originalFileName,
								);
							}
						}
						handleSendWebsocketMessage(payload, currentQuery);
					}
				}
			}
		},
		[
			aiChatLoading,
			onSend,
			customChatActions,
			chatToNoteLoopOn,
			info,
			chatInfo,
			activeWorkflowSlugForSmartFile,
		],
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
							<Skeleton height={20} width={'100%'} borderRadius={'100px'} />
							<Skeleton height={20} width={'75%'} borderRadius={'100px'} />
							<Skeleton height={20} width={'50%'} borderRadius={'100px'} />
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

			setInfo((prev) => ({ ...prev, chatLoading: false }));
			handleSendWebsocketMessage(payload, '');
			handleStreamSendMessage(payload, localPayload, '');
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

			handleGlobalImageProcessing(file);

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
				setInfo((prev) => ({ ...prev, voiceIntegration: true }));
			} else {
				toggleMute();
			}
			event.stopPropagation();
		},

		[info, connectToRoom],
	);

	const handleToggleMute = useCallback(
		(event) => {
			toggleMute();
			event.stopPropagation();
			setInfo((prev) => ({ ...prev, isVoiceMuted: !prev?.isVoiceMuted }));
		},
		[toggleMute],
	);

	const handleDisConnect = useCallback(
		(event) => {
			disconnect();
			setInfo((prev) => ({ ...prev, voiceIntegration: false, isVoiceMuted: false }));
			event.stopPropagation();
		},
		[info],
	);

	const handleSendBtnClick = (e) => {
		if (info?.chatQuery?.trim()?.length > 0) {
			handleSendMessageFunc(e, true);
		}
	};

	const handleTextAreaChange = (e) => {
		const textArea = textAreaRef?.current;
		if (textArea) {
			textArea.style.height = 'auto';
			textArea.style.height = textArea.scrollHeight + 'px';
		}
		setInfo((prev) => ({
			...prev,
			chatQuery: e.target.value,
		}));
	};

	const clearTextArea = () => {
		const textArea = textAreaRef?.current;
		if (textArea) {
			textArea.style.height = '34px'; // Reset to initial min-height
		}
	};

	const handleFollowUpQueryClick = () => {
		if (info?.chatLoading) {
			return;
		}
		setInfo((prev) => ({
			...prev,
			followUpQuery: null,
		}));
		updateStateValues({ activePromptForChat: info?.followUpQuery });
	};

	const handleLLMModelOptionClick = (model) => {
		updateStateValues({
			chatInfo: {
				...chatInfo,
				selectedLLMModel: model?.model_code,
			},
		});
		setInfo((prev) => ({
			...prev,
			isLLMModelOpen: false,
		}));
	};

	const handleWorkspaceSearchClick = () => {
		if (chatInfo?.deepResearch) return;
		updateStateValues({
			chatInfo: {
				...chatInfo,
				workspaceSearch: !chatInfo?.workspaceSearch,
			},
		});
	};

	return (
		<div className="chatParentWrapper">
			<div className={`chatWrapper`}>
				<div className={`voiceContainer ${info?.voiceIntegration ? 'active' : 'inactive'}`}>
					<Voice
						handleDisConnect={handleDisConnect}
						handleToggleMute={handleToggleMute}
						isVoiceMuted={info?.isVoiceMuted}
					/>
				</div>
				<div
					className={`chat-box-container ${
						info?.voiceIntegration ? 'inactive' : 'active'
					}`}
				>
					<div className="chatcontainer">
						<div className="chatBodyContainer">
							<div className="chatInputContainer">
								<div className={`chatInputParentContainer`}>
									<textarea
										type="text"
										placeholder="Hey! Need help? Ask me anything."
										value={info?.chatQuery}
										onChange={handleTextAreaChange}
										autoFocus={true}
										onKeyDown={handleSendMessageFunc}
										className="textArea"
										ref={textAreaRef}
									/>
									<div className="options-container">
										{info?.showFilters ? (
											<div className="filters-parent-container">
												<div
													className="close-filters"
													onClick={handleHideFiltersClick}
												>
													<ChevronSvg />
												</div>
												<div className="filters-wrapper">
													<div className="filters-container">
														{/* <SearchDropdown
															headerTitle="Integrations"
															selectedOptions={
																info?.chatFilters?.integrations
															}
															isDropdownOpen={
																info?.isIntegrationsDropdownOpen
															}
															setIsDropdownOpen={(value) =>
																setInfo((prev) => ({
																	...prev,
																	isIntegrationsDropdownOpen:
																		value,
																}))
															}
															options={integrationsOptions}
															handleOptionClick={
																handleIntegrationsOptionClick
															}
														/> */}
														<SearchDropdown
															headerTitle="Modules"
															selectedOptions={
																info?.chatFilters?.modules
															}
															isDropdownOpen={
																info?.isModulesDropdownOpen
															}
															setIsDropdownOpen={(value) =>
																setInfo((prev) => ({
																	...prev,
																	isModulesDropdownOpen: value,
																}))
															}
															options={modulesOptions}
															handleOptionClick={
																handleModulesOptionClick
															}
														/>
														<DateRangeDropdown
															onOptionClick={(value) => {
																setInfo((prev) => ({
																	...prev,
																	chatFilters: {
																		...prev?.chatFilters,
																		dateRange: value,
																	},
																}));
															}}
															startDate={
																info?.chatFilters?.dateRange?.[0]
															}
															endDate={
																info?.chatFilters?.dateRange?.[1]
															}
														/>
													</div>
													<div
														className="reset-filters"
														onClick={handleResetFiltersClick}
													>
														<CloseSvg />
													</div>
												</div>
											</div>
										) : (
											<div className="buttons-container">
												<div className="chat-icons-container">
													<Tooltip title="Enable Web Search">
														<div
															className="icon-container"
															onClick={handleWebSearchClick}
															style={{
																background: `${
																	chatInfo?.webSearch
																		? 'var(--accent-color)'
																		: 'var(--card-over-card)'
																}`,
																opacity: `${
																	chatInfo?.deepResearch
																		? '0.5'
																		: '1'
																}`,
															}}
														>
															<div className="icon">
																<WebDarkSvg />
															</div>
														</div>
													</Tooltip>
													<Tooltip title="Enable Workspace Search">
														<div
															className="icon-container"
															onClick={handleWorkspaceSearchClick}
															style={{
																background: `${
																	chatInfo?.workspaceSearch
																		? 'var(--accent-color)'
																		: 'var(--card)'
																}`,
																opacity: `${
																	chatInfo?.deepResearch
																		? '0.5'
																		: '1'
																}`,
															}}
														>
															<div className="icon">
																<BuildingDarkSvg />
															</div>
														</div>
													</Tooltip>

													<Tooltip title="Enable Deep Research">
														<div
															className="icon-container"
															onClick={handleDeepResearchClick}
															style={{
																background: `${
																	chatInfo?.deepResearch
																		? 'var(--accent-color)'
																		: 'var(--card)'
																}`,
															}}
														>
															<div className="icon">
																<MicroscopeDarkSvg />
															</div>
														</div>
													</Tooltip>

													<UploadFileTooltip
														fileTypeIcons={fileTypeIcons}
														handleChange={handleChange}
														isUploadFileOpen={info?.isUploadFileOpen}
														setIsUploadFileOpen={(value) => {
															if (chatInfo?.deepResearch) return;
															setInfo((prev) => ({
																...prev,
																isUploadFileOpen: value,
															}));
														}}
														handleRecentFileClick={
															handleRecentFileClick
														}
														recentFiles={info?.recentFiles}
													>
														<Tooltip title="Upload File">
															<div
																className="icon-container"
																style={{
																	opacity: `${
																		chatInfo?.deepResearch
																			? '0.5'
																			: '1'
																	}`,
																}}
															>
																<div className="icon">
																	<PaperClip
																		width={15}
																		height={15}
																		fill={'#f2f2f3'}
																	/>
																</div>
															</div>
														</Tooltip>
													</UploadFileTooltip>

													<Tooltip title="Add Filters">
														<div
															className="icon-container"
															onClick={handleShowFiltersClick}
															style={{
																opacity: `${
																	chatInfo?.deepResearch
																		? '0.5'
																		: '1'
																}`,
															}}
														>
															<div className="icon">
																<Filter />
															</div>
														</div>
													</Tooltip>
													<LLMTooltip
														selectedModel={chatInfo?.selectedLLMModel}
														handleOptionClick={
															handleLLMModelOptionClick
														}
														setIsLLMModelOpen={(value) => {
															if (
																chatInfo?.deepResearch ||
																chatInfo?.webSearch ||
																chatInfo?.workspaceSearch
															)
																return;
															setInfo((prev) => ({
																...prev,
																isLLMModelOpen: value,
															}));
														}}
														isOpen={info?.isLLMModelOpen}
													>
														<Tooltip title="Select LLM Model">
															<div
																className="icon-container"
																style={{
																	opacity: `${
																		chatInfo?.deepResearch ||
																		chatInfo?.webSearch ||
																		chatInfo?.workspaceSearch
																			? '0.5'
																			: '1'
																	}`,
																}}
															>
																<div className="icon">
																	<LLMSvg />
																</div>
															</div>
														</Tooltip>
													</LLMTooltip>
												</div>
												{info?.chatQuery?.trim()?.length > 0 ? (
													<div
														className="click-btn"
														onClick={(e) => handleSendBtnClick(e)}
														style={{
															backgroundColor: 'var(--accent-color)',
														}}
													>
														<ArrowUp />
													</div>
												) : (
													<div
														className="click-btn"
														onClick={(e) => handleMicIconClick(e)}
														style={{
															backgroundColor: 'var(--accent-color)',
														}}
													>
														<AudioSvg />
													</div>
												)}
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
						{previewImage && (
							<Image
								wrapperStyle={{
									display: 'none',
								}}
								rootClassName="preview-image-container"
								preview={{
									visible: previewOpen,
									onVisibleChange: (visible) => setPreviewOpen(visible),
									afterOpenChange: (visible) => !visible && setPreviewImage(''),
								}}
								src={previewImage}
							/>
						)}
					</div>
				</div>
				{/* )} */}
			</div>
			<div className="chatbarContainer" style={{ width: '100%' }}>
				{info?.uploadedImages?.length > 0 ? (
					<div className="imagePreviewBar">
						{info?.uploadedImages?.map((ele, index) => (
							<div className="previewOfUploadedImage" key={index}>
								<img
									src={ele?.preview}
									alt="uploaded"
									width={'100%'}
									height={'100%'}
									style={{
										objectFit: 'cover',
										borderRadius: '12px',
									}}
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
				{info?.recentFiles?.length > 0 && (
					<div className="recent-files-container">
						{info?.recentFiles?.map((file) => (
							<div className="recent-file" key={file?._id}>
								<div className="file-type-icon">
									{fileTypeIcons?.[file?.sourceType]}
								</div>
								<div className="file-name">{file?.originalFileName}</div>
								<div
									className="close-icon-container"
									onClick={() => handleRemoveFileFromRecentFileClick(file)}
								>
									<CloseSvg />
								</div>
							</div>
						))}
					</div>
				)}

				{info?.followUpQuery && (
					<div className="follow-up-query-container">
						<div className="follow-up-query">
							<div
								className="follow-up-query-text"
								onClick={handleFollowUpQueryClick}
							>
								{info?.followUpQuery}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(ChatBox);
