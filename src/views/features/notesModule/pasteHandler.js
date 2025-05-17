export const pasteHandler = ({ event, editor, defaultPasteHandler }) => {
	try {
		const text = event.clipboardData.getData('text/plain');
		const html = event.clipboardData.getData('text/html');
		const lines = text.split('\n').filter((line) => line.trim());
		if (!lines.length) return defaultPasteHandler({ pasteBehavior: 'prefer-markdown' });

		// Extract text and background colors from HTML
		const textColors = {};
		const backgroundColors = {};
		if (html) {
			const doc = new DOMParser().parseFromString(html, 'text/html');
			doc.querySelectorAll('[data-text-color], [data-background-color]').forEach((el) => {
				const textContent = el.textContent.trim();
				if (textContent) {
					const textColor = el.getAttribute('data-text-color');
					const bgColor = el.getAttribute('data-background-color');
					if (textColor) textColors[textContent] = textColor;
					if (bgColor) backgroundColors[textContent] = bgColor;
				}
			});
		}

		// Block type definitions
		const blockTypes = [
			{
				regex: /^\s*([-*+]\s*)?(\[\]|\[\s*\]|\[x\])\s+/,
				type: 'task',
				clean: (line, match) => ({
					content: line.replace(match[0], '').trim(),
					props: { checked: /\[x\]/i.test(line) },
				}),
			},
			{
				regex: /^\s*([-*+])\s+/,
				type: 'bulletListItem',
				clean: (line, match) => ({ content: line.replace(match[0], '').trim() }),
			},
			{
				regex: /^\s*[0-9]+\.\s+/,
				type: 'numberedListItem',
				clean: (line, match) => ({ content: line.replace(match[0], '').trim() }),
			},
			{
				regex: /^\s*#+/,
				type: 'heading',
				clean: (line, match) => ({
					content: line.replace(match[0], '').trim(),
					props: { level: Math.min(match[0].length, 6) },
				}),
			},
		];

		// Helper to get block at cursor
		const getBlockAtCursor = () => {
			const cursorPos = editor.getTextCursorPosition();
			if (!cursorPos?.block) return null;
			const block = editor.getBlock(cursorPos.block.id);
			return block &&
				['paragraph', 'heading', 'bulletListItem', 'numberedListItem'].includes(block.type)
				? { block, cursorOffset: cursorPos.startOffset || 0 }
				: null;
		};

		// Normalize text for matching
		const normalizeText = (text) => text.replace(/\s+/g, ' ').trim();

		// Check if plain text
		const isPlainText = lines.every(
			(line) => !blockTypes.some(({ regex }) => regex.test(line)),
		);

		// Handle single-line or plain text multi-line paste
		if (lines.length === 1 || isPlainText) {
			const cursorInfo = getBlockAtCursor();
			if (!cursorInfo) return defaultPasteHandler({ pasteBehavior: 'prefer-markdown' });

			const { block, cursorOffset } = cursorInfo;
			const currentContent = typeof block.content === 'string' ? block.content || '' : '';

			if (lines.length === 1) {
				const trimmedLine = lines[0].trim();
				const blockType = blockTypes.find(({ regex }) => regex.test(lines[0]));
				const textColor =
					textColors[
						Object.keys(textColors).find(
							(key) => normalizeText(key) === normalizeText(trimmedLine),
						)
					] || null;
				const bgColor =
					backgroundColors[
						Object.keys(backgroundColors).find(
							(key) => normalizeText(key) === normalizeText(trimmedLine),
						)
					] || null;

				if (blockType && block.type === 'paragraph' && !currentContent.trim()) {
					// Replace empty paragraph with the list block
					const newBlock = {
						type: blockType.type,
						...blockType.clean(lines[0], lines[0].match(blockType.regex)),
					};
					if (textColor || bgColor) {
						newBlock.props = {
							...newBlock.props,
							...(textColor && { textColor }),
							...(bgColor && { backgroundColor: bgColor }),
						};
					}
					editor.updateBlock(block.id, newBlock);
				} else if (blockType) {
					// Insert list block after current block
					const newBlock = {
						type: blockType.type,
						...blockType.clean(lines[0], lines[0].match(blockType.regex)),
					};
					if (textColor || bgColor) {
						newBlock.props = {
							...newBlock.props,
							...(textColor && { textColor }),
							...(bgColor && { backgroundColor: bgColor }),
						};
					}
					editor.insertBlocks([newBlock], block.id, 'after');
				} else {
					// Update current block with plain text
					const newContent =
						currentContent.slice(0, cursorOffset) +
						trimmedLine +
						currentContent.slice(cursorOffset);
					const styles = {};
					if (textColor) styles.textColor = textColor;
					if (bgColor) styles.backgroundColor = bgColor;
					editor.updateBlock(block.id, {
						...block,
						content: Object.keys(styles).length
							? [{ type: 'text', text: newContent, styles }]
							: newContent,
					});
				}
			} else {
				const firstLine = lines[0].trim();
				const textColor =
					textColors[
						Object.keys(textColors).find(
							(key) => normalizeText(key) === normalizeText(firstLine),
						)
					] || null;
				const bgColor =
					backgroundColors[
						Object.keys(backgroundColors).find(
							(key) => normalizeText(key) === normalizeText(firstLine),
						)
					] || null;
				const firstBlockType = blockTypes.find(({ regex }) => regex.test(lines[0]));

				if (firstBlockType && block.type === 'paragraph' && !currentContent.trim()) {
					// Replace empty paragraph with the first list block
					const newBlock = {
						type: firstBlockType.type,
						...firstBlockType.clean(lines[0], lines[0].match(firstBlockType.regex)),
					};
					if (textColor || bgColor) {
						newBlock.props = {
							...newBlock.props,
							...(textColor && { textColor }),
							...(bgColor && { backgroundColor: bgColor }),
						};
					}
					editor.updateBlock(block.id, newBlock);
				} else {
					// Update current block with first line
					const updatedContent =
						currentContent.slice(0, cursorOffset) +
						firstLine +
						currentContent.slice(cursorOffset);
					const styles = {};
					if (textColor) styles.textColor = textColor;
					if (bgColor) styles.backgroundColor = bgColor;
					editor.updateBlock(block.id, {
						...block,
						content: Object.keys(styles).length
							? [{ type: 'text', text: updatedContent, styles }]
							: updatedContent,
					});
				}

				// Insert remaining lines
				const remainingBlocks = lines
					.slice(1)
					.filter((line) => line.trim())
					.map((line) => {
						const trimmedLine = line.trim();
						const blockTextColor =
							textColors[
								Object.keys(textColors).find(
									(key) => normalizeText(key) === normalizeText(trimmedLine),
								)
							] || null;
						const blockBgColor =
							backgroundColors[
								Object.keys(backgroundColors).find(
									(key) => normalizeText(key) === normalizeText(trimmedLine),
								)
							] || null;
						const blockStyles = {};
						if (blockTextColor) blockStyles.textColor = blockTextColor;
						if (blockBgColor) blockStyles.backgroundColor = blockBgColor;
						return {
							type: 'paragraph',
							content: Object.keys(blockStyles).length
								? [{ type: 'text', text: trimmedLine, styles: blockStyles }]
								: trimmedLine,
						};
					});

				if (remainingBlocks.length) editor.insertBlocks(remainingBlocks, block.id, 'after');
			}
			event.preventDefault();
			return true;
		}

		// Handle structured multi-line paste
		const parsedLines = lines
			.map((line) => {
				const trimmedLine = line.trim();
				if (!trimmedLine) return null;
				const indentLevel = Math.floor((line.match(/^\s*/) || [''])[0].length / 2);
				const textColor =
					textColors[
						Object.keys(textColors).find(
							(key) => normalizeText(key) === normalizeText(trimmedLine),
						)
					] || null;
				const bgColor =
					backgroundColors[
						Object.keys(backgroundColors).find(
							(key) => normalizeText(key) === normalizeText(trimmedLine),
						)
					] || null;
				return { line, indentLevel, trimmedLine, textColor, bgColor };
			})
			.filter(Boolean);

		const blocks = [];
		const stack = [{ children: blocks, indentLevel: -1 }];

		parsedLines.forEach(({ line, indentLevel, trimmedLine, textColor, bgColor }) => {
			const blockType = blockTypes.find(({ regex }) => regex.test(line));
			const block = blockType
				? { type: blockType.type, ...blockType.clean(line, line.match(blockType.regex)) }
				: { type: 'paragraph', content: trimmedLine };

			if (textColor || bgColor) {
				if (block.type === 'task' || block.type === 'heading') {
					block.props = {
						...block.props,
						...(textColor && { textColor }),
						...(bgColor && { backgroundColor: bgColor }),
					};
				} else {
					const styles = {};
					if (textColor) styles.textColor = textColor;
					if (bgColor) styles.backgroundColor = bgColor;
					block.content = [{ type: 'text', text: block.content, styles }];
				}
			}

			while (stack.length > 1 && stack[stack.length - 1].indentLevel >= indentLevel)
				stack.pop();

			if (block.type === 'bulletListItem') block.children = [];
			stack[stack.length - 1].children.push(block);
			if (block.type === 'bulletListItem')
				stack.push({ children: block.children, indentLevel });
		});

		if (!blocks.length) return defaultPasteHandler({ pasteBehavior: 'prefer-markdown' });

		// Determine target block for insertion
		const cursorInfo = getBlockAtCursor();
		let targetBlockId = cursorInfo?.block?.id || editor.getSelection()?.blocks[0];
		if (!targetBlockId || !editor.getBlock(targetBlockId)) {
			targetBlockId =
				editor.topLevelBlocks
					.slice()
					.reverse()
					.find((b) => b.content || b.type !== 'paragraph')?.id || null;
		}

		// Replace current block if it's an empty paragraph and the first block is a list
		if (
			cursorInfo &&
			blocks.length &&
			['task', 'bulletListItem', 'numberedListItem'].includes(blocks[0].type) &&
			cursorInfo.block.type === 'paragraph' &&
			!cursorInfo.block.content?.toString().trim()
		) {
			editor.updateBlock(cursorInfo.block.id, blocks[0]);
			if (blocks.length > 1) {
				editor.insertBlocks(blocks.slice(1), cursorInfo.block.id, 'after');
			}
		} else {
			editor.insertBlocks(blocks, targetBlockId, 'after');
		}

		// Clean up empty paragraph blocks
		const cleanEmptyBlocks = () => {
			for (let attempts = 0; attempts < 3; attempts++) {
				const emptyBlocks = editor.topLevelBlocks
					.filter(
						(b) =>
							b.type === 'paragraph' &&
							!b.content &&
							(!b.children || !b.children.length),
					)
					.map((b) => b.id);
				if (!emptyBlocks.length) break;
				try {
					editor.removeBlocks(emptyBlocks);
				} catch (err) {
					console.warn('Failed to remove empty blocks:', err);
				}
			}
		};
		cleanEmptyBlocks();

		event.preventDefault();
		return true;
	} catch (error) {
		console.warn('Paste handler error:', error);
		return defaultPasteHandler({ pasteBehavior: 'prefer-markdown' });
	}
};
