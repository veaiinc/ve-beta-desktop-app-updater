import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
// import { createBlock } from '@blocknote/core';
import '@blocknote/mantine/style.css';
import { useCreateBlockNote } from '@blocknote/react';
import '../../../assets/scss/notes/noteComponent.scss';
import { createBlockSpec, locales } from '@blocknote/core';
import NoteToolbar from './NoteToolbar';
import { useEffect, memo, useContext, useCallback } from 'react';
import Context from '../../../context/context';

const NoteComponent = ({
	initialContent = '',
	customOnChange = null,
	outerContainerStyle = {},
	innerContainerStyle = {},
	editable = true,
	loopOn,
}) => {
	const {
		documentPreview: { noteContent },
	} = useContext(Context);
	const editor = useCreateBlockNote();

	useEffect(() => {
		if (initialContent) {
			loadNotesContent(initialContent);
		}
	}, [initialContent]);

	const loadNotesContent = useCallback(
		async (data) => {
			const preprocessMarkdown = (markdown) => {
				return markdown?.replace(/\\n/g, '\n'); // Add a non-breaking space for empty lines
			};

			if (!loopOn) {
				const blocks = await editor.tryParseMarkdownToBlocks(
					preprocessMarkdown(data?.message || ''),
				);

				editor.replaceBlocks(editor.document, blocks);
			} else {
				let blocks = [];
				const messageId = noteContent?.messageId;
				let currentIndex = -1;
				for (let i = data?.length - 1; i >= 0; i--) {
					if (data?.[i]?.type === 'AI' && data?.[i]?.messageId === messageId) {
						currentIndex = i;
						break;
					}
				}

				if (currentIndex === -1) {
					return;
				}
				data = data?.slice(currentIndex);
				data = data?.filter((ele) => ele?.type === 'AI' && ele?.contentType !== 'loading');
				for (let i = 0; i < data?.length; i++) {
					let subBlocks = await editor.tryParseMarkdownToBlocks(
						preprocessMarkdown(data?.[i]?.message || ''),
					);
					//adding empty spaces
					let subBlocks2 = await editor.tryParseMarkdownToBlocks(
						preprocessMarkdown('\n\n\n\n\n\n\n'),
					);
					let finalBlocks = subBlocks.concat(subBlocks2);
					blocks = blocks.concat(finalBlocks);
				}
				editor.replaceBlocks(editor.document, blocks);
			}
		},
		[editor, loopOn],
	);

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
