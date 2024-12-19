import React, { memo } from 'react';
import '../../../assets/scss/notes/index.scss';
import { EditorProvider, FloatingMenu, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

// define your extension array
const extensions = [StarterKit];
const Notes = () => {
	const content = '<p>Hello World!</p>';

	return (
		<div className="notesParentContainer">
			<EditorProvider extensions={extensions} content={content}>
				<FloatingMenu editor={null}>This is the floating menu</FloatingMenu>
				<BubbleMenu editor={null}>This is the bubble menu</BubbleMenu>
			</EditorProvider>
		</div>
	);
};

export default memo(Notes);

// src/Tiptap.tsx
