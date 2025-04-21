import {
	useBlockNoteEditor,
	useComponentsContext,
	useEditorContentOrSelectionChange,
} from '@blocknote/react';
import '@blocknote/mantine/style.css';
import { memo, useState } from 'react';
import { Tooltip } from 'antd';
import '../../../assets/scss/notes/askAiButton.scss';
import { ReactComponent as ArrowSvg } from '../../../assets/svg/file/arrow.svg';
import { ReactComponent as LensSvg } from '../../../assets/svg/notes/lens.svg';
import { ReactComponent as VeSvg } from '../../../assets/svg/ve.svg';

const buttonStyle = {
	display: 'flex',
	alignItems: 'center',
	gap: '6px',
};

export const AskAiButton = memo(() => {
	const editor = useBlockNoteEditor();
	const [info, setInfo] = useState({
		isOpen: false,
	});
	const [savedSelection, setSavedSelection] = useState(null);

	const Components = useComponentsContext();

	// Track formatting style
	const [isSelected, setIsSelected] = useState(
		editor.getActiveStyles().textColor === 'blue' &&
			editor.getActiveStyles().backgroundColor === 'blue',
	);

	// Sync selected state with editor
	useEditorContentOrSelectionChange(() => {
		setIsSelected(
			editor.getActiveStyles().textColor === 'blue' &&
				editor.getActiveStyles().backgroundColor === 'blue',
		);
	}, editor);

	// Save selection before opening dropdown
	const handleState = (data) => {
		if (data.isOpen && !info.isOpen) {
			const selection = editor._tiptapEditor?.view.state.selection;
			if (selection) {
				setSavedSelection(selection);
			}
		}
		setInfo((prev) => ({ ...prev, ...data }));
	};

	// Restore selection before running AI actions
	const restoreSelection = () => {
		if (savedSelection) {
			const view = editor._tiptapEditor?.view;
			if (view) {
				const tr = view.state.tr.setSelection(savedSelection);
				view.dispatch(tr);
				view.focus();
			}
		}
	};

	return (
		<Components.FormattingToolbar.Button
			mainTooltip={'Ask AI'}
			onClick={() => handleState({ isOpen: !info?.isOpen })}
			isSelected={isSelected}
		>
			<Tooltip
				open={info?.isOpen}
				title={<AskAiDropdown restoreSelection={restoreSelection} />}
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

const AskAiDropdown = memo(({ restoreSelection }) => {
	const handleAsk = () => {
		restoreSelection();
		console.log('Run AI Action Here');
	};

	return (
		<div
			className="ask-ai-dropdown-container"
			onMouseDown={(e) => e.stopPropagation()}
			onClick={(e) => e.stopPropagation()}
		>
			<div className="ask-anything-input-wrapper">
				<LensSvg />
				<input type="text" placeholder="Ask Anything!" />
				<button className="ask-ai-input-button" onClick={handleAsk}>
					<ArrowSvg />
				</button>
			</div>
			<div className="suggested-actions-dropdown">
				<div className="suggested-heading">Suggested</div>
				<div className="suggested-body-wrapper">
					<div className="suggested-list-item" onClick={handleAsk}>
						Improve writing
					</div>
					<div className="suggested-list-item" onClick={handleAsk}>
						Shorten
					</div>
					<div className="suggested-list-item" onClick={handleAsk}>
						Lengthen
					</div>
				</div>
			</div>
		</div>
	);
});
