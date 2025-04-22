import {
	useBlockNoteEditor,
	useComponentsContext,
	useEditorContentOrSelectionChange,
} from '@blocknote/react';
import '@blocknote/mantine/style.css';
import { memo, useEffect, useRef, useState } from 'react';
import { Tooltip } from 'antd';
import '../../../assets/scss/notes/askAiButton.scss';
import { ReactComponent as ArrowSvg } from '../../../assets/svg/file/arrow.svg';
import { ReactComponent as LensSvg } from '../../../assets/svg/notes/lens.svg';
import { ReactComponent as VeSvg } from '../../../assets/svg/ve.svg';
import useChatStream from '../../hooks/useChatStream';

const buttonStyle = {
	display: 'flex',
	alignItems: 'center',
	gap: '6px',
};

const dropDownOptions = [
	{
		label: 'Improve writing',
		value: 'improve writing of the given text',
	},
	{
		label: 'Shorten',
		value: 'shorten the given text',
	},
	{
		label: 'Lengthen',
		value: 'lengthen the given text',
	},
];

// function extractTextFromBlocks(blocks) {
// 	let result = [];

// 	for (const block of blocks) {
// 		if (block.type === 'paragraph' || block.type === 'heading') {
// 			// Normal block with inline content
// 			const text = block.content.map((item) => item.text).join('');
// 			result.push(text);
// 		} else if (block.type === 'table' && block.content?.rows) {
// 			// Table block: iterate through each row/cell
// 			for (const row of block.content.rows) {
// 				for (const cell of row.cells) {
// 					const cellText = cell.map((item) => item.text).join('');
// 					result.push(cellText);
// 				}
// 			}
// 		} else if (block.type === 'listItem') {
// 			// List block
// 			const listText = block.content.map((item) => item.text).join('');
// 			result.push(listText);
// 		} else {
// 			// Any other block type with potential content
// 			if (Array.isArray(block.content)) {
// 				const text = block.content.map((item) => item.text).join('');
// 				result.push(text);
// 			}
// 		}

// 		// Recursively handle children (e.g., nested blocks)
// 		if (block.children && block.children.length > 0) {
// 			result.push(...extractTextFromBlocks(block.children));
// 		}
// 	}

// 	return result;
// }

export const AskAiButton = memo(({ sendMessage, aiResonse, resetAiResponse }) => {
	const editor = useBlockNoteEditor();
	const [info, setInfo] = useState({
		isOpen: false,
	});

	const Components = useComponentsContext();
	const selectionRef = useRef(null);
	const selectedTextRef = useRef(null);

	useEffect(() => {
		saveSelection();
	}, []);

	useEffect(() => {
		if (aiResonse) {
			replaceBlock(aiResonse);
		}
	}, [aiResonse]);

	const saveSelection = () => {
		selectionRef.current = editor.getSelection();
		selectedTextRef.current = editor.getSelectedText();
	};

	const handleDropdown = (value) => {
		setInfo((prevInfo) => ({ ...prevInfo, isOpen: value }));
	};

	const handleAiQuery = (query) => {
		sendMessage({
			date: [],
			deep_research: false,
			knowledge_base_search: false,
			modules: [],
			query: `"${selectedTextRef?.current}" ${query}`,
			timezone: 'Asia/Calcutta',
			web_search: true,
		});
	};

	const replaceBlock = async (response) => {
		const markdownText = response.replace(/\\n/g, '\n');
		const blocksFromMarkdown = await editor.tryParseMarkdownToBlocks(markdownText);
		console.log('blockmd', blocksFromMarkdown);

		const blockIdentifiers = selectionRef?.current?.blocks?.map((item) => item?.id);
		console.log(blockIdentifiers);

		editor.replaceBlocks(blockIdentifiers, blocksFromMarkdown);
		resetAiResponse();
	};

	return (
		<Components.FormattingToolbar.Button
			mainTooltip={'Ask AI'}
			onClick={() => handleDropdown(!info?.isOpen)}
		>
			<Tooltip
				open={info?.isOpen}
				title={<AskAiDropdown handleAiQuery={handleAiQuery} />}
				placement="bottomLeft"
				trigger="click"
				color="transparent"
			>
				<span style={buttonStyle}>
					Ask <VeSvg height={16} width={16} />
				</span>
			</Tooltip>
		</Components.FormattingToolbar.Button>
	);
});

const AskAiDropdown = memo(({ handleAiQuery }) => {
	const [info, setInfo] = useState({ input: '' });

	const handleInfoChange = (data) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...data }));
	};

	return (
		<div
			className="ask-ai-dropdown-container"
			onMouseDown={(e) => {
				// Allow focusing inputs, but prevent editor selection loss
				if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
					e.preventDefault();
				}
			}} // key line: prevents blur
			onClick={(e) => e.stopPropagation()}
		>
			<div className="ask-anything-input-wrapper">
				<LensSvg />
				<input
					type="text"
					placeholder="Ask Anything!"
					value={info?.input}
					onChange={(e) => handleInfoChange({ input: e?.target?.value })}
				/>
				<button className="ask-ai-input-button" onClick={() => handleAiQuery(info?.input)}>
					<ArrowSvg />
				</button>
			</div>
			<div className="suggested-actions-dropdown">
				<div className="suggested-heading">Suggested</div>
				<div className="suggested-body-wrapper">
					{dropDownOptions?.map((item, index) => (
						<div
							className="suggested-list-item"
							onClick={() => handleAiQuery(item?.value)}
							key={index}
						>
							{item?.label}
						</div>
					))}
				</div>
			</div>
		</div>
	);
});
