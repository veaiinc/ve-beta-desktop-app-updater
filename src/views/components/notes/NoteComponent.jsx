import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
// import { createBlock } from '@blocknote/core';
import '@blocknote/mantine/style.css';
import { useCreateBlockNote } from '@blocknote/react';
import '../../../assets/scss/notes/noteComponent.scss';
import { locales } from '@blocknote/core';

const content = [
	{
		id: '437ddacc-fe2a-4f0a-89b1-27bad7088ad2',
		type: 'paragraph',
		props: {
			textColor: 'default',
			backgroundColor: 'default',
			textAlignment: 'left',
		},
		content: [
			{
				type: 'text',
				text: 'New page',
				styles: {},
			},
		],
		children: [],
	},
	{
		id: '1c6f0227-6d08-4c44-9ada-a9a5bee0abfc',
		type: 'paragraph',
		props: {
			textColor: 'default',
			backgroundColor: 'default',
			textAlignment: 'left',
		},
		content: [],
		children: [],
	},
];

const NoteComponent = ({
	initialContent = content,
	customOnChange = null,
	outerContainerStyle = {},
	innerContainerStyle = {},
	editable = true,
}) => {
	// Creates a new editor instance.
	const editor = useCreateBlockNote({
		initialContent: initialContent,
	});

	const saveContent = () => {
		const content = editor.document; // Get editor content as JSON
		console.log(content);
	};

	// Renders the editor instance using a React component.
	return (
		<div className="notes-container" style={outerContainerStyle}>
			<BlockNoteView
				editor={editor}
				onChange={customOnChange ? customOnChange : saveContent}
				style={innerContainerStyle}
				editable={editable}
			/>
		</div>
	);
};

export default NoteComponent;
