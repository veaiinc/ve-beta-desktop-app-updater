import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
// import { createBlock } from '@blocknote/core';
import '@blocknote/mantine/style.css';
import { useCreateBlockNote } from '@blocknote/react';
import '../../../assets/scss/notes/noteComponent.scss';
import { locales } from '@blocknote/core';
import NoteToolbar from './NoteToolbar';
import { useEffect, memo } from 'react';

const NoteComponent = ({
	initialContent = '',
	customOnChange = null,
	outerContainerStyle = {},
	innerContainerStyle = {},
}) => {
	// Creates a new editor instance.
	const editor = useCreateBlockNote();

	useEffect(() => {
		async function loadInitialHTML() {
			const preprocessMarkdown = (markdown) => {
				return markdown?.replace(/\n{2,}/g, '\n\n&nbsp;\n\n'); // Add a non-breaking space for empty lines
			};

			const blocks = await editor.tryParseMarkdownToBlocks(
				preprocessMarkdown(initialContent),
			);
			editor.replaceBlocks(editor.document, blocks);
		}

		if (initialContent?.length) loadInitialHTML();
	}, [initialContent]);

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
			>
				<NoteToolbar />
			</BlockNoteView>
		</div>
	);
};

export default memo(NoteComponent);
