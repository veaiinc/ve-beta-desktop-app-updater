import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
// import { createBlock } from '@blocknote/core';
import '@blocknote/mantine/style.css';
import { useCreateBlockNote } from '@blocknote/react';
import '../../../assets/scss/notes/noteComponent.scss';
import NoteToolbar from '../../components/notes/NoteToolbar';
import ShareComponent from '../../components/notes/ShareComponent';
import { useEffect, memo, useContext, useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import moment from 'moment';
import CustomTextArea from '../../components/globalComponents/CustomTextArea';
import MoreOptions from '../../components/notes/MoreOptions';
import { StarSvg } from '../../../assets/svg/notes/Star';
import { message } from '../../components/globalComponents/CustomToast';
import { Helmet } from 'react-helmet';
const preprocessMarkdown = (markdown) => {
	return markdown?.replace(/\\n/g, '\n'); // Add a non-breaking space for empty lines
};

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
		},
	} = useContext(Context);
	const editor = useCreateBlockNote({
		tables: {
			splitCells: true,
			cellBackgroundColor: true,
			cellTextColor: true,
			headers: true,
		},
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
		loading: false,
	});

	const { noteId } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		if (noteId) {
			getNotesPageDataFunc();
		}
	}, [noteId]);

	useEffect(() => {
		if (notesPageData) {
			const {
				blocks = [],
				title = '',
				updatedAt = '',
				isFavorite = false,
			} = notesPageData || {};
			if (blocks) {
				loadNotesContent(blocks);
			}
			setInfo((prev) => ({
				...prev,
				title,
				updatedAt,
				isFavorite,
			}));
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
		async (data) => {
			editor.replaceBlocks(editor.document, data);
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

	return (
		<div className="notes-container" style={outerContainerStyle || {}}>
			{info?.title && (
				<Helmet>
					<meta charSet="utf-8" />
					<title>VE - {info?.title}</title>
				</Helmet>
			)}
			<div className="notes-nav-menu">
				<span className="notes-nav-menu-item-last-edited">
					{info?.updatedAt ? `Edited ${moment.unix(info?.updatedAt).fromNow()}` : ''}
				</span>
				<ShareComponent pageId={noteId} />
				<StarSvg
					fill={info?.isFavorite}
					width={18}
					height={18}
					onClick={() => handleFavorite(!info?.isFavorite)}
					className="cursor-pointer"
				/>
				<MoreOptions
					notesConfigs={info?.notesConfigs}
					onChange={handleMoreOptionsChange}
					onDelete={handleDeletePage}
					onDuplicate={handleDuplicatePage}
				/>
			</div>
			<div className="notes-editor-container">
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
					>
						<NoteToolbar />
					</BlockNoteView>
				</div>
			</div>
		</div>
	);
};

export default memo(NotesEditor);
