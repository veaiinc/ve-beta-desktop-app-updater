export const pasteHandler = ({ event, editor, defaultPasteHandler }) => {
	try {
		// Prevent default paste behavior
		event.preventDefault();
		event.stopPropagation();

		const text = event.clipboardData.getData('text/plain');
		const lines = text.split('\n').filter((line) => line.trim());
		if (!lines.length) {
			return false;
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

		// Parse Markdown inline formatting
		const parseMarkdownInline = (text) => {
			if (!text || typeof text !== 'string') {
				return [{ type: 'text', text: '', styles: {} }];
			}

			// Skip inline parsing for task-like lines
			if (/^\s*([-*+]\s*)?(\[\s*\]|\[x\])\s*/.test(text)) {
				return [{ type: 'text', text: text, styles: {} }];
			}

			const segments = [];
			let currentText = text;
			let lastIndex = 0;

			const boldRegex = /(?:\*\*|__)([^\s][^\n]*?[^\s])(?:\*\*|__)/g;
			const italicRegex = /(\*)([^\s*][^\n]*?[^\s*])\1|(_)([^\s_][^\n]*?[^\s_])\3/g;

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

			matches.sort((a, b) => {
				if (a.start === b.start) {
					return a.type === 'bold' ? -1 : 1;
				}
				return a.start - b.start;
			});

			for (const { type, text: matchedText, start, end } of matches) {
				if (lastIndex < start) {
					segments.push({
						type: 'text',
						text: currentText.slice(lastIndex, start),
						styles: {},
					});
				}
				segments.push({
					type: 'text',
					text: matchedText,
					styles: type === 'bold' ? { bold: true } : { italic: true },
				});
				lastIndex = end;
			}

			if (lastIndex < currentText.length) {
				segments.push({ type: 'text', text: currentText.slice(lastIndex), styles: {} });
			}

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

			return mergedSegments.length > 0
				? mergedSegments.map((seg) => ({
						type: 'text',
						text: seg.text,
						styles: seg.styles,
				  }))
				: [{ type: 'text', text: text, styles: {} }];
		};

		// Process lines into blocks with nesting
		const blocks = [];
		const stack = [{ indent: -1, children: blocks }];

		lines.forEach((line) => {
			if (!line.trim()) return;

			// Check for task pattern first
			const taskMatch = line.match(/^(\s*([-*+]\s*)?(\[\s*\]|\[x\])\s*)(.*)$/);
			if (taskMatch) {
				const content = parseMarkdownInline(taskMatch[4].trim() || '');
				const block = {
					type: 'checkListItem',
					content: content,
					props: {
						checked: /\[x\]/i.test(line),
						textColor: 'black',
						backgroundColor: 'transparent',
						textAlignment: 'left',
					},
					children: [],
				};
				stack[stack.length - 1].children.push(block);
				return;
			}

			// Check other block types
			const blockType = blockTypes.find(({ regex }) => regex.test(line));
			if (!blockType) {
				const block = {
					type: 'paragraph',
					content: parseMarkdownInline(line.trim()),
					props: {
						textColor: 'black',
						backgroundColor: 'transparent',
						textAlignment: 'left',
					},
					children: [],
				};
				stack[stack.length - 1].children.push(block);
				return;
			}

			const match = line.match(blockType.regex);
			const cleaned = blockType.clean(line, match);
			const indent = blockType.type === 'bulletListItem' ? cleaned.indent : 0;
			const block = {
				type: blockType.type,
				content: parseMarkdownInline(cleaned.content),
				props: cleaned.props,
				children: [],
			};

			// Adjust stack based on indent
			while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
				stack.pop();
			}
			stack[stack.length - 1].children.push(block);
			if (blockType.type === 'bulletListItem') {
				stack.push({ indent, children: block.children });
			}
		});

		if (!blocks.length) {
			return false;
		}

		// Insert blocks
		try {
			// Get cursor position
			let targetBlockId = null;
			try {
				const cursorInfo = editor.getTextCursorPosition();
				targetBlockId = cursorInfo?.block?.id;
			} catch (err) {
				console.error('Error getting cursor position:', err);
			}

			if (!targetBlockId || !editor.getBlock(targetBlockId)) {
				targetBlockId =
					editor.topLevelBlocks
						.slice()
						.reverse()
						.find((b) => b.content || b.type !== 'paragraph')?.id || null;
			}

			// Insert all blocks
			if (targetBlockId) {
				editor.insertBlocks(blocks, targetBlockId, 'after');
			} else {
				editor.insertBlocks(blocks, null, 'before');
			}
		} catch (err) {
			console.error('Error inserting blocks:', err);
			return false;
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
					console.error('Failed to remove empty blocks:', err);
				}
			}
		};
		cleanEmptyBlocks();

		return true;
	} catch (error) {
		console.error('Paste handler error:', error);
		return false;
	}
};
