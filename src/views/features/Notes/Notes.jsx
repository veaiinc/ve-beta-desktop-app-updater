import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
// import { createBlock } from '@blocknote/core';
import '@blocknote/mantine/style.css';
import { useCreateBlockNote } from '@blocknote/react';
import '../../../assets/scss/notes/noteComponent.scss';
import { createBlockSpec, locales } from '@blocknote/core';
import NoteToolbar from '../../components/notes/NoteToolbar';
import ShareComponent from '../../components/notes/ShareComponent';
import { useEffect, memo, useContext, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import Context from '../../../context/context';
import moment from 'moment';
import CustomTextArea from '../../components/globalComponents/CustomTextArea';
import MoreOptions from '../../components/notes/MoreOptions';
import { StarSvg } from '../../../assets/svg/notes/Star';
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
		},
	} = useContext(Context);
	const editor = useCreateBlockNote();
	const [info, setInfo] = useState({
		timeout: null,
		titleTimeout: null,
		title: '',
		updatedAt: '',
		notesConfigs: {
			smallText: false,
			fullWidth: false,
		},
		isFavorite: false,
	});

	const { noteId } = useParams();

	useEffect(() => {
		if (noteId) {
			getNotesPageDataFunc();
		}
	}, [noteId]);

	useEffect(() => {
		if (notesPageData) {
			const { blocks = [], title = '', updatedAt = '' } = notesPageData || {};
			if (blocks) {
				loadNotesContent(blocks);
			}
			setInfo((prev) => ({ ...prev, title, updatedAt }));
		}
	}, [notesPageData]);

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

	const onChange = async () => {
		if (editor?.document?.length) {
			handleDebounce(editor.document);
		}
	};

	const handleDebounce = useCallback(
		(data) => {
			clearInterval(info?.timeout);
			const timeout = setTimeout(() => {
				const payload = {
					pageId: noteId,
					blocks: data || [],
				};
				saveNotesdata(payload);
				setInfo((prev) => ({ ...prev, updatedAt: moment().unix() }));
			}, 500);
			setInfo((prev) => ({ ...prev, timeout }));
		},
		[info, noteId],
	);

	const handleTitleChange = (e) => {
		setInfo((prev) => ({ ...prev, title: e?.target?.value }));
		clearTimeout(info?.titleTimeout);
		const titleTimeout = setTimeout(() => {
			updatePage({
				pageId: noteId,
				input: {
					title: e?.target?.value,
				},
			});
			setInfo((prev) => ({ ...prev, updatedAt: moment().unix() }));
		}, 500);

		setInfo((prev) => ({ ...prev, titleTimeout }));
	};

	const handleFavorite = async (value) => {
		const payload = {
			pageId: noteId,
		};
		if (value) {
			const [success, data] = await addToFavorite(payload);
			if (success) {
				setInfo((prev) => ({ ...prev, isFavorite: true }));
			}
		} else {
			const [success, data] = await removeFromFavorite(payload);
			if (success) {
				setInfo((prev) => ({ ...prev, isFavorite: false }));
			}
		}
	};

	return (
		<div className="notes-container" style={outerContainerStyle || {}}>
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
				<MoreOptions notesConfigs={info?.notesConfigs} onChange={() => {}} />
			</div>
			<div className="notes-editor-container">
				<div className="notes-editor-wrapper">
					<CustomTextArea
						className="notes-title"
						value={info?.title}
						onChange={handleTitleChange}
						autoResize={true}
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
