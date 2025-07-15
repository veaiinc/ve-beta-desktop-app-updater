import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
// import { createBlock } from '@blocknote/core';
import '@blocknote/mantine/style.css';
import { useCreateBlockNote } from '@blocknote/react';
import '../../../assets/scss/notes/noteComponent.scss';
import NoteToolbar from '../../components/notes/NoteToolbar';
import {
	useEffect,
	memo,
	useContext,
	useCallback,
	useState,
	useRef,
	useMemo,
	createContext,
} from 'react';
import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Context from '../../../context/context';
import moment from 'moment';
import CustomTextArea from '../../components/globalComponents/CustomTextArea';
import { ReactComponent as CrossIcon } from '../../../assets/svg/notes/cross.svg';
import { message } from '../../components/globalComponents/CustomToast';
import { Helmet } from 'react-helmet';
import ObjectID from 'bson-objectid';
import jwtDecode from 'jwt-decode';
import { Tooltip } from 'antd';
import UploadPopup from '../../components/notes/UploadPopup';
import CustomizeAppearance from '../../components/notes/CustomizeAppearance';
import IconUploadPopup from '../../components/notes/IconUploadPopup';
import { ImageBlock } from '../../components/notes/ImageComponent';
import { BlockNoteSchema, defaultBlockSpecs } from '@blocknote/core';
import { isEqual } from 'lodash';
import { Database } from '../../components/notes/Database';
import DatabaseSidebar from '../../components/modalsV2/notes/DatabaseSidebar';
import useWorkspaceMode from '../../../hooks/useWorkspaceMode';
import SlashMenu from '../../components/notes/SlashMenu';
// import '../../../assets/scss/notes/noteComponent.scss';
import MeetTranscript from './MeetTranscript';
import useLiveIntelligenceStream from '../../../hooks/useLiveIntelligenceStream';
import useRecallStream from '../../../hooks/useRecallStream';
import NoteTakerTranscript from './NoteTakerTranscript';
import RecentChat from '../chat/RecentChat';
import NotesHeader from '../../components/notes/DatabseComponents/NotesHeader';
export const NotesRefContext = createContext(null);

const initialState = {
	timeouts: {}, // Single timeouts object to store all timeouts
	title: '',
	updatedAt: '',
	notesConfigs: {
		smallText: false,
		fullWidth: false,
	},
	isFavorite: false,
	loading: true,
	aiResonse: '',
	myAccess: 'view',
	isDeleted: false,
	lastUpdated: null,
	deleteLoading: false,
	updatedBy: null,
	showUploadPopup: false,
	showCustomizeAppearance: false,
	coverImageError: false,
	localCoverImage: false, // cover image or link that is selected/uploaded before refreshing the page
	uploadType: null, // can be 'cover' or 'icon'
	showRemoveCoverBtn: false,
	showRemoveIconBtn: false,
	selectedEmoji: null,
	coverImageRemoved: false,
	iconImageRemoved: false,
	sessionId: ObjectID()?.toString(),
	chatSessionId: ObjectID()?.toString(),
	chatClicked: false,
};

const accessLevels = {
	full: 0,
	edit: 1,
	view: 2,
};

let userId = null;

const getRandomWidth = () => {
	const min = 70;
	const max = 100;
	return `${Math.floor(Math.random() * (max - min + 1) + min)}%`;
};

const skeletonLines = [...Array(10)]?.map(() => ({
	width: getRandomWidth(),
	height: 14,
}));

