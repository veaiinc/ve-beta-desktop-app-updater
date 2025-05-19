export const pasteHandler = ({ event, editor, defaultPasteHandler }) => {
	try {
		const text = event.clipboardData.getData('text/plain');
		const html = event.clipboardData.getData('text/html');
		const lines = text.split('\n').filter((line) => line.trim());
		if (!lines.length) return defaultPasteHandler({ pasteBehavior: 'prefer-markdown' });

		// Extract text, background colors, and inline styles from HTML
		const textColors = {};
		const backgroundColors = {};
		const inlineStyles = {};
		let tableData = null;
		if (html) {
			const doc = new DOMParser().parseFromString(html, 'text/html');
			// Process all elements for colors and inline styles
			const processNode = (node, styles = {}) => {
				if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
					const textContent = node.textContent.trim();
					inlineStyles[textContent] = { ...inlineStyles[textContent], ...styles };
				} else if (node.nodeType === Node.ELEMENT_NODE) {
					const newStyles = { ...styles };
					const tag = node.tagName.toLowerCase();
					if (['strong', 'b'].includes(tag)) newStyles.bold = true;
					if (['em', 'i'].includes(tag)) newStyles.italic = true;
					if (node.getAttribute('data-text-color'))
						textColors[node.textContent.trim()] = node.getAttribute('data-text-color');
					if (node.getAttribute('data-background-color'))
						backgroundColors[node.textContent.trim()] =
							node.getAttribute('data-background-color');
					Array.from(node.childNodes).forEach((child) => processNode(child, newStyles));
				}
			};
			Array.from(doc.body.childNodes).forEach((node) => processNode(node));
			// Detect HTML table structure
			const table = doc.querySelector('table');
			if (table) {
				tableData = { rows: [] };
				table.querySelectorAll('tr').forEach((row) => {
					const cells = [];
					row.querySelectorAll('td, th').forEach((cell) => {
						const cellText = cell.textContent.trim();
						const cellStyles = { ...inlineStyles[cellText] };
						const textColor =
							cell.getAttribute('data-text-color') || textColors[cellText] || null;
						const bgColor =
							cell.getAttribute('data-background-color') ||
							backgroundColors[cellText] ||
							null;
						if (textColor) cellStyles.textColor = textColor;
						if (bgColor) cellStyles.backgroundColor = bgColor;
						cells.push({
							content: parseMarkdownInline(cellText),
							props: Object.keys(cellStyles).length ? cellStyles : undefined,
						});
					});
					if (cells.length) tableData.rows.push({ cells });
				});
			}
		}

		// Parse Markdown inline formatting
		const parseMarkdownInline = (text) => {
			if (!text || typeof text !== 'string') return text;

			const segments = [];
			let currentText = text;
			let lastIndex = 0;

			// Match bold (**text**, __text__) and italic (*text*, _text_)
			const boldRegex = /(?:\*\*|__)([^\s][^\n]*?[^\s])(?:\*\*|__)/g;
			const italicRegex = /(\*)([^\s*][^\n]*?[^\s*])\1|(_)([^\s_][^\n]*?[^\s_])\3/g;

			// Collect all matches
			const matches = [];
			let match;
			while ((match = boldRegex.exec(currentText)) !== null) {
				matches.push({
					type: 'bold',
					text: match[1],
					start: match.index,
					end: match.index + match[0].length,
				});
			}
			while ((match = italicRegex.exec(currentText)) !== null) {
				const matchedText = match[2] || match[4];
				const start = match.index;
				const end = match.index + match[0].length;
				// Only include italic match if it doesn't overlap with a bold match
				const overlapsBold = matches.some(
					(m) => m.type === 'bold' && m.start <= start && m.end >= end,
				);
				if (!overlapsBold) {
					matches.push({
						type: 'italic',
						text: matchedText,
						start,
						end,
					});
				}
			}

			// Sort matches by start index and prioritize bold over italic
			matches.sort((a, b) => {
				if (a.start === b.start) {
					return a.type === 'bold' ? -1 : 1; // Bold takes precedence
				}
				return a.start - b.start;
			});

			// Process matches
			for (const { type, text: matchedText, start, end } of matches) {
				// Add plain text before the match
				if (lastIndex < start) {
					segments.push({
						type: 'text',
						text: currentText.slice(lastIndex, start),
						styles: {},
					});
				}
				// Add formatted text
				segments.push({
					type: 'text',
					text: matchedText,
					styles: type === 'bold' ? { bold: true } : { italic: true },
				});
				lastIndex = end;
			}

			// Add remaining plain text
			if (lastIndex < currentText.length) {
				segments.push({ type: 'text', text: currentText.slice(lastIndex), styles: {} });
			}

			// Merge adjacent segments with the same styles
			const mergedSegments = [];
			let currentSegment = null;
			for (const segment of segments) {
				if (!segment.text) continue;
				if (!currentSegment) {
					currentSegment = { ...segment };
				} else if (
					JSON.stringify(currentSegment.styles) === JSON.stringify(segment.styles)
				) {
					currentSegment.text += segment.text;
				} else {
					mergedSegments.push(currentSegment);
					currentSegment = { ...segment };
				}
			}
			if (currentSegment?.text) mergedSegments.push(currentSegment);

			// Return rich text array or plain text
			return mergedSegments.length > 1 || Object.keys(mergedSegments[0]?.styles || {}).length
				? mergedSegments.map((seg) => ({
						type: 'text',
						text: seg.text,
						styles: seg.styles,
				  }))
				: mergedSegments[0]?.text || text;
		};

		// Parse Markdown table from plain text
		const parseMarkdownTable = (lines) => {
			if (lines.length < 2) return null;
			const isTableLike = lines[0].includes('|') && lines[1].match(/^\s*\|?[\s\-:|]+\|?\s*$/);
			if (!isTableLike) return null;

			const rows = [];
			for (const line of lines) {
				if (line.match(/^\s*\|?[\s\-:|]+\|?\s*$/)) continue;
				const cells = line
					.split('|')
					.map((cell) => cell.trim())
					.filter((cell) => cell.length > 0);
				if (cells.length === 0) continue;
				const cellData = cells.map((cellText) => {
					const textColor = textColors[cellText] || null;
					const bgColor = backgroundColors[cellText] || null;
					const inline = inlineStyles[cellText] || {};
					const cellStyles = { ...inline };
					if (textColor) cellStyles.textColor = textColor;
					if (bgColor) cellStyles.backgroundColor = bgColor;
					return {
						content: parseMarkdownInline(cellText),
						props: Object.keys(cellStyles).length ? cellStyles : undefined,
					};
				});
				rows.push({ cells: cellData });
			}
			return rows.length > 0 ? { rows } : null;
		};

		// Check for Markdown table
		if (!tableData) {
			tableData = parseMarkdownTable(lines);
		}

		// Block type definitions
		const blockTypes = [
			{
				regex: /^(\s*([-*+]\s*)?(\[\s*\]|\[x\])\s*)(.*)$/,
				type: 'checkListItem',
				clean: (line, match) => ({
					content: match[4].trim() || '',
					props: {
						checked: /\[x\]/i.test(line),
						textColor: 'black', // Explicit color
						backgroundColor: 'transparent', // Explicit background
						textAlignment: 'left',
					},
				}),
			},
			{
				regex: /^(\s*)([-*+])\s+([^\[\]\n]*)$/,
				type: 'bulletListItem',
				clean: (line, match) => ({
					indent: match[1].length / 2, // 2 spaces per indent level
					content: match[3].trim() || '',
					props: {
						textColor: 'black',
						backgroundColor: 'transparent',
						textAlignment: 'left',
					},
				}),
			},
			{
				regex: /^(\s*[0-9]+\.\s+)(.+)$/,
				type: 'numberedListItem',
				clean: (line, match) => ({
					content: match[2].trim() || '',
					props: {
						textColor: 'black',
						backgroundColor: 'transparent',
						textAlignment: 'left',
					},
				}),
			},
			{
				regex: /^(\s*(#+)\s*)(.*)$/,
				type: 'heading',
				clean: (line, match) => ({
					content: match[3].trim() || '',
					props: {
						level: Math.min(match[2].length, 6),
						textColor: 'black',
						backgroundColor: 'transparent',
						textAlignment: 'left',
					},
				}),
			},
		];

		// Helper to get block at cursor
		const getBlockAtCursor = () => {
			const cursorPos = editor.getTextCursorPosition();
			if (!cursorPos?.block) return null;
			const block = editor.getBlock(cursorPos.block.id);
			return block &&
				['paragraph', 'heading', 'bulletListItem', 'numberedListItem', 'table'].includes(
					block.type,
				)
				? { block, cursorOffset: cursorPos.startOffset || 0 }
				: null;
		};

		// Normalize text for matching
		const normalizeText = (text) => text.replace(/\s+/g, ' ').trim();

		// Handle table paste if detected
		if (tableData && tableData.rows.length) {
			const cursorInfo = getBlockAtCursor();
			let targetBlockId = cursorInfo?.block?.id || editor.getSelection()?.blocks[0];
			if (!targetBlockId || !editor.getBlock(targetBlockId)) {
				targetBlockId =
					editor.topLevelBlocks
						.slice()
						.reverse()
						.find((b) => b.content || b.type !== 'paragraph')?.id || null;
			}

			const tableBlock = {
				type: 'table',
				content: tableData,
			};

			if (
				cursorInfo &&
				cursorInfo.block.type === 'paragraph' &&
				!cursorInfo.block.content?.toString().trim()
			) {
				editor.updateBlock(cursorInfo.block.id, tableBlock);
			} else {
				editor.insertBlocks([tableBlock], targetBlockId, 'after');
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
						console.err('Failed to remove empty blocks:', err);
					}
				}
			};
			cleanEmptyBlocks();

			event.preventDefault();
			return true;
		}

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
				const inline = inlineStyles[trimmedLine] || {};

				if (blockType && block.type === 'paragraph' && !currentContent.trim()) {
					const newBlock = {
						type: blockType.type,
						...blockType.clean(lines[0], lines[0].match(blockType.regex)),
					};
					newBlock.content = parseMarkdownInline(newBlock.content);
					if (textColor || bgColor || inline.bold || inline.italic) {
						newBlock.props = {
							...newBlock.props,
							...(textColor && { textColor }),
							...(bgColor && { backgroundColor: bgColor }),
						};
					}
					editor.updateBlock(block.id, newBlock);
				} else if (blockType) {
					const newBlock = {
						type: blockType.type,
						...blockType.clean(lines[0], lines[0].match(blockType.regex)),
					};
					newBlock.content = parseMarkdownInline(newBlock.content);
					if (textColor || bgColor || inline.bold || inline.italic) {
						newBlock.props = {
							...newBlock.props,
							...(textColor && { textColor }),
							...(bgColor && { backgroundColor: bgColor }),
						};
					}
					editor.insertBlocks([newBlock], block.id, 'after');
				} else {
					const content = parseMarkdownInline(trimmedLine);
					const styles = { ...inline };
					if (textColor) styles.textColor = textColor;
					if (bgColor) styles.backgroundColor = bgColor;
					const finalContent =
						typeof content === 'string' && Object.keys(styles).length
							? [{ type: 'text', text: content, styles }]
							: content;
					editor.updateBlock(block.id, {
						...block,
						content: Array.isArray(finalContent)
							? finalContent
							: currentContent.slice(0, cursorOffset) +
							  finalContent +
							  currentContent.slice(cursorOffset),
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
				const inline = inlineStyles[firstLine] || {};
				const firstBlockType = blockTypes.find(({ regex }) => regex.test(lines[0]));

				if (firstBlockType && block.type === 'paragraph' && !currentContent.trim()) {
					const newBlock = {
						type: firstBlockType.type,
						...firstBlockType.clean(lines[0], lines[0].match(firstBlockType.regex)),
					};
					newBlock.content = parseMarkdownInline(newBlock.content);
					if (textColor || bgColor || inline.bold || inline.italic) {
						newBlock.props = {
							...newBlock.props,
							...(textColor && { textColor }),
							...(bgColor && { backgroundColor: bgColor }),
						};
					}
					editor.updateBlock(block.id, newBlock);
				} else {
					const content = parseMarkdownInline(firstLine);
					const styles = { ...inline };
					if (textColor) styles.textColor = textColor;
					if (bgColor) styles.backgroundColor = bgColor;
					const finalContent =
						typeof content === 'string' && Object.keys(styles).length
							? [{ type: 'text', text: content, styles }]
							: content;
					editor.updateBlock(block.id, {
						...block,
						content: Array.isArray(finalContent)
							? finalContent
							: currentContent.slice(0, cursorOffset) +
							  finalContent +
							  currentContent.slice(cursorOffset),
					});
				}

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
						const blockInline = inlineStyles[trimmedLine] || {};
						const content = parseMarkdownInline(trimmedLine);
						const blockStyles = { ...blockInline };
						if (blockTextColor) blockStyles.textColor = blockTextColor;
						if (blockBgColor) blockStyles.backgroundColor = blockBgColor;
						return {
							type: 'paragraph',
							content:
								Object.keys(blockStyles).length && typeof content === 'string'
									? [{ type: 'text', text: content, styles: blockStyles }]
									: content,
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
				const inline = inlineStyles[trimmedLine] || {};
				return { line, indentLevel, trimmedLine, textColor, bgColor, inline };
			})
			.filter(Boolean);

		const blocks = [];
		const stack = [{ children: blocks, indentLevel: -1 }];

		parsedLines.forEach(({ line, indentLevel, trimmedLine, textColor, bgColor, inline }) => {
			const blockType = blockTypes.find(({ regex }) => regex.test(line));
			const block = blockType
				? { type: blockType.type, ...blockType.clean(line, line.match(blockType.regex)) }
				: { type: 'paragraph', content: trimmedLine };

			block.content = parseMarkdownInline(block.content);
			if (textColor || bgColor || inline.bold || inline.italic) {
				if (block.type === 'task' || block.type === 'heading') {
					block.props = {
						...block.props,
						...(textColor && { textColor }),
						...(bgColor && { backgroundColor: bgColor }),
					};
				} else if (typeof block.content === 'string') {
					const styles = { ...inline };
					if (textColor) styles.textColor = textColor;
					if (bgColor) styles.backgroundColor = bgColor;
					if (Object.keys(styles).length) {
						block.content = [{ type: 'text', text: block.content, styles }];
					}
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

		const cursorInfo = getBlockAtCursor();
		let targetBlockId = cursorInfo?.block?.id || editor.getSelection()?.blocks[0];
		if (!targetBlockId || !editor.getBlock(targetBlockId)) {
			targetBlockId =
				editor.topLevelBlocks
					.slice()
					.reverse()
					.find((b) => b.content || b.type !== 'paragraph')?.id || null;
		}

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
					console.err('Failed to remove empty blocks:', err);
				}
			}
		};
		cleanEmptyBlocks();

		event.preventDefault();
		return true;
	} catch (error) {
		console.err('Paste handler error:', error);
		return defaultPasteHandler({ pasteBehavior: 'prefer-markdown' });
	}
};
