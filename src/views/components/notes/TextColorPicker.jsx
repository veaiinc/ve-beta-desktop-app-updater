import {
	useBlockNoteEditor,
	useComponentsContext,
	useEditorContentOrSelectionChange,
} from '@blocknote/react';
import '@blocknote/mantine/style.css';
import { useState } from 'react';
import { Tooltip } from 'antd';

// Custom Formatting Toolbar Button to toggle blue text & background color.
export function TextColorPicker() {
	const editor = useBlockNoteEditor();

	const Components = useComponentsContext();

	// Tracks whether the text & background are both blue.
	const [isSelected, setIsSelected] = useState(
		editor.getActiveStyles().textColor === 'blue' &&
			editor.getActiveStyles().backgroundColor === 'blue',
	);

	// Updates state on content or selection change.
	useEditorContentOrSelectionChange(() => {
		setIsSelected(
			editor.getActiveStyles().textColor === 'blue',
			//  &&
			// 	editor.getActiveStyles().backgroundColor === 'blue',
		);
	}, editor);

	return (
		<Tooltip title="Blue Text & Background" placement="bottom">
			<Components.FormattingToolbar.Button
				mainTooltip={'Blue Text & Background'}
				onClick={() => {
					editor.toggleStyles({
						textColor: 'blue',
						// backgroundColor: 'blue',
					});
				}}
				isSelected={isSelected}
			>
				Blue
			</Components.FormattingToolbar.Button>
		</Tooltip>
	);
}
