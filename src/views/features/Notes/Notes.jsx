import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
// import { createBlock } from '@blocknote/core';
import '@blocknote/mantine/style.css';
import { useCreateBlockNote } from '@blocknote/react';
import '../../../assets/scss/notes/noteComponent.scss';
import { createBlockSpec, locales } from '@blocknote/core';
import NoteToolbar from '../../components/notes/NoteToolbar';
import { useEffect, memo, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';

const NotesEditor = ({ outerContainerStyle, innerContainerStyle }) => {
	const editor = useCreateBlockNote();

	const { noteId } = useParams();

	useEffect(() => {
		if (noteId) {
			//call the getPage Api
		}
	}, [noteId]);

	const onChange = async () => {
		const markdown = await editor.blocksToMarkdownLossy(editor.document);
	};

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
