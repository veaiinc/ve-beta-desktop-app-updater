import { useState, useEffect, memo } from 'react';
import { useBlockNoteEditor, useComponentsContext } from '@blocknote/react';
import '../../../assets/scss/notes/alignButton.scss';
import { ReactComponent as LeftAlignIcon } from '../../../assets/svg/notes/leftAlign.svg';
import { ReactComponent as RightAlignIcon } from '../../../assets/svg/notes/rightAlign.svg';
import { ReactComponent as CenterAlignIcon } from '../../../assets/svg/notes/centerAlign.svg';
import { Tooltip } from 'antd';

const alignmentOptions = [
	{ value: 'left', icon: <LeftAlignIcon />, label: 'Align Left' },
	{ value: 'center', icon: <CenterAlignIcon />, label: 'Align Center' },
	{ value: 'right', icon: <RightAlignIcon />, label: 'Align Right' },
];

const AlignButton = () => {
	const editor = useBlockNoteEditor();
	const Components = useComponentsContext();

	const [info, setInfo] = useState({
		isOpen: false,
		isImageBlock: false,
		currentAlignment: 'left',
	});

	const handleStateUpdate = (data) => {
		setInfo((prevInfo) => ({
			...prevInfo,
			...data,
		}));
	};

	useEffect(() => {
		const selection = editor.getSelection();
		const blocks =
			selection && selection.blocks.length > 0
				? selection.blocks
				: [editor.getTextCursorPosition().block];

		if (blocks.length > 0) {
			const alignment = blocks[0].props?.textAlignment || 'left';
			handleStateUpdate({ currentAlignment: alignment });
		}
		handleStateUpdate({ isImageBlock: selection === undefined });
	}, [editor]);

	const applyAlignment = (alignment) => {
		const selection = editor.getSelection();
		const blocks =
			selection && selection.blocks.length > 0
				? selection.blocks
				: [editor.getTextCursorPosition().block];

		blocks.forEach((block) => {
			editor.updateBlock(block.id, {
				props: {
					...block.props,
					textAlignment: alignment,
				},
			});
		});
		handleStateUpdate({ isOpen: false, currentAlignment: alignment });
	};

	const currentIcon = alignmentOptions.find((opt) => opt.value === info?.currentAlignment)
		?.icon || <LeftAlignIcon />;

	return (
		<>
			<span
				className="bn-divider"
				style={{ display: info?.isImageBlock ? 'none' : 'flex' }}
			/>
			<div className="align-button">
				<Tooltip
					open={info?.isOpen}
					title={
						<div className="alignment-tooltip">
							{alignmentOptions.map((option, index) => (
								<button
									className="alignment-item"
									onClick={() => applyAlignment(option?.value)}
									key={index}
								>
									{option?.icon}
								</button>
							))}
						</div>
					}
					placement="bottom"
					trigger="click"
					color="transparent"
					overlayStyle={{ minWidth: 'fit-content' }}
				>
					<Components.FormattingToolbar.Button
						mainTooltip="Alignment"
						isSelected={false}
						onClick={() => handleStateUpdate({ isOpen: !info?.isOpen })}
					>
						{currentIcon}
					</Components.FormattingToolbar.Button>
				</Tooltip>
			</div>
			<span className="bn-divider" />
		</>
	);
};

export default memo(AlignButton);
