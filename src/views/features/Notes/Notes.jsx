import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
// import { createBlock } from '@blocknote/core';
import '@blocknote/mantine/style.css';
import { useCreateBlockNote } from '@blocknote/react';
import '../../../assets/scss/notes/noteComponent.scss';
import { createBlockSpec, locales } from '@blocknote/core';
import NoteToolbar from '../../components/notes/NoteToolbar';
import { useEffect, memo, useContext, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import Context from '../../../context/context';

const preprocessMarkdown = (markdown) => {
	return markdown?.replace(/\\n/g, '\n'); // Add a non-breaking space for empty lines
};

const NotesEditor = ({ outerContainerStyle, innerContainerStyle }) => {
	const {
		notes: { getNotesPageData, notesPageData, saveNotesdata },
	} = useContext(Context);
	const editor = useCreateBlockNote();
	const [info, setInfo] = useState({
		timeout: null,
	});

	const { noteId } = useParams();

	useEffect(() => {
		if (noteId) {
			getNotesPageDataFunc();
		}
	}, [noteId]);

	useEffect(() => {
		if (notesPageData) {
			const { blocks = [] } = notesPageData || {};
			if (blocks?.length) {
				loadNotesContent(blocks);
			}
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
			}, 500);
			setInfo((prev) => ({ ...prev, timeout }));
		},
		[info, noteId],
	);

	return (
		<div className="notes-container" style={outerContainerStyle || {}}>
			<BlockNoteView
				editor={editor}
				formattingToolbar={false}
				onChange={onChange}
				style={innerContainerStyle || {}}
			>
				<NoteToolbar />
			</BlockNoteView>
		</div>
	);
};

export default memo(NotesEditor);
