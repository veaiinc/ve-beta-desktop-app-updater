import { useBlockNoteEditor, useComponentsContext } from '@blocknote/react';
import '@blocknote/mantine/style.css';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Tooltip } from 'antd';
import '../../../assets/scss/notes/askAiButton.scss';
import { ReactComponent as ArrowSvg } from '../../../assets/svg/file/arrow.svg';
import { ReactComponent as LensSvg } from '../../../assets/svg/notes/lens.svg';
import { ReactComponent as VeSvg } from '../../../assets/svg/ve.svg';
import useChatStream from '../../hooks/useChatStream';
import Spinner from '../loaders/Spinner';

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

export const AskAiButton = memo(({ sendMessage, aiResonse, resetAiResponse }) => {
	const editor = useBlockNoteEditor();
	const [info, setInfo] = useState({
		isOpen: false,
		isLoading: false,
	});

	const Components = useComponentsContext();
	const selectionRef = useRef(null);
	const selectedTextRef = useRef(null);

	useEffect(() => {
		saveSelection();
	}, []);

	useEffect(() => {
		if (aiResonse) {
			setInfo((prevInfo) => ({ ...prevInfo, isLoading: false }));
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

	const handleAiQuery = useCallback(
		(query) => {
			const aiQuery = `"${selectedTextRef?.current}" ${query}`;
			setInfo((prevInfo) => ({ ...prevInfo, isLoading: true }));
			sendMessage(aiQuery);
		},
		[selectedTextRef?.current],
	);

	const replaceBlock = async (response) => {
		const markdownText = response.replace(/\\n/g, '\n');
		const blocksFromMarkdown = await editor.tryParseMarkdownToBlocks(markdownText);
		const blockIdentifiers = selectionRef?.current?.blocks?.map((item) => item?.id);
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
				title={<AskAiDropdown handleAiQuery={handleAiQuery} isLoading={info?.isLoading} />}
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

const AskAiDropdown = memo(({ handleAiQuery, isLoading }) => {
	const [info, setInfo] = useState({ input: '' });

	const handleInfoChange = (data) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...data }));
	};

	const handleOptionClick = (option) => {
		handleInfoChange({ input: option?.label });
		handleAiQuery(option?.value);
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
					readOnly={isLoading}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							handleAiQuery(info?.input);
						}
					}}
				/>

				<button
					className="ask-ai-input-button"
					onClick={() => handleAiQuery(info?.input)}
					disabled={isLoading}
				>
					{isLoading ? <Spinner width={'20px'} height={'20px'} /> : <ArrowSvg />}
				</button>
			</div>
			{!isLoading ? (
				<div className="suggested-actions-dropdown">
					<div className="suggested-heading">Suggested</div>
					<div className="suggested-body-wrapper">
						{dropDownOptions?.map((item, index) => (
							<div
								className="suggested-list-item"
								onClick={() => handleOptionClick(item)}
								key={index}
							>
								{item?.label}
							</div>
						))}
					</div>
				</div>
			) : null}
		</div>
	);
});
