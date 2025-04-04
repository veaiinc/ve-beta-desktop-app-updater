import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
// import { createBlock } from '@blocknote/core';
import '@blocknote/mantine/style.css';
import { useCreateBlockNote } from '@blocknote/react';
import '../../../assets/scss/notes/noteComponent.scss';
import { createBlockSpec, locales } from '@blocknote/core';
import NoteToolbar from './NoteToolbar';
import { useEffect, memo, useContext, useCallback, useState } from 'react';
import Context from '../../../context/context';

const NoteComponent = ({
	initialContent = '',
	customOnChange = null,
	outerContainerStyle = {},
	innerContainerStyle = {},
	editable = true,
	loopOn,
	noteId,
	setNoteId,
}) => {
	const {
		documentPreview: { noteContent },
		notes: { createNotesList, saveNotesdata },
	} = useContext(Context);
	const editor = useCreateBlockNote();

	const [info, setInfo] = useState({
		timeouts: {},
	});

	useEffect(() => {
		// if (!noteId) {
		handleNewNotes();
		// }
	}, []);

	useEffect(() => {
		if (initialContent) {
			loadNotesContent(initialContent);
		}
	}, [initialContent]);

	const handleNewNotes = async () => {
		const payload = {
			input: {
				title: 'New Note',
			},
		};
		setInfo((prev) => ({ ...prev, creatingNoteLoader: true }));
		const response = await createNotesList(payload);
		if (response?.[1]?._id) {
			const newNoteId = response[1]?._id;
			setNoteId(newNoteId);
			if (editor?.document?.length) {
				handleContentChange(editor.document, newNoteId);
			}
		}
	};

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

	const handleDebounce = useCallback(
		(key, callback, delay = 500) => {
			clearTimeout(info.timeouts[key]);
			const timeout = setTimeout(callback, delay);
			setInfo((prev) => ({
				...prev,
				timeouts: { ...prev.timeouts, [key]: timeout },
			}));
		},
		[info.timeouts],
	);

	const handleContentChange = useCallback(
		(data, currentNoteId) => {
			handleDebounce('content', () => {
				const payload = {
					pageId: currentNoteId || noteId,
					blocks: data || [],
				};
				saveNotesdata(payload);
			});
		},
		[noteId, handleDebounce],
	);

	const onChange = async () => {
		if (noteId && editor?.document?.length) {
			handleContentChange(editor.document, noteId);
		}
	};

	// Renders the editor instance using a React component.
	return (
		<div className="notes-container" style={outerContainerStyle}>
			<div className="notes-editor-container" style={innerContainerStyle}>
				<div className="notes-editor-wrapper">
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
			</div>
		</div>
	);
};

export default memo(NoteComponent);
