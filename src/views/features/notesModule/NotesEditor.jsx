import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
// import { createBlock } from '@blocknote/core';
import '@blocknote/mantine/style.css';
import { useCreateBlockNote } from '@blocknote/react';
import '../../../assets/scss/notes/noteComponent.scss';
import NoteToolbar from '../../components/notes/NoteToolbar';
import ShareComponent from '../../components/notes/ShareComponent';
import { useEffect, memo, useContext, useCallback, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import moment from 'moment';
import CustomTextArea from '../../components/globalComponents/CustomTextArea';
import MoreOptions from '../../components/notes/MoreOptions';
import { StarSvg } from '../../../assets/svg/notes/Star';
import { message } from '../../components/globalComponents/CustomToast';
import { Helmet } from 'react-helmet';
import Skeleton from 'react-loading-skeleton';
import useChatStream from '../../hooks/useChatStream';
import ObjectID from 'bson-objectid';
const preprocessMarkdown = (markdown) => {
	return markdown?.replace(/\\n/g, '\n'); // Add a non-breaking space for empty lines
};

const getRandomWidth = () => {
	const min = 70;
	const max = 100;
	return `${Math.floor(Math.random() * (max - min + 1) + min)}%`;
};

const skeletonLines = [...Array(10)]?.map(() => ({
	width: getRandomWidth(),
	height: 14,
}));

// async function uploadFile(file) {
// 	const body = new FormData();
// 	body.append('file', file);

// 	const ret = await fetch('https://tmpfiles.org/api/v1/upload', {
// 		method: 'POST',
// 		body: body,
// 	});
// 	return (await ret.json()).data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
// }

const NotesEditor = ({ outerContainerStyle, innerContainerStyle }) => {
	const {
		notes: {
			getNotesPageData,
			notesPageData,
			saveNotesdata,
			updatePage,
			addToFavorite,
			removeFromFavorite,
			deletePage,
			duplicatePage,
			updateNotesState,
		},
	} = useContext(Context);

	const { createWebSocketConnection, sendMessage } = useChatStream();

	const editor = useCreateBlockNote({
		tables: {
			splitCells: true,
			cellBackgroundColor: true,
			cellTextColor: true,
			headers: true,
		},
		// uploadFile,
	});
	const [info, setInfo] = useState({
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
	});

	const { noteId } = useParams();
	const navigate = useNavigate();

	const aiResponseRef = useRef('');

	useEffect(() => {
		if (noteId) {
			const sessionId = ObjectID()?.toString();
			getNotesPageDataFunc();
			createWebSocketConnection(sessionId, handleAiResponse);
		}

		return () => {
			updateNotesState({
				notesPageData: null,
			});
		};
	}, [noteId]);

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
			} = notesPageData?.data || {};
			if (blocks) {
				loadNotesContent(blocks);
			}
			setInfo((prev) => ({
				...prev,
				title,
				updatedAt,
				isFavorite,
			}));
		} else if (notesPageData?.error) {
			const messageText =
				notesPageData?.error?.message ||
				'Something went wrong while fetching this note, please try again';

			message.error(messageText);

			if (window.history.length > 1) {
				navigate(-1);
			} else {
				navigate('/');
			}
		}
	}, [notesPageData]);

	useEffect(() => {
		return () => {
			// Clear all timeouts on unmount
			Object.values(info.timeouts).forEach(clearTimeout);
		};
	}, [info.timeouts]);

	const getNotesPageDataFunc = useCallback(async () => {
		const payload = {
			pageId: noteId,
		};
		getNotesPageData(payload);
	}, [noteId]);

	const loadNotesContent = useCallback(
		(data) => {
			if (data?.length) {
				editor.replaceBlocks(editor.document, data);
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

		handleDebounce('title', () => {
			updatePage({
				pageId: noteId,
				input: { title: newTitle },
			});
			setInfo((prev) => ({ ...prev, updatedAt: moment().unix() }));
		});
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

	const onChange = async () => {
		if (editor?.document?.length) {
			handleContentChange(editor.document);
		}
	};

	const handleMoreOptionsChange = useCallback(
		(key, value) => {
			setInfo((prev) => ({
				...prev,
				notesConfigs: { ...prev.notesConfigs, [key]: value },
			}));
		},
		[setInfo],
	);

	const handleDeletePage = useCallback(async () => {
		if (info?.loading) return;
		setInfo((prev) => ({ ...prev, loading: true }));
		const [success] = await deletePage({ pageId: noteId });
		if (success) {
			message.success('Page deleted successfully');
			navigate('/');
		} else {
			message.error('Failed to delete page');
		}
		setInfo((prev) => ({ ...prev, loading: false }));
	}, [info?.loading, info?.notesConfigs, navigate, noteId, setInfo]);

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
		sendMessage({
			date: [],
			deep_research: false,
			knowledge_base_search: false,
			modules: [],
			query,
			timezone: 'Asia/Calcutta',
			web_search: true,
		});
	}, []);

	return (
		<div className="notes-container" style={outerContainerStyle || {}}>
			{info?.title && (
				<Helmet>
					<meta charSet="utf-8" />
					<title>VE - {info?.title}</title>
				</Helmet>
			)}

			<div className="notes-nav-menu">
				<div className="notes-nav-title">{info?.title}</div>

				<div className="notes-nav-right">
					<button
						className="notes-nav-button"
						onClick={() => handleFavorite(!info?.isFavorite)}
					>
						<StarSvg
							fill={info?.isFavorite}
							width={18}
							height={18}
							className="cursor-pointer"
						/>
					</button>

					<ShareComponent pageId={noteId} />

					<MoreOptions
						notesConfigs={info?.notesConfigs}
						onChange={handleMoreOptionsChange}
						onDelete={handleDeletePage}
						onDuplicate={handleDuplicatePage}
					/>
				</div>
			</div>

			<div className="notes-editor-container">
				{info?.loading ? (
					<div
						className="notes-editor-wrapper"
						style={{ maxWidth: info?.notesConfigs?.fullWidth ? '100%' : '898px' }}
					>
						<div className="notes-title">
							<Skeleton
								width="90%"
								height={40}
								highlightColor="var(--card-hover)"
								baseColor="var(--card)"
							/>
						</div>

						<div className="notes-line-loader">
							{skeletonLines.map((line, i) => (
								<Skeleton
									key={i}
									height={line.height}
									width={line.width}
									highlightColor="var(--card-hover)"
									baseColor="var(--card)"
								/>
							))}
						</div>
					</div>
				) : (
					<div
						className="notes-editor-wrapper"
						style={{ maxWidth: info?.notesConfigs?.fullWidth ? '100%' : '898px' }}
					>
						<CustomTextArea
							className="notes-title"
							value={info?.title}
							onChange={handleTitleChange}
							autoResize={true}
							onKeyDown={handleKeyDown}
						/>
						<BlockNoteView
							editor={editor}
							formattingToolbar={false}
							onChange={onChange}
							style={innerContainerStyle || {}}
							theme={'dark'}
						>
							<NoteToolbar
								sendMessage={customSendMessage}
								aiResonse={info?.aiResonse}
								resetAiResponse={resetAiResponse}
							/>
						</BlockNoteView>
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(NotesEditor);