const NotesEditor = ({ outerContainerStyle, innerContainerStyle, showTranscriptTabs = false }) => {
	const { workspaceMode } = useWorkspaceMode();
	const [searchParams] = useSearchParams();
	const noteId = useParams()?.noteId;
	const sessionId = noteId;
	const type = searchParams.get('type');
	const navigate = useNavigate();
	const aiResponseRef = useRef('');
	const prevDocRef = useRef([]);
	const previousBlocksRef = useRef(new Map());
	const pendingUpdatesRef = useRef(new Map());
	const debounceTimerRef = useRef(null);
	const originalFaviconRef = useRef(null);
	// Map to track BlockNote id -> backend _id mapping
	const blockIdToBackendIdRef = useRef(new Map());

	// Helper function to get backend _id from BlockNote id
	const getBackendId = useCallback((blockNoteId) => {
		return blockIdToBackendIdRef.current.get(blockNoteId);
	}, []);

	// Helper function to calculate position between two positions
	const calculatePositionBetween = useCallback((pos1, pos2) => {
		return (pos1 + pos2) / 2;
	}, []);

	// Helper function to calculate position after a given position
	const calculatePositionAfter = useCallback((pos) => {
		return pos + 1000; // Use larger increments to avoid precision issues
	}, []);

	// Helper function to calculate position before a given position
	const calculatePositionBefore = useCallback((pos) => {
		return pos / 2; // Use division to get a position before
	}, []);

	// const { createWebSocketConnection, sendMessage } = useChatStream();

	const {
		notes: {
			getNotesPageData,
			notesPageData,
			notesAccess,
			saveNotesdata,
			updatePage,
			addToFavorite,
			removeFromFavorite,
			deletePage,
			duplicatePage,
			updateNotesState,
			getNotesAccess,
			globalAccess,
			uploadNotesImageBlock,
			deleteNotesImageBlock,
			notesDeleteCoverImage,
			notesDeleteIcon,
			getBlocks,
			blocks,
			createBlock,
			updateBlock,
			deleteBlock,
		},
		chatStream: { createWebSocketConnection, sendMessage, closeWebSocketConnection },
		companyInfo: { getTeamMembers, tenantsUserList },
		templates: { handleTranscriptionSuggestions },
		profileInfo: { tennantSettingsData, getTenantSettings },
	} = useContext(Context);

	const [info, setInfo] = useState(initialState);
	const [transcriptList, setTranscriptList] = useState([]);
	const [activeTab, setActiveTab] = useState('transcript');
	const location = useLocation();

	// Add hooks for live intelligence and recall stream
	const {
		createWebSocketConnection: recallConnection,
		sendMessage: recallSendMessage,
		closeWebSocketConnection: closeRecallConnection,
	} = useRecallStream();
	const { createWebSocketConnection: createLiveIntelligenceStream, updateCurrentContext } =
		useLiveIntelligenceStream();

	// Handler for transcript socket messages
	// const handleLiveIntelligenceMessageFunc = useCallback(
	// 	(event) => {
	// 		const data = JSON.parse(event?.data || null);
	// 		handleTranscriptionSuggestions(data);
	// 	},
	// 	[handleTranscriptionSuggestions],
	// );
	const handleSocketMessage = useCallback(
		(event) => {
			try {
				const msg = JSON.parse(event?.data || null);
				if (msg?.event === 'transcript.received' && msg?.data) {
					setTranscriptList((prev) => [
						...prev,
						{
							speakerName: msg?.data?.speakerName,
							transcript: msg?.data?.transcript,
							timestamp: msg?.data?.timestamp,
						},
					]);
					// const data = msg?.data;
					// if (data?.speakerName?.length > 0 || data?.transcript?.length > 0) {
					// 	updateCurrentContext &&
					// 		updateCurrentContext(
					// 			(data?.speakerName || '') + ' : ' + (data?.transcript || ''),
					// 		);
					// }
				} else if (msg?.event === 'live_intelligence.response' && msg?.data) {
					handleTranscriptionSuggestions(msg?.data);
				} else if (msg?.event === 'transcript.done') {
					closeRecallConnection();
				}
			} catch (e) {
				// ignore
			}
		},
		[updateCurrentContext],
	);

	// Derived states
	const coverImage = useMemo(() => {
		if (info?.coverImageRemoved) return false;
		return info?.localCoverImage
			? info.localCoverImage
			: info?.coverImageError
			? false
			: notesPageData?.data?.coverImage ?? false;
	}, [
		info?.localCoverImage,
		notesPageData?.data?.coverImage,
		info?.coverImageError,
		info?.coverImageRemoved,
	]);

	const iconImage = useMemo(() => {
		if (info?.iconImageRemoved) return false;
		let icon = notesPageData?.data?.iconImage;

		try {
			if (info?.selectedEmoji?.native) {
				return { native: info.selectedEmoji.native };
			}

			if (typeof icon === 'string') {
				icon = JSON.parse(icon);
				if (typeof icon === 'string') {
					icon = JSON.parse(icon);
				}
			}

			if (icon?.native) {
				return icon;
			}
		} catch (e) {
			console.error('Failed to parse iconImage:', e);
		}

		return null;
	}, [notesPageData?.data?.iconImage, info?.selectedEmoji?.native]);
	const schema = BlockNoteSchema.create({
		blockSpecs: {
			// Adds all default blocks.
			...defaultBlockSpecs,
			// Adds the Alert block.
			image: ImageBlock,
			database: Database,
		},
	});

	const editor = useCreateBlockNote({
		schema,
		tables: {
			splitCells: true,
			cellBackgroundColor: true,
			cellTextColor: true,
			headers: true,
		},
		// uploadFile,
	});

	useEffect(() => {
		if (noteId) {
			const isDatabase = true;
			getBlocks(
				{
					pageId: noteId,
					listBlockInput: { limit: 100, page: 1 },
				},
				isDatabase,
			);
		}
	}, [noteId]);
	useEffect(() => {
		if (!tennantSettingsData) {
			getTenantSettings();
		}
	}, [tennantSettingsData]);

	useEffect(() => {
		if (blocks) {
			const flatBlocks = flattenBlocksFromBackend(blocks.data); // flatten nested tree
			previousBlocksRef.current = new Map(flatBlocks.map((b) => [b.id, b]));
			loadNotesContent(blocks.data); // this can still use nested data if needed

			// Debug: Log the mapping
			console.log(
				'Block ID to Backend ID mapping:',
				Array.from(blockIdToBackendIdRef.current.entries()),
			);
		}
	}, [blocks]);

	useEffect(() => {
		const token = localStorage.getItem('usertoken');
		const { user_id } = jwtDecode(token);
		userId = user_id;
	}, []);

	useEffect(() => {
		const notesContainer = document.querySelector('.notes-container');
		const handleKeyDown = (e) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				const selected = editor?.getSelectedText()?.length > 0 || false;
				if (selected) {
					e.stopPropagation();
					return;
				}
			}
		};

		notesContainer.addEventListener('keydown', handleKeyDown);
		return () => notesContainer.removeEventListener('keydown', handleKeyDown);
	}, []);

	useEffect(() => {
		const originalFaviconTag = document.querySelector("link[rel~='icon']");

		if (originalFaviconRef.current === null) {
			originalFaviconRef.current = originalFaviconTag?.href ?? null;
		}

		if (!iconImage?.native) {
			document.querySelectorAll("link[rel~='icon']").forEach((el) => el.remove());

			if (originalFaviconRef.current) {
				const link = document.createElement('link');
				link.rel = 'icon';
				link.href = originalFaviconRef.current;
				document.head.appendChild(link);
			}
			return;
		}

		const canvasSize = 256;
		const canvas = document.createElement('canvas');
		canvas.width = canvasSize;
		canvas.height = canvasSize;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.font = '200px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(iconImage.native, canvasSize / 2, canvasSize / 2);

		const faviconUrl = canvas.toDataURL();

		document.querySelectorAll("link[rel~='icon']").forEach((el) => el.remove());
		const link = document.createElement('link');
		link.rel = 'icon';
		link.href = faviconUrl;
		document.head.appendChild(link);

		return () => {
			document.querySelectorAll("link[rel~='icon']").forEach((el) => el.remove());

			if (originalFaviconRef.current) {
				const restoreLink = document.createElement('link');
				restoreLink.rel = 'icon';
				restoreLink.href = originalFaviconRef.current;
				document.head.appendChild(restoreLink);
			}
		};
	}, [iconImage]);

	// useEffect(() => {
	// 	getNotesAccess({ pageId: noteId });
	// }, [noteId]);

	useEffect(() => {
		if (noteId) {
			getNotesPageDataFunc();
		}

		return () => {
			updateNotesState({
				notesPageData: null,
			});
		};
	}, [noteId]);

	// useEffect(() => {
	// 	const sessionId = ObjectID()?.toString();
	// 	if (noteId && workspaceMode) {
	// 		createWebSocketConnection(sessionId, handleAiResponse, '', false, workspaceMode);
	// 	}
	// 	return () => {
	// 		closeWebSocketConnection([sessionId]);
	// 	};
	// }, [noteId, workspaceMode]);

	useEffect(() => {
		if (!tenantsUserList) {
			getTeamMembers();
		} else if (info?.updatedBy) {
			const lastUpdated = tenantsUserList?.find((item) => item._id === info?.updatedBy);
			setInfo((prevInfo) => ({ ...prevInfo, lastUpdated }));
		}
	}, [tenantsUserList, info?.updatedBy]);

	useEffect(() => {
		if (noteId) {
			getNotesAccess({ pageId: noteId });
		}
	}, [noteId]);

	// Process access logic when relevant data changes
	useEffect(() => {
		if (notesAccess && userId && noteId) {
			const hasAccess = notesAccess.find((access) => access?.userId === userId);
			if (hasAccess) {
				let myAccess = hasAccess.access;

				if (globalAccess?.isEnabled) {
					const myAccessLevel = accessLevels?.[myAccess];
					const teamAccessLevel = accessLevels?.[globalAccess?.access];
					myAccess = myAccessLevel > teamAccessLevel ? globalAccess.access : myAccess;
				}

				setInfo((prev) => ({
					...prev,
					myAccess,
				}));
			}
		}
	}, [notesAccess, userId, noteId, globalAccess]);

	useEffect(() => {
		const handleKeyDown = (e) => {
			const isMac = navigator.platform.toUpperCase().includes('MAC');
			const isSaveShortcut =
				(isMac && e.metaKey && e.key === 's') || (!isMac && e.ctrlKey && e.key === 's');

			if (isSaveShortcut) {
				e.preventDefault();
				e.stopPropagation();
			}
		};

		window.addEventListener('keydown', handleKeyDown, true); // true = capture phase

		return () => {
			window.removeEventListener('keydown', handleKeyDown, true);
		};
	}, []);

	useEffect(() => {
		if (notesPageData?.data) {
			const {
				blocks = [],
				title = '',
				updatedAt = '',
				isFavorite = false,
				isDeleted = false,
				updatedBy = null,
			} = notesPageData?.data || {};
			if (blocks) {
				loadNotesContent(blocks);
			}
			setInfo((prev) => ({
				...prev,
				title,
				updatedAt,
				isFavorite,
				isDeleted,
				updatedBy,
			}));
		} else if (notesPageData?.error) {
			const messageText =
				notesPageData?.error?.message ||
				'Something went wrong while fetching this note, please try again';
			message.error(messageText);
			setTimeout(() => {
				window.history.length > 1 ? navigate(-1) : navigate('/');
			}, 3100);
		}
	}, [notesPageData]);

	useEffect(() => {
		return () => {
			// Clear all timeouts on unmount
			Object.values(info.timeouts).forEach(clearTimeout);
		};
	}, [info.timeouts]);

	// useEffect(() => {
	// 	const unsubscribe = editor.onChange(() => {
	// 		const currentBlocks = editor.document;
	// 		onEditorUpdate(currentBlocks);
	// 	});

	// 	return () => unsubscribe();
	// }, [editor]);

	useEffect(() => {
		const unsubscribe = editor.onChange(() => {
			const currentBlocks = editor.document;

			// Check for blocks exceeding depth limit
			const blocksToRevert = [];

			const checkDepth = (blocks, currentDepth = 0) => {
				blocks.forEach((block) => {
					if (currentDepth > 3) {
						// 0, 1, 2 = 3 levels max
						blocksToRevert.push(block.id);
					}
					if (block.children && block.children.length > 0) {
						checkDepth(block.children, currentDepth + 1);
					}
				});
			};

			checkDepth(currentBlocks);

			// Revert blocks that are too deep
			if (blocksToRevert.length > 0) {
				blocksToRevert.forEach((blockId) => {
					editor.removeBlocks([blockId]);
				});
				return; // Don't call onEditorUpdate for invalid changes
			}

			onEditorUpdate(currentBlocks);
		});

		return () => unsubscribe();
	}, [editor]);

	const flattenBlocksFromBackend = (blocks, parentId = null) => {
		const flat = [];

		for (const block of blocks) {
			const { children, ...rest } = block;

			// Store block with parentId info
			flat.push({
				...rest,
				parentId,
			});

			// Create mapping from BlockNote id to backend _id
			blockIdToBackendIdRef.current.set(block.id, block._id);

			if (children && children.length > 0) {
				flat.push(...flattenBlocksFromBackend(children, block.id));
			}
		}

		return flat;
	};

	const getNotesPageDataFunc = useCallback(async () => {
		const payload = {
			pageId: noteId,
		};
		const isDatabase = true;
		getNotesPageData(payload, isDatabase);
	}, [noteId]);

	const loadNotesContent = useCallback(
		(data) => {
			if (data?.length) {
				queueMicrotask(() => {
					editor.replaceBlocks(editor.document, data);
				});
			}
			setInfo((prev) => ({ ...prev, loading: false }));
		},
		[editor],
	);

	// Generic debounce function
	const handleDebounce = useCallback(
		(key, callback, delay = 500) => {
			clearTimeout(info.timeouts[key]);
			const timeout = setTimeout(callback, delay);
			setInfo((prev) => ({
				...prev,
				timeouts: { ...prev.timeouts, [key]: timeout },
			}));
		},
		[info.timeouts],
	);

	const handleContentChange = useCallback(
		(data) => {
			handleDebounce('content', () => {
				const payload = {
					pageId: noteId,
					blocks: data || [],
				};
				saveNotesdata(payload);
				setInfo((prev) => ({ ...prev, updatedAt: moment().unix() }));
			});
		},
		[noteId, handleDebounce],
	);

	const handleTitleChange = (e) => {
		const newTitle = e?.target?.value;
		setInfo((prev) => ({ ...prev, title: newTitle }));
		const isDatabase = true;
		handleDebounce(
			'title',
			() => {
				updatePage(
					{
						pageId: noteId,
						input: { title: newTitle },
					},
					isDatabase,
				);
				setInfo((prev) => ({ ...prev, updatedAt: moment().unix() }));
			},
			isDatabase,
		);
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault(); // optional: stops newline if it's a textarea
		}
	};

	const handleFavorite = useCallback(
		(value) => {
			setInfo((prev) => ({ ...prev, isFavorite: value }));

			handleDebounce('favorite', async () => {
				const payload = { pageId: noteId };
				const [success] = value
					? await addToFavorite(payload)
					: await removeFromFavorite(payload);

				if (!success) {
					setInfo((prev) => ({ ...prev, isFavorite: !value }));
				}
			});
		},
		[noteId, handleDebounce],
	);

	const extractImageUrls = (doc) => {
		const urls = [];
		for (const block of doc) {
			if (block.type === 'image' && block.props?.url) {
				urls.push(block.props.url);
			}
		}
		return urls;
	};

	const compareFn = (old, newBlock) => {
		const oldBlock = {
			id: old?.id,
			type: old?.type,
			props: old?.props,
			content: old?.content,
			// 🔥 IGNORE: children
		};

		const newBlockFormatted = {
			id: newBlock?.id,
			type: newBlock?.type,
			props: newBlock?.props,
			content: newBlock?.type === 'database' ? [] : newBlock?.content,
		};

		if (oldBlock.type !== newBlockFormatted.type) return true;
		if (!isEqual(oldBlock, newBlockFormatted)) {
			console.log('Content changed for block:', oldBlock.id);
			console.log('oldBlock', oldBlock);
			console.log('newBlockFormatted', newBlockFormatted);
			return true;
		}

		return false;
	};

	const flattenBlocks = (blocks, parentId = null, depth = 0) => {
		const flat = [];

		for (let i = 0; i < blocks.length; i++) {
			const block = blocks[i];
			flat.push({
				id: block.id,
				type: block.type,
				props: block.props,
				content: block.content,
				children: block.children,
				parentId,
				_depth: depth,
			});

			if (block.children?.length) {
				flat.push(...flattenBlocks(block.children, block.id, depth + 1));
			}
		}

		return flat;
	};

	const diffArraysNested = (flatNewArr) => {
		const newMap = new Map(flatNewArr.map((item, index) => [item.id, { ...item, index }]));

		const deleted = [];
		const added = [];
		const updated = [];

		const allIds = new Set([...previousBlocksRef.current.keys(), ...newMap.keys()]);

		// Group new blocks by parentId
		const groupedByParent = flatNewArr.reduce((acc, block) => {
			const key = block.parentId ?? 'root';
			acc[key] ||= [];
			acc[key].push(block);
			return acc;
		}, {});

		// Sort siblings
		Object.values(groupedByParent).forEach((group) => {
			group.sort((a, b) => a.index - b.index);
		});

		for (const id of allIds) {
			const oldItem = previousBlocksRef.current.get(id); // has _id and position
			const newItem = newMap.get(id); // does not have _id or position

			if (oldItem && !newItem) {
				// Deleted
				deleted.push(oldItem);
				previousBlocksRef.current.delete(id);
				// Remove from mapping
				blockIdToBackendIdRef.current.delete(id);
			} else if (!oldItem && newItem) {
				// Added
				const _id = ObjectID().toString();
				const siblings = groupedByParent[newItem.parentId ?? 'root'];
				const index = siblings.findIndex((b) => b.id === id);

				const prev =
					index > 0 ? previousBlocksRef.current.get(siblings[index - 1]?.id) : null;
				const next =
					index < siblings.length - 1
						? previousBlocksRef.current.get(siblings[index + 1]?.id)
						: null;

				let position;
				if (prev?.position && next?.position) {
					// Between two blocks
					position = calculatePositionBetween(prev.position, next.position);
				} else if (prev?.position) {
					// After the last block
					position = calculatePositionAfter(prev.position);
				} else if (next?.position) {
					// Before the first block
					position = calculatePositionBefore(next.position);
				} else {
					// First block in the group
					position = 1000;
				}

				// Debug logging for new block position
				console.log('New block position calculated:', {
					id,
					position,
					prevPosition: prev?.position,
					nextPosition: next?.position,
					index,
				});

				const parentBackendId = newItem.parentId
					? blockIdToBackendIdRef.current.get(newItem.parentId)
					: null;

				const newBlock = {
					_id,
					id,
					type: newItem.type,
					props: newItem.props,
					content: newItem.content,
					children: newItem.children,
					parentId: parentBackendId, // ✅ use backend _id directly
					position,
				};

				added.push(newBlock);
				previousBlocksRef.current.set(id, newBlock);
				// Update the mapping for new blocks
				blockIdToBackendIdRef.current.set(id, _id);
			} else if (oldItem && newItem) {
				// Possible update
				const siblings = groupedByParent[newItem.parentId ?? 'root'];
				const index = siblings.findIndex((b) => b.id === id);

				let position = oldItem.position;
				let positionChanged = false;

				// Check for content and parent changes
				const contentChanged = compareFn(oldItem, newItem);

				// Compare parentId correctly - oldItem.parentId is _id, newItem.parentId is id
				let parentChanged = false;
				if (oldItem.parentId !== null && newItem.parentId !== null) {
					// Use the mapping to get the backend _id for the new parent
					const newParentBackendId = blockIdToBackendIdRef.current.get(newItem.parentId);
					parentChanged = oldItem.parentId !== newParentBackendId;

					// Debug logging for parent comparison
					if (parentChanged) {
						console.log('Parent changed for block:', id);
						console.log('oldItem.parentId (_id):', oldItem.parentId);
						console.log('newItem.parentId (id):', newItem.parentId);
						console.log('newParentBackendId:', newParentBackendId);
					}
				} else {
					// One is null, the other is not
					parentChanged = oldItem.parentId !== newItem.parentId;
				}

				// Always check for position changes (for reordering)
				const prev =
					index > 0 ? previousBlocksRef.current.get(siblings[index - 1]?.id) : null;
				const next =
					index < siblings.length - 1
						? previousBlocksRef.current.get(siblings[index + 1]?.id)
						: null;

				// Check if current position is valid relative to neighbors
				if (prev?.position && next?.position) {
					// Between two blocks - should be between prev and next
					if (position <= prev.position || position >= next.position) {
						position = calculatePositionBetween(prev.position, next.position);
						positionChanged = true;
					}
				} else if (prev?.position) {
					// After the last block - should be after prev
					if (position <= prev.position) {
						position = calculatePositionAfter(prev.position);
						positionChanged = true;
					}
				} else if (next?.position) {
					// Before the first block - should be before next
					if (position >= next.position) {
						position = calculatePositionBefore(next.position);
						positionChanged = true;
					}
				} else {
					// Only block in the group - should be at a reasonable position
					if (position < 1000) {
						position = 1000;
						positionChanged = true;
					}
				}

				// Debug logging for position changes
				if (positionChanged) {
					console.log('Position changed for block:', id);
					console.log('Old position:', oldItem.position);
					console.log('New position:', position);
					console.log('Prev block position:', prev?.position);
					console.log('Next block position:', next?.position);
				}

				const isChanged = positionChanged || contentChanged || parentChanged;

				// Debug logging for all changes
				if (isChanged) {
					console.log('Block changed:', id, {
						positionChanged,
						contentChanged,
						parentChanged,
						oldPosition: oldItem.position,
						newPosition: position,
					});
				}

				if (isChanged) {
					const parentBackendId = newItem.parentId
						? blockIdToBackendIdRef.current.get(newItem.parentId)
						: null;

					const updatedBlock = {
						_id: oldItem._id,
						id,
						type: newItem.type,
						props: newItem.props,
						content: newItem.content,
						children: newItem.children,
						parentId: parentBackendId, // ✅ use backend _id directly
						position,
					};

					updated.push(updatedBlock);
					previousBlocksRef.current.set(id, updatedBlock);
				}
			}
		}

		return { added, deleted, updated };
	};

	const diffArrays = (newArr) => {
		// Create a map of new items with their indexes
		const newMap = new Map(newArr.map((item, index) => [item.id, { ...item, index }]));

		// Initialize result arrays
		const deleted = [];
		const added = [];
		const updated = [];

		// Get all ids from both old and new maps
		const allIds = new Set([...previousBlocksRef.current.keys(), ...newMap.keys()]);

		// Create an array of previous blocks sorted by position
		const sortedPreviousBlocks = [...previousBlocksRef.current.values()].sort(
			(a, b) => a.position - b.position,
		);

		// Create a map of id to previous index
		const prevIndexMap = new Map();
		sortedPreviousBlocks.forEach((block, index) => {
			prevIndexMap.set(block.id, index);
		});

		// Process each id to determine its status
		for (const id of allIds) {
			const oldItem = previousBlocksRef.current.get(id);
			const newItem = newMap.get(id);

			if (oldItem && !newItem) {
				// Item was deleted
				deleted.push(oldItem);
				previousBlocksRef.current.delete(id);
			} else if (!oldItem && newItem) {
				// Item was added
				const _id = ObjectID().toString();
				const index = newItem.index;

				// Find surrounding blocks to determine position
				const prevId = index > 0 ? newArr[index - 1]?.id : null;
				const nextId = index < newArr.length - 1 ? newArr[index + 1]?.id : null;

				const prevBlock = prevId ? previousBlocksRef.current.get(prevId) : null;
				const nextBlock = nextId ? previousBlocksRef.current.get(nextId) : null;

				const prevPosition = prevBlock?.position;
				const nextPosition = nextBlock?.position;

				// Calculate position based on surrounding blocks
				let position;
				if (prevPosition && nextPosition) {
					position = calculatePositionBetween(prevPosition, nextPosition);
				} else if (prevPosition) {
					position = calculatePositionAfter(prevPosition);
				} else if (nextPosition) {
					position = calculatePositionBefore(nextPosition);
				} else {
					position = 1000;
				}

				const { type, props, children, content, id } = newItem;
				const newItemFormatted = { _id, position, type, props, children, content, id };

				added.push(newItemFormatted);
				previousBlocksRef.current.set(id, newItemFormatted);
			} else if (oldItem && newItem) {
				// Item exists in both old and new arrays
				const { type, props, children, content, id } = newItem;
				const index = newItem.index;

				// Check if this item has changed position
				let positionChanged = false;
				let position = oldItem.position;

				// Get the old index (if it exists)
				const oldIndex = prevIndexMap.get(id);

				// If old index is different from new index, position may need to change
				if (oldIndex !== undefined && oldIndex !== index) {
					// Find surrounding blocks to determine if position needs to change
					const prevId = index > 0 ? newArr[index - 1]?.id : null;
					const nextId = index < newArr.length - 1 ? newArr[index + 1]?.id : null;

					const prevBlock = prevId ? previousBlocksRef.current.get(prevId) : null;
					const nextBlock = nextId ? previousBlocksRef.current.get(nextId) : null;

					const prevPosition = prevBlock?.position;
					const nextPosition = nextBlock?.position;

					// Only change position if it's not properly ordered relative to neighbors
					if (prevPosition && nextPosition) {
						if (position <= prevPosition || position >= nextPosition) {
							position = calculatePositionBetween(prevPosition, nextPosition);
							positionChanged = true;
						}
					} else if (prevPosition) {
						if (position <= prevPosition) {
							position = calculatePositionAfter(prevPosition);
							positionChanged = true;
						}
					} else if (nextPosition) {
						if (position >= nextPosition) {
							position = calculatePositionBefore(nextPosition);
							positionChanged = true;
						}
					} else {
						// This is the only block
						if (position < 1000) {
							position = 1000;
							positionChanged = true;
						}
					}
				}

				// Only update if position changed or content changed
				const isChanged = positionChanged || compareFn(oldItem, newItem);

				if (isChanged) {
					const newItemFormatted = {
						_id: oldItem._id,
						position,
						type,
						props,
						children,
						content,
						id,
					};
					updated.push(newItemFormatted);
					previousBlocksRef.current.set(id, newItemFormatted);
				}
			}
		}

		return { deleted, added, updated };
	};

	const queueBlockUpdate = (block, noteId, delay = 500) => {
		pendingUpdatesRef.current.set(block._id, block);

		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}

		debounceTimerRef.current = setTimeout(() => {
			const updatesToSend = Array.from(pendingUpdatesRef.current.values());

			updatesToSend.forEach(({ _id, ...rest }) => {
				updateBlock({
					updateBlockId: _id,
					pageId: noteId,
					input: {
						...rest,
						content: Array.isArray(rest?.content)
							? { textContent: rest?.content }
							: rest.content,
					},
				});
			});

			pendingUpdatesRef.current.clear();
		}, delay);
	};

	const onEditorUpdate = (currentTopLevelBlocks) => {
		const flatNewArr = flattenBlocks(currentTopLevelBlocks);
		const { added, deleted, updated } = diffArraysNested(flatNewArr);
		console.log('added', added);
		console.log('deleted', deleted);
		console.log('updated', updated);

		added.forEach((block) => {
			createBlock({
				pageId: noteId,
				input: {
					...block,
					content: Array.isArray(block?.content)
						? { textContent: block?.content }
						: block.content,
				},
			});
		});

		updated.forEach((block) => {
			queueBlockUpdate(block, noteId);
		});

		deleted.forEach((block) => {
			pendingUpdatesRef.current.delete(block._id);
			deleteBlock({
				pageId: noteId,
				deleteBlockId: block._id,
			});
		});

		setInfo((prev) => ({ ...prev, updatedAt: moment().unix() }));
	};

	// const onChange = () => {
	// 	if (editor?.document?.length) {
	// 		const newDoc = editor.document;
	// 		const prevImages = extractImageUrls(prevDocRef.current);
	// 		const newImages = extractImageUrls(newDoc);
	// 		const removedImages = prevImages.filter((url) => !newImages.includes(url));
	// 		for (const url of removedImages) {
	// 			const payload = {
	// 				pageId: noteId,
	// 				imageInput: {
	// 					imageUrl: url,
	// 					type: 'block',
	// 				},
	// 			};
	// 			deleteNotesImageBlock(payload);
	// 		}
	// 		handleContentChange(newDoc);
	// 		prevDocRef.current = newDoc;
	// 	}
	// };

	const handleMoreOptionsChange = useCallback(
		(key, value) => {
			setInfo((prev) => ({
				...prev,
				notesConfigs: { ...prev.notesConfigs, [key]: value },
			}));
		},
		[setInfo],
	);

	const handleDeletePage = useCallback(
		async (permanent = false) => {
			if (info?.deleteLoading) return;
			setInfo((prev) => ({ ...prev, deleteLoading: true }));
			const isDatabase = true;
			// const [success] = await deletePage({ pageId: noteId, isPermanent: permanent });
			const [success] = await deletePage(
				{ pageId: noteId, isPermanent: permanent },
				isDatabase,
			);
			if (success) {
				message.success(`Page ${permanent ? 'permanently ' : ''}deleted successfully`);
				navigate('/notes');
			} else {
				message.error('Failed to delete page');
			}
			setInfo((prev) => ({ ...prev, deleteLoading: false }));
		},
		[info?.deleteLoading, info?.notesConfigs, navigate, noteId, setInfo],
	);

	const handleDuplicatePage = useCallback(async () => {
		if (info?.loading) return;
		setInfo((prev) => ({ ...prev, loading: true }));
		const [success, data] = await duplicatePage({ pageId: noteId });
		if (success) {
			message.success('Page duplicated successfully');
			// navigate(`/note/${data?._id}`);
		} else {
			message.error('Failed to duplicate page');
		}
		setInfo((prev) => ({ ...prev, loading: false }));
	}, [info?.loading, info?.notesConfigs, navigate, noteId, setInfo]);

	const handleAiResponse = (event) => {
		let { data = '' } = event || {};
		const dataObject = JSON.parse(data);

		if (dataObject.hasOwnProperty('answer')) {
			aiResponseRef.current = aiResponseRef.current + dataObject?.answer;

			if (dataObject?.stream_end) {
				setInfo((prevInfo) => ({
					...prevInfo,
					aiResonse: aiResponseRef.current,
				}));
			}
		}
	};

	const resetAiResponse = useCallback(() => {
		setInfo((prevInfo) => ({ ...prevInfo, aiResonse: '' }));
		aiResponseRef.current = '';
	}, []);

	const customSendMessage = useCallback((query) => {
		const location = localStorage?.getItem('locationDetails') || {};
		const locationData = JSON?.parse(location);
		sendMessage({
			date: [],
			deep_research: false,
			knowledge_base_search: false,
			modules: [],
			query,
			timezone: 'Asia/Calcutta',
			web_search: true,
			location: locationData,
		});
	}, []);

	const restorePage = useCallback(async () => {
		if (info?.deleteLoading) return;
		setInfo((prev) => ({ ...prev, deleteLoading: true }));
		const isDatabase = true;
		const response = await updatePage(
			{
				pageId: noteId,
				input: { isDeleted: false },
			},
			isDatabase,
		);
		if (response?.[0]) {
			setInfo((prev) => ({
				...prev,
				updatedAt: moment().unix(),
				isDeleted: false,
				deleteLoading: false,
			}));
			message?.success('Page restored!');
		} else {
			setInfo((prev) => ({ ...prev, deleteLoading: false }));
			message?.error(`Couldn't restore page`);
		}
	}, [info?.deleteLoading, noteId]);

	const handleCoverImageError = () => {
		setInfo((prev) => ({ ...prev, coverImageError: true }));
	};

	const checkImage = (url) => {
		return new Promise((resolve) => {
			const img = new Image();
			img.onload = () => resolve(true);
			img.onerror = () => resolve(false);
			img.src = url + '?cache_bust=' + Date?.now(); // avoid caching
		});
	};

	async function uploadFile(file) {
		const response = await uploadNotesImageBlock(
			{
				pageId: noteId,
				uploadPageBlockImageInput: {
					imageName: file?.name,
					imageSize: file?.size,
				},
			},
			file,
		);

		if (response?.[0]) {
			const url = response?.[1];
			let attempt = 0;
			const maxAttempts = 10;
			let isValid = false;

			while (attempt < maxAttempts) {
				isValid = await checkImage(url);
				if (isValid) {
					break;
				}
				attempt++;
				await new Promise((resolve) => setTimeout(resolve, 1000));
			}
			return url;
		}

		return undefined;
	}

	const handleRemoveCover = async () => {
		const response = await notesDeleteCoverImage({ pageId: noteId });
		const success = response?.[0];
		if (success) {
			message.success('Cover image removed successfully');
			setInfo((prev) => ({
				...prev,
				showRemoveCoverBtn: false,
				localCoverImage: false,
				coverImageError: false,
				coverImageRemoved: true,
			}));
		} else {
			message.error('Failed to remove cover image');
		}
	};

	const handleRemoveIcon = async () => {
		const response = await notesDeleteIcon({ pageId: noteId });
		const success = response?.[0];
		if (success) {
			message.success('Icon removed successfully');
			setInfo((prev) => ({
				...prev,
				showRemoveIconBtn: false,
				selectedEmoji: null,
				iconImageRemoved: true,
			}));
		} else {
			message.error('Failed to remove icon');
		}
	};

	useEffect(() => {
		if (showTranscriptTabs && location?.pathname?.includes('meet') && type === 'meeting_bot') {
			recallConnection(sessionId, noteId, handleSocketMessage);
			// createLiveIntelligenceStream(
			// 	sessionId,
			// 	noteId,
			// 	handleLiveIntelligenceMessageFunc,
			// 	false,
			// );
		} else if (showTranscriptTabs && type === 'desktop') {
			// Connect to recall for note taker mode as well
			recallConnection(sessionId, noteId, handleSocketMessage);
		}
		// No cleanup needed, useRecallStream handles it
	}, [showTranscriptTabs, sessionId, type]);

	const handleChatBoxClick = () => {
		if (info?.chatClicked) return;

		setInfo((prev) => ({
			...prev,
			chatClicked: true,
		}));
	};

	return (
		<NotesRefContext.Provider value={{ previousBlocksRef, pageId: noteId }}>
			<div className="notes-container" style={outerContainerStyle || {}}>
				<div className="notesChatArea">
					<RecentChat
						showIconText={false}
						isPreview={true}
						autoFocus={false}
						customChatBoxClick={handleChatBoxClick}
						// {...(info?.chatClicked && {
						// 	sId: info?.chatSessionId,
						// })}
						sId={info?.chatSessionId}
						showCitationsButton={false}
					/>
				</div>
				<div className="notesContentWrapper">
					{info?.title && (
						<Helmet>
							<meta charSet="utf-8" />
							<title>VE - {info?.title}</title>
						</Helmet>
					)}

					<NotesHeader
						isDeleted={info?.isDeleted}
						title={info?.title}
						isFavorite={info?.isFavorite}
						noteId={noteId}
						notesConfigs={info?.notesConfigs}
						myAccess={info?.myAccess}
						lastUpdated={info?.lastUpdated}
						updatedAt={info?.updatedAt}
						handleFavorite={handleFavorite}
						handleMoreOptionsChange={handleMoreOptionsChange}
						handleDeletePage={handleDeletePage}
						handleDuplicatePage={handleDuplicatePage}
						restorePage={restorePage}
					/>

					<div className="notes-editor-container">
						<>
							{coverImage && (
								<div
									onMouseEnter={() =>
										setInfo((prev) => ({ ...prev, showRemoveCoverBtn: true }))
									}
									onMouseLeave={() =>
										setInfo((prev) => ({ ...prev, showRemoveCoverBtn: false }))
									}
									className="notes-cover-image-container"
								>
									<img
										src={coverImage}
										onError={handleCoverImageError}
										alt="cover image"
									/>
									{info?.showRemoveCoverBtn && (
										<button
											onClick={handleRemoveCover}
											className="remove-cover-btn"
										>
											Remove
										</button>
									)}
								</div>
							)}
							<div
								className="notes-editor-wrapper"
								style={{
									maxWidth: info?.notesConfigs?.fullWidth ? '100%' : '898px',
								}}
							>
								<Tooltip
									// open={info?.showCustomizeAppearance}
									open={false}
									onOpenChange={() => {
										if (info?.showUploadPopup) {
											setInfo((prev) => ({
												...prev,
												showUploadPopup: false,
											}));
										}
										setInfo((prev) => ({
											...prev,
											showCustomizeAppearance: !prev.showCustomizeAppearance,
										}));
									}}
									placement="bottomLeft"
									title={
										info?.showUploadPopup && info?.uploadType === 'cover' ? (
											<UploadPopup
												closePopup={() =>
													setInfo((prev) => ({
														...prev,
														showUploadPopup: false,
														showCustomizeAppearance: false,
													}))
												}
												setLocalCoverImage={(coverImage) =>
													setInfo((prev) => ({
														...prev,
														localCoverImage: coverImage,
														coverImageRemoved: false,
													}))
												}
												uploadType={info?.uploadType}
											/>
										) : info?.showUploadPopup && info?.uploadType === 'icon' ? (
											<IconUploadPopup
												setSelectedEmoji={(emoji) =>
													setInfo((prev) => ({
														...prev,
														selectedEmoji: emoji,
													}))
												}
												closePopup={() =>
													setInfo((prev) => ({
														...prev,
														showUploadPopup: false,
														showCustomizeAppearance: false,
													}))
												}
											/>
										) : (
											<CustomizeAppearance
												// uploadType can be 'cover' or 'icon'
												showUploadPopup={(uploadType) =>
													setInfo((prev) => ({
														...prev,
														showUploadPopup: true,
														uploadType,
													}))
												}
											/>
										)
									}
									overlayInnerStyle={{
										backgroundColor: 'inherit',
									}}
									arrow={false}
								>
									<div
										className="notes-icon-container"
										style={{
											paddingTop: coverImage
												? '42px'
												: iconImage
												? '100px'
												: '0px',
										}}
									>
										{iconImage && (
											<div
												className="notes-icon-wrapper"
												onMouseEnter={() =>
													setInfo((prev) => ({
														...prev,
														showRemoveIconBtn: true,
													}))
												}
												onMouseLeave={() =>
													setInfo((prev) => ({
														...prev,
														showRemoveIconBtn: false,
													}))
												}
												style={{
													top: coverImage
														? '-72px'
														: iconImage
														? '-10px'
														: '-24px',
												}}
											>
												{info?.showRemoveIconBtn && (
													<div className="remove-icon-btn-container">
														<CrossIcon
															className="remove-icon-btn"
															onClick={handleRemoveIcon}
														/>
													</div>
												)}
												{iconImage?.native}
											</div>
										)}
										<CustomTextArea
											className="notes-title"
											value={info?.title}
											onChange={handleTitleChange}
											autoResize={true}
											onKeyDown={handleKeyDown}
										/>
									</div>
								</Tooltip>

								{showTranscriptTabs && (
									<div className="notes-tabs-container">
										<div
											className="notes-tabs-header"
											style={{
												display: 'flex',
												gap: 24,
												borderBottom: '1px solid var(--stroke, #2c2d2e)',
												marginBottom: 12,
											}}
										>
											<button
												className={
													activeTab === 'transcript'
														? 'notes-tab active'
														: 'notes-tab'
												}
												style={{
													background: 'none',
													border: 'none',
													outline: 'none',
													color: 'inherit',
													fontWeight: 500,
													fontSize: 16,
													padding: '8px 0',
													borderBottom:
														activeTab === 'transcript'
															? '2px solid var(--primary-button, #cfff48)'
															: '2px solid transparent',
													cursor: 'pointer',
													transition: 'color 0.2s',
												}}
												onClick={() => setActiveTab('transcript')}
											>
												Transcript
											</button>

											<button
												className={
													activeTab === 'summary'
														? 'notes-tab active'
														: 'notes-tab'
												}
												style={{
													background: 'none',
													border: 'none',
													outline: 'none',
													color: 'inherit',
													fontWeight: 500,
													fontSize: 16,
													padding: '8px 0',
													borderBottom:
														activeTab === 'summary'
															? '2px solid var(--primary-button, #cfff48)'
															: '2px solid transparent',
													cursor: 'pointer',
													transition: 'color 0.2s',
												}}
												onClick={() => setActiveTab('summary')}
											>
												Summary
											</button>
										</div>
									</div>
								)}

								{showTranscriptTabs && activeTab === 'transcript' ? (
									type === 'meeting_bot' ? (
										<MeetTranscript transcriptList={transcriptList} />
									) : type === 'desktop' ? (
										<NoteTakerTranscript
											sendMessage={recallSendMessage}
											tenantId={tennantSettingsData?._id}
											sessionId={sessionId}
											pageId={noteId}
										/>
									) : null
								) : (
									<BlockNoteView
										editor={editor}
										formattingToolbar={false}
										// onChange={onChange}
										style={innerContainerStyle || {}}
										theme={'dark'}
										editable={info?.myAccess !== 'view' || !info?.isDeleted}
										slashMenu={false}
									>
										{(info?.myAccess !== 'view' || !info?.isDeleted) && (
											<NoteToolbar
												sendMessage={customSendMessage}
												aiResonse={info?.aiResonse}
												resetAiResponse={resetAiResponse}
											/>
										)}
										<SlashMenu editor={editor} noteId={noteId} />
									</BlockNoteView>
								)}
							</div>
						</>
					</div>
				</div>
			</div>
			<DatabaseSidebar pageId={noteId} />
		</NotesRefContext.Provider>
	);
};

export default memo(NotesEditor);
