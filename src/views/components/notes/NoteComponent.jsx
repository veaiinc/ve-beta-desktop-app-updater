import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
// import { createBlock } from '@blocknote/core';
import '@blocknote/mantine/style.css';
import { useCreateBlockNote } from '@blocknote/react';
import '../../../assets/scss/notes/noteComponent.scss';
import { locales } from '@blocknote/core';
import NoteToolbar from './NoteToolbar';
import { useEffect, memo, useContext } from 'react';
import Context from '../../../context/context';

const NoteComponent = ({
	initialContent = '',
	customOnChange = null,
	outerContainerStyle = {},
	innerContainerStyle = {},
	editable = true,
}) => {
	let {
		documentPreview: { noteContent },
	} = useContext(Context);
	// Creates a new editor instance.
	const editor = useCreateBlockNote();

	useEffect(() => {
		async function loadInitialHTML() {
			const preprocessMarkdown = (markdown) => {
				return markdown?.replace(/\\n/g, '\n'); // Add a non-breaking space for empty lines
			};

			const blocks = await editor.tryParseMarkdownToBlocks(preprocessMarkdown(noteContent));
			editor.replaceBlocks(editor.document, blocks);
		}

		if (noteContent?.length) loadInitialHTML();
	}, [noteContent]);

	const onChange = async () => {
		// Converts the editor's contents from Block objects to Markdown and store to state.
		const markdown = await editor.blocksToMarkdownLossy(editor.document);
		// console.log(markdown);
	};

	// Renders the editor instance using a React component.
	return (
		<div className="notes-container" style={outerContainerStyle}>
			<BlockNoteView
				editor={editor}
				formattingToolbar={false}
				onChange={customOnChange ? customOnChange : onChange}
				style={innerContainerStyle}
				editable={editable}
			>
				<NoteToolbar />
			</BlockNoteView>
		</div>
	);
};

export default memo(NoteComponent);
