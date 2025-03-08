import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
// import { createBlock } from '@blocknote/core';
import '@blocknote/mantine/style.css';
import {
	useCreateBlockNote,
	getDefaultReactSlashMenuItems,
	SuggestionMenuController,
} from '@blocknote/react';
import '../../../assets/scss/notes/noteComponent.scss';
import { BlockNoteEditor, locales, filterSuggestionItems } from '@blocknote/core';
import NoteToolbar from './NoteToolbar';
import { useEffect, memo, useContext } from 'react';
import Context from '../../../context/context';
import { HiOutlineGlobeAlt } from 'react-icons/hi';

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

	const editor = useCreateBlockNote();

	useEffect(() => {
		async function loadInitialHTML() {
			const preprocessMarkdown = (markdown) => {
				return markdown?.replace(/\n{2,}/g, '\n\n&nbsp;\n\n'); // Add a non-breaking space for empty lines
			};

			const blocks = await editor.tryParseMarkdownToBlocks(preprocessMarkdown(noteContent));
			editor.replaceBlocks(editor.document, blocks);
		}

		if (noteContent?.length) loadInitialHTML();
	}, [noteContent]);

	const onChange = async () => {
		const markdown = await editor.blocksToMarkdownLossy(editor.document);
	};

	const insertHelloWorldItem = (editor) => ({
		title: 'Insert Hello World',
		onItemClick: () => {
			const currentBlock = editor.getTextCursorPosition().block;
			const helloWorldBlock = {
				type: 'paragraph',
				content: [{ type: 'text', text: 'Hello World', styles: { bold: true } }],
			};
			editor.replaceBlocks([currentBlock], [helloWorldBlock]);
		},
		aliases: ['helloworld', 'hw'],
		group: 'Other',
		icon: <HiOutlineGlobeAlt size={18} />,
		subtext: "Used to insert a block with 'Hello World' below.",
	});

	const getCustomSlashMenuItems = (editor) => [
		...getDefaultReactSlashMenuItems(editor),
		insertHelloWorldItem(editor),
	];

	return (
		<div className="notes-container" style={outerContainerStyle}>
			<BlockNoteView
				editor={editor}
				formattingToolbar={false}
				onChange={customOnChange ? customOnChange : onChange}
				style={innerContainerStyle}
				editable={editable}
				slashMenu={false}
			>
				<SuggestionMenuController
					triggerCharacter={'/'}
					// Replaces the default Slash Menu items with our custom ones.
					getItems={async (query) =>
						filterSuggestionItems(getCustomSlashMenuItems(editor), query)
					}
				/>
				<NoteToolbar />
			</BlockNoteView>
		</div>
	);
};

export default memo(NoteComponent);
