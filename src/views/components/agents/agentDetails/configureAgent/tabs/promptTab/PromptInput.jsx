import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import { useCreateBlockNote } from '@blocknote/react';
import s from './promptInput.module.scss';
import { useEffect, memo, useContext, useCallback, useState } from 'react';
import NoteToolbar from '../../../../../notes/NoteToolbar';

const PromptInput = ({ onInputChange, initialContent = '' }) => {
	const editor = useCreateBlockNote();

	useEffect(() => {
		if (initialContent) {
			loadInitialContent();
		}
	}, [initialContent]);

	const loadInitialContent = async () => {
		const blocks = await editor?.tryParseMarkdownToBlocks(initialContent);
		editor?.replaceBlocks(editor?.document, blocks);
	};
	const handleContentChange = async () => {
		const markdown = await editor?.blocksToMarkdownLossy(editor?.document);
		onInputChange(markdown);
	};

	return (
		<div className={s.promptInputContainer}>
			<BlockNoteView
				editor={editor}
				formattingToolbar={false}
				onChange={handleContentChange}
				editable={true}
			>
				<NoteToolbar />
			</BlockNoteView>
		</div>
	);
};

export default memo(PromptInput);
