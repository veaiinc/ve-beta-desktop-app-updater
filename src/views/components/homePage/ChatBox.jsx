import { memo, useCallback, useState, useRef, useEffect, useContext } from 'react';
import '../../../assets/scss/home_page/chatbox.scss';
import { ReactComponent as Close } from '../../../assets/svg/close.svg';
import { ReactComponent as ArrowUp } from '../../../assets/svg/ai_agents/arrow-up-dark.svg';
import { ReactComponent as ChevronSvg } from '../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as CloseSvg } from '../../../assets/svg/calendar/close.svg';
import { ReactComponent as TextSvg } from '../../../assets/svg/ai_agents/text.svg';
import { ReactComponent as DocxSvg } from '../../../assets/svg/ai_agents/docx.svg';
import { ReactComponent as JsonSvg } from '../../../assets/svg/ai_agents/json.svg';
import { ReactComponent as PdfSvg } from '../../../assets/svg/ai_agents/pdf.svg';
import { ReactComponent as JpgSvg } from '../../../assets/svg/ai_agents/jpg.svg';
import { ReactComponent as PngSvg } from '../../../assets/svg/ai_agents/png.svg';
import { ReactComponent as MdSvg } from '../../../assets/svg/ai_agents/md.svg';
import { ReactComponent as PlusSvg } from '../../../assets/svg/ai_assistant/plus.svg';
import { ReactComponent as ExcelSvg } from '../../../assets/svg/ai_agents/excel.svg';
import { ReactComponent as AudioSvg } from '../../../assets/svg/ai_agents/audio.svg';
import { ReactComponent as LLMSvg } from '../../../assets/svg/ai_agents/llm.svg';
import { ReactComponent as AtomSvg } from '../../../assets/svg/ai_agents/atom.svg';
import { ReactComponent as ArrowDownSvg } from '../../../assets/svg/ai_agents/arrow-down.svg';
import Context from '../../../context/context';
import ObjectID from 'bson-objectid';
import { useLocation, useNavigate } from 'react-router-dom';
import { checkDevices, getBase64, getLocationsDetails } from '../../../helpers';
import WorkflowSlugSelector from '../../components/calendar/WorkflowSlugSelector';
import SearchDropdown from '../chat/SearchDropdown';
import UploadFileTooltip from '../chat/UploadFileTooltip';
import DateRangeDropdown from '../chat/DateRangeDropdown';
import moment from 'moment';
import { message, Image, Spin, Tooltip } from 'antd';
import LLMTooltip from '../chat/LLMTooltip';
import AIMessageLoader from '../chat/AIMessageLoader';
import WebSvg from '../../../assets/svg/ai_agents/webSvg';
import BookSvg from '../../../assets/svg/ai_agents/bookSvg';
import BuildingSvg from '../../../assets/svg/ai_agents/building';
import MicroscopeSvg from '../../../assets/svg/ai_agents/microScopeSvg';
import useUpdatedVoiceIntegration from '../../hooks/useUpdatedVoiceIntegration';
import SearchTypeTooltip from '../chat/SearchTypeTooltip';

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
		icon: WebSvg,
		title: 'Web Search',
		subTitle: 'Search that Adapts query',
	},
	workspaceSearch: {
		icon: BookSvg,
		title: 'Internal Knowledge',
		subTitle: 'Effortless access to insights',
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
	xlsx: <ExcelSvg />,
	xls: <ExcelSvg />,
	'image/png': <PngSvg />,
	'image/jpeg': <JpgSvg />,
	'image/jpg': <JpgSvg />,
	'application/pdf': <PdfSvg />,
	'application/docx': <DocxSvg />,
	'application/txt': <TextSvg />,
	'application/json': <JsonSvg />,
	'application/md': <MdSvg />,
	'application/jpeg': <JpgSvg />,
	'text/plain': <TextSvg />,
};

