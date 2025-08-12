import { createContext, useCallback, useEffect, useRef, memo } from 'react';
import '@blocknote/core/fonts/inter.css';
// import { createBlock } from '@blocknote/core';
import '@blocknote/mantine/style.css';
import NoteToolbar from './NoteToolbar';
import SlashMenu from './SlashMenu';
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteSchema, defaultBlockSpecs, defaultInlineContentSpecs } from '@blocknote/core';
import { ImageBlock } from './ImageComponent';
import { Database } from './Database';
import { ActionInline } from './ActionComponent';
import ObjectID from 'bson-objectid';
import { isEqual } from 'lodash';
import '../../../assets/scss/notes/editor.scss';
import ActionsMenu from './ActionsMenu';

export const EditorContext = createContext(null);

const Editor = ({
	innerContainerStyle,
	myAccess,
	isDeleted,
	customSendMessage,
	aiResonse,
	resetAiResponse,
	noteId,
	initialBlocks,
	createBlock = () => {},
	updateBlock = () => {},
	deleteBlock = () => {},
	markdown = false,
	customBlockData,
	onMarkdownChange = () => {},
}) => {
	const pendingUpdatesRef = useRef(new Map());
	const previousBlocksRef = useRef(new Map());
	const blockIdToBackendIdRef = useRef(new Map());
	const debounceTimerRef = useRef(null);

	const schema = BlockNoteSchema.create({
		blockSpecs: {
			// Adds all default blocks.
			...defaultBlockSpecs,
			// Adds the Alert block.
			image: ImageBlock,
			database: Database,
		},
		inlineContentSpecs: {
			...defaultInlineContentSpecs,
			action: ActionInline, // ✅ inline spec goes here
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

	// useEffect(() => {
	// 	const notesContainer = document.querySelector('.notes-container');
	// 	const handleKeyDown = (e) => {
	// 		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
	// 			const selected = editor?.getSelectedText()?.length > 0 || false;
	// 			if (selected) {
	// 				e.stopPropagation();
	// 				return;
	// 			}
	// 		}
	// 	};

	// 	notesContainer.addEventListener('keydown', handleKeyDown);
	// 	return () => notesContainer.removeEventListener('keydown', handleKeyDown);
	// }, []);

	useEffect(() => {
		const unsubscribe = editor.onChange(() => {
			const currentBlocks = editor.document;

			// Check for blocks exceeding depth limit
			const blocksToRevert = [];

			const checkDepth = (blocks, currentDepth = 0) => {
				blocks.forEach((block) => {
					if (currentDepth > 3) {
						// 0, 1, 2 = 3 levels max
						blocksToRevert.push(block.id);
					}
					if (block.children && block.children.length > 0) {
						checkDepth(block.children, currentDepth + 1);
					}
				});
			};

			checkDepth(currentBlocks);

			// Revert blocks that are too deep
			if (blocksToRevert.length > 0) {
				blocksToRevert.forEach((blockId) => {
					editor.removeBlocks([blockId]);
				});
				return; // Don't call onEditorUpdate for invalid changes
			}
			if (markdown) {
				(async () => {
					const markdown = await editor.blocksToMarkdownLossy(editor.document);
					const regex = /!\[#tool@([^\]]+)\]\([^)]+\)([^\s]+)/g;

					const fixedMarkdown = markdown.replace(
						regex,
						(match, toolName, trailingText) => {
							return `<${toolName}>`;
						},
					);
					onMarkdownChange(fixedMarkdown);
				})();
			}
			onEditorUpdate(currentBlocks);
		});

		return () => unsubscribe();
	}, [editor]);

	useEffect(() => {
		if (initialBlocks) {
			(async () => {
				let blocks = initialBlocks?.data;
				if (markdown) {
					const replaced = blocks
						.replace(/\\n/g, '\n')
						.replace(/<([^>]+)>/g, (_, inside) => {
							// "inside" will be gmail-send-mail or notion-create-database
							return `[[action#${inside}]]`;
						});
					blocks = injectCustomBlocks(await editor.tryParseMarkdownToBlocks(replaced));
					// blocks = await editor.tryParseMarkdownToBlocks(replaced);
				}
				const flatBlocks = flattenBlocksFromBackend(blocks); // flatten nested tree
				previousBlocksRef.current = new Map(flatBlocks.map((b) => [b.id, b]));
				loadNotesContent(blocks); // this can still use nested data if needed
			})();
		}
	}, [initialBlocks]);

	function injectCustomBlocks(blocks) {
		return blocks.map((block) => {
			const newContent = [];

			block.content.forEach((item) => {
				if (typeof item.text === 'string') {
					const regex = /\[\[action#([^\]]+)\]\]/g;
					let lastIndex = 0;
					let match;

					while ((match = regex.exec(item.text)) !== null) {
						// Add text before the match
						if (match.index > lastIndex) {
							newContent.push({
								...item,
								text: item.text.slice(lastIndex, match.index),
							});
						}

						// Add our custom inline block
						newContent.push({
							type: 'action',
							props: { action: match[1] },
							content: [],
						});

						lastIndex = regex.lastIndex;
					}

					// Add remaining text after last match
					if (lastIndex < item.text.length) {
						newContent.push({ ...item, text: item.text.slice(lastIndex) });
					}
				} else {
					// Non-text nodes get pushed as-is
					newContent.push(item);
				}
			});

			return {
				...block,
				content: newContent,
			};
		});
	}

	const flattenBlocksFromBackend = (blocks, parentId = null) => {
		const flat = [];

		for (const block of blocks) {
			const { children, ...rest } = block;

			// Store block with parentId info
			flat.push({
				...rest,
				parentId,
				children: [], // Keep children as empty array for consistency
			});

			// Create mapping from BlockNote id to backend _id
			blockIdToBackendIdRef.current.set(block.id, block._id);

			if (children && children.length > 0) {
				flat.push(...flattenBlocksFromBackend(children, block.id));
			}
		}

		return flat;
	};

	const loadNotesContent = useCallback(
		(data) => {
			if (data?.length) {
				queueMicrotask(() => {
					editor.replaceBlocks(editor.document, data);
				});
			}
		},
		[editor],
	);

	const flattenBlocks = (blocks, parentId = null, depth = 0) => {
		const flat = [];

		for (let i = 0; i < blocks.length; i++) {
			const block = blocks[i];
			flat.push({
				id: block.id,
				type: block.type,
				props: block.props,
				content: block.content,
				children: block.children,
				parentId,
				_depth: depth,
			});

			if (block.children?.length) {
				flat.push(...flattenBlocks(block.children, block.id, depth + 1));
			}
		}

		return flat;
	};

	// Helper function to calculate position between two positions
	const calculatePositionBetween = useCallback((pos1, pos2) => {
		return (pos1 + pos2) / 2;
	}, []);

	// Helper function to calculate position after a given position
	const calculatePositionAfter = useCallback((pos) => {
		return pos + 1000; // Use larger increments to avoid precision issues
	}, []);

	// Helper function to calculate position before a given position
	const calculatePositionBefore = useCallback((pos) => {
		return pos / 2; // Use division to get a position before
	}, []);

	const compareFn = (old, newBlock) => {
		const oldBlock = {
			id: old?.id,
			type: old?.type,
			props: old?.props,
			content: old?.content,
			// 🔥 IGNORE: children
		};

		const newBlockFormatted = {
			id: newBlock?.id,
			type: newBlock?.type,
			props: newBlock?.props,
			content: newBlock?.type === 'database' ? [] : newBlock?.content,
		};

		if (oldBlock.type !== newBlockFormatted.type) {
			return true;
		}

		if (oldBlock.type === 'table' && newBlockFormatted.type === 'table') {
			function areArraysEqualCustom(a, b) {
				if (!Array.isArray(a) || !Array.isArray(b)) return false;
				if (a.length !== b.length) return false;

				for (let i = 0; i < a.length; i++) {
					const valA = a[i];
					const valB = b[i];

					const isNullishA = valA == null; // true for null or undefined
					const isNullishB = valB == null;

					if (isNullishA && isNullishB) continue;
					if (valA !== valB) return false;
				}

				return true;
			}
			const { content: oldContent, props: oldProps, id: oldId } = oldBlock;
			const { content: newContent, props: newProps, id: newId } = newBlockFormatted;

			if (oldId !== newId || oldProps?.textColor !== newProps?.textColor) {
				return true;
			}

			if (
				oldContent?.headerCols !== newContent?.headerCols ||
				oldContent?.headerRows !== newContent?.headerRows
			) {
				return true;
			}

			if (!areArraysEqualCustom(oldContent?.columnWidths, newContent?.columnWidths)) {
				return true;
			}

			if (!isEqual(oldContent?.rows, newContent?.rows)) {
				return true;
			}
			return false;
		}
		if (oldBlock.type === 'image' && newBlockFormatted.type === 'image') {
			const { content: oldContent, ...restOld } = oldBlock;
			const { content: newContent, ...restNew } = newBlockFormatted;
			return !isEqual(restOld, restNew);
		}

		const blockUpdated = !isEqual(oldBlock, newBlockFormatted);
		return blockUpdated;
	};

	const diffArraysNested = (flatNewArr) => {
		const newMap = new Map(flatNewArr.map((item, index) => [item.id, { ...item, index }]));

		const deleted = [];
		const added = [];
		const updated = [];

		const allIds = new Set([...previousBlocksRef.current.keys(), ...newMap.keys()]);

		// Group new blocks by parentId
		const groupedByParent = flatNewArr.reduce((acc, block) => {
			const key = block.parentId ?? 'root';
			acc[key] ||= [];
			acc[key].push(block);
			return acc;
		}, {});

		// Sort siblings
		Object.values(groupedByParent).forEach((group) => {
			group.sort((a, b) => a.index - b.index);
		});

		for (const id of allIds) {
			const oldItem = previousBlocksRef.current.get(id); // has _id and position
			const newItem = newMap.get(id); // does not have _id or position

			if (oldItem && !newItem) {
				// Deleted
				deleted.push(oldItem);
				previousBlocksRef.current.delete(id);
				// Remove from mapping
				blockIdToBackendIdRef.current.delete(id);
			} else if (!oldItem && newItem) {
				// Added
				const _id = ObjectID().toString();
				const siblings = groupedByParent[newItem.parentId ?? 'root'];
				const index = siblings.findIndex((b) => b.id === id);

				const prev =
					index > 0 ? previousBlocksRef.current.get(siblings[index - 1]?.id) : null;
				const next =
					index < siblings.length - 1
						? previousBlocksRef.current.get(siblings[index + 1]?.id)
						: null;

				let position;
				if (prev?.position && next?.position) {
					// Between two blocks
					position = calculatePositionBetween(prev.position, next.position);
				} else if (prev?.position) {
					// After the last block
					position = calculatePositionAfter(prev.position);
				} else if (next?.position) {
					// Before the first block
					position = calculatePositionBefore(next.position);
				} else {
					// First block in the group
					position = 1000;
				}

				const parentBackendId = newItem.parentId
					? blockIdToBackendIdRef.current.get(newItem.parentId)
					: null;

				const newBlock = {
					_id,
					id,
					type: newItem.type,
					props: newItem.props,
					content: newItem.content,
					children: [], // Keep children as empty array since we're flattening for comparison
					parentId: parentBackendId,
					position,
				};

				added.push(newBlock);
				previousBlocksRef.current.set(id, newBlock);
				// Update the mapping for new blocks
				blockIdToBackendIdRef.current.set(id, _id);
			} else if (oldItem && newItem) {
				// Possible update
				const siblings = groupedByParent[newItem.parentId ?? 'root'];
				const index = siblings.findIndex((b) => b.id === id);

				let position = oldItem.position;
				let positionChanged = false;

				// Check for content and parent changes
				const contentChanged = compareFn(oldItem, newItem);

				// Compare parentId correctly - oldItem.parentId is _id, newItem.parentId is id
				let parentChanged = false;
				if (oldItem.parentId !== null && newItem.parentId !== null) {
					parentChanged = oldItem.parentId !== newItem.parentId;
				} else {
					// One is null, the other is not
					parentChanged = oldItem.parentId !== newItem.parentId;
				}

				// Always check for position changes (for reordering)
				const prev =
					index > 0 ? previousBlocksRef.current.get(siblings[index - 1]?.id) : null;
				const next =
					index < siblings.length - 1
						? previousBlocksRef.current.get(siblings[index + 1]?.id)
						: null;

				// Check if current position is valid relative to neighbors
				if (prev?.position && next?.position) {
					// Between two blocks - should be between prev and next
					if (position <= prev.position || position >= next.position) {
						position = calculatePositionBetween(prev.position, next.position);
						positionChanged = true;
					}
				} else if (prev?.position) {
					// After the last block - should be after prev
					if (position <= prev.position) {
						position = calculatePositionAfter(prev.position);
						positionChanged = true;
					}
				} else if (next?.position) {
					// Before the first block - should be before next
					if (position >= next.position) {
						position = calculatePositionBefore(next.position);
						positionChanged = true;
					}
				} else {
					// Only block in the group - should be at a reasonable position
					if (position < 1000) {
						position = 1000;
						positionChanged = true;
					}
				}

				const isChanged = positionChanged || contentChanged || parentChanged;

				if (isChanged) {
					const parentBackendId = newItem.parentId
						? blockIdToBackendIdRef.current.get(newItem.parentId)
						: null;

					const updatedBlock = {
						_id: oldItem._id,
						id,
						type: newItem.type,
						props: newItem.props,
						content: newItem.content,
						children: [], // Keep children as empty array since we're flattening for comparison
						parentId: parentBackendId,
						position,
					};

					updated.push(updatedBlock);
					previousBlocksRef.current.set(id, updatedBlock);
				}
			}
		}

		return { added, deleted, updated };
	};

	const queueBlockUpdate = (block, noteId, delay = 500) => {
		pendingUpdatesRef.current.set(block._id, block);

		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}

		debounceTimerRef.current = setTimeout(() => {
			const updatesToSend = Array.from(pendingUpdatesRef.current.values());

			updatesToSend.forEach(({ _id, ...rest }) => {
				updateBlock({
					updateBlockId: _id,
					pageId: noteId,
					input: {
						...rest,
						content:
							rest?.type === 'table'
								? { tableContent: rest?.content }
								: { textContent: rest?.content },
					},
				});
			});

			pendingUpdatesRef.current.clear();
		}, delay);
	};

	const onEditorUpdate = (currentTopLevelBlocks) => {
		const flatNewArr = flattenBlocks(currentTopLevelBlocks);
		const { added, deleted, updated } = diffArraysNested(flatNewArr);

		added.forEach((block) => {
			createBlock({
				pageId: noteId,
				input: {
					...block,
					content:
						block?.type === 'table'
							? { tableContent: block?.content }
							: { textContent: block?.content },
				},
			});
		});

		updated.forEach((block) => {
			queueBlockUpdate(block, noteId);
		});

		deleted.forEach((block) => {
			pendingUpdatesRef.current.delete(block._id);
			deleteBlock({
				pageId: noteId,
				deleteBlockId: block._id,
			});
		});
	};

	return (
		<EditorContext.Provider value={{ previousBlocksRef, pageId: noteId, customBlockData }}>
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
				<ActionsMenu editor={editor} noteId={noteId} />
			</BlockNoteView>
		</EditorContext.Provider>
	);
};

export default memo(Editor);
