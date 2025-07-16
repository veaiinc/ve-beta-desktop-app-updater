import React, { useEffect } from 'react';
import NoteToolbar from './NoteToolbar';
import SlashMenu from './SlashMenu';
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteSchema, defaultBlockSpecs } from '@blocknote/core';
import { ImageBlock } from './ImageComponent';
import Database from './Database';

const Editor = ({
	innerContainerStyle,
	myAccess,
	isDeleted,
	customSendMessage,
	aiResonse,
	resetAiResponse,
	noteId,
}) => {
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

	return (
		<BlockNoteView
			editor={editor}
			formattingToolbar={false}
			// onChange={onChange}
			style={innerContainerStyle || {}}
			theme={'dark'}
			editable={myAccess !== 'view' || !isDeleted}
			slashMenu={false}
		>
			{(myAccess !== 'view' || !isDeleted) && (
				<NoteToolbar
					sendMessage={customSendMessage}
					aiResonse={aiResonse}
					resetAiResponse={resetAiResponse}
				/>
			)}
			<SlashMenu editor={editor} noteId={noteId} />
		</BlockNoteView>
	);
};

export default Editor;
