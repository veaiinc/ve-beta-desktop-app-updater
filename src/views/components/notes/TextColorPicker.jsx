import { useState, useRef, useEffect } from 'react';
import { useBlockNoteEditor, useComponentsContext } from '@blocknote/react';
import '../../../assets/scss/notes/textColorPicker.scss';

const TextColorPicker = () => {
	const editor = useBlockNoteEditor();
	const Components = useComponentsContext();

	const [showColorPicker, setShowColorPicker] = useState(false);
	const [selectedColor, setSelectedColor] = useState(null);
	const [selectedBgColor, setSelectedBgColor] = useState(null);

	const colorOptions = [
		'default',
		'gray',
		'brown',
		'red',
		'orange',
		'yellow',
		'green',
		'blue',
		'purple',
		'pink',
	];

	useEffect(() => {
		const activeStyles = editor?.getActiveStyles();
		setSelectedColor(activeStyles?.textColor || 'default');
		setSelectedBgColor(activeStyles?.backgroundColor || 'default');
	}, [editor]);

	const toggleColorPicker = (e) => {
		e.preventDefault();
		setShowColorPicker(!showColorPicker);
	};

	const applyColor = (color) => {
		if (editor) {
			editor.toggleStyles({ textColor: color == 'default' ? '' : color });
			setSelectedColor(color);
		}
	};

	const applyBgColor = (color) => {
		if (editor) {
			editor.toggleStyles({ backgroundColor: color == 'default' ? '' : color });
			setSelectedBgColor(color);
		}
	};

	return (
		<div className="bn-toolbar-item bn-color-picker-wrapper bn-text-color-picker">
			<Components.FormattingToolbar.Button
				mainTooltip={'Color'}
				onClick={toggleColorPicker}
				isSelected={showColorPicker}
			>
				<div
					className="color-round"
					style={{
						backgroundColor:
							selectedBgColor == 'default' ? 'var(--card)' : selectedBgColor,
						width: '14px',
						height: '14px',
						borderRadius: '50%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<span
						className="round-text"
						style={{
							color:
								selectedColor === 'default' ? 'var(--primary-font)' : selectedColor,
							fontSize: '8px',
						}}
					>
						A
					</span>
				</div>
			</Components.FormattingToolbar.Button>

			{showColorPicker && (
				<div className="bn-text-color-picker-popover" onClick={(e) => e.stopPropagation()}>
					<div className="title-wrapper">Text Colour</div>
					<div className="colors-wrapper">
						{colorOptions.map((color) => (
							<div
								className={`color-item ${selectedColor === color ? 'active' : ''}`}
								key={color}
								onMouseDown={(e) => {
									e.preventDefault();
									e.stopPropagation(); // Prevent selection loss
									applyColor(color);
								}}
							>
								<span
									style={{
										color: color == 'default' ? 'var(--primary-font)' : color,
									}}
								>
									A
								</span>
							</div>
						))}
					</div>
					<div className="title-wrapper">Background Colour</div>
					<div className="colors-wrapper">
						{colorOptions.map((color) => (
							<div
								className={`color-item ${
									selectedBgColor === color ? 'active' : ''
								}`}
								key={color}
								onMouseDown={(e) => {
									e.preventDefault();
									e.stopPropagation(); // Prevent selection loss
									applyBgColor(color);
								}}
								style={{
									borderColor: color == 'default' ? 'var(--stroke)' : color,
								}}
							>
								<div
									className="inner-item"
									style={{
										backgroundColor: color == 'default' ? '' : color,
									}}
								/>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default TextColorPicker;
