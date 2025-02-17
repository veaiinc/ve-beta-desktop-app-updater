import React, { memo, useCallback, useState, useRef, useEffect, useContext, useMemo } from 'react';
import '../../../assets/scss/home_page/chatbox.scss';
import { ReactComponent as Plus } from '../../../assets/svg/ai_agents/Plus.svg';
import { ReactComponent as Home } from '../../../assets/svg/ai_agents/home.svg';
import { ReactComponent as Settings } from '../../../assets/svg/ai_agents/settings.svg';
import { ReactComponent as Close } from '../../../assets/svg/close.svg';
import { ReactComponent as Expand } from '../../../assets/svg/bottomToolbar/expand.svg';
import { ReactComponent as ArrowUp } from '../../../assets/svg/ai_agents/arrow-up.svg';
import { ReactComponent as ExpandChatIcon } from '../../../assets/svg/ai_agents/expand-chat-icon.svg';
import { ReactComponent as ChevronSvg } from '../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as MicroscopeLightSvg } from '../../../assets/svg/ai_agents/microscope-light.svg';
import { ReactComponent as MicroscopeDarkSvg } from '../../../assets/svg/ai_agents/microscope-dark.svg';
import { ReactComponent as WebLightSvg } from '../../../assets/svg/ai_agents/web-light.svg';
import { ReactComponent as WebDarkSvg } from '../../../assets/svg/ai_agents/web-dark.svg';
import { ReactComponent as CloseSvg } from '../../../assets/svg/calendar/close.svg';
import { ReactComponent as BuildingSvg } from '../../../assets/svg/ai_agents/building.svg';
import { ReactComponent as TextSvg } from '../../../assets/svg/ai_agents/text.svg';
import { ReactComponent as DocxSvg } from '../../../assets/svg/ai_agents/docx.svg';
import { ReactComponent as JsonSvg } from '../../../assets/svg/ai_agents/json.svg';
import { ReactComponent as PdfSvg } from '../../../assets/svg/ai_agents/pdf.svg';
import { ReactComponent as JpgSvg } from '../../../assets/svg/ai_agents/jpg.svg';
import { ReactComponent as PngSvg } from '../../../assets/svg/ai_agents/png.svg';
import { ReactComponent as MdSvg } from '../../../assets/svg/ai_agents/md.svg';
import { Alert, Image, message, Spin, Tooltip } from 'antd';
import { Upload } from 'antd';
import Context from '../../../context/context';
import ObjectID from 'bson-objectid';
import { useLocation, useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';
import { TypingEffect } from '../../../helpers/markdownHelper';
import { ReactComponent as Filter } from '../../../assets/svg/my_templates/filter.svg';
import { ReactComponent as Arroba } from '../../../assets/svg/ai_agents/arroba.svg';
import { ReactComponent as PaperClip } from '../../../assets/svg/ai_agents/paper-clip.svg';
import { ReactComponent as Mic } from '../../../assets/svg/ai_agents/mic.svg';
import { getBase64 } from '../../../helpers';
import WorkflowSlugSelector from '../../components/calendar/WorkflowSlugSelector';
import { ReactComponent as AiSparkel } from '../../../assets/svg/calendar/aiSparkel.svg';
import useVoiceIntegration from '../../hooks/useVoiceIntegration';
import SearchDropdown from '../chat/SearchDropdown';
import UploadFileTooltip from '../chat/UploadFileTooltip';
import DateRangeDropdown from '../chat/DateRangeDropdown';
import SearchTypeTooltip from '../chat/SearchTypeTooltip';
import moment from 'moment';
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

const searchTypeOptions = {
	webSearch: {
		label: 'World Knowledge',
		value: 'webSearch',
		icon: <WebLightSvg />,
	},
	workspaceSearch: {
		label: 'Workspace Search',
		value: 'workspaceSearch',
		icon: <BuildingSvg />,
	},
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
		webSearch: false,
		goDeep: false,
		isUploadFileOpen: false,
		showFilters: false,
		chatFilters: initialChatFilters,
		isIntegrationsDropdownOpen: false,
		isModulesDropdownOpen: false,
		searchType: {
			webSearch: false,
			workspaceSearch: false,
		},
		recentFiles: [],
		isSearchTypeOpen: false,
	});

	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');

	useEffect(() => {
		if (activePromptForChat) {
			handleSendMessageFunc(null, true, activePromptForChat);
			updateStateValues({ activePromptForChat: null });
		}
	}, [activePromptForChat]);

	useEffect(() => {
		if (currentSessionId) {
			setInfo((prev) => ({ ...prev, chatSessionId: currentSessionId }));
		} else {
			updateStateValues({ currentSessionId: ObjectID().toString() });
		}
	}, [currentSessionId]);

	const handlePreview = async (file) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		setPreviewImage(file.url || file.preview);
		setPreviewOpen(true);
	};

	const handleWebSearchClick = () => {
		setInfo((prev) => ({
			...prev,
			webSearch: !prev?.webSearch,
		}));
	};

	const handleGoDeepSearchClick = () => {
		setInfo((prev) => ({
			...prev,
			goDeep: !prev?.goDeep,
		}));
	};

	const handleShowFiltersClick = () => {
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

						const date =
							info?.chatFilters?.dateRange?.length > 0
								? [
										moment(info?.chatFilters?.dateRange[0])?.unix(),
										moment(info?.chatFilters?.dateRange[1])?.unix(),
								  ]
								: [];

						const payload = {
							query:
								currentQuery +
								',' +
								info?.recentFiles?.map((ele) => ele?.name).join(','),
							timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
							knowledge_base_search: info?.searchType?.workspaceSearch,
							web_search: info?.searchType?.webSearch,
							modules: Object?.keys(info?.chatFilters?.modules),
							date: date,
						};
						if (moduleHelper?.[location?.pathname?.split('/')?.[1]]) {
							const foundModule = payload?.modules?.find(
								(ele) =>
									ele === moduleHelper?.[location?.pathname?.split('/')?.[1]],
							);

							if (!foundModule) {
								payload?.modules?.push(
									moduleHelper?.[location?.pathname?.split('/')?.[1]],
								);
							}
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

						setInfo((prev) => ({ ...prev, uploadedImages: [], chatQuery: '' }));

						const response = await handleGlobalChatMessages(
							payload,
							info?.chatSessionId,
							localPayload,
							currentQuery,
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
				setInfo((prev) => ({ ...prev, voiceIntegration: true }));
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

	const handleSendBtnClick = (e) => {
		if (info?.chatQuery?.trim()?.length > 0) {
			handleSendMessageFunc(e, true);
		}
	};

	const isSearchTypeEnabled = useMemo(() => {
		return Object?.keys(info?.searchType)?.some((type) => info?.searchType[type]);
	}, [info?.searchType]);

	return (
		<>
			<div className="chatcontainer">
				<div className="chatbarContainer" style={{ width: '100%' }}>
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
				</div>
				<div className="chatBodyContainer">
					<div className="chatInputContainer">
						<div className={`chatInputParentContainer`}>
							<textarea
								type="text"
								placeholder="Hey! Need help? Ask me anything."
								value={info?.chatQuery}
								onChange={(e) =>
									setInfo((prev) => ({ ...prev, chatQuery: e.target.value }))
								}
								onKeyDown={handleSendMessageFunc}
								className="textArea"
								// rows={1}
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
												<SearchDropdown
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
															isIntegrationsDropdownOpen: value,
														}))
													}
													options={integrationsOptions}
													handleOptionClick={
														handleIntegrationsOptionClick
													}
												/>
												<SearchDropdown
													headerTitle="Modules"
													selectedOptions={info?.chatFilters?.modules}
													isDropdownOpen={info?.isModulesDropdownOpen}
													setIsDropdownOpen={(value) =>
														setInfo((prev) => ({
															...prev,
															isModulesDropdownOpen: value,
														}))
													}
													options={modulesOptions}
													handleOptionClick={handleModulesOptionClick}
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
													startDate={info?.chatFilters?.dateRange?.[0]}
													endDate={info?.chatFilters?.dateRange?.[1]}
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
											<SearchTypeTooltip
												searchTypeOptions={searchTypeOptions}
												onOpenChange={(value) =>
													setInfo((prev) => ({
														...prev,
														isSearchTypeOpen: value,
													}))
												}
												searchType={info?.searchType}
												isOpen={info?.isSearchTypeOpen}
												onSearchTypeChange={handleSearchTypeChange}
											>
												<div
													className="icon-container"
													onClick={handleWebSearchClick}
													style={{
														background: `${
															isSearchTypeEnabled
																? '#B39DFA'
																: '#2E2F33'
														}`,
													}}
												>
													<div className="icon">
														{isSearchTypeEnabled ? (
															<WebDarkSvg />
														) : (
															<WebLightSvg />
														)}
													</div>
													<div
														className="right-text"
														style={{
															color: `${
																isSearchTypeEnabled
																	? '#0C0C0D'
																	: '#f2f2f3'
															}`,
														}}
													>
														{showChatLabels ? 'Search' : ''}
													</div>
												</div>
											</SearchTypeTooltip>

											<div
												className="icon-container"
												onClick={handleGoDeepSearchClick}
												style={{
													background: `${
														info?.goDeep ? '#B39DFA' : '#2E2F33'
													}`,
												}}
											>
												<div className="icon">
													{info?.goDeep ? (
														<MicroscopeDarkSvg />
													) : (
														<MicroscopeLightSvg />
													)}
												</div>
												<div
													className="right-text"
													style={{
														color: `${
															info?.goDeep ? '#0C0C0D' : '#f2f2f3'
														}`,
													}}
												>
													{showChatLabels ? 'Explore' : ''}
												</div>
											</div>
											<UploadFileTooltip
												fileTypeIcons={fileTypeIcons}
												handleChange={handleChange}
												isUploadFileOpen={info?.isUploadFileOpen}
												setIsUploadFileOpen={(value) =>
													setInfo((prev) => ({
														...prev,
														isUploadFileOpen: value,
													}))
												}
												handleRecentFileClick={handleRecentFileClick}
												recentFiles={info?.recentFiles}
											>
												<div className="icon-container">
													<div className="icon">
														<PaperClip
															width={15}
															height={15}
															fill={'#f2f2f3'}
														/>
													</div>
													<div className="right-text">
														{showChatLabels ? 'Add' : ''}
													</div>
												</div>
											</UploadFileTooltip>

											<div
												className="icon-container"
												onClick={handleShowFiltersClick}
											>
												<div className="icon">
													<Filter />
												</div>
												<div className="right-text">
													{showChatLabels ? 'Filters' : ''}
												</div>
											</div>
											{info?.voiceIntegration ? (
												<span
													className="chat-icon"
													onClick={handleDisConnect}
												>
													<Close
														style={{ width: '20px', height: '20px' }}
													/>
												</span>
											) : (
												<span className="chat-icon">
													<Mic onClick={handleMicIconClick} />
												</span>
											)}
										</div>
										<div
											className="click-btn"
											onClick={(e) => handleSendBtnClick(e)}
											style={{
												backgroundColor: `${
													info?.chatQuery?.trim()?.length > 0
														? '#b2a1e8'
														: '#2e2f33'
												}`,
											}}
										>
											<ArrowUp />
										</div>
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
		</>
	);
};

export default memo(ChatBox);