/*
Note:
We are using useRef at some places along with useState,
This is because we want to avoid re-rendering the component when the state changes,
and useRef does not cause re-rendering when the state changes and it always gives the latest value of the state.
Dont change this otherwise chat functionality will break.
*/

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
	isPublicChat = false,
	showIconText = true,
	autoFocus = true,
	uploadFileTooltipPlacement = 'top',
	searchTypeTooltipPlacement = 'top',
}) => {
	const {
		templates: {
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
			userEditedQuery,
			galleryFile,
		},
		calendarInfo: { updateCalendarState },
		tasks: { updateTaskState },
		documentPreview: { noteContent, setNoteContent },
		aiSetup: { updateAiSetupState, voiceIntegrationData },
	} = useContext(Context);

	const { handleConnect, shouldConnect } = useUpdatedVoiceIntegration();

	const navigate = useNavigate();
	const location = useLocation();

	const [info, setInfo] = useState({
		bigToolbarIsOpen: false,
		chatQuery: '',
		position: { x: window?.innerWidth / 2 - 900, y: 0 },
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
		searchTypeOpen: false,
	});

	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const textAreaRef = useRef(null);
	const uploadedImagesRef = useRef(info?.uploadedImages || []);
	const recentFilesRef = useRef(info?.recentFiles || []);

	useEffect(() => {
		if (activePromptForChat) {
			handleSendMessageFunc(null, true, activePromptForChat);
			updateStateValues({ activePromptForChat: null });
		}
	}, [activePromptForChat]);

	useEffect(() => {
		if (galleryFile) {
			recentFilesRef.current = [...recentFilesRef?.current, galleryFile];
			updateStateValues({ galleryFile: null });
		}
	}, [galleryFile]);

	useEffect(() => {
		if (
			!chatInfo?.agentType ||
			(location?.pathname?.split('/')?.[1] !== 'chat' &&
				location?.pathname?.split('/')?.[1] !== 'knowledge-agent' &&
				chatInfo?.agentType === 'knowledge_agent')
		) {
			updateStateValues({
				chatInfo: { ...chatInfo, agentType: 'multi_agent', assistantId: null },
			});
		}
	}, []);

	//useEffect to handle send user edited query
	useEffect(() => {
		if (userEditedQuery) {
			if (info?.chatLoading) {
				updateStateValues({ userEditedQuery: null });
				message.error('Please wait, AI is already generating a response');
				return;
			}
			handleSendMessageFunc(null, true, userEditedQuery);
			updateStateValues({ userEditedQuery: null });
		}
	}, [userEditedQuery, info?.chatLoading]);

	useEffect(() => {
		if (activePayloadForChat) {
			setInfo((prev) => ({ ...prev, chatLoading: true }));
			const { payload, localPayload, currentQuery, recentFiles = [] } = activePayloadForChat;
			if (handleSendWebsocketMessage) {
				handleSendWebsocketMessage(payload, currentQuery);
			}

			handleStreamSendMessage(payload, localPayload, currentQuery);
			updateStateValues({ activePayloadForChat: null });
			recentFilesRef.current = recentFiles;
			setInfo((prev) => ({ ...prev, recentFiles }));
		}
	}, [activePayloadForChat]);

	useEffect(() => {
		if (currentSessionId) {
			setInfo((prev) => ({ ...prev, chatSessionId: currentSessionId }));
		} else {
			updateStateValues({ currentSessionId: ObjectID()?.toString() });
		}
	}, [currentSessionId]);

	useEffect(() => {
		if (recentFilesRef?.current?.length > 0 || uploadedImagesRef?.current?.length > 0) {
			updateStateValues({
				chatInfo: { ...chatInfo, workspaceSearch: true },
			});
		}
	}, [recentFilesRef?.current, uploadedImagesRef?.current]);

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

	useEffect(() => {
		setInfo((prev) => ({
			...prev,
			voiceIntegration: voiceIntegrationData?.shouldConnect || false,
		}));
	}, [voiceIntegrationData]);

	const handlePreview = async (file) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		setPreviewImage(file.url || file.preview);
		setPreviewOpen(true);
	};

	const handleWebSearchClick = () => {
		if (chatInfo?.deepResearch) return;

		if (isPublicChat) {
			if (chatInfo?.deepResearch) {
				updateStateValues({
					chatInfo: {
						...chatInfo,
						deepResearch: false,
						webSearch: !chatInfo?.webSearch,
					},
				});
				return;
			}
		}
		updateStateValues({
			chatInfo: {
				...chatInfo,
				webSearch: !chatInfo?.webSearch,
			},
		});
	};

	const handleDeepResearchClick = () => {
		if (recentFilesRef.current?.length > 0 || uploadedImagesRef.current?.length > 0) {
			return;
		}

		if (isPublicChat) {
			if (chatInfo?.webSearch) {
				updateStateValues({
					chatInfo: {
						...chatInfo,
						webSearch: false,
						deepResearch: !chatInfo?.deepResearch,
					},
				});
				return;
			}
		}

		if (!chatInfo?.deepResearch) {
			updateStateValues({
				chatInfo: {
					...chatInfo,
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
		let udpatedData = [...(recentFilesRef?.current || [])];
		const isFileAlreadyPresent = recentFilesRef?.current?.some((ele) => ele?._id === file?._id);
		udpatedData = recentFilesRef?.current?.filter((ele) => ele?._id !== file?._id);
		recentFilesRef.current = udpatedData;
		if (isFileAlreadyPresent) {
			setInfo((prev) => ({
				...prev,
				recentFiles: udpatedData,
			}));
		} else {
			udpatedData?.push(file);
			recentFilesRef.current = udpatedData;
			setInfo((prev) => ({
				...prev,
				recentFiles: udpatedData,
			}));
		}
	};

	const handleRemoveFileFromRecentFileClick = (file) => {
		const updatedRecentFiles = recentFilesRef?.current?.filter(
			(ele) => ele?._id !== file?._id || ele?.uniqueId !== file?.uniqueId,
		);
		recentFilesRef.current = updatedRecentFiles;
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

				if (aiChatLoading || info?.chatLoading) {
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

					query = currentQuery;

					const payload = {
						query,
						timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
						web_search: chatInfo?.webSearch || chatInfo?.reason?.webSearch,
						...(!isPublicChat && {
							knowledge_base_search:
								chatInfo?.workspaceSearch || chatInfo?.reason?.workspaceSearch,
						}),
						...(!isPublicChat && { modules: Object?.keys(info?.chatFilters?.modules) }),
						...(!isPublicChat && { date: date }),
						deep_research: chatInfo?.deepResearch,
					};

					if (chatInfo?.agentType === 'knowledge_agent') {
						payload.assistant_id = chatInfo?.assistantId;
					}

					if (moduleHelper?.[location?.pathname?.split('/')?.[1]]) {
						payload.screen = moduleHelper[location?.pathname?.split('/')?.[1]];
					}
					let localPayload = {};
					if (uploadedImagesRef?.current?.length) {
						payload.files = uploadedImagesRef?.current?.map((ele) => ({
							id: ele?.fileId || null,
							name: ele?.name || 'Untitled Image',
						}));

						localPayload = {
							files: uploadedImagesRef?.current || [],
							handlePreview,
						};
					}
					if (recentFilesRef?.current?.length > 0) {
						if (payload?.files && payload.files?.length > 0) {
							payload.files = [
								...payload.files,
								...recentFilesRef?.current?.map((ele) => ({
									id: ele?._id || ele?.fileId || null,
									name: ele?.originalFileName || ele?.title || 'Untitled File',
								})),
							];
						} else {
							payload.files = recentFilesRef?.current?.map((ele) => ({
								id: ele?._id || ele?.fileId || null,
								name: ele?.originalFileName || ele?.title || 'Untitled File',
							}));
						}
					}
					if (activeWorkflowSlugForSmartFile) {
						payload.workflow_slug = activeWorkflowSlugForSmartFile;
					}

					// if (
					// 	!chatInfo?.webSearch &&
					// 	!chatInfo?.workspaceSearch &&
					// 	!uploadedImagesRef?.current?.length &&
					// 	!recentFilesRef?.current?.length
					// ) {
					// 	payload.selected_model = chatInfo?.selectedLLMModel;
					// }

					//this payload props are for public chat
					if (isPublicChat) {
						const user_id = localStorage?.getItem('user_id');
						let location_details = JSON?.parse(
							localStorage?.getItem('locationDetails'),
						);
						const ip_address = localStorage?.getItem('ipAddress');

						if (!location_details) {
							location_details = await getLocationsDetails();
						}

						payload.user_id = user_id ?? null;
						payload.location_details = location_details || {};
						payload.ip_address = ip_address ?? null;
					}

					setInfo((prev) => ({
						...prev,
						uploadedImages: [],
						chatQuery: '',
						// recentFiles: [],// not clearing the recent files , because they want like sana
						chatFilters: initialChatFilters,
					}));
					uploadedImagesRef.current = [];

					clearTextArea();

					if (customChatActions) {
						return onSend({
							payload,
							localPayload,
							currentQuery,
							recentFiles: recentFilesRef?.current || [],
						});
					}
					handleStreamSendMessage(payload, localPayload, currentQuery);
					if (handleSendWebsocketMessage) {
						handleSendWebsocketMessage(payload, currentQuery);
					}
				}
			}
		},
		[
			aiChatLoading,
			onSend,
			customChatActions,
			info,
			chatInfo,
			activeWorkflowSlugForSmartFile,
			recentFilesRef.current,
			uploadedImagesRef?.current,
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
							<AIMessageLoader />
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
			const uploadBatchId = ObjectID()?.toString();
			const payload = {
				sessionId: info?.chatSessionId,
				originalFileName: file?.name || 'Untitled file',
				uploadBatchId,
			};
			const response = await handleGlobalUploadImage(file, payload);
			let uploadedImages, recentFiles, requiredFileIndex;
			let isImage = file?.type?.includes('image');

			if (!response?.[0]) {
				requiredFileIndex = -1;
				if (isImage) {
					requiredFileIndex = uploadedImages?.findIndex(
						(ele) => ele?.uniqueId === file?.uniqueId,
					);
				} else {
					requiredFileIndex = recentFiles?.findIndex(
						(ele) => ele?.uniqueId === file?.uniqueId,
					);
				}

				if (requiredFileIndex === -1) {
					return;
				}

				uploadedImages = [...(uploadedImagesRef?.current || [])];
				recentFiles = [...(recentFilesRef?.current || [])];

				if (isImage) {
					uploadedImages.splice(requiredFileIndex, 1);
					uploadedImagesRef.current = uploadedImages;
				} else {
					recentFiles.splice(requiredFileIndex, 1);
					recentFilesRef.current = recentFiles;
				}

				setInfo((prev) => ({ ...prev, uploadedImages, recentFiles }));
				return message.error(response?.[1] || 'failed to upload image');
			}

			const { _id } = response?.[1] || {};
			file.fileId = _id;

			requiredFileIndex = -1;
			if (isImage) {
				requiredFileIndex = uploadedImages?.findIndex(
					(ele) => ele?.uniqueId === file?.uniqueId,
				);
			} else {
				requiredFileIndex = recentFiles?.findIndex(
					(ele) => ele?.uniqueId === file?.uniqueId,
				);
			}

			if (requiredFileIndex === -1) {
				return;
			}

			uploadedImages = [...(uploadedImagesRef?.current || [])];
			recentFiles = [...(recentFilesRef?.current || [])];

			if (isImage) {
				uploadedImages.splice(requiredFileIndex, 1, file);
				uploadedImagesRef.current = uploadedImages;
			} else {
				recentFiles.splice(requiredFileIndex, 1, file);
				recentFilesRef.current = recentFiles;
			}

			setInfo((prev) => ({ ...prev, uploadedImages, recentFiles }));
			checkIndividualImageUploadedStatusFunc(file, uploadBatchId);
		},
		[info, uploadedImagesRef?.current, recentFilesRef?.current],
	);

	const checkIndividualImageUploadedStatusFunc = useCallback(
		async (fileData, uploadBatchId) => {
			let isImage = fileData?.type?.includes('image');
			let uploadedImages, recentFiles, requiredFileIndex;

			let uploadedCount = 0,
				maxAttempts = 90,
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
				await new Promise((resolve) => setTimeout(resolve, 2000));
				maxAttempts--;
			}

			if (errorCount || maxAttempts === 0) {
				requiredFileIndex = -1;

				if (isImage) {
					requiredFileIndex = uploadedImagesRef?.current?.findIndex(
						(ele) => ele?.uniqueId === fileData?.uniqueId,
					);
				} else {
					requiredFileIndex = recentFilesRef?.current?.findIndex(
						(ele) => ele?.uniqueId === fileData?.uniqueId,
					);
				}

				if (requiredFileIndex === -1) {
					return;
				}

				uploadedImages = [...(uploadedImagesRef?.current || [])];
				recentFiles = [...(recentFilesRef?.current || [])];

				if (isImage) {
					uploadedImages.splice(requiredFileIndex, 1);
					uploadedImagesRef.current = uploadedImages;
				} else {
					recentFiles.splice(requiredFileIndex, 1);
					recentFilesRef.current = recentFiles;
				}

				setInfo((prev) => ({ ...prev, uploadedImages, recentFiles }));
				return message.error('Something went wrong while processing the image');
			}

			if (uploadedCount && uploadedCount > 0) {
				requiredFileIndex = -1;

				if (isImage) {
					requiredFileIndex = uploadedImagesRef?.current?.findIndex(
						(ele) => ele?.uniqueId === fileData?.uniqueId,
					);
				} else {
					requiredFileIndex = recentFilesRef?.current?.findIndex(
						(ele) => ele?.uniqueId === fileData?.uniqueId,
					);
				}

				if (requiredFileIndex === -1) {
					return;
				}

				uploadedImages = [...(uploadedImagesRef?.current || [])];
				recentFiles = [...(recentFilesRef?.current || [])];

				fileData.loading = false;
				if (isImage) {
					uploadedImages.splice(requiredFileIndex, 1, fileData);
					uploadedImagesRef.current = uploadedImages;
				} else {
					recentFiles.splice(requiredFileIndex, 1, fileData);
					recentFilesRef.current = recentFiles;
				}

				setInfo((prev) => ({ ...prev, uploadedImages, recentFiles }));
			}
		},
		[info, recentFilesRef?.current, uploadedImagesRef?.current],
	);

	const handleFileAttachmentChange = useCallback(
		async ({ file }) => {
			if (file?.size >= 5242880) {
				message?.error('File size must be less than 5MB');
				return;
			}

			let uploadedImages = [...(uploadedImagesRef?.current || [])];
			let recentFiles = [...(recentFilesRef?.current || [])];
			file.preview = await getBase64(file);
			file.loading = true;
			file.uniqueId = Date?.now() + '_' + Math?.floor(Math?.random() * 1000000);

			if (file?.type?.includes('image')) {
				uploadedImages?.push(file);
				uploadedImagesRef.current = uploadedImages;
			} else {
				file.originalFileName = file.name;
				file.sourceType = file.type;
				recentFiles?.unshift(file);
				recentFilesRef.current = recentFiles;
			}

			handleGlobalImageProcessing(file);

			setInfo((prev) => ({
				...prev,
				uploadedImages,
				recentFiles,
			}));
		},
		[handleAiUploadImage, info, recentFilesRef?.current, uploadedImagesRef?.current],
	);

	const checkAllUploadLoadingStatus = useCallback(() => {
		let uploadedImages = [...(uploadedImagesRef.current || [])];
		let recentFiles = [...(recentFilesRef.current || [])];
		for (let i = 0; i < uploadedImages?.length; i++) {
			if (uploadedImages[i]?.loading) {
				return false;
			}
		}
		for (let i = 0; i < recentFiles?.length; i++) {
			if (recentFiles?.[i]?.loading) {
				return false;
			}
		}
		return true;
	}, [info, recentFilesRef, uploadedImagesRef]);

	const handleRemoveImage = useCallback(
		(ele) => {
			let uploadedImages = [...(uploadedImagesRef.current || [])];

			let requiredFileIndex = -1;
			requiredFileIndex = uploadedImages?.findIndex(
				(file) => ele?.uniqueId === file?.uniqueId,
			);
			if (requiredFileIndex === -1) {
				return;
			}

			uploadedImages.splice(requiredFileIndex, 1);
			uploadedImagesRef.current = uploadedImages;
			setInfo((prev) => ({ ...prev, uploadedImages }));
			deleteUploadedImageThroughChat(ele?.fileId);
		},
		[info, uploadedImagesRef],
	);

	const handleMicIconClick = useCallback(
		async (event) => {
			const { hasMic, hasCamera } = await checkDevices();

			if (!hasMic) {
				message.error('Mic is not available');
				return;
			}

			if (!info?.voiceIntegration) {
				handleConnect();
				setInfo((prev) => ({ ...prev, voiceIntegration: true }));
			} else {
				// toggleMute();
			}
			event.stopPropagation();
		},

		[info, handleConnect],
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
		const query = e.target.value;
		if (query?.trim()?.length > 0) {
			const lastChar = query?.trim()?.slice(-1);
			if (lastChar === '@' && !info?.isUploadFileOpen) {
				setInfo((prev) => ({
					...prev,
					isUploadFileOpen: true,
				}));
			}
		}
		setInfo((prev) => ({
			...prev,
			chatQuery: query,
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
		if (info?.followUpQuery?.trim()?.length > 0) {
			updateStateValues({ activePromptForChat: info?.followUpQuery, followUpQuery: null });
			setInfo((prev) => ({
				...prev,
				followUpQuery: null,
			}));
		}
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
		if (
			recentFilesRef?.current?.length > 0 ||
			uploadedImagesRef?.current?.length > 0 ||
			chatInfo?.deepResearch
		) {
			return;
		}
		updateStateValues({
			chatInfo: {
				...chatInfo,
				workspaceSearch: !chatInfo?.workspaceSearch,
			},
		});
	};

	const handleAgentClick = (agentType) => {
		if (chatInfo?.agentType === agentType || info?.chatLoading) {
			return;
		}
		updateStateValues({
			chatInfo: {
				...chatInfo,
				agentType,
			},
		});
	};

	const handleUpdateSearchTypeChange = (type, value) => {
		const reason = { ...chatInfo?.reason, [type]: value };
		let deepResearch = chatInfo?.deepResearch;
		let webSearch = chatInfo?.webSearch,
			workspaceSearch = chatInfo?.workspaceSearch;
		if (reason?.webSearch === false && reason?.workspaceSearch === false) {
			deepResearch = false;
		} else {
			deepResearch = true;
		}

		updateStateValues({
			chatInfo: {
				...chatInfo,
				reason,
				deepResearch,
				webSearch: deepResearch ? false : webSearch,
				workspaceSearch: deepResearch ? false : workspaceSearch,
			},
		});
	};

	return (
		<div className="chatParentWrapper">
			<div className={`chatWrapper`}>
				<div
					className={`chat-box-container ${
						info?.voiceIntegration ? 'inactive' : 'active'
					}`}
				>
					<div className="chatcontainer">
						<div className="chatBodyContainer">
							<div className="chatInputContainer">
								<div className={`chatInputParentContainer`}>
									<div className="chat-input-container">
										{(chatInfo?.reason?.webSearch ||
											chatInfo?.reason?.workspaceSearch) && (
											<div className="active-search-types">
												{chatInfo?.reason?.webSearch && (
													<div className={`search-type`}>
														<WebSvg selected={true} />
													</div>
												)}
												{chatInfo?.reason?.workspaceSearch && (
													<div
														className={`search-type knowledge-search-type `}
													>
														<BookSvg selected={true} />
													</div>
												)}
											</div>
										)}
										<textarea
											type="text"
											placeholder="Ask me anything or type @ to add sources."
											value={info?.chatQuery}
											onChange={handleTextAreaChange}
											autoFocus={autoFocus}
											onKeyDown={handleSendMessageFunc}
											className="textArea"
											ref={textAreaRef}
										/>
									</div>
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
													{!isPublicChat && (
														<UploadFileTooltip
															fileTypeIcons={fileTypeIcons}
															handleChange={
																handleFileAttachmentChange
															}
															isUploadFileOpen={
																info?.isUploadFileOpen
															}
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
															recentFiles={
																recentFilesRef.current || []
															}
															tooltipPlacement={
																uploadFileTooltipPlacement
															}
														>
															<Tooltip
																title={
																	<div className="chatbox-icon-tooltip-container">
																		Upload File
																	</div>
																}
																color="transparent"
																arrow={false}
																rootClassName="chatbox-tooltip"
															>
																<div
																	className="chat-box-icon-container"
																	style={{
																		opacity: `${
																			chatInfo?.deepResearch
																				? '0.5'
																				: '1'
																		}`,
																		background: 'var(--card)',
																		padding: '6px 8px',
																	}}
																>
																	<div className="icon">
																		<PlusSvg
																			width={17}
																			height={17}
																		/>
																	</div>
																</div>
															</Tooltip>
														</UploadFileTooltip>
													)}

													<Tooltip
														title={
															<div className="chatbox-icon-tooltip-container">
																{chatInfo?.webSearch
																	? 'Disable web search'
																	: 'Search on web'}
															</div>
														}
														color="transparent"
														arrow={false}
														rootClassName="chatbox-tooltip"
													>
														<div
															className={`chat-box-icon-container ${
																chatInfo?.webSearch ? 'active' : ''
															}`}
															style={{
																opacity: `${
																	chatInfo?.deepResearch
																		? '0.5'
																		: '1'
																}`,
															}}
															onClick={handleWebSearchClick}
														>
															<div className="icon">
																<WebSvg
																	selected={chatInfo?.webSearch}
																/>
																{showIconText && (
																	<div
																		className="icon-text"
																		style={{
																			color: chatInfo?.webSearch
																				? 'var(--primary-button-font)'
																				: 'var(--primary-font)',
																		}}
																	>
																		Web Search
																	</div>
																)}
															</div>
														</div>
													</Tooltip>
													{!isPublicChat && (
														<Tooltip
															title={
																<div className="chatbox-icon-tooltip-container">
																	{chatInfo?.workspaceSearch
																		? 'Explore internal data'
																		: 'Explore internal data'}
																</div>
															}
															color="transparent"
															arrow={false}
															rootClassName="chatbox-tooltip"
														>
															<div
																className={`chat-box-icon-container ${
																	chatInfo?.workspaceSearch
																		? 'active'
																		: ''
																}`}
																onClick={handleWorkspaceSearchClick}
																style={{
																	opacity: `${
																		chatInfo?.deepResearch
																			? '0.5'
																			: '1'
																	}`,
																}}
															>
																<div className="icon">
																	<BuildingSvg
																		selected={
																			chatInfo?.workspaceSearch
																		}
																	/>
																	{showIconText && (
																		<div
																			className="icon-text"
																			style={{
																				color: chatInfo?.workspaceSearch
																					? 'var(--primary-button-font)'
																					: 'var(--primary-font)',
																			}}
																		>
																			Internal Knowledge
																		</div>
																	)}
																</div>
															</div>
														</Tooltip>
													)}

													{!isPublicChat && (
														<SearchTypeTooltip
															isOpen={info?.searchTypeOpen}
															searchType={chatInfo?.reason}
															onSearchTypeChange={
																handleUpdateSearchTypeChange
															}
															onOpenChange={(value) => {
																setInfo((prev) => ({
																	...prev,
																	searchTypeOpen: value,
																}));
															}}
															searchTypeOptions={searchTypeOptions}
															tooltipPlacement={
																searchTypeTooltipPlacement
															}
														>
															<Tooltip
																title={
																	<div className="chatbox-icon-tooltip-container">
																		Unlock in-depth reasoning on
																		any subject
																	</div>
																}
																color="transparent"
																arrow={false}
																rootClassName="chatbox-tooltip"
															>
																<div
																	className={`chat-box-icon-container`}
																	style={{
																		border: `1px solid ${
																			chatInfo?.reason
																				?.webSearch ||
																			chatInfo?.reason
																				?.workspaceSearch
																				? 'var(--primary-button)'
																				: 'var(--stroke)'
																		} `,
																	}}
																>
																	<div className="icon">
																		<AtomSvg
																			fill={
																				chatInfo?.reason
																					?.webSearch ||
																				chatInfo?.reason
																					?.workspaceSearch
																					? 'var(--primary-button)'
																					: 'var(--secondary-font)'
																			}
																		/>
																		{showIconText && (
																			<>
																				<div
																					className="icon-text"
																					style={{
																						color:
																							chatInfo
																								?.reason
																								?.webSearch ||
																							chatInfo
																								?.reason
																								?.workspaceSearch
																								? 'var(--primary-button)'
																								: 'var(--primary-font)',
																					}}
																				>
																					Reason
																				</div>
																				<div className="icon-arrow">
																					<ArrowDownSvg
																						fill={
																							chatInfo
																								?.reason
																								?.webSearch ||
																							chatInfo
																								?.reason
																								?.workspaceSearch
																								? 'var(--primary-button)'
																								: 'var(--secondary-font)'
																						}
																					/>
																				</div>
																			</>
																		)}
																	</div>
																</div>
															</Tooltip>
														</SearchTypeTooltip>
													)}

													{/* {chatInfo?.agentType !== 'search_agent' && (
														<Tooltip
															title={`${
																chatInfo?.deepResearch
																	? 'Disable Deep Research'
																	: 'Enable Deep Research'
															} `}
														>
															<div
																className={`chat-box-icon-container ${
																	chatInfo?.deepResearch
																		? 'active'
																		: ''
																}`}
																onClick={handleDeepResearchClick}
																style={{
																	opacity: `${
																		recentFilesRef.current
																			?.length > 0 ||
																		uploadedImagesRef.current
																			?.length > 0
																			? '0.5'
																			: '1'
																	}`,
																}}
															>
																<div className="icon">
																	<MicroscopeSvg
																		selected={
																			chatInfo?.deepResearch
																		}
																	/>
																</div>
															</div>
														</Tooltip>
													)} */}

													{/* <Tooltip title={'Add Filters'}>
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
													</Tooltip> */}

													{/* {!(
														chatInfo?.deepResearch ||
														chatInfo?.webSearch ||
														chatInfo?.workspaceSearch
													) && (
														<LLMTooltip
															selectedModel={
																chatInfo?.selectedLLMModel
															}
															handleOptionClick={
																handleLLMModelOptionClick
															}
															setIsLLMModelOpen={(value) => {
																if (
																	chatInfo?.deepResearch ||
																	chatInfo?.webSearch ||
																	chatInfo?.workspaceSearch ||
																	uploadedImagesRef?.current
																		?.length ||
																	recentFilesRef?.current?.length
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
																	className="chat-box-icon-container"
																	style={{
																		opacity: `${
																			chatInfo?.deepResearch ||
																			chatInfo?.webSearch ||
																			chatInfo?.workspaceSearch ||
																			uploadedImagesRef
																				?.current?.length ||
																			recentFilesRef?.current
																				?.length
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
													)} */}
												</div>

												<div className="right-container">
													{/* {chatInfo?.agentType !== 'knowledge_agent' &&
														!isPublicChat && (
															<div className="agent-container">
																<div
																	className={`agent ${
																		chatInfo?.agentType ===
																		'multi_agent'
																			? 'active'
																			: ''
																	}`}
																	onClick={() =>
																		handleAgentClick(
																			'multi_agent',
																		)
																	}
																>
																	Generalist
																</div>
																<div
																	className={`agent ${
																		chatInfo?.agentType ===
																		'search_agent'
																			? 'active'
																			: ''
																	}`}
																	onClick={() =>
																		handleAgentClick(
																			'search_agent',
																		)
																	}
																>
																	Thinker
																</div>
															</div>
														)} */}

													{info?.chatQuery?.trim()?.length > 0 ||
													isPublicChat ? (
														<div
															className="click-btn"
															onClick={(e) => handleSendBtnClick(e)}
															style={{
																backgroundColor:
																	'var(--primary-button)',
															}}
														>
															<ArrowUp />
														</div>
													) : (
														<div
															className="click-btn"
															onClick={(e) => handleMicIconClick(e)}
															style={{
																backgroundColor:
																	'var(--primary-button)',
															}}
														>
															<AudioSvg />
														</div>
													)}
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
				</div>
				{/* )} */}
			</div>
			<div className="chatbarContainer" style={{ width: '100%' }}>
				{uploadedImagesRef?.current?.length > 0 ? (
					<div className="imagePreviewBar">
						{uploadedImagesRef?.current?.map((ele, index) => (
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
				{recentFilesRef?.current?.length > 0 && (
					<div className="recent-files-container">
						{recentFilesRef?.current?.map((file) => (
							<div className="recent-file" key={file?._id}>
								<div className="file-type-icon">
									{fileTypeIcons?.[file?.sourceType]}
								</div>
								<div className="recent-file-name">
									<div className="file-title">
										{file?.originalFileName || file?.title || ''}
									</div>

									{file?.loading && <Spin />}
								</div>
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
